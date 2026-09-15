// Comprehensive Data Structures for Career Paths, Skill Gap Analysis, and Roadmaps

export const TARGET_ROLES = {
  'Frontend Developer': {
    title: 'Frontend Developer',
    company: 'TechCorp Solutions',
    experienceLevel: 'Entry to Mid Level',
    requiredSkills: ['HTML/CSS', 'JavaScript', 'React', 'TypeScript', 'Node.js', 'System Design'],
    preferredSkills: ['Redux', 'Webpack', 'TailwindCSS', 'Jest', 'Git & GitHub'],
    jobDescription: 'Build high-performance web applications using React, TypeScript, and modern frontend tools. Ensure responsive design, smooth user interactions, and clean integration with backend REST APIs.',
    sequence: ['Programming Basics', 'HTML/CSS', 'JavaScript', 'React', 'TypeScript', 'Node.js', 'System Design', 'Projects', 'Mock Interviews', 'Job Ready'],
    readinessWeights: { skillMatch: 0.4, atsMatch: 0.2, interview: 0.2, project: 0.2 }
  },
  'Backend Developer': {
    title: 'Backend Developer',
    company: 'CloudScale Systems',
    experienceLevel: 'Entry to Mid Level',
    requiredSkills: ['Programming Basics', 'Data Structures', 'Database', 'Git & GitHub', 'Backend Development', 'REST APIs', 'Docker', 'Cloud Deployment'],
    preferredSkills: ['Node.js/Express', 'Python/Django', 'PostgreSQL', 'MongoDB', 'Redis', 'CI/CD', 'System Design'],
    jobDescription: 'Develop robust, scalable APIs and backend services. Manage databases, optimize server performance, implement authorization pipelines, and containerize services using Docker for cloud deployment.',
    sequence: ['Programming Basics', 'Data Structures', 'Database', 'Git & GitHub', 'Backend Development', 'REST APIs', 'Docker', 'Cloud Deployment', 'CI/CD', 'System Design', 'Projects', 'Mock Interviews', 'Job Ready'],
    readinessWeights: { skillMatch: 0.4, atsMatch: 0.2, interview: 0.2, project: 0.2 }
  },
  'Data Scientist': {
    title: 'Data Scientist',
    company: 'Insight Analytics',
    experienceLevel: 'Entry to Mid Level',
    requiredSkills: ['Python', 'SQL', 'Data Analytics', 'Machine Learning', 'PyTorch/TensorFlow', 'Data Visualization'],
    preferredSkills: ['Pandas/NumPy', 'R', 'Hadoop', 'Tableau', 'Statistics', 'Git & GitHub'],
    jobDescription: 'Extract insights from complex structured and unstructured datasets. Train machine learning models, design statistical experiments, and build interactive dashboards to communicate business findings.',
    sequence: ['Python', 'SQL', 'Data Analytics', 'Machine Learning', 'PyTorch/TensorFlow', 'Data Visualization', 'Projects', 'Mock Interviews', 'Job Ready'],
    readinessWeights: { skillMatch: 0.4, atsMatch: 0.2, interview: 0.2, project: 0.2 }
  },
  'Embedded Systems Engineer': {
    title: 'Embedded Systems Engineer',
    company: 'Silicon IoT Systems',
    experienceLevel: 'Entry Level',
    requiredSkills: ['C', 'C++', 'Embedded Systems', 'Verilog', 'VLSI Design', 'RTOS'],
    preferredSkills: ['Assembly', 'Microcontrollers', 'I2C/SPI', 'Oscilloscopes', 'PCB Design'],
    jobDescription: 'Program firmware and interface with microcontrollers. Develop firmware in C/C++, design digital circuits in Verilog, and utilize real-time operating systems (RTOS) to manage time-critical system processes.',
    sequence: ['C', 'C++', 'Embedded Systems', 'Verilog', 'VLSI Design', 'RTOS', 'Projects', 'Mock Interviews', 'Job Ready'],
    readinessWeights: { skillMatch: 0.4, atsMatch: 0.2, interview: 0.2, project: 0.2 }
  },
  'Product Manager': {
    title: 'Product Manager',
    company: 'Apex Consumer Tech',
    experienceLevel: 'Associate PM',
    requiredSkills: ['Product Strategy', 'Agile', 'User Research', 'Data Analytics', 'Communication'],
    preferredSkills: ['Wireframing', 'Market Analysis', 'SQL', 'A/B Testing', 'Jira'],
    jobDescription: 'Own product features from conception to launch. Conduct user research, prioritize backlogs using Agile frameworks, analyze usage metrics, and collaborate across design, engineering, and sales teams.',
    sequence: ['Product Strategy', 'Agile', 'User Research', 'Data Analytics', 'Communication', 'Mock Interviews', 'Job Ready'],
    readinessWeights: { skillMatch: 0.3, atsMatch: 0.2, interview: 0.3, project: 0.2 }
  },
  'Cybersecurity Specialist': {
    title: 'Cybersecurity Specialist',
    company: 'SecureNet Labs',
    experienceLevel: 'Entry to Mid Level',
    requiredSkills: ['Networking', 'Linux', 'Cryptography', 'Pen Testing', 'Security Auditing', 'OWASP Top 10'],
    preferredSkills: ['Python', 'Wireshark', 'Metasploit', 'SIEM Tools', 'Firewalls', 'AWS Security'],
    jobDescription: 'Protect system networks and digital assets. Perform penetration testing, conduct regular security audits, build firewall policies, and secure web applications against OWASP Top 10 vulnerabilities.',
    sequence: ['Networking', 'Linux', 'Cryptography', 'Pen Testing', 'Security Auditing', 'OWASP Top 10', 'Projects', 'Mock Interviews', 'Job Ready'],
    readinessWeights: { skillMatch: 0.4, atsMatch: 0.2, interview: 0.2, project: 0.2 }
  }
};

export const SKILL_METADATA = {
  'Programming Basics': {
    name: 'Programming Basics',
    importance: 5,
    difficulty: 'Easy',
    estimatedTime: '20 Hours',
    prerequisites: 'None',
    industryDemand: 'Critical',
    priority: 'High',
    whyItMatters: 'The foundation of all software engineering. Necessary to understand loops, conditionals, variables, and basic logic.',
    learningOutcome: 'Ability to write clean, basic algorithms using variables, loops, data structures, and conditional statements.'
  },
  'HTML/CSS': {
    name: 'HTML/CSS',
    importance: 4,
    difficulty: 'Easy',
    estimatedTime: '25 Hours',
    prerequisites: 'None',
    industryDemand: 'High',
    priority: 'High',
    whyItMatters: 'Required to build the structural markup and visual layout of web applications.',
    learningOutcome: 'Build responsive landing pages with semantic HTML elements and CSS Flexbox/Grid layouts.'
  },
  'JavaScript': {
    name: 'JavaScript',
    importance: 5,
    difficulty: 'Medium',
    estimatedTime: '45 Hours',
    prerequisites: 'Programming Basics',
    industryDemand: 'Very High',
    priority: 'High',
    whyItMatters: 'The logic engine of modern frontend web applications, handling user interactivity and asynchronous API communication.',
    learningOutcome: 'Understand DOM manipulation, ES6 syntax, Closures, Promises, and Asynchronous JS (async/await).'
  },
  'React': {
    name: 'React',
    importance: 5,
    difficulty: 'Medium',
    estimatedTime: '55 Hours',
    prerequisites: 'JavaScript, HTML/CSS',
    industryDemand: 'Very High',
    priority: 'High',
    whyItMatters: 'Industry-standard declarative library for building component-based, high-performance UI structures.',
    learningOutcome: 'Build single-page apps using React Hooks, State Management (Context API/Redux), and Router.'
  },
  'TypeScript': {
    name: 'TypeScript',
    importance: 4,
    difficulty: 'Medium',
    estimatedTime: '30 Hours',
    prerequisites: 'JavaScript',
    industryDemand: 'High',
    priority: 'Medium',
    whyItMatters: 'Adds static typing to JavaScript, catching errors at compile time and improving large-scale codebase maintainability.',
    learningOutcome: 'Configure TS compilers, write typed components, interfaces, generics, and union types.'
  },
  'Node.js': {
    name: 'Node.js',
    importance: 4,
    difficulty: 'Medium',
    estimatedTime: '40 Hours',
    prerequisites: 'JavaScript',
    industryDemand: 'High',
    priority: 'Medium',
    whyItMatters: 'Allows running JavaScript server-side, enabling full-stack engineers to build unified JS/TS apps.',
    learningOutcome: 'Develop custom server scripts, work with NPM, handle file systems, and understand event loops.'
  },
  'System Design': {
    name: 'System Design',
    importance: 5,
    difficulty: 'Hard',
    estimatedTime: '50 Hours',
    prerequisites: 'Node.js or Backend Development, Databases',
    industryDemand: 'Very High',
    priority: 'Medium',
    whyItMatters: 'Critical for architecting scalable, resilient systems that can handle millions of concurrent users.',
    learningOutcome: 'Design high-level architectures with load balancers, caching layers, microservices, and databases.'
  },
  'Data Structures': {
    name: 'Data Structures & Algorithms',
    importance: 5,
    difficulty: 'Hard',
    estimatedTime: '80 Hours',
    prerequisites: 'Programming Basics',
    industryDemand: 'Critical',
    priority: 'High',
    whyItMatters: 'Essential for coding interviews and solving core computational logic puzzles with optimal time/space complexity.',
    learningOutcome: 'Analyze complexity using Big O; implement Arrays, Linked Lists, Trees, Stacks, Queues, Hash Tables, and Graphs.'
  },
  'Database': {
    name: 'Database (SQL & NoSQL)',
    importance: 5,
    difficulty: 'Medium',
    estimatedTime: '35 Hours',
    prerequisites: 'Programming Basics',
    industryDemand: 'Critical',
    priority: 'High',
    whyItMatters: 'Every modern software system requires a persistent storage engine to save, query, and structure application data.',
    learningOutcome: 'Write complex SQL queries (Joins, Indexing) and configure collections in NoSQL databases like MongoDB.'
  },
  'Git & GitHub': {
    name: 'Git & GitHub',
    importance: 4,
    difficulty: 'Easy',
    estimatedTime: '15 Hours',
    prerequisites: 'Programming Basics',
    industryDemand: 'Critical',
    priority: 'High',
    whyItMatters: 'Standard system for version control and team code collaboration across the entire tech industry.',
    learningOutcome: 'Manage branches, resolve merge conflicts, stash changes, and collaborate using pull requests.'
  },
  'Backend Development': {
    name: 'Backend Development',
    importance: 5,
    difficulty: 'Medium',
    estimatedTime: '50 Hours',
    prerequisites: 'Programming Basics, Database',
    industryDemand: 'Critical',
    priority: 'High',
    whyItMatters: 'Handles servers, routing logic, databases, web sockets, API creation, authentication, and backend security.',
    learningOutcome: 'Build Express or Django apps complete with authentication (JWT), routing, and database models.'
  },
  'REST APIs': {
    name: 'REST APIs',
    importance: 5,
    difficulty: 'Medium',
    estimatedTime: '20 Hours',
    prerequisites: 'Backend Development',
    industryDemand: 'Critical',
    priority: 'High',
    whyItMatters: 'Standard architectural protocol for API contracts between client apps and backend databases.',
    learningOutcome: 'Create standard CRUD endpoints conforming to HTTP status codes, security best practices, and versioning.'
  },
  'Docker': {
    name: 'Docker',
    importance: 4,
    difficulty: 'Medium',
    estimatedTime: '25 Hours',
    prerequisites: 'Backend Development',
    industryDemand: 'High',
    priority: 'Medium',
    whyItMatters: 'Containers package code with all dependencies, solving the "works on my machine" deployment issue.',
    learningOutcome: 'Write Dockerfiles, build images, run containers, and construct multi-container networks with Docker Compose.'
  },
  'Cloud Deployment': {
    name: 'Cloud Deployment',
    importance: 4,
    difficulty: 'Medium',
    estimatedTime: '35 Hours',
    prerequisites: 'Docker, Backend Development',
    industryDemand: 'High',
    priority: 'Medium',
    whyItMatters: 'Necessary to host servers, frontend applications, and datasets on production infrastructures like AWS, GCP, or Azure.',
    learningOutcome: 'Provision cloud instances (AWS EC2, S3), configure security groups, and deploy production containers.'
  },
  'CI/CD': {
    name: 'CI/CD Pipelines',
    importance: 4,
    difficulty: 'Medium',
    estimatedTime: '25 Hours',
    prerequisites: 'Git & GitHub, Cloud Deployment',
    industryDemand: 'Medium',
    priority: 'Low',
    whyItMatters: 'Automates testing, building, and deployment, reducing manual error rates during production releases.',
    learningOutcome: 'Configure GitHub Actions or Jenkins files to auto-test and auto-deploy upon commits.'
  },
  'Python': {
    name: 'Python',
    importance: 5,
    difficulty: 'Easy',
    estimatedTime: '30 Hours',
    prerequisites: 'None',
    industryDemand: 'Critical',
    priority: 'High',
    whyItMatters: 'The default language for data science, artificial intelligence, scientific computing, and machine learning.',
    learningOutcome: 'Write clean Python code utilizing variables, lists, dictionaries, list comprehensions, and functions.'
  },
  'SQL': {
    name: 'SQL',
    importance: 5,
    difficulty: 'Medium',
    estimatedTime: '25 Hours',
    prerequisites: 'None',
    industryDemand: 'Critical',
    priority: 'High',
    whyItMatters: 'Required to extract, manipulate, aggregate, and analyze data stored in relational databases.',
    learningOutcome: 'Write advanced queries including aggregations (Group By), subqueries, window functions, and views.'
  },
  'Data Analytics': {
    name: 'Data Analytics',
    importance: 5,
    difficulty: 'Medium',
    estimatedTime: '40 Hours',
    prerequisites: 'Python, SQL',
    industryDemand: 'Very High',
    priority: 'High',
    whyItMatters: 'Allows clean-up of raw text/tables to derive business-critical analytical conclusions.',
    learningOutcome: 'Filter and clean datasets using Pandas and NumPy, handle missing values, and calculate summary statistics.'
  },
  'Machine Learning': {
    name: 'Machine Learning',
    importance: 5,
    difficulty: 'Hard',
    estimatedTime: '65 Hours',
    prerequisites: 'Data Analytics, Statistics',
    industryDemand: 'Critical',
    priority: 'High',
    whyItMatters: 'Automates prediction models and pattern detection across user metrics, image classes, and text blocks.',
    learningOutcome: 'Develop, train, and test models using Scikit-Learn (Regression, Decision Trees, K-Means Clustering).'
  },
  'PyTorch/TensorFlow': {
    name: 'PyTorch/TensorFlow',
    importance: 4,
    difficulty: 'Hard',
    estimatedTime: '55 Hours',
    prerequisites: 'Machine Learning',
    industryDemand: 'High',
    priority: 'Medium',
    whyItMatters: 'Core deep learning frameworks for building complex neural networks (CNNs, RNNs, Transformers).',
    learningOutcome: 'Train custom Neural Networks, perform transfer learning, and handle Tensor matrices.'
  },
  'Data Visualization': {
    name: 'Data Visualization',
    importance: 4,
    difficulty: 'Easy',
    estimatedTime: '20 Hours',
    prerequisites: 'Data Analytics',
    industryDemand: 'High',
    priority: 'Medium',
    whyItMatters: 'Translates cold analytical figures into easily readable visual charts for stakeholders and executive summaries.',
    learningOutcome: 'Create professional graphs using Matplotlib, Seaborn, and configure enterprise tools like Tableau.'
  },
  'C': {
    name: 'C Programming',
    importance: 5,
    difficulty: 'Medium',
    estimatedTime: '40 Hours',
    prerequisites: 'None',
    industryDemand: 'High',
    priority: 'High',
    whyItMatters: 'The standard language for memory-efficient and hardware-level programming in microcontrollers.',
    learningOutcome: 'Understand pointers, memory management (malloc/free), structs, and bitwise manipulations.'
  },
  'C++': {
    name: 'C++ Programming',
    importance: 4,
    difficulty: 'Medium',
    estimatedTime: '45 Hours',
    prerequisites: 'C Programming',
    industryDemand: 'High',
    priority: 'High',
    whyItMatters: 'Introduces Object-Oriented paradigms to low-level programming, enabling complex system management.',
    learningOutcome: 'Master Classes, Inheritance, Polymorphism, and Standard Template Library (STL).'
  },
  'Embedded Systems': {
    name: 'Embedded Systems',
    importance: 5,
    difficulty: 'Hard',
    estimatedTime: '60 Hours',
    prerequisites: 'C Programming, Basic Electronics',
    industryDemand: 'Very High',
    priority: 'High',
    whyItMatters: 'Allows programming code that interacts directly with physical hardware and microcontrollers.',
    learningOutcome: 'Program GPIO ports, handle interrupts, read ADC values, and interface using protocols like I2C, SPI, and UART.'
  },
  'Verilog': {
    name: 'Verilog HDL',
    importance: 4,
    difficulty: 'Hard',
    estimatedTime: '50 Hours',
    prerequisites: 'Digital Electronics',
    industryDemand: 'Medium',
    priority: 'Medium',
    whyItMatters: 'Required to model and design digital circuits on silicon chips (FPGAs, ASICs).',
    learningOutcome: 'Write synthesizable RTL code, create testbenches, and simulate circuits in model simulators.'
  },
  'VLSI Design': {
    name: 'VLSI Design',
    importance: 4,
    difficulty: 'Hard',
    estimatedTime: '55 Hours',
    prerequisites: 'Verilog, Digital Electronics',
    industryDemand: 'Medium',
    priority: 'Medium',
    whyItMatters: 'Allows layout design and integration of millions of transistors onto a single silicon chip.',
    learningOutcome: 'Create schematic layouts, verify physical rules (DRC/LVS), and perform timing simulations.'
  },
  'RTOS': {
    name: 'Real-Time Operating Systems (RTOS)',
    importance: 5,
    difficulty: 'Hard',
    estimatedTime: '40 Hours',
    prerequisites: 'Embedded Systems, Operating Systems',
    industryDemand: 'High',
    priority: 'High',
    whyItMatters: 'Ensures application processes are completed within strict timing constraints, which is crucial for safety-critical hardware.',
    learningOutcome: 'Configure task priorities, manage Semaphores/Mutexes for resource allocation, and implement message queues.'
  },
  'Product Strategy': {
    name: 'Product Strategy',
    importance: 5,
    difficulty: 'Medium',
    estimatedTime: '40 Hours',
    prerequisites: 'None',
    industryDemand: 'Very High',
    priority: 'High',
    whyItMatters: 'Guides the vision and lifecycle of a product to achieve commercial success and solve user pain-points.',
    learningOutcome: 'Define target metrics (KPIs), construct roadmaps, outline market sizing, and create go-to-market strategies.'
  },
  'Agile': {
    name: 'Agile & Scrum Methodologies',
    importance: 4,
    difficulty: 'Easy',
    estimatedTime: '20 Hours',
    prerequisites: 'None',
    industryDemand: 'High',
    priority: 'High',
    whyItMatters: 'Standard framework in product management to manage backlogs, run sprints, and ship iterations incrementally.',
    learningOutcome: 'Manage boards in Jira, write clear User Stories, plan sprints, and run retro workshops.'
  },
  'User Research': {
    name: 'User Research',
    importance: 4,
    difficulty: 'Easy',
    estimatedTime: '30 Hours',
    prerequisites: 'None',
    industryDemand: 'High',
    priority: 'Medium',
    whyItMatters: 'Helps product managers deeply understand customer personas and iterate based on feedback, not assumptions.',
    learningOutcome: 'Conduct qualitative surveys, analyze data, outline user journeys, and construct actionable personas.'
  },
  'Communication': {
    name: 'Communication & Stakeholder Management',
    importance: 5,
    difficulty: 'Easy',
    estimatedTime: '15 Hours',
    prerequisites: 'None',
    industryDemand: 'Critical',
    priority: 'High',
    whyItMatters: 'A product manager must align engineers, designers, sales, and executives without formal authority.',
    learningOutcome: 'Draft PRDs, present product goals, facilitate agreements, and communicate technical concepts clearly.'
  },
  'Networking': {
    name: 'Computer Networks',
    importance: 5,
    difficulty: 'Medium',
    estimatedTime: '35 Hours',
    prerequisites: 'None',
    industryDemand: 'Critical',
    priority: 'High',
    whyItMatters: 'The base layer of IT systems. Required to understand packet flows, routing, firewalls, and ports.',
    learningOutcome: 'Trace packets, map TCP/IP layers, assign subnets, and configure DNS/HTTP configurations.'
  },
  'Linux': {
    name: 'Linux Administration',
    importance: 4,
    difficulty: 'Medium',
    estimatedTime: '30 Hours',
    prerequisites: 'None',
    industryDemand: 'Critical',
    priority: 'High',
    whyItMatters: 'Almost all security scripts, servers, and cloud environments operate on Linux platforms.',
    learningOutcome: 'Write Bash scripts, administer user permissions, navigate filesystems, and configure services.'
  },
  'Cryptography': {
    name: 'Cryptography',
    importance: 4,
    difficulty: 'Medium',
    estimatedTime: '25 Hours',
    prerequisites: 'Programming Basics',
    industryDemand: 'High',
    priority: 'Medium',
    whyItMatters: 'Protects data in transit and at rest through encryption keys and hashing protocols.',
    learningOutcome: 'Configure AES/RSA protocols, calculate SHA hashes, install SSL certificates, and understand key exchanges.'
  },
  'Pen Testing': {
    name: 'Penetration Testing',
    importance: 5,
    difficulty: 'Hard',
    estimatedTime: '60 Hours',
    prerequisites: 'Networking, Linux',
    industryDemand: 'Very High',
    priority: 'High',
    whyItMatters: 'Enables security engineers to proactively probe systems for weaknesses before hackers exploit them.',
    learningOutcome: 'Utilize tools like Metasploit, Nmap, and Hydra to audit networks, systems, and local databases.'
  },
  'Security Auditing': {
    name: 'Security Auditing',
    importance: 4,
    difficulty: 'Medium',
    estimatedTime: '30 Hours',
    prerequisites: 'Networking',
    industryDemand: 'High',
    priority: 'Medium',
    whyItMatters: 'Ensures enterprise infrastructure adheres to compliance laws (SOC2, ISO27001, GDPR) and logs audits.',
    learningOutcome: 'Conduct vulnerability scanning, compile audit logs, identify configuration errors, and author security reports.'
  },
  'OWASP Top 10': {
    name: 'OWASP Web Application Security',
    importance: 5,
    difficulty: 'Medium',
    estimatedTime: '25 Hours',
    prerequisites: 'Programming Basics',
    industryDemand: 'Critical',
    priority: 'High',
    whyItMatters: 'Web applications are exposed to universal attacks like SQL Injection and Cross-Site Scripting (XSS).',
    learningOutcome: 'Protect applications against SQLi, XSS, broken access controls, CSRF, and data exposures.'
  },
  'Projects': {
    name: 'Portfolio Projects Integration',
    importance: 5,
    difficulty: 'Medium',
    estimatedTime: '30 Hours',
    prerequisites: 'Core Skills',
    industryDemand: 'Critical',
    priority: 'High',
    whyItMatters: 'Concrete proof of capability. Recruiters check portfolios to gauge application skill levels.',
    learningOutcome: 'Complete and deploy functional systems with solid GitHub readme documents.'
  },
  'Mock Interviews': {
    name: 'Mock Interviews & Prep',
    importance: 5,
    difficulty: 'Medium',
    estimatedTime: '20 Hours',
    prerequisites: 'Core Skills',
    industryDemand: 'Critical',
    priority: 'High',
    whyItMatters: 'Prepares candidate to articulate thoughts, write code under pressure, and answer behavioral scenarios.',
    learningOutcome: 'Solve live coding tasks, answer structural technical questions, and clear behavioral loops.'
  },
  'Job Ready': {
    name: 'Placement & Job Ready',
    importance: 5,
    difficulty: 'Easy',
    estimatedTime: '10 Hours',
    prerequisites: 'All core skills',
    industryDemand: 'Critical',
    priority: 'High',
    whyItMatters: 'Preparing materials (Resume, LinkedIn, cover letter) to start sending applications to recruiters.',
    learningOutcome: 'Fully polished profile, ATS-optimized resume, active GitHub portfolio, ready to accept interview invites.'
  }
};

