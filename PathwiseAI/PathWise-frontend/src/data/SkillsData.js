import { 
  BookOpen, 
  ExternalLink, 
  CheckCircle,
  Circle,
  ArrowRight,
  Target,
  Clock,
  Cog,
  Briefcase,
  FlaskConical,
  Cloud,
  Trophy,
    Code,
  Layers,
  Database,
  GitBranch,
  Activity,
  Calendar,
  Users,
  Lightbulb,
  TrendingUp,
  Shield,
  ClipboardList,
  Globe,
  Heart,
  FileText
} from "lucide-react";

const SkillsData = {
  /* Software Engineering */
  "frontend-engineer": {
    roleName: "Frontend Engineer",
    skills: [
      {
        id: "javascript",
        name: "JavaScript Fundamentals",
        icon: Code,
        description: "Master core JavaScript concepts, ES6+, DOM manipulation, and asynchronous programming.",
        difficulty: "Beginner",
        timeEstimate: "3-4 weeks",
        completed: false,
        resources: [
          { name: "MDN JavaScript Guide", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide" },
          { name: "FreeCodeCamp JavaScript", url: "https://freecodecamp.org" },
          { name: "JavaScript.info", url: "https://javascript.info" }
        ]
      },
      {
        id: "react",
        name: "React Development",
        icon: Layers,
        description: "Build modern user interfaces with components, hooks, and state management.",
        difficulty: "Intermediate",
        timeEstimate: "4-6 weeks",
        completed: false,
        resources: [
          { name: "React Official Docs", url: "https://react.dev" },
          { name: "React Tutorial", url: "https://react.dev/tutorial" }
        ]
      },
      {
        id: "html-css",
        name: "HTML & CSS",
        icon: BookOpen,
        description: "Structure and style accessible, responsive interfaces using HTML5 and modern CSS (Flexbox/Grid).",
        difficulty: "Beginner",
        timeEstimate: "2-3 weeks",
        completed: false,
        resources: [
          { name: "CSS Tricks", url: "https://css-tricks.com" },
          { name: "MDN HTML & CSS", url: "https://developer.mozilla.org/en-US/docs/Web" }
        ]
      },
      {
        id: "performance-optimization",
        name: "Performance Optimization",
        icon: Activity,
        description: "Improve load times and runtime performance via code-splitting, lazy loading, and profiling.",
        difficulty: "Advanced",
        timeEstimate: "2-3 weeks",
        completed: false,
        resources: [
          { name: "Web.dev Performance", url: "https://web.dev/learn" },
          { name: "Lighthouse Audits", url: "https://developer.chrome.com/docs/lighthouse" }
        ]
      }
    ]
  },
  "backend-engineer": {
    roleName: "Backend Engineer",
    skills: [
      {
        id: "nodejs",
        name: "Node.js Backend",
        icon: Code,
        description: "Server-side development with Node.js; building RESTful APIs and handling asynchronous I/O.",
        difficulty: "Intermediate",
        timeEstimate: "3-5 weeks",
        completed: false,
        resources: [
          { name: "Node.js Official Guide", url: "https://nodejs.org/en/docs/guides/" },
          { name: "Express.js Tutorial", url: "https://expressjs.com" }
        ]
      },
      {
        id: "databases",
        name: "Database Management",
        icon: Database,
        description: "Design, query, and optimize SQL and NoSQL databases.",
        difficulty: "Intermediate",
        timeEstimate: "2-4 weeks",
        completed: false,
        resources: [
          { name: "SQL Tutorial", url: "https://www.w3schools.com/sql/" },
          { name: "MongoDB University", url: "https://university.mongodb.com" }
        ]
      },
      {
        id: "api-design",
        name: "API Design",
        icon: Layers,
        description: "Design clean, versioned, and secure REST/GraphQL APIs.",
        difficulty: "Intermediate",
        timeEstimate: "2-3 weeks",
        completed: false,
        resources: [
          { name: "Pragmatic REST API Guide", url: "https://www.vinaysahni.com/best-practices-for-a-pragmatic-restful-api" }
        ]
      },
      {
        id: "scalability",
        name: "Scalability Patterns",
        icon: TrendingUp,
        description: "Architect systems to scale under increasing load.",
        difficulty: "Advanced",
        timeEstimate: "3-4 weeks",
        completed: false,
        resources: [
          { name: "Designing Data-Intensive Applications", url: "https://dataintensive.net" }
        ]
      }
    ]
  },
  "product-engineer": {
    roleName: "Product Engineer",
    skills: [
      {
        id: "agile",
        name: "Agile Methodologies",
        icon: Calendar,
        description: "Iterative development using Scrum/Kanban with continuous feedback.",
        difficulty: "Beginner",
        timeEstimate: "1-2 weeks",
        completed: false,
        resources: [
          { name: "Scrum Guide", url: "https://scrumguides.org" },
          { name: "Agile Alliance", url: "https://www.agilealliance.org" }
        ]
      },
      {
        id: "user-research",
        name: "User Research",
        icon: Users,
        description: "Gather and synthesize user feedback to inform product decisions.",
        difficulty: "Intermediate",
        timeEstimate: "2-3 weeks",
        completed: false,
        resources: [
          { name: "IDEO Design Kit", url: "https://www.designkit.org" }
        ]
      },
      {
        id: "experiment-design",
        name: "A/B Testing",
        icon: Lightbulb,
        description: "Design and analyze controlled experiments to validate features.",
        difficulty: "Intermediate",
        timeEstimate: "2 weeks",
        completed: false,
        resources: [
          { name: "Optimizely Learning", url: "https://www.optimizely.com/optimization-glossary/ab-testing/" }
        ]
      }
    ]
  },

  /* Embedded / IoT */
  "firmware-developer": {
    roleName: "Firmware Developer",
    skills: [
      {
        id: "c-cpp",
        name: "C/C++ Programming",
        icon: Code,
        description: "Low-level programming for microcontrollers and embedded platforms.",
        difficulty: "Advanced",
        timeEstimate: "4-6 weeks",
        completed: false,
        resources: [
          { name: "C++ Core Guidelines", url: "https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines" }
        ]
      },
      {
        id: "real-time-systems",
        name: "Real-Time Systems",
        icon: Activity,
        description: "Understand determinism, scheduling, and constraints in embedded systems.",
        difficulty: "Advanced",
        timeEstimate: "3-4 weeks",
        completed: false,
        resources: [
          { name: "FreeRTOS Docs", url: "https://freertos.org" }
        ]
      }
    ]
  },
  "iot-engineer": {
    roleName: "IoT Engineer",
    skills: [
      {
        id: "mqtt",
        name: "MQTT & Messaging",
        icon: Layers,
        description: "Lightweight message protocol for IoT device communication.",
        difficulty: "Intermediate",
        timeEstimate: "2 weeks",
        completed: false,
        resources: [
          { name: "MQTT.org", url: "https://mqtt.org" }
        ]
      },
      {
        id: "edge-computing",
        name: "Edge Computing",
        icon: Cloud,
        description: "Process data closer to source to reduce latency and bandwidth.",
        difficulty: "Intermediate",
        timeEstimate: "3 weeks",
        completed: false,
        resources: [
          { name: "Red Hat Edge Guide", url: "https://www.redhat.com/en/topics/edge-computing" }
        ]
      }
    ]
  },
  "embedded-test-engineer": {
    roleName: "Embedded Test Engineer",
    skills: [
      {
        id: "hardware-testing",
        name: "Hardware Testing",
        icon: ClipboardList,
        description: "Validate embedded hardware functionality and signals.",
        difficulty: "Intermediate",
        timeEstimate: "2-3 weeks",
        completed: false,
        resources: [
          { name: "Electronics Testing Basics", url: "https://www.eetimes.com" }
        ]
      },
      {
        id: "automation-scripting",
        name: "Automation & Scripting",
        icon: Code,
        description: "Automate test procedures for repeatability and coverage.",
        difficulty: "Intermediate",
        timeEstimate: "2-4 weeks",
        completed: false,
        resources: [
          { name: "Scripting with Python", url: "https://docs.python.org/3/tutorial/" }
        ]
      }
    ]
  },

  /* QA & DevOps */
  "qa-engineer": {
    roleName: "Quality Assurance Engineer",
    skills: [
      {
        id: "test-automation",
        name: "Test Automation",
        icon: Code,
        description: "Build automated test suites using frameworks like Selenium.",
        difficulty: "Intermediate",
        timeEstimate: "3-4 weeks",
        completed: false,
        resources: [
          { name: "Selenium Docs", url: "https://www.selenium.dev/documentation/" }
        ]
      },
      {
        id: "bug-tracking",
        name: "Bug Tracking & Reporting",
        icon: FileText,
        description: "Log, categorize, and report defects effectively.",
        difficulty: "Beginner",
        timeEstimate: "1-2 weeks",
        completed: false,
        resources: [
          { name: "JIRA Guide", url: "https://www.atlassian.com/software/jira/guides" }
        ]
      }
    ]
  },
  "automation-tester": {
    roleName: "Automation Tester",
    skills: [
      {
        id: "ci-cd",
        name: "CI/CD Pipelines",
        icon: TrendingUp,
        description: "Automate build-test-deploy workflows for continuous delivery.",
        difficulty: "Intermediate",
        timeEstimate: "2-3 weeks",
        completed: false,
        resources: [
          { name: "CI/CD Concepts", url: "https://www.redhat.com/en/topics/devops/what-is-ci-cd" }
        ]
      },
      {
        id: "framework-design",
        name: "Framework Design",
        icon: Layers,
        description: "Architect reusable test automation frameworks.",
        difficulty: "Advanced",
        timeEstimate: "3 weeks",
        completed: false,
        resources: [
          { name: "Test Automation Frameworks", url: "https://martinfowler.com/articles/microservice-testing/" }
        ]
      }
    ]
  },
  "performance-engineer": {
    roleName: "Performance Engineer",
    skills: [
      {
        id: "load-testing",
        name: "Load & Stress Testing",
        icon: Activity,
        description: "Simulate heavy traffic to identify bottlenecks.",
        difficulty: "Advanced",
        timeEstimate: "2-4 weeks",
        completed: false,
        resources: [
          { name: "JMeter Tutorial", url: "https://jmeter.apache.org/" }
        ]
      },
      {
        id: "profiling",
        name: "Application Profiling",
        icon: Lightbulb,
        description: "Use tools to find performance hotspots in code.",
        difficulty: "Advanced",
        timeEstimate: "2 weeks",
        completed: false,
        resources: [
          { name: "Chrome DevTools", url: "https://developer.chrome.com/docs/devtools/" }
        ]
      }
    ]
  },
  "devops-engineer": {
    roleName: "DevOps Engineer",
    skills: [
      {
        id: "infrastructure-as-code",
        name: "Infrastructure as Code",
        icon: Layers,
        description: "Automate environment provisioning with tools like Terraform.",
        difficulty: "Intermediate",
        timeEstimate: "3-4 weeks",
        completed: false,
        resources: [
          { name: "Terraform Docs", url: "https://developer.hashicorp.com/terraform/docs" }
        ]
      },
      {
        id: "containerization",
        name: "Containerization",
        icon: Code,
        description: "Package and deploy applications using Docker/Kubernetes.",
        difficulty: "Intermediate",
        timeEstimate: "3 weeks",
        completed: false,
        resources: [
          { name: "Docker Guide", url: "https://docs.docker.com/get-started/" }
        ]
      }
    ]
  },
  "site-reliability-engineer": {
    roleName: "Site Reliability Engineer",
    skills: [
      {
        id: "monitoring",
        name: "Monitoring & Alerting",
        icon: Activity,
        description: "Track system health and set up reliable alerts.",
        difficulty: "Intermediate",
        timeEstimate: "2-3 weeks",
        completed: false,
        resources: [
          { name: "Prometheus Docs", url: "https://prometheus.io/docs/" }
        ]
      },
      {
        id: "incident-response",
        name: "Incident Response",
        icon: Shield,
        description: "Respond to outages and restore service reliably.",
        difficulty: "Advanced",
        timeEstimate: "2-4 weeks",
        completed: false,
        resources: [
          { name: "Google SRE Practices", url: "https://sre.google/" }
        ]
      }
    ]
  },
  "platform-engineer": {
    roleName: "Platform Engineer",
    skills: [
      {
        id: "developer-experience",
        name: "Developer Experience",
        icon: Users,
        description: "Build tools that improve internal dev workflows.",
        difficulty: "Intermediate",
        timeEstimate: "3 weeks",
        completed: false,
        resources: [
          { name: "DX Best Practices", url: "https://12factor.net/" }
        ]
      },
      {
        id: "tooling",
        name: "Internal Tooling",
        icon: Cog,
        description: "Create and maintain internal platforms for efficiency.",
        difficulty: "Intermediate",
        timeEstimate: "3 weeks",
        completed: false,
        resources: [
          { name: "Internal Developer Platforms", url: "https://www.cncf.io" }
        ]
      }
    ]
  },

  /* Law */
  "lawyer": {
    roleName: "Lawyer / Legal Officer",
    skills: [
      {
        id: "legal-research",
        name: "Legal Research",
        icon: BookOpen,
        description: "Source and interpret case law and statutory instruments.",
        difficulty: "Intermediate",
        timeEstimate: "2-3 weeks",
        completed: false,
        resources: [
          { name: "Nigerian Legal Info", url: "https://nigerialii.org" },
          { name: "Harvard Legal Research Guide", url: "https://guides.library.harvard.edu/legalresearch" }
        ]
      },
      {
        id: "contract-drafting",
        name: "Contract Drafting",
        icon: FileText,
        description: "Compose legally binding agreements with correct clauses.",
        difficulty: "Intermediate",
        timeEstimate: "3 weeks",
        completed: false,
        resources: [
          { name: "Practical Law Contracts", url: "https://uk.practicallaw.thomsonreuters.com" }
        ]
      }
    ]
  },
  "litigation-specialist": {
    roleName: "Litigation Specialist",
    skills: [
      {
        id: "case-strategy",
        name: "Case Strategy",
        icon: Lightbulb,
        description: "Develop and adapt legal arguments for trials.",
        difficulty: "Advanced",
        timeEstimate: "3 weeks",
        completed: false,
        resources: [
          { name: "Trial Advocacy Resources", url: "https://www.nationalparalegal.edu" }
        ]
      },
      {
        id: "cross-examination",
        name: "Cross Examination",
        icon: Users,
        description: "Conduct effective questioning to challenge testimony.",
        difficulty: "Advanced",
        timeEstimate: "2 weeks",
        completed: false,
        resources: [
          { name: "Litigation Skills Guides", url: "https://www.lawprose.org" }
        ]
      }
    ]
  },

  /* Nursing */
  "registered-nurse": {
    roleName: "Registered Nurse",
    skills: [
      {
        id: "patient-assessment",
        name: "Patient Assessment",
        icon: ClipboardList,
        description: "Evaluate patient conditions and vital signs accurately.",
        difficulty: "Beginner",
        timeEstimate: "2 weeks",
        completed: false,
        resources: [
          { name: "Nursing Assessment Guide", url: "https://www.registerednursing.org/nursing-assessment/" }
        ]
      },
      {
        id: "infection-control",
        name: "Infection Control",
        icon: Shield,
        description: "Apply protocols to prevent hospital-acquired infections.",
        difficulty: "Intermediate",
        timeEstimate: "2 weeks",
        completed: false,
        resources: [
          { name: "WHO Infection Prevention", url: "https://www.who.int" }
        ]
      }
    ]
  },
  "midwife": {
    roleName: "Midwife",
    skills: [
      {
        id: "prenatal-care",
        name: "Prenatal Care",
        icon: Heart,
        description: "Monitor and support expectant mothers during pregnancy.",
        difficulty: "Beginner",
        timeEstimate: "2-3 weeks",
        completed: false,
        resources: [
          { name: "WHO Antenatal Care", url: "https://www.who.int" }
        ]
      },
      {
        id: "delivery-assistance",
        name: "Delivery Assistance",
        icon: Users,
        description: "Assist safely during childbirth.",
        difficulty: "Intermediate",
        timeEstimate: "3 weeks",
        completed: false,
        resources: [
          { name: "Midwifery Guidelines", url: "https://www.internationalmidwives.org" }
        ]
      }
    ]
  },

  /* Pharmacy */
  "clinical-pharmacist": {
    roleName: "Clinical Pharmacist",
    skills: [
      {
        id: "pharmacology",
        name: "Pharmacology",
        icon: BookOpen,
        description: "Understand drug actions, interactions, and therapeutics.",
        difficulty: "Intermediate",
        timeEstimate: "4 weeks",
        completed: false,
        resources: [
          { name: "Khan Academy Pharmacology", url: "https://www.khanacademy.org" }
        ]
      },
      {
        id: "medication-therapy",
        name: "Medication Therapy Management",
        icon: ClipboardList,
        description: "Optimize treatment plans for patient outcomes.",
        difficulty: "Advanced",
        timeEstimate: "3 weeks",
        completed: false,
        resources: [
          { name: "Clinical Pharmacy Texts", url: "https://www.ncbi.nlm.nih.gov" }
        ]
      }
    ]
  },
  "retail-pharmacist": {
    roleName: "Retail Pharmacist",
    skills: [
      {
        id: "customer-service",
        name: "Customer Service",
        icon: Users,
        description: "Communicate effectively with walk-in patients about medications.",
        difficulty: "Beginner",
        timeEstimate: "1-2 weeks",
        completed: false,
        resources: [
          { name: "Service Excellence Articles", url: "https://hbr.org" }
        ]
      },
      {
        id: "dispensing",
        name: "Dispensing & Counseling",
        icon: Heart,
        description: "Accurately give medications and advise on usage.",
        difficulty: "Intermediate",
        timeEstimate: "2 weeks",
        completed: false,
        resources: [
          { name: "Pharmacy Practice Standards", url: "https://www.fip.org" }
        ]
      }
    ]
  },

  /* Medicine */
  "medical-doctor": {
    roleName: "Medical Doctor",
    skills: [
      {
        id: "clinical-diagnosis",
        name: "Clinical Diagnosis",
        icon: Globe,
        description: "Assess and determine medical conditions from symptoms.",
        difficulty: "Advanced",
        timeEstimate: "6 weeks",
        completed: false,
        resources: [
          { name: "UpToDate (institutional)", url: "https://www.uptodate.com" }
        ]
      },
      {
        id: "patient-communication",
        name: "Patient Communication",
        icon: Users,
        description: "Explain conditions and treatments empathetically.",
        difficulty: "Beginner",
        timeEstimate: "2 weeks",
        completed: false,
        resources: [
          { name: "Harvard Health Communication", url: "https://www.health.harvard.edu" }
        ]
      }
    ]
  },
  "epidemiologist": {
    roleName: "Epidemiologist",
    skills: [
      {
        id: "surveillance",
        name: "Disease Surveillance",
        icon: Activity,
        description: "Track and interpret patterns of disease spread.",
        difficulty: "Intermediate",
        timeEstimate: "3 weeks",
        completed: false,
        resources: [
          { name: "CDC Surveillance Resources", url: "https://www.cdc.gov" }
        ]
      },
      {
        id: "statistical-analysis",
        name: "Statistical Analysis",
        icon: TrendingUp,
        description: "Use statistics to model outbreaks and interventions.",
        difficulty: "Advanced",
        timeEstimate: "4 weeks",
        completed: false,
        resources: [
          { name: "R for Epidemiology", url: "https://cran.r-project.org" }
        ]
      }
    ]
  },
  "medical-researcher": {
    roleName: "Medical Researcher",
    skills: [
      {
        id: "research-methods",
        name: "Research Methodology",
        icon: Lightbulb,
        description: "Design and plan biomedical studies.",
        difficulty: "Advanced",
        timeEstimate: "4 weeks",
        completed: false,
        resources: [
          { name: "NIH Research Training", url: "https://www.nih.gov" }
        ]
      },
      {
        id: "biostatistics",
        name: "Biostatistics",
        icon: TrendingUp,
        description: "Apply statistical techniques to biological data.",
        difficulty: "Advanced",
        timeEstimate: "4 weeks",
        completed: false,
        resources: [
          { name: "Biostatistics Texts", url: "https://www.openintro.org" }
        ]
      }
    ]
  },
  "medical-lecturer": {
    roleName: "Medical Lecturer",
    skills: [
      {
        id: "curriculum-development",
        name: "Curriculum Development",
        icon: BookOpen,
        description: "Design medical course content and assessments.",
        difficulty: "Intermediate",
        timeEstimate: "3 weeks",
        completed: false,
        resources: [
          { name: "Instructional Design Basics", url: "https://www.coursera.org" }
        ]
      },
      {
        id: "teaching",
        name: "Teaching & Mentorship",
        icon: Users,
        description: "Deliver lectures and guide students effectively.",
        difficulty: "Beginner",
        timeEstimate: "2 weeks",
        completed: false,
        resources: [
          { name: "Effective Teaching Practices", url: "https://www.edutopia.org" }
        ]
      }
    ]
  },

  /* Business Administration */
  "operations-manager": {
    roleName: "Operations Manager",
    skills: [
      {
        id: "process-improvement",
        name: "Process Improvement",
        icon: Lightbulb,
        description: "Optimize workflows using Lean/Six Sigma principles.",
        difficulty: "Intermediate",
        timeEstimate: "3 weeks",
        completed: false,
        resources: [
          { name: "Lean Six Sigma Overview", url: "https://goleansixsigma.com" }
        ]
      },
      {
        id: "supply-chain",
        name: "Supply Chain Management",
        icon: Layers,
        description: "Coordinate sourcing, production, and delivery efficiently.",
        difficulty: "Intermediate",
        timeEstimate: "3-4 weeks",
        completed: false,
        resources: [
          { name: "SCM Fundamentals", url: "https://www.cips.org" }
        ]
      }
    ]
  },
  "hr-generalist": {
    roleName: "HR Generalist",
    skills: [
      {
        id: "recruitment",
        name: "Recruitment & Onboarding",
        icon: Users,
        description: "Source talent and integrate them into the organization.",
        difficulty: "Beginner",
        timeEstimate: "2 weeks",
        completed: false,
        resources: [
          { name: "SHRM Resources", url: "https://www.shrm.org" }
        ]
      },
      {
        id: "performance-management",
        name: "Performance Management",
        icon: ClipboardList,
        description: "Track and improve employee performance.",
        difficulty: "Intermediate",
        timeEstimate: "2-3 weeks",
        completed: false,
        resources: [
          { name: "Performance Review Best Practices", url: "https://hbr.org" }
        ]
      }
    ]
  },
  "business-development-officer": {
    roleName: "Business Development Officer",
    skills: [
      {
        id: "lead-generation",
        name: "Lead Generation",
        icon: TrendingUp,
        description: "Identify and qualify potential growth opportunities.",
        difficulty: "Beginner",
        timeEstimate: "2 weeks",
        completed: false,
        resources: [
          { name: "Sales Funnel Guides", url: "https://www.hubspot.com" }
        ]
      },
      {
        id: "negotiation",
        name: "Negotiation Skills",
        icon: Lightbulb,
        description: "Close deals and manage partnerships effectively.",
        difficulty: "Intermediate",
        timeEstimate: "2-3 weeks",
        completed: false,
        resources: [
          { name: "Getting to Yes", url: "https://www.pon.harvard.edu" }
        ]
      }
    ]
  },
  "management-consultant": {
    roleName: "Management Consultant",
    skills: [
      {
        id: "problem-solving",
        name: "Problem Solving",
        icon: Lightbulb,
        description: "Break down complex business issues into actionable plans.",
        difficulty: "Advanced",
        timeEstimate: "3 weeks",
        completed: false,
        resources: [
          { name: "McKinsey Problem Solving", url: "https://www.mckinsey.com" }
        ]
      },
      {
        id: "strategy-design",
        name: "Strategy Design",
        icon: TrendingUp,
        description: "Develop long-term plans aligned with organizational goals.",
        difficulty: "Advanced",
        timeEstimate: "3-4 weeks",
        completed: false,
        resources: [
          { name: "Strategy Resources", url: "https://www.bcg.com" }
        ]
      }
    ]
  },
  "project-manager": {
    roleName: "Project Manager",
    skills: [
      {
        id: "risk-management",
        name: "Risk Management",
        icon: Shield,
        description: "Identify, assess, and mitigate project risks.",
        difficulty: "Intermediate",
        timeEstimate: "2-3 weeks",
        completed: false,
        resources: [
          { name: "PMI Risk Management", url: "https://www.pmi.org" }
        ]
      },
      {
        id: "agile-scrum",
        name: "Agile / Scrum",
        icon: Calendar,
        description: "Run projects with iterative feedback loops and sprints.",
        difficulty: "Beginner",
        timeEstimate: "2 weeks",
        completed: false,
        resources: [
          { name: "Scrum Guide", url: "https://scrumguides.org" }
        ]
      }
    ]
  }
};

export default SkillsData;