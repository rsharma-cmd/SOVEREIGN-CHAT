import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'

const Landing = () => {
  const navigate = useNavigate()
  const { isDark, toggleTheme } = useTheme()
  const [activeFaq, setActiveFaq] = useState(null)
  const [activeFeature, setActiveFeature] = useState(0)
  const [scrollY, setScrollY] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)
  const heroRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const features = [
    {
      id: 0,
      icon: '🔐',
      tag: 'SECURITY',
      title: 'Military-grade encryption',
      desc: 'Every single message is protected with end-to-end encryption. Your conversations belong to you — not us, not anyone else.',
      color: '#FF8411',
      mockup: [
        { from: 'them', text: 'Hey, is this really safe? 🤔' },
        { from: 'me', text: 'Absolutely! 256-bit encrypted 🔒' },
        { from: 'them', text: 'Wow, even SOVREIGN cant read it?' },
        { from: 'me', text: 'Nobody can. Only us. Period.' },
      ]
    },
    {
      id: 1,
      icon: '🪪',
      tag: 'VERIFICATION',
      title: 'Aadhaar-verified trust network',
      desc: 'Every user on SovrChats is verified with their Aadhaar identity. No bots, no fake accounts — just real, trusted Indians.',
      color: '#2ecc71',
      mockup: [
        { from: 'them', text: 'How do I know you are real? 😅' },
        { from: 'me', text: 'Aadhaar verified ✅' },
        { from: 'them', text: 'Oh! So everyone here is legit!' },
        { from: 'me', text: '100% real users only 🇮🇳' },
      ]
    },
    {
      id: 2,
      icon: '⚡',
      tag: 'PERFORMANCE',
      title: 'Blazing fast, zero lag',
      desc: 'Messages delivered in milliseconds. Built on modern infrastructure optimized for India\'s diverse network conditions.',
      color: '#f39c12',
      mockup: [
        { from: 'me', text: 'Did you get my message?' },
        { from: 'them', text: 'Already replied! 😂' },
        { from: 'me', text: 'Woah that was instant!' },
        { from: 'them', text: 'SovrChats = speed ⚡' },
      ]
    },
    {
      id: 3,
      icon: '🌐',
      tag: 'CROSS-PLATFORM',
      title: 'One app, every device',
      desc: 'Seamlessly switch between Android, iOS, and Windows. Your chats stay perfectly synced across all your devices.',
      color: '#3498db',
      mockup: [
        { from: 'them', text: 'I switched to laptop!' },
        { from: 'me', text: 'All messages synced? 🖥️' },
        { from: 'them', text: 'Everything is here! Magic!' },
        { from: 'me', text: 'That is SovrChats 😎' },
      ]
    },
  ]

  const steps = [
    { num: '01', icon: '🪪', title: 'Verify Aadhaar', desc: 'Securely confirm your identity in under 60 seconds.' },
    { num: '02', icon: '📱', title: 'Link Mobile', desc: 'Add your phone number and verify with a quick OTP.' },
    { num: '03', icon: '🎨', title: 'Build Profile', desc: 'Customize your name, photo, and personal status.' },
    { num: '04', icon: '💬', title: 'Start Chatting', desc: 'Connect instantly with friends, family, and colleagues.' },
  ]

  const testimonials = [
    { name: 'Priya Sharma', role: 'Software Engineer, Bengaluru', text: 'Finally an Indian chat app I can fully trust. The Aadhaar verification is genius — I know every person I talk to is real.', avatar: 'PS', color: '#e74c3c', stars: 5 },
    { name: 'Arjun Mehta', role: 'Startup Founder, Mumbai', text: 'My entire team moved to SovrChats. The group features are top-notch and the security gives us peace of mind for sensitive discussions.', avatar: 'AM', color: '#3498db', stars: 5 },
    { name: 'Dr. Kavitha R.', role: 'Physician, Chennai', text: 'Patient confidentiality is my priority. SovrChats\' encryption is the only messaging platform I trust for professional communication.', avatar: 'KR', color: '#9b59b6', stars: 5 },
    { name: 'Ravi Teja', role: 'Teacher, Hyderabad', text: 'I use SovrChats for my entire class. The interface is so clean and simple, even my older students picked it up instantly.', avatar: 'RT', color: '#2ecc71', stars: 5 },
  ]

  const faqs = [
    { q: 'Is SovrChats completely free?', a: 'Yes, forever. No subscriptions, no hidden fees, no premium tiers. Every feature is available to every user at zero cost for normal users.' },
    { q: 'How does Aadhaar verification work?', a: 'We use government-approved UIDAI APIs for verification. Your Aadhaar number is used only for identity verification and is never stored on our servers.' },
    { q: 'Can I use it on multiple devices?', a: 'Absolutely! SovrChats works on Android, iOS, and Windows simultaneously. All messages sync in real-time across every device.' },
    { q: 'Can SovrChats read my messages?', a: 'Impossible. All messages are end-to-end encrypted before leaving your device. Even our engineers cannot access your conversations.' },
    { q: 'What happens if I lose my phone?', a: 'Your account is secured by your Aadhaar. Simply re-verify on a new device and all your chat history will be restored.' },
  ]

  return (
    <div className={`lp ${isDark ? 'lp-dark' : ''}`}>

      {/* ===== NAV ===== */}
      <nav className={`lp-nav ${scrollY > 50 ? 'lp-nav-scrolled' : ''}`}>
        <div className="lp-nav-inner">
          <div className="lp-nav-logo" onClick={() => navigate('/')}>
            <span className="logo-icon">⚡</span>
            <span className="logo-text">SOVREIGN</span>
          </div>
          <div className={`lp-nav-links ${menuOpen ? 'open' : ''}`}>
            <a href="#features" onClick={() => setMenuOpen(false)}>Features</a>
            <a href="#how" onClick={() => setMenuOpen(false)}>How it works</a>
            <a href="#reviews" onClick={() => setMenuOpen(false)}>Reviews</a>
            <a href="#faq" onClick={() => setMenuOpen(false)}>FAQ</a>
          </div>
          <div className="lp-nav-actions">
            <button className="lp-icon-btn" onClick={toggleTheme}>
              <i className={`pi ${isDark ? 'pi-sun' : 'pi-moon'}`}></i>
            </button>
            <button className="lp-ghost-btn" onClick={() => navigate('/home')}>Sign in</button>
            <button className="lp-solid-btn" onClick={() => navigate('/register')}>Get Started</button>
          </div>
          <button className="lp-menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
            <i className={`pi ${menuOpen ? 'pi-times' : 'pi-bars'}`}></i>
          </button>
        </div>
      </nav>

      {/* ===== HERO ===== */}
      <section className="lp-hero" ref={heroRef}>
        <div className="lp-hero-bg">
          <div className="hero-orb orb1"></div>
          <div className="hero-orb orb2"></div>
          <div className="hero-orb orb3"></div>
          <div className="hero-grid"></div>
        </div>

        <div className="lp-hero-content">
          <div className="hero-eyebrow">
            <span className="eyebrow-dot"></span>
            <span>🇮🇳 India's Most Trusted Chat Platform</span>
          </div>

          <h1 className="hero-headline">
            Chat without
            <span className="headline-highlight"> fear.</span>
            <br />
            Connect with
            <span className="headline-highlight"> trust.</span>
          </h1>

          <p className="hero-body">
            SovrChats combines Aadhaar-verified identity with military-grade
            encryption — so every conversation stays between you and the people you trust.
          </p>

          <div className="hero-cta-row">
            <button className="hero-btn-primary" onClick={() => navigate('/register')}>
              Start for free
              <i className="pi pi-arrow-right"></i>
            </button>
            <button className="hero-btn-ghost" onClick={() => navigate('/chat')}>
              <i className="pi pi-play-circle"></i>
              Try live demo
            </button>
          </div>

          <div className="hero-social-proof">
            <div className="proof-avatars">
              {[
                { l: 'R', c: '#e74c3c' }, { l: 'A', c: '#3498db' },
                { l: 'S', c: '#2ecc71' }, { l: 'V', c: '#9b59b6' },
                { l: 'P', c: '#f39c12' },
              ].map((a, i) => (
                <div key={i} className="proof-avatar" style={{ backgroundColor: a.c, zIndex: 5-i }}>{a.l}</div>
              ))}
            </div>
            <div className="proof-text">
              <div className="proof-stars">★★★★★</div>
              <div><strong>10 Lakh+</strong> users trust SovrChats daily</div>
            </div>
          </div>
        </div>

        <div className="lp-hero-visual">
          <div className="phone-mockup">
            <div className="phone-notch"></div>
            <div className="phone-screen">
              <div className="phone-topbar">
                <div className="phone-contact">
                  <div className="phone-avatar" style={{ background: 'linear-gradient(135deg,#FF8411,#ffaa55)' }}>R</div>
                  <div>
                    <div className="phone-name">Ritika</div>
                    <div className="phone-online">● Online</div>
                  </div>
                </div>
                <div className="phone-icons">
                  <i className="pi pi-phone"></i>
                  <i className="pi pi-lock" style={{ color: '#2ecc71' }}></i>
                </div>
              </div>
              <div className="phone-chat">
                <div className="chat-bubble them" style={{ animationDelay: '0.2s' }}>Hey! Are you free tonight? 😊</div>
                <div className="chat-bubble me" style={{ animationDelay: '0.5s' }}>Yes! What's the plan? 🎉</div>
                <div className="chat-bubble them" style={{ animationDelay: '0.8s' }}>Let's meet at 7 pm?</div>
                <div className="chat-bubble me" style={{ animationDelay: '1.1s' }}>Perfect! See you then 👋</div>
                <div className="chat-bubble them" style={{ animationDelay: '1.4s' }}>Can't wait! 🥳</div>
              </div>
              <div className="phone-input">
                <div className="phone-input-field">Type a message...</div>
                <div className="phone-send"><i className="pi pi-send"></i></div>
              </div>
              <div className="phone-enc-badge">
                <i className="pi pi-lock"></i> End-to-end encrypted
              </div>
            </div>
          </div>
          <div className="phone-glow"></div>

          {/* Floating badges */}
          <div className="float-badge badge-enc">
            <i className="pi pi-shield"></i>
            <span>256-bit encrypted</span>
          </div>
          <div className="float-badge badge-verified">
            <i className="pi pi-verified"></i>
            <span>Aadhaar verified</span>
          </div>
          <div className="float-badge badge-india">
            <span>🇮🇳 Made in India</span>
          </div>
        </div>
      </section>

      {/* ===== STATS BAND ===== */}
      <div className="lp-stats-band">
        {[
          { val: '10L+', label: 'Active users' },
          { val: '4.9★', label: 'App rating' },
          { val: '256-bit', label: 'Encryption' },
          { val: '<50ms', label: 'Message delivery' },
          { val: '3', label: 'Platforms supported' },
          { val: '100%', label: 'Aadhaar verified' },
        ].map((s, i) => (
          <div key={i} className="stats-item">
            <div className="stats-val">{s.val}</div>
            <div className="stats-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* ===== FEATURES ===== */}
      <section className="lp-features" id="features">
        <div className="lp-container">
          <div className="lp-section-label">FEATURES</div>
          <h2 className="lp-section-title">
            Built different.<br />
            <span>Designed for India.</span>
          </h2>
          <p className="lp-section-sub">
            Every feature exists to protect your privacy and make communication effortless.
          </p>

          <div className="features-layout">
            <div className="features-tabs">
              {features.map((f) => (
                <div
                  key={f.id}
                  className={`feature-tab ${activeFeature === f.id ? 'active' : ''}`}
                  onClick={() => setActiveFeature(f.id)}
                  style={{ '--accent': f.color }}
                >
                  <span className="ftab-icon">{f.icon}</span>
                  <div>
                    <div className="ftab-tag">{f.tag}</div>
                    <div className="ftab-title">{f.title}</div>
                  </div>
                  <i className="pi pi-chevron-right ftab-arrow"></i>
                </div>
              ))}
            </div>

            <div className="features-display">
              {features.map((f) => (
                <div key={f.id} className={`feature-panel ${activeFeature === f.id ? 'visible' : ''}`}>
                  <div className="fpanel-tag" style={{ color: f.color }}>{f.tag}</div>
                  <h3 className="fpanel-title">{f.title}</h3>
                  <p className="fpanel-desc">{f.desc}</p>
                  <div className="fpanel-mockup">
                    <div className="fmock-header" style={{ background: `linear-gradient(135deg, ${f.color}, ${f.color}99)` }}>
                      <div className="fmock-avatar">{f.icon}</div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 13, color: 'white' }}>SovrChats</div>
                        <div style={{ fontSize: 11, opacity: 0.8, color: 'white' }}>Feature preview</div>
                      </div>
                    </div>
                    <div className="fmock-body">
                      {f.mockup.map((m, i) => (
                        <div key={i} className={`fmock-msg ${m.from}`}
                          style={m.from === 'me' ? { background: `linear-gradient(135deg, ${f.color}, ${f.color}cc)` } : {}}>
                          {m.text}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="lp-how" id="how">
        <div className="lp-container">
          <div className="lp-section-label">HOW IT WORKS</div>
          <h2 className="lp-section-title">
            Up and running<br />
            <span>in 4 steps.</span>
          </h2>
          <p className="lp-section-sub">Less than 2 minutes. No technical knowledge required.</p>

          <div className="how-steps">
            {steps.map((s, i) => (
              <div key={i} className="how-step">
                <div className="how-step-num">{s.num}</div>
                <div className="how-step-icon">{s.icon}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
                {i < steps.length - 1 && (
                  <div className="how-step-line"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="lp-reviews" id="reviews">
        <div className="lp-container">
          <div className="lp-section-label">REVIEWS</div>
          <h2 className="lp-section-title">
            Real people.<br />
            <span>Real stories.</span>
          </h2>

          <div className="reviews-grid">
            {testimonials.map((t, i) => (
              <div key={i} className="review-card" style={{ '--delay': `${i * 0.1}s` }}>
                <div className="review-stars">{'★'.repeat(t.stars)}</div>
                <p className="review-text">"{t.text}"</p>
                <div className="review-author">
                  <div className="review-avatar" style={{ backgroundColor: t.color }}>{t.avatar}</div>
                  <div>
                    <div className="review-name">{t.name}</div>
                    <div className="review-role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== DOWNLOAD ===== */}
      <section className="lp-download">
        <div className="lp-container">
          <div className="download-split">
            <div className="download-left">
              <div className="lp-section-label">DOWNLOAD</div>
              <h2 className="lp-section-title">
                Get SovrChats<br />
                <span>on any device.</span>
              </h2>
              <p className="lp-section-sub">Free on all platforms. Forever.</p>
              <div className="download-btns">
                <button className="dl-btn dl-android" onClick={() => navigate('/download')}>
                  <i className="pi pi-android"></i>
                  <div><small>Download for</small><strong>Android</strong></div>
                </button>
                <button className="dl-btn dl-ios" onClick={() => navigate('/download')}>
                  <i className="pi pi-apple"></i>
                  <div><small>Download on</small><strong>App Store</strong></div>
                </button>
                <button className="dl-btn dl-win" onClick={() => navigate('/download')}>
                  <i className="pi pi-desktop"></i>
                  <div><small>Download for</small><strong>Windows</strong></div>
                </button>
              </div>
            </div>
            <div className="download-right">
              <div className="qr-card-fancy">
                <div className="qr-card-top">
                  <span className="logo-icon">⚡</span>
                  <span style={{ fontWeight: 800, color: '#FF8411' }}>SOVREIGN</span>
                </div>
                <img src="/random_qr.png" alt="QR Code" className="qr-img-fancy" />
                <p>Scan to download instantly</p>
                <div className="qr-platforms">
                  <i className="pi pi-android"></i>
                  <i className="pi pi-apple"></i>
                  <i className="pi pi-desktop"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="lp-faq" id="faq">
        <div className="lp-container">
          <div className="lp-section-label">FAQ</div>
          <h2 className="lp-section-title">
            Questions?<br />
            <span>We have answers.</span>
          </h2>

          <div className="faq-grid">
            {faqs.map((f, i) => (
              <div key={i} className={`faq-card ${activeFaq === i ? 'faq-open' : ''}`}>
                <div className="faq-q" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>
                  <span>{f.q}</span>
                  <div className="faq-toggle">
                    <i className={`pi ${activeFaq === i ? 'pi-minus' : 'pi-plus'}`}></i>
                  </div>
                </div>
                {activeFaq === i && (
                  <div className="faq-a">{f.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="lp-cta">
        <div className="cta-orb"></div>
        <div className="lp-container cta-inner">
          <div className="cta-label">GET STARTED TODAY</div>
          <h2 className="cta-title">
            Your conversations<br />deserve better.
          </h2>
          <p className="cta-sub">
            Join 10 Lakh+ Indians who have made the switch to secure, verified communication.
          </p>
          <div className="cta-btns">
            <button className="hero-btn-primary large" onClick={() => navigate('/register')}>
              Create free account
              <i className="pi pi-arrow-right"></i>
            </button>
            <button className="hero-btn-ghost large" onClick={() => navigate('/chat')}>
              <i className="pi pi-play-circle"></i>
              Try demo first
            </button>
          </div>
          <p className="cta-footnote">No credit card. No commitments. Free forever for normal users.</p>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="lp-footer">
        <div className="lp-container">
          <div className="footer-top">
            <div className="footer-brand">
              <div className="lp-nav-logo" style={{ marginBottom: 12 }}>
                <span className="logo-icon">⚡</span>
                <span className="logo-text">SOVREIGN</span>
              </div>
              <p>India's first Aadhaar-verified, end-to-end encrypted messaging platform.</p>
              <div className="footer-socials">
                {['pi-twitter', 'pi-instagram', 'pi-linkedin', 'pi-github'].map((icon, i) => (
                  <button key={i} className="footer-social-btn">
                    <i className={`pi ${icon}`}></i>
                  </button>
                ))}
              </div>
            </div>

            <div className="footer-links-grid">
              {[
                { title: 'Product', links: ['Features', 'Download', 'Pricing', 'Changelog'] },
                { title: 'Company', links: ['About', 'Blog', 'Careers', 'Press'] },
                { title: 'Legal', links: ['Privacy Policy', 'Terms', 'Security', 'Cookies'] },
              ].map((col, i) => (
                <div key={i} className="footer-col">
                  <h4>{col.title}</h4>
                  {col.links.map((l, j) => <a key={j} href="#">{l}</a>)}
                </div>
              ))}
            </div>
          </div>

          <div className="footer-bottom">
            <p>© 2026⚡SOVREIGN Technologies. Made with ❤️ in India.</p>
            <p className="footer-enc-note">
              <i className="pi pi-lock"></i> All communications end-to-end encrypted
            </p>
          </div>
        </div>
      </footer>

    </div>
  )
}

export default Landing
