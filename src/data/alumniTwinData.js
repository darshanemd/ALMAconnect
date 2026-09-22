// Comprehensive Alumni Twin Intelligence Data for Skill Gap Detector with Multi-Senior Twin Support

export const FEATURED_CAREER_ROLES = [
  {
    id: 'data-analyst',
    title: 'Data Analyst',
    subtitle: 'BI & SQL Analytics',
    icon: 'Database',
    category: 'Analytics'
  },
  {
    id: 'software-engineer',
    title: 'Software Engineer',
    subtitle: 'Core DSA & Full-Stack',
    icon: 'Code2',
    category: 'Software Engineering'
  },
  {
    id: 'cloud-backend',
    title: 'Cloud Backend Engineer',
    subtitle: 'APIs & Microservices',
    icon: 'Cloud',
    category: 'Backend & Cloud'
  },
  {
    id: 'ai-ml-engineer',
    title: 'AI / ML Engineer',
    subtitle: 'PyTorch & GenAI',
    icon: 'BrainCircuit',
    category: 'AI & Data Science'
  },
  {
    id: 'full-stack',
    title: 'Full Stack Developer',
    subtitle: 'React & Backend',
    icon: 'Layout',
    category: 'Web Development'
  },
  {
    id: 'devops-engineer',
    title: 'DevOps Engineer',
    subtitle: 'Docker & CI/CD',
    icon: 'Terminal',
    category: 'DevOps & Infra'
  }
];

export const ALL_CAREER_ROLES = [
  'Cloud Backend Engineer',
  'Software Engineer',
  'Full Stack Developer',
  'AI / ML Engineer',
  'Data Analyst',
  'DevOps Engineer',
  'Data Scientist',
  'Android Developer',
  'Cybersecurity Engineer',
  'Embedded Engineer',
  'UI UX Designer',
  'Product Manager',
  'Blockchain Developer',
  'Game Developer'
];

export const ALL_CAREER_ROLES_METADATA = [
  { title: 'Cloud Backend Engineer', category: 'Backend & Cloud', icon: 'Cloud', desc: 'APIs, Distributed Systems & Microservices' },
  { title: 'Software Engineer', category: 'Software Engineering', icon: 'Code2', desc: 'Core DSA, System Design & Full-Stack' },
  { title: 'Full Stack Developer', category: 'Web Development', icon: 'Layout', desc: 'React, Node.js & Database Architecture' },
  { title: 'AI / ML Engineer', category: 'AI & Data Science', icon: 'BrainCircuit', desc: 'Deep Learning, PyTorch & LLM Fine-Tuning' },
  { title: 'Data Analyst', category: 'Analytics', icon: 'Database', desc: 'SQL, Tableau, Power BI & Business Intelligence' },
  { title: 'DevOps Engineer', category: 'DevOps & Infra', icon: 'Terminal', desc: 'Docker, Kubernetes, CI/CD & Terraform' },
  { title: 'Data Scientist', category: 'AI & Data Science', icon: 'Database', desc: 'Statistical Modeling, Python & ML Pipelines' },
  { title: 'Android Developer', category: 'Mobile Development', icon: 'Code2', desc: 'Kotlin, Jetpack Compose & Clean Architecture' },
  { title: 'Cybersecurity Engineer', category: 'Security', icon: 'Terminal', desc: 'Network Security, Pentesting & Threat Defense' },
  { title: 'Embedded Engineer', category: 'Hardware & IoT', icon: 'Code2', desc: 'C/C++, Microcontrollers & RTOS Systems' },
  { title: 'UI UX Designer', category: 'Design', icon: 'Layout', desc: 'Figma, Design Systems & User Research' },
  { title: 'Product Manager', category: 'Management', icon: 'Database', desc: 'Product Strategy, Roadmap & User Analytics' },
  { title: 'Blockchain Developer', category: 'Web3 & Crypto', icon: 'Code2', desc: 'Solidity, Smart Contracts & Ethereum' },
  { title: 'Game Developer', category: 'Gaming', icon: 'Code2', desc: 'Unity, Unreal Engine & C# Gameplay Systems' }
];

export const DEFAULT_STARTING_SKILLS = ['Python', 'Basic SQL', 'HTML/CSS'];

export const POPULAR_SUGGESTED_SKILLS = [
  'JavaScript', 'React', 'Java', 'C++', 'Node.js', 'Git', 'Docker',
  'PostgreSQL', 'Django', 'TypeScript', 'TailwindCSS', 'AWS', 'Linux'
];

