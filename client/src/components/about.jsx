import { 
  FaHeart, FaUsers, FaHandHoldingHeart, FaAward, FaPhoneAlt, 
  FaEnvelope, FaMapMarkerAlt, FaCheckCircle, FaHospital, 
  FaClock, FaGlobe, FaHandshake, FaCertificate, FaArrowRight, FaShieldAlt, FaBell, FaHeartbeat 
} from 'react-icons/fa'

function About() {
  const features = [
    {
      icon: <FaHeart className="text-4xl text-red-500" />,
      title: "Our Vision",
      description: "Creating a world where blood is readily available to everyone in need through a connected community of donors.",
      stats: "Life-Saving Mission"
    },
    {
      icon: <FaUsers className="text-4xl text-red-500" />,
      title: "Who We Are",
      description: "A passionate team dedicated to bridging the gap between blood donors and recipients through technology.",
      stats: "Growing Community"
    },
    {
      icon: <FaHandHoldingHeart className="text-4xl text-red-500" />,
      title: "What We Do",
      description: "We connect blood donors with those in need, making the donation process simple, efficient, and accessible.",
      stats: "Available 24/7"
    }
  ]

  const impactStats = [
    { 
      number: "1000+", 
      label: "Registered Donors", 
      icon: <FaUsers className="text-3xl text-white" />,
      bgColor: "bg-gradient-to-br from-red-500 to-red-600"
    },
    { 
      number: "500+", 
      label: "Successful Matches", 
      icon: <FaHeart className="text-3xl text-white" />,
      bgColor: "bg-gradient-to-br from-pink-500 to-pink-600"
    },
    { 
      number: "50+", 
      label: "Partner Centers", 
      icon: <FaHospital className="text-3xl text-white" />,
      bgColor: "bg-gradient-to-br from-purple-500 to-purple-600"
    },
    { 
      number: "24/7", 
      label: "Support", 
      icon: <FaClock className="text-3xl text-white" />,
      bgColor: "bg-gradient-to-br from-indigo-500 to-indigo-600"
    }
  ]

  const appFeatures = [
    {
      title: "Quick Registration",
      description: "Simple and fast donor registration process"
    },
    {
      title: "Real-time Updates",
      description: "Instant notifications for urgent blood requirements"
    },
    {
      title: "Location Services",
      description: "Find nearby donation centers and blood banks"
    },
    {
      title: "Donation Tracking",
      description: "Track your donations and impact"
    },
    {
      title: "Community Support",
      description: "Connect with other donors and recipients"
    },
    {
      title: "Health Records",
      description: "Maintain your donation history securely"
    }
  ]

  const benefits = [
    {
      icon: <FaClock className="text-3xl text-red-500" />,
      title: "Quick Response Time",
      description: "Our platform ensures rapid connection between donors and recipients, minimizing critical response time in emergencies."
    },
    {
      icon: <FaMapMarkerAlt className="text-3xl text-red-500" />,
      title: "Location-Based Matching",
      description: "Smart location services to find the nearest available donors and blood banks in your area."
    },
    {
      icon: <FaUsers className="text-3xl text-red-500" />,
      title: "Growing Community",
      description: "Join our active community of donors and be part of a life-saving network that grows stronger every day."
    },
    {
      icon: <FaShieldAlt className="text-3xl text-red-500" />,
      title: "Secure & Private",
      description: "Your personal information and medical history are protected with industry-standard security measures."
    },
    {
      icon: <FaBell className="text-3xl text-red-500" />,
      title: "Real-Time Alerts",
      description: "Receive instant notifications about urgent blood requirements in your area and track your contributions."
    },
    {
      icon: <FaHeartbeat className="text-3xl text-red-500" />,
      title: "Health Monitoring",
      description: "Keep track of your donation history and get reminders for your next eligible donation date."
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-16">
      {/* Hero Section with Parallax - Added z-index positioning */}
      <div className="relative h-[300px] md:h-[400px] lg:h-[500px] bg-fixed bg-center bg-cover z-0" 
           style={{backgroundImage: 'url(https://img.freepik.com/free-photo/doctor-with-blood-samples_23-2148162330.jpg)'}}>
        <div className="absolute inset-0 bg-gradient-to-r from-red-900/90 to-black/80">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
            <div className="max-w-3xl text-white space-y-4 md:space-y-6">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight">
                Connecting Donors
                <span className="block mt-2 md:mt-4">Saving Lives</span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-200 leading-relaxed max-w-2xl">
                We're building a community-driven platform to make blood donation 
                accessible, efficient, and timely for everyone in need.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section with Stats - Improved spacing and responsiveness */}
      <div className="py-16 md:py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 sm:p-8 lg:p-10 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-40 h-40 bg-red-50 rounded-full -mr-20 -mt-20 transition-transform group-hover:scale-110"></div>
                <div className="relative z-10">
                  <div className="mb-8">
                    <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">{feature.title}</h3>
                  <p className="text-gray-600 mb-8 text-lg leading-relaxed">{feature.description}</p>
                  <div className="text-red-600 font-semibold flex items-center gap-2 group-hover:text-red-700 transition-colors">
                    <span>{feature.stats}</span>
                    <FaArrowRight className="group-hover:translate-x-2 transition-transform duration-300" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Impact Stats Grid - Improved responsiveness */}
      <div className="py-16 md:py-20 lg:py-24 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 text-center mb-10 md:mb-16">Growing Impact</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-5xl mx-auto">
            {impactStats.map((stat, index) => (
              <div key={index} 
                   className={`${stat.bgColor} text-center rounded-xl p-4 sm:p-6 transform hover:-translate-y-1 transition-all duration-300 shadow-lg`}>
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center">
                    {stat.icon}
                  </div>
                </div>
                <div className="text-3xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-white/90 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* App Features Section - Improved spacing */}
      <div className="py-16 md:py-20 lg:py-24 bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-20">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4 md:mb-6">Powerful Features</h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to make blood donation simple, efficient, and impactful
            </p>
          </div>

          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {appFeatures.map((feature, index) => (
              <div 
                key={index} 
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-gray-50 p-1"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-pink-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                <div className="relative p-8 h-full">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
                      <FaHeart className="text-2xl text-red-500 group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">{feature.title}</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                      <FaArrowRight className="text-red-500 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Why Choose Us Section - Improved spacing and responsiveness */}
      <div className="py-16 md:py-20 lg:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-20">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4 md:mb-6">Why Choose Us</h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              We're revolutionizing blood donation with technology that makes saving lives easier and more efficient
            </p>
          </div>

          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
              {benefits.map((benefit, index) => (
                <div key={index} className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-pink-500/5 rounded-3xl transform group-hover:scale-105 transition-transform duration-300"></div>
                  <div className="relative flex flex-col sm:flex-row gap-4 sm:gap-6 p-4 sm:p-6">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 p-[1px]">
                        <div className="w-full h-full rounded-2xl bg-white flex items-center justify-center">
                          {benefit.icon}
                        </div>
                      </div>
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 sm:mb-3 group-hover:text-red-600 transition-colors">
                        {benefit.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {benefit.description}
                      </p>
                      <div className="mt-3 sm:mt-4 flex items-center gap-2 text-red-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span>Learn more</span>
                        <FaArrowRight className="group-hover:translate-x-2 transition-transform duration-300" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section - More compact form */}
      <div className="py-12 md:py-16 lg:py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-2/5 bg-gradient-to-br from-red-600 to-red-700 p-6 sm:p-8 lg:p-10 text-white">
                <h3 className="text-2xl font-bold mb-6">Get in Touch</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                      <FaPhoneAlt className="text-lg" />
                    </div>
                    <div>
                      <div className="text-sm text-red-200">Call Us</div>
                      <div>+1 234 567 890</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                      <FaEnvelope className="text-lg" />
                    </div>
                    <div>
                      <div className="text-sm text-red-200">Email Us</div>
                      <div>contact@blooddonation.com</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                      <FaMapMarkerAlt className="text-lg" />
                    </div>
                    <div>
                      <div className="text-sm text-red-200">Visit Us</div>
                      <div>123 Blood Bank Street</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="md:w-3/5 p-6 sm:p-8 lg:p-10">
                <h3 className="text-xl font-bold text-gray-800 mb-6">Send us a Message</h3>
                <form className="space-y-4">
                  <div>
                    <input 
                      type="text" 
                      placeholder="Your Name"
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <input 
                      type="email" 
                      placeholder="Your Email"
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <textarea 
                      rows="3" 
                      placeholder="Your Message"
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    ></textarea>
                  </div>
                  <button className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors font-semibold">
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About 