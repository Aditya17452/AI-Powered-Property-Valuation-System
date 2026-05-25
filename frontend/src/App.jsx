import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Valuate from './pages/Valuate'
import History from './pages/History'
import { About } from './pages/About'
import { Contact } from './pages/Contact'
import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'

export default function App() {
  return (
    <div className="app-shell">
      <Navbar />
      <Routes>
        <Route path="/"        element={<Home />} />
        <Route path="/valuate" element={<Valuate />} />
        <Route path="/history" element={<History />} />
        <Route path="/about"   element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
      <Footer />
    </div>
  )
}
