import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import roleProjectSets from '../data/roleProjectSets';
import { ExpandProfile } from "./ExpandProfile";
import {
  CheckCircle2,
  Lock,
  Play,
  Award,
  Code,
  Zap,
  Brain,
  Badge,
  ArrowRight,
  Clock,
  Trophy,
  X,
  Star,
  Target,
  Monitor,
  ImageIcon,
  ChevronRight,
  Users,
  Briefcase
} from 'lucide-react';

// Helper function to enhance level data with UI properties
const enhanceLevels = (data) => {
  data.beginner.icon = Code;
  data.beginner.color = 'from-emerald-500 to-teal-600';
  data.beginner.bgColor = 'bg-emerald-50';
  data.beginner.textColor = 'text-emerald-700';
  data.beginner.borderColor = 'border-emerald-200';

  data.intermediate.icon = Zap;
  data.intermediate.color = 'from-blue-500 to-indigo-600';
  data.intermediate.bgColor = 'bg-blue-50';
  data.intermediate.textColor = 'text-blue-700';
  data.intermediate.borderColor = 'border-blue-200';

  data.advanced.icon = Brain;
  data.advanced.color = 'from-purple-500 to-pink-600';
  data.advanced.bgColor = 'bg-purple-50';
  data.advanced.textColor = 'text-purple-700';
  data.advanced.borderColor = 'border-purple-200';

  return data;
};

