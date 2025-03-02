import { useState } from 'react';
import { FaEnvelope, FaLock, FaArrowRight, FaUser, FaEye, FaEyeSlash } from 'react-icons/fa';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { signInWithPopup } from 'firebase/auth'
import { auth, provider } from '../helpers/firebase'
import { setUser } from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';

function Signup() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const isModal = location.state?.background;
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [passwordErrors, setPasswordErrors] = useState([]);

  const validatePassword = (password) => {
    const errors = [];
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    if (!/[0-9]/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    if (!/[!@#$%^&*]/.test(password)) {
      errors.push('Password must contain at least one special character (!@#$%^&*)');
    }
    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'password') {
      setPasswordErrors(validatePassword(value));
    }
  };

  const handleLogin = async () => {
    try {
        const googleResponse = await signInWithPopup(auth, provider)

        const user = googleResponse.user
        const bodyData = {
            name: user.displayName,
            email: user.email,
        }
        const response = await fetch(`http://localhost:3000/api/auth/google-login`,{
        method: 'post',
        headers: { 'Content-type': 'application/json'},
        credentials: 'include',
        body: JSON.stringify(bodyData)
        }) 

        const data = await response.json();

        if(!response.ok){
           return toast.error(data.message)
        }
        dispatch(setUser(data.user))
        navigate('/')
        toast.success(data.message)

    } catch (error) {
        toast.error(error.message)
    }
}

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const errors = validatePassword(formData.password);
    if (errors.length > 0) {
      setPasswordErrors(errors);
      return;
    }

    setIsSubmitting(true);
    setError('');

   try {
         const response = await fetch(
           `http://localhost:3000/api/auth/register`,
           {
             method: "post",
             headers: { "Content-type": "application/json" },
             credentials: "include",
             body: JSON.stringify(formData),
           }
         );
   
         const data = await response.json();
   
         if (!response.ok) {
           return ("error", data.message);
         }
         localStorage.setItem("emailVerificationRequired", "true");
         navigate('/email-verify');
         toast.success( data.message);
       } catch (error) {
         toast.error(error.message); 
       } finally {
         setIsSubmitting(false);
       }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
      <div className="max-w-md w-full animate-fadeIn">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 relative">
          {/* Close Button */}
          <button
            onClick={() => navigate(-1)}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl font-semibold"
          >
            ×
          </button>
          
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Create Account</h1>
            <p className="text-gray-600">Join us in saving lives</p>
          </div>

          {/* Google Signup Button */}
          <button 
            className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors mb-8"
            onClick={handleLogin}
          >
            <img 
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
              alt="Google" 
              className="w-5 h-5"
            />
            <span className="text-gray-700 font-medium">Sign up with Google</span>
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px bg-gray-200 flex-1"></div>
            <span className="text-gray-500 text-sm">or register with email</span>
            <div className="h-px bg-gray-200 flex-1"></div>
          </div>

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <div className="relative">
                <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-red-200 focus:border-red-500 transition-all"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-red-200 focus:border-red-500 transition-all"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-12 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-red-200 focus:border-red-500 transition-all"
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {/* Password Requirements */}
              {passwordErrors.length > 0 && (
                <div className="mt-2 space-y-1">
                  {passwordErrors.map((error, index) => (
                    <p key={index} className="text-sm text-red-600">
                      • {error}
                    </p>
                  ))}
                </div>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg p-3">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || passwordErrors.length > 0}
              className={`w-full bg-gradient-to-r from-red-600 to-red-500 text-white py-3 rounded-xl font-semibold
                ${(isSubmitting || passwordErrors.length > 0) ? 'opacity-70 cursor-not-allowed' : 'hover:from-red-700 hover:to-red-600'}
                transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            {/* Login Link */}
            <div className="text-center text-gray-600 text-sm">
              Already have an account?{' '}
              <button 
                type="button"
                onClick={() => {
                  navigate('/login', {
                    state: { background: location.state?.background }
                  });
                }}
                className="text-red-600 hover:text-red-700 font-medium"
              >
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup; 