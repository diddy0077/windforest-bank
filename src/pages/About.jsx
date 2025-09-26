import React,{useEffect} from 'react';
import { useNavigate } from 'react-router-dom';

// Mock Icon Component for Visual Appeal (using inline SVG)
const Icon = ({ path, className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={path} />
  </svg>
);



const About = () => {
  useEffect(() => {
     window.scrollTo({top: 0, behavior: 'smooth'})
    }, [])


  const nav = useNavigate()
  return (
    <div className="min-h-screen bg-white font-sans antialiased text-gray-800">

      {/* Hero Section - Dark Gray Overlay for Strong Contrast */}
      <section className="relative h-[60vh] md:h-[70vh] overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1616803140344-6682afb13cda?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
            backgroundAttachment: 'fixed' // Parallax effect
          }}
        >
          {/* Using deep gray for a professional and stable backdrop */}
          <div className="absolute inset-0 bg-gray-900 opacity-80"></div>
        </div>
        <div className="relative z-10 flex items-center justify-center h-full text-center px-6">
          <div className="max-w-4xl text-white">
            {/* Red accent for the subtitle */}
            <p className="text-lg font-medium tracking-widest uppercase text-red-400 mb-2">Our Foundation, Your Future</p>
            <h1 className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tight mb-4 drop-shadow-lg">
              Welcome to WindForest Bank
            </h1>
            <p className="text-xl md:text-2xl font-light max-w-2xl mx-auto drop-shadow-md text-gray-200">
              Rooted in security, driven by innovation, and committed to your financial prosperity.
            </p>
          </div>
        </div>
      </section>

      {/* Introduction & Mission - Clean White Background */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="relative h-96 rounded-3xl shadow-2xl overflow-hidden transform hover:scale-[1.02] transition duration-500">
            {/* Image Placeholder changed to reflect the red/gray theme */}
            <img 
              src="https://images.unsplash.com/photo-1601597111158-2fceff292cdc?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
              alt="WindForest Bank Team" 
              className="w-full h-full object-cover"
            />
            {/* Design addition: corner accent in Red-600 */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-red-600 rounded-bl-3xl opacity-90"></div>
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold uppercase text-red-600 mb-2">Our Mission</p>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-6 text-gray-900 border-b-4 border-red-600 pb-2 inline-block">
              Building Trust, Growing Wealth.
            </h2>
            <p className="text-lg mb-6 text-gray-600 leading-relaxed">
              WindForest Bank was founded on the simple premise that modern banking should be both **secure and accessible**. We blend the stability of traditional finance with the agility of digital technology to provide a seamless, reliable experience for every client.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              We empower individuals and businesses with the **tools, advice, and financial security** they need to navigate their journey with confidence.
            </p>
          </div>
        </div>
      </section>

      {/* Core Values Section - Light Gray Background with Distinct Card Design */}
      <section className="py-20 bg-gray-100 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-sm font-semibold uppercase text-red-600 mb-2">The WindForest Way</p>
          <h2 className="text-3xl md:text-4xl font-extrabold mb-16 text-gray-900">
            Our Guiding Principles
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            
            {/* Value 1: Security (Red/Gray Focus) */}
            <div className="p-8 bg-white rounded-3xl shadow-xl hover:shadow-2xl transition duration-300 transform hover:-translate-y-1 border-b-8 border-red-600">
              <div className="p-4 bg-gray-200 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <Icon 
                  path="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
                  className="w-10 h-10 text-red-600" 
                />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">Unwavering Security</h3>
              <p className="text-gray-600">
                We prioritize your data and assets above all, using military-grade encryption and multi-factor authentication systems.
              </p>
            </div>
            
            {/* Value 2: Transparency (Red/Gray Focus) */}
            <div className="p-8 bg-white rounded-3xl shadow-xl hover:shadow-2xl transition duration-300 transform hover:-translate-y-1 border-b-8 border-red-600">
              <div className="p-4 bg-gray-200 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <Icon 
                  path="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" 
                  className="w-10 h-10 text-red-600" 
                />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">Clear Transparency</h3>
              <p className="text-gray-600">
                Expect honest, straightforward communication with zero hidden fees. Clarity is the foundation of our client relationships.
              </p>
            </div>

            {/* Value 3: Innovation (Red/Gray Focus) */}
            <div className="p-8 bg-white rounded-3xl shadow-xl hover:shadow-2xl transition duration-300 transform hover:-translate-y-1 border-b-8 border-red-600">
              <div className="p-4 bg-gray-200 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <Icon 
                  path="M13 10V3L4 14h7v7l9-11h-7z" 
                  className="w-10 h-10 text-red-600" 
                />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">Digital Innovation</h3>
              <p className="text-gray-600">
                We commit to continuously evolving our platform to offer the fastest, most intuitive, and most advanced financial tools.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Leadership/Team Placeholder - Gray Background with Subtle White Gradient */}
      <section className="py-20 px-6 bg-gray-50" style={{ backgroundImage: 'radial-gradient(circle at 50% 10%, #fff 0%, #f7f7f7 100%)' }}>
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm font-semibold uppercase text-red-600 mb-2">Meet the Visionaries</p>
          <h2 className="text-3xl md:text-4xl font-extrabold mb-16 text-gray-900">
            Our Dedicated Leadership
          </h2>
          
          <div className="flex flex-col md:flex-row justify-center space-y-8 md:space-y-0 md:space-x-12">
            
            {/* Leader 1 */}
            <div className="max-w-xs mx-auto p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-300">
              <img 
                src="https://placehold.co/150x150/ef4444/ffffff?text=A.D." 
                alt="Placeholder Portrait" 
                className="w-36 h-36 rounded-full mx-auto object-cover border-4 border-red-600 mb-4 shadow-xl grayscale hover:grayscale-0 transition duration-500"
              />
              <h4 className="text-xl font-extrabold text-gray-900">Amelia Davies</h4>
              <p className="text-red-700 font-medium text-lg">Chief Executive Officer</p>
              <p className="text-sm text-gray-500 mt-2">Visionary & Founder</p>
            </div>
            
            {/* Leader 2 */}
            <div className="max-w-xs mx-auto p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-300">
              <img 
                src="https://placehold.co/150x150/ef4444/ffffff?text=J.S." 
                alt="Placeholder Portrait" 
                className="w-36 h-36 rounded-full mx-auto object-cover border-4 border-red-600 mb-4 shadow-xl grayscale hover:grayscale-0 transition duration-500"
              />
              <h4 className="text-xl font-extrabold text-gray-900">Jonathan Stone</h4>
              <p className="text-red-700 font-medium text-lg">Chief Technology Officer</p>
              <p className="text-sm text-gray-500 mt-2">Innovator & Digital Strategist</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA/Footer Commitment - Strong Dark Gray for Trust and Finality */}
      <section className="py-20 bg-gray-800 text-white px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-extrabold mb-4">
            Ready to experience the WindForest difference?
          </h2>
          <p className="text-xl mb-10 opacity-90 max-w-2xl mx-auto text-gray-300">
            Join the bank that puts your financial security and growth first. Enrollment is fast, secure, and fully digital.
          </p>
          <button 
            className="px-12 py-4 bg-red-600 text-white font-black rounded-full text-xl shadow-2xl hover:bg-red-700 transition-all duration-300 cursor-pointer transform hover:scale-105"
            onClick={() => nav('/account-types')}
          >
            Start Your Journey Today &gt;
          </button>
        </div>
      </section>
      
    </div>
  );
};

export default About;