export const RESOURCES_DATA = {
  'HTML/CSS': [
    { title: 'Super Simple Dev CSS Playlist', type: 'YouTube', url: 'https://www.youtube.com/watch?v=G3e-cpL7ofc', rating: 4.8, duration: '6 hours', difficulty: 'Beginner', cost: 'Free' },
    { title: 'MDN Web Docs: HTML & CSS guide', type: 'Documentation', url: 'https://developer.mozilla.org/en-US/docs/Learn/HTML', rating: 4.9, duration: '12 hours', difficulty: 'Beginner', cost: 'Free' },
    { title: 'CSS Secrets by Lea Verou', type: 'Book', url: 'https://www.oreilly.com/library/view/css-secrets/9781491918173/', rating: 4.7, duration: '20 hours', difficulty: 'Intermediate', cost: 'Paid' },
    { title: 'Flexbox Froggy & CSS Grid Garden', type: 'Practice Website', url: 'https://flexboxfroggy.com', rating: 4.9, duration: '3 hours', difficulty: 'Beginner', cost: 'Free' }
  ],
  'JavaScript': [
    { title: 'Namaste JavaScript by Akshay Saini', type: 'YouTube', url: 'https://www.youtube.com/playlist?list=PLlasXeu85E9cQ32gLCgSeGzyVOTwUJHdK', rating: 4.9, duration: '15 hours', difficulty: 'Intermediate', cost: 'Free' },
    { title: 'JavaScript.info Complete Reference', type: 'Documentation', url: 'https://javascript.info', rating: 4.8, duration: '30 hours', difficulty: 'Beginner to Advanced', cost: 'Free' },
    { title: 'You Don\'t Know JS (Book Series)', type: 'Book', url: 'https://github.com/getify/You-Dont-Know-JS', rating: 4.9, duration: '40 hours', difficulty: 'Advanced', cost: 'Free' },
    { title: 'JavaScript 30 Day Coding Challenge', type: 'Free Course', url: 'https://javascript30.com/', rating: 4.8, duration: '30 hours', difficulty: 'Intermediate', cost: 'Free' }
  ],
  'React': [
    { title: 'React Official Documentation', type: 'Documentation', url: 'https://react.dev', rating: 4.9, duration: '20 hours', difficulty: 'Beginner', cost: 'Free' },
    { title: 'Epic React by Kent C. Dodds', type: 'Paid Course', url: 'https://epicreact.dev/', rating: 4.9, duration: '50 hours', difficulty: 'Intermediate to Advanced', cost: 'Paid' },
    { title: 'FreeCodeCamp React Course for Beginners', type: 'YouTube', url: 'https://www.youtube.com/watch?v=bMknfKXIFA8', rating: 4.7, duration: '11 hours', difficulty: 'Beginner', cost: 'Free' },
    { title: 'Frontend Masters: Complete Intro to React', type: 'Paid Course', url: 'https://frontendmasters.com/courses/complete-react-v8/', rating: 4.8, duration: '16 hours', difficulty: 'Beginner', cost: 'Paid' }
  ],
  'TypeScript': [
    { title: 'TypeScript Deep Dive Ebook', type: 'Documentation', url: 'https://basarat.gitbook.io/typescript', rating: 4.8, duration: '15 hours', difficulty: 'Intermediate', cost: 'Free' },
    { title: 'Total TypeScript by Matt Pocock', type: 'Paid Course', url: 'https://www.totaltypescript.com/', rating: 4.9, duration: '40 hours', difficulty: 'Advanced', cost: 'Paid' }
  ],
  'Node.js': [
    { title: 'Node.js Complete Guide by Academind', type: 'Paid Course', url: 'https://academind.com/courses/nodejs-the-complete-guide/', rating: 4.7, duration: '40 hours', difficulty: 'Beginner to Advanced', cost: 'Paid' },
    { title: 'Node.js Design Patterns (Book)', type: 'Book', url: 'https://www.nodejsdesignpatterns.com/', rating: 4.9, duration: '25 hours', difficulty: 'Advanced', cost: 'Paid' }
  ],
  'System Design': [
    { title: 'ByteByteGo System Design Course', type: 'Paid Course', url: 'https://bytebytego.com/', rating: 4.9, duration: '30 hours', difficulty: 'Advanced', cost: 'Paid' },
    { title: 'Grokking the System Design Interview', type: 'Paid Course', url: 'https://www.designgurus.io/course/grokking-the-system-design-interview', rating: 4.8, duration: '25 hours', difficulty: 'Advanced', cost: 'Paid' },
    { title: 'System Design Primer (GitHub)', type: 'GitHub Repository', url: 'https://github.com/donnemartin/system-design-primer', rating: 4.9, duration: '40 hours', difficulty: 'Intermediate to Advanced', cost: 'Free' }
  ],
  'Data Structures': [
    { title: 'Abdul Bari: DSA Course on Udemy', type: 'Paid Course', url: 'https://www.udemy.com/course/data-structures-algorithms-abdul-bari/', rating: 4.9, duration: '60 hours', difficulty: 'Beginner to Intermediate', cost: 'Paid' },
    { title: 'Leetcode Blind 75 list', type: 'Practice Website', url: 'https://leetcode.com/discuss/general-discussion/460599/blind-75-leetcode-questions/', rating: 4.9, duration: '80 hours', difficulty: 'Hard', cost: 'Free' },
    { title: 'Introduction to Algorithms (CLRS)', type: 'Book', url: 'https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/', rating: 4.7, duration: '120 hours', difficulty: 'Advanced', cost: 'Paid' }
  ],
  'Database': [
    { title: 'SQL Zoo Interactive SQL tutorial', type: 'Practice Website', url: 'https://sqlzoo.net', rating: 4.8, duration: '15 hours', difficulty: 'Beginner', cost: 'Free' },
    { title: 'Designing Data-Intensive Applications', type: 'Book', url: 'https://www.oreilly.com/library/view/designing-data-intensive-applications/9781491903063/', rating: 4.9, duration: '50 hours', difficulty: 'Advanced', cost: 'Paid' }
  ],
  'Docker': [
    { title: 'Docker Official Getting Started Guide', type: 'Documentation', url: 'https://docs.docker.com/get-started/', rating: 4.7, duration: '8 hours', difficulty: 'Beginner', cost: 'Free' },
    { title: 'Docker & Kubernetes Complete Course', type: 'Paid Course', url: 'https://www.udemy.com/course/docker-and-kubernetes-the-complete-guide/', rating: 4.8, duration: '35 hours', difficulty: 'Intermediate', cost: 'Paid' }
  ],
  'Cloud Deployment': [
    { title: 'AWS Certified Cloud Practitioner - freeCodeCamp', type: 'YouTube', url: 'https://www.youtube.com/watch?v=SOTamWGuqXs', rating: 4.8, duration: '14 hours', difficulty: 'Beginner', cost: 'Free' },
    { title: 'AWS Documentation / Quickstarts', type: 'Documentation', url: 'https://docs.aws.amazon.com/', rating: 4.6, duration: '20 hours', difficulty: 'Intermediate', cost: 'Free' }
  ],
  'Python': [
    { title: 'Python for Everybody Specialization', type: 'Free Course', url: 'https://www.coursera.org/specializations/python', rating: 4.8, duration: '35 hours', difficulty: 'Beginner', cost: 'Free' },
    { title: 'Corey Schafer Python Programming Channel', type: 'YouTube', url: 'https://www.youtube.com/user/schafer5', rating: 4.9, duration: '40 hours', difficulty: 'Beginner to Intermediate', cost: 'Free' }
  ],
  'Machine Learning': [
    { title: 'Machine Learning Specialization by Andrew Ng', type: 'Free Course', url: 'https://www.coursera.org/specializations/machine-learning-introduction', rating: 4.9, duration: '55 hours', difficulty: 'Beginner to Intermediate', cost: 'Free' },
    { title: 'Hands-On Machine Learning (Scikit-Learn/TensorFlow Book)', type: 'Book', url: 'https://www.oreilly.com/library/view/hands-on-machine-learning/9781492032632/', rating: 4.9, duration: '75 hours', difficulty: 'Intermediate to Advanced', cost: 'Paid' }
  ],
  'C': [
    { title: 'C Programming Full Course - freeCodeCamp', type: 'YouTube', url: 'https://www.youtube.com/watch?v=KJgsSFOSQv0', rating: 4.9, duration: '4 hours', difficulty: 'Beginner', cost: 'Free' }
  ],
  'C++': [
    { title: 'C++ Tutorial for Beginners - freeCodeCamp', type: 'YouTube', url: 'https://www.youtube.com/watch?v=vLnPwxZdW4Y', rating: 4.8, duration: '4 hours', difficulty: 'Beginner', cost: 'Free' },
    { title: 'Learn C++ Interactive Guide', type: 'Practice Website', url: 'https://www.learncpp.com/', rating: 4.9, duration: '30 hours', difficulty: 'Beginner to Advanced', cost: 'Free' }
  ],
  'Embedded Systems': [
    { title: 'Introduction to Embedded Systems - EdX', type: 'Free Course', url: 'https://www.edx.org/course/introduction-to-embedded-systems', rating: 4.7, duration: '25 hours', difficulty: 'Beginner', cost: 'Free' }
  ],
  'Verilog': [
    { title: 'ASIC World Verilog Tutorials', type: 'Practice Website', url: 'http://www.asic-world.com/verilog/veritut.html', rating: 4.7, duration: '12 hours', difficulty: 'Beginner', cost: 'Free' }
  ],
  'RTOS': [
    { title: 'FreeRTOS Official Hands-on Guide', type: 'Documentation', url: 'https://www.freertos.org/Documentation/RTOS_book.html', rating: 4.8, duration: '15 hours', difficulty: 'Intermediate', cost: 'Free' }
  ],
  'Product Strategy': [
    { title: 'Product Strategy Foundations', type: 'Paid Course', url: 'https://www.udemy.com/topic/product-strategy/', rating: 4.8, duration: '12 hours', difficulty: 'Intermediate', cost: 'Paid' }
  ],
  'Agile': [
    { title: 'Agile Crash Course - Udemy', type: 'Paid Course', url: 'https://www.udemy.com/course/agile-crash-course/', rating: 4.7, duration: '2 hours', difficulty: 'Beginner', cost: 'Paid' }
  ],
  'Networking': [
    { title: 'Computer Networking Course - freeCodeCamp', type: 'YouTube', url: 'https://www.youtube.com/watch?v=IPvYjXCsTg8', rating: 4.8, duration: '9 hours', difficulty: 'Beginner', cost: 'Free' }
  ],
  'Cryptography': [
    { title: 'Cryptography I by Stanford - Coursera', type: 'Free Course', url: 'https://www.coursera.org/learn/crypto', rating: 4.9, duration: '22 hours', difficulty: 'Intermediate', cost: 'Free' }
  ],
  'Pen Testing': [
    { title: 'Practical Ethical Hacking - TCM Academy', type: 'Paid Course', url: 'https://tcm-sec.com/practical-ethical-hacking/', rating: 4.9, duration: '25 hours', difficulty: 'Beginner to Intermediate', cost: 'Paid' }
  ]
};

