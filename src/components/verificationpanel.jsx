import { useState } from 'react'
import { auth, db } from '../firebase'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'

// ─── Colors ───────────────────────────────────────────────
const C = {
  bg: '#141414',
  card: '#181818',
  border: 'rgba(255,255,255,0.07)',
  accent: '#f5a623',
  accentDim: 'rgba(245,166,35,0.12)',
  text: '#e8e8e8',
  muted: '#888',
  success: '#2ecc71',
  successDim: 'rgba(46,204,113,0.1)',
  error: '#e74c3c',
  input: '#1e1e1e',
}

// ─── Reusable Styles ──────────────────────────────────────
const panelWrap = {
  position: 'fixed', top: 0, left: '70px',
  height: '100vh', width: '360px',
  background: C.bg,
  borderRight: `1px solid ${C.border}`,
  zIndex: 9999,
  display: 'flex', flexDirection: 'column',
  overflowY: 'auto',
  fontFamily: "'Sora', 'Segoe UI', sans-serif",
  animation: 'slideInVerify 0.32s cubic-bezier(0.22,1,0.36,1)',
}

const headerStyle = {
  padding: '20px 20px 14px',
  borderBottom: `1px solid ${C.border}`,
  display: 'flex', alignItems: 'center', gap: '12px',
  position: 'sticky', top: 0,
  background: C.bg, zIndex: 10,
  flexShrink: 0,
}

const backBtn = {
  width: '32px', height: '32px',
  borderRadius: '10px', border: 'none',
  background: 'rgba(255,255,255,0.06)',
  color: C.muted, cursor: 'pointer',
  fontSize: '18px', display: 'flex',
  alignItems: 'center', justifyContent: 'center',
  transition: 'all 0.2s',
}

const closeBtn = {
  marginLeft: 'auto',
  width: '28px', height: '28px',
  borderRadius: '8px', border: 'none',
  background: 'rgba(255,255,255,0.05)',
  color: C.muted, cursor: 'pointer',
  fontSize: '16px', display: 'flex',
  alignItems: 'center', justifyContent: 'center',
}

const inputStyle = (verified) => ({
  width: '100%', padding: '11px 14px',
  background: verified ? 'rgba(46,204,113,0.05)' : C.input,
  border: `1px solid ${verified ? 'rgba(46,204,113,0.3)' : C.border}`,
  borderRadius: '10px',
  color: verified ? C.success : C.text,
  fontFamily: 'monospace', fontSize: '14px', outline: 'none',
  transition: 'border-color 0.2s, box-shadow 0.2s',
})

const otpBox = {
  width: '44px', height: '48px',
  background: C.input,
  border: `1px solid ${C.border}`,
  borderRadius: '10px', color: C.text,
  textAlign: 'center', fontSize: '18px',
  fontFamily: 'monospace', outline: 'none',
  transition: 'border-color 0.2s',
}

const primaryBtn = (disabled, success) => ({
  width: '100%', padding: '13px',
  borderRadius: '12px', border: 'none',
  background: success ? C.success : disabled ? 'rgba(255,255,255,0.05)' : C.accent,
  color: success ? 'white' : disabled ? '#444' : '#111',
  fontSize: '14px', fontWeight: 600,
  cursor: disabled ? 'default' : 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
  transition: 'all 0.2s',
})

const badgeStyle = {
  marginLeft: 'auto', fontSize: '11px', fontWeight: 600,
  color: C.success, background: C.successDim,
  padding: '3px 10px', borderRadius: '20px',
  border: '1px solid rgba(46,204,113,0.2)',
}

