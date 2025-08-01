// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { ExpandProfile } from "./ExpandProfile";
// import { 
//   BookOpen, 
//   ExternalLink, 
//   CheckCircle,
//   Circle,
//   ArrowRight,
//   Target,
//   Clock,
//   Trophy,
//     Code,
//   Layers,
//   Database,
//   GitBranch,
//   Activity,
//   Calendar,
//   Users,
//   Lightbulb,
//   TrendingUp,
//   Shield,
//   ClipboardList,
//   Globe,
//   Heart,
//   FileText
// } from "lucide-react";
// import skillsData from "../data/SkillsData";


// export default function Skills() {
//   const navigate = useNavigate();
//   const [selectedCourse, setSelectedCourse] = useState("");
//   const [selectedPath, setSelectedPath] = useState("");
//   const [selectedRole, setSelectedRole] = useState("");
//   const [skills, setSkills] = useState([]);
//   const [completedSkills, setCompletedSkills] = useState(new Set());

//   useEffect(() => {
//     const urlParams = new URLSearchParams(window.location.search);
//     const course = urlParams.get('course') || "Computer Science";
//     const path = urlParams.get('path') || "fintech";
//     const role = urlParams.get('role') || "software-engineer";
    
//     setSelectedCourse(course);
//     setSelectedPath(path);
//     setSelectedRole(role);
    
//     const roleData = skillsData[role] || skillsData["frontend-engineer"];
//     setSkills(roleData.skills);
//   }, []);

//   const toggleSkillCompletion = (skillId) => {
//     const newCompleted = new Set(completedSkills);
//     if (newCompleted.has(skillId)) {
//       newCompleted.delete(skillId);
//     } else {
//       newCompleted.add(skillId);
//     }
//     setCompletedSkills(newCompleted);
//   };
// const createPageUrl = (pageName) => {
//   const pageRoutes = {
//     SkillsPage: "/skills",
//     CareerPathPage: "/career-path",
//     JobRolePage: "/job-roles",
//     Assessment: "/assessment",
//     result: "/result",
//   };
//   return pageRoutes[pageName] || "/";
// };
//   const handleTakeAssessment = (skillId) => {
//     navigate(createPageUrl("Assessment") + `?course=${encodeURIComponent(selectedCourse)}&path=${selectedPath}&role=${selectedRole}&skill=${skillId}`);
//   };

// const completionPercentage =
//   skills?.length > 0
//     ? Math.round((completedSkills.size / skills.length) * 100)
//     : 0;

//   const roleData = skillsData[selectedRole] || skillsData["frontend-engineer"];

//   const getDifficultyColor = (difficulty) => {
//     switch (difficulty) {
//       case "Beginner": return "bg-green-100 text-green-700 border-green-200";
//       case "Intermediate": return "bg-yellow-100 text-yellow-700 border-yellow-200";
//       case "Advanced": return "bg-red-100 text-red-700 border-red-200";
//       default: return "bg-gray-100 text-gray-700 border-gray-200";
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-900  py-12 px-4">
//       <div className="max-w-5xl mx-auto">
//         {/* Header */}
//         <div className="text-center mb-12">
//           <div className="flex justify-between items-center mb-12">
//                 <h1 className="text-2xl font-bold text-white">PATHWISE AI</h1>
//                 <ExpandProfile />
//             </div>
//           <h1 className="text-5xl font-bold text-white mb-4">
//             Skills for{" "}
//             <span className="bg-green-500  bg-clip-text text-transparent">
//               {roleData.roleName}
//             </span>
//           </h1>
//           <p className="text-lg text-zinc-300 max-w-3xl mx-auto leading-relaxed mb-8">
//             Master these essential skills to become job-ready. Track your progress and test your knowledge.
//           </p>

//           {/* Progress Overview */}
//           <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-xl border border-green-100 p-8 mb-12">
//             <div className="flex items-center justify-between mb-4">
//               <h3 className="text-lg font-bold text-white">Learning Progress</h3>
//               <div className="flex items-center gap-2">
//                 <Trophy className="w-5 h-5 text-yellow-500" />
//                 <span className="font-bold text-white">{completedSkills.size}/{skills.length} Skills</span>
//               </div>
//             </div>
//             <progress value={completionPercentage} className="w-full h-4 rounded-lg overflow-hidden [&::-webkit-progress-bar]:bg-gray-200 [&::-webkit-progress-value]:bg-gradient-to-r [&::-webkit-progress-value]:from-green-500 [&::-webkit-progress-value]:to-orange-500"  max="100"/>
//             <p className="text-sm text-zinc-300">{Math.round(completionPercentage)}% Complete</p>
//           </div>
//         </div>