// Fallback resources for any skill that doesn't have custom ones
export const getResourcesForSkill = (skillName) => {
  const generic = [
    { title: `${skillName} Official Documentation`, type: 'Documentation', url: 'https://docs.google.com', rating: 4.7, duration: '10 hours', difficulty: 'Beginner', cost: 'Free' },
    { title: `FreeCodeCamp ${skillName} Full Tutorial`, type: 'YouTube', url: 'https://youtube.com', rating: 4.8, duration: '8 hours', difficulty: 'Beginner', cost: 'Free' },
    { title: `Learn ${skillName} Interactive Roadmap`, type: 'Practice Website', url: 'https://roadmap.sh', rating: 4.8, duration: '12 hours', difficulty: 'Intermediate', cost: 'Free' }
  ];
  return RESOURCES_DATA[skillName] || generic;
};

export const PHASED_ROADMAPS = {
  'Frontend Developer': [
    {
      phase: 'Phase 1: Foundations',
      duration: '2 Weeks',
      topics: ['Internet Protocols', 'HTML5 Semantic Elements', 'CSS3 Layouts (Flexbox & Grid)', 'Responsive Design & Media Queries'],
      resources: ['Super Simple Dev CSS Playlist', 'Flexbox Froggy'],
      practice: 'Build 3 responsive layouts from structural mockups without copying code.',
      milestone: 'Design and deploy a responsive personal portfolio site.',
      quiz: 'HTML5 & CSS3 Core Layout quiz (15 questions)'
    },
    {
      phase: 'Phase 2: Core Skills',
      duration: '3 Weeks',
      topics: ['JavaScript ES6+', 'Asynchronous programming (Promises, async/await)', 'DOM Manipulation', 'Event loops'],
      resources: ['Namaste JavaScript', 'JavaScript.info'],
      practice: 'Implement search filter list, stopwatch timer, and custom calculator.',
      milestone: 'Create a dynamic browser Dashboard matching weather APIs.',
      quiz: 'Asynchronous JavaScript & Closures check'
    },
    {
      phase: 'Phase 3: Intermediate',
      duration: '3 Weeks',
      topics: ['React Component Architecture', 'React hooks (useState, useEffect, useMemo)', 'Context API', 'State management (Zustand/Redux)'],
      resources: ['React Official Docs', 'FreeCodeCamp React Course'],
      practice: 'Develop custom hooks (useFetch, useLocalStorage) and mock REST hooks.',
      milestone: 'Complete a full-scale Tasks Manager with complex filters and states.',
      quiz: 'React Lifecycle & Render Cycles exam'
    },
    {
      phase: 'Phase 4: Advanced',
      duration: '4 Weeks',
      topics: ['TypeScript Integration', 'Testing with Jest/React Testing Library', 'Webpack/Vite tooling', 'CI/CD pipeline & Deployment (Vercel/AWS)'],
      resources: ['Total TypeScript', 'Epic React'],
      practice: 'Migrate a standard JavaScript project into a strictly typed TypeScript application.',
      milestone: 'Deploy an optimized production portfolio landing page, score 95+ on Lighthouse.',
      quiz: 'TypeScript Generics & Testing check'
    }
  ],
  'Backend Developer': [
    {
      phase: 'Phase 1: Foundations',
      duration: '2 Weeks',
      topics: ['Programming Basics', 'Basic Algorithms (Sorting, Search)', 'Time Complexity (Big O)', 'Command Line Interface & Git'],
      resources: ['Abdul Bari DSA Course', 'Git & GitHub primer'],
      practice: 'Solve 15 basic algorithms on sorting, binary search, and string manipulations.',
      milestone: 'Establish a GitHub repository and write automated scripts in bash.',
      quiz: 'Computational Complexity & Git CLI exam'
    },
    {
      phase: 'Phase 2: Core Skills',
      duration: '3 Weeks',
      topics: ['Databases (Schema Design, SQL vs NoSQL)', 'SQL Queries (Joins, Indexing, Transactions)', 'Relational database configurations'],
      resources: ['SQL Zoo', 'Designing Data-Intensive Applications'],
      practice: 'Write query structures, perform indices, and solve SQL problems on aggregation.',
      milestone: 'Design a normalized database schema representing an e-commerce platform.',
      quiz: 'SQL Joins & Transaction controls checklist'
    },
    {
      phase: 'Phase 3: Intermediate',
      duration: '3 Weeks',
      topics: ['Node.js/Express framework', 'Server creation', 'RESTful API protocols', 'Authentication & JWT integrations'],
      resources: ['Node.js Design Patterns', 'REST API guide'],
      practice: 'Build routing tables, authentication endpoints, and middleware layers.',
      milestone: 'Create a secured REST API with token authorization and unit tests.',
      quiz: 'HTTP Protocols, JWT & REST Security rules'
    },
    {
      phase: 'Phase 4: Advanced',
      duration: '4 Weeks',
      topics: ['Docker containerization', 'Container orchestration & networks', 'CI/CD with GitHub Actions', 'AWS Deployments (EC2, S3)'],
      resources: ['Docker official guide', 'AWS Practitioner video'],
      practice: 'Write Dockerfiles and deploy multi-containers via compose onto remote EC2 servers.',
      milestone: 'Deploy a containerized API running in cluster mode with CI/CD.',
      quiz: 'Docker Compose, Caching, and AWS security policies'
    }
  ]
};