export const ALUMNI_TWINS_DATA = {
  'Cloud Backend Engineer': {
    roleTitle: 'Cloud Backend Engineer',
    alumniTwins: [
      {
        id: 'twin-rohan',
        name: 'Rohan Verma',
        initials: 'RV',
        gender: 'male',
        verified: true,
        currentCompany: 'Microsoft',
        currentRole: 'Cloud Backend Engineer',
        package: '28 LPA',
        batch: 'Class of 2022',
        department: 'Computer Science',
        stackFocus: '.NET Core & Azure',
        baselineSkills: ['Python', 'Basic SQL', 'HTML/CSS'],
        advice: 'Interviewers love candidates who understand what happens after code is written: how it is containerized, deployed to the cloud, and monitored in production.',
        missingTools: [
          {
            toolNumber: 1,
            title: 'Azure Cloud Fundamentals & App Services',
            category: 'Cloud Computing',
            duration: '5 Weeks (10 hrs/week)',
            whyItMattered: 'Cloud service teams look for candidates with hands-on exposure to cloud resource provisioning and managed databases.',
            practiceProject: 'Serverless Event Processing Pipeline on Azure Functions',
            projectDescription: 'Build an event-driven serverless workflow using Azure Functions, Azure Service Bus, and Cosmos DB to ingest and process telemetry logs at 5,000 req/sec.',
            keySkills: ['Azure App Services', 'Cosmos DB', 'Azure Functions', 'ARM / Bicep Templates'],
            youtubeCourses: [
              {
                title: 'Microsoft Azure Fundamentals Certification (AZ-900) Full Course',
                channel: 'freeCodeCamp.org',
                duration: '3h 15m',
                views: '1.2M views',
                link: 'https://www.youtube.com/watch?v=NKEFWyqJ5XA'
              },
              {
                title: 'Azure Functions Crash Course - Serverless Architecture',
                channel: 'Traversy Media',
                duration: '1h 05m',
                views: '450K views',
                link: 'https://www.youtube.com/watch?v=F3j7n_aU6Yc'
              }
            ]
          },
          {
            toolNumber: 2,
            title: 'Docker & Containerization',
            category: 'DevOps & Infrastructure',
            duration: '3 Weeks (8 hrs/week)',
            whyItMattered: 'Enabled him to discuss packaging, environment reproducibility, and modern Kubernetes deployments in interviews.',
            practiceProject: 'Microservices Deployment with Docker Compose & Nginx',
            projectDescription: 'Containerize multi-tier API services, configure an Nginx reverse proxy with SSL termination, and manage container volumes for persistence.',
            keySkills: ['Dockerfile Optimization', 'Docker Compose', 'Multi-stage Builds', 'Nginx Routing'],
            youtubeCourses: [
              {
                title: 'Docker Tutorial for Beginners [Full Course]',
                channel: 'TechWorld with Nana',
                duration: '2h 45m',
                views: '4.8M views',
                link: 'https://www.youtube.com/watch?v=3c-iBn73dDE'
              },
              {
                title: 'Docker Compose in 15 Minutes',
                channel: 'Fireship',
                duration: '12m',
                views: '890K views',
                link: 'https://www.youtube.com/watch?v=HG6yIjZapSA'
              }
            ]
          },
          {
            toolNumber: 3,
            title: 'C# / .NET Core Microservices',
            category: 'Backend Frameworks',
            duration: '6 Weeks (12 hrs/week)',
            whyItMattered: 'Helped him ace the live system implementation round tailored for modern microservice teams.',
            practiceProject: 'Distributed Inventory & Order Management API',
            projectDescription: 'Architect a high-performance REST & gRPC backend with Entity Framework Core, Redis caching, RabbitMQ message brokers, and JWT authentication.',
            keySkills: ['ASP.NET Core Web API', 'Entity Framework Core', 'Dependency Injection', 'RabbitMQ / gRPC'],
            youtubeCourses: [
              {
                title: 'ASP.NET Core Web API - Complete Guide',
                channel: 'Nick Chapsas',
                duration: '4h 20m',
                views: '620K views',
                link: 'https://www.youtube.com/watch?v=4RKu8iZ_29U'
              },
              {
                title: 'Clean Architecture with .NET Core',
                channel: 'Milan Jovanović',
                duration: '1h 30m',
                views: '380K views',
                link: 'https://www.youtube.com/watch?v=t8B4U8C4H0g'
              }
            ]
          },
          {
            toolNumber: 4,
            title: 'Redis Distributed Caching & Message Queues',
            category: 'Performance & Queues',
            duration: '3 Weeks (8 hrs/week)',
            whyItMattered: 'Taught him how to eliminate database bottlenecks and build asynchronous event queues using Redis and RabbitMQ.',
            practiceProject: 'High-Throughput Distributed Rate Limiter & Message Queue Engine',
            projectDescription: 'Implement Redis sliding window rate-limiting middleware and RabbitMQ dead-letter worker queues.',
            keySkills: ['Redis Streams', 'Sliding Window Rate Limiter', 'RabbitMQ', 'Idempotent Consumers'],
            youtubeCourses: [
              {
                title: 'Redis Distributed Systems Masterclass',
                channel: 'Hussein Nasser',
                duration: '1h 40m',
                views: '450K views',
                link: 'https://www.youtube.com'
              }
            ]
          },
          {
            toolNumber: 5,
            title: 'Kubernetes Container Orchestration & CI/CD',
            category: 'DevOps & Orchestration',
            duration: '4 Weeks (10 hrs/week)',
            whyItMattered: 'Demonstrated enterprise deployment maturity by managing container pods, ingress controllers, and automated GitHub Actions.',
            practiceProject: 'Multi-Cluster Kubernetes Deployment with Helm & GitHub Actions',
            projectDescription: 'Deploy microservices to Azure Kubernetes Service (AKS) with Helm charts, automated rollbacks, and Prometheus monitoring.',
            keySkills: ['Kubernetes Pods & Services', 'Helm Charts', 'GitHub Actions', 'Prometheus & Grafana'],
            youtubeCourses: [
              {
                title: 'Kubernetes Crash Course for Backend Developers',
                channel: 'TechWorld with Nana',
                duration: '3h 10m',
                views: '2.4M views',
                link: 'https://www.youtube.com'
              }
            ]
          }
        ],
        roadmapPhases: [
          {
            phase: 1,
            title: 'Azure Cloud Foundations & Serverless APIs',
            weeks: 'Weeks 1 - 4',
            commitment: '10 hrs/week',
            status: 'ready',
            icon: 'Cloud',
            description: 'Master resource groups, virtual networks, Azure App Services, managed SQL databases, and Azure Functions triggers.',
            keySkills: ['Azure App Services', 'Cosmos DB', 'Azure Functions', 'ARM Templates'],
            capstoneDeliverable: 'Serverless Event Processing Pipeline on Azure Functions',
            proTip: 'Microsoft interviewers love candidates who understand cloud resource provisioning and managed serverless pipelines.',
            milestones: [
              { id: 'm1', text: 'Set up free Azure account and provision first Web App instance', done: false },
              { id: 'm2', text: 'Deploy a Node/Python REST API with Cosmos DB connector', done: false },
              { id: 'm3', text: 'Write serverless Azure Functions with Blob Storage triggers', done: false }
            ]
          },
          {
            phase: 2,
            title: 'Docker Containerization & Multi-Service Orchestration',
            weeks: 'Weeks 5 - 7',
            commitment: '8 hrs/week',
            status: 'upcoming',
            icon: 'Terminal',
            description: 'Package backend applications with lightweight multi-stage Dockerfiles and orchestrate microservices with Docker Compose.',
            keySkills: ['Dockerfile Optimization', 'Docker Compose', 'Multi-stage Builds', 'Nginx'],
            capstoneDeliverable: 'Microservices Deployment with Docker Compose & Nginx',
            proTip: 'Always use multi-stage Alpine Docker builds to minimize container vulnerabilities and image size.',
            milestones: [
              { id: 'm4', text: 'Create optimized Alpine-based multi-stage Dockerfiles', done: false },
              { id: 'm5', text: 'Configure Docker Compose with Redis, PostgreSQL, and Nginx load balancer', done: false },
              { id: 'm6', text: 'Implement health checks, volume mounts, and network bridges', done: false }
            ]
          },
          {
            phase: 3,
            title: '.NET Microservices & High-Throughput gRPC APIs',
            weeks: 'Weeks 8 - 11',
            commitment: '12 hrs/week',
            status: 'upcoming',
            icon: 'Server',
            description: 'Deep dive into C# / ASP.NET Core 8, repository patterns, message queuing with RabbitMQ, and distributed tracing.',
            keySkills: ['ASP.NET Core Web API', 'Entity Framework Core', 'Dependency Injection', 'RabbitMQ'],
            capstoneDeliverable: 'Distributed Inventory & Order Management API',
            proTip: 'Be prepared to write clean dependency injection and repository patterns in live pair-programming rounds.',
            milestones: [
              { id: 'm7', text: 'Build REST APIs using ASP.NET Core 8 with EF Core & migrations', done: false },
              { id: 'm8', text: 'Integrate Redis caching to drop database read latency under 5ms', done: false },
              { id: 'm9', text: 'Implement asynchronous event publishing with RabbitMQ broker', done: false }
            ]
          },
          {
            phase: 4,
            title: 'Redis Distributed Caching & Rate Limiting Systems',
            weeks: 'Weeks 12 - 13',
            commitment: '8 hrs/week',
            status: 'upcoming',
            icon: 'Database',
            description: 'Eliminate database bottlenecks with distributed caching, Token Bucket rate limiters, and idempotency keys.',
            keySkills: ['Redis Streams', 'Sliding Window Rate Limiter', 'Cache Aside', 'Idempotency'],
            capstoneDeliverable: 'High-Throughput Distributed Rate Limiter & Message Queue Engine',
            proTip: 'Explain how Cache-Aside paired with TTL expiration prevents cache stampedes under sudden traffic spikes.',
            milestones: [
              { id: 'm10', text: 'Implement sliding-window rate limiter middleware with Redis Lua scripts', done: false },
              { id: 'm11', text: 'Configure cache-aside pattern with automatic TTL cache invalidation', done: false },
              { id: 'm12', text: 'Add idempotent request key handling to prevent duplicate billing charges', done: false }
            ]
          },
          {
            phase: 5,
            title: 'Kubernetes Orchestration & Microsoft Mock Interviews',
            weeks: 'Weeks 14 - 16',
            commitment: '10 hrs/week',
            status: 'upcoming',
            icon: 'Sparkles',
            description: 'Deploy distributed microservices to Azure Kubernetes Service (AKS) and practice Microsoft system design interview rounds.',
            keySkills: ['Kubernetes Pods', 'Helm Charts', 'GitHub Actions CI/CD', 'System Design'],
            capstoneDeliverable: 'Production AKS Cluster Deployment with Prometheus Monitoring',
            proTip: 'In Microsoft system design rounds, start with requirements gathering and back-of-the-envelope capacity calculations.',
            milestones: [
              { id: 'm13', text: 'Write Helm chart templates for microservices and deploy to AKS cluster', done: false },
              { id: 'm14', text: 'Set up end-to-end GitHub Actions workflow with automated staging rollouts', done: false },
              { id: 'm15', text: 'Complete 3 full mock interview rounds on distributed caching and concurrency', done: false }
            ]
          }
        ],
        interviewQAs: [
          {
            q: 'How do you handle eventual consistency in a distributed microservices system?',
            a: 'By employing the Saga pattern (Orchestration or Choreography) paired with an idempotent message broker (e.g. RabbitMQ or Azure Service Bus). Failed transactions trigger compensating actions across downstream services.'
          },
          {
            q: 'What is the difference between Docker COPY and ADD instructions?',
            a: 'COPY simply copies local files from the build context to the container image. ADD has additional features like automatic tar extraction and remote URL fetching, but COPY is preferred for transparency and layer caching optimization.'
          },
          {
            q: 'How does ASP.NET Core handle dependency injection lifetimes (Transient vs Scoped vs Singleton)?',
            a: 'Transient services are created every time they are requested. Scoped services are created once per client HTTP request. Singleton services are instantiated on first call and shared globally throughout application runtime.'
          }
        ]
      },
      {
        id: 'twin-pooja',
        name: 'Pooja Hegde',
        initials: 'PH',
        gender: 'female',
        verified: true,
        currentCompany: 'Amazon AWS',
        currentRole: 'Cloud Solutions Engineer',
        package: '32 LPA',
        batch: 'Class of 2021',
        department: 'Information Science',
        stackFocus: 'Java Spring Cloud & AWS',
        baselineSkills: ['Python', 'Basic SQL', 'HTML/CSS'],
        advice: 'Amazon heavily evaluates your understanding of distributed system tradeoffs (CAP theorem, DynamoDB partition keys) along with Leadership Principles (Ownership and Customer Obsession).',
        missingTools: [
          {
            toolNumber: 1,
            title: 'AWS Serverless (Lambda, DynamoDB & SQS)',
            category: 'AWS Cloud Architecture',
            duration: '5 Weeks (10 hrs/week)',
            whyItMattered: 'Directly demonstrated practical experience with event-driven architecture and NoSQL schema design in AWS system design interviews.',
            practiceProject: 'High-Throughput Order Ingestion Engine with AWS SQS & Lambda',
            projectDescription: 'Build an asynchronous order intake system buffering 10,000 orders/sec with AWS SQS, dead-letter queues, and DynamoDB single-table design.',
            keySkills: ['AWS Lambda', 'DynamoDB Partition Keys', 'Amazon SQS/SNS', 'AWS SAM / CDK'],
            youtubeCourses: [
              {
                title: 'AWS Certified Cloud Practitioner - Full Course 2026',
                channel: 'freeCodeCamp.org',
                duration: '4h 00m',
                views: '2.1M views',
                link: 'https://www.youtube.com/watch?v=SOTamWNgDKc'
              },
              {
                title: 'DynamoDB Single Table Design Masterclass',
                channel: 'Alex DeBrie',
                duration: '1h 20m',
                views: '340K views',
                link: 'https://www.youtube.com/watch?v=HaEPXoXVf2k'
              }
            ]
          },
          {
            toolNumber: 2,
            title: 'Java 21 & Spring Boot Microservices',
            category: 'Backend Architecture',
            duration: '6 Weeks (12 hrs/week)',
            whyItMattered: 'Crucial for passing live machine coding rounds with production Java patterns, DTO mappers, and JPA query optimization.',
            practiceProject: 'Enterprise Banking Transaction Service with Distributed Locks',
            projectDescription: 'Design a resilient Spring Boot 3 API with Redis Redlock for transactional double-spend prevention and Actuator observability.',
            keySkills: ['Spring Boot 3', 'Spring Cloud Gateway', 'Resilience4j Circuit Breakers', 'JPA/Hibernate'],
            youtubeCourses: [
              {
                title: 'Spring Boot 3 Full Course 2026',
                channel: 'Amigoscode',
                duration: '3h 40m',
                views: '1.5M views',
                link: 'https://www.youtube.com/watch?v=9SGDpanrc8U'
              }
            ]
          },
          {
            toolNumber: 3,
            title: 'Apache Kafka Event Streaming',
            category: 'Distributed Messaging',
            duration: '3 Weeks (8 hrs/week)',
            whyItMattered: 'Aced high-throughput distributed system design questions by explaining partition rebalancing and consumer offset management.',
            practiceProject: 'Real-Time Ride Dispatch Streaming Pipeline with Kafka',
            projectDescription: 'Build a Kafka cluster with topic partitions, schema registry with Avro, and stream consumer consumer groups.',
            keySkills: ['Kafka Brokers & Topics', 'Consumer Groups & Offsets', 'Schema Registry', 'Idempotent Producers'],
            youtubeCourses: [
              {
                title: 'Apache Kafka Crash Course',
                channel: 'Traversy Media',
                duration: '1h 10m',
                views: '610K views',
                link: 'https://www.youtube.com/watch?v=R873BlBMUB4'
              }
            ]
          }
        ],
        roadmapPhases: [
          {
            phase: 1,
            title: 'Core Java 21 & Spring Boot 3 Foundations',
            weeks: 'Weeks 1 - 4',
            commitment: '12 hrs/week',
            status: 'ready',
            description: 'Master streams, records, dependency injection, and JPA database transactions.',
            milestones: [
              { id: 'm1', text: 'Build REST API with Spring Boot, Spring Security & PostgreSQL', done: false }
            ]
          },
          {
            phase: 2,
            title: 'AWS Serverless & DynamoDB NoSQL Modeling',
            weeks: 'Weeks 5 - 8',
            commitment: '10 hrs/week',
            status: 'upcoming',
            description: 'Design single-table DynamoDB schemas and write serverless Lambdas.',
            milestones: [
              { id: 'm2', text: 'Deploy serverless backend with AWS Lambda and API Gateway', done: false }
            ]
          }
        ],
        interviewQAs: [
          {
            q: 'How does Kafka guarantee message ordering across partitions?',
            a: 'Kafka guarantees strict total order ONLY within a single partition. To ensure order across related messages (e.g. all transactions for customer #42), assign the customer ID as the partition message key so all hashes route to the same partition.'
          }
        ]
      },
      {
        id: 'twin-aditya',
        name: 'Aditya Sengupta',
        initials: 'AS',
        gender: 'male',
        verified: true,
        currentCompany: 'Uber',
        currentRole: 'Backend Infrastructure Engineer',
        package: '34 LPA',
        batch: 'Class of 2021',
        department: 'Computer Science',
        stackFocus: 'Go (Golang), gRPC & Kubernetes',
        baselineSkills: ['Python', 'Basic SQL', 'HTML/CSS'],
        advice: 'High-scale companies love candidates who can write concurrent, low-latency Go code and talk authoritatively about Goroutine schedulers, channels, and gRPC protocol buffers.',
        missingTools: [
          {
            toolNumber: 1,
            title: 'Go (Golang) & Concurrency Channels',
            category: 'High-Performance Systems',
            duration: '5 Weeks (10 hrs/week)',
            whyItMattered: 'Passed Uber’s concurrency coding round by building thread-safe worker pools with Goroutines and mutexes.',
            practiceProject: 'High-Concurrency Geo-Spatial Driver Tracking Service',
            projectDescription: 'Build an ultra-fast in-memory geohash index in Golang capable of processing 50,000 location pings/sec under 2ms p99 latency.',
            keySkills: ['Goroutines & Channels', 'Mutex / RWMutex', 'Go Context Package', 'Garbage Collection Profiling'],
            youtubeCourses: [
              {
                title: 'Golang Tutorial for Beginners [Full Course]',
                channel: 'TechWorld with Nana',
                duration: '3h 10m',
                views: '1.7M views',
                link: 'https://www.youtube.com/watch?v=yyUHQIec83I'
              }
            ]
          },
          {
            toolNumber: 2,
            title: 'gRPC & Protocol Buffers (Protobuf)',
            category: 'RPC & Microservices',
            duration: '3 Weeks (8 hrs/week)',
            whyItMattered: 'Replaced slow JSON REST with binary Protobuf serialization and bidirectional streaming for internal microservice hops.',
            practiceProject: 'Streaming Financial Market Ticker with gRPC Streams',
            projectDescription: 'Implement gRPC server and client with bi-directional streaming, Protobuf schemas, and TLS encryption.',
            keySkills: ['Protobuf Syntax', 'Unary vs Streaming gRPC', 'HTTP/2 Multiplexing', 'Interceptors & Metadata'],
            youtubeCourses: [
              {
                title: 'gRPC Crash Course - Protocol Buffers in Go',
                channel: 'Hussein Nasser',
                duration: '1h 25m',
                views: '480K views',
                link: 'https://www.youtube.com/watch?v=gn7Xp85z_gA'
              }
            ]
          },
          {
            toolNumber: 3,
            title: 'Kubernetes & Helm Microservices Deployment',
            category: 'Container Orchestration',
            duration: '4 Weeks (10 hrs/week)',
            whyItMattered: 'Demonstrated zero-downtime rolling updates, ingress controllers, ConfigMaps, and cluster autoscaling.',
            practiceProject: 'Resilient Microservices Fleet with Kubernetes & Helm',
            projectDescription: 'Deploy scalable pods with horizontal pod autoscalers (HPA), persistent volume claims, and custom Helm charts.',
            keySkills: ['Kubernetes Deployments', 'Helm Charts', 'Ingress & TLS', 'Horizontal Pod Autoscaler'],
            youtubeCourses: [
              {
                title: 'Kubernetes Tutorial for Beginners [Full Course]',
                channel: 'TechWorld with Nana',
                duration: '3h 30m',
                views: '3.6M views',
                link: 'https://www.youtube.com/watch?v=X48VuDVv0do'
              }
            ]
          }
        ],
        roadmapPhases: [
          {
            phase: 1,
            title: 'Go Language & Concurrency Primitives',
            weeks: 'Weeks 1 - 4',
            commitment: '10 hrs/week',
            status: 'ready',
            description: 'Master pointers, interfaces, goroutines, channels, and select blocks in Go.',
            milestones: [
              { id: 'm1', text: 'Build concurrent worker pool processing parallel tasks in Go', done: false }
            ]
          }
        ],
        interviewQAs: [
          {
            q: 'How does Go’s GMP (Goroutine, Machine thread, Processor) scheduler work?',
            a: 'The GMP model maps M goroutines (G) onto N OS threads (M) using P logical processors. When a goroutine performs a blocking syscall, the OS thread detaches while processor P continues running other runnable goroutines on a new thread, preventing CPU starvation.'
          }
        ]
      }
    ]
  },

  'Software Engineer': {
    roleTitle: 'Software Engineer',
    alumniTwins: [
      {
        id: 'twin-priya',
        name: 'Priya Sharma',
        initials: 'PS',
        gender: 'female',
        verified: true,
        currentCompany: 'Google',
        currentRole: 'Software Engineer II',
        package: '36 LPA',
        batch: 'Class of 2021',
        department: 'Computer Science',
        stackFocus: 'C++ DSA & Scaled Systems',
        baselineSkills: ['Python', 'Basic SQL', 'HTML/CSS'],
        advice: 'Focus heavily on problem-solving patterns (Two Pointers, Sliding Window, Graph BFS/DFS) and write clean, modular, bug-free code under time constraints.',
        missingTools: [
          {
            toolNumber: 1,
            title: 'Advanced Data Structures & Algorithms (C++ / Java)',
            category: 'Core Computer Science',
            duration: '6 Weeks (12 hrs/week)',
            whyItMattered: 'Cracked Google’s 3 technical DSA coding rounds by solving LeetCode hard graph and dynamic programming questions with optimal space/time complexity.',
            practiceProject: 'High-Throughput In-Memory LRU Cache & Trie Search Engine',
            projectDescription: 'Implement thread-safe LRU Cache with O(1) read/write access and Trie-based auto-complete ranking over 100,000 words.',
            keySkills: ['Trees & Graphs', 'Dynamic Programming', 'Trie & Segment Trees', 'Time & Space Complexity'],
            youtubeCourses: [
              {
                title: 'Dynamic Programming - Learn to Solve Algorithmic Problems',
                channel: 'freeCodeCamp.org',
                duration: '5h 10m',
                views: '2.5M views',
                link: 'https://www.youtube.com/watch?v=oBt53YbR9Kk'
              }
            ]
          },
          {
            toolNumber: 2,
            title: 'Low-Level & Object-Oriented System Design (LLD)',
            category: 'Software Architecture',
            duration: '4 Weeks (8 hrs/week)',
            whyItMattered: 'Showed interviewers deep understanding of SOLID principles, Design Patterns, and schema modeling during machine coding rounds.',
            practiceProject: 'Concert Booking & Rate-Limiter Engine in Clean Java/C++',
            projectDescription: 'Design an extensible ticket reservation system with pessimistic locking for seat conflicts and sliding-window rate limiter.',
            keySkills: ['SOLID Principles', 'Factory & Strategy Patterns', 'Concurrency & Mutexes', 'UML Class Modeling'],
            youtubeCourses: [
              {
                title: 'Low Level Design (LLD) Complete Masterclass',
                channel: 'Gaurav Sen / Concept&&Coding',
                duration: '3h 30m',
                views: '950K views',
                link: 'https://www.youtube.com/watch?v=0jjgptM3Q1Y'
              }
            ]
          },
          {
            toolNumber: 3,
            title: 'Distributed System Design & High-Scale Caching',
            category: 'System Architecture',
            duration: '4 Weeks (10 hrs/week)',
            whyItMattered: 'Aced high-level architectural questions on horizontal scaling, database sharding, and CDN caching.',
            practiceProject: 'Scalable URL Shortener with Cassandra & Redis Clusters',
            projectDescription: 'Architect a globally distributed URL shortener processing 100M daily clicks with Base62 encoding, Redis caching, and rate limiting.',
            keySkills: ['Consistent Hashing', 'Database Sharding', 'Message Queues', 'CAP Theorem'],
            youtubeCourses: [
              {
                title: 'System Design Interview Crash Course',
                channel: 'ByteByteGo',
                duration: '2h 00m',
                views: '3.2M views',
                link: 'https://www.youtube.com/watch?v=bUHFg8CZFCA'
              }
            ]
          },
          {
            toolNumber: 4,
            title: 'Concurrent Programming & Multithreaded Systems',
            category: 'Systems & Concurrency',
            duration: '4 Weeks (10 hrs/week)',
            whyItMattered: 'Solved complex synchronization, race condition, and deadlock prevention interview problems during live Google system rounds.',
            practiceProject: 'Lock-Free Multi-Producer Multi-Consumer Ring Buffer in C++',
            projectDescription: 'Build a lock-free bounded queue using atomic memory orderings, compare-and-swap (CAS), and thread sanitizers.',
            keySkills: ['Mutexes & Condition Variables', 'Atomic Operations', 'Lock-Free Structures', 'Thread Sanitizers'],
            youtubeCourses: [
              {
                title: 'Concurrency & Multithreading in C++ Deep Dive',
                channel: 'The Cherno',
                duration: '1h 50m',
                views: '480K views',
                link: 'https://www.youtube.com'
              }
            ]
          },
          {
            toolNumber: 5,
            title: 'Linux System Internals & Memory Profiling (Valgrind / GDB)',
            category: 'Performance Engineering',
            duration: '3 Weeks (8 hrs/week)',
            whyItMattered: 'Debugged memory leaks, cache misses, and CPU cycle bottlenecks under performance stress tests.',
            practiceProject: 'Custom Memory Allocator with Leak Detection & Benchmarking',
            projectDescription: 'Develop a custom slab allocator measuring cache performance and eliminating heap fragmentation.',
            keySkills: ['Valgrind & GDB', 'Memory Allocators', 'Linux System Calls', 'Perf & FlameGraphs'],
            youtubeCourses: [
              {
                title: 'Linux Systems Programming & GDB Debugging',
                channel: 'freeCodeCamp.org',
                duration: '2h 15m',
                views: '560K views',
                link: 'https://www.youtube.com'
              }
            ]
          }
        ],
        roadmapPhases: [
          {
            phase: 1,
            title: 'Advanced Data Structures & Graph Algorithms',
            weeks: 'Weeks 1 - 5',
            commitment: '12 hrs/week',
            status: 'ready',
            icon: 'Code2',
            description: 'Master binary trees, heaps, union-find, DFS/BFS traversals, and dynamic programming patterns.',
            keySkills: ['Trees & Graphs', 'Dynamic Programming', 'Trie', 'Complexity Analysis'],
            capstoneDeliverable: 'In-Memory LRU Cache & Multi-Threaded Trie Search Engine',
            proTip: 'In Google coding rounds, always state your time and space complexity upfront before writing a single line of code.',
            milestones: [
              { id: 'm1', text: 'Solve 40 LeetCode Medium/Hard Tree and Graph patterns', done: false },
              { id: 'm2', text: 'Implement O(1) concurrent LRU Cache in C++/Java with unit tests', done: false },
              { id: 'm3', text: 'Master 1D & 2D Dynamic Programming state transitions', done: false }
            ]
          },
          {
            phase: 2,
            title: 'Low-Level Design & SOLID Object Architecture',
            weeks: 'Weeks 6 - 9',
            commitment: '10 hrs/week',
            status: 'upcoming',
            icon: 'Layout',
            description: 'Master clean OOP design patterns (Factory, Strategy, Observer) and schema modeling for machine coding rounds.',
            keySkills: ['SOLID Principles', 'Factory & Strategy', 'UML Modeling', 'Clean Code'],
            capstoneDeliverable: 'Concert Booking & Rate-Limiter Engine in Clean C++/Java',
            proTip: 'Focus on extensibility. When interviewers ask for a surprise requirement mid-interview, your design should accommodate it with zero refactoring.',
            milestones: [
              { id: 'm4', text: 'Design and implement Parking Lot and Snake & Ladder with SOLID patterns', done: false },
              { id: 'm5', text: 'Implement Token Bucket and Sliding Window rate limiter classes', done: false },
              { id: 'm6', text: 'Conduct 2 peer LLD mock rounds with strict 45-minute limits', done: false }
            ]
          },
          {
            phase: 3,
            title: 'Distributed Systems & High-Scale Caching',
            weeks: 'Weeks 10 - 12',
            commitment: '10 hrs/week',
            status: 'upcoming',
            icon: 'Server',
            description: 'Architect scalable web systems with consistent hashing, database sharding, and Redis caching layers.',
            keySkills: ['Consistent Hashing', 'Database Sharding', 'Message Queues', 'CAP Theorem'],
            capstoneDeliverable: 'Scalable URL Shortener with Cassandra & Redis Clusters',
            proTip: 'In Google system design, calculate queries-per-second (QPS) and memory bandwidth before drawing system blocks.',
            milestones: [
              { id: 'm7', text: 'Draw end-to-end architecture for URL shortener handling 100M daily clicks', done: false },
              { id: 'm8', text: 'Design database sharding strategy and partition key distribution', done: false },
              { id: 'm9', text: 'Implement Redis cluster caching with TTL and cache-aside invalidation', done: false }
            ]
          },
          {
            phase: 4,
            title: 'Concurrent Programming & Lock-Free Structures',
            weeks: 'Weeks 13 - 14',
            commitment: '10 hrs/week',
            status: 'upcoming',
            icon: 'Terminal',
            description: 'Deep dive into multithreading, race condition elimination, atomic memory orderings, and mutex synchronizations.',
            keySkills: ['Mutexes & Locks', 'Atomic Operations', 'Lock-Free Queues', 'Thread Sanitizers'],
            capstoneDeliverable: 'Lock-Free Multi-Producer Multi-Consumer Ring Buffer in C++',
            proTip: 'Always verify multithreaded code using Clang ThreadSanitizer (-fsanitize=thread) to catch elusive race conditions.',
            milestones: [
              { id: 'm10', text: 'Implement thread-safe bounded blocking queue with condition variables', done: false },
              { id: 'm11', text: 'Build lock-free ring buffer using C++ std::atomic memory orderings', done: false },
              { id: 'm12', text: 'Benchmark throughput vs standard mutex queue under 16 concurrent threads', done: false }
            ]
          },
          {
            phase: 5,
            title: 'Linux Systems Profiling & Google Mock Interview Drills',
            weeks: 'Weeks 15 - 16',
            commitment: '12 hrs/week',
            status: 'upcoming',
            icon: 'Sparkles',
            description: 'Profile memory allocations with Valgrind/GDB and run rigorous full-loop mock interview rounds.',
            keySkills: ['Valgrind & GDB', 'Linux Profiling', 'System Design Drills', 'Behavioral STAR'],
            capstoneDeliverable: 'Custom Memory Allocator with Zero Heap Fragmentation',
            proTip: 'Google interviewers grade on communication as much as code. Think out loud and explain tradeoffs constantly.',
            milestones: [
              { id: 'm13', text: 'Implement custom slab allocator and eliminate heap fragmentation', done: false },
              { id: 'm14', text: 'Complete 4 full mock rounds covering DSA, System Design, and Googliness', done: false },
              { id: 'm15', text: 'Finalize verified GitHub portfolio with benchmarks and architecture diagrams', done: false }
            ]
          }
        ],
        interviewQAs: [
          {
            q: 'Explain how Consistent Hashing works and why it is used in distributed caches.',
            a: 'Consistent hashing maps both servers and data keys to a virtual ring (0 to 2^32-1) using a hash function. When a node is added or removed, only k/N keys need to be remapped on average, preventing massive cache stampedes.'
          }
        ]
      },
      {
        id: 'twin-rahul',
        name: 'Rahul Nair',
        initials: 'RN',
        gender: 'male',
        verified: true,
        currentCompany: 'Atlassian',
        currentRole: 'Software Engineer',
        package: '30 LPA',
        batch: 'Class of 2022',
        department: 'Information Science',
        stackFocus: 'Java & Event-Driven Systems',
        baselineSkills: ['Python', 'Basic SQL', 'HTML/CSS'],
        advice: 'Atlassian focuses heavily on clean, maintainable code during live pair programming rounds. Explain your thought process out loud.',
        missingTools: [
          {
            toolNumber: 1,
            title: 'Clean Architecture & Test-Driven Development (TDD)',
            category: 'Software Engineering',
            duration: '4 Weeks (8 hrs/week)',
            whyItMattered: 'Wrote modular code with JUnit/Mockito test coverage during technical pairing rounds.',
            practiceProject: 'TDD-Driven Issue Tracking Engine with Domain Events',
            projectDescription: 'Implement domain models with 100% test coverage using JUnit 5, Mockito, and Clean Architecture boundaries.',
            keySkills: ['JUnit 5 / Mockito', 'Domain Driven Design (DDD)', 'Dependency Inversion', 'Clean Code Principles'],
            youtubeCourses: [
              {
                title: 'Test Driven Development (TDD) Crash Course',
                channel: 'Amigoscode',
                duration: '1h 30m',
                views: '410K views',
                link: 'https://www.youtube.com'
              }
            ]
          },
          {
            toolNumber: 2,
            title: 'Java Concurrency & Virtual Threads (Project Loom)',
            category: 'Core Java',
            duration: '4 Weeks (10 hrs/week)',
            whyItMattered: 'Showcased modern Java 21 Virtual Threads performance benefits for high-throughput I/O services.',
            practiceProject: 'High-Concurrency Task Scheduling Framework',
            projectDescription: 'Build an asynchronous task worker processing 50,000 simulated I/O tasks using Java 21 Virtual Threads.',
            keySkills: ['Virtual Threads', 'CompletableFuture', 'ExecutorService', 'Deadlock Detection'],
            youtubeCourses: [
              {
                title: 'Java 21 Virtual Threads Complete Guide',
                channel: 'Defog Tech',
                duration: '45m',
                views: '220K views',
                link: 'https://www.youtube.com'
              }
            ]
          },
          {
            toolNumber: 3,
            title: 'Redis Distributed Caching & Rate Limiting',
            category: 'Distributed Caching',
            duration: '3 Weeks (8 hrs/week)',
            whyItMattered: 'Implemented Token Bucket rate limiters to protect downstream database services.',
            practiceProject: 'Distributed Rate-Limiter & Cache-Aside Middleware',
            projectDescription: 'Build a high-performance Redis cache layer with TTL invalidation, sliding window rate-limiter, and circuit breaker.',
            keySkills: ['Redis Pub/Sub', 'Sliding Window Algorithm', 'Cache Stampede Mitigation', 'Lua Scripts in Redis'],
            youtubeCourses: [
              {
                title: 'Redis Crash Course for Backend Developers',
                channel: 'Traversy Media',
                duration: '1h 10m',
                views: '850K views',
                link: 'https://www.youtube.com'
              }
            ]
          }
        ],
        roadmapPhases: [
          {
            phase: 1,
            title: 'Test-Driven Development & Clean Code',
            weeks: 'Weeks 1 - 3',
            commitment: '8 hrs/week',
            status: 'ready',
            icon: 'Code2',
            description: 'Write maintainable, modular software using TDD cycles and domain-driven design boundaries.',
            keySkills: ['JUnit 5 / Mockito', 'Domain Driven Design (DDD)', 'Dependency Inversion', 'Clean Code'],
            capstoneDeliverable: 'TDD-Driven Issue Tracking Engine with Domain Events',
            proTip: 'Atlassian pair-programming interviews place immense weight on writing tests first and explaining design patterns cleanly.',
            milestones: [
              { id: 'm1', text: 'Implement Clean Architecture REST service with 90%+ unit test coverage', done: false },
              { id: 'm2', text: 'Write Mockito integration tests simulating external payment gateways', done: false }
            ]
          },
          {
            phase: 2,
            title: 'Java 21 Concurrency & Project Loom Virtual Threads',
            weeks: 'Weeks 4 - 7',
            commitment: '10 hrs/week',
            status: 'upcoming',
            icon: 'Terminal',
            description: 'Master Java 21 Virtual Threads, CompletableFuture pipelines, and deadlock-free asynchronous execution.',
            keySkills: ['Virtual Threads', 'CompletableFuture', 'ExecutorService', 'Deadlock Detection'],
            capstoneDeliverable: 'High-Concurrency Task Scheduling Framework (50K I/O tasks)',
            proTip: 'Explain JVM carrier thread scheduling and non-blocking I/O tradeoffs during Atlassian systems rounds.',
            milestones: [
              { id: 'm3', text: 'Benchmark Java 21 Virtual Threads handling 50k concurrent tasks without thread exhaustion', done: false },
              { id: 'm4', text: 'Build asynchronous worker pipeline with CompletableFuture chaining and error recovery', done: false }
            ]
          },
          {
            phase: 3,
            title: 'Distributed Redis Caching & Resilient Rate Limiting',
            weeks: 'Weeks 8 - 10',
            commitment: '8 hrs/week',
            status: 'upcoming',
            icon: 'Server',
            description: 'Eliminate backend database query bottlenecks with Redis distributed caching, Sliding Window rate limiters, and circuit breakers.',
            keySkills: ['Redis Pub/Sub', 'Sliding Window Algorithm', 'Cache Stampede Mitigation', 'Lua Scripts in Redis'],
            capstoneDeliverable: 'Distributed Rate-Limiter & Cache-Aside Middleware',
            proTip: 'Discuss cache stampede mitigation using probabilistic early expiration and distributed mutex locks.',
            milestones: [
              { id: 'm5', text: 'Implement sliding-window rate limiter middleware with Redis Lua scripts', done: false },
              { id: 'm6', text: 'Configure cache-aside pattern with automatic TTL invalidation and fallback circuit breakers', done: false }
            ]
          }
        ],
        interviewQAs: [
          {
            q: 'How do Virtual Threads in Java 21 improve throughput compared to platform threads?',
            a: 'Platform threads are 1:1 mapped to OS kernel threads, consuming ~1MB of stack memory each. Virtual threads are lightweight user-mode threads managed by JVM (few bytes of heap). When a virtual thread blocks on I/O, the underlying carrier OS thread is released to run other work.'
          }
        ]
      }
    ]
  },

  'Full Stack Developer': {
    roleTitle: 'Full Stack Developer',
    alumniTwins: [
      {
        id: 'twin-aarav',
        name: 'Aarav Mehta',
        initials: 'AM',
        gender: 'male',
        verified: true,
        currentCompany: 'Atlassian',
        currentRole: 'Full Stack Developer',
        package: '32 LPA',
        batch: 'Class of 2022',
        department: 'Information Science',
        stackFocus: 'Next.js 15 & Node.js',
        baselineSkills: ['Python', 'Basic SQL', 'HTML/CSS'],
        advice: 'Show full ownership of a feature: from responsive React UI state to Node.js backend microservices and database schema optimizations.',
        missingTools: [
          {
            toolNumber: 1,
            title: 'React 19 & Next.js App Router Architecture',
            category: 'Frontend Engineering',
            duration: '5 Weeks (10 hrs/week)',
            whyItMattered: 'Demonstrated modern SSR, React Server Components, and optimized client bundle sizes.',
            practiceProject: 'Real-Time Collaborative Workspace with Live Cursors',
            projectDescription: 'Build a Notion-style rich text workspace with WebSockets, optimistic UI updates, and TailwindCSS design tokens.',
            keySkills: ['Server Components', 'Custom Hooks', 'TailwindCSS', 'WebSockets'],
            youtubeCourses: [
              {
                title: 'Next.js 15 Full Tutorial 2026',
                channel: 'Jack Herrington',
                duration: '2h 30m',
                views: '540K views',
                link: 'https://www.youtube.com/watch?v=SqcY0GlETPk'
              }
            ]
          },
          {
            toolNumber: 2,
            title: 'Node.js, Express & TypeScript Backend Services',
            category: 'Backend Architecture',
            duration: '4 Weeks (8 hrs/week)',
            whyItMattered: 'Ensured clean RESTful endpoints, robust JWT authentication, rate limiting, and input validation with Zod.',
            practiceProject: 'Multi-Tenant SaaS Authentication & Billing Engine',
            projectDescription: 'Develop a secure Node.js API with Stripe webhooks, Redis session tokens, and role-based access control (RBAC).',
            keySkills: ['Express.js', 'TypeScript', 'Zod Validation', 'JWT & OAuth2'],
            youtubeCourses: [
              {
                title: 'Node.js & TypeScript Backend Masterclass',
                channel: 'Fireship',
                duration: '1h 15m',
                views: '780K views',
                link: 'https://www.youtube.com/watch?v=bK3AJfs71us'
              }
            ]
          },
          {
            toolNumber: 3,
            title: 'PostgreSQL & Prisma ORM Data Modeling',
            category: 'Databases & ORM',
            duration: '3 Weeks (8 hrs/week)',
            whyItMattered: 'Helped ace database normalization, indexing strategies, and query performance optimization rounds.',
            practiceProject: 'High-Volume E-Commerce Inventory Schema with Transactions',
            projectDescription: 'Design relational schemas with Prisma, write ACID database transactions, and add composite B-Tree indexes.',
            keySkills: ['Prisma ORM', 'PostgreSQL', 'ACID Transactions', 'Indexing & Query Plans'],
            youtubeCourses: [
              {
                title: 'PostgreSQL Full Course for Beginners',
                channel: 'freeCodeCamp.org',
                duration: '4h 00m',
                views: '1.8M views',
                link: 'https://www.youtube.com/watch?v=qw--VYLpxG4'
              }
            ]
          },
          {
            toolNumber: 4,
            title: 'Docker Containerization & CI/CD Deployment',
            category: 'DevOps & Deployment',
            duration: '3 Weeks (6 hrs/week)',
            whyItMattered: 'Allowed him to package multi-service full stack apps into lightweight containers and deploy automatically via GitHub Actions.',
            practiceProject: 'Automated Containerized Full-Stack Deployment with GitHub Actions',
            projectDescription: 'Containerize Next.js and Node.js with multi-stage Dockerfiles, set up automated testing workflows, and deploy to AWS / Vercel.',
            keySkills: ['Docker Compose', 'Multi-stage Builds', 'GitHub Actions CI/CD', 'Nginx Reverse Proxy'],
            youtubeCourses: [
              {
                title: 'Docker & CI/CD for Full Stack Developers',
                channel: 'TechWorld with Nana',
                duration: '1h 45m',
                views: '620K views',
                link: 'https://www.youtube.com'
              }
            ]
          },
          {
            toolNumber: 5,
            title: 'WebSockets, Redis Caching & Real-Time State Sync',
            category: 'Real-Time Systems',
            duration: '4 Weeks (8 hrs/week)',
            whyItMattered: 'Proved ability to architect live collaborative features, optimistic state updates, and distributed pub/sub notifications.',
            practiceProject: 'Distributed Collaborative Whiteboard & Chat with Redis Pub/Sub',
            projectDescription: 'Build real-time multiplayer document sync with WebSockets, Redis pub/sub broadcasting, and client-side optimistic UI.',
            keySkills: ['WebSockets', 'Redis Pub/Sub', 'Zustand State Sync', 'TanStack Query'],
            youtubeCourses: [
              {
                title: 'Building Realtime Apps with WebSockets & Redis',
                channel: 'Fireship',
                duration: '35m',
                views: '490K views',
                link: 'https://www.youtube.com'
              }
            ]
          }
        ],
        roadmapPhases: [
          {
            phase: 1,
            title: 'Modern React 19 & Next.js App Router UI',
            weeks: 'Weeks 1 - 4',
            commitment: '10 hrs/week',
            status: 'ready',
            icon: 'Layout',
            description: 'Master React Server Components, client-side state with Zustand, and responsive design systems with TailwindCSS.',
            keySkills: ['Next.js 15', 'React Server Components', 'Zustand State', 'TailwindCSS'],
            capstoneDeliverable: 'Real-Time Responsive Workspace UI with Optimistic State',
            proTip: 'Atlassian interviewers test component re-render optimization. Always memorize when to use React.memo and useCallback.',
            milestones: [
              { id: 'm1', text: 'Set up Next.js 15 App Router project with TypeScript and ESLint', done: false },
              { id: 'm2', text: 'Build modular UI components with server/client boundaries', done: false },
              { id: 'm3', text: 'Implement client-side state store and optimistic UI mutations', done: false }
            ]
          },
          {
            phase: 2,
            title: 'Node.js, Express & TypeScript Backend Services',
            weeks: 'Weeks 5 - 8',
            commitment: '10 hrs/week',
            status: 'upcoming',
            icon: 'Server',
            description: 'Develop clean RESTful microservices with Zod schema validation, JWT auth middleware, and rate-limiting.',
            keySkills: ['Express.js', 'TypeScript', 'Zod Validation', 'JWT & OAuth2'],
            capstoneDeliverable: 'Multi-Tenant Authentication & Session Management Gateway',
            proTip: 'Always implement structured logging with Winston/Pino and centralized error handling middleware.',
            milestones: [
              { id: 'm4', text: 'Architect clean controller-service-repository pattern in Express', done: false },
              { id: 'm5', text: 'Implement JWT refresh-token rotation and role-based access control', done: false },
              { id: 'm6', text: 'Write end-to-end API test suites with Supertest and Jest', done: false }
            ]
          },
          {
            phase: 3,
            title: 'PostgreSQL Relational Modeling & Prisma ORM',
            weeks: 'Weeks 9 - 11',
            commitment: '8 hrs/week',
            status: 'upcoming',
            icon: 'Database',
            description: 'Design normalized schemas, build ACID database transactions, and benchmark read/write query throughput.',
            keySkills: ['PostgreSQL', 'Prisma ORM', 'ACID Transactions', 'B-Tree Indexes'],
            capstoneDeliverable: 'High-Throughput E-Commerce Inventory & Billing Engine',
            proTip: 'Be prepared to explain database isolation levels (Read Committed vs Serializable) in live interview rounds.',
            milestones: [
              { id: 'm7', text: 'Design normalized database schema with foreign key constraints', done: false },
              { id: 'm8', text: 'Implement ACID database transactions with Prisma transaction API', done: false },
              { id: 'm9', text: 'Analyze SQL EXPLAIN queries and add composite indexes to slow lookups', done: false }
            ]
          },
          {
            phase: 4,
            title: 'Docker Containerization & GitHub Actions CI/CD',
            weeks: 'Weeks 12 - 14',
            commitment: '8 hrs/week',
            status: 'upcoming',
            icon: 'Terminal',
            description: 'Package multi-tier applications with multi-stage Dockerfiles and automate deployment pipelines.',
            keySkills: ['Docker Compose', 'Multi-Stage Dockerfiles', 'GitHub Actions', 'AWS / Vercel'],
            capstoneDeliverable: 'Automated CI/CD Deployment with Automated Quality Gates',
            proTip: 'Container size matters. Multi-stage Alpine builds reduce image sizes from 1.2GB down to under 90MB.',
            milestones: [
              { id: 'm10', text: 'Write optimized multi-stage Dockerfile for Next.js & Node.js', done: false },
              { id: 'm11', text: 'Create Docker Compose orchestration with PostgreSQL and Redis containers', done: false },
              { id: 'm12', text: 'Set up GitHub Actions workflow with linting, unit tests, and automated build', done: false }
            ]
          },
          {
            phase: 5,
            title: 'Real-Time WebSockets & Atlassian Interview Drills',
            weeks: 'Weeks 15 - 16',
            commitment: '12 hrs/week',
            status: 'upcoming',
            icon: 'Sparkles',
            description: 'Integrate live multiplayer document collaboration and run comprehensive technical mock interview rounds.',
            keySkills: ['WebSockets', 'Redis Pub/Sub', 'System Design', 'Mock Coding Drills'],
            capstoneDeliverable: 'Full-Stack Portfolio Capstone with Live Demo & Architecture Docs',
            proTip: 'In Atlassian behavioral rounds, structure answers using the STAR method highlighting collaboration and problem impact.',
            milestones: [
              { id: 'm13', text: 'Build real-time live cursor & chat broadcasting with WebSockets & Redis', done: false },
              { id: 'm14', text: 'Conduct 3 full-stack system design and live pair-programming mock drills', done: false },
              { id: 'm15', text: 'Deploy production capstone with live link and verified GitHub README', done: false }
            ]
          }
        ],
        interviewQAs: [
          {
            q: 'What are React Server Components and how do they differ from Client Components?',
            a: 'React Server Components execute strictly on the server and do not ship JavaScript runtime code to the browser bundle, drastically speeding up initial page loads and SEO rendering.'
          }
        ]
      },
      {
        id: 'twin-ananya',
        name: 'Ananya Roy',
        initials: 'AR',
        gender: 'female',
        verified: true,
        currentCompany: 'Swiggy',
        currentRole: 'Senior Full Stack Engineer',
        package: '25 LPA',
        batch: 'Class of 2021',
        department: 'Computer Science',
        stackFocus: 'React & Python FastAPI',
        advice: 'Focus on end-to-end API latency. Interviewers love when you can explain how caching at Redis layer reduces database query load by 80%.',
        missingTools: [
          {
            toolNumber: 1,
            title: 'Python FastAPI & Asynchronous Web APIs',
            category: 'High-Performance Python',
            duration: '4 Weeks (8 hrs/week)',
            whyItMattered: 'Built lightning-fast asynchronous REST APIs with Pydantic type validation and Swagger documentation.',
            practiceProject: 'Real-Time Food Delivery Tracking Backend with WebSockets',
            projectDescription: 'Build async endpoints with FastAPI, WebSockets live rider location broadcasting, and Pydantic schemas.',
            keySkills: ['FastAPI Async/Await', 'Pydantic V2', 'SQLAlchemy 2.0', 'WebSockets'],
            youtubeCourses: [
              {
                title: 'FastAPI Full Course - Python Web Development',
                channel: 'freeCodeCamp.org',
                duration: '3h 30m',
                views: '1.1M views',
                link: 'https://www.youtube.com'
              }
            ]
          },
          {
            toolNumber: 2,
            title: 'React 19 & Redux Toolkit State Management',
            category: 'Frontend State Architecture',
            duration: '4 Weeks (10 hrs/week)',
            whyItMattered: 'Demonstrated deterministic state handling across complex multi-step checkout and cart screens.',
            practiceProject: 'Interactive Multi-Vendor Restaurant Cart with RTK Query',
            projectDescription: 'Implement Redux Toolkit with RTK Query automated caching, optimistic UI updates, and local storage persistence.',
            keySkills: ['Redux Toolkit', 'RTK Query', 'Custom Middleware', 'Memoized Selectors'],
            youtubeCourses: [
              {
                title: 'Redux Toolkit Complete Tutorial 2026',
                channel: 'Dave Gray',
                duration: '2h 00m',
                views: '430K views',
                link: 'https://www.youtube.com'
              }
            ]
          },
          {
            toolNumber: 3,
            title: 'Docker & AWS Elastic Beanstalk Deployment',
            category: 'DevOps & Deployment',
            duration: '3 Weeks (8 hrs/week)',
            whyItMattered: 'Packaged frontend and backend microservices into production containers with automated health checks.',
            practiceProject: 'Full-Stack Containerized App Deployed on AWS',
            projectDescription: 'Containerize React + FastAPI with Nginx reverse proxy and deploy on AWS Elastic Beanstalk with SSL.',
            keySkills: ['Multi-Stage Dockerfiles', 'AWS Elastic Beanstalk', 'Nginx Config', 'Environment Secrets'],
            youtubeCourses: [
              {
                title: 'Deploy Full Stack Apps on AWS',
                channel: 'Traversy Media',
                duration: '1h 30m',
                views: '520K views',
                link: 'https://www.youtube.com'
              }
            ]
          }
        ],
        roadmapPhases: [
          {
            phase: 1,
            title: 'FastAPI & Async Python Architecture',
            weeks: 'Weeks 1 - 4',
            commitment: '8 hrs/week',
            status: 'ready',
            description: 'Master async def, Pydantic schemas, and SQLAlchemy async sessions.',
            milestones: [
              { id: 'm1', text: 'Build FastAPI microservice with JWT auth and Swagger UI', done: false }
            ]
          }
        ],
        interviewQAs: [
          {
            q: 'Why is FastAPI faster than traditional Flask/Django for I/O heavy operations?',
            a: 'FastAPI is built on Starlette and ASGI (Asynchronous Server Gateway Interface), utilizing Python’s asyncio event loop to handle thousands of concurrent non-blocking network requests on a single worker.'
          }
        ]
      }
    ]
  },

  'AI / ML Engineer': {
    roleTitle: 'AI / ML Engineer',
    alumniTwins: [
      {
        id: 'twin-vikram',
        name: 'Vikram Sengupta',
        initials: 'VS',
        gender: 'male',
        verified: true,
        currentCompany: 'NVIDIA',
        currentRole: 'Machine Learning Engineer',
        package: '42 LPA',
        batch: 'Class of 2021',
        department: 'Computer Science',
        stackFocus: 'PyTorch Deep Learning & TensorRT',
        baselineSkills: ['Python', 'Basic SQL', 'HTML/CSS'],
        advice: 'Master the math behind loss functions, gradient descent, and attention mechanisms, then show you can deploy models to production with low inference latency.',
        missingTools: [
          {
            toolNumber: 1,
            title: 'PyTorch Deep Learning & Transformers',
            category: 'Deep Learning',
            duration: '6 Weeks (12 hrs/week)',
            whyItMattered: 'Built and fine-tuned custom vision and LLM models from scratch using PyTorch training loops.',
            practiceProject: 'Multi-Modal Vision & Text Embedding Search Engine',
            projectDescription: 'Train a CLIP-style neural network with contrastive loss to search images using natural language text prompts.',
            keySkills: ['PyTorch', 'Transformer Attention', 'Custom Loss Functions', 'CUDA Acceleration'],
            youtubeCourses: [
              {
                title: 'PyTorch for Deep Learning Bootcamp',
                channel: 'freeCodeCamp.org',
                duration: '10h 30m',
                views: '1.9M views',
                link: 'https://www.youtube.com/watch?v=V_xro1fmxyA'
              }
            ]
          },
          {
            toolNumber: 2,
            title: 'LLM Fine-Tuning & Vector Databases (RAG)',
            category: 'Generative AI',
            duration: '4 Weeks (10 hrs/week)',
            whyItMattered: 'Demonstrated real-world GenAI integration with LangChain, Qdrant/Pinecone, and LoRA/QLoRA parameter-efficient fine-tuning.',
            practiceProject: 'Enterprise Document RAG Assistant with Hybrid Search',
            projectDescription: 'Build an end-to-end RAG system with semantic chunking, dense vector retrieval, and LLM re-ranking.',
            keySkills: ['LangChain / LlamaIndex', 'Pinecone / Chroma', 'LoRA Fine-tuning', 'Prompt Engineering'],
            youtubeCourses: [
              {
                title: 'Retrieval Augmented Generation (RAG) Masterclass',
                channel: 'DeepLearning.AI',
                duration: '2h 15m',
                views: '820K views',
                link: 'https://www.youtube.com/watch?v=wXF_1w2y2G0'
              }
            ]
          },
          {
            toolNumber: 3,
            title: 'MLOps, Docker & FastAPI Low-Latency Deployment',
            category: 'MLOps & Inference',
            duration: '4 Weeks (8 hrs/week)',
            whyItMattered: 'Proved models could be packaged into microservices with ONNX runtime, Triton Inference Server, and batch scheduling.',
            practiceProject: 'Real-Time Sentiment & Fraud Detection API',
            projectDescription: 'Deploy an ONNX-quantized transformer model on FastAPI with asynchronous batching serving 500 req/sec under 25ms latency.',
            keySkills: ['FastAPI', 'ONNX Runtime', 'Triton Server', 'Model Quantization'],
            youtubeCourses: [
              {
                title: 'FastAPI for Machine Learning Deployment',
                channel: 'StatQuest / Josh Starmer',
                duration: '1h 45m',
                views: '650K views',
                link: 'https://www.youtube.com/watch?v=0sOvCWFmrtA'
              }
            ]
          }
        ],
        roadmapPhases: [
          {
            phase: 1,
            title: 'PyTorch Tensors, Autograd & Neural Networks',
            weeks: 'Weeks 1 - 4',
            commitment: '12 hrs/week',
            status: 'ready',
            description: 'Build MLP, CNN, and RNN architectures from scratch with backpropagation.',
            milestones: [
              { id: 'm1', text: 'Build custom PyTorch dataset loaders and validation training loop', done: false }
            ]
          }
        ],
        interviewQAs: [
          {
            q: 'Explain Scaled Dot-Product Attention mathematically in Transformer models.',
            a: 'Attention(Q, K, V) = softmax(Q * K^T / sqrt(d_k)) * V. The scaling factor 1/sqrt(d_k) prevents dot products from growing excessively large for large dimensions, which would push the softmax into regions with vanishing gradients.'
          }
        ]
      },
      {
        id: 'twin-divya',
        name: 'Divya Krishnan',
        initials: 'DK',
        gender: 'female',
        verified: true,
        currentCompany: 'Adobe Sensei',
        currentRole: 'Applied AI Scientist',
        package: '38 LPA',
        batch: 'Class of 2021',
        department: 'Computer Science',
        stackFocus: 'HuggingFace & GenAI Agents',
        advice: 'In AI interviews, always justify your model selection: why a lightweight quantized Mistral model with RAG beats fine-tuning a massive 70B parameter model for specific enterprise tasks.',
        missingTools: [
          {
            toolNumber: 1,
            title: 'HuggingFace Transformers & Tokenization',
            category: 'NLP & Foundation Models',
            duration: '5 Weeks (10 hrs/week)',
            whyItMattered: 'Mastered the HuggingFace ecosystem (Datasets, Accelerate, PEFT) to fine-tune task-specific BERT and Llama models.',
            practiceProject: 'Legal Document Contract Summarizer & Key Clause Extractor',
            projectDescription: 'Fine-tune a lightweight transformer model using LoRA with 4-bit quantization on custom legal datasets.',
            keySkills: ['HuggingFace Hub', 'PEFT / LoRA', 'Custom Tokenizers', 'Evaluation Metrics (ROUGE/BLEU)'],
            youtubeCourses: [
              {
                title: 'HuggingFace Course - Natural Language Processing',
                channel: 'HuggingFace Official',
                duration: '3h 00m',
                views: '920K views',
                link: 'https://www.youtube.com'
              }
            ]
          },
          {
            toolNumber: 2,
            title: 'Autonomous AI Agents (LangGraph & CrewAI)',
            category: 'Agentic AI Architecture',
            duration: '4 Weeks (8 hrs/week)',
            whyItMattered: 'Showcased multi-agent collaboration with tool calling, self-reflection loops, and persistent state memory.',
            practiceProject: 'Multi-Agent Autonomous Market Research Squad',
            projectDescription: 'Build a LangGraph agent system where Analyst, Writer, and Critic agents collaborate to research and draft reports.',
            keySkills: ['LangGraph State Machine', 'Tool Calling / Function Calling', 'Self-Correction Loops', 'CrewAI Roles'],
            youtubeCourses: [
              {
                title: 'LangGraph Complete Tutorial - Build AI Agents',
                channel: 'LangChain Official',
                duration: '1h 45m',
                views: '450K views',
                link: 'https://www.youtube.com'
              }
            ]
          },
          {
            toolNumber: 3,
            title: 'Vector Embeddings & Semantic Search (Qdrant)',
            category: 'Vector Databases',
            duration: '3 Weeks (8 hrs/week)',
            whyItMattered: 'Engineered hybrid dense + sparse BM25 semantic search with Reciprocal Rank Fusion (RRF).',
            practiceProject: 'Hybrid Semantic Code Search Engine with Qdrant',
            projectDescription: 'Index 100,000 GitHub code snippets with OpenAI text-embedding-3-small and Qdrant vector database.',
            keySkills: ['HNSW Indexing', 'Cosine vs Dot Product Distance', 'Hybrid BM25 + Dense Search', 'Rerankers'],
            youtubeCourses: [
              {
                title: 'Vector Databases for Beginners',
                channel: 'Fireship',
                duration: '15m',
                views: '1.2M views',
                link: 'https://www.youtube.com'
              }
            ]
          }
        ],
        roadmapPhases: [
          {
            phase: 1,
            title: 'Transformer Architectures & HuggingFace',
            weeks: 'Weeks 1 - 4',
            commitment: '10 hrs/week',
            status: 'ready',
            description: 'Master self-attention mechanisms, cross-entropy loss, and HuggingFace pipelines.',
            milestones: [
              { id: 'm1', text: 'Fine-tune BERT model for sentiment analysis with LoRA adapter', done: false }
            ]
          }
        ],
        interviewQAs: [
          {
            q: 'How does LoRA (Low-Rank Adaptation) reduce trainable parameters during LLM fine-tuning?',
            a: 'Instead of updating the full weight matrix W (d x k), LoRA freezes W and decomposes the update matrix delta_W into two low-rank matrices B (d x r) and A (r x k), where rank r << min(d, k). This reduces trainable parameters by 90-99% with minimal accuracy loss.'
          }
        ]
      }
    ]
  },

  'Data Analyst': {
    roleTitle: 'Data Analyst',
    alumniTwins: [
      {
        id: 'twin-anjali',
        name: 'Anjali Rao',
        initials: 'AR',
        gender: 'female',
        verified: true,
        currentCompany: 'Amazon',
        currentRole: 'Business Intelligence Engineer',
        package: '22 LPA',
        batch: 'Class of 2022',
        department: 'Information Science',
        stackFocus: 'Advanced SQL & Tableau',
        baselineSkills: ['Python', 'Basic SQL', 'HTML/CSS'],
        advice: 'Always connect data analysis directly to commercial business decisions, ROI, customer churn reduction, and executive dashboards.',
        missingTools: [
          {
            toolNumber: 1,
            title: 'Advanced SQL & Window Functions',
            category: 'Data Querying',
            duration: '4 Weeks (8 hrs/week)',
            whyItMattered: 'Aced SQL live querying rounds testing window functions (RANK, ROW_NUMBER, LAG/LEAD), CTEs, and recursive queries.',
            practiceProject: 'E-Commerce Cohort Retention & Churn SQL Engine',
            projectDescription: 'Write complex SQL pipelines to compute rolling 30-day retention, customer lifetime value (LTV), and RFM segmentation.',
            keySkills: ['Window Functions', 'CTEs & Subqueries', 'Query Optimization', 'Star Schema Design'],
            youtubeCourses: [
              {
                title: 'Advanced SQL for Data Analysts Tutorial',
                channel: 'Luke Barousse',
                duration: '2h 10m',
                views: '1.4M views',
                link: 'https://www.youtube.com/watch?v=7mz73uXD9DA'
              }
            ]
          },
          {
            toolNumber: 2,
            title: 'Tableau & Power BI Executive Dashboards',
            category: 'Data Visualization',
            duration: '3 Weeks (8 hrs/week)',
            whyItMattered: 'Showcased interactive business dashboards with drill-downs, calculated fields, and executive KPI cards.',
            practiceProject: 'SaaS Revenue & Sales Performance Executive Dashboard',
            projectDescription: 'Build an interactive multi-page Tableau dashboard tracking MRR, customer acquisition cost (CAC), and regional growth.',
            keySkills: ['Calculated Fields', 'LOD Expressions', 'Data Modeling in Power BI', 'Storyboarding'],
            youtubeCourses: [
              {
                title: 'Tableau 2026 Full Course - Learn Tableau in 3 Hours',
                channel: 'freeCodeCamp.org',
                duration: '3h 10m',
                views: '980K views',
                link: 'https://www.youtube.com/watch?v=TPPlX_L_w4M'
              }
            ]
          },
          {
            toolNumber: 3,
            title: 'Python Data Analytics (Pandas, NumPy, Seaborn)',
            category: 'Statistical Computing',
            duration: '4 Weeks (10 hrs/week)',
            whyItMattered: 'Performed statistical exploratory data analysis (EDA), automated Excel workflows, and built predictive regression trends.',
            practiceProject: 'Customer Churn Risk Prediction & Factor Analysis',
            projectDescription: 'Analyze 50,000 customer records in Jupyter Notebook with Pandas data cleaning, Seaborn heatmaps, and logistic regression.',
            keySkills: ['Pandas GroupBy & Merge', 'Data Wrangling', 'Hypothesis Testing (A/B Testing)', 'Matplotlib / Seaborn'],
            youtubeCourses: [
              {
                title: 'Python Pandas Data Science Tutorial',
                channel: 'Keith Galli',
                duration: '1h 00m',
                views: '1.6M views',
                link: 'https://www.youtube.com/watch?v=vmEHCJofslg'
              }
            ]
          }
        ],
        roadmapPhases: [
          {
            phase: 1,
            title: 'Advanced SQL & Data Warehousing',
            weeks: 'Weeks 1 - 4',
            commitment: '8 hrs/week',
            status: 'ready',
            description: 'Master analytical SQL aggregations, window partition clauses, and snowflake schemas.',
            milestones: [
              { id: 'm1', text: 'Solve 25 LeetCode / HackerRank SQL medium and hard challenges', done: false }
            ]
          }
        ],
        interviewQAs: [
          {
            q: 'Explain the difference between RANK(), DENSE_RANK(), and ROW_NUMBER() in SQL.',
            a: 'ROW_NUMBER() always assigns a unique sequential integer to each row. RANK() assigns identical ranks to ties and skips subsequent numbers (e.g. 1, 2, 2, 4). DENSE_RANK() assigns identical ranks to ties without skipping numbers (e.g. 1, 2, 2, 3).'
          }
        ]
      },
      {
        id: 'twin-harish',
        name: 'Harish Kumar',
        initials: 'HK',
        gender: 'male',
        verified: true,
        currentCompany: 'Deloitte',
        currentRole: 'Senior Data Consultant',
        package: '18 LPA',
        batch: 'Class of 2021',
        department: 'Information Science',
        stackFocus: 'Power BI & Snowflake ETL',
        advice: 'Consulting interviews prioritize clean data modeling (Star Schemas), DAX calculated columns, and clear executive communication of insights.',
        missingTools: [
          {
            toolNumber: 1,
            title: 'Microsoft Power BI & DAX Advanced Modeling',
            category: 'Business Intelligence',
            duration: '4 Weeks (8 hrs/week)',
            whyItMattered: 'Built dimensional data models with advanced DAX measures (CALCULATE, ALL, FILTER) for corporate analytics.',
            practiceProject: 'Supply Chain Logistics & Inventory Optimization Dashboard',
            projectDescription: 'Model multi-table fact and dimension relationships with DAX time-intelligence formulas.',
            keySkills: ['DAX Formulas', 'Power Query (M)', 'Row-Level Security (RLS)', 'Star Schemas'],
            youtubeCourses: [
              {
                title: 'Power BI Full Course 2026 - Beginner to Pro',
                channel: 'Kevin Stratvert',
                duration: '2h 15m',
                views: '1.8M views',
                link: 'https://www.youtube.com'
              }
            ]
          },
          {
            toolNumber: 2,
            title: 'Snowflake Cloud Data Warehouse & SQL',
            category: 'Cloud Warehousing',
            duration: '3 Weeks (8 hrs/week)',
            whyItMattered: 'Demonstrated cloud data warehouse querying with virtual warehouses, time-travel, and zero-copy cloning.',
            practiceProject: 'Automated ETL Ingestion Pipeline into Snowflake',
            projectDescription: 'Ingest raw CSV and JSON records into Snowflake staging tables with Snowpipe and analytical SQL views.',
            keySkills: ['Snowflake Virtual Warehouses', 'Snowpipe ETL', 'Time Travel SQL', 'Clustering Keys'],
            youtubeCourses: [
              {
                title: 'Snowflake Complete Tutorial for Beginners',
                channel: 'freeCodeCamp.org',
                duration: '2h 00m',
                views: '670K views',
                link: 'https://www.youtube.com'
              }
            ]
          },
          {
            toolNumber: 3,
            title: 'A/B Testing & Statistical Experimentation',
            category: 'Business Statistics',
            duration: '3 Weeks (6 hrs/week)',
            whyItMattered: 'Designed hypothesis tests, computed p-values, sample sizes, and statistical power for product feature releases.',
            practiceProject: 'Conversion Rate Experimentation & Significance Engine',
            projectDescription: 'Calculate two-tailed Z-tests and confidence intervals for 100,000 randomized user sessions.',
            keySkills: ['Hypothesis Testing', 'P-Values & Alpha', 'Sample Size Determination', 'Bonferroni Correction'],
            youtubeCourses: [
              {
                title: 'A/B Testing Masterclass for Data Analysts',
                channel: 'StatQuest / Josh Starmer',
                duration: '1h 15m',
                views: '480K views',
                link: 'https://www.youtube.com'
              }
            ]
          }
        ],
        roadmapPhases: [
          {
            phase: 1,
            title: 'Power BI & Star Schema Modeling',
            weeks: 'Weeks 1 - 4',
            commitment: '8 hrs/week',
            status: 'ready',
            description: 'Master Power Query ETL, DAX expressions, and relationship cardinalities.',
            milestones: [
              { id: 'm1', text: 'Build interactive Power BI report with dynamic slicers and DAX measures', done: false }
            ]
          }
        ],
        interviewQAs: [
          {
            q: 'How does the CALCULATE function work in Power BI DAX?',
            a: 'CALCULATE evaluates an expression in a modified filter context. It is the only DAX function capable of overriding or injecting new filter parameters into existing visual filters.'
          }
        ]
      }
    ]
  },

  'DevOps Engineer': {
    roleTitle: 'DevOps Engineer',
    alumniTwins: [
      {
        id: 'twin-kabir',
        name: 'Kabir Saxena',
        initials: 'KS',
        gender: 'male',
        verified: true,
        currentCompany: 'Uber',
        currentRole: 'DevOps / Site Reliability Engineer',
        package: '30 LPA',
        batch: 'Class of 2021',
        department: 'Computer Science',
        stackFocus: 'Kubernetes & ArgoCD GitOps',
        baselineSkills: ['Python', 'Basic SQL', 'HTML/CSS'],
        advice: 'Automate everything. Demonstrate that your infrastructure is version-controlled with Terraform, deployed via GitHub Actions, and monitored with Prometheus.',
        missingTools: [
          {
            toolNumber: 1,
            title: 'Kubernetes (K8s) Cluster Orchestration',
            category: 'Container Orchestration',
            duration: '4 Weeks (10 hrs/week)',
            whyItMattered: 'Demonstrated production zero-downtime rolling updates, ingress controllers, ConfigMaps, and cluster autoscaling in Uber interviews.',
            practiceProject: 'High-Availability Microservices Deployment on Minikube / EKS',
            projectDescription: 'Deploy scalable pods with horizontal pod autoscalers (HPA), persistent volume claims, and Helm charts.',
            keySkills: ['Kubernetes Manifests', 'Helm Charts', 'Ingress & TLS', 'Cluster Autoscaling'],
            youtubeCourses: [
              {
                title: 'Kubernetes Tutorial for Beginners [Full Course]',
                channel: 'TechWorld with Nana',
                duration: '3h 30m',
                views: '3.6M views',
                link: 'https://www.youtube.com/watch?v=X48VuDVv0do'
              }
            ]
          },
          {
            toolNumber: 2,
            title: 'CI/CD Pipelines with GitHub Actions & ArgoCD',
            category: 'Continuous Delivery',
            duration: '3 Weeks (8 hrs/week)',
            whyItMattered: 'Showcased automated GitOps workflows that run linting, unit tests, build Docker containers, and sync with production.',
            practiceProject: 'GitOps Continuous Deployment Pipeline with ArgoCD',
            projectDescription: 'Set up end-to-end GitOps delivery with automated semantic versioning, vulnerability scanning with Trivy, and automated rollback.',
            keySkills: ['GitHub Actions Workflows', 'ArgoCD GitOps', 'Docker Hub Registry', 'Trivy Security Scan'],
            youtubeCourses: [
              {
                title: 'GitOps with ArgoCD Complete Tutorial',
                channel: 'Nana / DevOps Toolkit',
                duration: '1h 45m',
                views: '420K views',
                link: 'https://www.youtube.com/watch?v=MeU5_r9V-1E'
              }
            ]
          },
          {
            toolNumber: 3,
            title: 'Terraform Infrastructure as Code (IaC)',
            category: 'Cloud Infrastructure',
            duration: '3 Weeks (8 hrs/week)',
            whyItMattered: 'Proved the ability to spin up entire multi-region AWS/Azure infrastructure with repeatable, declarative code.',
            practiceProject: 'Multi-AZ AWS VPC & Managed EKS Cluster with Terraform',
            projectDescription: 'Write modular Terraform scripts for VPC subnets, NAT Gateways, IAM roles, security groups, and remote S3 state locks.',
            keySkills: ['Terraform Modules', 'State Management & S3 Lock', 'AWS VPC / IAM', 'Terragrunt'],
            youtubeCourses: [
              {
                title: 'Terraform Course - Automate Your AWS Cloud Infrastructure',
                channel: 'freeCodeCamp.org',
                duration: '2h 30m',
                views: '1.1M views',
                link: 'https://www.youtube.com/watch?v=SLB_c_ayRMo'
              }
            ]
          },
          {
            toolNumber: 4,
            title: 'Prometheus & Grafana Telemetry & Alerting',
            category: 'Observability & SRE',
            duration: '3 Weeks (8 hrs/week)',
            whyItMattered: 'Built real-time telemetry dashboards tracking RED metrics (Rate, Errors, Duration) and alert manager triggers.',
            practiceProject: 'Full-Stack Cluster Monitoring & PagerDuty Alerting System',
            projectDescription: 'Instrument microservices with Prometheus metrics exporter, configure Grafana dashboards, and route alerts via Alertmanager.',
            keySkills: ['Prometheus Metrics', 'Grafana Dashboards', 'Alertmanager', 'RED Metrics'],
            youtubeCourses: [
              {
                title: 'Prometheus & Grafana Monitoring Full Course',
                channel: 'TechWorld with Nana',
                duration: '2h 15m',
                views: '1.3M views',
                link: 'https://www.youtube.com'
              }
            ]
          },
          {
            toolNumber: 5,
            title: 'Docker Multi-Stage Builds & Container Security',
            category: 'Containerization',
            duration: '2 Weeks (6 hrs/week)',
            whyItMattered: 'Created secure, minimal Linux containers under 40MB and passed automated security vulnerability gates.',
            practiceProject: 'Hardened Container Pipeline with Trivy Scan',
            projectDescription: 'Build ultra-small Alpine/Distroless Docker images, configure non-root users, and integrate automated security scans.',
            keySkills: ['Multi-Stage Docker', 'Distroless Images', 'Trivy Scanning', 'Container Security'],
            youtubeCourses: [
              {
                title: 'Docker & Container Security Masterclass',
                channel: 'freeCodeCamp.org',
                duration: '2h 00m',
                views: '890K views',
                link: 'https://www.youtube.com'
              }
            ]
          },
          {
            toolNumber: 6,
            title: 'Linux Kernel Tuning & Site Reliability Engineering (SRE)',
            category: 'System Performance',
            duration: '3 Weeks (8 hrs/week)',
            whyItMattered: 'Troubleshot live network socket saturation, CPU throttling, and kernel parameters in high-traffic production scenarios.',
            practiceProject: 'High-Concurrency Linux Benchmark & Troubleshooting Suite',
            projectDescription: 'Analyze system bottlenecks using sysstat, htop, tcpdump, strace, and tune sysctl TCP socket buffers.',
            keySkills: ['Linux Systemd', 'Network Diagnostics', 'Sysctl Tuning', 'Strace & Tcpdump'],
            youtubeCourses: [
              {
                title: 'Linux System Administration & SRE Crash Course',
                channel: 'freeCodeCamp.org',
                duration: '3h 15m',
                views: '1.5M views',
                link: 'https://www.youtube.com'
              }
            ]
          }
        ],
        roadmapPhases: [
          {
            phase: 1,
            title: 'Linux Fundamentals & Shell Automation',
            weeks: 'Weeks 1 - 3',
            commitment: '8 hrs/week',
            status: 'ready',
            icon: 'Terminal',
            description: 'Master Bash scripting, process management (systemd), SSH tunneling, and networking diagnostics.',
            keySkills: ['Bash Scripting', 'Systemd Services', 'SSH & Security', 'Networking Tools'],
            capstoneDeliverable: 'Automated Server Health Check & Log Rotation Script',
            proTip: 'Write idempotent bash scripts with strict error handling (`set -euo pipefail`).',
            milestones: [
              { id: 'm1', text: 'Write automated server health check and log rotation scripts', done: false },
              { id: 'm2', text: 'Configure systemd service unit files and cron job schedulers', done: false }
            ]
          },
          {
            phase: 2,
            title: 'Docker & Container Hardening',
            weeks: 'Weeks 4 - 6',
            commitment: '8 hrs/week',
            status: 'upcoming',
            icon: 'Layers',
            description: 'Package applications into secure, lightweight container images using multi-stage builds.',
            keySkills: ['Docker Multi-Stage', 'Distroless Containers', 'Trivy Scanning', 'Docker Compose'],
            capstoneDeliverable: 'Hardened Production Dockerfile Under 40MB',
            proTip: 'Never run containers as root. Create a dedicated unprivileged user in the Dockerfile.',
            milestones: [
              { id: 'm3', text: 'Build optimized multi-stage container images with minimal attack surface', done: false },
              { id: 'm4', text: 'Automate image vulnerability scanning with Trivy in CI pipeline', done: false }
            ]
          },
          {
            phase: 3,
            title: 'Kubernetes Orchestration & Helm',
            weeks: 'Weeks 7 - 9',
            commitment: '10 hrs/week',
            status: 'upcoming',
            icon: 'Cloud',
            description: 'Deploy multi-pod architectures with automated rollouts, ingress routing, and Helm packaging.',
            keySkills: ['K8s Deployments', 'Services & Ingress', 'Helm Charts', 'HPA Autoscaling'],
            capstoneDeliverable: 'Multi-Service Microservice Fleet Managed by Helm',
            proTip: 'Always configure readiness and liveness probes to prevent routing traffic to dead pods.',
            milestones: [
              { id: 'm5', text: 'Deploy microservices with Deployments, Services, ConfigMaps, and Secrets', done: false },
              { id: 'm6', text: 'Package application into Helm charts and configure Horizontal Pod Autoscalers', done: false }
            ]
          },
          {
            phase: 4,
            title: 'Infrastructure as Code with Terraform',
            weeks: 'Weeks 10 - 12',
            commitment: '10 hrs/week',
            status: 'upcoming',
            icon: 'Server',
            description: 'Provision reproducible cloud infrastructure across VPCs, subnets, and Kubernetes clusters.',
            keySkills: ['Terraform Modules', 'Remote S3 State', 'AWS VPC / IAM', 'State Locking'],
            capstoneDeliverable: 'Modular AWS Multi-AZ VPC and EKS Terraform Template',
            proTip: 'Store Terraform state in remote S3 buckets with DynamoDB state locking to prevent concurrency collisions.',
            milestones: [
              { id: 'm7', text: 'Write modular Terraform definitions for VPC, subnets, and security groups', done: false },
              { id: 'm8', text: 'Implement remote S3 backend state locking with DynamoDB tables', done: false }
            ]
          },
          {
            phase: 5,
            title: 'CI/CD Pipelines & GitOps with ArgoCD',
            weeks: 'Weeks 13 - 15',
            commitment: '8 hrs/week',
            status: 'upcoming',
            icon: 'Code2',
            description: 'Automate end-to-end code delivery from pull request to live Kubernetes cluster synchronization.',
            keySkills: ['GitHub Actions', 'ArgoCD GitOps', 'Automated Testing', 'Semantic Releases'],
            capstoneDeliverable: 'Zero-Touch GitOps Continuous Deployment Pipeline',
            proTip: 'Separate application code repositories from GitOps configuration repositories.',
            milestones: [
              { id: 'm9', text: 'Configure GitHub Actions for automated linting, test suites, and Docker push', done: false },
              { id: 'm10', text: 'Set up ArgoCD applications for automated declarative sync with GitHub', done: false }
            ]
          },
          {
            phase: 6,
            title: 'SRE Observability & Production Readiness',
            weeks: 'Weeks 16 - 18',
            commitment: '10 hrs/week',
            status: 'upcoming',
            icon: 'BrainCircuit',
            description: 'Monitor real-time system metrics, configure alert routing, and conduct mock SRE outage drills.',
            keySkills: ['Prometheus Scraping', 'Grafana Dashboards', 'Alertmanager', 'SLOs & SLIs'],
            capstoneDeliverable: 'Production SRE Monitoring Hub with PagerDuty / Slack Webhooks',
            proTip: 'Focus alert thresholds on user-facing symptoms (high error rate, latency) rather than noisy CPU spikes.',
            milestones: [
              { id: 'm11', text: 'Instrument services with Prometheus and build Grafana latency/throughput dashboards', done: false },
              { id: 'm12', text: 'Configure Alertmanager alert routes and complete end-to-end incident response drill', done: false }
            ]
          }
        ],
        interviewQAs: [
          {
            q: 'What happens when a Kubernetes Pod crashes and how does the ReplicaSet handle it?',
            a: 'The kubelet detects the container termination and triggers the restart policy (e.g. Always/OnFailure). Simultaneously, the ReplicaSet controller notices the current running replica count is below target and schedules a new Pod on an available node via kube-scheduler.'
          },
          {
            q: 'How do you design a zero-downtime deployment strategy?',
            a: 'Using Kubernetes RollingUpdate deployments with configured maxSurge/maxUnavailable values, paired with proper readiness probes to ensure new pods receive traffic only after warm-up.'
          }
        ]
      },
      {
        id: 'twin-tarun',
        name: 'Tarun Bhatia',
        initials: 'TB',
        gender: 'male',
        verified: true,
        currentCompany: 'Salesforce',
        currentRole: 'DevOps & SRE Specialist',
        package: '27 LPA',
        batch: 'Class of 2021',
        department: 'Information Science',
        stackFocus: 'Prometheus Monitoring & AWS CI/CD',
        advice: 'Focus heavily on Observability (Prometheus metrics, Grafana dashboards, Jaeger tracing). Companies want engineers who can debug outages in minutes.',
        missingTools: [
          {
            toolNumber: 1,
            title: 'Prometheus & Grafana Observability',
            category: 'System Monitoring',
            duration: '4 Weeks (8 hrs/week)',
            whyItMattered: 'Built real-time telemetry dashboards tracking RED metrics (Rate, Errors, Duration) and alert manager triggers.',
            practiceProject: 'Full-Stack Cluster Monitoring & PagerDuty Alerting System',
            projectDescription: 'Instrument Node/Java services with Prometheus client, configure Grafana dashboards, and route alerts.',
            keySkills: ['PromQL Queries', 'Grafana Dashboards', 'Alertmanager Rules', 'Node Exporter'],
            youtubeCourses: [
              {
                title: 'Prometheus & Grafana Monitoring Full Course',
                channel: 'TechWorld with Nana',
                duration: '2h 15m',
                views: '1.3M views',
                link: 'https://www.youtube.com'
              }
            ]
          },
          {
            toolNumber: 2,
            title: 'AWS CloudFormation & CodePipeline',
            category: 'AWS Cloud Automation',
            duration: '4 Weeks (8 hrs/week)',
            whyItMattered: 'Configured automated AWS release stages from GitHub pull requests to production ECS clusters.',
            practiceProject: 'Automated Blue/Green AWS Deployment Pipeline',
            projectDescription: 'Implement AWS CodePipeline with automated test gates and zero-downtime blue/green swap on ECS.',
            keySkills: ['AWS CodePipeline', 'CodeBuild & CodeDeploy', 'Blue/Green Deployments', 'IAM Roles'],
            youtubeCourses: [
              {
                title: 'AWS DevOps CI/CD Masterclass',
                channel: 'freeCodeCamp.org',
                duration: '3h 00m',
                views: '790K views',
                link: 'https://www.youtube.com'
              }
            ]
          },
          {
            toolNumber: 3,
            title: 'Ansible Configuration Management',
            category: 'Infrastructure Automation',
            duration: '3 Weeks (6 hrs/week)',
            whyItMattered: 'Automated OS patching, security hardening, and software configuration across hundreds of EC2 instances.',
            practiceProject: 'Automated Server Provisioning Playbooks with Ansible',
            projectDescription: 'Write idempotent Ansible playbooks for Nginx configuration, SSL certificates, and firewall policies.',
            keySkills: ['Ansible Playbooks', 'Roles & Inventory', 'Idempotency', 'Ansible Vault'],
            youtubeCourses: [
              {
                title: 'Ansible Tutorial for Beginners',
                channel: 'TechWorld with Nana',
                duration: '1h 30m',
                views: '840K views',
                link: 'https://www.youtube.com'
              }
            ]
          },
          {
            toolNumber: 4,
            title: 'Docker Container Security & Hardening',
            category: 'Container Security',
            duration: '3 Weeks (6 hrs/week)',
            whyItMattered: 'Secured build environments and prevented container breakout attacks.',
            practiceProject: 'Hardened Microservice Base Image Pipeline',
            projectDescription: 'Implement non-root user execution, read-only root filesystems, and vulnerability scanning.',
            keySkills: ['Docker Bench Security', 'Trivy Scans', 'Distroless Images', 'Capabilities Drop'],
            youtubeCourses: [
              {
                title: 'Container Security Best Practices',
                channel: 'freeCodeCamp.org',
                duration: '1h 45m',
                views: '520K views',
                link: 'https://www.youtube.com'
              }
            ]
          },
          {
            toolNumber: 5,
            title: 'Kubernetes Production Operations',
            category: 'Orchestration',
            duration: '4 Weeks (10 hrs/week)',
            whyItMattered: 'Demonstrated multi-cluster operations, network policies, and pod disruption budgets in Salesforce interviews.',
            practiceProject: 'Resilient Kubernetes Multi-Zone Cluster',
            projectDescription: 'Configure PodDisruptionBudgets, NetworkPolicies, and topology spread constraints.',
            keySkills: ['K8s Network Policies', 'PodDisruptionBudgets', 'Affinity & Anti-Affinity', 'RBAC'],
            youtubeCourses: [
              {
                title: 'Kubernetes in Production Masterclass',
                channel: 'TechWorld with Nana',
                duration: '2h 50m',
                views: '940K views',
                link: 'https://www.youtube.com'
              }
            ]
          },
          {
            toolNumber: 6,
            title: 'Distributed Tracing with OpenTelemetry & Jaeger',
            category: 'Observability',
            duration: '3 Weeks (8 hrs/week)',
            whyItMattered: 'Enabled end-to-end request tracing across dozens of microservices to pinpoint latency bottlenecks.',
            practiceProject: 'Distributed Tracing Architecture with OpenTelemetry',
            projectDescription: 'Trace HTTP/gRPC requests through API gateway, backend services, and database layers with Jaeger UI.',
            keySkills: ['OpenTelemetry SDK', 'Jaeger Tracing', 'Context Propagation', 'Span Attributes'],
            youtubeCourses: [
              {
                title: 'OpenTelemetry & Distributed Tracing Guide',
                channel: 'freeCodeCamp.org',
                duration: '1h 30m',
                views: '410K views',
                link: 'https://www.youtube.com'
              }
            ]
          }
        ],
        roadmapPhases: [
          {
            phase: 1,
            title: 'Prometheus & Observability Foundations',
            weeks: 'Weeks 1 - 3',
            commitment: '8 hrs/week',
            status: 'ready',
            icon: 'Terminal',
            description: 'Instrument services and configure real-time alert rules.',
            keySkills: ['Prometheus Setup', 'Metrics Exporters', 'Basic PromQL', 'Node Exporter'],
            capstoneDeliverable: 'Production Prometheus Scraping Architecture',
            proTip: 'Keep metric cardinality low to avoid high memory usage in Prometheus.',
            milestones: [
              { id: 'm13', text: 'Set up Prometheus server and instrument services with metric endpoints', done: false },
              { id: 'm14', text: 'Configure Node Exporter for system-level CPU/Memory metric collection', done: false }
            ]
          },
          {
            phase: 2,
            title: 'Grafana Dashboarding & Alertmanager',
            weeks: 'Weeks 4 - 6',
            commitment: '8 hrs/week',
            status: 'upcoming',
            icon: 'Layers',
            description: 'Build insightful operational dashboards and automated notification routes.',
            keySkills: ['Grafana Panels', 'Alertmanager Webhooks', 'PromQL Rate & Histogram', 'SLO Dashboards'],
            capstoneDeliverable: 'Executive & Engineering Operational Telemetry Dashboard',
            proTip: 'Group alerts logically to prevent alert fatigue during outages.',
            milestones: [
              { id: 'm15', text: 'Build Grafana dashboard monitoring API latencies, error rates, and saturation', done: false },
              { id: 'm16', text: 'Configure Alertmanager notification routing to Slack and email channels', done: false }
            ]
          },
          {
            phase: 3,
            title: 'AWS CloudFormation & CodePipeline CI/CD',
            weeks: 'Weeks 7 - 9',
            commitment: '10 hrs/week',
            status: 'upcoming',
            icon: 'Cloud',
            description: 'Automate zero-downtime release pipelines across AWS ECS and serverless functions.',
            keySkills: ['AWS CodePipeline', 'CodeBuild', 'Blue/Green ECS', 'CloudFormation'],
            capstoneDeliverable: 'Automated Blue/Green AWS Deployment Pipeline',
            proTip: 'Incorporate automated rollback triggers based on CloudWatch error alarm thresholds.',
            milestones: [
              { id: 'm17', text: 'Build automated AWS CodePipeline with build and test stages', done: false },
              { id: 'm18', text: 'Implement zero-downtime blue/green deployment strategy on ECS', done: false }
            ]
          },
          {
            phase: 4,
            title: 'Ansible Configuration Management',
            weeks: 'Weeks 10 - 12',
            commitment: '8 hrs/week',
            status: 'upcoming',
            icon: 'Server',
            description: 'Automate fleet-wide server provisioning, security configurations, and OS patch routines.',
            keySkills: ['Ansible Roles', 'Inventory Management', 'Idempotent Playbooks', 'Ansible Vault'],
            capstoneDeliverable: 'Multi-Node Server Hardening Ansible Playbook Suite',
            proTip: 'Use Ansible Vault to securely encrypt secrets and passwords stored in Git.',
            milestones: [
              { id: 'm19', text: 'Write reusable Ansible roles for Nginx web server and security baseline', done: false },
              { id: 'm20', text: 'Automate fleet provisioning and secrets encryption with Ansible Vault', done: false }
            ]
          },
          {
            phase: 5,
            title: 'Kubernetes Production Hardening & Network Policies',
            weeks: 'Weeks 13 - 15',
            commitment: '10 hrs/week',
            status: 'upcoming',
            icon: 'Code2',
            description: 'Implement zero-trust container networking, pod disruption budgets, and resource quotas.',
            keySkills: ['Network Policies', 'PodDisruptionBudgets', 'Resource Quotas', 'Cluster RBAC'],
            capstoneDeliverable: 'Production Hardened Kubernetes Cluster Template',
            proTip: 'Always apply default-deny ingress network policies for sensitive microservices.',
            milestones: [
              { id: 'm21', text: 'Enforce default-deny Kubernetes NetworkPolicies for inter-service communication', done: false },
              { id: 'm22', text: 'Configure PodDisruptionBudgets and ResourceQuotas to ensure high availability', done: false }
            ]
          },
          {
            phase: 6,
            title: 'Distributed Tracing & SRE Mock Outage Drills',
            weeks: 'Weeks 16 - 18',
            commitment: '10 hrs/week',
            status: 'upcoming',
            icon: 'BrainCircuit',
            description: 'Instrument services with OpenTelemetry and resolve simulated high-latency production incidents.',
            keySkills: ['OpenTelemetry', 'Jaeger UI', 'Root Cause Analysis', 'Post-Mortems'],
            capstoneDeliverable: 'End-to-End Distributed Tracing Suite with Outage Post-Mortem',
            proTip: 'Document incident timelines rigorously in post-mortem reports to drive systematic improvements.',
            milestones: [
              { id: 'm23', text: 'Instrument distributed microservices with OpenTelemetry and Jaeger tracing', done: false },
              { id: 'm24', text: 'Simulate database latency outage, identify root cause via trace spans, and write post-mortem', done: false }
            ]
          }
        ],
        interviewQAs: [
          {
            q: 'Explain the difference between Push vs Pull metrics collection models in Prometheus.',
            a: 'Prometheus uses a Pull model where the central server scrapes HTTP metric endpoints exposed by target instances at regular intervals. This prevents target failures from overwhelming the monitoring system.'
          },
          {
            q: 'How do you monitor Service Level Objectives (SLOs) using PromQL?',
            a: 'By calculating Error Budgets over 30-day rolling windows using PromQL rate queries on successful vs total HTTP requests, and triggering burn-rate alerts before error budgets are exhausted.'
          }
        ]
      }
    ]
  },
  'Data Scientist': {
    roleTitle: 'Data Scientist',
    category: 'AI & Data Science',
    icon: 'BrainCircuit',
    totalPlacementCount: 41,
    avgPackage: '26 LPA',
    highestPackage: '38 LPA',
    topCompanies: ['Fractal Analytics', 'Microsoft', 'Mu Sigma', 'Walmart Labs'],
    alumniTwins: [
      {
        id: 'twin-swati',
        name: 'Swati Sen',
        initials: 'SS',
        gender: 'female',
        verified: true,
        currentCompany: 'Walmart Global Tech',
        currentRole: 'Data Scientist II',
        package: '28 LPA',
        batch: 'Class of 2022',
        department: 'Computer Science & Engineering',
        stackFocus: 'Python, PyTorch, MLOps & Statistics',
        baselineSkills: ['Python', 'Basic SQL', 'HTML/CSS'],
        advice: 'Data science interviews test statistical rigor, intuition behind loss functions, and practical feature engineering much more than rote model fitting.',
        missingTools: [
          {
            toolNumber: 1,
            title: 'Vectorized Data Pipelines with NumPy, Pandas & Polars',
            category: 'Data Wrangling',
            duration: '3 Weeks (8 hrs/week)',
            whyItMattered: 'Aced technical screening by transforming multi-million row datasets in seconds without slow Python loops.',
            practiceProject: 'High-Throughput E-Commerce Clickstream Feature Store',
            projectDescription: 'Build high-performance data processing pipelines computing rolling window aggregations and customer lifetime metrics.',
            keySkills: ['Vectorized NumPy', 'Polars DataFrames', 'Memory Optimization', 'Parquet Formats'],
            youtubeCourses: [
              {
                title: 'Data Analysis with Python Course [NumPy & Pandas]',
                channel: 'freeCodeCamp.org',
                duration: '4h 20m',
                views: '1.9M views',
                link: 'https://www.youtube.com'
              }
            ]
          },
          {
            toolNumber: 2,
            title: 'Statistical Modeling & A/B Experimentation Design',
            category: 'Statistical Inference',
            duration: '3 Weeks (8 hrs/week)',
            whyItMattered: 'Answered hypothesis testing, p-value correction, and sample size power analysis questions in live rounds.',
            practiceProject: 'Statistical A/B Test Significance Testing Engine',
            projectDescription: 'Implement two-sample hypothesis tests, bootstrap confidence intervals, and Bonferroni corrections for conversion lift.',
            keySkills: ['Hypothesis Testing', 'Power Analysis', 'Bootstrapping', 'Bayesian vs Frequentist'],
            youtubeCourses: [
              {
                title: 'Statistics and Probability Full Course',
                channel: 'StatQuest with Josh Starmer',
                duration: '3h 15m',
                views: '1.4M views',
                link: 'https://www.youtube.com'
              }
            ]
          },
          {
            toolNumber: 3,
            title: 'Applied Machine Learning & Gradient Boosting (XGBoost / LightGBM)',
            category: 'Machine Learning',
            duration: '4 Weeks (10 hrs/week)',
            whyItMattered: 'Cracked the machine coding round by building high-performing customer churn prediction models with hyperparameter tuning.',
            practiceProject: 'Customer Churn & Default Prediction Model with Optuna Tuning',
            projectDescription: 'Train an ensemble XGBoost model with target encoding, SHAP interpretability values, and stratified cross-validation.',
            keySkills: ['XGBoost & LightGBM', 'Optuna Tuning', 'SHAP Explainability', 'Feature Selection'],
            youtubeCourses: [
              {
                title: 'Machine Learning Masterclass with Scikit-Learn and XGBoost',
                channel: 'freeCodeCamp.org',
                duration: '4h 00m',
                views: '1.1M views',
                link: 'https://www.youtube.com'
              }
            ]
          },
          {
            toolNumber: 4,
            title: 'Deep Learning & Neural Architectures (PyTorch)',
            category: 'Deep Learning',
            duration: '3 Weeks (10 hrs/week)',
            whyItMattered: 'Implemented custom PyTorch neural networks with autograd, custom loss functions, and learning rate schedulers.',
            practiceProject: 'Multi-Modal Product Embeddings & Semantic Search Engine',
            projectDescription: 'Train a dual-encoder Siamese network in PyTorch generating dense vectors for similarity search with FAISS.',
            keySkills: ['PyTorch Tensors', 'Custom Loss Functions', 'Transfer Learning', 'FAISS Vector Index'],
            youtubeCourses: [
              {
                title: 'PyTorch for Deep Learning Bootcamp [Full Course]',
                channel: 'freeCodeCamp.org',
                duration: '6h 00m',
                views: '2.5M views',
                link: 'https://www.youtube.com'
              }
            ]
          },
          {
            toolNumber: 5,
            title: 'MLOps, Model Serving & Fast REST APIs',
            category: 'Model Deployment',
            duration: '2 Weeks (8 hrs/week)',
            whyItMattered: 'Set her apart from candidates who only knew notebooks by deploying models into low-latency Dockerized microservices.',
            practiceProject: 'Real-Time Fraud Detection Inference API with FastAPI & Docker',
            projectDescription: 'Package trained models with ONNX runtime inside a sub-10ms FastAPI microservice with Prometheus latency metrics.',
            keySkills: ['FastAPI Model Serving', 'ONNX Runtime', 'Docker Containers', 'Latency Profiling'],
            youtubeCourses: [
              {
                title: 'Deploy Machine Learning Models with FastAPI and Docker',
                channel: 'Krish Naik',
                duration: '1h 45m',
                views: '430K views',
                link: 'https://www.youtube.com'
              }
            ]
          },
          {
            toolNumber: 6,
            title: 'Data Science System Design & Senior Mock Rounds',
            category: 'System Architecture',
            duration: '2 Weeks (8 hrs/week)',
            whyItMattered: 'Designed production recommender systems and passed technical interview loops with structured communication.',
            practiceProject: 'Large-Scale Real-Time Personalized Recommender System Design',
            projectDescription: 'Architect a 2-stage retrieval and ranking pipeline handling 10M daily active users with feature caching.',
            keySkills: ['Recommender Systems', 'Candidate Generation', 'Drift Detection', 'Mock Interview Drills'],
            youtubeCourses: [
              {
                title: 'Machine Learning System Design Interview Guide',
                channel: 'ByteByteGo',
                duration: '1h 50m',
                views: '820K views',
                link: 'https://www.youtube.com'
              }
            ]
          }
        ],
        roadmapPhases: [
          {
            phase: 1,
            title: 'Vectorized Data Pipelines & Exploratory Analytics',
            weeks: 'Weeks 1 - 3',
            commitment: '8 hrs/week',
            status: 'ready',
            icon: 'Database',
            description: 'Master fast in-memory data munging with NumPy, Pandas, and Polars to build automated data prep scripts.',
            keySkills: ['Polars', 'NumPy Vectorization', 'EDA', 'Memory Tuning'],
            capstoneDeliverable: 'Production E-Commerce Feature Generation Pipeline',
            proTip: 'Avoid iterating with for-loops over dataframes; always use vectorized expressions.',
            milestones: [
              { id: 'm1', text: 'Build vectorized data cleaning pipeline handling 10M rows in <5s', done: false },
              { id: 'm2', text: 'Implement automated EDA report generator calculating distribution statistics', done: false }
            ]
          },
          {
            phase: 2,
            title: 'Statistical Inference & A/B Experimentation',
            weeks: 'Weeks 4 - 6',
            commitment: '8 hrs/week',
            status: 'upcoming',
            icon: 'Layout',
            description: 'Design robust hypothesis testing frameworks, calculate minimum detectable effects, and conduct sample size power analysis.',
            keySkills: ['A/B Testing', 'Hypothesis Tests', 'Bootstrapping', 'Confidence Intervals'],
            capstoneDeliverable: 'Statistical Significance Engine for Conversion Experiments',
            proTip: 'Explain false discovery rate corrections (e.g. Benjamini-Hochberg) when testing multiple product variations.',
            milestones: [
              { id: 'm3', text: 'Design A/B test pipeline with power calculations and sample sizing', done: false },
              { id: 'm4', text: 'Implement two-tailed Z-tests and non-parametric Mann-Whitney U tests', done: false }
            ]
          },
          {
            phase: 3,
            title: 'Applied Machine Learning & Gradient Boosting',
            weeks: 'Weeks 7 - 9',
            commitment: '10 hrs/week',
            status: 'upcoming',
            icon: 'Code2',
            description: 'Train high-accuracy classification and regression models using XGBoost, LightGBM, and Optuna Bayesian tuning.',
            keySkills: ['XGBoost', 'LightGBM', 'Optuna', 'SHAP Interpretability'],
            capstoneDeliverable: 'Customer Churn Predictor with SHAP Feature Attributions',
            proTip: 'Use SHAP summary and dependence plots to explain feature importance to non-technical stakeholders.',
            milestones: [
              { id: 'm5', text: 'Train XGBoost model with stratified 5-fold cross-validation', done: false },
              { id: 'm6', text: 'Integrate Optuna Bayesian optimizer to maximize AUC-ROC score', done: false }
            ]
          },
          {
            phase: 4,
            title: 'Deep Learning & Neural Architectures in PyTorch',
            weeks: 'Weeks 10 - 12',
            commitment: '10 hrs/week',
            status: 'upcoming',
            icon: 'BrainCircuit',
            description: 'Construct custom deep learning pipelines, custom dataset loaders, autograd loops, and multi-modal embeddings.',
            keySkills: ['PyTorch', 'Embeddings', 'Transfer Learning', 'FAISS'],
            capstoneDeliverable: 'Semantic Product Search with PyTorch & FAISS Index',
            proTip: 'Be prepared to write raw PyTorch training loops with forward/backward passes on a whiteboard.',
            milestones: [
              { id: 'm7', text: 'Write custom PyTorch Dataset, DataLoader, and training loop with mixed-precision', done: false },
              { id: 'm8', text: 'Generate vector embeddings and index them with FAISS for sub-millisecond retrieval', done: false }
            ]
          },
          {
            phase: 5,
            title: 'MLOps, Model Serving & Low-Latency APIs',
            weeks: 'Weeks 13 - 14',
            commitment: '8 hrs/week',
            status: 'upcoming',
            icon: 'Server',
            description: 'Package models with ONNX and deploy fast inference endpoints with FastAPI, Docker, and health checks.',
            keySkills: ['FastAPI', 'Docker', 'ONNX Runtime', 'Monitoring'],
            capstoneDeliverable: 'Containerized Sub-10ms Fraud Scoring Service',
            proTip: 'Exporting PyTorch models to ONNX runtime often cuts CPU inference latency by 3x-5x.',
            milestones: [
              { id: 'm9', text: 'Export trained model to ONNX format and measure p99 latency drop', done: false },
              { id: 'm10', text: 'Build FastAPI microservice packaged with lightweight Docker container', done: false }
            ]
          },
          {
            phase: 6,
            title: 'ML System Design & Senior Placement Mock Drills',
            weeks: 'Weeks 15 - 16',
            commitment: '12 hrs/week',
            status: 'upcoming',
            icon: 'Sparkles',
            description: 'Architect large-scale recommendation engines and pass data science interview loops with flying colors.',
            keySkills: ['ML System Design', 'Data Drift', 'Mock Drills', 'STAR Method'],
            capstoneDeliverable: 'End-to-End Production ML System Architecture Portfolio',
            proTip: 'In ML system design interviews, start by defining the business objective, then offline evaluation metrics vs online A/B metrics.',
            milestones: [
              { id: 'm11', text: 'Design full architecture for personalized content recommender system', done: false },
              { id: 'm12', text: 'Complete 3 senior mock interview rounds covering stats, coding, and ML design', done: false }
            ]
          }
        ],
        interviewQAs: [
          {
            q: 'How do you handle severe class imbalance in a fraud detection dataset?',
            a: 'Use PR-AUC and F1-score rather than accuracy. Apply techniques like cost-sensitive loss functions (e.g. Focal Loss), class weights, SMOTE or stratified sampling, and tune classification thresholds for business risk tolerance.'
          },
          {
            q: 'Explain the tradeoff between Precision and Recall with an example.',
            a: 'Precision measures how many of the positively predicted instances were actually positive, while Recall measures how many of the true positives were successfully captured. In disease screening, high recall is prioritized; in spam filtering, high precision prevents legitimate emails from being lost.'
          }
        ]
      }
    ]
  }
};

