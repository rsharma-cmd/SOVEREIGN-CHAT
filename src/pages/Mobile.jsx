import { useNavigate } from 'react-router-dom'
import Navbar from '../components/navbar'

const Mobile = () => {
  const navigate = useNavigate()

  return (
    <>
      <Navbar />
      <main className="register-main">

        <div className="step-wrapper">
          <div className="back-arrow" onClick={() => navigate('/register')}>
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

            <div className="step active">
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
          <h2>Mobile Number</h2>
          <p>Please enter your Mobile Number below for completing your second step</p>
          <input type="tel" placeholder="Enter Mobile Number" maxLength="10" />
          <input type="text" placeholder="Enter Mobile Number OTP" />
          <button className="get-started-btn" onClick={() => navigate('/profile')}>
            Get Started
          </button>
        </div>

      </main>
    </>
  )
}

export default Mobile