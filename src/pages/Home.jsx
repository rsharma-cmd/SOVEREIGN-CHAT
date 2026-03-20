import { useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import Navbar from '../components/Navbar'

function Home() {
  const navigate = useNavigate()

  const toggleSteps = () => {
    const content = document.getElementById('steps-content')
    const icon = document.getElementById('steps-icon')
    if (content.style.display === 'none') {
      content.style.display = 'block'
      icon.className = 'pi pi-chevron-up'
    } else {
      content.style.display = 'none'
      icon.className = 'pi pi-chevron-down'
    }
  }

  return (
    <>
      <Navbar />
      <main>
        {/* Left Section */}
        <div className="left-section">
          <div className="hero-badge">🔒 Aadhaar Verified & Secure</div>
          <h1>India's Most <span>Secure</span> Chat App</h1>
          <p>Connect with friends and family with complete privacy. Verified with Aadhaar for a trusted experience.</p>

          <div className="hero-features">
            <div className="hero-feature-item">
              <i className="pi pi-shield"></i>
              <span>End-to-End Encrypted</span>
            </div>
            <div className="hero-feature-item">
              <i className="pi pi-verified"></i>
              <span>Aadhaar Verified Users</span>
            </div>
            <div className="hero-feature-item">
              <i className="pi pi-lock"></i>
              <span>100% Private</span>
            </div>
          </div>

          <div className="hero-btns">
            <button className="hero-register-btn" onClick={() => navigate('/register')}>
              <i className="pi pi-user-plus"></i> Get Started Free
            </button>
            <button className="hero-download-btn" onClick={() => navigate('/download')}>
              <i className="pi pi-download"></i> Download App
            </button>
          </div>
        </div>

        {/* Right Section */}
        <div className="right-section">
          <div className="login-box">

            <div className="login-box-header">
              <div className="login-box-icon">
                <i className="pi pi-comments"></i>
              </div>
              <h2>Scan to Login</h2>
              <p>Use your phone to log in instantly</p>
            </div>

            <div className="qr-wrapper">
              <img src="/random_qr.png" alt="QR Code" className="qr-image" />
              <div className="qr-overlay-text">Scan with Sovereign App</div>
            </div>

            <div className="divider">
              <span>or login with</span>
            </div>

            <button className="aadhaar-login-btn" onClick={() => navigate('/register')}>
              <i className="pi pi-id-card"></i> Aadhaar Number
            </button>

            <div className="steps-collapse">
              <div className="steps-toggle" onClick={toggleSteps}>
                <span>How to scan?</span>
                <i className="pi pi-chevron-down" id="steps-icon"></i>
              </div>
              <div className="steps-content" id="steps-content" style={{ display: 'none' }}>
                <ol>
                  <li><i className="pi pi-mobile"></i> Open Sovereign on your phone</li>
                  <li><i className="pi pi-ellipsis-v"></i> Tap menu icon</li>
                  <li><i className="pi pi-link"></i> Tap Linked devices → Link device</li>
                  <li><i className="pi pi-qrcode"></i> Scan this QR code</li>
                  <li><i className="pi pi-phone"></i> Enter OTP sent to your number</li>
                </ol>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Bottom Strip */}
      <div className="bottom-strip">
        <div className="strip-item"><i className="pi pi-users"></i> 10L+ Users</div>
        <div className="strip-divider"></div>
        <div className="strip-item"><i className="pi pi-star"></i> 4.8 Rating</div>
        <div className="strip-divider"></div>
        <div className="strip-item"><i className="pi pi-shield"></i> Govt. Verified</div>
        <div className="strip-divider"></div>
        <div className="strip-item"><i className="pi pi-heart"></i> Made in India</div>
      </div>
    </>
  )
}

export default Home