// Master Role Curriculum Pool: Comprehensive library of tiered tools per role from Foundation to Advanced
export const ROLE_MASTER_CURRICULUMS = {
  'Full Stack Developer': [
    {
      skillKeys: ['react', 'reactjs', 'htmlcss', 'html', 'css', 'javascript', 'js', 'frontend'],
      title: 'React 19 & Component State Management Architecture',
      category: 'Frontend Engineering',
      duration: '4 Weeks (10 hrs/week)',
      whyItMattered: 'Mastering modern React patterns, custom hooks, and state management is the foundational screening gate for full-stack developers.',
      practiceProject: 'Interactive Enterprise Component System with State Persistence',
      projectDescription: 'Build high-performance interactive interfaces with complex form state, custom validation hooks, and optimistic UI mutations.',
      keySkills: ['React 19', 'Custom Hooks', 'State Management', 'TailwindCSS'],
      youtubeCourses: [
        { title: 'React 19 Full Course 2026', channel: 'freeCodeCamp.org', duration: '4h 00m', views: '2.4M views', link: 'https://www.youtube.com' }
      ]
    },
    {
      skillKeys: ['node', 'nodejs', 'express', 'expressjs', 'rest', 'restapi', 'backend', 'javascript'],
      title: 'Node.js, Express & RESTful Microservices Architecture',
      category: 'Backend Architecture',
      duration: '4 Weeks (8 hrs/week)',
      whyItMattered: 'Interviewers evaluate your ability to write secure, modular RESTful APIs with input validation and authentication.',
      practiceProject: 'High-Throughput Multi-Tenant REST API Gateway',
      projectDescription: 'Build scalable Express/Fastify APIs with rate-limiting, JWT authentication, and structured logging.',
      keySkills: ['Node.js', 'Express.js', 'RESTful Design', 'JWT Auth'],
      youtubeCourses: [
        { title: 'Node.js and Express.js Full Course', channel: 'freeCodeCamp.org', duration: '3h 30m', views: '1.9M views', link: 'https://www.youtube.com' }
      ]
    },
    {
      skillKeys: ['typescript', 'ts'],
      title: 'TypeScript for Enterprise Full-Stack Applications',
      category: 'Type Safety',
      duration: '3 Weeks (8 hrs/week)',
      whyItMattered: 'Tech firms require end-to-end type safety between frontend UI and backend services to eliminate runtime crashes.',
      practiceProject: 'Type-Safe Full-Stack Monorepo with Shared DTOs',
      projectDescription: 'Implement strict TypeScript types, generic repository patterns, and runtime schema validation using Zod.',
      keySkills: ['TypeScript Generics', 'Zod Validation', 'Type Narrowing', 'Shared DTOs'],
      youtubeCourses: [
        { title: 'TypeScript Full Course for Beginners', channel: 'freeCodeCamp.org', duration: '2h 15m', views: '1.5M views', link: 'https://www.youtube.com' }
      ]
    },
    {
      skillKeys: ['postgresql', 'postgres', 'sql', 'basicsql', 'mysql', 'database'],
      title: 'PostgreSQL Relational Schema & Prisma ORM Optimization',
      category: 'Databases & ORM',
      duration: '3 Weeks (8 hrs/week)',
      whyItMattered: 'Aced database normalization, ACID transactions, and query index performance rounds in placement interviews.',
      practiceProject: 'High-Volume Relational Schema with Index Benchmarks',
      projectDescription: 'Design normalized schemas with Prisma, write ACID transactions, and add composite B-Tree indexes for <10ms queries.',
      keySkills: ['Prisma ORM', 'PostgreSQL', 'ACID Transactions', 'Indexing & Query Plans'],
      youtubeCourses: [
        { title: 'PostgreSQL Database Tutorial Full Course', channel: 'freeCodeCamp.org', duration: '4h 00m', views: '1.8M views', link: 'https://www.youtube.com' }
      ]
    },
    {
      skillKeys: ['nextjs', 'next.js', 'nextjs14', 'nextjs15', 'ssr', 'approuter'],
      title: 'Next.js 15 App Router, Server Components & Server Actions',
      category: 'Modern Web Architecture',
      duration: '4 Weeks (10 hrs/week)',
      whyItMattered: 'Demonstrated modern SSR, React Server Components (RSC), and edge rendering with lightning-fast First Contentful Paint.',
      practiceProject: 'High-Performance E-Commerce Platform with Server Actions',
      projectDescription: 'Build a Next.js 15 application with dynamic routing, server actions for database mutations, and SEO metadata generation.',
      keySkills: ['Next.js 15', 'Server Components', 'Server Actions', 'Edge Middleware'],
      youtubeCourses: [
        { title: 'Next.js 15 Full Tutorial - Server Actions & App Router', channel: 'Jack Herrington', duration: '2h 30m', views: '540K views', link: 'https://www.youtube.com' }
      ]
    },
    {
      skillKeys: ['redis', 'caching', 'ratelimiting'],
      title: 'Redis Distributed Caching, Session Stores & Rate Limiting',
      category: 'High Performance',
      duration: '3 Weeks (8 hrs/week)',
      whyItMattered: 'Eliminated database query bottlenecks and protected services against DDoS using token bucket rate limiters.',
      practiceProject: 'Distributed Rate-Limiter & Cache-Aside Middleware',
      projectDescription: 'Implement Redis caching with TTL invalidation, sliding window rate limiters, and pub/sub notifications.',
      keySkills: ['Redis Pub/Sub', 'Sliding Window Rate Limiter', 'Cache Stampede Mitigation', 'Lua Scripts'],
      youtubeCourses: [
        { title: 'Redis Distributed Caching Deep Dive', channel: 'Hussein Nasser', duration: '1h 40m', views: '450K views', link: 'https://www.youtube.com' }
      ]
    },
    {
      skillKeys: ['docker', 'containers', 'containerization'],
      title: 'Docker Multi-Service Containerization & Microservice Compose',
      category: 'DevOps & Deployment',
      duration: '3 Weeks (8 hrs/week)',
      whyItMattered: 'Packaged frontend, backend, PostgreSQL, and Redis into reproducible multi-stage containers deployed to cloud VMs.',
      practiceProject: 'Multi-Service Container Orchestration with Docker Compose',
      projectDescription: 'Write multi-stage Dockerfiles under 40MB, configure Nginx reverse proxy with SSL, and automate health checks.',
      keySkills: ['Multi-Stage Dockerfiles', 'Docker Compose', 'Nginx Reverse Proxy', 'Volume Persistence'],
      youtubeCourses: [
        { title: 'Docker & Docker Compose for Full Stack Developers', channel: 'TechWorld with Nana', duration: '2h 15m', views: '2.1M views', link: 'https://www.youtube.com' }
      ]
    },
    {
      skillKeys: ['kafka', 'rabbitmq', 'bullmq', 'queues', 'messagebroker'],
      title: 'Event-Driven Message Queues & Asynchronous Workers (Kafka / RabbitMQ)',
      category: 'Distributed Systems',
      duration: '3 Weeks (8 hrs/week)',
      whyItMattered: 'Built asynchronous background job pipelines for payment processing and email dispatches without blocking API threads.',
      practiceProject: 'Distributed Asynchronous Task Processing Queue with BullMQ / Kafka',
      projectDescription: 'Architect worker clusters handling background image processing, webhook retries, and dead-letter queues.',
      keySkills: ['Message Brokers', 'Kafka / RabbitMQ', 'Dead-Letter Queues', 'Idempotent Consumers'],
      youtubeCourses: [
        { title: 'Event Driven Architecture with Message Queues', channel: 'ByteByteGo', duration: '1h 20m', views: '610K views', link: 'https://www.youtube.com' }
      ]
    },
    {
      skillKeys: ['cicd', 'githubactions', 'jest', 'playwright', 'testing', 'cypress'],
      title: 'Automated CI/CD Pipelines & End-to-End Testing (Jest / Playwright)',
      category: 'Quality Engineering',
      duration: '3 Weeks (8 hrs/week)',
      whyItMattered: 'Showcased enterprise-grade test automation with GitHub Actions workflows running unit, integration, and E2E suites.',
      practiceProject: 'GitHub Actions Automated CI/CD Pipeline with 90%+ Code Coverage',
      projectDescription: 'Configure Playwright E2E browser tests, Jest API integration tests, and automated zero-downtime deployment to Vercel/AWS.',
      keySkills: ['GitHub Actions Workflows', 'Playwright E2E', 'Jest Integration Tests', 'SonarQube Gates'],
      youtubeCourses: [
        { title: 'CI/CD Pipelines with GitHub Actions from Scratch', channel: 'Traversy Media', duration: '1h 30m', views: '480K views', link: 'https://www.youtube.com' }
      ]
    },
    {
      skillKeys: ['websockets', 'socketio', 'realtime', 'systemdesign'],
      title: 'High-Concurrency System Design, WebSockets & Distributed State Sync',
      category: 'System Scalability',
      duration: '4 Weeks (10 hrs/week)',
      whyItMattered: 'Aced high-level system design rounds: horizontal scaling, database sharding, WebSocket gateways, and CDN edge caching.',
      practiceProject: 'Real-Time Multiplayer Collaborative Workspace with Live Cursors',
      projectDescription: 'Build real-time document editing with WebSockets, optimistic UI updates, distributed locking, and Redis pub/sub broadcasting.',
      keySkills: ['WebSockets', 'Horizontal Scaling', 'Distributed State Sync', 'System Design Drills'],
      youtubeCourses: [
        { title: 'System Design Interview – Step By Step Guide', channel: 'ByteByteGo', duration: '2h 00m', views: '1.4M views', link: 'https://www.youtube.com' }
      ]
    },
    {
      skillKeys: ['graphql', 'apollo'],
      title: 'GraphQL API Design & Apollo Federation',
      category: 'API Architectures',
      duration: '3 Weeks (6 hrs/week)',
      whyItMattered: 'Prevented over-fetching in mobile/web clients by exposing declarative GraphQL query schemas.',
      practiceProject: 'Federated GraphQL Subgraphs with Apollo Gateway',
      projectDescription: 'Design unified schema stitching across user, product, and billing microservices with dataloaders to prevent N+1 queries.',
      keySkills: ['GraphQL Schemas', 'Apollo Server', 'Dataloaders', 'Schema Federation'],
      youtubeCourses: [
        { title: 'GraphQL Full Course - Beginner to Pro', channel: 'freeCodeCamp.org', duration: '2h 00m', views: '730K views', link: 'https://www.youtube.com' }
      ]
    },
    {
      skillKeys: ['aws', 'cloud', 'serverless'],
      title: 'Cloud Infrastructure & AWS Serverless Deployment',
      category: 'Cloud Deployment',
      duration: '3 Weeks (8 hrs/week)',
      whyItMattered: 'Equipped him to deploy scalable serverless microservices using AWS Lambda, S3, CloudFront CDN, and API Gateway.',
      practiceProject: 'Serverless Full-Stack Microservices on AWS Lambda & CloudFront',
      projectDescription: 'Deploy frontend assets to S3/CloudFront CDN and backend handlers to AWS Lambda with IAM least-privilege security.',
      keySkills: ['AWS Lambda', 'CloudFront CDN', 'S3 Storage', 'AWS IAM'],
      youtubeCourses: [
        { title: 'AWS Serverless Architecture Full Course', channel: 'freeCodeCamp.org', duration: '2h 45m', views: '890K views', link: 'https://www.youtube.com' }
      ]
    }
  ],

  'Cloud Backend Engineer': [
    {
      skillKeys: ['node', 'nodejs', 'express', 'expressjs', 'rest', 'restapi'],
      title: 'Node.js & Express RESTful Microservices Architecture',
      category: 'Backend Core',
      duration: '4 Weeks (8 hrs/week)',
      whyItMattered: 'Build robust REST APIs with routing, structured logging, and input validation.',
      practiceProject: 'Scalable Microservices Gateway with JWT Auth',
      projectDescription: 'Build microservices gateway with JWT authentication, rate limiting, and Winston logging.',
      keySkills: ['Node.js', 'Express', 'JWT', 'REST'],
      youtubeCourses: [{ title: 'Node.js Backend Masterclass', channel: 'freeCodeCamp.org', duration: '3h 30m', views: '1.2M views', link: 'https://www.youtube.com' }]
    },
    {
      skillKeys: ['postgresql', 'postgres', 'sql', 'basicsql', 'mysql'],
      title: 'PostgreSQL Relational Schema & Query Tuning',
      category: 'Databases',
      duration: '3 Weeks (8 hrs/week)',
      whyItMattered: 'Design normalized schemas and tune composite indexes for high-throughput reads.',
      practiceProject: 'High-Concurrency Database Optimization Project',
      projectDescription: 'Benchmark SQL queries with EXPLAIN ANALYZE and implement connection pooling.',
      keySkills: ['PostgreSQL', 'Indexing', 'Transactions', 'ACID'],
      youtubeCourses: [{ title: 'PostgreSQL Database Tutorial', channel: 'freeCodeCamp.org', duration: '4h 00m', views: '1.8M views', link: 'https://www.youtube.com' }]
    },
    {
      skillKeys: ['redis', 'caching'],
      title: 'Redis Distributed Caching & Rate Limiting',
      category: 'High Performance',
      duration: '3 Weeks (8 hrs/week)',
      whyItMattered: 'Eliminate database bottlenecks with TTL caching and token bucket rate limiters.',
      practiceProject: 'Distributed Rate-Limiter & Cache Middleware',
      projectDescription: 'Implement Redis caching with sliding window rate limiting and pub/sub.',
      keySkills: ['Redis', 'Caching', 'Rate Limiting', 'Pub/Sub'],
      youtubeCourses: [{ title: 'Redis Masterclass', channel: 'Hussein Nasser', duration: '1h 40m', views: '450K views', link: 'https://www.youtube.com' }]
    },
    {
      skillKeys: ['docker', 'containers'],
      title: 'Docker Containerization & Multi-Service Compose',
      category: 'DevOps & Cloud',
      duration: '3 Weeks (8 hrs/week)',
      whyItMattered: 'Containerize backend services into lightweight reproducible images.',
      practiceProject: 'Multi-Service Docker Compose Setup with Nginx',
      projectDescription: 'Configure multi-stage Dockerfiles and Nginx reverse proxy with SSL termination.',
      keySkills: ['Docker', 'Docker Compose', 'Nginx', 'Multi-Stage Builds'],
      youtubeCourses: [{ title: 'Docker Tutorial for Beginners', channel: 'TechWorld with Nana', duration: '2h 45m', views: '4.8M views', link: 'https://www.youtube.com' }]
    },
    {
      skillKeys: ['aws', 'cloud', 'azure', 'gcp'],
      title: 'AWS Cloud Architecture (ECS, Lambda, S3, RDS)',
      category: 'Cloud Computing',
      duration: '4 Weeks (10 hrs/week)',
      whyItMattered: 'Deploy resilient cloud infrastructure with automated scaling and IAM policies.',
      practiceProject: 'Production Cloud Deployment on AWS ECS with RDS & S3',
      projectDescription: 'Deploy containerized microservices to AWS ECS Fargate with managed RDS PostgreSQL.',
      keySkills: ['AWS ECS', 'RDS', 'S3', 'IAM Roles'],
      youtubeCourses: [{ title: 'AWS Cloud Practitioner & Solutions Architect', channel: 'freeCodeCamp.org', duration: '4h 00m', views: '2.1M views', link: 'https://www.youtube.com' }]
    },
    {
      skillKeys: ['kafka', 'rabbitmq', 'queues'],
      title: 'Kafka & RabbitMQ Event-Driven Microservices',
      category: 'Distributed Systems',
      duration: '3 Weeks (8 hrs/week)',
      whyItMattered: 'Architect asynchronous message streaming with partition keys and consumer groups.',
      practiceProject: 'Distributed Order Event Processing with Kafka',
      projectDescription: 'Implement event-driven streaming with consumer group failovers and dead-letter queues.',
      keySkills: ['Kafka', 'RabbitMQ', 'Event Streams', 'Idempotent Consumers'],
      youtubeCourses: [{ title: 'Kafka Crash Course', channel: 'Hussein Nasser', duration: '1h 25m', views: '510K views', link: 'https://www.youtube.com' }]
    },
    {
      skillKeys: ['grpc', 'protobuf'],
      title: 'gRPC High-Performance Microservice Communication',
      category: 'Low-Latency APIs',
      duration: '3 Weeks (8 hrs/week)',
      whyItMattered: 'Build sub-millisecond binary RPC communications between internal microservices.',
      practiceProject: 'High-Throughput gRPC Telemetry Service',
      projectDescription: 'Define Proto3 service contracts and benchmark unary and bidirectional gRPC streams.',
      keySkills: ['gRPC', 'Protocol Buffers', 'HTTP/2', 'Bidirectional Streaming'],
      youtubeCourses: [{ title: 'gRPC Masterclass', channel: 'Hussein Nasser', duration: '1h 10m', views: '380K views', link: 'https://www.youtube.com' }]
    },
    {
      skillKeys: ['kubernetes', 'k8s'],
      title: 'Kubernetes Container Orchestration & Helm Charts',
      category: 'Cloud Infrastructure',
      duration: '4 Weeks (10 hrs/week)',
      whyItMattered: 'Deploy auto-scaling microservices with ConfigMaps, Secrets, and Ingress routing.',
      practiceProject: 'Kubernetes Multi-Cluster Deployment with Helm',
      projectDescription: 'Write Helm charts for backend microservices with Horizontal Pod Autoscalers (HPA).',
      keySkills: ['Kubernetes', 'Helm', 'Ingress', 'HPA'],
      youtubeCourses: [{ title: 'Kubernetes Full Course', channel: 'TechWorld with Nana', duration: '3h 30m', views: '3.1M views', link: 'https://www.youtube.com' }]
    }
  ],

  'Software Engineer': [
    {
      skillKeys: ['dsa', 'algorithms', 'datastructures', 'leetcode'],
      title: 'Advanced Data Structures & Graph Algorithms',
      category: 'Core Algorithms',
      duration: '5 Weeks (12 hrs/week)',
      whyItMattered: 'Ace Tier-1 product company coding rounds on Graphs, Dynamic Programming, and Heaps.',
      practiceProject: 'Algorithmic Problem Solving Benchmark (150+ Problems)',
      projectDescription: 'Solve Top LeetCode 150 patterns: Sliding Window, Union-Find, Topological Sort, DP.',
      keySkills: ['Graph Algorithms', 'Dynamic Programming', 'Tries', 'Heap Optimization'],
      youtubeCourses: [{ title: 'Algorithms and Data Structures Full Course', channel: 'freeCodeCamp.org', duration: '5h 00m', views: '3.2M views', link: 'https://www.youtube.com' }]
    },
    {
      skillKeys: ['systemdesign', 'hld', 'lld'],
      title: 'Low-Level Design (LLD) & Object-Oriented Design Patterns',
      category: 'Software Design',
      duration: '4 Weeks (10 hrs/week)',
      whyItMattered: 'Implement clean OOP design patterns (Factory, Strategy, Observer, Decorator) in live coding rounds.',
      practiceProject: 'Production-Grade Parking Lot / Chess Engine LLD',
      projectDescription: 'Design extensible domain classes following SOLID principles and concurrency safety.',
      keySkills: ['SOLID Principles', 'Design Patterns', 'UML Diagrams', 'Thread Safety'],
      youtubeCourses: [{ title: 'Design Patterns in Object Oriented Programming', channel: 'freeCodeCamp.org', duration: '2h 00m', views: '890K views', link: 'https://www.youtube.com' }]
    },
    {
      skillKeys: ['concurrency', 'multithreading', 'threading'],
      title: 'Multithreading, Concurrency & Lock-Free Data Structures',
      category: 'Systems Programming',
      duration: '3 Weeks (8 hrs/week)',
      whyItMattered: 'Master race condition prevention, thread pools, semaphores, and atomic variables.',
      practiceProject: 'High-Concurrency In-Memory Key-Value Store',
      projectDescription: 'Build concurrent hash map with fine-grained segment locks and reader-writer mutexes.',
      keySkills: ['Mutex & Locks', 'Thread Pools', 'Atomics', 'Deadlock Avoidance'],
      youtubeCourses: [{ title: 'Concurrency & Multithreading Crash Course', channel: 'Defog Tech', duration: '1h 30m', views: '420K views', link: 'https://www.youtube.com' }]
    },
    {
      skillKeys: ['distributed', 'distributedsystems', 'scaling'],
      title: 'High-Level System Design (HLD) & Distributed Architecture',
      category: 'System Design',
      duration: '4 Weeks (10 hrs/week)',
      whyItMattered: 'Design web-scale architectures: CDN caching, database sharding, consistency models, and rate limiters.',
      practiceProject: 'Distributed URL Shortener & Rate Limiting Gateway',
      projectDescription: 'Design end-to-end distributed system with Base62 encoding, Redis caching, and Cassandra storage.',
      keySkills: ['Database Sharding', 'CAP Theorem', 'Consistent Hashing', 'Load Balancing'],
      youtubeCourses: [{ title: 'System Design Interview Fundamentals', channel: 'ByteByteGo', duration: '2h 00m', views: '1.4M views', link: 'https://www.youtube.com' }]
    },
    {
      skillKeys: ['docker', 'containers', 'cicd'],
      title: 'Containerization & Automated Quality Pipelines',
      category: 'Engineering Discipline',
      duration: '3 Weeks (6 hrs/week)',
      whyItMattered: 'Ensure repeatable builds and automated testing workflows via GitHub Actions.',
      practiceProject: 'Automated CI/CD Pipeline with Unit & Integration Tests',
      projectDescription: 'Set up automated test runners, static code analysis, and artifact publishing.',
      keySkills: ['Docker', 'GitHub Actions', 'Test Automation', 'Static Analysis'],
      youtubeCourses: [{ title: 'CI/CD Pipelines with GitHub Actions', channel: 'Traversy Media', duration: '1h 30m', views: '480K views', link: 'https://www.youtube.com' }]
    },
    {
      skillKeys: ['monitoring', 'observability', 'prometheus'],
      title: 'Production Observability & Metrics Instrumentation',
      category: 'Production Reliability',
      duration: '2 Weeks (6 hrs/week)',
      whyItMattered: 'Instrument production metrics, distributed traces, and latency alerts.',
      practiceProject: 'Metrics Dashboard with Prometheus & Grafana',
      projectDescription: 'Configure application Prometheus exporters and build real-time Grafana latency dashboards.',
      keySkills: ['Prometheus', 'Grafana', 'OpenTelemetry', 'Alerting'],
      youtubeCourses: [{ title: 'Prometheus & Grafana Masterclass', channel: 'freeCodeCamp.org', duration: '2h 10m', views: '540K views', link: 'https://www.youtube.com' }]
    }
  ],

  'AI / ML Engineer': [
    {
      skillKeys: ['python', 'numpy', 'pandas', 'scikit'],
      title: 'Python for Data Science & Vectorized Computing (NumPy / Pandas)',
      category: 'Data Manipulation',
      duration: '3 Weeks (8 hrs/week)',
      whyItMattered: 'Perform fast vectorized operations, feature engineering, and statistical data cleaning.',
      practiceProject: 'High-Volume Financial Dataset Feature Engineering Pipeline',
      projectDescription: 'Clean and transform multi-gigabyte tabular datasets using vectorized Pandas/Polars operations.',
      keySkills: ['NumPy', 'Pandas', 'Vectorization', 'Data Cleaning'],
      youtubeCourses: [{ title: 'Python for Data Science Full Course', channel: 'freeCodeCamp.org', duration: '4h 00m', views: '2.5M views', link: 'https://www.youtube.com' }]
    },
    {
      skillKeys: ['pytorch', 'deeplearning', 'neuralnetworks', 'tensorflow'],
      title: 'PyTorch Deep Learning & Neural Network Architectures',
      category: 'Deep Learning',
      duration: '5 Weeks (12 hrs/week)',
      whyItMattered: 'Build custom neural network layers, custom autograd loops, and transfer learning pipelines.',
      practiceProject: 'Multi-Modal Embedding & Classification Pipeline with PyTorch',
      projectDescription: 'Train deep convolutional and transformer models with mixed-precision training and learning rate schedulers.',
      keySkills: ['PyTorch', 'Transfer Learning', 'Autograd Loops', 'CUDA Acceleration'],
      youtubeCourses: [{ title: 'PyTorch for Deep Learning Bootcamp', channel: 'freeCodeCamp.org', duration: '6h 00m', views: '1.6M views', link: 'https://www.youtube.com' }]
    },
    {
      skillKeys: ['transformers', 'llm', 'genai', 'huggingface', 'rag'],
      title: 'Generative AI, HuggingFace Transformers & RAG Systems',
      category: 'Generative AI',
      duration: '4 Weeks (10 hrs/week)',
      whyItMattered: 'Build enterprise Retrieval-Augmented Generation (RAG) applications using LangChain, LlamaIndex, and vector databases.',
      practiceProject: 'Production Enterprise RAG System with Vector Indexing (FAISS/Pinecone)',
      projectDescription: 'Build document retrieval pipelines with semantic chunking, cross-encoder re-ranking, and streaming LLM responses.',
      keySkills: ['Transformers', 'RAG', 'Vector Databases', 'LangChain'],
      youtubeCourses: [{ title: 'LangChain & Vector Databases Full Course', channel: 'freeCodeCamp.org', duration: '3h 30m', views: '980K views', link: 'https://www.youtube.com' }]
    },
    {
      skillKeys: ['mlops', 'fastapi', 'onnx', 'docker'],
      title: 'MLOps, Low-Latency Model Serving & FastAPI Microservices',
      category: 'Model Deployment',
      duration: '3 Weeks (8 hrs/week)',
      whyItMattered: 'Package trained PyTorch models with ONNX Runtime and serve real-time predictions via FastAPI Docker microservices.',
      practiceProject: 'Sub-10ms Model Serving Microservice with FastAPI & ONNX',
      projectDescription: 'Containerize optimized model inference services with health checks and batch inference scheduling.',
      keySkills: ['FastAPI', 'ONNX Runtime', 'Docker', 'Latency Profiling'],
      youtubeCourses: [{ title: 'MLOps and Model Deployment Tutorial', channel: 'freeCodeCamp.org', duration: '2h 30m', views: '650K views', link: 'https://www.youtube.com' }]
    },
    {
      skillKeys: ['featurestore', 'mlflow', 'wandb', 'pipelines'],
      title: 'ML Experiment Tracking, Feature Stores & Drift Monitoring',
      category: 'MLOps Discipline',
      duration: '3 Weeks (8 hrs/week)',
      whyItMattered: 'Track hyperparameter experiments with MLflow/W&B and detect data drift in production.',
      practiceProject: 'End-to-End Automated ML Pipeline with MLflow & EvidentlyAI',
      projectDescription: 'Track experiment runs, register versioned models, and trigger retraining on statistical data drift.',
      keySkills: ['MLflow', 'Weights & Biases', 'Data Drift Detection', 'Model Registry'],
      youtubeCourses: [{ title: 'MLflow & Experiment Tracking Crash Course', channel: 'freeCodeCamp.org', duration: '1h 45m', views: '320K views', link: 'https://www.youtube.com' }]
    },
    {
      skillKeys: ['mlsystemdesign', 'recommender'],
      title: 'Large-Scale Machine Learning System Design',
      category: 'ML System Design',
      duration: '4 Weeks (10 hrs/week)',
      whyItMattered: 'Design candidate generation, two-stage ranking pipelines, and real-time A/B testing infrastructure.',
      practiceProject: 'Large-Scale Personalized Recommendation Engine Design',
      projectDescription: 'Architect scalable recommender system handling 100M+ users with collaborative filtering and ANN vector search.',
      keySkills: ['Two-Stage Ranking', 'Vector Search (HNSW)', 'A/B Testing', 'Cold Start Strategies'],
      youtubeCourses: [{ title: 'Machine Learning System Design Interview', channel: 'ByteByteGo', duration: '2h 15m', views: '840K views', link: 'https://www.youtube.com' }]
    }
  ],

  'Data Analyst': [
    {
      skillKeys: ['sql', 'basicsql', 'mysql', 'postgresql'],
      title: 'Advanced SQL Querying & Window Functions',
      category: 'Database Analytics',
      duration: '4 Weeks (8 hrs/week)',
      whyItMattered: 'Master complex multi-table JOINs, CTE subqueries, and window functions (RANK, LEAD, LAG).',
      practiceProject: 'E-Commerce Cohort Retention & Churn Analysis in SQL',
      projectDescription: 'Write 40+ complex analytics queries analyzing user retention, lifetime value, and monthly recurring revenue.',
      keySkills: ['Window Functions', 'CTEs', 'Aggregation Queries', 'Query Optimization'],
      youtubeCourses: [{ title: 'SQL for Data Analytics Full Course', channel: 'freeCodeCamp.org', duration: '4h 00m', views: '2.8M views', link: 'https://www.youtube.com' }]
    },
    {
      skillKeys: ['tableau', 'powerbi', 'dashboard', 'bi'],
      title: 'Tableau & Power BI Executive Dashboard Storytelling',
      category: 'Business Intelligence',
      duration: '4 Weeks (8 hrs/week)',
      whyItMattered: 'Build interactive executive BI dashboards with DAX calculations, parameter actions, and KPI scorecards.',
      practiceProject: 'Executive Sales & Operations KPI Dashboard in Power BI',
      projectDescription: 'Design interactive multi-page BI dashboards with drill-through filters and automated data refresh.',
      keySkills: ['Power BI', 'DAX Measures', 'Tableau Calculations', 'Data Storytelling'],
      youtubeCourses: [{ title: 'Power BI Full Course for Beginners', channel: 'freeCodeCamp.org', duration: '3h 30m', views: '2.1M views', link: 'https://www.youtube.com' }]
    },
    {
      skillKeys: ['python', 'pandas', 'matplotlib', 'seaborn'],
      title: 'Python Exploratory Data Analysis (EDA) & Visualization',
      category: 'Data Analytics',
      duration: '3 Weeks (8 hrs/week)',
      whyItMattered: 'Uncover business insights, correlation matrices, and distribution anomalies using Pandas and Seaborn.',
      practiceProject: 'Exploratory Customer Segmentation Analysis in Python',
      projectDescription: 'Clean messy survey data, perform outlier detection, and create publication-ready charts.',
      keySkills: ['Pandas EDA', 'Seaborn', 'Matplotlib', 'Statistical Summaries'],
      youtubeCourses: [{ title: 'Exploratory Data Analysis with Python', channel: 'freeCodeCamp.org', duration: '2h 30m', views: '1.4M views', link: 'https://www.youtube.com' }]
    },
    {
      skillKeys: ['statistics', 'abtesting', 'hypothesis'],
      title: 'Applied Business Statistics & A/B Testing Experiments',
      category: 'Analytics Science',
      duration: '3 Weeks (6 hrs/week)',
      whyItMattered: 'Calculate sample sizes, statistical significance, p-values, and confidence intervals for product feature rollouts.',
      practiceProject: 'A/B Test Statistical Significance & Power Analysis Notebook',
      projectDescription: 'Run two-sample t-tests, Mann-Whitney U tests, and compute minimum detectable effect sizes.',
      keySkills: ['Hypothesis Testing', 'A/B Experimentation', 'P-values', 'Confidence Intervals'],
      youtubeCourses: [{ title: 'Statistics for Data Science & Business Analytics', channel: 'freeCodeCamp.org', duration: '3h 00m', views: '1.1M views', link: 'https://www.youtube.com' }]
    },
    {
      skillKeys: ['dbt', 'datawarehouse', 'snowflake', 'bigquery'],
      title: 'Data Modeling with dbt & Cloud Data Warehousing (BigQuery / Snowflake)',
      category: 'Modern Data Stack',
      duration: '3 Weeks (8 hrs/week)',
      whyItMattered: 'Transform raw data into analytics-ready dimensional tables with automated tests and documentation.',
      practiceProject: 'dbt Dimensional Star-Schema Pipeline on BigQuery',
      projectDescription: 'Build staging and mart models with star-schema fact/dimension tables and automated schema tests.',
      keySkills: ['dbt Core', 'Dimensional Modeling', 'Star Schema', 'Cloud Warehouses'],
      youtubeCourses: [{ title: 'dbt Crash Course for Beginners', channel: 'freeCodeCamp.org', duration: '1h 30m', views: '450K views', link: 'https://www.youtube.com' }]
    },
    {
      skillKeys: ['excel', 'advancedexcel', 'vba'],
      title: 'Advanced Excel Financial Modeling & Scenario Analysis',
      category: 'Business Modeling',
      duration: '2 Weeks (6 hrs/week)',
      whyItMattered: 'Build financial models, pivot tables, XLOOKUP formulas, and sensitivity tables for business planning.',
      practiceProject: 'Dynamic Revenue Projection & Sensitivity Model in Excel',
      projectDescription: 'Construct dynamic 3-statement financial forecast model with data validation and scenario managers.',
      keySkills: ['Pivot Tables', 'XLOOKUP & INDEX/MATCH', 'Scenario Manager', 'Data Validation'],
      youtubeCourses: [{ title: 'Advanced Excel Full Course', channel: 'freeCodeCamp.org', duration: '2h 15m', views: '3.6M views', link: 'https://www.youtube.com' }]
    }
  ]
};

// Skill normalizer helper
function normalizeSkillKey(str) {
  if (!str) return '';
  const clean = String(str).toLowerCase().trim().replace(/[^a-z0-9]/g, '');
  if (clean === 'js' || clean === 'javascript' || clean === 'es6') return 'javascript';
  if (clean === 'ts' || clean === 'typescript') return 'typescript';
  if (clean === 'node' || clean === 'nodejs' || clean === 'express' || clean === 'expressjs') return 'node';
  if (clean === 'react' || clean === 'reactjs' || clean === 'react18' || clean === 'react19') return 'react';
  if (clean === 'postgres' || clean === 'postgresql' || clean === 'sql' || clean === 'basicsql' || clean === 'mysql' || clean === 'rdbms') return 'postgresql';
  if (clean === 'html' || clean === 'css' || clean === 'htmlcss' || clean === 'html5' || clean === 'css3') return 'htmlcss';
  if (clean === 'python' || clean === 'django' || clean === 'flask' || clean === 'fastapi') return 'python';
  if (clean === 'java' || clean === 'spring' || clean === 'springboot') return 'java';
  if (clean === 'cpp' || clean === 'c' || clean === 'cplusplus') return 'cpp';
  if (clean === 'docker' || clean === 'containers' || clean === 'dockerfile') return 'docker';
  if (clean === 'aws' || clean === 'cloud' || clean === 'azure' || clean === 'gcp') return 'aws';
  if (clean === 'git' || clean === 'github' || clean === 'gitlab') return 'git';
  if (clean === 'linux' || clean === 'bash' || clean === 'shell') return 'linux';
  if (clean === 'tailwindcss' || clean === 'tailwind') return 'tailwindcss';
  if (clean === 'nextjs' || clean === 'next' || clean === 'nextjs14' || clean === 'nextjs15') return 'nextjs';
  if (clean === 'redis' || clean === 'caching') return 'redis';
  if (clean === 'kafka' || clean === 'rabbitmq' || clean === 'queues') return 'kafka';
  if (clean === 'kubernetes' || clean === 'k8s') return 'kubernetes';
  return clean;
}

