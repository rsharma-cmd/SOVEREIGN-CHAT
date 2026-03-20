import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'

const chatData = {
  'Ritika': [
    { from: 'them', text: 'Hello, How are you?' },
    { from: 'me', text: 'I am good! What about you?' },
    { from: 'them', text: 'I am doing great, thanks!' },
    { from: 'me', text: 'That is awesome 😊' },
    { from: 'them', text: 'Are you free today?' },
  ],
  'Rishab': [
    { from: 'them', text: 'Hey! Long time no see' },
    { from: 'me', text: 'Yeah it has been a while!' },
    { from: 'them', text: 'We should catch up soon' },
    { from: 'me', text: 'Definitely! Let us plan something' },
  ],
  'Aradhana': [
    { from: 'me', text: 'Did you complete the assignment?' },
    { from: 'them', text: 'Yes just finished it!' },
    { from: 'me', text: 'Great, can you share it?' },
    { from: 'them', text: 'Sure, sending it now' },
    { from: 'them', text: 'Check your email 📧' },
  ],
  'Sadhana': [
    { from: 'them', text: 'Good morning!' },
    { from: 'me', text: 'Good morning! How are you?' },
    { from: 'them', text: 'Fine thank you. Ready for today?' },
    { from: 'me', text: 'Yes absolutely!' },
  ],
  'Rashmika': [
    { from: 'them', text: 'Hello, How are you' },
    { from: 'me', text: 'All good! You?' },
    { from: 'them', text: 'Same here. Did you watch the movie?' },
    { from: 'me', text: 'Not yet, is it good?' },
    { from: 'them', text: 'It is amazing, you must watch it!' },
  ],
  'Suhari': [
    { from: 'me', text: 'Hey Suhari!' },
    { from: 'them', text: 'Hey! What is up?' },
    { from: 'me', text: 'Nothing much, just checking in' },
    { from: 'them', text: 'Aww that is sweet 😊' },
  ],
}

const contacts = [
  { name: 'Ritika', color: '#e74c3c', initial: 'R', msg: 'Are you free today?', time: '12:15', unread: 2 },
  { name: 'Rishab', color: '#3498db', initial: 'R', msg: 'Let us plan something', time: '12:18' },
  { name: 'Aradhana', color: '#9b59b6', initial: 'A', msg: 'Check your email 📧', time: '10:30' },
  { name: 'Sadhana', color: '#1abc9c', initial: 'S', msg: 'Yes absolutely!', time: '09:45' },
  { name: 'Rashmika', color: '#e67e22', initial: 'R', msg: 'You must watch it!', time: '09:13' },
  { name: 'Suhari', color: '#27ae60', initial: 'S', msg: 'Aww that is sweet 😊', time: '08:50' },
]

