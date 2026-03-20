import { useNavigate } from 'react-router-dom'
import Navbar from '../components/navbar'

const Download = () => {
  const navigate = useNavigate()

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-left">
          <div className="hero-badge">🔒 Secure & Private</div>
          <h1>Download <span>Sovereign</span></h1>
          <p>Stay connected with complete privacy. Available on all platforms — free forever.</p>

          <div className="download-buttons">
            <a href="#" className="dl-btn android-btn">
              <i className="pi pi-android"></i>
              <div>
                <span className="dl-sub">Get it on</span>
                <span className="dl-main">Android APK</span>
              </div>
            </a>
            <a href="#" className="dl-btn ios-btn">
              <i className="pi pi-apple"></i>
              <div>
                <span className="dl-sub">Download on</span>
                <span className="dl-main">App Store</span>
              </div>
            </a>
            <a href="#" className="dl-btn windows-btn">
              <i className="pi pi-desktop"></i>
              <div>
                <span className="dl-sub">Download for</span>
                <span className="dl-main">Windows</span>
              </div>
            </a>
          </div>
        </div>

        <div className="hero-right">
          <div className="qr-card">
            <div className="qr-card-header">
              <i className="pi pi-qrcode"></i>
              <span>Scan to Download</span>
            </div>
            <img src="/random_qr.png" alt="Download QR" className="qr-img" />
            <p className="qr-hint">Point your camera at the QR code to download instantly</p>
          </div>
        </div>
      </section>

      {/* Features Strip */}
      <section className="features-strip">
        <div className="feature-item"><i className="pi pi-shield"></i><span>End-to-End Encrypted</span></div>
        <div className="feature-divider"></div>
        <div className="feature-item"><i className="pi pi-users"></i><span>Group Chats</span></div>
        <div className="feature-divider"></div>
        <div className="feature-item"><i className="pi pi-clock"></i><span>Status Updates</span></div>
        <div className="feature-divider"></div>
        <div className="feature-item"><i className="pi pi-lock"></i><span>Aadhaar Verified</span></div>
        <div className="feature-divider"></div>
        <div className="feature-item"><i className="pi pi-star"></i><span>Free Forever</span></div>
      </section>

      {/* Platform Cards */}
      <section className="platform-section">
        <h2 className="section-heading">Choose Your Platform</h2>
        <div className="platform-cards">

          <div className="platform-card">
            <div className="platform-icon android-icon">
              <i className="pi pi-android"></i>
            </div>
            <h3>Android</h3>
            <p>Compatible with Android 6.0 and above</p>
            <ul>
              <li><i className="pi pi-check"></i> Direct APK download</li>
              <li><i className="pi pi-check"></i> Auto updates</li>
              <li><i className="pi pi-check"></i> Lightweight 25MB</li>
            </ul>
            <a href="#" className="platform-btn">
              <i className="pi pi-download"></i> Download APK
            </a>
          </div>

          <div className="platform-card featured-card">
            <div className="featured-tag">Most Popular</div>
            <div className="platform-icon ios-icon">
              <i className="pi pi-apple"></i>
            </div>
            <h3>iOS</h3>
            <p>Compatible with iOS 13.0 and above</p>
            <ul>
              <li><i className="pi pi-check"></i> App Store verified</li>
              <li><i className="pi pi-check"></i> Face ID support</li>
              <li><i className="pi pi-check"></i> iCloud backup</li>
            </ul>
            <a href="#" className="platform-btn">
              <i className="pi pi-download"></i> App Store
            </a>
          </div>

          <div className="platform-card">
            <div className="platform-icon windows-icon">
              <i className="pi pi-desktop"></i>
            </div>
            <h3>Windows</h3>
            <p>Compatible with Windows 10 and above</p>
            <ul>
              <li><i className="pi pi-check"></i> Desktop notifications</li>
              <li><i className="pi pi-check"></i> Keyboard shortcuts</li>
              <li><i className="pi pi-check"></i> Multi-window support</li>
            </ul>
            <a href="#" className="platform-btn">
              <i className="pi pi-download"></i> Download EXE
            </a>
          </div>

        </div>
      </section>

    </>
  )
}

export default Download