// Check if a tool is already mastered by the student
function isToolAlreadyMastered(tool, userSkills = []) {
  if (!userSkills || userSkills.length === 0) return false;
  const normUserSkills = userSkills.map(normalizeSkillKey);

  // 1. Check explicit tool skill keys if provided
  if (Array.isArray(tool.skillKeys) && tool.skillKeys.length > 0) {
    for (const key of tool.skillKeys) {
      const normKey = normalizeSkillKey(key);
      if (normUserSkills.includes(normKey)) {
        return true;
      }
    }
    return false;
  }

  // 2. Check keySkills array on the tool
  if (Array.isArray(tool.keySkills)) {
    for (const key of tool.keySkills) {
      const normKey = normalizeSkillKey(key);
      if (normUserSkills.includes(normKey)) {
        return true;
      }
    }
  }

  // 3. Check tool title keywords:
  // Strip parenthetical text e.g. "(C++ / Java)", "(Project Loom)", "(AZ-900)" so auxiliary context isn't treated as tool subject
  const titleLower = (tool.title || '').toLowerCase();
  const cleanedTitle = titleLower.replace(/\([^)]*\)/g, '').trim();

  // If the tool is advanced (concurrency, data structures, algorithms, system design, architecture, profiling),
  // basic knowledge of a foundational programming language does not mean the student mastered the advanced tool.
  const isAdvancedTopic = /data structures|algorithms|concurrency|multithread|system design|architecture|internals|profiling/i.test(cleanedTitle);
  const foundationalLanguages = ['java', 'python', 'cpp', 'c', 'javascript', 'typescript', 'html', 'css', 'csharp'];

  for (const s of userSkills) {
    const rawLower = s.toLowerCase().trim();
    const normS = normalizeSkillKey(rawLower);

    // Skip marking advanced CS topics as mastered simply from basic language syntax
    if (isAdvancedTopic && foundationalLanguages.includes(normS)) {
      continue;
    }

    if (rawLower.length >= 3 && cleanedTitle.includes(rawLower)) {
      return true;
    }
  }

  return false;
}

