import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Clock, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle,
  Circle,
  Flag
} from "lucide-react";

const sampleQuestions = [
  {
    id: 1,
    question: "What is the correct way to declare a variable in JavaScript ES6?",
    options: [
      "var myVariable = 'hello';",
      "let myVariable = 'hello';", 
      "const myVariable = 'hello';",
      "Both B and C are correct"
    ],
    correctAnswer: 3
  },
  {
    id: 2,
    question: "Which method is used to add an element to the end of an array?",
    options: [
      "array.push()",
      "array.add()",
      "array.append()",
      "array.insert()"
    ],
    correctAnswer: 0
  },
  {
    id: 3,
    question: "What does 'DOM' stand for in web development?",
    options: [
      "Document Object Model",
      "Data Object Management",
      "Dynamic Object Method",
      "Document Oriented Model"
    ],
    correctAnswer: 0
  },
  {
    id: 4,
    question: "Which JavaScript function is used to parse JSON strings?",
    options: [
      "JSON.parse()",
      "JSON.stringify()",
      "parseJSON()",
      "JSON.decode()"
    ],
    correctAnswer: 0
  },
  {
    id: 5,
    question: "What is the purpose of the 'async' keyword in JavaScript?",
    options: [
      "To make functions run faster",
      "To declare asynchronous functions",
      "To handle errors",
      "To create loops"
    ],
    correctAnswer: 1
  }
];

export default function Test() {
  const navigate = useNavigate();
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedPath, setSelectedPath] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedSkill, setSelectedSkill] = useState("");
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 minutes in seconds
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    setSelectedCourse(urlParams.get('course') || "Computer Science");
    setSelectedPath(urlParams.get('path') || "fintech");
    setSelectedRole(urlParams.get('role') || "software-engineer");
    setSelectedSkill(urlParams.get('skill') || "javascript");
  }, []);

  useEffect(() => {
    if (timeLeft > 0 && !isSubmitted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      handleSubmit();
    }
  }, [timeLeft, isSubmitted]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (questionId, answerIndex) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };
const createPageUrl = (pageName) => {
  const pageRoutes = {
    SkillsPage: "/skills",            // or "/career-skills" or your actual path
    CareerPathPage: "/career-path",   // match this to your <Route path="..." />
    JobRolePage: "/job-roles",        // match this to your <Route path="..." />
    Assessment: "/assessment",        // or your actual path for assessment 
    ResultPage: "/result" ,                // or your actual path for result 
     TestPage: "/test",              // or your actual path for test
  };

  return pageRoutes[pageName] || "/";
};

  const handleSubmit = () => {
    setIsSubmitted(true);
    const score = calculateScore();
    navigate(createPageUrl("ResultPage") + 
      `?course=${encodeURIComponent(selectedCourse)}&path=${selectedPath}&role=${selectedRole}&skill=${selectedSkill}&score=${score}`);
  };

  const calculateScore = () => {
    let correct = 0;
    sampleQuestions.forEach(question => {
      if (answers[question.id] === question.correctAnswer) {
        correct++;
      }
    });
    return Math.round((correct / sampleQuestions.length) * 100);
  };

  const currentQ = sampleQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / sampleQuestions.length) * 100;
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header with Timer */}
        <div className="bg-white backdrop-blur-xl rounded-2xl shadow-lg border border-green-100 p-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold text-gray-900">JavaScript Assessment</h1>
              <p className="text-gray-600">Question {currentQuestion + 1} of {sampleQuestions.length}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-green-600">
                <Clock className="w-5 h-5" />
                <span className="font-mono text-lg font-bold">{formatTime(timeLeft)}</span>
              </div>
              <div className="text-sm text-gray-600">
                {answeredCount}/{sampleQuestions.length} answered
              </div>
            </div>
          </div>
          <progress value={progress} 
            className="w-full h-3 mt-4 rounded-full overflow-hidden 
                [&::-webkit-progress-bar]:bg-orange-200 
                [&::-webkit-progress-value]:bg-green-600"  />
        </div>

        {/* Question Card */}
        <div className="bg-white backdrop-blur-xl rounded-3xl shadow-2xl border border-green-100 p-8 mb-8">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-green-500  rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">{currentQuestion + 1}</span>
              </div>
              <span className="text-sm text-grren-500 font-medium">
                Question {currentQuestion + 1}
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 leading-relaxed">
              {currentQ.question}
            </h2>
          </div>

          {/* Answer Options */}
          <div className="space-y-4 mb-8">
            {currentQ.options.map((option, index) => {
              const isSelected = answers[currentQ.id] === index;
              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(currentQ.id, index)}
                  className={`w-full text-left p-6 rounded-2xl border-2 transition-all duration-200 ${
                    isSelected
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 hover:border-green-300 hover:bg-green-25"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      isSelected
                        ? "border-green-500 bg-green-500"
                        : "border-gray-300"
                    }`}>
                      {isSelected && <CheckCircle className="w-4 h-4 text-white" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-bold text-gray-600">
                          {String.fromCharCode(65 + index)}
                        </span>
                        <span className="text-gray-900 font-medium">{option}</span>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            variant="outline"
            onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
            disabled={currentQuestion === 0}
            className="border-gray-200 text-zinc-300 hover:bg-gray-50 px-6 py-3 rounded-xl"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </button>

          <div className="flex gap-3">
            {currentQuestion < sampleQuestions.length - 1 ? (
              <button
                onClick={() => setCurrentQuestion(currentQuestion + 1)}
                className="bg-green-500 flex hover:from-green-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl"
              >
                Next
                <ArrowRight className="w-4 mt-1.5 h-4 ml-2" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-3 rounded-xl font-semibold"
                disabled={answeredCount < sampleQuestions.length}
              >
                <Flag className="w-4 h-4 mr-2" />
                Submit Assessment
              </button>
            )}
          </div>
        </div>

        {/* Question Overview */}
        <div className="mt-8 bg-white/50 backdrop-blur-sm rounded-2xl p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Question Overview</h3>
          <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
            {sampleQuestions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestion(index)}
                className={`aspect-square rounded-lg text-sm font-bold transition-all duration-200 ${
                  answers[sampleQuestions[index].id] !== undefined
                    ? "bg-green-500 text-white"
                    : index === currentQuestion
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}