import React, { useState } from 'react';

const AuthPages = () => {
  const [activeTab, setActiveTab] = useState('signup');

  return (
    <div className="min-h-screen w-full px-6 py-4 relative" style={{ background: '#101727' }}>
      {/* Green elliptical blur effect */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: '10%',
          left: '15%',
          width: '400px',
          height: '200px',
          background: '#01742B',
          borderRadius: '50%',
          filter: 'blur(80px)',
          opacity: 0.3,
          zIndex: 1
        }}
      />
      
      {/* Another blur effect for more ambiance */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: '60%',
          right: '10%',
          width: '300px',
          height: '150px',
          background: '#01742B',
          borderRadius: '50%',
          filter: 'blur(70px)',
          opacity: 0.2,
          zIndex: 1
        }}
      />

      {/* Navbar */}
      <nav className="flex items-center justify-between px-12 py-4 relative w-full max-w-[95%] mx-auto mb-8">
        <div className="text-green-400 font-bold text-xl relative z-10">
          PathWise AI
        </div>
        <a href="/course-selection" className="text-white hover:text-green-400 transition-colors duration-200 flex items-center space-x-2 relative z-10">
          <span>🏠</span>
          <span>Proceed</span>
        </a>
      </nav>

      {/* Auth Form Container */}
      <div className="flex items-center justify-center min-h-[70vh] relative z-10">
        <div
          className="w-full max-w-md p-8 relative overflow-hidden"
          style={{
            background: 'rgba(19, 21, 27, 0.4)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
          }}
        >
          {/* Gradient border */}
          <div
            className="absolute pointer-events-none"
            style={{
              top: '0',
              left: '0',
              right: '0',
              bottom: '0',
              borderRadius: '20px',
              padding: '1px',
              background: 'linear-gradient(to bottom, #aaa 0%, #019438 100%)',
              WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMaskComposite: 'xor',
              mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              maskComposite: 'exclude'
            }}
          />

          {/* Tab Buttons */}
          <div className="flex mb-8 relative z-10">
            <button
              onClick={() => setActiveTab('signup')}
              className={`flex-1 py-3 px-6 rounded-l-lg font-medium transition-all duration-300 ${
                activeTab === 'signup'
                  ? 'bg-green-500 text-white'
                  : 'bg-transparent text-gray-300 hover:text-white'
              }`}
            >
              Sign Up
            </button>
            <button
              onClick={() => setActiveTab('login')}
              className={`flex-1 py-3 px-6 rounded-r-lg font-medium transition-all duration-300 ${
                activeTab === 'login'
                  ? 'bg-green-500 text-white'
                  : 'bg-transparent text-gray-300 hover:text-white'
              }`}
            >
              Login
            </button>
          </div>

          {/* Sign Up Form */}
          {activeTab === 'signup' && (
            <div className="space-y-6 relative z-10">
              <div>
                <input
                  type="text"
                  placeholder="Full name (First name, Last name)"
                  className="w-full px-4 py-3 bg-transparent border border-green-400 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-300 transition-colors duration-200"
                />
              </div>
              <div>
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full px-4 py-3 bg-transparent border border-green-400 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-300 transition-colors duration-200"
                />
              </div>
              <div>
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full px-4 py-3 bg-transparent border border-green-400 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-300 transition-colors duration-200"
                />
              </div>
              <div>
                <input
                  type="password"
                  placeholder="Retype Password"
                  className="w-full px-4 py-3 bg-transparent border border-green-400 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-300 transition-colors duration-200"
                />
              </div>
              <button
                type="button"
                className="w-full py-3 bg-green-500 text-white rounded-lg hover:bg-green-400 transition-colors duration-200 font-medium"
              >
                Sign Up
              </button>
            </div>
          )}

          {/* Login Form */}
          {activeTab === 'login' && (
            <div className="space-y-6 relative z-10">
              <div>
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full px-4 py-3 bg-transparent border border-green-400 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-300 transition-colors duration-200"
                />
              </div>
              <div>
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full px-4 py-3 bg-transparent border border-green-400 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-300 transition-colors duration-200"
                />
              </div>
              <button
                type="button"
                className="w-full py-3 bg-green-500 text-white rounded-lg hover:bg-green-400 transition-colors duration-200 font-medium"
              >
                Login
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPages;