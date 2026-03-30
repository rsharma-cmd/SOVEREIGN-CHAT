import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import { auth, db } from '../firebase'
import { signOut } from 'firebase/auth'
import CallModal from '../components/CallModal'
import EmojiPicker from 'emoji-picker-react'

import VerificationPanel from '../components/verificationpanel'
import {
  collection, addDoc, onSnapshot,
  query, orderBy, serverTimestamp,
  doc, getDoc, setDoc, getDocs, updateDoc, deleteDoc
} from 'firebase/firestore'

const contacts = [
  { name: 'Ritika', color: '#e74c3c', initial: 'R', msg: 'Are you free today?', time: '12:15', unread: 2 },
  { name: 'Rishab', color: '#3498db', initial: 'R', msg: 'Let us plan something', time: '12:18' },
  { name: 'Aradhana', color: '#9b59b6', initial: 'A', msg: 'Check your email 📧', time: '10:30' },
  { name: 'Sadhana', color: '#1abc9c', initial: 'S', msg: 'Yes absolutely!', time: '09:45' },
  { name: 'Rashmika', color: '#e67e22', initial: 'R', msg: 'You must watch it!', time: '09:13' },
  { name: 'Suhari', color: '#27ae60', initial: 'S', msg: 'Aww that is sweet 😊', time: '08:50' },
]

const wallpapers = [
  { name: 'Default', value: null },
  { name: 'Orange', value: 'linear-gradient(135deg, #fff0e0, #ffe4c4)' },
  { name: 'Dark', value: 'linear-gradient(135deg, #1a1a2e, #16213e)' },
  { name: 'Green', value: 'linear-gradient(135deg, #e8f5e9, #c8e6c9)' },
  { name: 'Blue', value: 'linear-gradient(135deg, #e3f2fd, #bbdefb)' },
  { name: 'Purple', value: 'linear-gradient(135deg, #f3e5f5, #e1bee7)' },
  { name: 'Sunset', value: 'linear-gradient(135deg, #fff3e0, #ffe0b2)' },
  { name: 'Rose', value: 'linear-gradient(135deg, #fce4ec, #f8bbd0)' },
]

