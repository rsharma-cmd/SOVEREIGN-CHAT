import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Register from './pages/Register'
import Mobile from './pages/Mobile'
import Profile from './pages/Profile'
import Success from './pages/Success'
import Download from './pages/Download'
import Chat from './pages/Chat'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/mobile" element={<Mobile />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/success" element={<Success />} />
        <Route path="/download" element={<Download />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App