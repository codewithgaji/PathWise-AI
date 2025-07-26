import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ExpandProfile } from "./ExpandProfile";
import { 
  Building2, 
  Smartphone, 
  Landmark, 
  Heart, 
  Rocket, 
  ArrowRight, 
  TrendingUp,
  Users,
  DollarSign,
  MapPin
} from "lucide-react";

const careerPaths = {
  "Computer Science": [
    {
      id: "tech-companies",
      name: "Technology Companies",
      icon: Smartphone,
      description: "Work with leading tech firms and startups",
      jobCount: "2,500+ jobs",
      salaryRange: "₦200K - ₦2M",
      growth: "+25% annually",
      companies: ["Paystack", "Flutterwave", "Interswitch"]
    },
    {
      id: "fintech",
      name: "Financial Technology",
      icon: DollarSign,
      description: "Revolutionary financial services sector",
      jobCount: "1,800+ jobs", 
      salaryRange: "₦300K - ₦3M",
      growth: "+40% annually",
      companies: ["PiggyVest", "Kuda", "Carbon"]
    },
    {
      id: "banking",
      name: "Banking & Finance",
      icon: Building2,
      description: "Traditional and digital banking solutions",
      jobCount: "3,200+ jobs",
      salaryRange: "₦250K - ₦1.5M", 
      growth: "+15% annually",
      companies: ["GTBank", "Access Bank", "Zenith Bank"]
    },
    {
      id: "government",
      name: "Government & Public Sector",
      icon: Landmark,
      description: "Digital transformation in public services",
      jobCount: "800+ jobs",
      salaryRange: "₦150K - ₦800K",
      growth: "+20% annually",
      companies: ["NITDA", "Galaxy Backbone", "NCC"]
    },
    {
      id: "startups",
      name: "Startups & Innovation",
      icon: Rocket,
      description: "Join the next generation of Nigerian unicorns",
      jobCount: "1,500+ jobs",
      salaryRange: "₦180K - ₦2.5M",
      growth: "+35% annually", 
      companies: ["54gene", "Kobo360", "Andela"]
    }
  ],
  "Economics": [
    {
      id: "banking",
      name: "Banking & Finance",
      icon: Building2,
      description: "Economic analysis and financial services",
      jobCount: "2,800+ jobs",
      salaryRange: "₦200K - ₦1.2M",
      growth: "+12% annually",
      companies: ["CBN", "First Bank", "UBA"]
    },
    {
      id: "government",
      name: "Government & Policy",
      icon: Landmark,
      description: "Economic policy and public administration",
      jobCount: "1,200+ jobs",
      salaryRange: "₦180K - ₦900K",
      growth: "+8% annually",
      companies: ["Ministry of Finance", "FIRS", "NBS"]
    },
    {
      id: "consulting",
      name: "Consulting Services",
      icon: Users,
      description: "Strategic advisory and economic consulting",
      jobCount: "600+ jobs",
      salaryRange: "₦300K - ₦2M",
      growth: "+18% annually",
      companies: ["McKinsey", "PwC", "Deloitte"]
    }
  ]
};

export default function CareerPathPage() {
  const navigate = useNavigate();
  const [selectedCourse, setSelectedCourse] = useState("");
  const [paths, setPaths] = useState([]);
const createPageUrl = (pageName) => {
  const pageRoutes = {
    SkillsPage: "/skills",
    CareerPathPage: "/career-path",
    JobRolePage: "/job-roles",
  };
  return pageRoutes[pageName] || "/";
};

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const course = urlParams.get('course') || "Computer Science";
    setSelectedCourse(course);
    setPaths(careerPaths[course] || careerPaths["Computer Science"]);
  }, []);

  const handlePathSelect = (pathId) => {
    navigate(createPageUrl("JobRolePage") + `?course=${encodeURIComponent(selectedCourse)}&path=${pathId}`);
  };

  return (
    <div className="min-h-screen bg-gray-900  py-12 px-4">
      <div className=" px-10">
        {/* Header */}
        <div className="text-center mb-12">
           <div className="flex justify-between items-center mb-12">
                <h1 className="text-2xl font-bold text-white">PATHWISE AI</h1>
                <ExpandProfile />
            </div>
          
          <h1 className="text-5xl font-bold text-white mb-4">
            Career Paths for{" "}
            <span className="text-green-500">
              {selectedCourse}
            </span>
          </h1>
          <p className="text-lg text-zinc-300 py-2 max-w-3xl mx-auto leading-relaxed">
            Here are some exciting career paths available in Nigeria for {selectedCourse} graduates. 
            Choose the sector that interests you most.
          </p>
        </div>

        {/* Career Path Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 m-10 mb-12">
          {paths.map((path) => {
            const IconComponent = path.icon;
            return (
              <div
                key={path.id}
                onClick={() => handlePathSelect(path.id)}
                className="group bg-white/10 backdrop-blur-xl rounded-3xl shadow-xl border border-green-500 p-8 cursor-pointer hover:shadow-2xl hover:scale-105 transition-all duration-300 hover:bg-white/20"
              >
                {/* Icon and Header */}
                <div className=" flex gap-5">
                  <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mt-4">{path.name}</h3>
                  
                </div>
                 <p className="text-white text-sm leading-relaxed mb-4">{path.description}</p>
                {/* Stats */}
                <div className="space-y-3 mb-6">
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
                </div>

                {/* Top Companies */}
                <div className="mb-6">
                  <p className="text-xs text-white mb-2">TOP COMPANIES</p>
                  <div className="flex flex-wrap gap-1">
                    {path.companies.slice(0, 3).map((company, index) => (
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
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-green-500">Explore Roles</span>
                  <ArrowRight className="w-5 h-5 text-green-500 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>
            );
          })}
        </div>

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