const Chat = () => {
  const navigate = useNavigate()
  const { isDark, toggleTheme } = useTheme()

  const [activePanel, setActivePanel] = useState('chats')
  const [activeChat, setActiveChat] = useState(null)
  const [messages, setMessages] = useState([])
  const [inputText, setInputText] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [groupList, setGroupList] = useState([])
  const [selectedContacts, setSelectedContacts] = useState([])
  const [groupName, setGroupName] = useState('')
  const [statusInput, setStatusInput] = useState('')
  const [showStatusInput, setShowStatusInput] = useState(false)
  const [myStatusText, setMyStatusText] = useState('Tap to add status update')
  const [postedStatuses, setPostedStatuses] = useState([])
  const [statusViewer, setStatusViewer] = useState(null)
  const [statusProgress, setStatusProgress] = useState(0)
  const [profileName, setProfileName] = useState('Your Name')
  const [profileAbout, setProfileAbout] = useState('Hey there! I am using SovrChats')
  const [profilePhone, setProfilePhone] = useState('+91 98765 43210')
  const [editingField, setEditingField] = useState(null)
  const [editValue, setEditValue] = useState('')
  const [avatarColor, setAvatarColor] = useState('#FFC107')
  const [currentUser, setCurrentUser] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [isOnline, setIsOnline] = useState(true)
  const [activeCall, setActiveCall] = useState(null)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [showChatMenu, setShowChatMenu] = useState(false)
  const [mutedChats, setMutedChats] = useState([])
  const [pinnedChats, setPinnedChats] = useState([])
  const [blockedChats, setBlockedChats] = useState([])
  const [chatWallpaper, setChatWallpaper] = useState(null)
  const [showWallpaperPicker, setShowWallpaperPicker] = useState(false)
  const [showContactInfo, setShowContactInfo] = useState(false)
  const [disappearingMessages, setDisappearingMessages] = useState(false)
  const [showVerification, setShowVerification] = useState(false)

  const messagesEndRef = useRef(null)
  const statusTimerRef = useRef(null)
  const unsubscribeRef = useRef(null)
  const fileInputRef = useRef(null)

  useEffect(() => {
    document.body.style.paddingTop = '0px'
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.paddingTop = '45px'
      document.body.style.overflow = ''
    }
  }, [])

  useEffect(() => {
    const user = auth.currentUser
    if (!user) return
    setCurrentUser(user)
    const loadProfile = async () => {
      try {
        const docRef = doc(db, 'users', user.uid)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          const data = docSnap.data()
          setProfileName(`${data.firstName} ${data.lastName}`)
          setProfileAbout(data.about || 'Hey there! I am using SovrChats')
          setProfilePhone(data.phone || user.phoneNumber || '+91 98765 43210')
        }
      } catch (err) {
        console.log('Error loading profile:', err)
      }
    }
    loadProfile()
  }, [])

  useEffect(() => {
    const user = auth.currentUser
    if (!user) return
    const updateOnlineStatus = async (status) => {
      try {
        await setDoc(doc(db, 'users', user.uid), {
          isOnline: status,
          lastSeen: serverTimestamp()
        }, { merge: true })
      } catch (err) {
        console.log('Status update error:', err)
      }
    }
    updateOnlineStatus(true)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        updateOnlineStatus(false)
      } else {
        updateOnlineStatus(true)
      }
    }
    const handleBeforeUnload = () => updateOnlineStatus(false)
    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('beforeunload', handleBeforeUnload)
      updateOnlineStatus(false)
    }
  }, [])

  useEffect(() => {
    if (!activeChat) return
    const interval = setInterval(() => {
      setIsOnline(Math.random() > 0.3)
    }, 30000)
    setIsOnline(true)
    return () => clearInterval(interval)
  }, [activeChat])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const getChatId = (contact) => {
    const uid = auth.currentUser?.uid || 'guest'
    return `${uid}_${contact.name}`
  }

  const openChat = (contact) => {
    setActiveChat(contact)
    setActivePanel('chats')
    setIsOnline(true)
    setShowEmojiPicker(false)
    setShowChatMenu(false)
    if (unsubscribeRef.current) unsubscribeRef.current()
    const chatId = getChatId(contact)
    const messagesRef = collection(db, 'chats', chatId, 'messages')
    const q = query(messagesRef, orderBy('createdAt', 'asc'))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setMessages(msgs)
    })
    unsubscribeRef.current = unsubscribe
  }

  const sendMessage = async () => {
    if (!inputText.trim() || !activeChat) return
    if (blockedChats.includes(activeChat.name)) {
      alert('You have blocked this contact. Unblock to send messages.')
      return
    }
    const chatId = getChatId(activeChat)
    const messagesRef = collection(db, 'chats', chatId, 'messages')
    const msgText = inputText.trim()
    setInputText('')
    setShowEmojiPicker(false)
    try {
      const msgDoc = await addDoc(messagesRef, {
        from: 'me', text: msgText,
        createdAt: serverTimestamp(),
        senderName: profileName, status: 'sent'
      })
      if (disappearingMessages) {
        setTimeout(async () => {
          try { await deleteDoc(doc(db, 'chats', chatId, 'messages', msgDoc.id)) } catch (e) {}
        }, 30000)
      }
      setTimeout(async () => {
        const replies = ['okay!', 'Got it!', 'Sure 😊', 'Sounds good!', 'Hmm interesting!']
        const reply = replies[Math.floor(Math.random() * replies.length)]
        await addDoc(messagesRef, {
          from: 'them', text: reply,
          createdAt: serverTimestamp(), senderName: activeChat.name,
        })
        const snapshot = await getDocs(messagesRef)
        snapshot.docs.forEach(async (d) => {
          if (d.data().from === 'me' && d.data().status === 'sent') {
            await updateDoc(d.ref, { status: 'seen' })
          }
        })
      }, 1000)
    } catch (err) {
      console.log('Error sending message:', err)
    }
  }

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file || !activeChat) return
    const chatId = getChatId(activeChat)
    const messagesRef = collection(db, 'chats', chatId, 'messages')
    try {
      const isImage = file.type.startsWith('image/')
      const isVideo = file.type.startsWith('video/')
      let emoji = '📎'
      if (isImage) emoji = '🖼️'
      if (isVideo) emoji = '🎥'
      await addDoc(messagesRef, {
        from: 'me', text: `${emoji} ${file.name}`,
        createdAt: serverTimestamp(), senderName: profileName,
        status: 'sent', isFile: true, fileType: file.type,
      })
    } catch (err) {
      console.log('File send error:', err)
    }
    e.target.value = ''
  }

  const clearMessages = async () => {
    if (!activeChat) return
    if (!window.confirm(`Clear all messages with ${activeChat.name}?`)) return
    const chatId = getChatId(activeChat)
    const messagesRef = collection(db, 'chats', chatId, 'messages')
    const snapshot = await getDocs(messagesRef)
    snapshot.docs.forEach(async (d) => { await deleteDoc(d.ref) })
    setMessages([])
    setShowChatMenu(false)
  }

  const toggleMute = () => {
    if (!activeChat) return
    setMutedChats(prev =>
      prev.includes(activeChat.name) ? prev.filter(n => n !== activeChat.name) : [...prev, activeChat.name]
    )
    setShowChatMenu(false)
  }

  const togglePin = () => {
    if (!activeChat) return
    setPinnedChats(prev =>
      prev.includes(activeChat.name) ? prev.filter(n => n !== activeChat.name) : [...prev, activeChat.name]
    )
    setShowChatMenu(false)
  }

  const toggleBlock = () => {
    if (!activeChat) return
    const isBlocked = blockedChats.includes(activeChat.name)
    if (!window.confirm(`${isBlocked ? 'Unblock' : 'Block'} ${activeChat.name}?`)) return
    setBlockedChats(prev =>
      isBlocked ? prev.filter(n => n !== activeChat.name) : [...prev, activeChat.name]
    )
    setShowChatMenu(false)
  }

  const saveEdit = async (field) => {
    if (field === 'name') setProfileName(editValue)
    if (field === 'about') setProfileAbout(editValue)
    if (field === 'phone') setProfilePhone(editValue)
    setEditingField(null)
    try {
      const user = auth.currentUser
      if (!user) return
      const docRef = doc(db, 'users', user.uid)
      if (field === 'about') {
        await setDoc(docRef, { about: editValue }, { merge: true })
      }
    } catch (err) {
      console.log('Error saving profile:', err)
    }
  }

  const handleLogout = async () => {
    try {
      const user = auth.currentUser
      if (user) {
        await setDoc(doc(db, 'users', user.uid), {
          isOnline: false, lastSeen: serverTimestamp()
        }, { merge: true })
      }
      if (unsubscribeRef.current) unsubscribeRef.current()
      await signOut(auth)
      navigate('/')
    } catch (err) {
      console.log('Logout error:', err)
    }
  }

  const toggleContact = (contact) => {
    setSelectedContacts(prev =>
      prev.find(c => c.name === contact.name)
        ? prev.filter(c => c.name !== contact.name)
        : [...prev, contact]
    )
  }

  const createGroup = () => {
    if (!groupName.trim()) return alert('Please enter a group name!')
    if (selectedContacts.length < 2) return alert('Please select at least 2 contacts!')
    const newGroup = {
      name: groupName, color: '#FFC107',
      initial: groupName[0].toUpperCase(),
      msg: `${selectedContacts.length} members`,
      time: 'Now', isGroup: true,
    }
    setGroupList(prev => [...prev, newGroup])
    setGroupName('')
    setSelectedContacts([])
    setActivePanel('chats')
    openChat(newGroup)
  }

  const postStatus = () => {
    if (!statusInput.trim()) return
    setMyStatusText(statusInput)
    setPostedStatuses(prev => [{ text: statusInput, time: 'Just now' }, ...prev])
    setStatusInput('')
    setShowStatusInput(false)
  }

  const viewStatus = (name, color, initial, time, text) => {
    setStatusViewer({ name, color, initial, time, text })
    setStatusProgress(0)
    setTimeout(() => setStatusProgress(100), 50)
    if (statusTimerRef.current) clearTimeout(statusTimerRef.current)
    statusTimerRef.current = setTimeout(() => setStatusViewer(null), 5000)
  }

  const closeStatusViewer = () => {
    setStatusViewer(null)
    if (statusTimerRef.current) clearTimeout(statusTimerRef.current)
    setStatusProgress(0)
  }

  const startEdit = (field, value) => {
    setEditingField(field)
    setEditValue(value)
  }

  const changeAvatar = () => {
    const colors = ['#e74c3c', '#3498db', '#9b59b6', '#1abc9c', '#e67e22', '#27ae60', '#f39c12']
    setAvatarColor(colors[Math.floor(Math.random() * colors.length)])
  }

  const formatTime = (timestamp) => {
    if (!timestamp) return ''
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
  }

  const renderTick = (status) => {
    if (status === 'seen') return <span style={{ color: '#4fc3f7', fontSize: '11px', marginLeft: '4px' }}>✓✓</span>
    if (status === 'delivered') return <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '11px', marginLeft: '4px' }}>✓✓</span>
    return <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', marginLeft: '4px' }}>✓</span>
  }

  const allContacts = [...contacts, ...groupList]

  const filteredChats = allContacts
    .filter(c => {
      const matchSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase())
      if (filterType === 'groups') return c.isGroup && matchSearch
      if (filterType === 'unread') return c.unread && matchSearch
      return matchSearch
    })
    .sort((a, b) => {
      const aPin = pinnedChats.includes(a.name)
      const bPin = pinnedChats.includes(b.name)
      return aPin === bPin ? 0 : aPin ? -1 : 1
    })

  const filteredMessages = messages.filter(msg =>
    msg.text?.toLowerCase().includes(searchQuery.toLowerCase()) || !searchQuery
  )

  

  const settingIconBox = (bg, icon, color) => (
    <div style={{
      width: '38px', height: '38px', borderRadius: '12px',
      background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
    }}>
      <i className={`pi ${icon}`} style={{ color, fontSize: '16px' }}></i>
    </div>
  )

  return (
    <div className="chat-app">

      <header className="chat-navbar">
        <div className="chat-navbar-left">
          <div className="chat-navbar-logo">⚡ SovrChats</div>
        </div>
        <div className="chat-navbar-right">
          <button onClick={toggleTheme} title="Toggle Theme">
            <i className={isDark ? 'pi pi-sun' : 'pi pi-moon'}></i>
          </button>
          <button onClick={() => navigate('/')} title="Home">
            <i className="pi pi-home"></i>
          </button>
        </div>
      </header>

      <div className="chat-body">

        <div className="chat-sidebar">
          <div className="sidebar-top">
            <button className={`sidebar-btn ${activePanel === 'chats' ? 'active' : ''}`}
              onClick={() => { setActivePanel('chats'); setActiveChat(null) }} data-tooltip="Chats">
              <i className="pi pi-comments"></i>
            </button>
            <button className={`sidebar-btn ${activePanel === 'group' ? 'active' : ''}`}
              onClick={() => setActivePanel('group')} data-tooltip="New Group">
              <i className="pi pi-users"></i>
            </button>
            <button className={`sidebar-btn ${activePanel === 'status' ? 'active' : ''}`}
              onClick={() => setActivePanel('status')} data-tooltip="Status">
              <i className="pi pi-clock"></i>
            </button>
          </div>
             <button
               className={`sidebar-btn ${showVerification ? 'active' : ''}`}
                onClick={() => setShowVerification(true)}
               data-tooltip="Verify Identity"
             >
               <i className="pi pi-shield"></i>
             </button>

          <div className="sidebar-bottom">
            <button className={`sidebar-btn ${activePanel === 'settings' ? 'active' : ''}`}
              onClick={() => setActivePanel('settings')} data-tooltip="Settings">
              <i className="pi pi-cog"></i>
            </button>
            <button className={`sidebar-btn ${activePanel === 'profile' ? 'active' : ''}`}
              onClick={() => setActivePanel('profile')} data-tooltip="Profile">
              <i className="pi pi-user"></i>
            </button>
          </div>
        </div>

        <div className="chat-list-panel" style={{ display: ['settings', 'profile', 'status', 'group'].includes(activePanel) ? 'none' : 'flex' }}>
          <div className="chat-list-header">
            <h2>Messages</h2>
            <div className="chat-search">
              <i className="pi pi-search"></i>
              <input type="text" placeholder="Search chats..."
                value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
              {searchQuery && (
                <i className="pi pi-times" style={{ cursor: 'pointer', color: '#FFC107' }}
                  onClick={() => setSearchQuery('')}></i>
              )}
            </div>
          </div>
          <div className="filter-tabs">
            {['all', 'unread', 'groups'].map(type => (
              <button key={type}
                className={`filter-tab ${filterType === type ? 'active' : ''}`}
                onClick={() => setFilterType(type)}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
          <div className="chat-list">
            {filteredChats.length === 0 && (
              <div style={{ textAlign: 'center', color: '#aaa', fontSize: '13px', padding: '20px' }}>
                No chats found 🔍
              </div>
            )}
            {filteredChats.map((contact, i) => (
              <div key={i}
                className={`chat-item ${activeChat?.name === contact.name ? 'active-chat' : ''}`}
                onClick={() => openChat(contact)}>
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <div className="avatar" style={{ backgroundColor: contact.color }}>
                    {contact.isGroup ? <i className="pi pi-users"></i> : contact.initial}
                  </div>
                  {!contact.isGroup && (
                    <div style={{
                      position: 'absolute', bottom: 0, right: 0,
                      width: '10px', height: '10px', borderRadius: '50%',
                      background: blockedChats.includes(contact.name) ? '#e74c3c' : '#2ecc71',
                      border: '2px solid white',
                    }}></div>
                  )}
                </div>
                <div className="chat-info">
                  <div className="chat-top">
                    <span className="chat-name">
                      {pinnedChats.includes(contact.name) && <span style={{ color: '#FFC107', fontSize: '10px' }}>📌 </span>}
                      {contact.name}
                      {mutedChats.includes(contact.name) && <span style={{ color: '#aaa', fontSize: '11px', marginLeft: '4px' }}>🔇</span>}
                    </span>
                    <span className="chat-time">{contact.time}</span>
                  </div>
                  <div className="chat-bottom">
                    <span className="chat-msg">
                      {blockedChats.includes(contact.name) ? '🚫 Blocked' : contact.msg}
                    </span>
                    {contact.unread && !mutedChats.includes(contact.name) && (
                      <span className="unread-badge">{contact.unread}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="chat-area">

          {activePanel === 'chats' && !activeChat && (
            <div className="welcome-screen">
              <div className="welcome-icon"><i className="pi pi-comments"></i></div>
              <h2>Welcome to SovrChats</h2>
              <p>Select a conversation to start chatting</p>
            </div>
          )}

          {activePanel === 'chats' && activeChat && (
            <div className="chat-window">
              <div className="chat-header">
                <div className="chat-header-left">
                  <div style={{ position: 'relative' }}>
                    <div className="avatar" style={{ backgroundColor: activeChat.color, width: '40px', height: '40px' }}>
                      {activeChat.isGroup ? <i className="pi pi-users"></i> : activeChat.initial}
                    </div>
                    {!activeChat.isGroup && (
                      <div style={{
                        position: 'absolute', bottom: 0, right: 0,
                        width: '10px', height: '10px', borderRadius: '50%',
                        background: blockedChats.includes(activeChat.name) ? '#e74c3c' : isOnline ? '#2ecc71' : '#aaa',
                        border: '2px solid white',
                      }}></div>
                    )}
                  </div>
                  <div>
                    <div className="chat-header-name">
                      {activeChat.name}
                      {pinnedChats.includes(activeChat.name) && <span style={{ fontSize: '12px', marginLeft: '6px' }}>📌</span>}
                      {mutedChats.includes(activeChat.name) && <span style={{ fontSize: '12px', marginLeft: '4px' }}>🔇</span>}
                      {disappearingMessages && <span style={{ fontSize: '11px', marginLeft: '6px', color: '#f39c12' }}>⏱️</span>}
                    </div>
                    <div className="chat-header-status" style={{
                      color: blockedChats.includes(activeChat.name) ? '#e74c3c' : isOnline ? '#2ecc71' : '#aaa'
                    }}>
                      {blockedChats.includes(activeChat.name) ? '🚫 Blocked' : isOnline ? '● Online' : '○ Offline'}
                    </div>
                  </div>
                </div>
                <div className="chat-header-icons">
                  <button onClick={() => setActiveCall('audio')} title="Audio Call">
                    <i className="pi pi-phone"></i>
                  </button>
                  <button onClick={() => setActiveCall('video')} title="Video Call">
                    <i className="pi pi-video"></i>
                  </button>
                  <div style={{ position: 'relative' }}>
                    <button onClick={() => setShowChatMenu(prev => !prev)}
                      style={{ background: showChatMenu ? '#fff0e0' : '', color: showChatMenu ? '#FFC107' : '' }}>
                      <i className="pi pi-ellipsis-v"></i>
                    </button>
                    {showChatMenu && (
                      <div style={{
                        position: 'absolute', top: '42px', right: 0,
                        background: isDark ? '#1e1e1e' : 'white',
                        borderRadius: '14px',
                        boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
                        border: `1px solid ${isDark ? 'rgba(255,132,17,0.2)' : 'rgba(255,132,17,0.15)'}`,
                        minWidth: '210px', zIndex: 999, overflow: 'hidden'
                      }}>
                        <div className="chat-menu-item" onClick={() => { setShowContactInfo(true); setShowChatMenu(false) }}>
                          <i className="pi pi-user" style={{ color: '#3498db' }}></i><span>Contact Info</span>
                        </div>
                        <div className="chat-menu-item" onClick={togglePin}>
                          <i className="pi pi-map-marker" style={{ color: '#FFC107' }}></i>
                          <span>{pinnedChats.includes(activeChat?.name) ? 'Unpin Chat' : 'Pin Chat'}</span>
                          {pinnedChats.includes(activeChat?.name) && (
                            <span style={{ marginLeft: 'auto', fontSize: '10px', background: '#FFC107', color: 'white', padding: '2px 6px', borderRadius: '6px' }}>ON</span>
                          )}
                        </div>
                        <div className="chat-menu-item" onClick={toggleMute}>
                          <i className={`pi ${mutedChats.includes(activeChat?.name) ? 'pi-volume-up' : 'pi-volume-off'}`} style={{ color: '#9b59b6' }}></i>
                          <span>{mutedChats.includes(activeChat?.name) ? 'Unmute' : 'Mute'}</span>
                        </div>
                        <div className="chat-menu-item" onClick={() => { setShowWallpaperPicker(true); setShowChatMenu(false) }}>
                          <i className="pi pi-palette" style={{ color: '#2ecc71' }}></i><span>Chat Wallpaper</span>
                        </div>
                        <div className="chat-menu-item" onClick={() => { setDisappearingMessages(prev => !prev); setShowChatMenu(false) }}>
                          <i className="pi pi-clock" style={{ color: '#f39c12' }}></i>
                          <span>Disappearing Msgs</span>
                          <span style={{ marginLeft: 'auto', fontSize: '10px', background: disappearingMessages ? '#2ecc71' : '#eee', color: disappearingMessages ? 'white' : '#aaa', padding: '2px 6px', borderRadius: '6px' }}>
                            {disappearingMessages ? 'ON' : 'OFF'}
                          </span>
                        </div>
                        <div className="chat-menu-item" onClick={clearMessages}>
                          <i className="pi pi-trash" style={{ color: '#e67e22' }}></i><span>Clear Messages</span>
                        </div>
                        <div style={{ height: '1px', background: 'rgba(0,0,0,0.06)', margin: '4px 0' }}></div>
                        <div className="chat-menu-item" onClick={toggleBlock}>
                          <i className="pi pi-ban" style={{ color: '#e74c3c' }}></i>
                          <span style={{ color: '#e74c3c' }}>
                            {blockedChats.includes(activeChat?.name) ? 'Unblock' : 'Block Contact'}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {blockedChats.includes(activeChat?.name) && (
                <div style={{ padding: '8px 16px', background: '#fee2e2', borderBottom: '1px solid #fca5a5', fontSize: '12px', color: '#dc2626', textAlign: 'center' }}>
                  🚫 You have blocked this contact. <span style={{ cursor: 'pointer', textDecoration: 'underline' }} onClick={toggleBlock}>Unblock</span>
                </div>
              )}
              {disappearingMessages && (
                <div style={{ padding: '6px 16px', background: '#fff8e1', borderBottom: '1px solid #ffe082', fontSize: '12px', color: '#f59e0b', textAlign: 'center' }}>
                  ⏱️ Disappearing messages ON — messages delete in 30s
                </div>
              )}
              {searchQuery && (
                <div style={{ padding: '8px 16px', background: '#fff8f2', borderBottom: '1px solid rgba(255,132,17,0.1)', fontSize: '12px', color: '#FFC107' }}>
                  🔍 Searching: "{searchQuery}" — {filteredMessages.length} results
                </div>
              )}

              <div className="messages-area"
                style={{ background: chatWallpaper || '' }}
                onClick={() => { setShowEmojiPicker(false); setShowChatMenu(false) }}>
                {filteredMessages.length === 0 && (
                  <div style={{ textAlign: 'center', color: '#aaa', fontSize: '13px', marginTop: '20px' }}>
                    {searchQuery ? `No messages found for "${searchQuery}"` : 'No messages yet. Say hello! 👋'}
                  </div>
                )}
                {filteredMessages.map((msg, i) => (
                  <div key={msg.id || i} className={`message ${msg.from === 'me' ? 'message-me' : 'message-them'}`}>
                    <span>{msg.text}</span>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '3px', marginTop: '4px' }}>
                      <span style={{ fontSize: '10px', opacity: 0.75, color: msg.from === 'me' ? 'rgba(255,255,255,0.85)' : '#aaa' }}>
                        {formatTime(msg.createdAt)}
                      </span>
                      {msg.from === 'me' && renderTick(msg.status)}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <div style={{ position: 'relative' }}>
                {showEmojiPicker && (
                  <div style={{ position: 'absolute', bottom: '65px', left: '10px', zIndex: 999 }}>
                    <EmojiPicker
                      onEmojiClick={(emojiData) => { setInputText(prev => prev + emojiData.emoji); setShowEmojiPicker(false) }}
                      theme={isDark ? 'dark' : 'light'} height={380} width={320} />
                  </div>
                )}
                <input type="file" ref={fileInputRef} style={{ display: 'none' }}
                  onChange={handleFileChange} accept="image/*,video/*,.pdf,.doc,.docx,.txt,.zip" />
                <div className="message-input-box">
                  <button className="input-icon-btn" onClick={() => setShowEmojiPicker(prev => !prev)}
                    style={{ color: showEmojiPicker ? '#FFC107' : '' }}>
                    <i className="pi pi-face-smile"></i>
                  </button>
                  <button className="input-icon-btn" onClick={() => fileInputRef.current.click()}>
                    <i className="pi pi-paperclip"></i>
                  </button>
                  <input type="text"
                    placeholder={blockedChats.includes(activeChat?.name) ? 'Unblock to send messages' : 'Type a message...'}
                    value={inputText} disabled={blockedChats.includes(activeChat?.name)}
                    onChange={e => setInputText(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { sendMessage(); setShowEmojiPicker(false) } }} />
                  <button onClick={sendMessage}><i className="pi pi-send"></i></button>
                </div>
              </div>
            </div>
          )}

          {activePanel === 'group' && (
            <div className="side-panel" style={{ width: '100%', maxWidth: '100%' }}>
              <div className="panel-header">
                <h2>New Group</h2>
                <button className="panel-close-btn" onClick={() => setActivePanel('chats')}><i className="pi pi-times"></i></button>
              </div>
              <div className="group-name-section">
                <input type="text" placeholder="Enter Group Name..." value={groupName} onChange={e => setGroupName(e.target.value)} />
              </div>
              <div className="group-contacts-title">Select Contacts</div>
              <div className="group-contacts-list">
                {contacts.map((c, i) => (
                  <div key={i} className={`group-contact-item ${selectedContacts.find(s => s.name === c.name) ? 'selected' : ''}`}
                    onClick={() => toggleContact(c)}>
                    <div className="avatar" style={{ backgroundColor: c.color, borderRadius: '12px' }}>{c.initial}</div>
                    <div className="contact-info">
                      <div className="contact-name">{c.name}</div>
                      <div className="contact-status">Hey there!</div>
                    </div>
                    <div className="select-check">
                      <i className={selectedContacts.find(s => s.name === c.name) ? 'pi pi-check-circle' : 'pi pi-circle'}></i>
                    </div>
                  </div>
                ))}
              </div>
              <div className="group-create-footer">
                <button className="create-group-btn" onClick={createGroup}>
                  <i className="pi pi-check"></i> Create Group
                </button>
              </div>
            </div>
          )}

          {activePanel === 'status' && (
            <div className="side-panel" style={{ width: '100%', maxWidth: '100%' }}>
              <div className="panel-header">
                <h2>Status</h2>
                <button className="panel-close-btn" onClick={() => setActivePanel('chats')}><i className="pi pi-times"></i></button>
              </div>
              <div className="status-my-section">
                <div className="status-my-item" onClick={() => setShowStatusInput(!showStatusInput)}>
                  <div className="avatar status-avatar" style={{ backgroundColor: avatarColor, borderRadius: '14px' }}>
                    {profileName[0]}<div className="status-add-btn">+</div>
                  </div>
                  <div className="status-my-info">
                    <div className="status-my-name">My Status</div>
                    <div className="status-my-sub">{myStatusText}</div>
                  </div>
                </div>
              </div>
              {showStatusInput && (
                <div className="status-input-section" style={{ display: 'flex' }}>
                  <input type="text" placeholder="Type your status..." value={statusInput} onChange={e => setStatusInput(e.target.value)} />
                  <button className="status-post-btn" onClick={postStatus}><i className="pi pi-send"></i> Post</button>
                </div>
              )}
              <div className="status-section-title">Recent Updates</div>
              <div className="status-list">
                {postedStatuses.map((s, i) => (
                  <div key={i} className="status-item" onClick={() => viewStatus('You', avatarColor, profileName[0], s.time, s.text)}>
                    <div className="avatar status-ring-active" style={{ backgroundColor: avatarColor, borderRadius: '14px' }}>{profileName[0]}</div>
                    <div className="status-info">
                      <div className="status-name">You</div>
                      <div className="status-time">{s.time} • {s.text}</div>
                    </div>
                  </div>
                ))}
                {[
                  { name: 'Ritika', color: '#e74c3c', initial: 'R', time: '2 min ago', text: 'Hey there! 😊' },
                  { name: 'Rishab', color: '#3498db', initial: 'R', time: '15 min ago', text: 'Chill kar raha hoon 🎵' },
                  { name: 'Aradhana', color: '#9b59b6', initial: 'A', time: '1 hour ago', text: 'Busy with work 💼' },
                  { name: 'Sadhana', color: '#1abc9c', initial: 'S', time: '3 hours ago', text: 'Good morning! ☀️' },
                ].map((s, i) => (
                  <div key={i} className="status-item" onClick={() => viewStatus(s.name, s.color, s.initial, s.time, s.text)}>
                    <div className="avatar status-ring" style={{ backgroundColor: s.color, borderRadius: '14px' }}>{s.initial}</div>
                    <div className="status-info">
                      <div className="status-name">{s.name}</div>
                      <div className="status-time">{s.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ← UPDATED SETTINGS PANEL */}
          {activePanel === 'settings' && (
            <div className="side-panel" style={{ width: '100%', maxWidth: '100%' }}>
              <div className="panel-header">
                <h2>Settings</h2>
                <button className="panel-close-btn" onClick={() => setActivePanel('chats')}><i className="pi pi-times"></i></button>
              </div>
              <div className="profile-info-section">

                {/* Profile Card */}
                <div style={{
                  margin: '0 0 16px', padding: '16px',
                  background: isDark ? '#222' : '#fff8f2',
                  borderRadius: '16px',
                  border: '1px solid rgba(255,132,17,0.15)',
                  display: 'flex', alignItems: 'center', gap: '14px',
                  cursor: 'pointer'
                }} onClick={() => setActivePanel('profile')}>
                  <div style={{
                    width: '56px', height: '56px', borderRadius: '18px',
                    backgroundColor: avatarColor,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '22px', fontWeight: 800, color: 'white',
                    boxShadow: `0 4px 12px ${avatarColor}66`,
                    position: 'relative', flexShrink: 0
                  }}>
                    {profileName[0]}
                    <div style={{
                      position: 'absolute', bottom: -2, right: -2,
                      width: '14px', height: '14px', borderRadius: '50%',
                      background: '#2ecc71', border: '2px solid white'
                    }}></div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: isDark ? '#e0e0e0' : '#111' }}>{profileName}</div>
                    <div style={{ fontSize: '12px', color: '#aaa', marginTop: '2px' }}>{profileAbout}</div>
                  </div>
                  <i className="pi pi-chevron-right" style={{ color: '#FFC107', fontSize: '14px' }}></i>
                </div>

                {/* Notifications */}
                <div style={{ fontSize: '11px', fontWeight: 800, color: '#FFC107', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px', paddingLeft: '4px' }}>
                  🔔 Notifications
                </div>
                {[
                  { icon: 'pi-bell', label: 'Message Notifications', sub: 'Show alerts for new messages', bg: 'rgba(255,132,17,0.1)', color: '#FFC107' },
                  { icon: 'pi-volume-up', label: 'Sound', sub: 'Play sound on new message', bg: 'rgba(52,152,219,0.1)', color: '#3498db' },
                  { icon: 'pi-mobile', label: 'Vibration', sub: 'Vibrate on notification', bg: 'rgba(155,89,182,0.1)', color: '#9b59b6' },
                ].map((item, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '12px 14px', marginBottom: '6px',
                    background: isDark ? '#1e1e1e' : 'white',
                    borderRadius: '14px',
                    border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'}`,
                  }}>
                    {settingIconBox(item.bg, item.icon, item.color)}
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: isDark ? '#e0e0e0' : '#111' }}>{item.label}</div>
                      <div style={{ fontSize: '11px', color: '#aaa', marginTop: '2px' }}>{item.sub}</div>
                    </div>
                    <label className="toggle">
                      <input type="checkbox" defaultChecked />
                      <span className="slider"></span>
                    </label>
                  </div>
                ))}

                {/* Privacy */}
                <div style={{ fontSize: '11px', fontWeight: 800, color: '#FFC107', letterSpacing: '1px', textTransform: 'uppercase', margin: '16px 0 8px', paddingLeft: '4px' }}>
                  🔒 Privacy
                </div>
                {[
                  { icon: 'pi-eye', label: 'Last Seen', bg: 'rgba(52,152,219,0.1)', color: '#3498db' },
                  { icon: 'pi-image', label: 'Profile Photo', bg: 'rgba(26,188,156,0.1)', color: '#1abc9c' },
                  { icon: 'pi-check-circle', label: 'Read Receipts', bg: 'rgba(255,132,17,0.1)', color: '#FFC107' },
                ].map((item, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '12px 14px', marginBottom: '6px',
                    background: isDark ? '#1e1e1e' : 'white',
                    borderRadius: '14px',
                    border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'}`,
                  }}>
                    {settingIconBox(item.bg, item.icon, item.color)}
                    <div style={{ flex: 1, fontSize: '14px', fontWeight: 600, color: isDark ? '#e0e0e0' : '#111' }}>{item.label}</div>
                    <select className="settings-select" style={{ fontSize: '12px' }}>
                      <option>Everyone</option>
                      <option>Contacts</option>
                      <option>Nobody</option>
                    </select>
                  </div>
                ))}

                {/* Appearance */}
                <div style={{ fontSize: '11px', fontWeight: 800, color: '#FFC107', letterSpacing: '1px', textTransform: 'uppercase', margin: '16px 0 8px', paddingLeft: '4px' }}>
                  🎨 Appearance
                </div>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '12px 14px', marginBottom: '6px',
                  background: isDark ? '#1e1e1e' : 'white',
                  borderRadius: '14px',
                  border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'}`,
                }}>
                  {settingIconBox('rgba(155,89,182,0.1)', 'pi-moon', '#9b59b6')}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: isDark ? '#e0e0e0' : '#111' }}>Dark Mode</div>
                    <div style={{ fontSize: '11px', color: '#aaa', marginTop: '2px' }}>{isDark ? 'Dark theme active' : 'Light theme active'}</div>
                  </div>
                  <label className="toggle">
                    <input type="checkbox" checked={isDark} onChange={toggleTheme} />
                    <span className="slider"></span>
                  </label>
                </div>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '12px 14px', marginBottom: '6px',
                  background: isDark ? '#1e1e1e' : 'white',
                  borderRadius: '14px',
                  border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'}`,
                }}>
                  {settingIconBox('rgba(255,132,17,0.1)', 'pi-palette', '#FFC107')}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: isDark ? '#e0e0e0' : '#111' }}>Chat Wallpaper</div>
                    <div style={{ fontSize: '11px', color: '#aaa', marginTop: '2px' }}>Customize chat background</div>
                  </div>
                  <button onClick={() => { setShowWallpaperPicker(true); setActivePanel('chats') }} style={{
                    padding: '6px 12px', borderRadius: '8px',
                    border: 'none', background: '#fff0e0',
                    color: '#FFC107', fontSize: '12px', fontWeight: 700, cursor: 'pointer'
                  }}>Change</button>
                </div>

                {/* Chat Features */}
                <div style={{ fontSize: '11px', fontWeight: 800, color: '#FFC107', letterSpacing: '1px', textTransform: 'uppercase', margin: '16px 0 8px', paddingLeft: '4px' }}>
                  💬 Chat Features
                </div>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '12px 14px', marginBottom: '6px',
                  background: isDark ? '#1e1e1e' : 'white',
                  borderRadius: '14px',
                  border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'}`,
                }}>
                  {settingIconBox('rgba(241,196,15,0.1)', 'pi-clock', '#f39c12')}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: isDark ? '#e0e0e0' : '#111' }}>Disappearing Messages</div>
                    <div style={{ fontSize: '11px', color: '#aaa', marginTop: '2px' }}>Auto-delete after 30 seconds</div>
                  </div>
                  <label className="toggle">
                    <input type="checkbox" checked={disappearingMessages} onChange={() => setDisappearingMessages(prev => !prev)} />
                    <span className="slider"></span>
                  </label>
                </div>

                {/* Account */}
                <div style={{ fontSize: '11px', fontWeight: 800, color: '#e74c3c', letterSpacing: '1px', textTransform: 'uppercase', margin: '16px 0 8px', paddingLeft: '4px' }}>
                  ⚠️ Account
                </div>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '12px 14px', marginBottom: '6px',
                  background: isDark ? '#1e1e1e' : 'white',
                  borderRadius: '14px',
                  border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'}`,
                }}>
                  {settingIconBox('rgba(170,170,170,0.1)', 'pi-info-circle', '#aaa')}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#aaa' }}>App Version</div>
                    <div style={{ fontSize: '11px', color: '#aaa', marginTop: '2px' }}>SovrChats v1.0.0</div>
                  </div>
                </div>
                <div onClick={handleLogout} style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '12px 14px', marginBottom: '20px',
                  background: isDark ? '#1e1e1e' : 'white',
                  borderRadius: '14px',
                  border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'}`,
                  cursor: 'pointer'
                }}>
                  {settingIconBox('rgba(231,76,60,0.1)', 'pi-sign-out', '#e74c3c')}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#e74c3c' }}>Logout</div>
                    <div style={{ fontSize: '11px', color: '#aaa', marginTop: '2px' }}>Sign out of your account</div>
                  </div>
                  <i className="pi pi-chevron-right" style={{ color: '#e74c3c', fontSize: '12px' }}></i>
                </div>

              </div>
            </div>
          )}

          {/* ← UPDATED PROFILE PANEL */}
          {activePanel === 'profile' && (
            <div className="side-panel" style={{ width: '100%', maxWidth: '100%' }}>
              <div className="profile-header">
                <button className="profile-close-btn" onClick={() => setActivePanel('chats')}>
                  <i className="pi pi-times"></i>
                </button>
                <div className="profile-avatar-section">
                  <div className="profile-avatar" style={{ backgroundColor: avatarColor }}>
                    {profileName[0]}
                  </div>
                  <div className="profile-avatar-overlay" onClick={changeAvatar}>
                    <i className="pi pi-camera"></i>
                  </div>
                </div>
                <div style={{ marginTop: '12px', textAlign: 'center' }}>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: isDark ? '#e0e0e0' : '#111' }}>{profileName}</div>
                  <div style={{ fontSize: '12px', color: '#2ecc71', marginTop: '4px' }}>● Online</div>
                </div>
              </div>

              <div className="profile-info-section">
                {[
                  { field: 'name', label: 'Your Name', icon: 'pi-user', value: profileName },
                  { field: 'about', label: 'About', icon: 'pi-info-circle', value: profileAbout },
                  { field: 'phone', label: 'Phone', icon: 'pi-phone', value: profilePhone },
                ].map(({ field, label, icon, value }) => (
                  <div className="profile-field" key={field}>
                    <div className="profile-field-label">
                      <i className={`pi ${icon}`}></i> {label}
                    </div>
                    {editingField === field ? (
                      <div className="profile-field-edit" style={{ display: 'flex' }}>
                        <input type="text" value={editValue} onChange={e => setEditValue(e.target.value)} autoFocus />
                        <div className="profile-edit-actions">
                          <i className="pi pi-times" onClick={() => setEditingField(null)}></i>
                          <i className="pi pi-check" onClick={() => saveEdit(field)}></i>
                        </div>
                      </div>
                    ) : (
                      <div className="profile-field-value">{value}</div>
                    )}
                    {editingField !== field && (
                      <i className="pi pi-pencil profile-edit-icon" onClick={() => startEdit(field, value)}></i>
                    )}
                  </div>
                ))}

                <div className="profile-field">
                  <div className="profile-field-label">
                    <i className="pi pi-palette"></i> Avatar Color
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
                    {['#FFC107', '#e74c3c', '#3498db', '#9b59b6', '#1abc9c', '#e67e22', '#27ae60', '#f39c12'].map((color, i) => (
                      <div key={i} onClick={() => setAvatarColor(color)} style={{
                        width: '28px', height: '28px', borderRadius: '8px',
                        backgroundColor: color, cursor: 'pointer',
                        border: avatarColor === color ? '3px solid #111' : '2px solid transparent',
                        boxShadow: avatarColor === color ? `0 0 0 2px ${color}` : 'none',
                        transition: 'all 0.2s'
                      }}></div>
                    ))}
                  </div>
                </div>

                <div className="profile-field">
                  <div className="profile-field-label">
                    <i className="pi pi-chart-bar"></i> My Stats
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '10px' }}>
                    {[
                      { icon: '💬', label: 'Messages Sent', value: messages.filter(m => m.from === 'me').length },
                      { icon: '👥', label: 'Active Chats', value: allContacts.length },
                      { icon: '📌', label: 'Pinned Chats', value: pinnedChats.length },
                      { icon: '🚫', label: 'Blocked', value: blockedChats.length },
                    ].map((s, i) => (
                      <div key={i} style={{
                        background: isDark ? '#222' : '#fff8f2',
                        borderRadius: '12px', padding: '12px', textAlign: 'center',
                        border: '1px solid rgba(255,132,17,0.1)'
                      }}>
                        <div style={{ fontSize: '20px', marginBottom: '4px' }}>{s.icon}</div>
                        <div style={{ fontSize: '18px', fontWeight: 800, color: '#FFC107' }}>{s.value}</div>
                        <div style={{ fontSize: '10px', color: '#aaa', marginTop: '2px' }}>{s.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="profile-field">
                  <div className="profile-field-label">
                    <i className="pi pi-shield"></i> Account Info
                  </div>
                  <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {[
                      { icon: '✅', label: 'Aadhaar Verified', value: 'Verified', color: '#2ecc71' },
                      { icon: '🔒', label: 'Encryption', value: 'End-to-end', color: '#3498db' },
                      { icon: '📅', label: 'Member Since', value: 'Jan 2024', color: '#FFC107' },
                      { icon: '🌐', label: 'Platform', value: 'Web + Mobile', color: '#9b59b6' },
                    ].map((item, i) => (
                      <div key={i} style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '8px 12px',
                        background: isDark ? '#222' : '#f9f9f9',
                        borderRadius: '10px', fontSize: '13px'
                      }}>
                        <span style={{ color: isDark ? '#ccc' : '#555' }}>{item.icon} {item.label}</span>
                        <span style={{ color: item.color, fontWeight: 700, fontSize: '12px' }}>{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="profile-field">
                  <div className="profile-field-label">
                    <i className="pi pi-sliders-h"></i> Quick Settings
                  </div>
                  <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: isDark ? '#222' : '#f9f9f9', borderRadius: '10px', fontSize: '13px' }}>
                      <span style={{ color: isDark ? '#ccc' : '#555' }}>⏱️ Disappearing Messages</span>
                      <label className="toggle">
                        <input type="checkbox" checked={disappearingMessages} onChange={() => setDisappearingMessages(prev => !prev)} />
                        <span className="slider"></span>
                      </label>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: isDark ? '#222' : '#f9f9f9', borderRadius: '10px', fontSize: '13px' }}>
                      <span style={{ color: isDark ? '#ccc' : '#555' }}>🌙 Dark Mode</span>
                      <label className="toggle">
                        <input type="checkbox" checked={isDark} onChange={toggleTheme} />
                        <span className="slider"></span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="profile-logout-section">
                <button className="logout-btn" onClick={handleLogout}>
                  <i className="pi pi-sign-out"></i> Logout
                </button>
              </div>
            </div>
          )}

          {activeCall && activeChat && (
            <CallModal callType={activeCall} contact={activeChat}
              currentUserId={auth.currentUser?.uid || 'guest'} onClose={() => setActiveCall(null)} />
          )}   
           <VerificationPanel
             isOpen={showVerification}
              onClose={() => setShowVerification(false)}
           />
          {showContactInfo && activeChat && (
            <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9998, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              onClick={() => setShowContactInfo(false)}>
              <div style={{ background: isDark ? '#1a1a1a' : 'white', borderRadius: '24px', padding: '32px', width: '320px', textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}
                onClick={e => e.stopPropagation()}>
                <div style={{ width: '80px', height: '80px', borderRadius: '24px', backgroundColor: activeChat.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', fontWeight: 800, color: 'white', margin: '0 auto 16px', boxShadow: `0 6px 20px ${activeChat.color}66` }}>
                  {activeChat.initial}
                </div>
                <h2 style={{ fontSize: '22px', fontWeight: 800, color: isDark ? '#e0e0e0' : '#111', marginBottom: '6px' }}>{activeChat.name}</h2>
                <p style={{ color: '#2ecc71', fontSize: '13px', marginBottom: '20px' }}>● Online</p>
                <div style={{ textAlign: 'left', background: isDark ? '#222' : '#f9f9f9', borderRadius: '14px', padding: '16px', marginBottom: '16px' }}>
                  {[
                    { icon: 'pi-phone', label: 'Phone', value: '+91 98765 43210' },
                    { icon: 'pi-info-circle', label: 'About', value: 'Hey there! I am using SovrChats' },
                    { icon: 'pi-calendar', label: 'Joined', value: 'January 2024' },
                  ].map((item, i) => (
                    <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '8px 0', borderBottom: i < 2 ? `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}` : 'none' }}>
                      <i className={`pi ${item.icon}`} style={{ color: '#FFC107', width: '16px' }}></i>
                      <div>
                        <div style={{ fontSize: '11px', color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{item.label}</div>
                        <div style={{ fontSize: '14px', color: isDark ? '#ccc' : '#333', fontWeight: 500 }}>{item.value}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '10px' }}>
                  <button onClick={() => { setActiveCall('audio'); setShowContactInfo(false) }} style={{ flex: 1, padding: '10px', borderRadius: '12px', border: 'none', background: '#fff0e0', color: '#FFC107', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                    <i className="pi pi-phone"></i> Call
                  </button>
                  <button onClick={() => { setActiveCall('video'); setShowContactInfo(false) }} style={{ flex: 1, padding: '10px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #FFC107, #ffaa55)', color: 'white', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                    <i className="pi pi-video"></i> Video
                  </button>
                </div>
                <button onClick={() => setShowContactInfo(false)} style={{ width: '100%', padding: '10px', borderRadius: '12px', border: `1px solid ${isDark ? '#333' : '#eee'}`, background: 'transparent', color: '#aaa', cursor: 'pointer' }}>Close</button>
              </div>
            </div>
          )}

          {showWallpaperPicker && (
            <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9998, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              onClick={() => setShowWallpaperPicker(false)}>
              <div style={{ background: isDark ? '#1a1a1a' : 'white', borderRadius: '24px', padding: '28px', width: '360px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}
                onClick={e => e.stopPropagation()}>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: isDark ? '#e0e0e0' : '#111', marginBottom: '20px', textAlign: 'center' }}>🎨 Chat Wallpaper</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '20px' }}>
                  {wallpapers.map((w, i) => (
                    <div key={i} onClick={() => { setChatWallpaper(w.value); setShowWallpaperPicker(false) }}
                      style={{ height: '60px', borderRadius: '12px', background: w.value || '#FFF4E8', border: chatWallpaper === w.value ? '3px solid #FFC107' : '2px solid transparent', cursor: 'pointer', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: '5px', boxShadow: chatWallpaper === w.value ? '0 4px 12px rgba(255,132,17,0.3)' : 'none', transition: 'all 0.2s' }}>
                      <span style={{ fontSize: '9px', color: '#666', fontWeight: 600 }}>{w.name}</span>
                    </div>
                  ))}
                </div>
                <button onClick={() => setShowWallpaperPicker(false)} style={{ width: '100%', padding: '10px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #FFC107, #ffaa55)', color: 'white', fontWeight: 700, cursor: 'pointer' }}>Done</button>
              </div>
            </div>
          )}

          {statusViewer && (
            <div className="status-viewer" style={{ display: 'flex' }}>
              <div className="status-viewer-progress">
                <div className="status-progress-bar" style={{ width: `${statusProgress}%`, transition: 'width 5s linear' }}></div>
              </div>
              <div className="status-viewer-header">
                <div className="status-viewer-user">
                  <div className="avatar" style={{ backgroundColor: statusViewer.color, borderRadius: '14px', width: '38px', height: '38px', fontSize: '14px' }}>
                    {statusViewer.initial}
                  </div>
                  <div>
                    <div className="status-viewer-name">{statusViewer.name}</div>
                    <div className="status-viewer-time">{statusViewer.time}</div>
                  </div>
                </div>
                <button className="status-viewer-close" onClick={closeStatusViewer}>
                  <i className="pi pi-times"></i>
                </button>
              </div>
              <div className="status-viewer-content">
                <p>{statusViewer.text}</p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

export default Chat