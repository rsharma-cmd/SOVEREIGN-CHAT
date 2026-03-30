import { useEffect, useRef, useState } from 'react'
import { db } from '../firebase'
import { doc, setDoc, onSnapshot, updateDoc, deleteDoc } from 'firebase/firestore'

const CallModal = ({ callType, contact, currentUserId, onClose }) => {
  const [callStatus, setCallStatus] = useState('calling') // calling | connected | ended
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)
  const [callDuration, setCallDuration] = useState(0)

  const localVideoRef = useRef(null)
  const remoteVideoRef = useRef(null)
  const localStreamRef = useRef(null)
  const peerConnectionRef = useRef(null)
  const timerRef = useRef(null)
  const callDocId = `${currentUserId}_${contact.name}`

  useEffect(() => {
    startCall()
    return () => cleanup()
  }, [])

  // Timer
  useEffect(() => {
    if (callStatus === 'connected') {
      timerRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(timerRef.current)
  }, [callStatus])

  const formatDuration = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0')
    const s = (seconds % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  const startCall = async () => {
    try {
      // Get media
      const constraints = {
        audio: true,
        video: callType === 'video'
      }
      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      localStreamRef.current = stream

      if (localVideoRef.current && callType === 'video') {
        localVideoRef.current.srcObject = stream
      }

      // Setup WebRTC
      const pc = new RTCPeerConnection({
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' }
        ]
      })
      peerConnectionRef.current = pc

      // Add local tracks
      stream.getTracks().forEach(track => pc.addTrack(track, stream))

      // Remote stream
      pc.ontrack = (event) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0]
        }
        setCallStatus('connected')
      }

      // ICE candidates
      pc.onicecandidate = async (event) => {
        if (event.candidate) {
          await setDoc(doc(db, 'calls', callDocId, 'callerCandidates', Date.now().toString()), {
            candidate: event.candidate.toJSON()
          })
        }
      }

      // Create offer
      const offer = await pc.createOffer()
      await pc.setLocalDescription(offer)

      await setDoc(doc(db, 'calls', callDocId), {
        offer: { type: offer.type, sdp: offer.sdp },
        callType,
        callerName: 'You',
        receiverName: contact.name,
        status: 'calling',
        createdAt: new Date().toISOString()
      })

      // Listen for answer
      const unsubscribe = onSnapshot(doc(db, 'calls', callDocId), async (snapshot) => {
        const data = snapshot.data()
        if (data?.answer && !pc.currentRemoteDescription) {
          const answerDesc = new RTCSessionDescription(data.answer)
          await pc.setRemoteDescription(answerDesc)
          setCallStatus('connected')
        }
        if (data?.status === 'ended') {
          cleanup()
          onClose()
        }
      })

      // Simulate answer after 3 seconds (demo)
      setTimeout(async () => {
        if (callStatus !== 'connected') {
          setCallStatus('connected')
        }
      }, 3000)

    } catch (err) {
      console.log('Call error:', err)
      // Permission denied ya koi aur error
      setCallStatus('connected') // Demo mode
    }
  }

  const cleanup = async () => {
    clearInterval(timerRef.current)
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop())
    }
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close()
    }
    try {
      await deleteDoc(doc(db, 'calls', callDocId))
    } catch (e) {}
  }

  const endCall = async () => {
    try {
      await updateDoc(doc(db, 'calls', callDocId), { status: 'ended' })
    } catch (e) {}
    cleanup()
    onClose()
  }

  const toggleMute = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled
      })
    }
    setIsMuted(prev => !prev)
  }

  const toggleVideo = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getVideoTracks().forEach(track => {
        track.enabled = !track.enabled
      })
    }
    setIsVideoOff(prev => !prev)
  }

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: callType === 'video' ? '#0a0a0a' : 'linear-gradient(135deg, #1a1a2e, #16213e, #0f3460)',
      zIndex: 99999,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '40px 20px',
    }}>

      {/* Video streams */}
      {callType === 'video' && (
        <>
          {/* Remote video (full screen) */}
          <video ref={remoteVideoRef} autoPlay playsInline
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: callStatus === 'connected' ? 1 : 0,
              transition: 'opacity 0.5s'
            }}
          />

          {/* Local video (small) */}
          <video ref={localVideoRef} autoPlay playsInline muted
            style={{
              position: 'absolute',
              bottom: '120px',
              right: '20px',
              width: '120px',
              height: '160px',
              objectFit: 'cover',
              borderRadius: '16px',
              border: '2px solid rgba(255,255,255,0.2)',
              zIndex: 1,
              background: '#222',
              display: isVideoOff ? 'none' : 'block'
            }}
          />
        </>
      )}

      {/* Top section — Contact info */}
      <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <div style={{
          width: '80px', height: '80px',
          borderRadius: '24px',
          background: contact.color,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '32px', fontWeight: 800, color: 'white',
          margin: '0 auto 16px',
          boxShadow: `0 0 30px ${contact.color}66`,
          animation: callStatus === 'calling' ? 'pulse-ring 1.5s infinite' : 'none'
        }}>
          {contact.initial}
        </div>

        <div style={{ fontSize: '24px', fontWeight: 700, color: 'white', marginBottom: '8px' }}>
          {contact.name}
        </div>

        <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)' }}>
          {callStatus === 'calling' ? (
            <span style={{ animation: 'fadeInOut 1.5s infinite' }}>
              {callType === 'video' ? '📹' : '📞'} {callType === 'video' ? 'Video' : 'Audio'} calling...
            </span>
          ) : callStatus === 'connected' ? (
            <span style={{ color: '#2ecc71' }}>
              ● Connected — {formatDuration(callDuration)}
            </span>
          ) : 'Call ended'}
        </div>
      </div>

      {/* Middle — Audio waveform animation */}
      {callType === 'audio' && callStatus === 'connected' && (
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          {[1,2,3,4,5,4,3,2,1].map((h, i) => (
            <div key={i} style={{
              width: '4px',
              height: `${h * 8}px`,
              background: '#FF8411',
              borderRadius: '4px',
              animation: `wave ${0.5 + i * 0.1}s ease-in-out infinite alternate`
            }}></div>
          ))}
        </div>
      )}

      {/* Bottom — Controls */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center', justifyContent: 'center' }}>

          {/* Mute */}
          <button onClick={toggleMute} style={{
            width: '56px', height: '56px',
            borderRadius: '50%',
            border: 'none',
            background: isMuted ? '#e74c3c' : 'rgba(255,255,255,0.15)',
            color: 'white',
            fontSize: '20px',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.2s'
          }}>
            <i className={isMuted ? 'pi pi-microphone-slash' : 'pi pi-microphone'}></i>
          </button>

          {/* End Call */}
          <button onClick={endCall} style={{
            width: '70px', height: '70px',
            borderRadius: '50%',
            border: 'none',
            background: 'linear-gradient(135deg, #e74c3c, #c0392b)',
            color: 'white',
            fontSize: '26px',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 6px 20px rgba(231,76,60,0.5)',
            transition: 'all 0.2s'
          }}>
            <i className="pi pi-phone"></i>
          </button>

          {/* Video toggle (only for video call) */}
          {callType === 'video' ? (
            <button onClick={toggleVideo} style={{
              width: '56px', height: '56px',
              borderRadius: '50%',
              border: 'none',
              background: isVideoOff ? '#e74c3c' : 'rgba(255,255,255,0.15)',
              color: 'white',
              fontSize: '20px',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.2s'
            }}>
              <i className={isVideoOff ? 'pi pi-eye-slash' : 'pi pi-video'}></i>
            </button>
          ) : (
            /* Speaker toggle for audio */
            <button style={{
              width: '56px', height: '56px',
              borderRadius: '50%',
              border: 'none',
              background: 'rgba(255,255,255,0.15)',
              color: 'white',
              fontSize: '20px',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              backdropFilter: 'blur(10px)'
            }}>
              <i className="pi pi-volume-up"></i>
            </button>
          )}

        </div>

        <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '11px', marginTop: '16px' }}>
          🔒 End-to-end encrypted call
        </p>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes pulse-ring {
          0% { box-shadow: 0 0 0 0 ${contact.color}66; }
          70% { box-shadow: 0 0 0 20px ${contact.color}00; }
          100% { box-shadow: 0 0 0 0 ${contact.color}00; }
        }
        @keyframes wave {
          from { transform: scaleY(0.5); }
          to { transform: scaleY(1.5); }
        }
        @keyframes fadeInOut {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>

    </div>
  )
}

export default CallModal