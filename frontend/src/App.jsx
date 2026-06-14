import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Valuate from './pages/Valuate'
import History from './pages/History'
import { About } from './pages/About'
import { Contact } from './pages/Contact'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { AuthProvider } from './context/AuthContext'

export default function App() {
  return (
    <AuthProvider>
      <div className="app-shell">
        <Navbar />
        <Routes>
          <Route path="/"        element={<Home />} />
          <Route path="/valuate" element={<Valuate />} />
          <Route path="/history" element={<History />} />
          <Route path="/about"   element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login"   element={<Login />} />
          <Route path="/signup"  element={<Signup />} />
        </Routes>
        <Footer />
      </div>
    </AuthProvider>
  )
}
