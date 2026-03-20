import { useNavigate } from 'react-router-dom'
import Navbar from '../components/navbar'

const Success = () => {
  const navigate = useNavigate()

  return (
    <>
      <Navbar />
      <main className="register-main">

        <div className="register-box success-box">

          <div className="success-icon">
            <i className="pi pi-check"></i>
          </div>

          <h2>Registration Completed</h2>

          <p>Thank you for submitting your details. Your registration has been completed successfully.</p>

          <button className="get-started-btn go-home-btn" onClick={() => navigate('/chat')}>
            Go to home
          </button>

        </div>

      </main>
    </>
  )
}

export default Success