import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { auth } from '../firebase'
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth'
import Navbar from '../components/Navbar'

const Register = () => {
  const navigate = useNavigate()
  const [aadhaar, setAadhaar] = useState('')
  const [otp, setOtp] = useState('')
  const [step, setStep] = useState('aadhaar')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [confirmationResult, setConfirmationResult] = useState(null)

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
        callback: () => {}
      })
    }
  }

  const handleSendOTP = async () => {
    if (aadhaar.length !== 12) {
      setError('Please enter valid 12-digit Aadhaar number')
      return
    }
    setError('')
    setLoading(true)

    try {
      setupRecaptcha()
      // Test number — Firebase mein jo add kiya hai
      const phoneNumber = '+917388558546'
      const result = await signInWithPhoneNumber(auth, phoneNumber, window.recaptchaVerifier)
      setConfirmationResult(result)
      setStep('otp')
      setLoading(false)
    } catch (err) {
      setError('Error sending OTP: ' + err.message)
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear()
        window.recaptchaVerifier = null
      }
      setLoading(false)
    }
  }

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      setError('Please enter 6-digit OTP')
      return
    }
    setError('')
    setLoading(true)

    try {
      await confirmationResult.confirm(otp)
      setLoading(false)
      navigate('/mobile')
    } catch (err) {
      setError('Invalid OTP. Please try again.')
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <div id="recaptcha-container"></div>
      <main className="register-main">

        <div className="step-wrapper">
          <div className="back-arrow" onClick={() => navigate('/')}>
            <i className="pi pi-chevron-left"></i>
          </div>
          <div className="steps-indicator">
            <div className="step active">
              <div className="step-circle">1</div>
              <div className="step-label">Aadhaar<br />Number</div>
            </div>
            <div className="step-line"></div>
            <div className="step">
              <div className="step-circle">2</div>
              <div className="step-label">Mobile<br />Number</div>
            </div>
            <div className="step-line"></div>
            <div className="step">
              <div className="step-circle">3</div>
              <div className="step-label">Create<br />Profile</div>
            </div>
          </div>
        </div>

        <div className="register-box">
          <h2>Aadhaar Number</h2>
          <p>Please enter your Aadhaar Number below for completing your first step</p>

          {error && (
            <div style={{
              background: '#fee2e2',
              color: '#dc2626',
              padding: '10px 14px',
              borderRadius: '8px',
              fontSize: '13px'
            }}>
              {error}
            </div>
          )}

          {step === 'aadhaar' ? (
            <>
              <input
                type="text"
                placeholder="Enter 12-digit Aadhaar Number"
                maxLength="12"
                value={aadhaar}
                onChange={e => setAadhaar(e.target.value.replace(/[^0-9]/g, ''))}
              />
              <button
                className="get-started-btn"
                onClick={handleSendOTP}
                disabled={loading}
              >
                {loading ? 'Sending OTP...' : 'Send OTP'}
              </button>
            </>
          ) : (
            <>
              <p style={{ color: '#2ecc71', fontSize: '13px' }}>
                ✅ OTP sent to your Aadhaar linked mobile number
              </p>
              <input
                type="text"
                placeholder="Enter 6-digit OTP"
                maxLength="6"
                value={otp}
                onChange={e => setOtp(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
              />
              <button
                className="get-started-btn"
                onClick={handleVerifyOTP}
                disabled={loading}
              >
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>
              <button
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#FF8411',
                  cursor: 'pointer',
                  fontSize: '13px'
                }}
                onClick={() => { setStep('aadhaar'); setOtp('') }}
              >
                ← Change Aadhaar Number
              </button>
            </>
          )}
        </div>

      </main>
    </>
  )
}

export default Register