// Helper: Get list of all alumni twins for a given role, dynamically filtered by user skills
export function getAlumniTwinsForRole(roleName, currentSkills = []) {
  const baseTwins = ALUMNI_TWINS_DATA[roleName]?.alumniTwins || [];
  const curriculumPool = ROLE_MASTER_CURRICULUMS[roleName] || [];

  // Determine acquired skills for this role
  const userSkillList = Array.isArray(currentSkills) && currentSkills.length > 0 ? currentSkills : DEFAULT_STARTING_SKILLS;

  // If we have existing twins in ALUMNI_TWINS_DATA
  if (baseTwins.length > 0) {
    return baseTwins.map((twin, twinIdx) => {
      // Prioritize each senior's unique blueprint missingTools; fall back to role curriculum pool only if missing
      const allCandidateTools = (Array.isArray(twin.missingTools) && twin.missingTools.length > 0)
        ? twin.missingTools
        : curriculumPool;

      // Filter candidate tools: exclude ones user has already mastered
      const remainingGaps = allCandidateTools.filter(t => !isToolAlreadyMastered(t, userSkillList));

      // Dynamic tool selection based on real detected gaps (from 2 up to 8 max)
      let selectedGaps;
      if (remainingGaps.length > 0) {
        selectedGaps = remainingGaps.slice(0, 8);
      } else {
        // User mastered all core curriculum items: provide 2 advanced system mastery polish tools
        selectedGaps = allCandidateTools.slice(-2);
      }

      // Re-number tools 1 to N dynamically
      const numberedTools = selectedGaps.map((t, idx) => ({
        ...t,
        toolNumber: idx + 1
      }));

      // Generate roadmap phases: preserve handcrafted phase details (pro-tips, milestones, capstones) when available
      const dynamicPhases = numberedTools.map((t, idx) => {
        const customPhase = (twin.roadmapPhases || []).find(p => {
          const pTitle = (p.title || '').toLowerCase();
          const tTitle = (t.title || '').toLowerCase();
          return pTitle.includes(tTitle.slice(0, 10)) || tTitle.includes(pTitle.slice(0, 10));
        }) || (twin.roadmapPhases || [])[idx];

        if (customPhase) {
          return {
            ...customPhase,
            phase: idx + 1,
            title: customPhase.title || t.title,
            weeks: customPhase.weeks || `Weeks ${idx * 3 + 1} - ${idx * 3 + 3}`,
            commitment: customPhase.commitment || '8-10 hrs/week',
            status: idx === 0 ? 'ready' : 'upcoming',
            icon: customPhase.icon || (idx === 0 ? 'Layout' : idx === 1 ? 'Server' : idx === 2 ? 'Layers' : idx === 3 ? 'Code2' : idx === 4 ? 'Terminal' : 'Sparkles'),
            description: customPhase.description || t.whyItMattered,
            keySkills: customPhase.keySkills || t.keySkills || [],
            capstoneDeliverable: customPhase.capstoneDeliverable || t.practiceProject || `Production-Grade ${t.title} Module`,
            proTip: customPhase.proTip || `Focus on hands-on repository code and real edge-case handling for ${t.category}.`,
            milestones: Array.isArray(customPhase.milestones) && customPhase.milestones.length > 0
              ? customPhase.milestones
              : [
                { id: `m${idx * 2 + 1}`, text: `Complete core practical architecture for ${t.title}`, done: false },
                { id: `m${idx * 2 + 2}`, text: `Build and benchmark capstone: ${t.practiceProject || 'Project Implementation'}`, done: false }
              ]
          };
        }

        return {
          phase: idx + 1,
          title: t.title,
          weeks: `Weeks ${idx * 3 + 1} - ${idx * 3 + 3}`,
          commitment: '8-10 hrs/week',
          status: idx === 0 ? 'ready' : 'upcoming',
          icon: idx === 0 ? 'Layout' : idx === 1 ? 'Server' : idx === 2 ? 'Layers' : idx === 3 ? 'Code2' : idx === 4 ? 'Terminal' : 'Sparkles',
          description: t.whyItMattered,
          keySkills: t.keySkills || [],
          capstoneDeliverable: t.practiceProject || `Production-Grade ${t.title} Module`,
          proTip: `Focus on hands-on repository code and real edge-case handling for ${t.category}.`,
          milestones: [
            { id: `m${idx * 2 + 1}`, text: `Complete core practical architecture for ${t.title}`, done: false },
            { id: `m${idx * 2 + 2}`, text: `Build and benchmark capstone: ${t.practiceProject || 'Project Implementation'}`, done: false }
          ]
        };
      });

      // Calculate matching / acquired skills
      const acquiredSkills = userSkillList;
      const totalCompetencies = userSkillList.length + numberedTools.length;
      const matchPercentage = Math.min(95, Math.max(20, Math.round((userSkillList.length / Math.max(totalCompetencies, 1)) * 100)));

      return {
        ...twin,
        baselineSkills: userSkillList,
        acquiredSkills: userSkillList,
        matchPercentage,
        missingTools: numberedTools,
        roadmapPhases: dynamicPhases
      };
    });
  }

  // Dynamic fallback for custom entered roles
  const userSkillsFormatted = currentSkills.length > 0 ? currentSkills : DEFAULT_STARTING_SKILLS;
  const customPool = [
    {
      skillKeys: ['architecture', 'designpatterns'],
      toolNumber: 1,
      title: `${roleName} Advanced System Architecture`,
      category: 'Core Engineering',
      duration: '4 Weeks (10 hrs/week)',
      whyItMattered: `Mastering modern ${roleName} industry frameworks allowed him to pass senior technical assessment rounds with ease.`,
      practiceProject: `Production-Grade ${roleName} End-to-End System`,
      projectDescription: `Build a production-ready application showcasing clean architectural patterns, error handling, and unit test suites.`,
      keySkills: ['Architecture Patterns', 'Modern Tooling', 'Testing & CI', 'Performance'],
      youtubeCourses: [{ title: `${roleName} Complete Developer Roadmap & Guide`, channel: 'freeCodeCamp.org', duration: '3h 00m', views: '650K views', link: 'https://www.youtube.com' }]
    },
    {
      skillKeys: ['docker', 'cloud', 'aws'],
      toolNumber: 2,
      title: 'Modern Cloud & Containerization Workflow',
      category: 'DevOps & Cloud',
      duration: '3 Weeks (8 hrs/week)',
      whyItMattered: 'Allowed him to demonstrate reproducible development setups and automated cloud deployments in live interviews.',
      practiceProject: 'Dockerized Microservice with Automated Testing',
      projectDescription: 'Package and deploy services with continuous automated integration and logging.',
      keySkills: ['Docker', 'Cloud APIs', 'CI/CD Pipelines', 'Monitoring'],
      youtubeCourses: [{ title: 'Docker & Modern Cloud Deployment Crash Course', channel: 'TechWorld with Nana', duration: '2h 15m', views: '890K views', link: 'https://www.youtube.com' }]
    },
    {
      skillKeys: ['postgresql', 'sql', 'database'],
      toolNumber: 3,
      title: 'Database Architecture & Query Optimization',
      category: 'Data & Persistence',
      duration: '3 Weeks (8 hrs/week)',
      whyItMattered: 'Interviewers tested query performance, indexing strategies, and database transaction isolation levels.',
      practiceProject: 'High-Performance Database Schema with Index Tuning',
      projectDescription: 'Design normalized schemas, build composite indexes, and benchmark read/write throughput under concurrency.',
      keySkills: ['Indexing', 'Query Optimization', 'Transactions', 'Connection Pooling'],
      youtubeCourses: [{ title: 'Database Design & Indexing Deep Dive', channel: 'Hussein Nasser', duration: '1h 45m', views: '620K views', link: 'https://www.youtube.com' }]
    },
    {
      skillKeys: ['redis', 'caching', 'concurrency'],
      toolNumber: 4,
      title: 'System Scalability & Performance Tuning',
      category: 'Advanced Architecture',
      duration: '3 Weeks (10 hrs/week)',
      whyItMattered: 'Equipped him to answer deep scalability, concurrency, and performance optimization interview questions.',
      practiceProject: 'High-Throughput Distributed Microservice API',
      projectDescription: 'Optimize latency under load with caching strategies, database query tuning, and asynchronous processing.',
      keySkills: ['Caching', 'Concurrency', 'Security Best Practices', 'Load Testing'],
      youtubeCourses: [{ title: 'System Design and High Scale Architecture', channel: 'ByteByteGo', duration: '2h 00m', views: '1.2M views', link: 'https://www.youtube.com' }]
    },
    {
      skillKeys: ['cicd', 'githubactions', 'testing'],
      toolNumber: 5,
      title: 'Automated CI/CD Testing & Code Quality Gates',
      category: 'Quality Engineering',
      duration: '2 Weeks (6 hrs/week)',
      whyItMattered: 'Demonstrated enterprise software lifecycle discipline with automated regression suites and code coverage gates.',
      practiceProject: 'GitHub Actions Automated CI/CD Pipeline with 90%+ Test Coverage',
      projectDescription: 'Configure end-to-end testing, static analysis linters, and zero-downtime deployment workflows.',
      keySkills: ['Unit Testing', 'GitHub Actions', 'Integration Testing', 'SonarQube'],
      youtubeCourses: [{ title: 'CI/CD Pipelines with GitHub Actions from Scratch', channel: 'Traversy Media', duration: '1h 30m', views: '480K views', link: 'https://www.youtube.com' }]
    },
    {
      skillKeys: ['monitoring', 'observability', 'prometheus'],
      toolNumber: 6,
      title: 'System Observability & Senior Interview Drills',
      category: 'Production Reliability',
      duration: '2 Weeks (8 hrs/week)',
      whyItMattered: 'Aced senior interview rounds with production observability, metrics scraping, and architectural tradeoffs.',
      practiceProject: 'Production Observability & Monitoring Dashboard with Prometheus & Grafana',
      projectDescription: 'Instrument distributed traces, request latency alerts, and live production error logging.',
      keySkills: ['Prometheus', 'Grafana', 'Distributed Tracing', 'System Design Drills'],
      youtubeCourses: [{ title: 'Prometheus & Grafana Observability Masterclass', channel: 'freeCodeCamp.org', duration: '2h 10m', views: '540K views', link: 'https://www.youtube.com' }]
    }
  ];

  const customGaps = customPool.filter(t => !isToolAlreadyMastered(t, userSkillsFormatted));
  const selectedCustomGaps = (customGaps.length > 0 ? customGaps : customPool.slice(-2)).map((t, idx) => ({
    ...t,
    toolNumber: idx + 1
  }));

  const customPhases = selectedCustomGaps.map((t, idx) => ({
    phase: idx + 1,
    title: t.title,
    weeks: `Weeks ${idx * 3 + 1} - ${idx * 3 + 3}`,
    commitment: '10 hrs/week',
    status: idx === 0 ? 'ready' : 'upcoming',
    icon: 'Code2',
    description: t.whyItMattered,
    keySkills: t.keySkills || [],
    capstoneDeliverable: t.practiceProject || `Production-Grade ${t.title}`,
    proTip: `Focus on clean implementation and explaining trade-offs.`,
    milestones: [
      { id: `m${idx * 2 + 1}`, text: `Complete core practical architecture for ${t.title}`, done: false },
      { id: `m${idx * 2 + 2}`, text: `Build and benchmark capstone: ${t.practiceProject || 'Project Implementation'}`, done: false }
    ]
  }));

  return [
    {
      id: 'twin-custom-1',
      name: 'Aditya Varma',
      initials: 'AV',
      gender: 'male',
      verified: true,
      currentCompany: 'TechCorp International',
      currentRole: roleName,
      package: '24 LPA',
      batch: 'Class of 2022',
      department: 'Computer Science & Engineering',
      stackFocus: `${roleName} Core Stack`,
      baselineSkills: userSkillsFormatted,
      acquiredSkills: userSkillsFormatted,
      matchPercentage: Math.min(90, Math.max(25, userSkillsFormatted.length * 10)),
      advice: `For ${roleName}, real hands-on projects and understanding end-to-end architecture will set you apart from 95% of campus applicants.`,
      missingTools: selectedCustomGaps,
      roadmapPhases: customPhases,
      interviewQAs: [
        {
          q: `What are the top architectural principles you follow for ${roleName}?`,
          a: `Modularity, separation of concerns (SOLID), comprehensive automated testing, and clear observability/monitoring.`
        }
      ]
    },
    {
      id: 'twin-custom-2',
      name: 'Sneha Patel',
      initials: 'SP',
      gender: 'female',
      verified: true,
      currentCompany: 'GlobalTech Solutions',
      currentRole: `Associate ${roleName}`,
      package: '20 LPA',
      batch: 'Class of 2023',
      department: 'Information Science',
      stackFocus: `${roleName} Enterprise`,
      baselineSkills: currentSkills.length > 0 ? currentSkills : DEFAULT_STARTING_SKILLS,
      advice: `Build 2 high-quality portfolio capstone projects with live demo links and documented system designs.`,
      missingTools: [
        {
          toolNumber: 1,
          title: `${roleName} Production Best Practices`,
          category: 'Industry Standard',
          duration: '4 Weeks (8 hrs/week)',
          whyItMattered: 'Demonstrated corporate software development life cycle proficiency in interview rounds.',
          practiceProject: `Scalable ${roleName} Enterprise Dashboard`,
          projectDescription: 'Build an end-to-end dashboard with authentication, database connectivity, and automated CI tests.',
          keySkills: ['Best Practices', 'API Design', 'Database Queries', 'Git Workflows'],
          youtubeCourses: [
            {
              title: `${roleName} Industry Practices Full Course`,
              channel: 'freeCodeCamp.org',
              duration: '2h 30m',
              views: '420K views',
              link: 'https://www.youtube.com'
            }
          ]
        },
        {
          toolNumber: 2,
          title: 'Automated Testing & Code Quality',
          category: 'Software Quality',
          duration: '3 Weeks (8 hrs/week)',
          whyItMattered: 'Wrote unit and integration tests with automated coverage reporting.',
          practiceProject: 'Test-Driven Microservice with Mocking',
          projectDescription: 'Implement 90%+ code coverage unit test suites.',
          keySkills: ['Unit Testing', 'Mocking', 'CI Quality Gates', 'Linting'],
          youtubeCourses: [
            {
              title: 'Testing Best Practices for Modern Developers',
              channel: 'Traversy Media',
              duration: '1h 15m',
              views: '310K views',
              link: 'https://www.youtube.com'
            }
          ]
        },
        {
          toolNumber: 3,
          title: 'Cloud Deployment & Containerization',
          category: 'Cloud Operations',
          duration: '3 Weeks (8 hrs/week)',
          whyItMattered: 'Packaged services into containers and deployed to cloud instances.',
          practiceProject: 'Cloud-Deployed Microservice API',
          projectDescription: 'Deploy scalable services to AWS/GCP with environment secrets.',
          keySkills: ['Docker', 'AWS Basics', 'Environment Secrets', 'Nginx'],
          youtubeCourses: [
            {
              title: 'Cloud Deployment in 1 Hour',
              channel: 'Fireship',
              duration: '45m',
              views: '650K views',
              link: 'https://www.youtube.com'
            }
          ]
        },
        {
          toolNumber: 4,
          title: 'Security, Authentication & Role-Based Access Control',
          category: 'App Security',
          duration: '3 Weeks (6 hrs/week)',
          whyItMattered: 'Secured web endpoints against OWASP Top 10 vulnerabilities and implemented JWT/OAuth2 protocols.',
          practiceProject: 'Role-Based Authentication Gateway with Rate Limiting',
          projectDescription: 'Implement secure login, refresh token rotations, and request rate-limiting middleware.',
          keySkills: ['JWT', 'OAuth2', 'OWASP Top 10', 'HTTPS / SSL'],
          youtubeCourses: [
            {
              title: 'Web Application Security Fundamentals',
              channel: 'Fireship',
              duration: '25m',
              views: '540K views',
              link: 'https://www.youtube.com'
            }
          ]
        },
        {
          toolNumber: 5,
          title: 'Database Schema Optimization & Query Tuning',
          category: 'Data Storage',
          duration: '3 Weeks (8 hrs/week)',
          whyItMattered: 'Prevented N+1 query bottlenecks and tuned composite indexes for high-throughput reads.',
          practiceProject: 'Optimized PostgreSQL Schema with Connection Pooling',
          projectDescription: 'Build complex join queries, benchmark query execution plans with EXPLAIN ANALYZE, and set up Redis caching.',
          keySkills: ['PostgreSQL', 'Indexing Strategies', 'Connection Pooling', 'Redis Caching'],
          youtubeCourses: [
            {
              title: 'Database Design & Optimization Crash Course',
              channel: 'Hussein Nasser',
              duration: '1h 50m',
              views: '480K views',
              link: 'https://www.youtube.com'
            }
          ]
        },
        {
          toolNumber: 6,
          title: 'System Scalability, Monitoring & Reliability',
          category: 'Scalability',
          duration: '3 Weeks (8 hrs/week)',
          whyItMattered: 'Demonstrated deep understanding of microservice failure modes, circuit breakers, and rate limiters.',
          practiceProject: 'Resilient Microservices System with Circuit Breakers',
          projectDescription: 'Implement distributed rate limiting with Redis token buckets and real-time health checks.',
          keySkills: ['Rate Limiting', 'Circuit Breakers', 'Health Checks', 'Distributed Tracing'],
          youtubeCourses: [
            {
              title: 'System Design Interview Fundamentals',
              channel: 'ByteByteGo',
              duration: '2h 10m',
              views: '920K views',
              link: 'https://www.youtube.com'
            }
          ]
        }
      ],
      roadmapPhases: [
        {
          phase: 1,
          title: `Core Fundamentals & Enterprise Workflow`,
          weeks: 'Weeks 1 - 3',
          commitment: '8 hrs/week',
          status: 'ready',
          icon: 'Code2',
          description: `Master core tools, standards, and practical implementation patterns for ${roleName}.`,
          keySkills: ['Core Architecture', 'Clean Code', 'Tooling', 'Modular Design'],
          capstoneDeliverable: `Production-Grade ${roleName} Starter Framework`,
          proTip: `Build real projects instead of tutorial code. Interviewers test your ability to debug and solve edge cases.`,
          milestones: [
            { id: 'm13', text: `Complete foundational ${roleName} project and publish to GitHub`, done: false },
            { id: 'm14', text: `Implement structured error handling and unit test suites`, done: false }
          ]
        },
        {
          phase: 2,
          title: `Automated Testing & Code Quality`,
          weeks: 'Weeks 4 - 6',
          commitment: '8 hrs/week',
          status: 'upcoming',
          icon: 'Terminal',
          description: `Write automated unit and integration tests with mocking and high branch coverage.`,
          keySkills: ['Unit Testing', 'Integration Testing', 'Mocking', 'Code Coverage'],
          capstoneDeliverable: `Test-Driven Service with >90% Code Coverage`,
          proTip: `Mock third-party API calls so unit test suites remain fast and deterministic.`,
          milestones: [
            { id: 'm15', text: `Write unit test suites covering edge cases and input validation`, done: false },
            { id: 'm16', text: `Set up automated test runners with coverage threshold reports`, done: false }
          ]
        },
        {
          phase: 3,
          title: `Cloud Infrastructure & Containerization`,
          weeks: 'Weeks 7 - 9',
          commitment: '8 hrs/week',
          status: 'upcoming',
          icon: 'Cloud',
          description: `Containerize applications and deploy to scalable cloud environments.`,
          keySkills: ['Docker', 'Cloud Hosting', 'Environment Variables', 'Nginx'],
          capstoneDeliverable: `Multi-Service Containerized Deployment Pipeline`,
          proTip: `Always use multi-stage Docker builds to keep images small and secure.`,
          milestones: [
            { id: 'm17', text: `Set up Docker containers and compose orchestration`, done: false },
            { id: 'm18', text: `Deploy application to cloud provider with health checks`, done: false }
          ]
        },
        {
          phase: 4,
          title: `Application Security & Access Control`,
          weeks: 'Weeks 10 - 12',
          commitment: '8 hrs/week',
          status: 'upcoming',
          icon: 'Server',
          description: `Implement secure JWT authentication, password hashing, and role-based permissions.`,
          keySkills: ['JWT / OAuth2', 'Password Hashing', 'OWASP Top 10', 'CORS & CSP'],
          capstoneDeliverable: 'Role-Based Authentication Gateway with Rate Limiting',
          proTip: `Always store password hashes using bcrypt or Argon2 with adequate salt rounds.`,
          milestones: [
            { id: 'm19', text: `Implement JWT authentication with refresh token rotation`, done: false },
            { id: 'm20', text: `Secure endpoints against CSRF, XSS, and SQL injection attacks`, done: false }
          ]
        },
        {
          phase: 5,
          title: `Database Optimization & Persistence Tuning`,
          weeks: 'Weeks 13 - 15',
          commitment: '8 hrs/week',
          status: 'upcoming',
          icon: 'Database',
          description: `Design normalized schemas, index lookups, and transaction safety.`,
          keySkills: ['Indexing', 'ACID Transactions', 'Query Tuning', 'Connection Pooling'],
          capstoneDeliverable: `High-Performance Relational Schema with Composite Indexing`,
          proTip: `Understand execution plans (EXPLAIN ANALYZE) to identify slow table scans.`,
          milestones: [
            { id: 'm21', text: `Design normalized relational database schema`, done: false },
            { id: 'm22', text: `Benchmark queries and add composite indexes for <10ms response`, done: false }
          ]
        },
        {
          phase: 6,
          title: `System Scalability & Senior Mock Interviews`,
          weeks: 'Weeks 16 - 18',
          commitment: '10 hrs/week',
          status: 'upcoming',
          icon: 'Sparkles',
          description: `Optimize throughput with distributed caching, rate limiters, and mock technical drills.`,
          keySkills: ['Redis Caching', 'Rate Limiting', 'Async Workers', 'Mock Drills'],
          capstoneDeliverable: `Production-Grade Scalable Architecture with Load Testing`,
          proTip: `Practice explaining trade-offs (e.g. Consistency vs Availability) during system design interviews.`,
          milestones: [
            { id: 'm23', text: `Integrate Redis caching to reduce database read load by 80%`, done: false },
            { id: 'm24', text: `Complete 3 full mock senior placement interview rounds`, done: false }
          ]
        }
      ],
      interviewQAs: [
        {
          q: `How do you approach unit testing and code quality in ${roleName}?`,
          a: `By following test-driven development (TDD), mocking external dependencies, and establishing strict continuous integration gates.`
        },
        {
          q: `What is your strategy for optimizing application performance?`,
          a: `Identify bottlenecks via profiling, optimize database queries and indexes, introduce caching layers, and use asynchronous processing for heavy jobs.`
        }
      ]
    }
  ];
}

