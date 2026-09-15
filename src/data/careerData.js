// Comprehensive Career Data for 16 target roles, skills, roadmaps, and prep modules

export const CAREER_TARGET_ROLES = {
  'Frontend Developer': {
    title: 'Frontend Developer',
    company: 'TechCorp Solutions',
    experienceLevel: 'Entry to Mid Level',
    requiredSkills: ['HTML/CSS', 'JavaScript', 'React', 'TypeScript', 'System Design'],
    preferredSkills: ['Redux', 'TailwindCSS', 'Jest', 'Git & GitHub'],
    jobDescription: 'Build high-performance web applications using React, TypeScript, and modern frontend tools. Ensure responsive design, smooth user interactions, and clean integration with backend REST APIs.',
    sequence: ['Programming Basics', 'HTML/CSS', 'JavaScript', 'React', 'TypeScript', 'System Design', 'Projects', 'Mock Interviews', 'Job Ready'],
    readinessWeights: { skillMatch: 0.4, atsMatch: 0.2, interview: 0.2, project: 0.2 },
    atsKeywords: ['react', 'typescript', 'javascript', 'html', 'css', 'redux', 'webpack', 'testing', 'responsive', 'rest api', 'git', 'github']
  },
  'Backend Developer': {
    title: 'Backend Developer',
    company: 'CloudScale Systems',
    experienceLevel: 'Entry to Mid Level',
    requiredSkills: ['Programming Basics', 'Data Structures', 'Database', 'Git & GitHub', 'Backend Development', 'REST APIs', 'Docker', 'Cloud Deployment'],
    preferredSkills: ['Node.js/Express', 'PostgreSQL', 'MongoDB', 'Redis', 'CI/CD', 'System Design'],
    jobDescription: 'Develop robust, scalable APIs and backend services. Manage databases, optimize server performance, implement authorization pipelines, and containerize services using Docker.',
    sequence: ['Programming Basics', 'Data Structures', 'Database', 'Git & GitHub', 'Backend Development', 'REST APIs', 'Docker', 'Cloud Deployment', 'Projects', 'Mock Interviews', 'Job Ready'],
    readinessWeights: { skillMatch: 0.4, atsMatch: 0.2, interview: 0.2, project: 0.2 },
    atsKeywords: ['nodejs', 'express', 'postgresql', 'mongodb', 'redis', 'docker', 'rest api', 'jwt', 'mvc', 'sql', 'nosql', 'git', 'github']
  },
  'Full Stack Developer': {
    title: 'Full Stack Developer',
    company: 'SaaSify Inc',
    experienceLevel: 'Mid Level',
    requiredSkills: ['JavaScript', 'React', 'Node.js', 'Database', 'REST APIs', 'System Design', 'Git & GitHub'],
    preferredSkills: ['TypeScript', 'Docker', 'AWS', 'Next.js'],
    jobDescription: 'Design and implement end-to-end software solutions. Build responsive user interfaces in React, scalable server architectures using Node.js, and optimize database layers.',
    sequence: ['Programming Basics', 'HTML/CSS', 'JavaScript', 'React', 'Node.js', 'Database', 'REST APIs', 'System Design', 'Projects', 'Mock Interviews', 'Job Ready'],
    readinessWeights: { skillMatch: 0.3, atsMatch: 0.2, interview: 0.2, project: 0.3 },
    atsKeywords: ['fullstack', 'react', 'nodejs', 'javascript', 'mongodb', 'sql', 'system design', 'rest api', 'aws', 'docker', 'typescript']
  },
  'AI Engineer': {
    title: 'AI Engineer',
    company: 'NeuralNet Labs',
    experienceLevel: 'Mid to Senior Level',
    requiredSkills: ['Python', 'Machine Learning', 'PyTorch/TensorFlow', 'LLMs & Prompt Engineering', 'Natural Language Processing'],
    preferredSkills: ['Vector Databases', 'LangChain', 'API Integration', 'Docker'],
    jobDescription: 'Build, fine-tune, and deploy AI models. Integrate large language models (LLMs) into production pipelines and set up vector storage pipelines for context Retrieval Augmented Generation (RAG).',
    sequence: ['Python', 'Data Analytics', 'Machine Learning', 'PyTorch/TensorFlow', 'LLMs & Prompt Engineering', 'Vector Databases', 'Projects', 'Mock Interviews', 'Job Ready'],
    readinessWeights: { skillMatch: 0.4, atsMatch: 0.2, interview: 0.2, project: 0.2 },
    atsKeywords: ['python', 'pytorch', 'tensorflow', 'llm', 'langchain', 'rag', 'vector database', 'gpt', 'fine-tuning', 'nlp', 'transformers']
  },
  'Machine Learning Engineer': {
    title: 'Machine Learning Engineer',
    company: 'AutoDrive Corp',
    experienceLevel: 'Mid Level',
    requiredSkills: ['Python', 'Mathematics & Stats', 'Machine Learning', 'Deep Learning', 'MLOps & Deployment'],
    preferredSkills: ['Kubernetes', 'Docker', 'CUDA', 'Cloud Platforms (AWS/GCP)'],
    jobDescription: 'Design training loops, prepare massive datasets, and deploy machine learning models. Optimize models for CPU/GPU latency and set up continuous training (MLOps) orchestration scripts.',
    sequence: ['Python', 'Mathematics & Stats', 'Machine Learning', 'Deep Learning', 'MLOps & Deployment', 'Projects', 'Mock Interviews', 'Job Ready'],
    readinessWeights: { skillMatch: 0.4, atsMatch: 0.2, interview: 0.2, project: 0.2 },
    atsKeywords: ['python', 'machine learning', 'deep learning', 'mlops', 'scikit-learn', 'pytorch', 'tensorflow', 'pandas', 'numpy', 'kubernetes']
  },
  'Data Scientist': {
    title: 'Data Scientist',
    company: 'Insight Analytics',
    experienceLevel: 'Entry to Mid Level',
    requiredSkills: ['Python', 'SQL', 'Data Analytics', 'Machine Learning', 'Data Visualization'],
    preferredSkills: ['Pandas/NumPy', 'R', 'Statistics', 'Tableau', 'Git & GitHub'],
    jobDescription: 'Extract insights from complex structured and unstructured datasets. Train machine learning models, design statistical experiments, and build interactive dashboards to communicate findings.',
    sequence: ['Python', 'SQL', 'Data Analytics', 'Machine Learning', 'Data Visualization', 'Projects', 'Mock Interviews', 'Job Ready'],
    readinessWeights: { skillMatch: 0.4, atsMatch: 0.2, interview: 0.2, project: 0.2 },
    atsKeywords: ['python', 'sql', 'pandas', 'numpy', 'machine learning', 'data visualization', 'statistics', 'tableau', 'excel', 'a/b testing']
  },
  'Cloud Engineer': {
    title: 'Cloud Engineer',
    company: 'Skyward Technologies',
    experienceLevel: 'Entry to Mid Level',
    requiredSkills: ['Networking', 'Linux', 'Cloud Platforms (AWS/GCP)', 'Infrastructure as Code (IaC)', 'Security Policies'],
    preferredSkills: ['Terraform', 'Docker', 'Kubernetes', 'Serverless Architecture'],
    jobDescription: 'Configure, deploy, and maintain robust cloud architectures. Implement autoscaling mechanisms, configure network routing and VPCs, and manage infrastructure as code with Terraform.',
    sequence: ['Networking', 'Linux', 'Cloud Platforms (AWS/GCP)', 'Infrastructure as Code (IaC)', 'Security Policies', 'Projects', 'Mock Interviews', 'Job Ready'],
    readinessWeights: { skillMatch: 0.4, atsMatch: 0.2, interview: 0.2, project: 0.2 },
    atsKeywords: ['aws', 'gcp', 'terraform', 'cloud', 'linux', 'networking', 'iam', 's3', 'ec2', 'vpc', 'serverless', 'iac']
  },
  'DevOps Engineer': {
    title: 'DevOps Engineer',
    company: 'Continuum Systems',
    experienceLevel: 'Mid Level',
    requiredSkills: ['Linux', 'Docker', 'Kubernetes', 'CI/CD Pipelines', 'Automation scripting (Bash/Python)'],
    preferredSkills: ['Terraform', 'Prometheus/Grafana', 'GitLab CI/GitHub Actions', 'Cloud Security'],
    jobDescription: 'Automate build, deployment, and testing infrastructure. Build scalable, containerized systems with Kubernetes and manage automated release cycles using GitHub Actions or GitLab.',
    sequence: ['Linux', 'Docker', 'Kubernetes', 'CI/CD Pipelines', 'Automation scripting (Bash/Python)', 'Projects', 'Mock Interviews', 'Job Ready'],
    readinessWeights: { skillMatch: 0.4, atsMatch: 0.2, interview: 0.2, project: 0.2 },
    atsKeywords: ['devops', 'kubernetes', 'docker', 'cicd', 'jenkins', 'github actions', 'bash', 'python', 'prometheus', 'grafana', 'terraform']
  },
  'Cybersecurity Engineer': {
    title: 'Cybersecurity Engineer',
    company: 'SecureNet Labs',
    experienceLevel: 'Entry to Mid Level',
    requiredSkills: ['Networking', 'Linux', 'Cryptography', 'Pen Testing', 'Security Auditing', 'OWASP Top 10'],
    preferredSkills: ['Python', 'Wireshark', 'Metasploit', 'SIEM Tools', 'Firewalls'],
    jobDescription: 'Protect system networks and digital assets. Perform penetration testing, conduct regular security audits, build firewall policies, and secure web applications against OWASP Top 10 vulnerabilities.',
    sequence: ['Networking', 'Linux', 'Cryptography', 'Pen Testing', 'Security Auditing', 'OWASP Top 10', 'Projects', 'Mock Interviews', 'Job Ready'],
    readinessWeights: { skillMatch: 0.4, atsMatch: 0.2, interview: 0.2, project: 0.2 },
    atsKeywords: ['cybersecurity', 'penetration testing', 'firewall', 'linux', 'networking', 'cryptography', 'owasp', 'siem', 'vulnerability', 'auditing']
  },
  'Android Developer': {
    title: 'Android Developer',
    company: 'MobileFirst Corp',
    experienceLevel: 'Entry to Mid Level',
    requiredSkills: ['Kotlin', 'Android SDK', 'Jetpack Compose', 'REST API Integration', 'Git & GitHub'],
    preferredSkills: ['Java', 'Coroutines/Flow', 'MVVM Architecture', 'Dagger Hilt', 'Firebase'],
    jobDescription: 'Design and build clean, scalable native Android applications. Implement responsive, responsive layouts using Jetpack Compose, handle offline storage, and consume REST APIs.',
    sequence: ['Programming Basics', 'Kotlin', 'Android SDK', 'Jetpack Compose', 'REST API Integration', 'Projects', 'Mock Interviews', 'Job Ready'],
    readinessWeights: { skillMatch: 0.4, atsMatch: 0.2, interview: 0.2, project: 0.2 },
    atsKeywords: ['android', 'kotlin', 'jetpack compose', 'mvvm', 'dagger hilt', 'gradle', 'android sdk', 'xml', 'coroutine', 'firebase']
  },
  'Embedded Engineer': {
    title: 'Embedded Engineer',
    company: 'Silicon IoT Systems',
    experienceLevel: 'Entry Level',
    requiredSkills: ['C', 'C++', 'Embedded Systems', 'Verilog', 'VLSI Design', 'RTOS'],
    preferredSkills: ['Assembly', 'Microcontrollers', 'I2C/SPI', 'Oscilloscopes', 'PCB Design'],
    jobDescription: 'Program firmware and interface with microcontrollers. Develop firmware in C/C++, design digital circuits in Verilog, and utilize real-time operating systems (RTOS) to manage time-critical system processes.',
    sequence: ['C', 'C++', 'Embedded Systems', 'Verilog', 'VLSI Design', 'RTOS', 'Projects', 'Mock Interviews', 'Job Ready'],
    readinessWeights: { skillMatch: 0.4, atsMatch: 0.2, interview: 0.2, project: 0.2 },
    atsKeywords: ['embedded', 'c', 'cpp', 'firmware', 'microcontroller', 'rtos', 'verilog', 'vlsi', 'pcb', 'i2c', 'spi', 'uart', 'oscilloscope']
  },
  'UI UX Designer': {
    title: 'UI UX Designer',
    company: 'Creative Studio Co',
    experienceLevel: 'Entry to Mid Level',
    requiredSkills: ['Figma', 'Wireframing & Prototyping', 'User Research', 'Design Systems', 'Visual Design'],
    preferredSkills: ['Adobe Creative Suite', 'Typography', 'Interaction Design', 'HTML/CSS Basics'],
    jobDescription: 'Construct wireframes, mockups, and high-fidelity interactive prototypes. Conduct structured user testing, refine design systems, and coordinate design transfers with engineering squads.',
    sequence: ['Figma', 'Wireframing & Prototyping', 'User Research', 'Design Systems', 'Visual Design', 'Projects', 'Mock Interviews', 'Job Ready'],
    readinessWeights: { skillMatch: 0.4, atsMatch: 0.2, interview: 0.2, project: 0.2 },
    atsKeywords: ['ui ux', 'figma', 'wireframe', 'prototype', 'design system', 'user research', 'interaction design', 'adobe', 'usability testing']
  },
  'Product Manager': {
    title: 'Product Manager',
    company: 'Apex Consumer Tech',
    experienceLevel: 'Associate PM',
    requiredSkills: ['Product Strategy', 'Agile', 'User Research', 'Data Analytics', 'Communication'],
    preferredSkills: ['Wireframing', 'Market Analysis', 'SQL', 'A/B Testing', 'Jira'],
    jobDescription: 'Own product features from conception to launch. Conduct user research, prioritize backlogs using Agile frameworks, analyze usage metrics, and collaborate across design, engineering, and sales teams.',
    sequence: ['Product Strategy', 'Agile', 'User Research', 'Data Analytics', 'Communication', 'Mock Interviews', 'Job Ready'],
    readinessWeights: { skillMatch: 0.3, atsMatch: 0.2, interview: 0.3, project: 0.2 },
    atsKeywords: ['product manager', 'agile', 'scrum', 'jira', 'roadmap', 'market research', 'analytics', 'strategy', 'ab testing', 'user stories']
  },
  'Blockchain Developer': {
    title: 'Blockchain Developer',
    company: 'CryptoGlobal Labs',
    experienceLevel: 'Mid Level',
    requiredSkills: ['Solidity', 'Smart Contracts', 'Cryptography', 'Web3 APIs (ethers.js)', 'Ethereum & EVM'],
    preferredSkills: ['Rust', 'Hardhat', 'Truffle', 'IPFS', 'DeFi Architectures'],
    jobDescription: 'Architect, code, and deploy secure Solidity smart contracts. Build dApp interfaces connecting web apps to decentralized nodes and perform safety stress-testing on crypto transactions.',
    sequence: ['Programming Basics', 'Cryptography', 'Solidity', 'Smart Contracts', 'Web3 APIs (ethers.js)', 'Projects', 'Mock Interviews', 'Job Ready'],
    readinessWeights: { skillMatch: 0.4, atsMatch: 0.2, interview: 0.2, project: 0.2 },
    atsKeywords: ['blockchain', 'solidity', 'smart contract', 'web3', 'ethersjs', 'ethereum', 'evm', 'cryptography', 'rust', 'defi', 'hardhat']
  },
  'Game Developer': {
    title: 'Game Developer',
    company: 'PixelForge Studios',
    experienceLevel: 'Entry to Mid Level',
    requiredSkills: ['C#', 'Unity Game Engine', '3D Math & Physics', 'Game Loops & Logic', 'Performance Optimization'],
    preferredSkills: ['Unreal Engine', 'C++', 'Shaders/HLSL', '3D Modeling basics', 'Git & GitHub'],
    jobDescription: 'Create engaging gameplay scripts, optimize render loops, construct UI animations, and deploy game projects across mobile, PC, and consoles using Unity or Unreal Engine.',
    sequence: ['Programming Basics', 'C#', 'Unity Game Engine', '3D Math & Physics', 'Performance Optimization', 'Projects', 'Mock Interviews', 'Job Ready'],
    readinessWeights: { skillMatch: 0.4, atsMatch: 0.2, interview: 0.2, project: 0.2 },
    atsKeywords: ['game developer', 'unity', 'unreal engine', 'c#', 'cpp', 'gameplay', 'physics', 'rendering', 'shaders', '3d math', 'optimization']
  },
  'Software Engineer': {
    title: 'Software Engineer',
    company: 'General Tech Systems',
    experienceLevel: 'Entry to Mid Level',
    requiredSkills: ['Programming Basics', 'Data Structures', 'System Design', 'Git & GitHub', 'Database'],
    preferredSkills: ['Java', 'C++', 'Python', 'Docker', 'Linux', 'Testing'],
    jobDescription: 'Design, write, and test reusable, scalable software. Solve algorithmic problems, configure databases, and participate in code reviews using Git and modern build systems.',
    sequence: ['Programming Basics', 'Data Structures', 'Database', 'Git & GitHub', 'System Design', 'Projects', 'Mock Interviews', 'Job Ready'],
    readinessWeights: { skillMatch: 0.4, atsMatch: 0.2, interview: 0.2, project: 0.2 },
    atsKeywords: ['software engineer', 'dsa', 'algorithms', 'system design', 'git', 'database', 'sql', 'java', 'cpp', 'python', 'oop']
  }
};

