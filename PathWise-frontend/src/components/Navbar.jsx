import React, { useState } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="px-6 py-4" style={{ backgroundColor: '#101727' }}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">P</span>
          </div>
          <span className="text-white font-semibold text-xl">Pathwise AI</span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
          <a href="#how-it-works" className="text-gray-300 hover:text-white transition-colors">How It Works</a>
          <a href="#pricing" className="text-gray-300 hover:text-white transition-colors">Pricing</a>
          <a href="#about" className="text-gray-300 hover:text-white transition-colors">About</a>
        </div>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          <button 
            onClick={() => window.location.href = '/login'}
            className="text-gray-300 hover:text-white transition-colors px-4 py-2"
          >
            Sign In
          </button>
          <button 
            onClick={() => window.location.href = '/register'}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-medium transition-colors cursor-pointer"
          >
            Get Started
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} 
            />
          </svg>
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden mt-4 space-y-4 text-gray-300">
          <a href="#features" className="block px-4 py-2 hover:text-white">Features</a>
          <a href="#how-it-works" className="block px-4 py-2 hover:text-white">How It Works</a>
          <a href="#pricing" className="block px-4 py-2 hover:text-white">Pricing</a>
          <a href="#about" className="block px-4 py-2 hover:text-white">About</a>

          {/* Mobile Auth Buttons */}
          <div className="border-t border-gray-600 pt-4 space-y-3 px-4">
            <button 
              onClick={() => window.location.href = '/login'}
              className="w-full text-left text-gray-300 hover:text-white transition-colors"
            >
              Sign In
            </button>

            <button 
              onClick={() => window.location.href = '/register'}
              className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md font-medium transition-colors"
            >
              Get Started
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
