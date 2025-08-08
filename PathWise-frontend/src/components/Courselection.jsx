import React, { useState, useEffect, useRef } from 'react';
import { Search, ChevronDown, BookOpen } from 'lucide-react'; 
import { ExpandProfile } from "./ExpandProfile";
import { useNavigate } from 'react-router-dom';

const courses = [
  "Computer Science",
  "Software Engineering", 
  "Information Technology",
  "Law",
  "Economics",
  "Business Administration",
  "Accounting",
  "Finance",
  "Marketing",
  "Mass Communication",
  "Political Science",
  "International Relations",
  "Medicine",
  "Nursing",
  "Pharmacy",
  "Engineering (Civil)",
  "Engineering (Mechanical)",
  "Engineering (Electrical)",
  "Architecture",
  "Psychology",
  "Sociology",
  "English Language",
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology"
];

export const Courselection = () => {
  const [selectedCourse, setSelectedCourse] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [firstname, setFirstname] = useState('');
  const dropdownRef = useRef(null);
  const navigate = useNavigate(); 

  useEffect(() => {
    const getStoredFirstName = () => {
      // Try direct keys first
      let name = localStorage.getItem("firstName") || localStorage.getItem("firstname");
      if (name) return name;

      // Fallback to user object
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          return parsedUser.firstName || parsedUser.firstname || '';
        } catch (error) {
          console.error("Error parsing user from localStorage:", error);
        }
      }
      return '';
    };

    const rawName = getStoredFirstName();
    if (rawName) {
      const formatted =
        rawName.trim().charAt(0).toUpperCase() +
        rawName.trim().slice(1).toLowerCase();
      setFirstname(formatted);
    }
  }, []);

  const filteredCourses = courses.filter(course =>
    course.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleContinue = () => {
    if (selectedCourse) {
      navigate(`/career-path?course=${encodeURIComponent(selectedCourse)}`);
    }
  };

  const handleCourseSelect = (course) => {
    setSelectedCourse(course);
    setSearchTerm(course);
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen text-white relative overflow-hidden" style={{ background: '#101727' }}>
      {/* Green elliptical blur effect - top left */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: '-10%',
          left: '5%',
          width: '400px',
          height: '200px',
          background: '#01742B',
          borderRadius: '50%',
          filter: 'blur(80px)',
          opacity: 0.4,
          zIndex: 1
        }}
      />

      {/* Another blur effect - bottom right */}
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: '-10%',
          right: '10%',
          width: '350px',
          height: '175px',
          background: '#01742B',
          borderRadius: '50%',
          filter: 'blur(70px)',
          opacity: 0.3,
          zIndex: 1
        }}
      />

      <div className="pt-10 px-10 relative z-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-2xl font-bold text-green-400">PathWise AI</h1>
          <div className="text-green-400 text-xl">Hello, {firstname || "User"} <span className="fas fa-user text-white ml-2"></span></div>
        </div>

        {/* Welcome Section */}
        <div className="text-center mb-16">
          <h2 className="text-6xl font-bold mb-6 text-green-400">
            Welcome to PathWise AI
          </h2>
          <p className="text-white text-xl mb-8 opacity-80">
            Let's discover your perfect career path
          </p>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed mb-8">
            First, tell us about your academic background.
          </p>
          <p className="text-white text-lg font-medium">
            What course are you studying (or did you study)?
          </p>
        </div>

        {/* Search Section */}
        <div className="max-w-2xl mx-auto mb-16">
          <div className="relative" ref={dropdownRef}>
            <div 
              className="relative"
              style={{
                background: 'rgba(19, 21, 27, 0.3)',
                backdropFilter: 'blur(10px)',
                borderRadius: '50px',
                border: '1px solid rgba(1, 116, 43, 0.3)'
              }}
            >
              <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-green-400 w-6 h-6" />
              <input
                type="text"
                placeholder="Search for your course..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setIsDropdownOpen(true);
                }}
                onFocus={() => setIsDropdownOpen(true)}
                className="pl-16 pr-16 py-6 text-lg rounded-full bg-transparent w-full text-white placeholder-gray-400 border-none outline-none"
              />
              <ChevronDown className="absolute right-6 top-1/2 transform -translate-y-1/2 text-green-400 w-6 h-6" />
            </div>

            {isDropdownOpen && (
              <div 
                className="absolute z-20 w-full mt-4 rounded-2xl shadow-2xl max-h-80 overflow-y-auto"
                style={{
                  background: 'rgba(19, 21, 27, 0.95)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(1, 116, 43, 0.3)'
                }}
              >
                {filteredCourses.map((course, index) => (
                  <button
                    key={index}
                    onClick={() => handleCourseSelect(course)}
                    className="w-full text-left px-6 py-4 hover:bg-green-500/20 first:rounded-t-2xl last:rounded-b-2xl transition-all duration-200 border-b border-gray-700/30 last:border-b-0 text-white"
                  >
                    <span className="font-medium">{course}</span>
                  </button>
                ))}
                {filteredCourses.length === 0 && (
                  <div className="px-6 py-4 text-gray-400 text-center">
                    No courses found matching "{searchTerm}"
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Popular Courses Section */}
        <div className="mb-20">
          <h4 className="text-center text-green-400 text-2xl font-semibold mb-12">Popular Courses</h4>
          <div className="grid grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { name: "Computer Science", icon: "💻" },
              { name: "Law", icon: "⚖️" },
              { name: "Economics", icon: "📈" },
              { name: "Business Administration", icon: "💼" },
              { name: "Medicine", icon: "🩺" }
            ].map((course, index) => (
              <button
                key={index}
                onClick={() => handleCourseSelect(course.name)}
                className="group relative overflow-hidden transition-all duration-300 hover:scale-105"
                style={{
                  background: 'rgba(19, 21, 27, 0.6)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '20px',
                  border: '1px solid rgba(1, 116, 43, 0.3)',
                  padding: '2rem'
                }}
              >
                {/* Gradient border effect on hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{
                    borderRadius: '20px',
                    padding: '1px',
                    background: 'linear-gradient(to bottom, #01742B 0%, #019438 100%)',
                    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    WebkitMaskComposite: 'xor',
                    mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    maskComposite: 'exclude'
                  }}
                />
                
                <div className="text-center relative z-10">
                  <div className="text-4xl mb-4">{course.icon}</div>
                  <div className="text-white font-medium text-lg">{course.name}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Course Display */}
        {selectedCourse && (
          <div className="max-w-2xl mx-auto mb-8">
            <div 
              className="rounded-2xl p-6"
              style={{
                background: 'rgba(1, 116, 43, 0.2)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(1, 116, 43, 0.5)'
              }}
            >
              <div className="flex items-center gap-4">
                <div 
                  className="w-14 h-14 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(1, 116, 43, 0.3)' }}
                >
                  <BookOpen className="w-7 h-7 text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-green-300 font-medium mb-1">Selected Course</p>
                  <p className="text-xl font-bold text-white">{selectedCourse}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Continue Button */}
        {selectedCourse && (
          <div className='flex justify-center items-center mb-20'>
            <button
              onClick={handleContinue}
              className="px-12 py-4 bg-green-500 hover:bg-green-400 hover:scale-105 text-white rounded-full font-medium transition-all duration-200 text-lg"
            >
              Continue to Career Paths →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