export const CAREER_SKILL_METADATA = {
  'Programming Basics': {
    importance: 5,
    difficulty: 'Easy',
    estimatedTime: '20 Hours',
    prerequisites: 'None',
    industryDemand: 'Critical',
    whyItMatters: 'The foundation of all software engineering. Necessary to understand loops, conditionals, variables, and basic logic.',
    learningOutcome: 'Ability to write clean, basic algorithms using variables, loops, data structures, and conditional statements.',
    salaryImpact: '+15%',
    companies: ['Google', 'Microsoft', 'Amazon'],
    interviewQuestions: ['Explain the difference between value types and reference types.', 'What is recursion and when would you use it over iteration?']
  },
  'HTML/CSS': {
    importance: 4,
    difficulty: 'Easy',
    estimatedTime: '25 Hours',
    prerequisites: 'None',
    industryDemand: 'High',
    whyItMatters: 'Required to build the structural markup and visual layout of web applications.',
    learningOutcome: 'Build responsive landing pages with semantic HTML elements and CSS Flexbox/Grid layouts.',
    salaryImpact: '+10%',
    companies: ['Meta', 'Netflix', 'Shopify'],
    interviewQuestions: ['Explain CSS specificity rules.', 'What is the box model in CSS?']
  },
  'JavaScript': {
    importance: 5,
    difficulty: 'Medium',
    estimatedTime: '45 Hours',
    prerequisites: 'Programming Basics',
    industryDemand: 'Very High',
    whyItMatters: 'The logic engine of modern frontend web applications, handling user interactivity and asynchronous API communication.',
    learningOutcome: 'Understand DOM manipulation, ES6 syntax, Closures, Promises, and Asynchronous JS (async/await).',
    salaryImpact: '+25%',
    companies: ['Airbnb', 'Uber', 'Stripe'],
    interviewQuestions: ['What is prototype inheritance in JavaScript?', 'Explain closures and event loop queues.']
  },
  'React': {
    importance: 5,
    difficulty: 'Medium',
    estimatedTime: '55 Hours',
    prerequisites: 'JavaScript, HTML/CSS',
    industryDemand: 'Very High',
    whyItMatters: 'Industry-standard declarative library for building component-based, high-performance UI structures.',
    learningOutcome: 'Build single-page apps using React Hooks, State Management (Context API/Redux), and Router.',
    salaryImpact: '+30%',
    companies: ['Facebook', 'Netflix', 'Vercel'],
    interviewQuestions: ['How does the virtual DOM work in React?', 'What is the difference between useEffect and useMemo?']
  },
  'TypeScript': {
    importance: 4,
    difficulty: 'Medium',
    estimatedTime: '30 Hours',
    prerequisites: 'JavaScript',
    industryDemand: 'High',
    whyItMatters: 'Adds static typing to JavaScript, catching errors at compile time and improving large-scale codebase maintainability.',
    learningOutcome: 'Configure TS compilers, write typed components, interfaces, generics, and union types.',
    salaryImpact: '+15%',
    companies: ['Microsoft', 'Slack', 'Vercel'],
    interviewQuestions: ['What are generics in TypeScript?', 'Explain the difference between interface and type alias.']
  },
  'Node.js': {
    importance: 4,
    difficulty: 'Medium',
    estimatedTime: '40 Hours',
    prerequisites: 'JavaScript',
    industryDemand: 'High',
    whyItMatters: 'Allows running JavaScript server-side, enabling full-stack engineers to build unified JS/TS apps.',
    learningOutcome: 'Develop custom server scripts, work with NPM, handle file systems, and understand event loops.',
    salaryImpact: '+20%',
    companies: ['PayPal', 'Netflix', 'LinkedIn'],
    interviewQuestions: ['What is the event loop in Node.js?', 'How does middleware routing work in Express?']
  },
  'System Design': {
    importance: 5,
    difficulty: 'Hard',
    estimatedTime: '50 Hours',
    prerequisites: 'Node.js or Backend Development, Databases',
    industryDemand: 'Very High',
    whyItMatters: 'Critical for architecting scalable, resilient systems that can handle millions of concurrent users.',
    learningOutcome: 'Design high-level architectures with load balancers, caching layers, microservices, and databases.',
    salaryImpact: '+40%',
    companies: ['Amazon', 'Netflix', 'Uber'],
    interviewQuestions: ['How do you scale an API server horizontally?', 'Explain cache consistency strategies like write-through vs write-back.']
  },
  'Data Structures': {
    importance: 5,
    difficulty: 'Hard',
    estimatedTime: '80 Hours',
    prerequisites: 'Programming Basics',
    industryDemand: 'Critical',
    whyItMatters: 'Essential for coding interviews and solving core computational logic puzzles with optimal time/space complexity.',
    learningOutcome: 'Analyze complexity using Big O; implement Arrays, Linked Lists, Trees, Stacks, Queues, Hash Tables, and Graphs.',
    salaryImpact: '+25%',
    companies: ['Google', 'Meta', 'Netflix'],
    interviewQuestions: ['How do you invert a binary tree?', 'What is the time complexity of lookup in a hash table?']
  },
  'Database': {
    importance: 5,
    difficulty: 'Medium',
    estimatedTime: '35 Hours',
    prerequisites: 'Programming Basics',
    industryDemand: 'Critical',
    whyItMatters: 'Every modern software system requires a persistent storage engine to save, query, and structure application data.',
    learningOutcome: 'Write complex SQL queries (Joins, Indexing) and configure collections in NoSQL databases like MongoDB.',
    salaryImpact: '+20%',
    companies: ['Oracle', 'MongoDB', 'Postgres'],
    interviewQuestions: ['What is database indexing and how does it speed up queries?', 'Compare ACID properties in SQL with BASE in NoSQL.']
  },
  'Git & GitHub': {
    importance: 4,
    difficulty: 'Easy',
    estimatedTime: '15 Hours',
    prerequisites: 'Programming Basics',
    industryDemand: 'Critical',
    whyItMatters: 'Standard system for version control and team code collaboration across the entire tech industry.',
    learningOutcome: 'Manage branches, resolve merge conflicts, stash changes, and collaborate using pull requests.',
    salaryImpact: '+10%',
    companies: ['GitHub', 'GitLab', 'Atlassian'],
    interviewQuestions: ['What is the difference between git merge and git rebase?', 'How do you undo a commit that has already been pushed?']
  },
  'Backend Development': {
    importance: 5,
    difficulty: 'Medium',
    estimatedTime: '50 Hours',
    prerequisites: 'Programming Basics, Database',
    industryDemand: 'Critical',
    whyItMatters: 'Handles servers, routing logic, databases, web sockets, API creation, authentication, and backend security.',
    learningOutcome: 'Build Express or Django apps complete with authentication (JWT), routing, and database models.',
    salaryImpact: '+25%',
    companies: ['Amazon', 'Microsoft', 'Lyft'],
    interviewQuestions: ['Explain JWT-based authentication.', 'How do you handle cross-origin resource sharing (CORS)?']
  },
  'REST APIs': {
    importance: 5,
    difficulty: 'Medium',
    estimatedTime: '20 Hours',
    prerequisites: 'Backend Development',
    industryDemand: 'Critical',
    whyItMatters: 'Standard architectural protocol for API contracts between client apps and backend databases.',
    learningOutcome: 'Create standard CRUD endpoints conforming to HTTP status codes, security best practices, and versioning.',
    salaryImpact: '+15%',
    companies: ['Salesforce', 'Twilio', 'Postman'],
    interviewQuestions: ['What are the HTTP status codes 401, 403, and 500?', 'What is idempotency in REST APIs?']
  },
  'Docker': {
    importance: 4,
    difficulty: 'Medium',
    estimatedTime: '30 Hours',
    prerequisites: 'Linux',
    industryDemand: 'Very High',
    whyItMatters: 'Containerization isolates applications and dependencies, ensuring matching behavior across development and cloud production.',
    learningOutcome: 'Construct Dockerfiles, docker-compose orchestration environments, and clean volume/network attachments.',
    salaryImpact: '+20%',
    companies: ['Docker', 'Vercel', 'AWS'],
    interviewQuestions: ['Explain container image layers.', 'What is the difference between a Docker image and a Docker container?']
  },
  'Cloud Deployment': {
    importance: 5,
    difficulty: 'Medium',
    estimatedTime: '35 Hours',
    prerequisites: 'Docker',
    industryDemand: 'Very High',
    whyItMatters: 'Essential for publishing websites and server APIs to target cloud server providers (AWS, GCP, Azure).',
    learningOutcome: 'Configure hosting pipelines, static CDNs, server processes, and secure cloud credentials.',
    salaryImpact: '+25%',
    companies: ['Amazon', 'Google', 'Microsoft'],
    interviewQuestions: ['What is auto-scaling in cloud environments?', 'Explain the difference between serverless hosting and VM hosting.']
  },
  'Python': {
    importance: 5,
    difficulty: 'Easy',
    estimatedTime: '30 Hours',
    prerequisites: 'None',
    industryDemand: 'Very High',
    whyItMatters: 'Language of choice for data science, machine learning, cloud automation, scripting, and backend web APIs.',
    learningOutcome: 'Write modular Python scripts, configure conda environments, handle error logging, and structure OOP elements.',
    salaryImpact: '+20%',
    companies: ['Google', 'Meta', 'Instagram'],
    interviewQuestions: ['What is the difference between list and tuple?', 'Explain decorators in Python.']
  },
  'Machine Learning': {
    importance: 5,
    difficulty: 'Hard',
    estimatedTime: '60 Hours',
    prerequisites: 'Python, Mathematics & Stats',
    industryDemand: 'Critical',
    whyItMatters: 'Powers automated recommendations, predictive models, search ranking algorithms, and user behavior analytics.',
    learningOutcome: 'Apply regressions, classifications, clustering models, and evaluate model loss using standard evaluation metrics.',
    salaryImpact: '+35%',
    companies: ['OpenAI', 'Tesla', 'NVIDIA'],
    interviewQuestions: ['Explain overfitting and how to prevent it.', 'What is gradient descent and how does it work?']
  },
  'PyTorch/TensorFlow': {
    importance: 5,
    difficulty: 'Hard',
    estimatedTime: '60 Hours',
    prerequisites: 'Machine Learning',
    industryDemand: 'Critical',
    whyItMatters: 'Deep learning frameworks for building neural networks, image classifiers, transformers, and complex model training paths.',
    learningOutcome: 'Construct neural network layers, custom training loops, feedforward models, and validate weights.',
    salaryImpact: '+35%',
    companies: ['Meta', 'Google', 'Hugging Face'],
    interviewQuestions: ['Explain backpropagation in deep neural networks.', 'What is the purpose of activation functions like ReLU?']
  },
  'LLMs & Prompt Engineering': {
    importance: 5,
    difficulty: 'Medium',
    estimatedTime: '30 Hours',
    prerequisites: 'Python',
    industryDemand: 'Very High',
    whyItMatters: 'Enables developers to leverage large models for context analysis, summarization, chatbots, and AI integrations.',
    learningOutcome: 'Design prompt structures, configure token outputs, and implement LangChain API pipelines.',
    salaryImpact: '+30%',
    companies: ['OpenAI', 'Anthropic', 'Google'],
    interviewQuestions: ['Explain temperature and top-p sampling in LLM generation.', 'What is RAG (Retrieval Augmented Generation)?']
  },
  'Vector Databases': {
    importance: 4,
    difficulty: 'Medium',
    estimatedTime: '25 Hours',
    prerequisites: 'Database, Python',
    industryDemand: 'High',
    whyItMatters: 'Enables semantic search, RAG pipelines, and recommendation search algorithms based on vector embeddings.',
    learningOutcome: 'Upsert embeddings, configure similarity metrics (Cosine, Euclidean), and query databases like Pinecone/Chroma.',
    salaryImpact: '+25%',
    companies: ['Pinecone', 'Supabase', 'Weaviate'],
    interviewQuestions: ['Explain vector embeddings.', 'How does cosine similarity differ from dot product in vector search?']
  },
  'Figma': {
    importance: 5,
    difficulty: 'Easy',
    estimatedTime: '30 Hours',
    prerequisites: 'None',
    industryDemand: 'Very High',
    whyItMatters: 'Standard tool for UI/UX wireframing, mockup compilation, vector drawing, and interactive prototype designs.',
    learningOutcome: 'Familiarity with frames, auto-layouts, components, component variants, and interactive prototype links.',
    salaryImpact: '+15%',
    companies: ['Figma', 'Airbnb', 'Square'],
    interviewQuestions: ['What are the advantages of Auto Layout in Figma?', 'How do you build a reusable component library?']
  },
  'Solidity': {
    importance: 5,
    difficulty: 'Hard',
    estimatedTime: '50 Hours',
    prerequisites: 'Programming Basics',
    industryDemand: 'High',
    whyItMatters: 'Language of choice for writing secure, decentralized smart contracts on Ethereum and EVM-compatible chains.',
    learningOutcome: 'Write secure, gas-optimized contracts, compile bytecode, write unit tests, and deploy on testnets.',
    salaryImpact: '+35%',
    companies: ['ConsenSys', 'Uniswap', 'OpenZeppelin'],
    interviewQuestions: ['Explain reentrancy attacks and how to guard against them.', 'What is gas and how is it calculated in Solidity?']
  },
  'Kotlin': {
    importance: 5,
    difficulty: 'Medium',
    estimatedTime: '35 Hours',
    prerequisites: 'Programming Basics',
    industryDemand: 'Very High',
    whyItMatters: 'Official language supported by Google for native Android app development, featuring clean, safe syntax.',
    learningOutcome: 'Write clean Kotlin code, understand null safety, coroutines, extension functions, and data classes.',
    salaryImpact: '+20%',
    companies: ['Google', 'Slack', 'Tinder'],
    interviewQuestions: ['How does null safety work in Kotlin?', 'What is a coroutine in Kotlin?']
  },
  'C#': {
    importance: 5,
    difficulty: 'Medium',
    estimatedTime: '40 Hours',
    prerequisites: 'Programming Basics',
    industryDemand: 'High',
    whyItMatters: 'Primary programming language for Unity game engine scripts, .NET architectures, and desktop applications.',
    learningOutcome: 'Implement object-oriented design patterns, game loops, class structures, and performance configurations.',
    salaryImpact: '+15%',
    companies: ['Microsoft', 'Epic Games', 'Blizzard'],
    interviewQuestions: ['What is garbage collection in C#?', 'Explain the difference between abstract classes and interfaces in C#.']
  },
  'Unity Game Engine': {
    importance: 5,
    difficulty: 'Medium',
    estimatedTime: '60 Hours',
    prerequisites: 'C#',
    industryDemand: 'Very High',
    whyItMatters: 'Powerful 3D/2D game engine used to deploy games across mobile, console, PC, and virtual reality devices.',
    learningOutcome: 'Import assets, write gameplay scripts, program colliders, configure physics, render pipelines, and export packages.',
    salaryImpact: '+25%',
    companies: ['Unity Technologies', 'Electronic Arts', 'Ubisoft'],
    interviewQuestions: ['Explain the Unity game loop execution order (Awake, Start, Update, FixedUpdate).', 'What is draw call batching?']
  },
  'Networking': {
    importance: 5,
    difficulty: 'Medium',
    estimatedTime: '35 Hours',
    prerequisites: 'None',
    industryDemand: 'High',
    whyItMatters: 'Crucial for understanding how data travels across routers, servers, protocols (HTTP, TCP, IP), and DNS setups.',
    learningOutcome: 'Explain the OSI model layers, configure subnet masks, diagnose connectivity issues, and analyze traffic.',
    salaryImpact: '+15%',
    companies: ['Cisco', 'Cloudflare', 'Juniper'],
    interviewQuestions: ['What is the difference between TCP and UDP?', 'Explain DNS lookup mechanisms.']
  },
  'Linux': {
    importance: 4,
    difficulty: 'Medium',
    estimatedTime: '25 Hours',
    prerequisites: 'None',
    industryDemand: 'Critical',
    whyItMatters: 'Standard operating system for running servers, cloud instances, database clusters, and secure environments.',
    learningOutcome: 'Manage processes, edit text files via CLI, configure user permissions, write basic bash scripts, and manage files.',
    salaryImpact: '+15%',
    companies: ['Red Hat', 'Canonical', 'AWS'],
    interviewQuestions: ['How do user permissions (chmod) work in Linux?', 'What is a process signal and how do you kill a stuck process?']
  },
  'Cryptography': {
    importance: 5,
    difficulty: 'Hard',
    estimatedTime: '40 Hours',
    prerequisites: 'Mathematics',
    industryDemand: 'Very High',
    whyItMatters: 'Foundation of cybersecurity, ledger verification, secure hashing (SHA), and SSL certificates.',
    learningOutcome: 'Explain symmetric vs asymmetric encryption, verify digital signatures, configure HTTPS, and hash data.',
    salaryImpact: '+20%',
    companies: ['Cloudflare', 'Okta', 'ConsenSys'],
    interviewQuestions: ['How does public key cryptography work?', 'What is salt in password hashing?']
  },
  'Pen Testing': {
    importance: 5,
    difficulty: 'Hard',
    estimatedTime: '55 Hours',
    prerequisites: 'Linux, Networking',
    industryDemand: 'Very High',
    whyItMatters: 'Necessary to identify structural security flaws, simulate threat events, and secure systems before malicious hacking occurs.',
    learningOutcome: 'Utilize penetration testing suites (Metasploit, Nmap, Wireshark), identify vulnerabilities, and compile audit reports.',
    salaryImpact: '+30%',
    companies: ['CrowdStrike', 'FireEye', 'Palo Alto Networks'],
    interviewQuestions: ['What are the phases of penetration testing?', 'Explain SQL injection vulnerabilities.']
  }
};

