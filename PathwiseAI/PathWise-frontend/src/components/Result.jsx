import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ExpandProfile } from "./ExpandProfile";
import { 
  Trophy, 
  CheckCircle, 
  XCircle, 
  RotateCcw, 
  ArrowRight,
  Award,
  Star,
  Target,
  TrendingUp
} from "lucide-react";

export default function Result() {
  const navigate = useNavigate();
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedPath, setSelectedPath] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedSkill, setSelectedSkill] = useState("");
  const [score, setScore] = useState(0);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    setSelectedCourse(urlParams.get('course') || "Computer Science");
    setSelectedPath(urlParams.get('path') || "fintech");
    setSelectedRole(urlParams.get('role') || "software-engineer");
    setSelectedSkill(urlParams.get('skill') || "javascript");
    setScore(parseInt(urlParams.get('score')) || 85); // Default demo score
  }, []);

  const isPassed = score >= 75;
  const skillNames = {
    javascript: "JavaScript Fundamentals",
    react: "React Development",
    nodejs: "Node.js Backend",
    databases: "Database Management",
    git: "Version Control (Git)"
  };

  const skillName = skillNames[selectedSkill] || "Programming Skill";
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

  const handleRetakeAssessment = () => {
    navigate(createPageUrl("AssessmentEntryPage") + 
      `?course=${encodeURIComponent(selectedCourse)}&path=${selectedPath}&role=${selectedRole}&skill=${selectedSkill}`);
  };

  const handleContinueToSkills = () => {
    navigate(createPageUrl("SkillsPage") + 
      `?course=${encodeURIComponent(selectedCourse)}&path=${selectedPath}&role=${selectedRole}`);
  };

  const getScoreColor = (score) => {
    if (score >= 90) return "text-green-500";
    if (score >= 75) return "text-blue-500";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  const getScoreBackground = (score) => {
    if (score >= 90) return "from-green-500 to-emerald-500";
    if (score >= 75) return "from-blue-500 to-indigo-500";
    if (score >= 60) return "from-yellow-500 to-orange-500";
    return "from-red-500 to-pink-500";
  };

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
           <div className="flex justify-between items-center mb-12">
                <h1 className="text-2xl font-bold text-white">PATHWISE AI</h1>
                <ExpandProfile />
            </div>
          <h1 className="text-5xl font-bold text-white mb-4">
            Assessment Complete! 🎉
          </h1>
        </div>

        {/* Result Card */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-purple-100 p-8 md:p-12 mb-8">
          {/* Score Display */}
          <div className="text-center mb-8">
            <div className={`w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-r ${getScoreBackground(score)} flex items-center justify-center shadow-2xl`}>
              <div className="bg-white rounded-full w-28 h-28 flex items-center justify-center">
                <span className={`text-4xl font-bold ${getScoreColor(score)}`}>{score}%</span>
              </div>
            </div>

            <div className="mb-6">
              {isPassed ? (
                <div className="flex items-center justify-center gap-3 mb-4">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                  <h2 className="text-2xl font-bold text-green-600">Congratulations! You Passed!</h2>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-3 mb-4">
                  <XCircle className="w-8 h-8 text-red-500" />
                  <h2 className="text-2xl font-bold text-red-600">Keep Learning!</h2>
                </div>
              )}
              
              <p className="text-lg text-zinc-300">
                {isPassed 
                  ? `Excellent work on the ${skillName} assessment!`
                  : `You scored below 75%. Please revisit the learning resources.`
                }
              </p>
            </div>

            {/* Skill Badge */}
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-50 to-indigo-50 px-6 py-3 rounded-2xl border border-purple-200">
              <Target className="w-5 h-5 text-orange-600" />
              <span className="font-bold text-orange-500">{skillName}</span>
            </div>
          </div>

          {/* Score Breakdown */}
          <div className="bg-gradient-to-r from-gray-50 to-purple-50 rounded-2xl p-6 mb-8">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Performance Breakdown
            </h3>
            
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 mb-1">{Math.round(score * 20 / 100)}/20</div>
                <div className="text-sm text-gray-600">Questions Correct</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 mb-1">{score}%</div>
                <div className="text-sm text-gray-600">Final Score</div>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold mb-1 ${isPassed ? 'text-green-600' : 'text-red-600'}`}>
                  {isPassed ? 'PASS' : 'RETRY'}
                </div>
                <div className="text-sm text-gray-600">Result</div>
              </div>
            </div>

            <div className="mt-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Progress</span>
                <span>{score}% / 75% required</span>
              </div>
              <progress value={score} className="w-full h-4 rounded-lg overflow-hidden [&::-webkit-progress-bar]:bg-green-200 [&::-webkit-progress-value]:bg-gradient-to-r [&::-webkit-progress-value]:from-green-500 [&::-webkit-progress-value]:to-green-500" />
            </div>
          </div>

          {/* Certificate Section */}
          {isPassed && (
            <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-2xl p-6 border border-yellow-200 mb-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-xl flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-amber-900">Skill Certificate Earned!</h3>
                  <p className="text-amber-700">You've demonstrated proficiency in {skillName}</p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                  <Star className="w-3 h-3" />
                  Verified Skill
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-medium">
                  <CheckCircle className="w-3 h-3" />
                  Industry Ready
                </span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!isPassed && (
              <button
                onClick={handleRetakeAssessment}
                variant="outline"
                className="border-green-200 text-green-600 hover:bg-green-50 px-8 py-3 rounded-2xl flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Retake Assessment
              </ button>
            )}
            
            <button
              onClick={handleContinueToSkills}
              className="bg-green-500 border-4 cursor-pointer hover:scale-105 transition transform border-white hover:from-green-700 hover:to-indigo-700 text-white px-8 py-3 rounded-2xl flex items-center gap-2"
            >
              Continue Learning
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 text-center">
          <h3 className="font-bold text-gray-900 mb-3">What's Next?</h3>
          <p className="text-gray-600 mb-4">
            {isPassed 
              ? "Continue with the remaining skills to complete your career roadmap!"
              : "Review the learning materials and try the assessment again when you're ready."
            }
          </p>
          <div className="inline-flex items-center gap-2 text-orange-600 bg-purple-50 px-4 py-2 rounded-full">
            <Target className="w-4 h-4" />
            <span className="text-sm font-medium">Keep building your expertise!</span>
          </div>
        </div>
      </div>
    </div>
  );
}