// Fallback generator for other roles
export const getPhasedRoadmap = (roleName) => {
  if (PHASED_ROADMAPS[roleName]) return PHASED_ROADMAPS[roleName];
  const sequence = TARGET_ROLES[roleName]?.sequence || ['Programming Basics', 'Projects', 'Mock Interviews', 'Job Ready'];
  return [
    {
      phase: 'Phase 1: Foundations',
      duration: '2 Weeks',
      topics: [`Understand the fundamentals of ${sequence[0] || 'your core topic'}`, 'Variables, control flows, loops', 'Simple problem solving patterns'],
      resources: [`Official guide for ${sequence[0]}`],
      practice: 'Basic exercises and environment configuration.',
      milestone: 'Environment successfully set up and hello world running.',
      quiz: 'Fundamental syntax check'
    },
    {
      phase: 'Phase 2: Core Skills',
      duration: '3 Weeks',
      topics: [`Deep dive into ${sequence[1] || 'Core concepts'}`, `Master ${sequence[2] || 'Sub-modules'}`, 'Practical usage configurations'],
      resources: [`Advanced courses on ${sequence[1]}`],
      practice: 'Medium-level challenges and algorithms.',
      milestone: 'Creation of basic scripts representing core functionalities.',
      quiz: 'Core competency testing'
    },
    {
      phase: 'Phase 3: Intermediate',
      duration: '3 Weeks',
      topics: [`Learn ${sequence[3] || 'Frameworks'} and ${sequence[4] || 'Design patterns'}`, 'Real-world integrations', 'Database connectivity'],
      resources: ['Project tutorials and developer blogs'],
      practice: 'Create functional programs and tie subsystems together.',
      milestone: 'Build an intermediate project with data storage capabilities.',
      quiz: 'Integration & architecture exam'
    },
    {
      phase: 'Phase 4: Advanced',
      duration: '4 Weeks',
      topics: [`Advanced optimization of ${sequence[5] || 'Systems'}`, 'Cloud hosting, debugging, logs', 'Interview prep & profile styling'],
      resources: ['Mock interview checklists', 'Production codebases'],
      practice: 'Audit applications for efficiency, speed, and safety rules.',
      milestone: 'Complete a full portfolio ready to present to recruiting managers.',
      quiz: 'Production-ready code architecture test'
    }
  ];
};