export const CAREER_RESOURCES = {
  'Programming Basics': [
    { title: 'Python for Beginners', type: 'YouTube Playlist', provider: 'freeCodeCamp', duration: '6 Hours', difficulty: 'Easy', rating: 4.8, cost: 'Free', url: 'https://www.youtube.com/watch?v=rfscVS0vtbw', official: true },
    { title: 'Intro to JS Algorithms', type: 'Course', provider: 'LeetCode', duration: '20 Hours', difficulty: 'Medium', rating: 4.9, cost: 'Free', url: 'https://leetcode.com', official: false },
    { title: 'MDN Programming Guide', type: 'Documentation', provider: 'MDN', duration: 'Self-Paced', difficulty: 'Easy', rating: 5.0, cost: 'Free', url: 'https://developer.mozilla.org', official: true }
  ],
  'HTML/CSS': [
    { title: 'CSS Flexbox & Grid Course', type: 'YouTube Playlist', provider: 'Kevin Powell', duration: '12 Hours', difficulty: 'Easy', rating: 4.9, cost: 'Free', url: 'https://www.youtube.com/@KevinPowell', official: false },
    { title: 'HTML5/CSS3 Tutorials', type: 'Course', provider: 'freeCodeCamp', duration: '11 Hours', difficulty: 'Easy', rating: 4.8, cost: 'Free', url: 'https://freecodecamp.org', official: true }
  ],
  'JavaScript': [
    { title: 'JavaScript The Weird Parts', type: 'Course', provider: 'Udemy', duration: '12 Hours', difficulty: 'Medium', rating: 4.9, cost: 'Paid', url: 'https://udemy.com', official: false },
    { title: 'Eloquent JavaScript Book', type: 'Interactive Book', provider: 'Marijn Haverbeke', duration: '40 Hours', difficulty: 'Hard', rating: 4.7, cost: 'Free', url: 'https://eloquentjavascript.net', official: true }
  ],
  'React': [
    { title: 'Official React Documentation', type: 'Documentation', provider: 'React Docs', duration: 'Self-Paced', difficulty: 'Medium', rating: 5.0, cost: 'Free', url: 'https://react.dev', official: true },
    { title: 'Full Stack Open React Section', type: 'University Course', provider: 'University of Helsinki', duration: '50 Hours', difficulty: 'Medium', rating: 4.9, cost: 'Free', url: 'https://fullstackopen.com', official: true }
  ],
  'TypeScript': [
    { title: 'TypeScript HandBook', type: 'Documentation', provider: 'Microsoft Learn', duration: 'Self-Paced', difficulty: 'Medium', rating: 4.9, cost: 'Free', url: 'https://www.typescriptlang.org/docs', official: true },
    { title: 'No BS TypeScript Series', type: 'YouTube Playlist', provider: 'Jack Herrington', duration: '15 Hours', difficulty: 'Medium', rating: 4.8, cost: 'Free', url: 'https://www.youtube.com', official: false }
  ],
  'Node.js': [
    { title: 'NodeJS Developer Bootcamp', type: 'Course', provider: 'Udemy', duration: '35 Hours', difficulty: 'Medium', rating: 4.7, cost: 'Paid', url: 'https://udemy.com', official: false },
    { title: 'Official Node Documentation', type: 'Documentation', provider: 'Node Docs', duration: 'Self-Paced', difficulty: 'Medium', rating: 4.8, cost: 'Free', url: 'https://nodejs.org/docs', official: true }
  ],
  'System Design': [
    { title: 'System Design Primer', type: 'GitHub Repo', provider: 'Donne Martin', duration: 'Self-Paced', difficulty: 'Hard', rating: 5.0, cost: 'Free', url: 'https://github.com/donnemartin/system-design-primer', official: true },
    { title: 'Grokking System Design', type: 'Course', provider: 'DesignGurus', duration: '30 Hours', difficulty: 'Hard', rating: 4.9, cost: 'Paid', url: 'https://designgurus.io', official: true }
  ],
  'Data Structures': [
    { title: 'Data Structures and Algorithms', type: 'YouTube Playlist', provider: 'Abdul Bari', duration: '40 Hours', difficulty: 'Hard', rating: 4.9, cost: 'Free', url: 'https://www.youtube.com', official: false },
    { title: 'DSA Practice Course', type: 'Practice Platform', provider: 'GeeksforGeeks', duration: 'Self-Paced', difficulty: 'Medium', rating: 4.7, cost: 'Free', url: 'https://geeksforgeeks.org', official: true }
  ],
  'Database': [
    { title: 'SQL BootCamp', type: 'Course', provider: 'Udemy', duration: '20 Hours', difficulty: 'Medium', rating: 4.8, cost: 'Paid', url: 'https://udemy.com', official: false },
    { title: 'MongoDB University Courses', type: 'Course', provider: 'MongoDB Docs', duration: '15 Hours', difficulty: 'Easy', rating: 4.9, cost: 'Free', url: 'https://learn.mongodb.com', official: true }
  ]
};

