import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaSignInAlt,
  FaBars,
  FaTimes,
  FaSignOutAlt,
  FaCaretDown,
  FaTint,
  FaHandHoldingHeart,
} from "react-icons/fa";

import myLogo from "../assets/logo.png";
import { toast } from "react-toastify";
import { removeUser } from "../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";

function Navbar() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  console.log(user?.isLoggedIn);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleAuthClick = (path) => {
    navigate(path, {
      state: { background: location },
    });
    setIsMenuOpen(false);
  };

  const handleLogout = async () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen)
    try {
      const response = await fetch(`http://localhost:3000/api/auth/logout`, {
        method: "get",
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        return toast.error(data.message);
      }
      dispatch(removeUser());
      navigate("/");
      toast.success(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleProfileAction = (action) => {
    if (action === "receiver") {
      navigate("/near", { state: { activeTab: "donorList" } });
    } else if (action === "update") {
      navigate("/update", { state: { activeTab: "receiverList" } });
    }
    else {
      navigate(action);
    }
    setIsProfileDropdownOpen(false);
  };

  return (
    <nav className="bg-black backdrop-blur-md sticky top-0 z-50 shadow-xl shadow-black/50 transition-all duration-300">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="text-red-500 text-xl sm:text-2xl font-bold flex items-center gap-2 p-2"
          >
            <img
              src={myLogo}
              alt="Blood Donation Logo"
              style={{
                height: "70px",
                width: "auto",
                padding: "4px",
                filter: "brightness(1.1)", // Makes the image slightly brighter
              }}
              className="hover:scale-105 transition-transform duration-200"
            />
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
              <Link
                to="/home"
                className="text-white hover:text-red-500 transition-colors px-3 py-2 font-medium"
              >
                Home
              </Link>
              <Link
                to="/donor"
                className="text-white hover:text-red-500 transition-colors px-3 py-2 font-medium"
              >
                Donate
              </Link>
              <Link
                to="/request"
                className="text-white hover:text-red-500 transition-colors px-3 py-2 font-medium"
              >
                Request Blood
              </Link>
              <Link
                to="/about"
                className="text-white hover:text-red-500 transition-colors px-3 py-2 font-medium"
              >
                About
              </Link>
            </div>
          </div>

          {/* Desktop Account Section - Updated with Enhanced Dropdown */}
          <div className="hidden md:flex items-center space-x-4">
            {!user?.isLoggedIn && (
              <button
                onClick={() => handleAuthClick("/login")}
                className="flex items-center gap-2 text-white hover:text-red-500 transition-colors font-medium"
              >
                <FaSignInAlt className="text-lg" />
                <span>Login</span>
              </button>
            )}
            <div className="relative">
              {user?.isLoggedIn && (
                <button
                  onClick={() =>
                    setIsProfileDropdownOpen(!isProfileDropdownOpen)
                  }
                  className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700 transition-colors font-medium shadow-lg"
                >
                  <FaUser />
                  <span>Profile</span>
                  <FaCaretDown
                    className={`transition-transform duration-200 ${
                      isProfileDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
              )}
              

              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                    onClick={() => handleProfileAction("/profile")}
                  >
                    <FaUser className="text-sm" />
                    <span>View Profile</span>
                  </Link>
                  <Link
                    to="/update"
                    className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                  >
                    <FaTint className="text-sm" />
                    <span>Donor</span>
                  </Link>
                  {/* <button
                    onClick={() => handleProfileAction("/update")}
                    className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors w-full"
                  >
                    <FaHandHoldingHeart className="text-sm" />
                    <span>Donor</span>
                  </button> */}
                  
                  <button
                    onClick={() => handleProfileAction("/near")}
                    className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors w-full"
                  >
                    <FaHandHoldingHeart className="text-sm" />
                    <span>Receiver</span>
                  </button>
                  <div className="border-t border-gray-100 my-1"></div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors w-full"
                  >
                    <FaSignOutAlt className="text-sm" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation - Updated with Enhanced Options */}
        <div
          className={`md:hidden transition-all duration-300 ${
            isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          } overflow-hidden`}
        >
          <div className="flex flex-col gap-2 py-4">
            <Link
              to="/home"
              className="text-white hover:text-red-500 transition-colors px-3 py-2 font-medium"
            >
              Home
            </Link>
            <Link
              to="/donor"
              className="text-white hover:text-red-500 transition-colors px-3 py-2 font-medium"
            >
              Donate
            </Link>
            <Link
              to="/request"
              className="text-white hover:text-red-500 transition-colors px-3 py-2 font-medium"
            >
              Request Blood
            </Link>
            <Link
              to="/about"
              className="text-white hover:text-red-500 transition-colors px-3 py-2 font-medium"
            >
              About
            </Link>
            <Link
              to="/profile"
              className="flex items-center gap-2 text-white hover:text-red-500 transition-colors px-3 py-2 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              <FaUser />
              <span>View Profile</span>
            </Link>
            <Link
              to="/donor"
              className="flex items-center gap-2 text-white hover:text-red-500 transition-colors px-3 py-2 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              <FaTint />
              <span>Donor</span>
            </Link>
            <Link
              to="/near"
              className="flex items-center gap-2 text-white hover:text-red-500 transition-colors px-3 py-2 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              <FaHandHoldingHeart />
              <span>Receiver</span>
            </Link>
            <div className="border-t border-gray-700 my-2"></div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-white hover:text-red-500 transition-colors px-3 py-2 font-medium w-full"
            >
              <FaSignOutAlt />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
