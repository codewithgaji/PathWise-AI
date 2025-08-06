import React, { useState, useEffect } from "react";
import { useNavigate , useLocation } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { ExpandProfile } from "./ExpandProfile";
import { 
  Building2, 
  Smartphone, 
  Landmark, 
  Heart, 
  Edit3, 
  HeartPulse,
  BarChart3,
  ShieldCheck,
  Microscope,
  Monitor as MonitorIcon,
  Activity, 
  Edit,
  Monitor,
  Cpu, 
  Hospital,
  Truck,
  ShoppingCart,
  Factory,
  CheckCheck,
  Stethoscope,
  FlaskConical,
  BookOpen,
  ClipboardList,
  ClipboardCheck,
  Rocket, 
  Baby,
  ArrowRight, 
  TrendingUp,
  Users,
   Settings,
  FileCheck,
  Gavel,
   Network,
  Briefcase,
  DollarSign,
  MapPin
} from "lucide-react";


import careerPaths from "../data/CareerpathData";

export default function CareerPathPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const[isUnlocked, setIsUnlocked] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState("");
  const [paths, setPaths] = useState([]);
  //check if eye is open or not
    const toggleUnlock = () =>{
    setIsUnlocked(!isUnlocked);
    }
  const createPageUrl = (pageName) => {
    const pageRoutes = {
      SkillsPage: "/skills",
      CareerPathPage: "/career-path",
      JobRolePage: "/job-roles",
      CourseSelectionPage: "/course-selection",
    };
    return pageRoutes[pageName] || "/";
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const course = urlParams.get("course") || "";
    setSelectedCourse(course);

    // only set if the course exists and has non-empty paths
    if (course && Array.isArray(careerPaths[course]) && careerPaths[course].length > 0) {
      setPaths(careerPaths[course]);
    } else {
      setPaths([]); // empty state
    }
  }, [location.search]);

  const handlePathSelect = (pathId) => {
    navigate(
      createPageUrl("JobRolePage") +
        `?course=${encodeURIComponent(selectedCourse)}&path=${pathId}`
    );
  };
 
  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4">
      <div className="px-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-between items-center mb-12">
            <h1 className="text-2xl font-bold text-white">PATHWISE AI</h1>
            <ExpandProfile />
          </div>

          <h1 className="text-5xl font-bold text-white mb-4">
            Career Paths for{" "}
            <span className="text-green-500">
              {selectedCourse || "—"}
            </span>
          </h1>
          <p className="text-lg text-zinc-300 py-2 max-w-3xl mx-auto leading-relaxed">
            Here are some exciting career paths{selectedCourse ? ` in Nigeria for ${selectedCourse} graduates` : ""}. Choose the sector that interests you most.
          </p>
        </div>

        {/* Career Path Cards or Empty State */}
        {paths.length === 0 ? (
          <div className="max-w-3xl mx-auto bg-white/10 backdrop-blur-xl rounded-3xl shadow-xl border border-red-300 p-8 text-center mb-12">
            <p className="text-lg font-semibold text-red-400">
              No career paths here.
            </p>
            <p className="text-sm text-zinc-300 mt-2">
              The selected course "{selectedCourse || "none"}" doesn&apos;t have any defined career paths yet.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 m-10 mb-12">
            {paths.map((path) => {
              const IconComponent = path.icon;
              return (
                <div
                 
                  className="group bg-white/10 backdrop-blur-xl rounded-3xl shadow-xl border border-green-500 p-8 cursor-pointer hover:shadow-2xl hover:scale-105 transition-all duration-300 hover:bg-white/20"
                >
                  {/* Icon and Header */}
                  <div className="flex gap-5">
                    <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mt-4">{path.name}</h3>
                  </div>
                  <p className="text-white text-sm leading-relaxed mb-4">
                    {path.description}
                  </p>
                  
                  {/* Stats */}
                   <button onClick={toggleUnlock} className="cursor-pointer mb-6 text-orange-500 transition-all">
                    {isUnlocked ? <Eye size={20} /> : <EyeOff size={20} />}
                  </button>
                  {isUnlocked ? 
                    <div className="space-y-3 mb-6 ">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-white">Available Jobs</span>
                        <span className="font-semibold text-orange-500">{path.jobCount}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-white">Salary Range</span>
                        <span className="font-semibold text-green-600">{path.salaryRange}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-white">Growth Rate</span>
                        <span className="font-semibold text-purple-600">{path.growth}</span>
                      </div>
                    </div>: "****"
                  }
                 
                  {!isUnlocked && (
                      <span className="ml-2 text-sm text-orange-500 mt-5 italic">
                        Unlock this pro feature
                      </span>
                   )}
                  {/* Top Companies */}
                  <div className="mb-6">
                    <p className="text-xs text-white mb-2">TOP COMPANIES</p>
                    <div className="flex flex-wrap gap-1">
                      {Array.isArray(path.companies) &&
                        path.companies.slice(0, 3).map((company, index) => (
                          <span
                            key={index}
                            className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full"
                          >
                            {company}
                          </span>
                        ))}
                    </div>
                  </div>

                  {/* CTA */}
                  <div  key={path.id}
                   onClick={() => handlePathSelect(path.id)} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-green-500">Explore Roles</span>
                    <div className="border-2 p-3 rounded-full border-green-500">
                      <ArrowRight className="w-5 h-5    text-green-500 hover:scale-125 transition-transform duration-300" />
                     </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Back Button */}
        <div className="text-center">
          <button
            variant="outline"
            onClick={() => navigate(createPageUrl("CourseSelectionPage"))}
            className="border-green-200 text-green-500 hover:bg-green-50 px-8 py-3 rounded-2xl"
          >
            ← Back to Course Selection
          </button>
        </div>
      </div>
    </div>
  );
}