export const CAREER_WEEKLY_PLANNER = {
  'Frontend Developer': [
    { week: 'Week 1-2', topic: 'Semantics & Styling Mastery', tasks: ['Build a multi-grid dashboard landing page', 'Solve 15 CSS Layout challenges on CSSBattle', 'Learn Semantic HTML elements & accessibility (ARIA) tags'], expectedHours: 15 },
    { week: 'Week 3-4', topic: 'Asynchronous JavaScript & ES6', tasks: ['Code an async fetch utility with debounce & retry mechanisms', 'Build a vanilla JS memory card matching game', 'Complete JavaScript array methods exercises'], expectedHours: 20 },
    { week: 'Week 5-6', topic: 'React Architecture & State Routing', tasks: ['Build a React single page app with router routes & custom contexts', 'Complete 10 React hooks exercises (useEffect, useMemo)', 'Set up simple forms with validation rules'], expectedHours: 25 },
    { week: 'Week 7-8', topic: 'TypeScript Integration & Performance', tasks: ['Migrate React portfolio website to TypeScript', 'Implement lazy loading & virtualized large lists', 'Complete a full mock engineering review checklist'], expectedHours: 20 }
  ],
  'Backend Developer': [
    { week: 'Week 1-2', topic: 'Command Line, Git & DSA Basics', tasks: ['Write bash automation scripts for logs archiving', 'Solve 20 list manipulation challenges on LeetCode', 'Configure multi-branch workflows with merge conflict test environments'], expectedHours: 18 },
    { week: 'Week 3-4', topic: 'HTTP Rest APIs & Node Servers', tasks: ['Build an Express backend with custom routing', 'Implement JWT user authorization pipeline', 'Construct a file-upload receiver middleware'], expectedHours: 22 },
    { week: 'Week 5-6', topic: 'Database Normalization & Queries', tasks: ['Design relational schema models with Mongoose or Postgres joins', 'Write custom query indexing optimization reports', 'Implement Redis caching mechanisms for active endpoints'], expectedHours: 24 },
    { week: 'Week 7-8', topic: 'Docker Containerization & Devops', tasks: ['Write a multi-stage Dockerfile packaging the API server', 'Setup CI/CD pipelines on GitHub Actions', 'Deploy container instances to AWS or Render'], expectedHours: 25 }
  ]
};

