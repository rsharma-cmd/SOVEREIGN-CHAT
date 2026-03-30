import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import 'primeicons/primeicons.css'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>,
)

import { LanguageProvider } from './context/LanguageContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <ThemeProvider>
    <LanguageProvider>   {/* ← add karo */}
      <App />
    </LanguageProvider>
  </ThemeProvider>
)