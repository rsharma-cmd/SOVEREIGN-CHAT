import { useNavigate } from 'react-router-dom'
import Navbar from '../components/navbar'

const Profile = () => {
  const navigate = useNavigate()

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

          <div className="section-title">Personal Details</div>
          <input type="text" placeholder="First Name *" />
          <input type="text" placeholder="Last Name *" />
          <input type="date" />

          <select className="gender-select">
            <option value="" disabled selected>Select Gender *</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>

          <div className="section-title">Create Password</div>
          <input type="password" placeholder="Password *" />
          <input type="password" placeholder="Confirm Password *" />

          <button className="get-started-btn" onClick={() => navigate('/success')}>
            Register
          </button>
        </div>

        <p className="footer-text">
          If you are having any difficulties, please get in touch with us on{' '}
          <a href="#">Sovereign</a>
        </p>

      </main>
    </>
  )
}

export default Profile