import { useState } from 'react';
import { FaEnvelope, FaLock, FaArrowRight } from 'react-icons/fa';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify'
import { signInWithPopup } from 'firebase/auth'
import { auth, provider } from '../helpers/firebase'
import { getEnv } from '../helpers/getEnv';
import { useDispatch } from "react-redux";
import { setUser } from '../redux/user/userSlice';

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const forgotPassword = () => {
    localStorage.setItem("resetPasswordVerificationRequired", "true");
    navigate('/forgot-password');
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
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch(
        `http://localhost:3000/api/auth/login`,
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
      dispatch(setUser(data.user));
      navigate('/');
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
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
          
          {/* Login Card */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h1>
            <p className="text-gray-600">Sign in to continue saving lives</p>
          </div>

          {/* Social Login Buttons */}
          <button 
            className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors mb-8"
            onClick={handleLogin}
          >
            <img 
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
              alt="Google" 
              className="w-5 h-5"
            />
            <span className="text-gray-700 font-medium">Sign in with Google</span>
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px bg-gray-200 flex-1"></div>
            <span className="text-gray-500 text-sm">or continue with</span>
            <div className="h-px bg-gray-200 flex-1"></div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
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
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-red-200 focus:border-red-500 transition-all"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                />
                <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              <p onClick={forgotPassword} className="text-sm text-red-600 hover:text-red-700">
                Forgot password?
              </p>
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
              disabled={isSubmitting}
              className={`w-full bg-gradient-to-r from-red-600 to-red-500 text-white py-3 rounded-xl font-semibold
                ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:from-red-700 hover:to-red-600'}
                transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            {/* Sign Up Link */}
            <div className="text-center text-gray-600 text-sm">
              Don't have an account?{' '}
              <button 
                type="button"
                onClick={() => {
                  navigate('/register', {
                    state: { background: location }
                  });
                }}
                className="text-red-600 hover:text-red-700 font-medium"
              >
                Sign up
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login; 