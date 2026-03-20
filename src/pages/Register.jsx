import { useNavigate } from 'react-router-dom'
import Navbar from '../components/navbar'

const Register = () => {
  const navigate = useNavigate()

  return (
    <>
      <Navbar />
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
          <input type="text" placeholder="Enter Aadhaar Card Number" maxLength="12" />
          <input type="text" placeholder="Enter Aadhaar OTP" />
          <button className="get-started-btn" onClick={() => navigate('/mobile')}>
            Get Started
          </button>
        </div>

      </main>
    </>
  )
}

export default Register