export default function ProjectStage() {
  // Get role data
  const roleId = 'frontend-developer';
  const initialData = useMemo(() => {
    const rawData = roleProjectSets[roleId] || roleProjectSets['frontend-developer'];
    return enhanceLevels(JSON.parse(JSON.stringify(rawData)));
  }, [roleId]);

  // State management
  const [projectData, setProjectData] = useState(initialData);
  const [currentLevel, setCurrentLevel] = useState('beginner');
  const [currentView, setCurrentView] = useState('projects');
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedProjectForWork, setSelectedProjectForWork] = useState(null);
  const [showProjectModal, setShowProjectModal] = useState(false);

  // Utility functions
  const toggleProjectCompletion = (levelKey, projectId) => {
    setProjectData(prev => {
      const updatedLevel = { ...prev[levelKey] };
      updatedLevel.projects = updatedLevel.projects.map(p =>
        p.id === projectId ? { ...p, completed: !p.completed } : p
      );
      return {
        ...prev,
        [levelKey]: updatedLevel,
      };
    });
  };

  const getLevelProgress = (levelKey) => {
    const projects = projectData[levelKey]?.projects || [];
    const completed = projects.filter((p) => p.completed).length;
    const total = projects.length;
    const percentage = total === 0 ? 0 : (completed / total) * 100;
    return { completed, total, percentage };
  };

  const levelKeys = ['beginner', 'intermediate', 'advanced'];
  const overallCompleted = levelKeys.reduce((sum, key) => sum + getLevelProgress(key).completed, 0);
  const overallTotal = levelKeys.reduce((sum, key) => sum + getLevelProgress(key).total, 0);
  const overallPercentage = overallTotal === 0 ? 0 : (overallCompleted / overallTotal) * 100;

  const canAccessLevel = (level) => {
    if (level === 'beginner') return true;
    if (level === 'intermediate') {
      return getLevelProgress('beginner').percentage === 100;
    }
    if (level === 'advanced') {
      return getLevelProgress('intermediate').percentage === 100;
    }
    return false;
  };

  const isCurrentLevelComplete = () => {
    return getLevelProgress(currentLevel).percentage === 100;
  };

  const getNextLevel = () => {
    const currentIndex = levelKeys.indexOf(currentLevel);
    return currentIndex < levelKeys.length - 1 ? levelKeys[currentIndex + 1] : null;
  };

  // Event handlers
  const handleProjectClick = (project) => {
    setSelectedProject(project);
    setShowProjectModal(true);
  };

  const handleStartProject = () => {
    if (selectedProject) {
      setSelectedProjectForWork(selectedProject);
      setCurrentView('workspace');
      setShowProjectModal(false);
    }
  };

  const handleProjectComplete = () => {
    if (selectedProjectForWork) {
      toggleProjectCompletion(currentLevel, selectedProjectForWork.id);
    }
    setCurrentView('projects');
    setSelectedProjectForWork(null);
  };

  const handleBackToProjects = () => {
    setCurrentView('projects');
    setSelectedProjectForWork(null);
  };

  // Component definitions
  const ProjectModal = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={() => setShowProjectModal(false)}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedProject?.title}</h2>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Badge variant="outline" className="text-xs">
                  {selectedProject?.difficulty}
                </Badge>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {selectedProject?.duration}
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowProjectModal(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Project Description</h3>
              <p className="text-gray-600 leading-relaxed">{selectedProject?.description}</p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Learning Objectives</h3>
              <div className="space-y-2">
                {selectedProject?.objectives?.map((objective, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-600">{objective}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Technologies Used</h3>
              <div className="flex flex-wrap gap-2">
                {selectedProject?.technologies?.map((tech, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>

            {selectedProject?.hasVisual && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Expected Output</h3>
                <div className="bg-gray-100 rounded-lg p-8 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <Monitor className="w-12 h-12 mx-auto mb-2" />
                    <p className="text-sm">Project preview will be shown here</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => setShowProjectModal(false)}
                className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleStartProject}
                className="flex-1 px-4 py-3  bg-green-500 text-white rounded-lg hover:scale-105 cursor-pointer transition-all flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4" />
                Start Project
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );

  const WorkspaceView = () => (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={handleBackToProjects}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-white">{selectedProjectForWork.title}</h1>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {selectedProjectForWork.duration}
                  </div>
                  <div className="flex items-center gap-1">
                    <Target className="w-4 h-4" />
                    {selectedProjectForWork.difficulty || 'Beginner'}
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={handleProjectComplete}
              className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              Mark Complete
            </button>
          </div>
        </div>
      </div>

      {/* Project Workspace Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Instructions */}
            <div className="bg-white/5   rounded-3xl p-6 border border-green-700">
              <h2 className="text-xl font-bold text-white mb-4">Project Instructions</h2>
              <div className="space-y-4">
                <div className="bg-gray-700/50 rounded-lg p-4">
                  <h3 className="font-semibold text-white mb-2">Description</h3>
                  <p className="text-gray-300 text-sm">{selectedProjectForWork.description}</p>
                </div>
                
                <div className="bg-gray-700/50 rounded-lg p-4">
                  <h3 className="font-semibold text-white mb-2">Learning Objectives</h3>
                  <div className="space-y-2">
                    {selectedProjectForWork.objectives?.map((obj, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-gray-300">
                        <Target className="w-4 h-4 text-green-400" />
                        {obj}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-700/50 rounded-lg p-4">
                  <h3 className="font-semibold text-white mb-2">Technologies</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProjectForWork.technologies?.map((tech, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-600/20 text-green-300 text-xs rounded border border-blue-600/30">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Code Editor Area */}
            <div className="bg-white/5   rounded-3xl p-6 border border-green-700 overflow-hidden">
              <div className="bg-gray-700/50 px-4 py-3 border-b border-gray-600">
                <div className="flex items-center gap-2">
                  <Code className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-300 font-medium">Code Editor</span>
                </div>
              </div>
              
              <div className="p-4">
                <textarea
                  placeholder="Start writing your code here..."
                  className="w-full h-96 bg-gray-900 text-gray-100 font-mono text-sm border border-gray-600 rounded-lg p-4 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ fontFamily: 'Monaco, Consolas, "Liberation Mono", "Courier New", monospace' }}
                />
              </div>

              <div className="bg-gray-700/50 px-4 py-3 border-t border-gray-600">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">AI will validate your code when you submit</span>
                  <button className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors">
                    Test Code
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Project Preview */}
          {selectedProjectForWork.hasVisual && (
            <div className="mt-8">
              <div className="bg-white/5   rounded-3xl p-6 border border-green-700">
                <h3 className="text-lg font-bold text-white mb-4">Expected Output</h3>
                <div className="bg-white/70 rounded-lg h-64 flex items-center justify-center">
                  <div className="text-center text-black">
                    <Monitor className="w-12 h-12 mx-auto mb-2" />
                    <p className="text-sm">Project preview will appear here</p>
                    <p className="text-xs text-black mt-1">This shows how your {selectedProjectForWork.title} should look</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const ProjectsView = () => {
    const currentLevelData = projectData[currentLevel];
    const IconComponent = currentLevelData?.icon;
    const progress = getLevelProgress(currentLevel);

    return (
      <div className="min-h-screen  bg-gray-900">
        <div className="container mx-auto px-4 py-6 max-w-6xl">
          <div className="flex justify-between items-center mb-12">
              <h1 className="text-2xl font-bold text-white">PATHWISE AI</h1>
              <ExpandProfile />
           </div>
          {/* Role Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="text-center mb-8"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-green-500/20 rounded-xl">
                <Briefcase className="w-8 h-8 text-green-500" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                Master <span className="text-green-500">
                  {projectData.roleName}
                </span>
              </h1>
            </div>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-6">
              {projectData.roleDescription}
            </p>
            
            {/* Overall Progress */}
            <div className="max-w-md mx-auto bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="flex items-center justify-between mb-3">
                <span className="font-semibold text-white">Overall Progress</span>
                <span className="text-sm font-medium text-gray-300">{overallCompleted}/{overallTotal} Projects</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3 mb-3">
                <div 
                  className="bg-gradient-to-r from-green-500 to-orange-500 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${overallPercentage}%` }}
                />
              </div>
              <div className="flex items-center justify-center gap-2">
                <Trophy className="w-4 h-4 text-yellow-400" />
                <span className="text-sm text-gray-300">
                  {Math.round(overallPercentage)}% Complete
                </span>
              </div>
            </div>
          </motion.div>

          {/* Level Navigation */}
          <div className="flex justify-center mb-8">
            <div className="flex bg-white/5 backdrop-blur-sm rounded-3xl p-2">
              {levelKeys.map((level, index) => (
                <button
                  key={level}
                  onClick={() => canAccessLevel(level) && setCurrentLevel(level)}
                  disabled={!canAccessLevel(level)}
                  className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 ${
                    currentLevel === level
                      ? 'bg-white text-gray-900 shadow-lg'
                      : canAccessLevel(level)
                      ? 'text-white hover:bg-white/10'
                      : 'text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {!canAccessLevel(level) && <Lock className="w-4 h-4" />}
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                  {getLevelProgress(level).percentage === 100 && (
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Current Level Content */}
          <motion.div
            key={currentLevel}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 overflow-hidden">
              <div className={`p-8 ${currentLevelData.bgColor}/10`}>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className={`p-4 ${currentLevelData.bgColor} rounded-2xl`}>
                      <IconComponent className={`w-8 h-8 ${currentLevelData.textColor}`} />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-white mb-2">{currentLevelData.title}</h2>
                      <p className="text-gray-300">{currentLevelData.description}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-white border-white/30">
                    {progress.completed}/{progress.total} Complete
                  </Badge>
                </div>

                {/* Progress Bar */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-300">Level Progress</span>
                    <span className="text-sm font-medium text-white">{Math.round(progress.percentage)}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-3">
                    <div 
                      className={`bg-gradient-to-r ${currentLevelData.color} h-3 rounded-full transition-all duration-300`}
                      style={{ width: `${progress.percentage}%` }}
                    />
                  </div>
                </div>

                {/* Projects */}
                <div className="space-y-4">
                  {currentLevelData.projects.map((project, index) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/15 transition-all duration-200 cursor-pointer group"
                      onClick={() => handleProjectClick(project)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-start gap-4 flex-1">
                          <div className="flex-shrink-0 mt-1">
                            {project.completed ? (
                              <CheckCircle2 className="w-6 h-6 text-green-500" />
                            ) : (
                              <div className="w-6 h-6 rounded-full border-2 border-gray-400" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-xl font-semibold text-white group-hover:text-orange-500 transition-colors">
                                {project.title}
                              </h3>
                              <Badge variant="outline" className="text-xs text-gray-300 border-gray-500">
                                {project.difficulty}
                              </Badge>
                            </div>
                            <p className="text-gray-300 mb-3 leading-relaxed">{project.description}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-400">
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                <span>{project.duration}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Code className="w-4 h-4" />
                                <span>{project.technologies.join(', ')}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Level Completion/Next Level Button */}
                {isCurrentLevelComplete() && getNextLevel() && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-8 text-center"
                  >
                    <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-2xl p-6 border border-green-500/30">
                      <div className="flex items-center justify-center gap-2 mb-4">
                        <Trophy className="w-6 h-6 text-yellow-400" />
                        <span className="text-lg font-semibold text-white">Level Complete!</span>
                      </div>
                      <p className="text-gray-300 mb-6">
                        Congratulations! You've completed all {currentLevel} projects. Ready for the next challenge?
                      </p>
                      <button
                        onClick={() => setCurrentLevel(getNextLevel())}
                        className="px-8 py-4 bg-gradient-to-r from-green-600 to-emrald-600 text-white font-semibold rounded-xl hover:from-green-700 hover:to-emerald-500 transition-all duration-200 flex items-center justify-center gap-2 mx-auto"
                      >
                        Advance to {getNextLevel().charAt(0).toUpperCase() + getNextLevel().slice(1)} Level
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Certificate Section */}
                {currentLevel === 'advanced' && isCurrentLevelComplete() && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-8"
                  >
                    <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-2xl p-8 border border-amber-500/30 text-center">
                      <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Award className="w-10 h-10 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-4">Congratulations! 🎉</h3>
                      <p className="text-gray-300 mb-6 max-w-md mx-auto">
                        You've successfully completed all projects for {projectData.roleName}. 
                        Download your certificate to showcase your achievement.
                      </p>
                      <button className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold rounded-xl hover:from-amber-600 hover:to-orange-700 transition-all duration-200 flex items-center justify-center gap-2 mx-auto">
                        <Award className="w-5 h-5" />
                        Download Certificate
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  };

  // Main render logic
  if (currentView === 'workspace' && selectedProjectForWork) {
    return <WorkspaceView />;
  }

  return (
    <>
      <ProjectsView />
      <AnimatePresence>
        {showProjectModal && selectedProject && <ProjectModal />}
      </AnimatePresence>
    </>
  );
}