//         {/* Skills List */}
//         <div className="space-y-6 mb-12">
//           {skills.map((skill, index) => {
//             const isCompleted = completedSkills.has(skill.id);
//             return (
//               <div
//                 key={skill.id}
//                 className="bg-green-50 backdrop-blur-xl rounded-3xl shadow-xl border border-purple-100 p-8 hover:shadow-2xl transition-all duration-300"
//               >
//                 <div className="flex items-start gap-6">
//                   {/* Completion Status */}
//                   <button
//                     onClick={() => toggleSkillCompletion(skill.id)}
//                     className="mt-1 flex-shrink-0"
//                   >
//                     {isCompleted ? (
//                       <CheckCircle className="w-7 h-7 text-green-500 hover:text-green-600 transition-colors" />
//                     ) : (
//                       <Circle className="w-7 h-7 text-gray-300 hover:text-orange-500 transition-colors" />
//                     )}
//                   </button>

//                   {/* Skill Content */}
//                   <div className="flex-1">
//                     <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
//                       <div>
//                         <h3 className="text-xl font-bold text-gray-900 mb-2">{skill.name}</h3>
//                         <p className="text-gray-600 mb-3">{skill.description}</p>
                        
//                         <div className="flex flex-wrap gap-3">
//                           <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(skill.difficulty)}`}>
//                             {skill.difficulty}
//                           </span>
//                           <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200 flex items-center gap-1">
//                             <Clock className="w-3 h-3" />
//                             {skill.timeEstimate}
//                           </span>
//                         </div>
//                       </div>

//                       <div className="flex flex-col gap-3">
//                         {isCompleted && (
//                           <button
//                             onClick={() => handleTakeAssessment(skill.id)}
//                             size="sm"
//                             className="bg-green-500 cursor-pointer  hover:from-purple-700 hover:to-green-700 text-white px-6 py-2 rounded-xl"
//                           >
//                             Take Assessment
//                           </button>
//                         )}
//                         <button
//                           variant="outline"
//                           size="sm"
//                           className="border-orange-200 text-orange-600 hover:bg-orange-50 px-6 py-2 rounded-xl"
//                           onClick={() => toggleSkillCompletion(skill.id)}
//                         >
//                           {isCompleted ? "Mark Incomplete" : "Mark Complete"}
//                         </button>
//                       </div>
//                     </div>

//                     {/* Learning Resources */}
//                     <div>
//                       <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
//                         <BookOpen className="w-4 h-4" />
//                         Learning Resources
//                       </h4>
//                       <div className="grid md:grid-cols-2 gap-3">
//                         {skill.resources.map((resource, resourceIndex) => (
//                           <a
//                             key={resourceIndex}
//                             href={resource.url}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="flex items-center gap-3 p-3 bg-white rounded-xl hover:bg-orange-100 transition-colors group"
//                           >
//                             <ExternalLink className="w-4 h-4 text-orange-500 group-hover:text-orange-700" />
//                             <span className="text-sm font-medium text-orange-500">{resource.name}</span>
//                           </a>
//                         ))}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>

//         {/* Action Buttons */}
//         <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
//           <button
//             variant="outline"
//             onClick={() => navigate(createPageUrl("JobRolePage") + `?course=${encodeURIComponent(selectedCourse)}&path=${selectedPath}`)}
//             className="border-green-200 text-green-500 hover:bg-green-50 px-8 py-3 rounded-2xl"
//           >
//             ← Back to Job Roles
//           </button>
          
//           {completionPercentage === 100 && (
//             <button
//               onClick={() => navigate(createPageUrl("ResultPage") + `?course=${encodeURIComponent(selectedCourse)}&path=${selectedPath}&role=${selectedRole}`)}
//               className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-3 rounded-2xl flex items-center gap-2"
//             >
//               View Career Roadmap
//               <ArrowRight className="w-5 h-5" />
//             </button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }



import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ExpandProfile } from "./ExpandProfile";
import {
  BookOpen,
  ExternalLink,
  CheckCircle,
  Circle,
  ArrowRight,
  Clock,
  Trophy
} from "lucide-react";
import skillsData from "../data/SkillsData";