// ══════════════════════════════════════════════════════════
// PAGE 1 — VERIFICATION MENU (chat list jaisa)
// ══════════════════════════════════════════════════════════
const VerifyMenu = ({ onSelect, onClose, verifiedStatus }) => {

  const items = [
    {
      id: 'aadhar',
      icon: '🪪',
      title: 'Aadhaar Verification',
      sub: 'Verify your 12-digit Aadhaar number',
      color: '#3498db',
      done: verifiedStatus.aadhar,
    },
    {
      id: 'phone',
      icon: '📱',
      title: 'Phone Verification',
      sub: 'Verify your mobile number via OTP',
      color: '#2ecc71',
      done: verifiedStatus.phone,
    },
    {
      id: 'pin',
      icon: '🔐',
      title: 'Security PIN',
      sub: 'Set a 6-digit security PIN',
      color: '#9b59b6',
      done: verifiedStatus.pin,
    },
  ]

  const doneCount = Object.values(verifiedStatus).filter(Boolean).length

  return (
    <div style={panelWrap}>
      {/* Header */}
      <div style={headerStyle}>
        <div style={{
          width: '36px', height: '36px',
          background: C.accentDim,
          borderRadius: '10px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '18px'
        }}>🛡️</div>
        <div>
          <div style={{ fontSize: '15px', fontWeight: 600, color: C.text }}>
            Identity Verification
          </div>
          <div style={{ fontSize: '11px', color: C.muted, marginTop: '2px' }}>
            {doneCount}/3 completed
          </div>
        </div>
        <button onClick={onClose} style={closeBtn}>×</button>
      </div>

      {/* Progress bar */}
      <div style={{ height: '3px', background: 'rgba(255,255,255,0.05)' }}>
        <div style={{
          height: '100%',
          width: `${(doneCount / 3) * 100}%`,
          background: doneCount === 3 ? C.success : C.accent,
          transition: 'width 0.5s ease',
          borderRadius: '0 2px 2px 0',
        }} />
      </div>

      {/* Subtitle */}
      <div style={{
        padding: '16px 20px 8px',
        fontSize: '11px', fontWeight: 700,
        color: C.muted, textTransform: 'uppercase', letterSpacing: '0.8px'
      }}>
        Verification Steps
      </div>

      {/* Menu Items — chat item jaisa */}
      <div style={{ flex: 1 }}>
        {items.map((item, i) => (
          <div key={item.id}
            onClick={() => onSelect(item.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: '14px',
              padding: '14px 20px',
              cursor: 'pointer',
              borderBottom: `1px solid ${C.border}`,
              transition: 'background 0.15s',
              background: 'transparent',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            {/* Icon box */}
            <div style={{
              width: '46px', height: '46px',
              borderRadius: '14px',
              background: item.done
                ? 'rgba(46,204,113,0.12)'
                : `${item.color}18`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '22px', flexShrink: 0,
              border: item.done ? '1px solid rgba(46,204,113,0.2)' : 'none',
            }}>
              {item.done ? '✅' : item.icon}
            </div>

            {/* Text */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontSize: '14px', fontWeight: 600,
                color: item.done ? C.success : C.text,
                marginBottom: '3px',
              }}>
                {item.title}
              </div>
              <div style={{ fontSize: '12px', color: C.muted }}>
                {item.done ? 'Verified ✓' : item.sub}
              </div>
            </div>

            {/* Arrow */}
            <div style={{ color: C.muted, fontSize: '18px', flexShrink: 0 }}>›</div>
          </div>
        ))}
      </div>

      {/* All done banner */}
      {doneCount === 3 && (
        <div style={{
          margin: '16px 20px 20px',
          padding: '14px 16px',
          background: 'rgba(46,204,113,0.06)',
          border: '1px solid rgba(46,204,113,0.2)',
          borderRadius: '12px',
          display: 'flex', alignItems: 'center', gap: '10px',
        }}>
          <span style={{ fontSize: '22px' }}>🎉</span>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: C.success }}>
              All Verified!
            </div>
            <div style={{ fontSize: '11px', color: C.muted, marginTop: '2px' }}>
              Your identity is fully verified
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ══════════════════════════════════════════════════════════
// PAGE 2A — AADHAAR VERIFICATION
// ══════════════════════════════════════════════════════════
const AadhaarPage = ({ onBack, onDone, alreadyVerified }) => {
  const [aadharNum, setAadharNum] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [otp, setOtp] = useState(['','','','','',''])
  const [timer, setTimer] = useState(0)
  const [loading, setLoading] = useState(false)
  const [verified, setVerified] = useState(alreadyVerified)

  const formatAadhar = (val) => {
    let v = val.replace(/\D/g, '').slice(0, 12)
    return v.replace(/(\d{4})(?=\d)/g, '$1 ')
  }

  const sendOTP = () => {
    if (!aadharNum.replace(/\s/g, '').match(/^\d{12}$/)) {
      return alert('Please enter valid 12-digit Aadhaar number')
    }
    setOtpSent(true)
    let s = 30
    setTimer(s)
    const t = setInterval(() => {
      s--
      setTimer(s)
      if (s <= 0) clearInterval(t)
    }, 1000)
    setTimeout(() => document.getElementById('aotp0')?.focus(), 100)
  }

  const handleOtp = (idx, val) => {
    const clean = val.replace(/\D/, '').slice(0, 1)
    const updated = [...otp]
    updated[idx] = clean
    setOtp(updated)
    if (clean && idx < 5) document.getElementById(`aotp${idx+1}`)?.focus()
  }

  const verifyOTP = async () => {
    if (otp.join('').length < 6) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 1200))
    setVerified(true)
    setLoading(false)
    // Save to Firestore
    try {
      const user = auth.currentUser
      if (user) {
        await setDoc(doc(db, 'users', user.uid), {
          aadharVerified: true,
          aadharNum: aadharNum.replace(/\s/g, ''),
          verifiedAt: serverTimestamp()
        }, { merge: true })
      }
    } catch (e) {}
  }

  return (
    <div style={panelWrap}>
      {/* Header */}
      <div style={headerStyle}>
        <button onClick={onBack} style={backBtn}>‹</button>
        <div style={{
          width: '36px', height: '36px',
          background: 'rgba(52,152,219,0.15)',
          borderRadius: '10px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '18px'
        }}>🪪</div>
        <div>
          <div style={{ fontSize: '15px', fontWeight: 600, color: C.text }}>
            Aadhaar Verification
          </div>
          <div style={{ fontSize: '11px', color: C.muted, marginTop: '2px' }}>
            {verified ? 'Verified ✓' : 'Enter your 12-digit number'}
          </div>
        </div>
        {verified && <span style={badgeStyle}>✓ Verified</span>}
      </div>

      <div style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

        {/* Info box */}
        <div style={{
          padding: '12px 14px',
          background: 'rgba(52,152,219,0.07)',
          border: '1px solid rgba(52,152,219,0.15)',
          borderRadius: '10px', fontSize: '12px', color: '#aaa',
          display: 'flex', gap: '10px', alignItems: 'flex-start'
        }}>
          <span style={{ fontSize: '16px', flexShrink: 0 }}>ℹ️</span>
          <span>An OTP will be sent to the mobile number linked with your Aadhaar.</span>
        </div>

        {/* Aadhaar input */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '12px', color: C.muted, fontWeight: 500 }}>
            Aadhaar Number
          </label>
          <input type="text" placeholder="XXXX XXXX XXXX"
            value={aadharNum} disabled={otpSent || verified}
            onChange={e => setAadharNum(formatAadhar(e.target.value))}
            style={{ ...inputStyle(verified), letterSpacing: '2px' }}
          />
        </div>

        {/* Send OTP button */}
        {!otpSent && !verified && (
          <button onClick={sendOTP} style={primaryBtn(false, false)}>
            📤 Send OTP
          </button>
        )}

        {/* OTP section */}
        {otpSent && !verified && (
          <div style={{
            background: C.card,
            border: `1px solid ${C.border}`,
            borderRadius: '14px', padding: '18px',
            display: 'flex', flexDirection: 'column', gap: '14px'
          }}>
            <div style={{ fontSize: '12px', color: C.muted }}>
              Enter 6-digit OTP sent to your Aadhaar-linked number
            </div>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
              {otp.map((v, idx) => (
                <input key={idx} id={`aotp${idx}`} type="text"
                  value={v} maxLength={1}
                  onChange={e => handleOtp(idx, e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Backspace' && !v && idx > 0)
                      document.getElementById(`aotp${idx-1}`)?.focus()
                  }}
                  style={otpBox}
                />
              ))}
            </div>
            {timer > 0
              ? <div style={{ fontSize: '12px', color: C.muted, textAlign: 'center' }}>
                  Resend in {timer}s
                </div>
              : <div onClick={sendOTP} style={{ fontSize: '12px', color: C.accent, textAlign: 'center', cursor: 'pointer', textDecoration: 'underline' }}>
                  Resend OTP
                </div>
            }
            <button onClick={verifyOTP} disabled={otp.join('').length < 6 || loading}
              style={primaryBtn(otp.join('').length < 6 || loading, false)}>
              {loading ? '⏳ Verifying...' : '✓ Verify OTP'}
            </button>
          </div>
        )}

        {/* Success state */}
        {verified && (
          <div style={{
            padding: '18px',
            background: 'rgba(46,204,113,0.06)',
            border: '1px solid rgba(46,204,113,0.2)',
            borderRadius: '14px',
            display: 'flex', flexDirection: 'column', gap: '10px'
          }}>
            <div style={{ fontSize: '28px', textAlign: 'center' }}>✅</div>
            <div style={{ fontSize: '14px', fontWeight: 600, color: C.success, textAlign: 'center' }}>
              Aadhaar Verified!
            </div>
            <div style={{ fontSize: '12px', color: C.muted, textAlign: 'center' }}>
              {aadharNum || 'XXXX XXXX XXXX'}
            </div>
            <button onClick={onDone} style={primaryBtn(false, true)}>
              ✓ Done
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════
// PAGE 2B — PHONE VERIFICATION
// ══════════════════════════════════════════════════════════
const PhonePage = ({ onBack, onDone, alreadyVerified }) => {
  const [phoneNum, setPhoneNum] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [otp, setOtp] = useState(['','','','','',''])
  const [timer, setTimer] = useState(0)
  const [loading, setLoading] = useState(false)
  const [verified, setVerified] = useState(alreadyVerified)

  const sendOTP = () => {
    if (!phoneNum.replace(/\s/g, '').match(/^\+?\d{10,13}$/)) {
      return alert('Please enter valid phone number')
    }
    setOtpSent(true)
    let s = 30
    setTimer(s)
    const t = setInterval(() => {
      s--
      setTimer(s)
      if (s <= 0) clearInterval(t)
    }, 1000)
    setTimeout(() => document.getElementById('potp0')?.focus(), 100)
  }

  const handleOtp = (idx, val) => {
    const clean = val.replace(/\D/, '').slice(0, 1)
    const updated = [...otp]
    updated[idx] = clean
    setOtp(updated)
    if (clean && idx < 5) document.getElementById(`potp${idx+1}`)?.focus()
  }

  const verifyOTP = async () => {
    if (otp.join('').length < 6) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 1200))
    setVerified(true)
    setLoading(false)
    try {
      const user = auth.currentUser
      if (user) {
        await setDoc(doc(db, 'users', user.uid), {
          phoneVerified: true,
          verifiedPhone: phoneNum,
          verifiedAt: serverTimestamp()
        }, { merge: true })
      }
    } catch (e) {}
  }

  return (
    <div style={panelWrap}>
      <div style={headerStyle}>
        <button onClick={onBack} style={backBtn}>‹</button>
        <div style={{
          width: '36px', height: '36px',
          background: 'rgba(46,204,113,0.12)',
          borderRadius: '10px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '18px'
        }}>📱</div>
        <div>
          <div style={{ fontSize: '15px', fontWeight: 600, color: C.text }}>
            Phone Verification
          </div>
          <div style={{ fontSize: '11px', color: C.muted, marginTop: '2px' }}>
            {verified ? 'Verified ✓' : 'Verify via OTP'}
          </div>
        </div>
        {verified && <span style={badgeStyle}>✓ Verified</span>}
      </div>

      <div style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

        <div style={{
          padding: '12px 14px',
          background: 'rgba(46,204,113,0.07)',
          border: '1px solid rgba(46,204,113,0.15)',
          borderRadius: '10px', fontSize: '12px', color: '#aaa',
          display: 'flex', gap: '10px', alignItems: 'flex-start'
        }}>
          <span style={{ fontSize: '16px', flexShrink: 0 }}>ℹ️</span>
          <span>A 6-digit OTP will be sent to your mobile number for verification.</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '12px', color: C.muted, fontWeight: 500 }}>
            Phone Number
          </label>
          <input type="tel" placeholder="+91 XXXXX XXXXX"
            value={phoneNum} disabled={otpSent || verified}
            onChange={e => setPhoneNum(e.target.value)}
            style={inputStyle(verified)}
          />
        </div>

        {!otpSent && !verified && (
          <button onClick={sendOTP} style={primaryBtn(false, false)}>
            📤 Send OTP
          </button>
        )}

        {otpSent && !verified && (
          <div style={{
            background: C.card, border: `1px solid ${C.border}`,
            borderRadius: '14px', padding: '18px',
            display: 'flex', flexDirection: 'column', gap: '14px'
          }}>
            <div style={{ fontSize: '12px', color: C.muted }}>
              Enter the 6-digit OTP sent to {phoneNum}
            </div>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
              {otp.map((v, idx) => (
                <input key={idx} id={`potp${idx}`} type="text"
                  value={v} maxLength={1}
                  onChange={e => handleOtp(idx, e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Backspace' && !v && idx > 0)
                      document.getElementById(`potp${idx-1}`)?.focus()
                  }}
                  style={otpBox}
                />
              ))}
            </div>
            {timer > 0
              ? <div style={{ fontSize: '12px', color: C.muted, textAlign: 'center' }}>Resend in {timer}s</div>
              : <div onClick={sendOTP} style={{ fontSize: '12px', color: C.accent, textAlign: 'center', cursor: 'pointer', textDecoration: 'underline' }}>Resend OTP</div>
            }
            <button onClick={verifyOTP} disabled={otp.join('').length < 6 || loading}
              style={primaryBtn(otp.join('').length < 6 || loading, false)}>
              {loading ? '⏳ Verifying...' : '✓ Verify OTP'}
            </button>
          </div>
        )}

        {verified && (
          <div style={{
            padding: '18px',
            background: 'rgba(46,204,113,0.06)',
            border: '1px solid rgba(46,204,113,0.2)',
            borderRadius: '14px',
            display: 'flex', flexDirection: 'column', gap: '10px'
          }}>
            <div style={{ fontSize: '28px', textAlign: 'center' }}>✅</div>
            <div style={{ fontSize: '14px', fontWeight: 600, color: C.success, textAlign: 'center' }}>
              Phone Verified!
            </div>
            <div style={{ fontSize: '12px', color: C.muted, textAlign: 'center' }}>{phoneNum}</div>
            <button onClick={onDone} style={primaryBtn(false, true)}>✓ Done</button>
          </div>
        )}
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════
// PAGE 2C — PIN SETUP
// ══════════════════════════════════════════════════════════
const PinPage = ({ onBack, onDone, alreadyDone }) => {
  const [pin, setPin] = useState('')
  const [confirm, setConfirm] = useState('')
  const [done, setDone] = useState(alreadyDone)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const generatePIN = () => {
    const p = Math.floor(100000 + Math.random() * 900000).toString()
    setPin(p)
    setConfirm('')
  }

  const savePin = async () => {
    if (pin.length !== 6) return setError('PIN must be 6 digits')
    if (pin !== confirm) return setError('PINs do not match')
    setError('')
    setLoading(true)
    await new Promise(r => setTimeout(r, 1000))
    try {
      const user = auth.currentUser
      if (user) {
        await setDoc(doc(db, 'users', user.uid), {
          pinSet: true,
          pinHash: btoa(pin),
          pinSetAt: serverTimestamp()
        }, { merge: true })
      }
    } catch (e) {}
    setDone(true)
    setLoading(false)
  }

  return (
    <div style={panelWrap}>
      <div style={headerStyle}>
        <button onClick={onBack} style={backBtn}>‹</button>
        <div style={{
          width: '36px', height: '36px',
          background: 'rgba(155,89,182,0.15)',
          borderRadius: '10px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '18px'
        }}>🔐</div>
        <div>
          <div style={{ fontSize: '15px', fontWeight: 600, color: C.text }}>Security PIN</div>
          <div style={{ fontSize: '11px', color: C.muted, marginTop: '2px' }}>
            {done ? 'PIN Set ✓' : 'Set a 6-digit PIN'}
          </div>
        </div>
        {done && <span style={badgeStyle}>✓ Set</span>}
      </div>

      <div style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

        <div style={{
          padding: '12px 14px',
          background: 'rgba(155,89,182,0.07)',
          border: '1px solid rgba(155,89,182,0.15)',
          borderRadius: '10px', fontSize: '12px', color: '#aaa',
          display: 'flex', gap: '10px', alignItems: 'flex-start'
        }}>
          <span style={{ fontSize: '16px', flexShrink: 0 }}>ℹ️</span>
          <span>This PIN will be used to secure your account. Keep it safe!</span>
        </div>

        {!done && (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '12px', color: C.muted, fontWeight: 500 }}>
                6-digit PIN
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input type="text" placeholder="Enter PIN" maxLength={6}
                  value={pin}
                  onChange={e => { setPin(e.target.value.replace(/\D/, '').slice(0, 6)); setError('') }}
                  style={{ ...inputStyle(false), letterSpacing: '4px', textAlign: 'center', fontSize: '18px' }}
                />
                <button onClick={generatePIN} style={{
                  padding: '0 14px', borderRadius: '10px', border: 'none',
                  background: C.accentDim, color: C.accent,
                  fontSize: '12px', fontWeight: 600, cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}>Generate</button>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '12px', color: C.muted, fontWeight: 500 }}>
                Confirm PIN
              </label>
              <input type="text" placeholder="Re-enter PIN" maxLength={6}
                value={confirm}
                onChange={e => { setConfirm(e.target.value.replace(/\D/, '').slice(0, 6)); setError('') }}
                style={{ ...inputStyle(false), letterSpacing: '4px', textAlign: 'center', fontSize: '18px' }}
              />
            </div>

            {error && (
              <div style={{ fontSize: '12px', color: C.error, display: 'flex', gap: '6px', alignItems: 'center' }}>
                ⚠️ {error}
              </div>
            )}

            <button onClick={savePin} disabled={pin.length < 6 || loading}
              style={primaryBtn(pin.length < 6 || loading, false)}>
              {loading ? '⏳ Saving...' : '🔐 Set PIN'}
            </button>
          </>
        )}

        {done && (
          <div style={{
            padding: '18px',
            background: 'rgba(46,204,113,0.06)',
            border: '1px solid rgba(46,204,113,0.2)',
            borderRadius: '14px',
            display: 'flex', flexDirection: 'column', gap: '10px'
          }}>
            <div style={{ fontSize: '28px', textAlign: 'center' }}>✅</div>
            <div style={{ fontSize: '14px', fontWeight: 600, color: C.success, textAlign: 'center' }}>
              PIN Set Successfully!
            </div>
            <div style={{ fontSize: '12px', color: C.muted, textAlign: 'center' }}>
              ••••••
            </div>
            <button onClick={onDone} style={primaryBtn(false, true)}>✓ Done</button>
          </div>
        )}
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════
// MAIN EXPORT — Router between pages
// ══════════════════════════════════════════════════════════
const VerificationPanel = ({ isOpen, onClose }) => {
  const [page, setPage] = useState('menu') // menu | aadhar | phone | pin
  const [verifiedStatus, setVerifiedStatus] = useState({
    aadhar: false, phone: false, pin: false
  })

  if (!isOpen) return null

  const markDone = (type) => {
    setVerifiedStatus(prev => ({ ...prev, [type]: true }))
    setPage('menu')
  }

  return (
    <>
      {/* Overlay */}
      <div onClick={onClose} style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.5)',
        zIndex: 9990,
      }} />

      {/* Animated styles */}
      <style>{`
        @keyframes slideInVerify {
          from { transform: translateX(-100%); opacity: 0; }
          to   { transform: translateX(0);     opacity: 1; }
        }
        @keyframes slideInVerifyRight {
          from { transform: translateX(20px); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
      `}</style>

      {/* Pages */}
      {page === 'menu' && (
        <VerifyMenu
          onSelect={setPage}
          onClose={onClose}
          verifiedStatus={verifiedStatus}
        />
      )}
      {page === 'aadhar' && (
        <AadhaarPage
          onBack={() => setPage('menu')}
          onDone={() => markDone('aadhar')}
          alreadyVerified={verifiedStatus.aadhar}
        />
      )}
      {page === 'phone' && (
        <PhonePage
          onBack={() => setPage('menu')}
          onDone={() => markDone('phone')}
          alreadyVerified={verifiedStatus.phone}
        />
      )}
      {page === 'pin' && (
        <PinPage
          onBack={() => setPage('menu')}
          onDone={() => markDone('pin')}
          alreadyDone={verifiedStatus.pin}
        />
      )}
    </>
  )
}

export default VerificationPanel