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
  FaHistory,
  FaExclamationTriangle,
} from "react-icons/fa";
import { MdOutlineLocalHospital } from "react-icons/md";

import { toast } from "react-toastify";
import { removeUser } from "../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import logo from "../assets/logo.png";

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

  const handleSOSClick = () => {
    navigate('/sos')
  }

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
          {/* Logo Section */}
          <Link
            to="/"
            className="flex items-center"
          >
            <div className="relative flex items-center py-2 px-3">
              <img
                src={logo}
                alt="Blood Donation Logo"
                className="h-12 sm:h-14 md:h-16 lg:h-16 w-auto object-contain transition-all duration-300 hover:scale-105"
                style={{
                  filter: 'brightness(1.2) contrast(1.2) saturate(1.1)',
                  maxHeight: '64px',
                  minHeight: '48px'
                }}
              />
              <div className="absolute inset-0 bg-white/5 rounded-lg filter blur-sm"></div>
            </div>
          </Link>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white hover:text-red-500 transition-colors font-outfit"
          >
            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center justify-center flex-1 px-4">
            <div className="flex space-x-8">
              <Link
                to="/home"
                className="text-white hover:text-red-500 transition-colors px-3 py-2 font-medium font-outfit"
              >
                Home
              </Link>
              <Link
                to="/donor"
                className="text-white hover:text-red-500 transition-colors px-3 py-2 font-medium font-outfit"
              >
                Donate
              </Link>
              <Link
                to="/request"
                className="text-white hover:text-red-500 transition-colors px-3 py-2 font-medium font-outfit"
              >
                Request Blood
              </Link>
              
              <Link
                to="/leaderboard"
                className="text-white hover:text-red-500 transition-colors px-3 py-2 font-medium font-outfit"
              >
                Leaderboard

              </Link>
              <button
                 onClick={handleSOSClick}
                 className="
                   group
                   ml-4
                   px-5 py-2
                   bg-gradient-to-r from-red-600 to-rose-600
                   hover:from-red-700 hover:to-rose-700
                   text-white
                   rounded-full
                   font-medium
                   shadow-lg hover:shadow-xl
                   transform 
                   transition-all duration-300
                   animate-pulse hover:animate-none
                   flex items-center gap-2
                   border border-red-400
                 "
               >
                 <FaExclamationTriangle className="
                   text-lg
                   group-hover:scale-110
                   transition-transform duration-300
                 " />
                 <span className="font-outfit">SOS Request</span>
               </button>
            </div>
          </div>

          {/* Desktop Account Section - Updated with Enhanced Dropdown */}
          <div className="hidden md:flex items-center space-x-4">
            {!user?.isLoggedIn && (
              <button
                onClick={() => handleAuthClick("/login")}
                className="flex items-center gap-2 text-white hover:text-red-500 transition-colors font-medium font-outfit"
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
                  className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700 transition-colors font-medium shadow-lg font-outfit"
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
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-lg shadow-lg py-2 z-50">
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors font-outfit"
                    onClick={() => handleProfileAction("/profile")}
                  >
                    <FaUser className="text-sm" />
                    <span>View Profile</span>
                  </Link>
                  <Link
                    to="/my-donations"
                    className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors font-outfit"
                    onClick={() => handleProfileAction("/my-donations")}
                  >
                    <FaHistory className="text-sm" />
                    <span>My Donations</span>
                  </Link>
                  <button
                    onClick={() => handleProfileAction("/near")}
                    className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors font-outfit w-full"
                  >
                    <FaHandHoldingHeart className="text-sm" />
                    <span>Blood Bank & Donors</span>
                  </button>
                  <button
                    onClick={() => handleProfileAction("/nearby-hospitals")}
                    className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors font-outfit w-full"
                  >
                    <MdOutlineLocalHospital className="text-sm" />
                    <span>Nearby Hospitals</span>
                  </button>
                  <div className="border-t border-gray-100 my-1"></div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors font-outfit w-full"
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
            <button
               onClick={handleSOSClick}
               className="w-full mb-4 px-6 py-3 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-lg font-medium flex items-center justify-center gap-2 shadow-md animate-pulse"
             >
               <FaExclamationTriangle className="text-lg" />
               <span className="font-outfit">SOS Request</span>
             </button>
          <div className="flex flex-col gap-2 py-4">
            <Link
              to="/home"
              className="text-white hover:text-red-500 transition-colors px-3 py-2 font-medium font-outfit"
            >
              Home
            </Link>
            <Link
              to="/donor"
              className="text-white hover:text-red-500 transition-colors px-3 py-2 font-medium font-outfit"
            >
              Donate
            </Link>
            <Link
              to="/request"
              className="text-white hover:text-red-500 transition-colors px-3 py-2 font-medium font-outfit"
            >
              Request Blood
            </Link>
            <Link
              to="/leaderboard"
              className="text-white hover:text-red-500 transition-colors px-3 py-2 font-medium font-outfit"
            >
              Leaderboard
            </Link>
            <Link
              to="/profile"
              className="flex items-center gap-2 text-white hover:text-red-500 transition-colors px-3 py-2 font-medium font-outfit"
              onClick={() => setIsMenuOpen(false)}
            >
              <FaUser />
              <span>View Profile</span>
            </Link>
            <Link
              to="/donor"
              className="flex items-center gap-2 text-white hover:text-red-500 transition-colors px-3 py-2 font-medium font-outfit"
              onClick={() => setIsMenuOpen(false)}
            >
              <FaTint />
              <span>Donor</span>
            </Link>
            <Link
              to="/near"
              className="flex items-center gap-2 text-white hover:text-red-500 transition-colors px-3 py-2 font-medium font-outfit"
              onClick={() => setIsMenuOpen(false)}
            >
              <FaHandHoldingHeart />
              <span>Bank and Donors</span>
            </Link>
            <Link
              to="/my-donations"
              className="flex items-center gap-2 text-white hover:text-red-500 transition-colors px-3 py-2 font-medium font-outfit"
              onClick={() => setIsMenuOpen(false)}
            >
              <FaHistory />
              <span>My Donations</span>
            </Link>
            <Link
                to="/nearby-hospitals"
                className="flex items-center gap-2 text-white hover:text-red-500 transition-colors px-3 py-2 font-medium font-outfit"
              onClick={() => setIsMenuOpen(false)}
              >
                Nearby Hospitals
              </Link>
            <div className="border-t border-gray-700 my-2"></div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-white hover:text-red-500 transition-colors px-3 py-2 font-medium font-outfit w-full"
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
