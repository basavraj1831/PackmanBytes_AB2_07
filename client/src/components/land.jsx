import Slider from 'react-slick'
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import { FaHeart, FaSearch, FaInfoCircle, FaArrowRight, FaBell, FaMapMarkerAlt, FaCalendarAlt, FaPhoneAlt, FaTint } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function LandingPage() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 2000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
    fade: false,
    cssEase: "cubic-bezier(0.87, 0.03, 0.41, 0.9)"
  }

  const slides = [
    {
      id: 1,
      image: "https://img.freepik.com/free-vector/human-blood-donate-white-background_1308-111266.jpg?ga=GA1.1.656503990.1740769311&semt=ais_hybrid",
      title: "Donate Blood, Save Lives",
      offer: "Your donation can help save up to three lives",
      buttonText1: "Start Donating",
      buttonText2: "Learn More"
    },
    {
      id: 2,
      image: "https://img.freepik.com/free-vector/red-blood-cells-flowing-background_1017-17842.jpg?ga=GA1.1.656503990.1740769311&semt=ais_hybrid",
      title: "Every Drop Counts",
      offer: "Be a hero in someone's life",
      buttonText1: "Donate Now",
      buttonText2: "Find More"
    },
    {
      id: 3,
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTkFtWSepPYXjIW86XMczleSp-Q8kZPVC_idA&s",
      title: "Join Our Mission",
      offer: "Together we can make a difference",
      buttonText1: "Get Involved",
      buttonText2: "Learn More"
    },
    {
      id: 4,
      image: "https://img.freepik.com/free-vector/mobile-medicine-isometric-flowchart-with-online-laboratory-symbols-illustration_1284-31378.jpg?ga=GA1.1.656503990.1740769311&semt=ais_hybrid",
      title: "Emergency Response Network",
      offer: "24/7 emergency blood supply network",
      buttonText1: "Learn More",
      buttonText2: "Find Centers"
    },
    {
      id: 5,
      image: "https://images.unsplash.com/photo-1579154204601-01588f351e67?q=80&w=1770&auto=format&fit=crop",
      title: "Mobile Blood Donation Camps",
      offer: "Bringing blood donation facilities closer to you",
      buttonText1: "Find Camps",
      buttonText2: "Register Now"
    }
  ]

  const boxes = [
    {
      title: "Donate Blood",
      description: "Every drop matters. Join our life-saving mission.",
      image: "https://www.sriramakrishnahospital.com/wp-content/uploads/2021/06/Blood-Donation-1.jpg",
      link: "/donate",
      icon: <FaHeart className="text-red-500 text-4xl mb-4" />
    },
    {
      title: "Find Blood",
      description: "Quick access to blood donors in your area.",
      image: "https://www.friends2support.org/imgs/landingpage/blood_drop_search.gif",
      link: "/request",
      icon: <FaSearch className="text-red-500 text-4xl mb-4" />
    },
    {
      title: "Blood Types",
      description: "Learn about different blood types and compatibility.",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMsRQZEGt8w9DBSxgTU2nNSvhJh3VfHpw6xA&s",
      link: "/learn",
      icon: <FaInfoCircle className="text-red-500 text-4xl mb-4" />
    }
  ]

  const stats = [
    { number: "150+", label: "Daily Donors" },
    { number: "1000+", label: "Lives Saved" },
    { number: "50+", label: "Centers" },
    { number: "24/7", label: "Support" }
  ]

  // Add new blood requests data
  const bloodRequests = [
    {
      bloodType: "A+",
      location: "City Hospital",
      urgency: "Urgent",
      timePosted: "2 hours ago",
      contact: "+1234567890"
    },
    {
      bloodType: "O-",
      location: "Medical Center",
      urgency: "Critical",
      timePosted: "1 hour ago",
      contact: "+1234567891"
    },
    {
      bloodType: "B+",
      location: "General Hospital",
      urgency: "Required",
      timePosted: "3 hours ago",
      contact: "+1234567892"
    }
  ]

  // Update the infoContent array with more comprehensive information
  const infoContent = [
    {
      title: "Understanding Blood Types and Compatibility",
      description: "Blood type compatibility is crucial for successful transfusions. Each blood type has unique characteristics that determine who can receive it and who can donate to it. Type O negative blood is considered the universal donor type, while AB positive is the universal recipient. Understanding your blood type helps you know who you can help and who can help you in times of need. The four main blood groups (A, B, AB, and O) are determined by the presence or absence of specific antigens on the surface of red blood cells. The Rh factor (positive or negative) adds another layer of compatibility consideration. This complex system ensures safe transfusions and optimal patient care. Regular blood typing and screening help maintain accurate records and enable quick matching in emergencies.",
      readingTime: "5 min read"
    },
    {
      title: "The Science Behind Blood Donation",
      description: "Blood consists of four main components: red blood cells, white blood cells, platelets, and plasma. Each component serves a unique purpose and can be used to treat different medical conditions. Red blood cells carry oxygen throughout the body and are essential for treating anemia and blood loss. Platelets help blood clot and are crucial for cancer patients undergoing chemotherapy. Plasma contains vital proteins and clotting factors used to treat various conditions including burns and shock. When you donate blood, it undergoes careful processing to separate these components, maximizing the impact of each donation. Modern blood banking techniques allow components to be stored at specific temperatures, extending their shelf life. Advanced screening methods ensure the safety of the blood supply, testing for various infectious diseases and ensuring compatibility. The human body quickly replenishes donated blood, making it safe to donate regularly.",
      readingTime: "7 min read"
    },
    {
      title: "Common Myths About Blood Donation Debunked",
      description: "Many misconceptions prevent people from donating blood. Let's address some common myths: No, donating blood doesn't make you weak or cause weight gain. The process is completely safe and sterile. You can't get HIV or other infections from donating blood. Your body replenishes the donated blood volume within 24 hours, and red blood cells are completely restored within 4-6 weeks. Eating before donation doesn't affect blood quality - in fact, it's recommended. Taking medications doesn't always disqualify you from donating; each case is evaluated individually. Age isn't always a barrier - many healthy seniors can donate. Vegetarians can absolutely be donors; their blood iron levels are often perfectly adequate. The process isn't time-consuming - the actual donation takes only 8-10 minutes. Regular donation doesn't weaken your immune system; it can actually stimulate blood cell production.",
      readingTime: "6 min read"
    },
    {
      title: "Health Benefits of Regular Blood Donation",
      description: "Regular blood donation offers numerous health benefits beyond helping others. It helps reduce the risk of heart disease by lowering blood viscosity and iron levels, particularly beneficial for males and post-menopausal women who don't regularly lose blood. The process burns approximately 650 calories per donation and stimulates blood cell production, which can improve overall blood health. Regular donors receive free health screenings before each donation, including checks for blood pressure, pulse, temperature, hemoglobin, and various infectious diseases. This regular monitoring can help detect potential health issues early. The psychological benefits are also significant - knowing you've helped save lives can reduce stress and improve emotional well-being. Studies have shown that regular blood donors have a lower risk of certain cancers and better cardiovascular health. The body's natural response to donation includes producing new blood cells, which can help maintain healthy bone marrow.",
      readingTime: "4 min read"
    },
    {
      title: "Impact Stories: How Blood Donations Save Lives",
      description: "Real stories from real people showcase the profound impact of blood donation. Sarah, a 6-year-old leukemia patient, required regular transfusions throughout her treatment - thanks to dedicated donors, she's now in remission. John, involved in a severe car accident, survived because 12 units of blood were immediately available. Maria's complicated childbirth was successful because of readily available blood products. These stories represent just a fraction of the lives touched by blood donation. Emergency rooms rely on having blood available 24/7 for trauma cases. Cancer patients often need platelets during chemotherapy. Surgical procedures frequently require blood products to ensure success. One donation can help up to three different patients when components are separated. The ripple effect of each donation extends beyond the immediate recipient to their families and communities. Regular donors create a stable blood supply that hospitals can depend on. Every donation has the potential to be the one that saves someone's life in a critical moment.",
      readingTime: "8 min read"
    },
    {
      title: "The Blood Donation Process Explained",
      description: "The blood donation process is straightforward and designed for donor comfort and safety. It begins with registration and a confidential medical history review. A mini-physical follows, checking vital signs, hemoglobin levels, and overall health status. The actual donation takes only 8-10 minutes, during which you can relax, read, or chat with staff. Trained phlebotomists ensure a comfortable experience using sterile, single-use equipment. After donation, you'll rest for 15 minutes while enjoying refreshments to help replenish fluids. The entire process, from arrival to departure, typically takes about an hour. Your blood is then processed, tested, and prepared for distribution to hospitals. Modern collection methods allow for specific component donation like platelets or plasma. The facility maintains strict temperature control and handling procedures to ensure blood quality. Staff members are highly trained in both technical skills and donor care. Post-donation care instructions help ensure a quick recovery and readiness for future donations.",
      readingTime: "6 min read"
    },
    {
      title: "Emergency Blood Needs: Why Regular Donation Matters",
      description: "Blood has a limited shelf life - red blood cells last only 42 days, and platelets just 5 days. Regular donations are crucial to maintain a stable blood supply for emergencies. Natural disasters, accidents, and medical procedures require immediate access to blood products.",
      readingTime: "5 min read"
    },
    {
      title: "Special Blood Donations: Platelets and Plasma",
      description: "Besides whole blood donation, you can donate specific blood components like platelets and plasma. Platelet donations are crucial for cancer patients, while plasma is essential for treating burn victims and patients with clotting disorders. These specialized donations can help meet specific medical needs.",
      readingTime: "7 min read"
    },
    {
      title: "Preparing for Your First Blood Donation",
      description: "Make your first donation a success by following these guidelines: Get a good night's sleep, eat a hearty meal, drink plenty of water, wear comfortable clothing, and bring valid ID. Understanding what to expect can help reduce anxiety and make the experience more pleasant.",
      readingTime: "5 min read"
    },
    {
      title: "Blood Donation During COVID-19",
      description: "Blood donation remains essential during the pandemic. Blood centers have implemented additional safety measures including enhanced cleaning, social distancing, and health screenings. Your donation is needed more than ever as hospitals continue to treat patients with various conditions.",
      readingTime: "6 min read"
    },
    {
      title: "The Global Impact of Blood Donation",
      description: "Blood donation is a global necessity. Every country needs a reliable blood supply system. Learn about international blood donation programs, how different countries manage their blood supplies, and the worldwide effort to ensure blood safety and availability.",
      readingTime: "8 min read"
    }
  ];

  // Add new health tips data
  const healthTips = [
    {
      icon: "🍎",
      title: "Before Donation",
      tips: [
        "Get adequate sleep",
        "Eat iron-rich foods",
        "Stay hydrated"
      ]
    },
    {
      icon: "💪",
      title: "After Donation",
      tips: [
        "Rest for 15 minutes",
        "Drink extra fluids",
        "Avoid heavy lifting"
      ]
    }
  ]

  // Add this state for tracking expanded articles
  const [expandedArticles, setExpandedArticles] = useState(new Set());

  // Add this function to toggle article expansion
  const toggleArticle = (index) => {
    setExpandedArticles(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Mission Statement Hero - At the top */}
      <div className="relative overflow-hidden bg-black py-20">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-rose-500/10"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(220,38,38,0.1),transparent)] opacity-70"></div>
        
        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="font-outfit relative">
              <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
                <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-rose-500"></div>
              </div>
              <span className="block text-red-500 text-lg font-semibold tracking-wide mb-3">
                OUR MISSION
              </span>
              <span className="block text-white text-5xl sm:text-6xl md:text-7xl font-bold leading-tight mb-4">
                When Life Calls,
              </span>
              <span className="block text-5xl sm:text-6xl md:text-7xl font-bold leading-tight bg-gradient-to-r from-red-500 to-rose-500 bg-clip-text text-transparent">
                We Answer.
              </span>
            </h2>
            
            {/* Decorative Elements */}
            <div className="mt-8 flex justify-center items-center">
              <div className="heartbeat-line">
                <svg width="200" height="40" viewBox="0 0 200 40">
                  <polyline
                    className="heartbeat"
                    points="0,20 40,20 50,20 60,0 70,40 80,20 90,20 100,20 110,0 120,40 130,20 140,20 200,20"
                    fill="none"
                    stroke="rgb(239, 68, 68)"
                    strokeWidth="2"
                  />
                </svg>
              </div>
            </div>
            
            {/* Call to Action */}
            <div className="mt-10">
              <button 
                onClick={() => navigate('/donor')}
                className="
                  group
                  inline-flex items-center gap-3
                  px-8 py-4 
                  bg-gradient-to-r from-red-600 to-rose-600
                  hover:from-red-700 hover:to-rose-700
                  text-white 
                  rounded-full 
                  text-lg font-semibold
                  shadow-lg hover:shadow-xl
                  transform hover:-translate-y-0.5
                  transition-all duration-300
                "
              >
                <FaTint className="text-xl group-hover:scale-110 transition-transform" />
                <span>Become a Donor</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Side Decorative Elements */}
        <div className="absolute -left-24 top-1/2 transform -translate-y-1/2 rotate-45">
          <div className="w-48 h-96 bg-gradient-to-r from-red-500/10 to-transparent blur-3xl"></div>
        </div>
        <div className="absolute -right-24 top-1/2 transform -translate-y-1/2 -rotate-45">
          <div className="w-48 h-96 bg-gradient-to-l from-rose-500/10 to-transparent blur-3xl"></div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-white">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-white -z-10"></div>
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-red-50 rounded-full filter blur-3xl opacity-50 transform translate-x-1/2 -translate-y-1/2"></div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="max-w-5xl mx-auto">
            <div className="text-center space-y-8">
              {/* Inspiring Message */}
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
                Your Blood Can Give Someone
                <span className="block text-red-600">A Second Chance at Life</span>
              </h2>

              {/* Statistics Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mt-12">
                {stats.map((stat, index) => (
                  <div key={index} className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                    <div className="text-3xl font-bold text-red-600 mb-2">{stat.number}</div>
                    <div className="text-gray-600 font-medium">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Call to Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 mt-12">
                <button className="group bg-red-600 text-white px-8 py-4 rounded-full hover:bg-red-700 transition-all transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg text-lg">
                  Start Saving Lives
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="group bg-white text-red-600 px-8 py-4 rounded-full border-2 border-red-600 hover:bg-red-50 transition-all transform hover:scale-105 shadow-lg text-lg flex items-center justify-center gap-2">
                  Learn More
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform opacity-0 group-hover:opacity-100" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Slider Section */}
      <div className="relative py-6 -mt-8 bg-gradient-to-br from-gray-100 via-red-50 to-white">
        <div className="slider-wrapper max-w-[95%] mx-auto">
          <Slider {...settings}>
            {slides.map((slide) => (
              <div key={slide.id} className="px-4">
                <div className="slide-content flex flex-col-reverse md:flex-row items-center justify-between py-8 md:px-14 px-5 rounded-2xl min-h-[500px] bg-white">
                  <div className="md:pl-8 mt-10 md:mt-0 max-w-xl w-full md:w-1/2">
                    <p className="slide-description text-red-600 font-medium mb-2 tracking-wide uppercase text-sm">
                      {slide.offer}
                    </p>
                    <h2 className="slide-title text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-6 leading-tight">
                      {slide.title}
                    </h2>
                    <div className="slide-buttons flex items-center gap-4">
                      <button className="px-8 py-3 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-full hover:from-red-700 hover:to-red-600 transition-all duration-300 font-medium hover:shadow-xl transform hover:-translate-y-0.5">
                        {slide.buttonText1}
                      </button>
                      <button className="group flex items-center gap-2 px-6 py-3 font-medium text-gray-700 hover:text-red-600 transition-colors">
                        {slide.buttonText2}
                        <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                  <div className="slide-image-container flex items-center justify-center w-full md:w-1/2 h-[300px] md:h-[400px] p-6">
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="slide-image w-full h-full object-contain max-w-[400px]"
                    />
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>

      {/* Updated Cards Section */}
      <div className="container mx-auto px-4 py-20 max-w-7xl bg-white">
        <div className="text-center mb-20">
          <h1 className="text-5xl font-bold text-gray-800 mb-6">Save Lives Through Blood Donation</h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">Your donation can help save up to three lives. Join our mission to make a difference in someone's life today.</p>
          <div className="flex justify-center gap-6">
            <button className="bg-red-600 text-white px-8 py-3 rounded-full hover:bg-red-700 transition-all transform hover:scale-105 flex items-center gap-2">
              Donate Now
              <FaArrowRight />
            </button>
            <button className="bg-white text-red-600 px-8 py-3 rounded-full border-2 border-red-600 hover:bg-red-50 transition-all transform hover:scale-105">
              Request Blood
            </button>
          </div>
        </div>

        {/* Updated Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {boxes.map((box, index) => (
            <div 
              key={index}
              className="relative overflow-hidden rounded-2xl shadow-lg group cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-xl bg-white"
            >
              <div className="h-48 relative overflow-hidden">
                <img 
                  src={box.image}
                  alt={box.title}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-xl font-bold text-white mb-1">{box.title}</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4">{box.description}</p>
                <Link 
                  to={box.link}
                  className="bg-red-600 text-white w-full py-3 rounded-xl hover:bg-red-700 transition-all duration-300 flex items-center justify-center gap-2 group"
                >
                  Learn More
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Blood Requests and Info Section */}
      <div className="container mx-auto px-4 py-16 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Essential Information Section */}
          <div className="lg:col-span-2 space-y-12">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">Essential Information</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">Everything you need to know about blood donation and how you can make a difference.</p>
            </div>

            <div className="space-y-8 pr-8">
              {infoContent.map((article, index) => (
                <article 
                  key={index} 
                  className="border-b border-gray-100 pb-8 last:border-0 hover:bg-gray-50/50 rounded-lg p-4 transition-colors"
                >
                  <div className="group cursor-pointer" onClick={() => toggleArticle(index)}>
                    <h3 className="text-2xl font-bold text-gray-800 mb-4 group-hover:text-red-600 transition-colors">
                      {article.title}
                    </h3>
                    <p className={`text-lg text-gray-600 mb-5 leading-relaxed ${
                      expandedArticles.has(index) ? '' : 'line-clamp-3'
                    }`}>
                      {article.description}
                    </p>
                    <div className="flex items-center gap-4">
                      <span className="text-base text-gray-500">{article.readingTime}</span>
                      <button className="text-red-600 text-base font-medium flex items-center gap-2 group-hover:text-red-700 transition-colors">
                        {expandedArticles.has(index) ? 'Show less' : 'Read more'}
                        <FaArrowRight className={`transition-transform ${
                          expandedArticles.has(index) ? 'rotate-90' : 'group-hover:translate-x-1'
                        }`} />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Donation Tips Section */}
            <div className="bg-gradient-to-br from-red-50 to-white rounded-xl p-8 shadow-lg mt-16">
              <h3 className="text-2xl font-bold text-gray-800 mb-8 text-center">Donation Guidelines</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Before Donation */}
                <div className="bg-white rounded-xl p-6 shadow-md">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                      <span className="text-2xl">🎯</span>
                    </div>
                    <h4 className="text-xl font-semibold text-gray-800">Before Donation</h4>
                  </div>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3 text-gray-700">
                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                      Get adequate sleep (7-8 hours)
                    </li>
                    <li className="flex items-center gap-3 text-gray-700">
                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                      Eat iron-rich foods
                    </li>
                    <li className="flex items-center gap-3 text-gray-700">
                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                      Stay well hydrated
                    </li>
                    <li className="flex items-center gap-3 text-gray-700">
                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                      Avoid fatty foods
                    </li>
                  </ul>
                </div>

                {/* After Donation */}
                <div className="bg-white rounded-xl p-6 shadow-md">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                      <span className="text-2xl">💪</span>
                    </div>
                    <h4 className="text-xl font-semibold text-gray-800">After Donation</h4>
                  </div>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3 text-gray-700">
                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                      Rest for 15 minutes
                    </li>
                    <li className="flex items-center gap-3 text-gray-700">
                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                      Drink extra fluids
                    </li>
                    <li className="flex items-center gap-3 text-gray-700">
                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                      Avoid heavy lifting
                    </li>
                    <li className="flex items-center gap-3 text-gray-700">
                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                      Keep bandage on for 4-5 hours
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Blood Requests - Right Side */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Current Requests</h2>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-red-600 font-medium">Live</span>
                  <FaBell className="text-red-500 text-xl animate-pulse" />
                </div>
              </div>
              
              <div className="space-y-4">
                {bloodRequests.map((request, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl font-bold text-red-600">{request.bloodType}</span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          request.urgency === 'Critical' ? 'bg-red-100 text-red-600' :
                          request.urgency === 'Urgent' ? 'bg-orange-100 text-orange-600' :
                          'bg-yellow-100 text-yellow-600'
                        }`}>
                          {request.urgency}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">{request.timePosted}</span>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <FaMapMarkerAlt className="text-red-500" />
                        {request.location}
                      </div>
                      <div className="flex items-center gap-2">
                        <FaPhoneAlt className="text-red-500" />
                        <a href={`tel:${request.contact}`} className="hover:text-red-600 transition-colors">
                          {request.contact}
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100">
                <button className="w-full text-red-600 font-semibold flex items-center justify-center gap-2 group hover:text-red-700">
                  View All Requests
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <footer className="bg-black text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link to="/about" className="hover:text-red-500 transition-colors">About Us</Link></li>
                <li><Link to="/donor" className="hover:text-red-500 transition-colors">Donate Blood</Link></li>
                <li><Link to="/request" className="hover:text-red-500 transition-colors">Request Blood</Link></li>
                <li><Link to="/contact" className="hover:text-red-500 transition-colors">Contact Us</Link></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li><Link to="/faq" className="hover:text-red-500 transition-colors">FAQs</Link></li>
                <li><Link to="/privacy" className="hover:text-red-500 transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-red-500 transition-colors">Terms of Service</Link></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <FaMapMarkerAlt className="text-red-500" />
                  <span>123 Blood Bank Street</span>
                </li>
                <li className="flex items-center gap-2">
                  <FaPhoneAlt className="text-red-500" />
                  <span>+1 234 567 890</span>
                </li>
                <li className="flex items-center gap-2">
                  <FaCalendarAlt className="text-red-500" />
                  <span>Mon - Sat: 8:00 - 17:00</span>
                </li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
              <p className="text-gray-400 mb-4">Subscribe to our newsletter for updates.</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="bg-gray-800 text-white px-4 py-2 rounded-lg flex-grow"
                />
                <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Blood Bank. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