export const PROJECT_RECOMMENDATIONS = {
  'Frontend Developer': [
    {
      type: 'Mini Project',
      title: 'Responsive Dashboard UI',
      difficulty: 'Easy',
      technologies: ['HTML5', 'CSS Grid', 'JavaScript'],
      problemStatement: 'Build a dashboard UI that dynamically adapts to mobile, tablet, and widescreen layouts without horizontal scrollbars, showing mock statistics charts.',
      skillsLearned: ['Semantic HTML', 'CSS Flexbox/Grid', 'Responsive media queries', 'DOM interactions'],
      githubStructure: `dashboard-ui/\n├── index.html\n├── styles.css\n├── app.js\n└── assets/\n    └── logo.png`,
      resumeImpact: 'Demonstrates basic pixel-perfect layout implementation and responsive styling abilities.'
    },
    {
      type: 'Intermediate Project',
      title: 'Real-time Chat Portal',
      difficulty: 'Medium',
      technologies: ['React.js', 'WebSockets', 'TailwindCSS'],
      problemStatement: 'Create a localized multi-room chat client that displays online users, logs timestamped messages, and loads chat rooms instantly.',
      skillsLearned: ['React Hooks', 'Context API', 'WebSocket events', 'Tailwind flex structures'],
      githubStructure: `react-chat/\n├── package.json\n├── public/\n└── src/\n    ├── components/\n    ├── hooks/\n    ├── App.jsx\n    └── main.jsx`,
      resumeImpact: 'Highlights capacity to handle real-time reactive rendering and complex component state sync.'
    },
    {
      type: 'Major Project',
      title: 'E-Commerce Frontend with Checkout',
      difficulty: 'Medium',
      technologies: ['React.js', 'Redux Toolkit', 'Stripe SDK', 'Vite'],
      problemStatement: 'Construct a complete product store displaying paginated item filters, persistent cart counts, checkout pipelines, and transaction validation.',
      skillsLearned: ['Global State (Redux)', 'Stripe Payment APIs', 'Route Protection', 'Debouncing queries'],
      githubStructure: `storefront/\n├── vite.config.js\n├── src/\n    ├── store/\n    ├── pages/\n    └── components/`,
      resumeImpact: 'Validates understanding of global state architectures, checkout flows, and payment API integrations.'
    },
    {
      type: 'Industry-Level Project',
      title: 'SaaS Analytics Dashboard',
      difficulty: 'Hard',
      technologies: ['React.js', 'TypeScript', 'Recharts', 'Jest'],
      problemStatement: 'Develop an enterprise-ready workspace analytics portal highlighting live charts, user role permission rules, multi-tenant views, and automated tests.',
      skillsLearned: ['TypeScript Generics', 'Unit/Integration testing', 'Data aggregation', 'Lazy loading routes'],
      githubStructure: `saas-analytics/\n├── tsconfig.json\n├── src/\n│   ├── __tests__/\n│   ├── types/\n│   └── components/\n└── package.json`,
      resumeImpact: 'Showcases production-grade engineering: typing structures, deep validation testing, and high-performance charting.'
    }
  ],
  'Backend Developer': [
    {
      type: 'Mini Project',
      title: 'CLI File Metadata Analyzer',
      difficulty: 'Easy',
      technologies: ['Node.js', 'FS Module', 'Path Utility'],
      problemStatement: 'Build a command-line script that crawls a folder, parses configuration files, extracts size details, and prints a file-type breakdown chart to standard out.',
      skillsLearned: ['Node.js CLI', 'File Systems (FS)', 'Asynchronous directories', 'Shell script args'],
      githubStructure: `cli-analyzer/\n├── index.js\n├── package.json\n└── README.md`,
      resumeImpact: 'Highlights familiarity with operating systems, command line scripting, and native runtime utilities.'
    },
    {
      type: 'Intermediate Project',
      title: 'Task Manager REST API',
      difficulty: 'Medium',
      technologies: ['Node.js', 'Express', 'MongoDB/Mongoose', 'JWT'],
      problemStatement: 'Construct a secure API supporting user registration, salted passwords, and CRUD task records linked to authenticated accounts.',
      skillsLearned: ['JSON Web Tokens (JWT)', 'Bcrypt salting', 'Mongoose schema validation', 'CORS rules'],
      githubStructure: `task-api/\n├── server.js\n├── config/\n├── models/\n└── routes/`,
      resumeImpact: 'Proves understanding of basic API security standards, relational/NoSQL setups, and secure session management.'
    },
    {
      type: 'Major Project',
      title: 'Distributed Log Aggregator',
      difficulty: 'Hard',
      technologies: ['Node.js', 'Redis', 'WebSockets', 'PostgreSQL'],
      problemStatement: 'Design a microservice backend that digests application logs in real-time, caches active logs in Redis, and pushes notifications to a web portal.',
      skillsLearned: ['Redis Pub/Sub caching', 'Database indexing', 'Message brokers', 'WebSockets scaling'],
      githubStructure: `log-aggregator/\n├── services/\n│   ├── receiver/\n│   └── broadcaster/\n├── docker-compose.yml\n└── package.json`,
      resumeImpact: 'Demonstrates capacity to handle data streams, configure message brokers, and manage asynchronous task queues.'
    },
    {
      type: 'Industry-Level Project',
      title: 'Automated CI/CD Test Server',
      difficulty: 'Hard',
      technologies: ['Express', 'Docker', 'AWS S3', 'PostgreSQL', 'Redis'],
      problemStatement: 'Develop a clone of Vercel\'s upload/build engine. When a GitHub URL is submitted, spin up a secure Docker container, compile files, upload builds to S3, and serve them.',
      skillsLearned: ['Docker SDK', 'S3 storage buckets', 'Isolated execution sandboxes', 'Task worker pools'],
      githubStructure: `cicd-runner/\n├── api-server/\n├── builder-container/\n└── docker-compose.yml`,
      resumeImpact: 'An outstanding engineering showcase showing systems design, virtualization, cloud orchestrations, and secure computing.'
    }
  ]
};

