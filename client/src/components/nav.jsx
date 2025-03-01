import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FaUser, FaSignInAlt, FaBars, FaTimes } from 'react-icons/fa'

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const handleAuthClick = (path) => {
    navigate(path, {
      state: { background: location }
    })
    setIsMenuOpen(false)
  }

  return (
    <nav className="bg-black/90 backdrop-blur-md sticky top-0 z-50 shadow-lg transition-all duration-300">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="text-red-500 text-xl sm:text-2xl font-bold flex items-center gap-2">
            <span className="text-2xl sm:text-3xl">❤</span>
            Blood Donation
          </Link>

          {/* Mobile menu button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white hover:text-red-500 transition-colors"
          >
            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center justify-center flex-1 px-4">
            <div className="flex space-x-8">
              <Link to="/home" className="text-white hover:text-red-500 transition-colors px-3 py-2 font-medium">
                Home
              </Link>
              <Link to="/donor" className="text-white hover:text-red-500 transition-colors px-3 py-2 font-medium">
                Donate
              </Link>
              <Link to="/request" className="text-white hover:text-red-500 transition-colors px-3 py-2 font-medium">
                Request Blood
              </Link>
              <Link to="/about" className="text-white hover:text-red-500 transition-colors px-3 py-2 font-medium">
                About
              </Link>
            </div>
          </div>

          {/* Desktop Account Section */}
          <div className="hidden md:flex items-center space-x-4">
            <button 
              onClick={() => handleAuthClick('/login')}
              className="flex items-center gap-2 text-white hover:text-red-500 transition-colors font-medium"
            >
              <FaSignInAlt className="text-lg" />
              <span>Login</span>
            </button>
            <Link to="/account" className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700 transition-colors font-medium shadow-lg">
              <FaUser />
              <span>Account</span>
            </Link>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`md:hidden transition-all duration-300 ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
          <div className="flex flex-col gap-2 py-4">
            <Link to="/home" className="text-white hover:text-red-500 transition-colors px-3 py-2 font-medium">
              Home
            </Link>
            <Link to="/donor" className="text-white hover:text-red-500 transition-colors px-3 py-2 font-medium">
              Donate
            </Link>
            <Link to="/request" className="text-white hover:text-red-500 transition-colors px-3 py-2 font-medium">
              Request Blood
            </Link>
            <Link to="/about" className="text-white hover:text-red-500 transition-colors px-3 py-2 font-medium">
              About
            </Link>
            <div className="border-t border-gray-700 my-2"></div>
            <button 
              onClick={() => handleAuthClick('/login')}
              className="flex items-center gap-2 text-white hover:text-red-500 transition-colors px-3 py-2 font-medium w-full"
            >
              <FaSignInAlt className="text-lg" />
              <span>Login</span>
            </button>
            <Link to="/account" className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700 transition-colors mx-3 font-medium shadow-lg w-full justify-center">
              <FaUser />
              <span>Account</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