export const CAREER_PROJECTS = {
  'Frontend Developer': [
    {
      title: 'Advanced Interactive Workspace Board',
      type: 'SaaS Frontend Product',
      difficulty: 'Medium',
      technologies: ['React', 'TypeScript', 'TailwindCSS', 'Framer Motion'],
      problemStatement: 'Construct a complex visual Kanban board similar to Linear or Trello featuring drag-and-drop lists, custom card attributes, filter query strings, and custom search inputs.',
      githubStructure: `src/\n├── components/\n│   ├── KanbanBoard.tsx\n│   ├── KanbanList.tsx\n│   └── TaskCard.tsx\n├── hooks/\n│   └── useKanbanState.ts\n└── utils/\n    └── dragHelpers.ts`,
      timeline: '3 Weeks',
      resumeImpact: 'Engineered a highly responsive drag-and-drop workflow system using React & custom hooks, optimizing list renders by 40% using component memoization.',
      recruiterValue: 'Demonstrates deep knowledge of component hierarchies, DOM states, state management, and high-performance custom hook structures.',
      portfolioImpact: '9/10'
    },
    {
      title: 'Real-Time Financial Analytics Dashboard',
      type: 'Data Visualization App',
      difficulty: 'Hard',
      technologies: ['React', 'Recharts', 'Date-fns', 'Lucide Icons'],
      problemStatement: 'Build a responsive live dashboard displaying asset price fluctuations, investment balances, and mock transaction histories, complete with date filters and CSV export tools.',
      githubStructure: `src/\n├── components/\n│   ├── ChartViewer.tsx\n│   ├── StatsGrid.tsx\n│   └── TransactionsTable.tsx\n├── data/\n│   └── mockSecurities.json\n└── hooks/\n    └── useStockTicker.ts`,
      timeline: '4 Weeks',
      resumeImpact: 'Constructed an analytics dashboard displaying live stock tickers, parsing 10,000+ data points into smooth graphs using Recharts with instant load times.',
      recruiterValue: 'Proves advanced data filtering capabilities, numerical calculation formatting, and premium chart design skills.',
      portfolioImpact: '9.5/10'
    }
  ],
  'Backend Developer': [
    {
      title: 'Distributed Event Logging System',
      type: 'Infrastructure Backend API',
      difficulty: 'Hard',
      technologies: ['Node.js', 'Express', 'Redis', 'PostgreSQL', 'Docker'],
      problemStatement: 'Develop a microservice backend that digests, aggregates, and stores incoming system warning logs from client endpoints with support for high request rates.',
      githubStructure: `app/\n├── src/\n│   ├── controllers/logController.js\n│   ├── services/redisCache.js\n│   └── db/dbConnector.js\n├── Dockerfile\n└── docker-compose.yml`,
      timeline: '4 Weeks',
      resumeImpact: 'Architected a scalable log digestion service using Node.js and Redis, supporting 1,500+ requests per second while preserving query indexing speeds in PostgreSQL.',
      recruiterValue: 'Demonstrates deep knowledge of database indexing, caching strategies, containerization, and backend scalability structures.',
      portfolioImpact: '10/10'
    }
  ]
};

