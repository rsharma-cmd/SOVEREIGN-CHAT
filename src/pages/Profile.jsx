import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { auth, db } from '../firebase'
import { doc, setDoc } from 'firebase/firestore'
import Navbar from '../components/Navbar'

const Profile = () => {
  const navigate = useNavigate()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [dob, setDob] = useState('')
  const [gender, setGender] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleRegister = async () => {
    // Validation
    if (!firstName || !lastName || !dob || !gender) {
      setError('Please fill all personal details')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setError('')
    setLoading(true)

    try {
      const user = auth.currentUser
      if (!user) {
        setError('Session expired. Please register again.')
        setLoading(false)
        return
      }

      // Firestore mein user data save karo
      await setDoc(doc(db, 'users', user.uid), {
        firstName,
        lastName,
        dob,
        gender,
        phone: user.phoneNumber,
        createdAt: new Date().toISOString(),
        about: 'Hey there! I am using SovrChats',
        uid: user.uid
      })

      setLoading(false)
      navigate('/success')
    } catch (err) {
      setError('Error saving profile: ' + err.message)
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <main className="register-main">

        <div className="step-wrapper">
          <div className="back-arrow" onClick={() => navigate('/mobile')}>
            <i className="pi pi-chevron-left"></i>
          </div>
          <div className="steps-indicator">
            <div className="step completed">
              <div className="step-circle">
                <i className="pi pi-check"></i>
              </div>
              <div className="step-label">Aadhaar<br />Number</div>
            </div>
            <div className="step-line completed"></div>

            <div className="step completed">
              <div className="step-circle">
                <i className="pi pi-check"></i>
              </div>
              <div className="step-label">Mobile<br />Number</div>
            </div>
            <div className="step-line completed"></div>

            <div className="step active">
              <div className="step-circle">3</div>
              <div className="step-label">Create<br />Profile</div>
            </div>
          </div>
        </div>

        <div className="register-box profile-box">
          <h2>Create Your Profile</h2>
          <p>Please Enter Your Personal Details</p>

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

          <div className="section-title">Personal Details</div>
          <input
            type="text"
            placeholder="First Name *"
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Last Name *"
            value={lastName}
            onChange={e => setLastName(e.target.value)}
          />
          <input
            type="date"
            value={dob}
            onChange={e => setDob(e.target.value)}
          />
          <select
            className="gender-select"
            value={gender}
            onChange={e => setGender(e.target.value)}
          >
            <option value="" disabled>Select Gender *</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>

          <div className="section-title">Create Password</div>
          <input
            type="password"
            placeholder="Password * (min 6 characters)"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirm Password *"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
          />

          <button
            className="get-started-btn"
            onClick={handleRegister}
            disabled={loading}
          >
            {loading ? 'Saving Profile...' : 'Register'}
          </button>
        </div>

        <p className="footer-text">
          If you are having any difficulties, please get in touch with us on{' '}
          <a href="#">SOVREIGN</a>
        </p>

      </main>
    </>
  )
}

export default Profile