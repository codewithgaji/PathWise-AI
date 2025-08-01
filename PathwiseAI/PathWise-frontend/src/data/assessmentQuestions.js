const assessmentQuestions = {
  javascript: [
    {
      id: 1,
      question: "What is the correct way to declare a constant in JavaScript?",
      options: ["let", "var", "const", "static"],
      correctAnswer: 2
    },
    {
      id: 2,
      question: "Which symbol is used for strict equality in JavaScript?",
      options: ["==", "!=", "===", "!=="],
      correctAnswer: 2
    },
    {
      id: 3,
      question: "Which method is used to convert a JSON string into a JavaScript object?",
      options: ["JSON.parse()", "JSON.stringify()", "JSON.toObject()", "parse.JSON()"],
      correctAnswer: 0
    },
    {
      id: 4,
      question: "What will `typeof null` return in JavaScript?",
      options: ["object", "null", "undefined", "number"],
      correctAnswer: 0
    },
    {
      id: 5,
      question: "Which keyword is used to define an arrow function?",
      options: ["function", "=>", "define", "arrow"],
      correctAnswer: 1
    }
  ],
  react: [
    {
      id: 1,
      question: "What hook is used to manage state in functional components?",
      options: ["useEffect", "useRef", "useState", "useContext"],
      correctAnswer: 2
    },
    {
      id: 2,
      question: "JSX allows us to write ___?",
      options: ["HTML in JS", "CSS in JS", "XML in JS", "JSON in JS"],
      correctAnswer: 0
    },
    {
      id: 3,
      question: "What prop should you pass to list items for better performance?",
      options: ["name", "id", "key", "value"],
      correctAnswer: 2
    },
    {
      id: 4,
      question: "Which React method is used to update the DOM?",
      options: ["render()", "componentDidMount()", "repaint()", "setDOM()"],
      correctAnswer: 0
    },
    {
      id: 5,
      question: "Which file extension is commonly used for React components?",
      options: [".jsx", ".js", ".react", ".tsx"],
      correctAnswer: 0
    }
  ],
  nodejs: [
    {
      id: 1,
      question: "What module is built into Node.js for creating servers?",
      options: ["http", "net", "url", "fs"],
      correctAnswer: 0
    },
    {
      id: 2,
      question: "Which command initializes a new Node.js project?",
      options: ["npm create", "node init", "npm init", "node setup"],
      correctAnswer: 2
    },
    {
      id: 3,
      question: "What does the 'require' keyword do in Node.js?",
      options: ["Include external modules", "Define variables", "Run async functions", "Connect to DB"],
      correctAnswer: 0
    },
    {
      id: 4,
      question: "Which framework is popular for building APIs with Node.js?",
      options: ["Vue", "Express", "Angular", "Svelte"],
      correctAnswer: 1
    },
    {
      id: 5,
      question: "What is the extension of a JavaScript file executed by Node.js?",
      options: [".node", ".njs", ".js", ".json"],
      correctAnswer: 2
    }
  ],
  databases: [
    {
      id: 1,
      question: "What does SQL stand for?",
      options: ["Structured Query Language", "Simple Query Language", "System Query List", "Standard Queue Logic"],
      correctAnswer: 0
    },
    {
      id: 2,
      question: "Which command is used to retrieve data from a database?",
      options: ["GET", "RETRIEVE", "SELECT", "FETCH"],
      correctAnswer: 2
    },
    {
      id: 3,
      question: "Which of the following is a NoSQL database?",
      options: ["MySQL", "PostgreSQL", "Oracle", "MongoDB"],
      correctAnswer: 3
    },
    {
      id: 4,
      question: "Which SQL clause is used to filter results?",
      options: ["ORDER BY", "WHERE", "GROUP BY", "LIMIT"],
      correctAnswer: 1
    },
    {
      id: 5,
      question: "Which tool is commonly used to interact with MongoDB?",
      options: ["pgAdmin", "MongoShell", "DBVisualizer", "Workbench"],
      correctAnswer: 1
    }
  ],
  git: [
    {
      id: 1,
      question: "Which command shows the current Git branch and status?",
      options: ["git log", "git status", "git branch", "git check"],
      correctAnswer: 1
    },
    {
      id: 2,
      question: "Which command stages all modified files?",
      options: ["git push .", "git stage *", "git add .", "git commit *"],
      correctAnswer: 2
    },
    {
      id: 3,
      question: "Which command creates a new branch in Git?",
      options: ["git make-branch", "git new", "git branch", "git create"],
      correctAnswer: 2
    },
    {
      id: 4,
      question: "Which site is most commonly used for Git repository hosting?",
      options: ["Bitbucket", "GitHub", "GitLab", "Azure DevOps"],
      correctAnswer: 1
    },
    {
      id: 5,
      question: "What does `git commit -m` do?",
      options: ["Push changes", "Track changes", "Commit changes with message", "Create new repo"],
      correctAnswer: 2
    }
  ]
};

export default assessmentQuestions;