// Fallback project recommendations for other roles
export const getProjectsForRole = (roleName) => {
  if (PROJECT_RECOMMENDATIONS[roleName]) return PROJECT_RECOMMENDATIONS[roleName];
  return [
    {
      type: 'Mini Project',
      title: `Basic ${roleName} Script`,
      difficulty: 'Easy',
      technologies: ['Python', 'SQL'],
      problemStatement: `Develop a modular system that handles basic data pipelines or scripts representing core tasks in ${roleName}.`,
      skillsLearned: ['Script automation', 'Logic structures'],
      githubStructure: `mini-proj/\n├── script.py\n└── README.md`,
      resumeImpact: 'Proves basic coding familiarity and logical implementation.'
    },
    {
      type: 'Intermediate Project',
      title: `Integrated ${roleName} Application`,
      difficulty: 'Medium',
      technologies: ['Python', 'Docker'],
      problemStatement: `Create an application integrating basic UI/inputs, database schemas, and modular components to solve a specific industry problem.`,
      skillsLearned: ['Modular design', 'Database models'],
      githubStructure: `int-proj/\n├── app.py\n├── config.json\n└── database/`,
      resumeImpact: 'Demonstrates capabilities in multi-layer code integrations.'
    },
    {
      type: 'Major Project',
      title: `Full-Scale ${roleName} Workspace`,
      difficulty: 'Medium',
      technologies: ['Python', 'Cloud Services', 'REST APIs'],
      problemStatement: `Assemble a full-featured system running on production resources, handling authentication, caching, data analytics, and responsive output views.`,
      skillsLearned: ['Cloud hosting', 'System pipelines', 'APIs'],
      githubStructure: `major-proj/\n├── api/\n├── processor/\n└── client/`,
      resumeImpact: 'Validates ability to build complex, production-ready systems from scratch.'
    },
    {
      type: 'Industry-Level Project',
      title: `Distributed ${roleName} Engine`,
      difficulty: 'Hard',
      technologies: ['Advanced Systems', 'Docker', 'CI/CD Pipelines'],
      problemStatement: `Create an enterprise-grade platform scaling across instances, highlighting high availability, thorough testing suites, and performance telemetry logs.`,
      skillsLearned: ['Performance tuning', 'System architecture', 'Scalability designs'],
      githubStructure: `industry-proj/\n├── services/\n├── tests/\n└── deploy/`,
      resumeImpact: 'Illustrates elite mastery of systems engineering, cloud networking, and robust coding principles.'
    }
  ];
};