export const CAREER_CODING_SCHEDULES = {
  'Software Engineer Track': [
    { week: 'Week 1', topic: 'Arrays & Hashing', targetProblems: 8, platforms: ['LeetCode', 'HackerRank'], problems: [
      { name: 'Two Sum', difficulty: 'Easy', link: 'https://leetcode.com/problems/two-sum/' },
      { name: 'Contains Duplicate', difficulty: 'Easy', link: 'https://leetcode.com/problems/contains-duplicate/' },
      { name: 'Group Anagrams', difficulty: 'Medium', link: 'https://leetcode.com/problems/group-anagrams/' }
    ]},
    { week: 'Week 2', topic: 'Two Pointers & Sliding Window', targetProblems: 10, platforms: ['LeetCode'], problems: [
      { name: 'Valid Palindrome', difficulty: 'Easy', link: 'https://leetcode.com/problems/valid-palindrome/' },
      { name: 'Container With Most Water', difficulty: 'Medium', link: 'https://leetcode.com/problems/container-with-most-water/' },
      { name: 'Longest Substring Without Repeating Characters', difficulty: 'Medium', link: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/' }
    ]}
  ]
};

export const CAREER_INTERVIEW_PREP_DATA = {
  'Frontend Developer': [
    { type: 'JavaScript', q: 'What is the closure in JavaScript, and what are common memory leak risks associated with it?', hints: 'Explain lexical scoping, returned inner functions, and references that cannot be garbage collected.' },
    { type: 'React', q: 'How does React reconciler determine DOM update cycles, and what does fiber node represent?', hints: 'Describe the virtual DOM diffing process, state priorities, and commit phases.' }
  ],
  'Backend Developer': [
    { type: 'System Design', q: 'How does database sharding differ from partitioning, and how do you handle routing across shards?', hints: 'Explain horizontal splitting, hash routing keys, and consensus node directories.' },
    { type: 'Databases', q: 'What are database transactions, and how are ACID isolation levels implemented in DBMS databases?', hints: 'Describe locks, concurrency, MVCC, and read/write rules.' }
  ]
};