// Backward compatibility helper
export function getAlumniTwinForRole(roleName, currentSkills = []) {
  const twins = getAlumniTwinsForRole(roleName, currentSkills);
  return {
    roleTitle: roleName,
    alumniTwin: twins[0],
    alumniTwins: twins
  };
}

// Helper: Generate Direct Working YouTube Tutorial Link
export function getSafeYouTubeUrl(link, title) {
  if (link && link.startsWith('https://www.youtube.com/watch?v=')) {
    return link;
  }
  return `https://www.youtube.com/results?search_query=${encodeURIComponent((title || 'Coding') + ' full course tutorial')}`;
}

// Helper: Curate 1 to 2 high-impact Practice Platforms (LeetCode, HackerRank, Kaggle) for each Skill Gap Tool
export function getPracticePlatformsForTool(tool, roleName = '') {
  const title = (tool?.title || '').toLowerCase();
  const cat = (tool?.category || '').toLowerCase();
  const role = (roleName || '').toLowerCase();

  // If already specified on tool object, return it
  if (Array.isArray(tool?.practicePlatforms) && tool.practicePlatforms.length > 0) {
    return tool.practicePlatforms;
  }

  // 1. Data Science / Analytics / Python / Pandas
  if (title.includes('pandas') || title.includes('numpy') || title.includes('polars') || title.includes('data') || cat.includes('wrangling') || cat.includes('analytics') || role.includes('data')) {
    return [
      {
        name: 'LeetCode',
        platformKey: 'leetcode',
        badge: '30 Days of Pandas',
        title: 'LeetCode 30 Days of Pandas Study Plan',
        description: 'Solve 30 real tech interview challenges on DataFrame manipulation, filtering, joins, and aggregations.',
        difficulty: 'Medium • Top Placement Track',
        color: '#FFA116',
        link: 'https://leetcode.com/studyplan/30-days-of-pandas/'
      },
      {
        name: 'HackerRank',
        platformKey: 'hackerrank',
        badge: 'Python Benchmark',
        title: 'HackerRank Python Data Processing Benchmark',
        description: 'Timed assessment challenges testing list comprehensions, lambda maps, data formatting, and regex.',
        difficulty: 'Intermediate • Skill Certificate',
        color: '#00EA64',
        link: 'https://www.hackerrank.com/domains/python'
      }
    ];
  }

  // 2. SQL / Database Architecture / Indexing
  if (title.includes('sql') || title.includes('database') || cat.includes('persistence') || title.includes('indexing') || title.includes('redis')) {
    return [
      {
        name: 'LeetCode',
        platformKey: 'leetcode',
        badge: 'Top SQL 50',
        title: 'LeetCode Top 50 SQL Study Plan',
        description: 'Practice multi-table JOINs, window functions (ROW_NUMBER, DENSE_RANK), and complex CTE subqueries.',
        difficulty: 'Medium • Essential Campus SDE',
        color: '#FFA116',
        link: 'https://leetcode.com/studyplan/top-sql-50/'
      },
      {
        name: 'HackerRank',
        platformKey: 'hackerrank',
        badge: 'Advanced SQL',
        title: 'HackerRank SQL 15-Day Query Challenge',
        description: 'Real-world database queries covering grouping, aggregation filters, and performance indexes.',
        difficulty: 'Advanced • Certificate',
        color: '#00EA64',
        link: 'https://www.hackerrank.com/domains/sql'
      }
    ];
  }

  // 3. Machine Learning / Deep Learning / PyTorch / AI
  if (title.includes('learning') || title.includes('pytorch') || title.includes('xgboost') || title.includes('model') || cat.includes('ai') || cat.includes('ml')) {
    return [
      {
        name: 'Kaggle',
        platformKey: 'kaggle',
        badge: 'Applied ML',
        title: 'Kaggle Intermediate Machine Learning & Feature Engineering',
        description: 'Interactive browser coding environments building XGBoost pipelines, categorical encoding, and SHAP.',
        difficulty: 'Practical • Industry Track',
        color: '#20BEFF',
        link: 'https://www.kaggle.com/learn/intro-to-machine-learning'
      },
      {
        name: 'LeetCode',
        platformKey: 'leetcode',
        badge: 'ML & Math',
        title: 'LeetCode Machine Learning & Algorithmic Problem Set',
        description: 'Solve gradient descent algorithms, matrix multiplications, and loss function implementations in Python.',
        difficulty: 'Hard • Model Coding',
        color: '#FFA116',
        link: 'https://leetcode.com/problemset/all/?topicSlugs=math'
      }
    ];
  }

  // 4. Cloud / Docker / Kubernetes / DevOps / CI/CD
  if (title.includes('docker') || title.includes('kubernetes') || title.includes('cloud') || title.includes('ci/cd') || cat.includes('devops')) {
    return [
      {
        name: 'HackerRank',
        platformKey: 'hackerrank',
        badge: 'Linux & Shell',
        title: 'HackerRank Linux Shell & Scripting Challenges',
        description: 'Practice automated bash scripting, process management, text stream filtering, and environment config.',
        difficulty: 'Intermediate • System Ops',
        color: '#00EA64',
        link: 'https://www.hackerrank.com/domains/shell'
      },
      {
        name: 'LeetCode',
        platformKey: 'leetcode',
        badge: 'Concurrency 101',
        title: 'LeetCode Multi-Threading & Concurrency Study Plan',
        description: 'Master asynchronous locks, condition variables, semaphores, and race condition prevention.',
        difficulty: 'Medium • Backend Core',
        color: '#FFA116',
        link: 'https://leetcode.com/studyplan/concurrency/'
      }
    ];
  }

  // 5. Default SDE / Core DSA / Web Frameworks
  return [
    {
      name: 'LeetCode',
      platformKey: 'leetcode',
      badge: 'Top 150',
      title: 'LeetCode Top Interview 150 Study Plan',
      description: 'The golden benchmark for campus recruitment: Two Pointers, Trees, Graphs, and Dynamic Programming.',
      difficulty: 'Medium/Hard • Campus Recruiters Fav',
      color: '#FFA116',
      link: 'https://leetcode.com/studyplan/top-interview-150/'
    },
    {
      name: 'HackerRank',
      platformKey: 'hackerrank',
      badge: 'Problem Solving',
      title: 'HackerRank Problem Solving & Data Structures',
      description: 'Master core logic, sorting algorithms, bit manipulation, and big-O runtime optimizations.',
      difficulty: 'Intermediate • Gold Badge',
      color: '#00EA64',
      link: 'https://www.hackerrank.com/domains/algorithms'
    }
  ];
}