export default function Skills() {
  const navigate = useNavigate();
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedPath, setSelectedPath] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [skills, setSkills] = useState([]);
  const [completedSkills, setCompletedSkills] = useState(new Set());

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const course = urlParams.get("course") || "Computer Science";
    const path = urlParams.get("path") || "fintech";
    const role = urlParams.get("role") || "";

    setSelectedCourse(course);
    setSelectedPath(path);
    setSelectedRole(role);

    if (role && skillsData[role] && Array.isArray(skillsData[role].skills) && skillsData[role].skills.length > 0) {
      setSkills(skillsData[role].skills);
    } else {
      setSkills([]); // no fallback
    }
  }, []);

  const toggleSkillCompletion = (skillId) => {
    const newCompleted = new Set(completedSkills);
    if (newCompleted.has(skillId)) {
      newCompleted.delete(skillId);
    } else {
      newCompleted.add(skillId);
    }
    setCompletedSkills(newCompleted);
  };

  const createPageUrl = (pageName) => {
    const pageRoutes = {
      SkillsPage: "/skills",
      CareerPathPage: "/career-path",
      JobRolePage: "/job-roles",
      Assessment: "/assessment",
      ResultPage: "/result"
    };
    return pageRoutes[pageName] || "/";
  };

  const handleTakeAssessment = (skillId) => {
    navigate(
      createPageUrl("Assessment") +
        `?course=${encodeURIComponent(selectedCourse)}&path=${selectedPath}&role=${selectedRole}&skill=${skillId}`
    );
  };

  const completionPercentage =
    skills?.length > 0
      ? Math.round((completedSkills.size / skills.length) * 100)
      : 0;

  // Safe roleData access for display (might be undefined)
  const roleData = selectedRole && skillsData[selectedRole] ? skillsData[selectedRole] : { roleName: selectedRole || "Unknown Role" };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-100 text-green-700 border-green-200";
      case "Intermediate":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "Advanced":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex justify-between items-center mb-12">
            <h1 className="text-2xl font-bold text-white">PATHWISE AI</h1>
            <ExpandProfile />
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">
            Skills for {" "}
            <span className="bg-green-500 bg-clip-text text-transparent">
              {roleData.roleName}
            </span>
          </h1>
          <p className="text-lg text-zinc-300 max-w-3xl mx-auto leading-relaxed mb-8">
            Master these essential skills to become job-ready. Track your progress and test your knowledge.
          </p>

          <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-xl border border-green-100 p-8 mb-12">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Learning Progress</h3>
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                <span className="font-bold text-white">
                  {completedSkills.size}/{skills.length} Skills
                </span>
              </div>
            </div>
            <progress
              value={completionPercentage}
              className="w-full h-4 rounded-lg overflow-hidden [&::-webkit-progress-bar]:bg-gray-200 [&::-webkit-progress-value]:bg-gradient-to-r [&::-webkit-progress-value]:from-green-500 [&::-webkit-progress-value]:to-orange-500"
              max="100"
            />
            <p className="text-sm text-zinc-300">{Math.round(completionPercentage)}% Complete</p>
          </div>
        </div>

        {/* Skills List or Empty State */}
        {skills.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-xl border border-red-300 p-8 text-center">
            <p className="text-lg font-semibold text-red-400">
              No skills under this.
            </p>
            <p className="text-sm text-zinc-300 mt-2">
              The selected role ({selectedRole || "none"}) doesn&apos;t have any defined skills yet.
            </p>
          </div>
        ) : (
          <div className="space-y-6 mb-12">
            {skills.map((skill) => {
              const isCompleted = completedSkills.has(skill.id);
              return (
                <div
                  key={skill.id}
                  className="bg-green-50 backdrop-blur-xl rounded-3xl shadow-xl border border-purple-100 p-8 hover:shadow-2xl transition-all duration-300"
                >
                  <div className="flex items-start gap-6">
                    <button onClick={() => toggleSkillCompletion(skill.id)} className="mt-1 flex-shrink-0">
                      {isCompleted ? (
                        <CheckCircle className="w-7 h-7 text-green-500 hover:text-green-600 transition-colors" />
                      ) : (
                        <Circle className="w-7 h-7 text-gray-300 hover:text-orange-500 transition-colors" />
                      )}
                    </button>

                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-2">{skill.name}</h3>
                          <p className="text-gray-600 mb-3">{skill.description}</p>

                          <div className="flex flex-wrap gap-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(skill.difficulty)}`}>
                              {skill.difficulty}
                            </span>
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {skill.timeEstimate}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col gap-3">
                          {isCompleted && (
                            <button
                              onClick={() => handleTakeAssessment(skill.id)}
                              size="sm"
                              className="bg-green-500 cursor-pointer hover:from-purple-700 hover:to-green-700 text-white px-6 py-2 rounded-xl"
                            >
                              Take Assessment
                            </button>
                          )}
                          <button
                            variant="outline"
                            size="sm"
                            className="border-orange-200 text-orange-600 hover:bg-orange-50 px-6 py-2 rounded-xl"
                            onClick={() => toggleSkillCompletion(skill.id)}
                          >
                            {isCompleted ? "Mark Incomplete" : "Mark Complete"}
                          </button>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                          <BookOpen className="w-4 h-4" />
                          Learning Resources
                        </h4>
                        <div className="grid md:grid-cols-2 gap-3">
                          {skill.resources.map((resource, resourceIndex) => (
                            <a
                              key={resourceIndex}
                              href={resource.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-3 p-3 bg-white rounded-xl hover:bg-orange-100 transition-colors group"
                            >
                              <ExternalLink className="w-4 h-4 text-orange-500 group-hover:text-orange-700" />
                              <span className="text-sm font-medium text-orange-500">{resource.name}</span>
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            variant="outline"
            onClick={() => navigate(createPageUrl("JobRolePage") + `?course=${encodeURIComponent(selectedCourse)}&path=${selectedPath}`)}
            className="border-green-200 text-green-500 hover:bg-green-50 px-8 py-3 rounded-2xl"
          >
            ← Back to Job Roles
          </button>

          {completionPercentage === 100 && (
            <button
              onClick={() => navigate(createPageUrl("ResultPage") + `?course=${encodeURIComponent(selectedCourse)}&path=${selectedPath}&role=${selectedRole}`)}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-3 rounded-2xl flex items-center gap-2"
            >
              View Career Roadmap
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