const Chat = () => {
  const navigate = useNavigate()
  const { isDark, toggleTheme } = useTheme()

  const [activePanel, setActivePanel] = useState('chats')
  const [activeChat, setActiveChat] = useState(null)
  const [messages, setMessages] = useState([])
  const [inputText, setInputText] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [chatList, setChatList] = useState(chatData)
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
  const [avatarColor, setAvatarColor] = useState('#FF8411')

  const messagesEndRef = useRef(null)
  const statusTimerRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const openChat = (contact) => {
    setActiveChat(contact)
    setMessages(chatList[contact.name] || [])
    setActivePanel('chats')
  }

  const sendMessage = () => {
    if (!inputText.trim() || !activeChat) return
    const newMsg = { from: 'me', text: inputText.trim() }
    const updated = [...messages, newMsg]
    setMessages(updated)
    setChatList(prev => ({ ...prev, [activeChat.name]: updated }))
    setInputText('')
    setTimeout(() => {
      const replies = ['okay!', 'Got it!', 'Sure 😊', 'Sounds good!', 'Hmm interesting!']
      const reply = { from: 'them', text: replies[Math.floor(Math.random() * replies.length)] }
      const withReply = [...updated, reply]
      setMessages(withReply)
      setChatList(prev => ({ ...prev, [activeChat.name]: withReply }))
    }, 1000)
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
      name: groupName,
      color: '#FF8411',
      initial: groupName[0].toUpperCase(),
      msg: `${selectedContacts.length} members`,
      time: 'Now',
      isGroup: true,
    }
    setGroupList(prev => [...prev, newGroup])
    setChatList(prev => ({
      ...prev,
      [groupName]: [
        { from: 'them', text: `Welcome to ${groupName}! 🎉` },
        { from: 'them', text: 'Say hello to everyone!' },
      ]
    }))
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

  const saveEdit = (field) => {
    if (field === 'name') setProfileName(editValue)
    if (field === 'about') setProfileAbout(editValue)
    if (field === 'phone') setProfilePhone(editValue)
    setEditingField(null)
  }

  const changeAvatar = () => {
    const colors = ['#e74c3c', '#3498db', '#9b59b6', '#1abc9c', '#e67e22', '#27ae60', '#f39c12']
    setAvatarColor(colors[Math.floor(Math.random() * colors.length)])
  }

  const allContacts = [...contacts, ...groupList]
  const filteredChats = allContacts.filter(c => {
    if (filterType === 'groups') return c.isGroup
    if (filterType === 'unread') return c.unread
    return true
  })

  return (
    <div className="chat-app">

      {/* Top Navbar */}
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

        {/* Floating Sidebar */}
        <div className="chat-sidebar">
          <div className="sidebar-top">
            <button
              className={`sidebar-btn ${activePanel === 'chats' ? 'active' : ''}`}
              onClick={() => { setActivePanel('chats'); setActiveChat(null) }}
              data-tooltip="Chats"
            >
              <i className="pi pi-comments"></i>
            </button>
            <button
              className={`sidebar-btn ${activePanel === 'group' ? 'active' : ''}`}
              onClick={() => setActivePanel('group')}
              data-tooltip="New Group"
            >
              <i className="pi pi-users"></i>
            </button>
            <button
              className={`sidebar-btn ${activePanel === 'status' ? 'active' : ''}`}
              onClick={() => setActivePanel('status')}
              data-tooltip="Status"
            >
              <i className="pi pi-clock"></i>
            </button>
          </div>
          <div className="sidebar-bottom">
            <button
              className={`sidebar-btn ${activePanel === 'settings' ? 'active' : ''}`}
              onClick={() => setActivePanel('settings')}
              data-tooltip="Settings"
            >
              <i className="pi pi-cog"></i>
            </button>
            <button
              className={`sidebar-btn ${activePanel === 'profile' ? 'active' : ''}`}
              onClick={() => setActivePanel('profile')}
              data-tooltip="Profile"
            >
              <i className="pi pi-user"></i>
            </button>
          </div>
        </div>

        {/* Chat List */}
        <div className="chat-list-panel">
          <div className="chat-list-header">
            <h2>Messages</h2>
            <div className="chat-search">
              <i className="pi pi-search"></i>
              <input type="text" placeholder="Search chats..." />
            </div>
          </div>

          <div className="filter-tabs">
            {['all', 'unread', 'groups'].map(type => (
              <button
                key={type}
                className={`filter-tab ${filterType === type ? 'active' : ''}`}
                onClick={() => setFilterType(type)}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>

          <div className="chat-list">
            {filteredChats.map((contact, i) => (
              <div
                key={i}
                className={`chat-item ${activeChat?.name === contact.name ? 'active-chat' : ''}`}
                onClick={() => openChat(contact)}
              >
                <div className="avatar" style={{
                  backgroundColor: contact.color,
                  borderRadius: contact.isGroup ? '14px' : '14px'
                }}>
                  {contact.isGroup ? <i className="pi pi-users"></i> : contact.initial}
                </div>
                <div className="chat-info">
                  <div className="chat-top">
                    <span className="chat-name">{contact.name}</span>
                    <span className="chat-time">{contact.time}</span>
                  </div>
                  <div className="chat-bottom">
                    <span className="chat-msg">{contact.msg}</span>
                    {contact.unread && (
                      <span className="unread-badge">{contact.unread}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="chat-area">

          {/* Welcome Screen */}
          {activePanel === 'chats' && !activeChat && (
            <div className="welcome-screen">
              <div className="welcome-icon">
                <i className="pi pi-comments"></i>
              </div>
              <h2>Welcome to SovrChats</h2>
              <p>Select a conversation to start chatting</p>
            </div>
          )}

          {/* Chat Window */}
          {activePanel === 'chats' && activeChat && (
            <div className="chat-window">
              <div className="chat-header">
                <div className="chat-header-left">
                  <div className="avatar" style={{ backgroundColor: activeChat.color, borderRadius: '14px', width: '40px', height: '40px' }}>
                    {activeChat.isGroup ? <i className="pi pi-users"></i> : activeChat.initial}
                  </div>
                  <div>
                    <div className="chat-header-name">{activeChat.name}</div>
                    <div className="chat-header-status">Online</div>
                  </div>
                </div>
                <div className="chat-header-icons">
                  <button><i className="pi pi-phone"></i></button>
                  <button><i className="pi pi-video"></i></button>
                  <button><i className="pi pi-ellipsis-v"></i></button>
                </div>
              </div>

              <div className="messages-area">
                {messages.map((msg, i) => (
                  <div key={i} className={`message ${msg.from === 'me' ? 'message-me' : 'message-them'}`}>
                    {msg.text}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <div className="message-input-box">
                <button className="input-icon-btn"><i className="pi pi-face-smile"></i></button>
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendMessage()}
                />
                <button onClick={sendMessage}>
                  <i className="pi pi-send"></i>
                </button>
              </div>
            </div>
          )}

          {/* Group Panel */}
          {activePanel === 'group' && (
            <div className="side-panel">
              <div className="panel-header">
                <h2>New Group</h2>
                <button className="panel-close-btn" onClick={() => setActivePanel('chats')}>
                  <i className="pi pi-times"></i>
                </button>
              </div>
              <div className="group-name-section">
                <input
                  type="text"
                  placeholder="Enter Group Name..."
                  value={groupName}
                  onChange={e => setGroupName(e.target.value)}
                />
              </div>
              <div className="group-contacts-title">Select Contacts</div>
              <div className="group-contacts-list">
                {contacts.map((c, i) => (
                  <div
                    key={i}
                    className={`group-contact-item ${selectedContacts.find(s => s.name === c.name) ? 'selected' : ''}`}
                    onClick={() => toggleContact(c)}
                  >
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

          {/* Status Panel */}
          {activePanel === 'status' && (
            <div className="side-panel">
              <div className="panel-header">
                <h2>Status</h2>
                <button className="panel-close-btn" onClick={() => setActivePanel('chats')}>
                  <i className="pi pi-times"></i>
                </button>
              </div>

              <div className="status-my-section">
                <div className="status-my-item" onClick={() => setShowStatusInput(!showStatusInput)}>
                  <div className="avatar status-avatar" style={{ backgroundColor: avatarColor, borderRadius: '14px' }}>
                    Y
                    <div className="status-add-btn">+</div>
                  </div>
                  <div className="status-my-info">
                    <div className="status-my-name">My Status</div>
                    <div className="status-my-sub">{myStatusText}</div>
                  </div>
                </div>
              </div>

              {showStatusInput && (
                <div className="status-input-section" style={{ display: 'flex' }}>
                  <input
                    type="text"
                    placeholder="Type your status..."
                    value={statusInput}
                    onChange={e => setStatusInput(e.target.value)}
                  />
                  <button className="status-post-btn" onClick={postStatus}>
                    <i className="pi pi-send"></i> Post
                  </button>
                </div>
              )}

              <div className="status-section-title">Recent Updates</div>
              <div className="status-list">
                {postedStatuses.map((s, i) => (
                  <div key={i} className="status-item" onClick={() => viewStatus('You', avatarColor, 'Y', s.time, s.text)}>
                    <div className="avatar status-ring-active" style={{ backgroundColor: avatarColor, borderRadius: '14px' }}>Y</div>
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

          {/* Settings Panel */}
          {activePanel === 'settings' && (
            <div className="side-panel">
              <div className="panel-header">
                <h2>Settings</h2>
                <button className="panel-close-btn" onClick={() => setActivePanel('chats')}>
                  <i className="pi pi-times"></i>
                </button>
              </div>
              <div className="settings-section">
                <div className="settings-profile">
                  <div className="avatar settings-avatar" style={{ backgroundColor: avatarColor }}>{profileName[0]}</div>
                  <div>
                    <div className="settings-name">{profileName}</div>
                    <div className="settings-status">{profileAbout}</div>
                  </div>
                </div>
              </div>
              <div className="settings-section">
                <div className="settings-title">Notifications</div>
                <div className="settings-row">
                  <span>Message Notifications</span>
                  <label className="toggle"><input type="checkbox" defaultChecked /><span className="slider"></span></label>
                </div>
                <div className="settings-row">
                  <span>Sound</span>
                  <label className="toggle"><input type="checkbox" defaultChecked /><span className="slider"></span></label>
                </div>
              </div>
              <div className="settings-section">
                <div className="settings-title">Privacy</div>
                <div className="settings-row">
                  <span>Last Seen</span>
                  <select className="settings-select"><option>Everyone</option><option>My Contacts</option><option>Nobody</option></select>
                </div>
              </div>
              <div className="settings-section">
                <div className="settings-title">Theme</div>
                <div className="settings-row">
                  <span>Dark Mode</span>
                  <label className="toggle">
                    <input type="checkbox" checked={isDark} onChange={toggleTheme} />
                    <span className="slider"></span>
                  </label>
                </div>
              </div>
              <div className="settings-section">
                <button className="logout-btn" onClick={() => navigate('/')}>
                  <i className="pi pi-sign-out"></i> Logout
                </button>
              </div>
            </div>
          )}

          {/* Profile Panel */}
          {activePanel === 'profile' && (
            <div className="side-panel">
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
                        <input
                          type="text"
                          value={editValue}
                          onChange={e => setEditValue(e.target.value)}
                          autoFocus
                        />
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
              </div>

              <div className="profile-logout-section">
                <button className="logout-btn" onClick={() => navigate('/')}>
                  <i className="pi pi-sign-out"></i> Logout
                </button>
              </div>
            </div>
          )}

          {/* Status Viewer */}
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