export const CODING_PRACTICE_SCHEDULES = {
  'Software Engineer Track': [
    {
      week: 'Week 1',
      topic: 'Arrays & Hashing',
      targetProblems: 30,
      platforms: ['LeetCode', 'GeeksforGeeks'],
      problems: [
        { name: 'Two Sum', difficulty: 'Easy', link: 'https://leetcode.com/problems/two-sum/' },
        { name: 'Contains Duplicate', difficulty: 'Easy', link: 'https://leetcode.com/problems/contains-duplicate/' },
        { name: 'Valid Anagram', difficulty: 'Easy', link: 'https://leetcode.com/problems/valid-anagram/' },
        { name: 'Group Anagrams', difficulty: 'Medium', link: 'https://leetcode.com/problems/group-anagrams/' },
        { name: 'Top K Frequent Elements', difficulty: 'Medium', link: 'https://leetcode.com/problems/top-k-frequent-elements/' }
      ]
    },
    {
      week: 'Week 2',
      topic: 'Two Pointers & Sliding Window',
      targetProblems: 25,
      platforms: ['LeetCode', 'HackerRank'],
      problems: [
        { name: 'Valid Palindrome', difficulty: 'Easy', link: 'https://leetcode.com/problems/valid-palindrome/' },
        { name: 'Two Sum II - Input Array Is Sorted', difficulty: 'Medium', link: 'https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/' },
        { name: 'Container With Most Water', difficulty: 'Medium', link: 'https://leetcode.com/problems/container-with-most-water/' },
        { name: 'Best Time to Buy and Sell Stock', difficulty: 'Easy', link: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/' },
        { name: 'Longest Substring Without Repeating Characters', difficulty: 'Medium', link: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/' }
      ]
    },
    {
      week: 'Week 3',
      topic: 'Linked Lists & Stacks',
      targetProblems: 20,
      platforms: ['LeetCode', 'GeeksforGeeks'],
      problems: [
        { name: 'Reverse Linked List', difficulty: 'Easy', link: 'https://leetcode.com/problems/reverse-linked-list/' },
        { name: 'Merge Two Sorted Lists', difficulty: 'Easy', link: 'https://leetcode.com/problems/merge-two-sorted-lists/' },
        { name: 'Linked List Cycle', difficulty: 'Easy', link: 'https://leetcode.com/problems/linked-list-cycle/' },
        { name: 'Valid Parentheses', difficulty: 'Easy', link: 'https://leetcode.com/problems/valid-parentheses/' },
        { name: 'Evaluate Reverse Polish Notation', difficulty: 'Medium', link: 'https://leetcode.com/problems/evaluate-reverse-polish-notation/' }
      ]
    },
    {
      week: 'Week 4',
      topic: 'Trees & Graphs',
      targetProblems: 20,
      platforms: ['LeetCode'],
      problems: [
        { name: 'Invert Binary Tree', difficulty: 'Easy', link: 'https://leetcode.com/problems/invert-binary-tree/' },
        { name: 'Maximum Depth of Binary Tree', difficulty: 'Easy', link: 'https://leetcode.com/problems/maximum-depth-of-binary-tree/' },
        { name: 'Same Tree', difficulty: 'Easy', link: 'https://leetcode.com/problems/same-tree/' },
        { name: 'Binary Tree Level Order Traversal', difficulty: 'Medium', link: 'https://leetcode.com/problems/binary-tree-level-order-traversal/' },
        { name: 'Number of Islands', difficulty: 'Medium', link: 'https://leetcode.com/problems/number-of-islands/' }
      ]
    },
    {
      week: 'Week 5',
      topic: 'Recursion & Backtracking',
      targetProblems: 15,
      platforms: ['LeetCode', 'CodeChef'],
      problems: [
        { name: 'Subsets', difficulty: 'Medium', link: 'https://leetcode.com/problems/subsets/' },
        { name: 'Combination Sum', difficulty: 'Medium', link: 'https://leetcode.com/problems/combination-sum/' },
        { name: 'Permutations', difficulty: 'Medium', link: 'https://leetcode.com/problems/permutations/' },
        { name: 'Word Search', difficulty: 'Medium', link: 'https://leetcode.com/problems/word-search/' }
      ]
    },
    {
      week: 'Week 6',
      topic: 'Dynamic Programming',
      targetProblems: 15,
      platforms: ['LeetCode', 'GeeksforGeeks'],
      problems: [
        { name: 'Climbing Stairs', difficulty: 'Easy', link: 'https://leetcode.com/problems/climbing-stairs/' },
        { name: 'Min Cost Climbing Stairs', difficulty: 'Easy', link: 'https://leetcode.com/problems/min-cost-climbing-stairs/' },
        { name: 'House Robber', difficulty: 'Medium', link: 'https://leetcode.com/problems/house-robber/' },
        { name: 'Longest Increasing Subsequence', difficulty: 'Medium', link: 'https://leetcode.com/problems/longest-increasing-subsequence/' }
      ]
    }
  ],
  'Data Science Track': [
    {
      week: 'Week 1',
      topic: 'Python Basics & Pandas DataFrames',
      targetProblems: 10,
      platforms: ['Jupyter', 'LeetCode'],
      problems: [
        { name: 'Sort Colors (Custom list sort)', difficulty: 'Medium', link: 'https://leetcode.com/problems/sort-colors/' },
        { name: 'Merge Sorted Array (Data prep)', difficulty: 'Easy', link: 'https://leetcode.com/problems/merge-sorted-array/' }
      ]
    },
    {
      week: 'Week 2',
      topic: 'SQL Data Extraction & Aggregations',
      targetProblems: 15,
      platforms: ['LeetCode SQL', 'HackerRank'],
      problems: [
        { name: 'Big Countries', difficulty: 'Easy', link: 'https://leetcode.com/problems/big-countries/' },
        { name: 'Combine Two Tables', difficulty: 'Easy', link: 'https://leetcode.com/problems/combine-two-tables/' },
        { name: 'Duplicate Emails', difficulty: 'Easy', link: 'https://leetcode.com/problems/duplicate-emails/' }
      ]
    },
    {
      week: 'Week 3',
      topic: 'Probability & Statistical Foundations',
      targetProblems: 8,
      platforms: ['Kaggle', 'Khan Academy'],
      problems: [
        { name: 'Hypothesis Testing Basics (Z-Test / T-Test)', difficulty: 'Easy', link: 'https://www.kaggle.com/learn/intro-to-machine-learning' },
        { name: 'Central Limit Theorem Simulation', difficulty: 'Medium', link: 'https://www.kaggle.com/learn/intro-to-machine-learning' }
      ]
    },
    {
      week: 'Week 4',
      topic: 'Supervised Machine Learning (Scikit-Learn)',
      targetProblems: 10,
      platforms: ['Kaggle', 'LeetCode Machine Learning'],
      problems: [
        { name: 'Linear Regression model parameters estimation', difficulty: 'Easy', link: 'https://scikit-learn.org/' },
        { name: 'Decision Trees Classification evaluation', difficulty: 'Medium', link: 'https://scikit-learn.org/' }
      ]
    }
  ],
  'Product Manager Track': [
    {
      week: 'Week 1',
      topic: 'Product Strategy & Market Sizing',
      targetProblems: 5,
      platforms: ['StellarPeers', 'ProductManagementExercises'],
      problems: [
        { name: 'Estimate the annual market size of electric scooters in Paris', difficulty: 'Medium', link: 'https://stellarpeers.com/' },
        { name: 'Design an elevator for blind people', difficulty: 'Hard', link: 'https://stellarpeers.com/' }
      ]
    },
    {
      week: 'Week 2',
      topic: 'Metrics, Goals & A/B Testing',
      targetProblems: 6,
      platforms: ['Product Management Exercises'],
      problems: [
        { name: 'Define key KPIs for Instagram Stories success', difficulty: 'Medium', link: 'https://www.productmanagementexercises.com/' },
        { name: 'Design an A/B test for Uber\'s pick-up notification screen', difficulty: 'Hard', link: 'https://www.productmanagementexercises.com/' }
      ]
    }
  ],
  'Cybersecurity Track': [
    {
      week: 'Week 1',
      topic: 'Networking & Packet Inspection',
      targetProblems: 10,
      platforms: ['Wireshark Labs', 'TryHackMe'],
      problems: [
        { name: 'Capture and inspect TCP 3-way handshake packets', difficulty: 'Easy', link: 'https://tryhackme.com/' },
        { name: 'Identify DNS spoofing attempts in server logs', difficulty: 'Medium', link: 'https://tryhackme.com/' }
      ]
    },
    {
      week: 'Week 2',
      topic: 'OWASP Top 10 Web Exploits',
      targetProblems: 12,
      platforms: ['PortSwigger Web Security Academy'],
      problems: [
        { name: 'Perform SQL Injection to bypass authentication', difficulty: 'Easy', link: 'https://portswigger.net/' },
        { name: 'Exploit Cross-Site Scripting (XSS) to steal session tokens', difficulty: 'Medium', link: 'https://portswigger.net/' }
      ]
    }
  ],
  'Embedded Systems Track': [
    {
      week: 'Week 1',
      topic: 'C Memory Pointers & Structs',
      targetProblems: 15,
      platforms: ['LeetCode', 'Exercism'],
      problems: [
        { name: 'Single Number (Bit manipulation)', difficulty: 'Easy', link: 'https://leetcode.com/problems/single-number/' },
        { name: 'Reverse Bits', difficulty: 'Easy', link: 'https://leetcode.com/problems/reverse-bits/' }
      ]
    },
    {
      week: 'Week 2',
      topic: 'Microcontrollers & RTOS Scheduling',
      targetProblems: 8,
      platforms: ['Wokwi Simulator', 'FreeRTOS'],
      problems: [
        { name: 'Implement task context switching on timer interrupts', difficulty: 'Hard', link: 'https://www.freertos.org/' },
        { name: 'Resolve a priority inversion scenario using mutexes', difficulty: 'Medium', link: 'https://www.freertos.org/' }
      ]
    }
  ]
};

export const INTERVIEW_PREP_DATA = {
  'Technical': {
    'Frontend Developer': [
      { q: 'Explain the Virtual DOM and how React\'s reconciliation algorithm works.', type: 'React' },
      { q: 'What is event delegation in JavaScript? How does event bubbling work?', type: 'JavaScript' },
      { q: 'What are the main differences between interface and type in TypeScript?', type: 'TypeScript' },
      { q: 'Explain CORS and how you would troubleshoot a CORS error in a React application.', type: 'Security' },
      { q: 'How does useMemo differ from useCallback? Give concrete scenarios for each.', type: 'React Hooks' }
    ],
    'Backend Developer': [
      { q: 'What is database indexing and how does it speed up queries? What are its costs?', type: 'Databases' },
      { q: 'Describe the differences between JWT-based authentication and Session-based authentication.', type: 'Security' },
      { q: 'What is a REST API? Explain the idempotency of GET, POST, PUT, and DELETE methods.', type: 'REST APIs' },
      { q: 'How does Docker handle storage and networking? Explain volumes and bridges.', type: 'Docker' },
      { q: 'Explain N+1 query problem and how to resolve it in Mongoose/SQL.', type: 'Databases' }
    ],
    'Data Scientist': [
      { q: 'What is the trade-off between Bias and Variance? How does it relate to overfitting?', type: 'Machine Learning' },
      { q: 'Explain the working mechanism of Random Forest. How does bagging reduce variance?', type: 'Algorithms' },
      { q: 'What are the assumptions of Linear Regression? What happens if they are violated?', type: 'Statistics' },
      { q: 'Describe the backpropagation algorithm in neural networks.', type: 'Deep Learning' }
    ],
    'Embedded Systems Engineer': [
      { q: 'Explain the volatile keyword in C. When should it be used?', type: 'C Programming' },
      { q: 'How does an Interrupt Service Routine (ISR) differ from a regular function? Can you pass arguments to it?', type: 'Firmware' },
      { q: 'What is priority inversion in RTOS, and how does priority inheritance resolve it?', type: 'RTOS' },
      { q: 'Explain the difference between SPI and I2C protocols in terms of wires, speed, and communication flow.', type: 'Protocols' }
    ],
    'Product Manager': [
      { q: 'How would you measure the success of Spotify\'s "Discover Weekly" playlist feature?', type: 'Product Metrics' },
      { q: 'We want to launch Facebook Dating. Walk me through your product design and launch strategy.', type: 'Product Design' },
      { q: 'How do you prioritize features in a product backlog when there are conflicting engineering constraints?', type: 'Agile Priority' },
      { q: 'Talk about a time a product launch failed or missed expectations. How did you react?', type: 'Case Study' }
    ],
    'Cybersecurity Specialist': [
      { q: 'Explain the difference between symmetric and asymmetric encryption. Give examples of each.', type: 'Cryptography' },
      { q: 'What is a SQL Injection vulnerability, and how can it be mitigated at the application level?', type: 'OWASP Top 10' },
      { q: 'Describe the steps you would take to investigate a potential data exfiltration alert on a server.', type: 'Incident Response' },
      { q: 'How does a stateless firewall differ from a stateful firewall?', type: 'Networking' }
    ]
  },
  'HR': [
    { q: 'Tell me about yourself and why you are interested in this position.', type: 'Intro' },
    { q: 'Describe a time you had a conflict with a team member. How did you resolve it?', type: 'Conflict Resolution' },
    { q: 'What is your greatest weakness and how are you actively working to improve it?', type: 'Self Improvement' },
    { q: 'Where do you see yourself in 5 years? What are your career development goals?', type: 'Future Ambitions' }
  ],
  'Behavioral': [
    { q: 'Tell me about a time you had to learn a complex technology quickly to build a project. (STAR method)', type: 'Adaptability' },
    { q: 'Describe a project failure. What did you learn and how did it influence your next steps?', type: 'Resilience' },
    { q: 'Give an example of a time you had to lead a project under tight deadlines. How did you organize the work?', type: 'Leadership' }
  ],
  'Checklist': [
    'ATS-optimized single-page PDF resume ready',
    'GitHub pinned repositories display clean READMEs & demo links',
    'Solved 75+ core DSA coding problems on Leetcode/HackerRank',
    'Constructed at least 1 complex deployed portfolio project',
    'LinkedIn profile updated with clear titles, skills, and summary',
    'Self-recorded mock technical presentation clears verbal stuttering',
    'Formulated STAR answers for major behavioral questions'
  ]
};

export const WEEKLY_STUDY_PLAN = {
  Monday: { title: 'Core Topic Deep Dive', detail: 'Learn new core theory: watch videos, read docs, code small setups.' },
  Tuesday: { title: 'DSA Coding & Notes', detail: 'Solve 3-5 LeetCode problems related to the weekly coding track.' },
  Wednesday: { title: 'Mini Project Coding', detail: 'Write code for the current phase project, push commits to GitHub.' },
  Thursday: { title: 'Active Revision & Refactoring', detail: 'Review concepts from Mon-Tue. Write summary notes, clean project code.' },
  Friday: { title: 'Timed Coding Contest', detail: 'Participate in a weekly mock test or solve problems under strict time limit.' },
  Saturday: { title: 'Mock Interview Prep', detail: 'Go through standard technical/HR interview lists, record self answers.' },
  Sunday: { title: 'Weekly Assessment', detail: 'Validate project deployment milestones, clean workspace, plan next week.' }
};
