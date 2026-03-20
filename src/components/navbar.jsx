import { useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'

const Navbar = () => {
  const navigate = useNavigate()
  const { isDark, toggleTheme } = useTheme()

  return (
    <header className="navbar">
      <div className="logo">SOVEREIGN</div>
      <div className="nav-buttons">
        <button onClick={() => navigate('/download')}>Download Now</button>
        <button onClick={() => navigate('/register')}>Register With Aadhaar</button>
        <button className="login-btn" onClick={() => navigate('/chat')}>Login</button>
        <button className="theme-btn" onClick={toggleTheme} title="Toggle Theme">
          <i className={isDark ? 'pi pi-sun' : 'pi pi-moon'}></i>
        </button>
      </div>
    </header>
  )
}

export default Navbar