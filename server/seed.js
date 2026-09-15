import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import College from './models/College.js';
import Member from './models/Member.js';
import PreVerifiedStudent from './models/PreVerifiedStudent.js';
import Event from './models/Event.js';
import Comment from './models/Comment.js';
import Job from './models/Job.js';
import Survey from './models/Survey.js';
import Blog from './models/Blog.js';
import Team from './models/Team.js';
import Notification from './models/Notification.js';
import ConnectionRequest from './models/ConnectionRequest.js';
import SurveyResponse from './models/SurveyResponse.js';

dotenv.config();

const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/alumniconnect';

const colleges = [
  {
    id: "col-1",
    name: "Government Engineering College",
    code: "GEC",
    location: "Chamarajanagar, Karnataka",
    established: 2007,
    departments: ["Computer Science", "Information Science", "Electronics & Communication", "Mechanical Engineering", "Civil Engineering"]
  },
  {
    id: "col-2",
    name: "RV College of Engineering",
    code: "RVCE",
    location: "Bengaluru, Karnataka",
    established: 1963,
    departments: ["Computer Science", "Information Science", "Electronics & Communication", "Mechanical Engineering", "Biotechnology"]
  },
  {
    id: "col-3",
    name: "PES University",
    code: "PESU",
    location: "Bengaluru, Karnataka",
    established: 1972,
    departments: ["Computer Science", "Electronics & Communication", "Mechanical Engineering", "MBA", "MCA"]
  },
  {
    id: "col-4",
    name: "BMS College of Engineering",
    code: "BMSCE",
    location: "Bengaluru, Karnataka",
    established: 1946,
    departments: ["Computer Science", "Information Science", "Electronics & Communication", "Electrical Engineering", "Civil Engineering"]
  },
  {
    id: "col-5",
    name: "Indian Institute of Science",
    code: "IISc",
    location: "Bengaluru, Karnataka",
    established: 1909,
    departments: ["Computer Science & Automation", "Electrical Engineering", "Physics", "Chemistry", "Materials Engineering"]
  }
];

const members = [
  {
    id: "admin-1",
    firstName: "Rajesh",
    lastName: "Kumar",
    email: "admin@demo.com",
    password: "demo123",
    role: "college_admin",
    collegeId: "col-1",
    department: "Computer Science",
    graduationYear: 1995,
    degree: "PhD",
    status: "active",
    isVerified: true
  },
  {
    id: "stud-1",
    firstName: "Rahul",
    lastName: "Kumar",
    email: "student@demo.com",
    password: "demo123",
    role: "student",
    collegeId: "col-1",
    department: "Computer Science",
    graduationYear: 2027,
    degree: "B.Tech",
    status: "active",
    isVerified: true,
    rollNumber: "4EG2027001",
    skills: ["HTML/CSS", "JavaScript", "React", "Python"],
    bio: "Computer science student seeking software engineering internships.",
    location: "Bengaluru",
    connections: ["alum-1"]
  },
  {
    id: "alum-1",
    firstName: "Priya",
    lastName: "Sharma",
    email: "alumni@demo.com",
    password: "demo123",
    role: "alumni",
    collegeId: "col-1",
    department: "Computer Science",
    graduationYear: 2020,
    degree: "B.Tech",
    status: "active",
    isVerified: true,
    currentCompany: "Google",
    currentRole: "Software Engineer III",
    location: "Bengaluru",
    skills: ["React", "JavaScript", "Node.js", "System Design", "HTML/CSS"],
    connections: ["stud-1"],
    bio: "Passionate software engineer building scaled frontend systems.",
    isMentor: true,
    mentorTopics: ["Frontend Development", "System Design"]
  },
  {
    id: "alum-2",
    firstName: "Rohan",
    lastName: "Verma",
    email: "rohan.verma@example.com",
    password: "demo123",
    role: "alumni",
    collegeId: "col-1",
    department: "Computer Science",
    graduationYear: 2019,
    degree: "B.Tech",
    status: "active",
    isVerified: true,
    currentCompany: "Microsoft",
    currentRole: "Senior Software Engineer",
    location: "Hyderabad",
    skills: ["C#", ".NET Core", "Azure", "React"],
    bio: "Backend specialist with 5+ years of microservices experience.",
    isMentor: true,
    mentorTopics: ["Cloud Architecture", "Backend Engineering"]
  },
  {
    id: "alum-3",
    firstName: "Anjali",
    lastName: "Rao",
    email: "anjali.rao@example.com",
    password: "demo123",
    role: "alumni",
    collegeId: "col-2",
    department: "Information Science",
    graduationYear: 2021,
    degree: "B.Tech",
    status: "active",
    isVerified: true,
    currentCompany: "Infosys",
    currentRole: "Systems Engineer",
    location: "Mysuru",
    skills: ["Java", "Spring Boot", "Hibernate"],
    bio: "Enthusiastic developer building web applications."
  }
];

const preVerifiedStudents = [
  { rollNumber: "4EG2027001", firstName: "Rahul", lastName: "Kumar", email: "student@demo.com", department: "Computer Science", expectedGraduationYear: 2027, degree: "B.Tech", collegeId: "col-1" },
  { rollNumber: "4EG2027002", firstName: "Neha", lastName: "Verma", email: "neha.verma@example.com", department: "Computer Science", expectedGraduationYear: 2027, degree: "B.Tech", collegeId: "col-1" },
  { rollNumber: "4EG2027003", firstName: "Aarav", lastName: "Mehta", email: "aarav.mehta@example.com", department: "Computer Science", expectedGraduationYear: 2027, degree: "B.Tech", collegeId: "col-1" },
  { rollNumber: "4EG2027004", firstName: "Kriti", lastName: "Joshi", email: "kriti.joshi@example.com", department: "Information Science", expectedGraduationYear: 2027, degree: "B.Tech", collegeId: "col-1" }
];

const events = [
  {
    id: "event-freshers",
    title: "Freshers Day Welcome Party 2026",
    description: "Grand welcome bash for new students featuring Mr. & Ms. Freshers pageant, musical acts, western & folk dance battles, ramp walks, and stand-up comedy.",
    date: new Date("2026-09-12T15:00:00.000Z"),
    time: "3:00 PM - 8:30 PM",
    location: "Main Auditorium & Quadrangle, Campus",
    type: "freshers",
    organizer: "Student Council & Cultural Committee",
    maxAttendees: 600,
    currentAttendees: 0,
    rsvps: [],
    fee: 0,
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&fit=crop&q=80",
    registrationMode: "custom_form",
    collegeId: "col-1"
  },
  {
    id: "event-sports",
    title: "Annual Sports Championship 2026",
    description: "Inter-departmental and alumni sports meet including Cricket, Football, 100m Sprint, Badminton, Table Tennis, Chess, and Basketball championships.",
    date: new Date("2026-09-19T10:00:00.000Z"),
    time: "10:00 AM - 4:00 PM",
    location: "College Sports Grounds & Indoor Arena",
    type: "sports",
    organizer: "Department of Physical Education",
    maxAttendees: 500,
    currentAttendees: 0,
    rsvps: [],
    fee: 0,
    image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&auto=format&fit=crop&q=80",
    registrationMode: "custom_form",
    collegeId: "col-1"
  },
  {
    id: "event-ethnic",
    title: "Ethnic Day Celebrations 2026",
    description: "Celebrate Indian heritage and diversity with traditional ethnic fashion walk, folk group dance, photography contest, rangoli, and regional cultural showcases.",
    date: new Date("2026-09-25T11:00:00.000Z"),
    time: "11:00 AM - 6:00 PM",
    location: "Heritage Lawn & Central Courtyard",
    type: "cultural",
    organizer: "Arts & Heritage Society",
    maxAttendees: 700,
    currentAttendees: 0,
    rsvps: [],
    fee: 0,
    image: "https://images.unsplash.com/photo-1532375810709-75b1da00537c?w=800&auto=format&fit=crop&q=80",
    registrationMode: "custom_form",
    collegeId: "col-1"
  },
  {
    id: "event-reunion",
    title: "Annual Alumni Reunion & Leadership Summit 2026",
    description: "Reconnect with classmates, interact with distinguished alumni leaders, attend keynote panels, enjoy high tea, and celebrate decades of campus memories.",
    date: new Date("2026-09-20T10:00:00.000Z"),
    time: "10:00 AM - 4:00 PM",
    location: "Main Auditorium & Alumni Lawns",
    type: "reunion",
    organizer: "Government Engineering College & Alumni Relations",
    maxAttendees: 500,
    currentAttendees: 3,
    rsvps: ["alum-1", "alum-2", "alum-3"],
    fee: 500,
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&auto=format&fit=crop&q=80",
    registrationMode: "custom_form",
    collegeId: "col-1"
  },
  {
    id: "event-workshop",
    title: "Workshop: Building Scalable Web & Cloud Architectures",
    description: "Master modern microservices, Docker & Kubernetes containerization, AWS cloud deployment, and Generative AI backend pipelines with industry veterans.",
    date: new Date("2026-09-28T14:30:00.000Z"),
    time: "2:30 PM - 5:30 PM",
    location: "Seminar Hall 2 & CS Innovation Lab",
    type: "workshop",
    organizer: "Priya Sharma",
    maxAttendees: 150,
    currentAttendees: 2,
    rsvps: ["alum-1", "alum-2"],
    fee: 0,
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=80",
    registrationMode: "custom_form",
    collegeId: "col-1"
  },
  {
    id: "event-hackathon",
    title: "National Campus Hackathon & AI Challenge 2026",
    description: "Collaborate with peers, mentors, and judges to build cutting-edge AI and software solutions. Form squads, code for 24 hours, and pitch to angel investors.",
    date: new Date("2026-10-15T09:00:00.000Z"),
    time: "9:00 AM - 9:00 PM",
    location: "SJCE Mysuru & Virtual Discord Arena",
    type: "hackathon",
    organizer: "Sri Jayachamarajendra College of Engineering",
    maxAttendees: 300,
    currentAttendees: 1,
    rsvps: ["alum-1"],
    fee: 0,
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=80",
    registrationMode: "hackathon",
    problemStatementName: "smart_campus_challenges_2026.pdf",
    problemStatementUrl: "https://example.com/smart_campus_challenges_2026.pdf",
    collegeId: "col-1"
  },
  {
    id: "event-utsav",
    title: "Cultural Fest 'Utsav' 2026",
    description: "Annual multi-genre mega cultural festival featuring live rock music bands, group choreography, fashion runway, and street food stalls.",
    date: new Date("2026-11-05T17:00:00.000Z"),
    time: "5:00 PM - 10:00 PM",
    location: "Open Air Theatre (OAT), Campus Lawns",
    type: "cultural",
    organizer: "Cultural Club & Student Council",
    maxAttendees: 800,
    currentAttendees: 1,
    rsvps: ["stud-1"],
    fee: 0,
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80",
    registrationMode: "custom_form",
    collegeId: "col-1"
  }
];

const comments = [
  { id: "c-1", eventId: "event-1", userId: "alum-2", userName: "Rohan Verma", userRole: "alumni", text: "Hey everyone! Anyone traveling from Hyderabad for the reunion? Looking to coordinate travel/carpooling.", timestamp: new Date("2026-06-10T12:00:00.000Z") },
  { id: "c-2", eventId: "event-1", userId: "stud-1", userName: "Rahul Kumar", userRole: "student", text: "I can help with directions or accommodation suggestions near campus if anyone needs them!", timestamp: new Date("2026-06-10T14:30:00.000Z") }
];

const jobs = [
  {
    id: "job-1",
    title: "Software Engineer - Frontend",
    company: "Google",
    location: "Bengaluru, India",
    type: "Full-time",
    experience: "2-5 years",
    salary: "₹25L - ₹35L",
    description: "Looking for an expert frontend engineer to build next-generation search UI components. Experience in React, performance tuning, and accessability is required.",
    requirements: ["React", "JavaScript", "HTML/CSS", "System Design", "Web Performance"],
    postedBy: "alum-1",
    postedDate: new Date("2026-08-01T08:00:00.000Z"),
    applicants: 12,
    status: "active",
    deadline: new Date("2026-10-15T18:00:00.000Z"),
    applyUrl: "https://careers.google.com",
    collegeId: "col-1"
  },
  {
    id: "job-2",
    title: "Senior Full Stack Developer",
    company: "Microsoft",
    location: "Hyderabad, India",
    type: "Full-time",
    experience: "5+ years",
    salary: "₹30L - ₹45L",
    description: "Join the Azure Developer Services team. Design, build, and support cloud services. Develop scalable client interfaces and robust microservices.",
    requirements: ["C#", ".NET Core", "Azure", "React", "SQL Server", "System Design"],
    postedBy: "alum-2",
    postedDate: new Date("2026-08-03T10:30:00.000Z"),
    applicants: 8,
    status: "active",
    deadline: new Date("2026-11-30T18:00:00.000Z"),
    applyUrl: "https://careers.microsoft.com",
    collegeId: "col-1"
  },
  {
    id: "job-3",
    title: "Product Management Intern",
    company: "Amazon",
    location: "Remote",
    type: "Internship",
    experience: "0-2 years",
    salary: "₹50,000 / month",
    description: "Ideal role for MBA grads wanting to break into tech product management. Work closely with software teams to define product specifications and launch features.",
    requirements: ["Product Strategy", "Agile", "User Research", "Data Analytics", "Communication"],
    postedBy: "alum-5",
    postedDate: new Date("2026-08-05T09:00:00.000Z"),
    applicants: 24,
    status: "active",
    deadline: new Date("2026-10-31T18:00:00.000Z"),
    collegeId: "col-1"
  },
  {
    id: "job-4",
    title: "Machine Learning Researcher",
    company: "IBM Research",
    location: "Bengaluru, India",
    type: "Full-time",
    experience: "2-5 years",
    salary: "₹28L - ₹40L",
    description: "Develop cutting-edge foundation models for NLP and reasoning. Write publications for top-tier AI conferences (NeurIPS, ICML, ACL).",
    requirements: ["Machine Learning", "Python", "PyTorch", "NLP", "TensorFlow", "Research Experience"],
    postedBy: "alum-7",
    postedDate: new Date("2026-08-08T14:20:00.000Z"),
    applicants: 5,
    status: "active",
    deadline: new Date("2026-11-15T18:00:00.000Z"),
    collegeId: "col-1"
  },
  {
    id: "job-5",
    title: "Embedded Systems Engineer",
    company: "Qualcomm",
    location: "Bengaluru, India",
    type: "Full-time",
    experience: "2-5 years",
    salary: "₹18L - ₹26L",
    description: "Develop device drivers and low-level firmware for modem chips. Ensure performance, power efficiency, and hardware constraints are met.",
    requirements: ["Verilog", "Embedded Systems", "C++", "VLSI Design", "RTOS", "C"],
    postedBy: "alum-4",
    postedDate: new Date("2026-08-09T11:00:00.000Z"),
    applicants: 3,
    status: "active",
    deadline: new Date("2026-10-20T18:00:00.000Z"),
    collegeId: "col-1"
  },
  {
    id: "job-6",
    title: "Junior Data Analyst",
    company: "TCS Digital",
    location: "Pune, India",
    type: "Full-time",
    experience: "0-2 years",
    salary: "₹7L - ₹10L",
    description: "Work with business intelligence and ETL pipelines. Generate automated dashboards using SQL and PowerBI.",
    requirements: ["SQL", "Python", "PowerBI", "Excel", "Data Analytics"],
    postedBy: "alum-3",
    postedDate: new Date("2026-06-01T10:00:00.000Z"),
    applicants: 42,
    status: "closed",
    deadline: new Date("2026-07-01T18:00:00.000Z"),
    collegeId: "col-1"
  }
];

const surveys = [
  {
    id: "survey-1",
    title: "Alumni Feedback Survey 2026",
    description: "Provide feedback regarding the recent placement statistics and curriculum revisions.",
    questions: [
      { id: "q-1", type: "mcq", question: "How would you rate the current curriculum alignment with industry standard?", options: ["Excellent", "Good", "Average", "Needs Improvement"], required: true },
      { id: "q-2", type: "rating", question: "How would you rate the college infrastructure and lab facilities?", required: true },
      { id: "q-3", type: "text", question: "Any specific technologies we should introduce to students?", required: false }
    ],
    status: "active",
    responses: 3,
    collegeId: "col-1",
    deadline: new Date("2026-08-30T18:00:00.000Z")
  },
  {
    id: "survey-2",
    title: "Curriculum Industry Alignment Review",
    description: "Provide feedback on whether our current computer science curriculum meets the latest requirements of top-tier technology companies.",
    questions: [
      { id: "q-1", type: "mcq", question: "Do you think the current programming languages taught are sufficient?", options: ["Yes, basic concepts are solid", "No, Python/JavaScript should be prioritized"], required: true }
    ],
    status: "active",
    responses: 0,
    collegeId: "col-1",
    deadline: new Date("2026-07-01T12:00:00.000Z") // Past/expired deadline
  }
];

const surveyResponses = [
  {
    surveyId: "survey-1",
    responses: [
      { qId: "q-1", value: "Excellent" },
      { qId: "q-2", value: 5 },
      { qId: "q-3", value: "We should focus on React and modern CSS." }
    ],
    submittedBy: "alum-1",
    date: new Date("2026-06-15T10:00:00.000Z")
  },
  {
    surveyId: "survey-1",
    responses: [
      { qId: "q-1", value: "Good" },
      { qId: "q-2", value: 4 },
      { qId: "q-3", value: "TypeScript and Node.js are very important." }
    ],
    submittedBy: "alum-2",
    date: new Date("2026-06-16T11:00:00.000Z")
  },
  {
    surveyId: "survey-1",
    responses: [
      { qId: "q-1", value: "Average" },
      { qId: "q-2", value: 3 },
      { qId: "q-3", value: "Docker and cloud deployment basics." }
    ],
    submittedBy: "alum-3",
    date: new Date("2026-06-17T12:00:00.000Z")
  }
];

const blogs = [
  {
    id: "blog-1",
    title: "My Journey from GEC to Google: Priya's Story",
    excerpt: "Priya Sharma shares her career trajectory, preparation strategies, and advice for students looking to break into product-based companies.",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1000&q=80",
    content: `## My Journey from GEC to Google\n\nGrowing up in Karnataka, GEC was always the dream college. Studying computer science there laid the groundwork for my career. In this article, I want to share some tips that helped me navigate the transition from campus to Google.\n\n![Placement Day & Alumni Mentorship](https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=80)\n\n### 1. Master the Fundamentals\nDon't rush into learning frameworks like React or Node right away. Spend ample time with **Data Structures & Algorithms**. Understanding how memory works, how collections are organized, and complexity trade-offs is what differentiates high-level engineers.\n\n### 2. Personal Projects Matter\nTheory is good, but building *real* projects teaches you how things break. I remember building an automated scheduling system for our college cultural festival. That project taught me about asynchronous tasks, race conditions, and user flows more than any classroom lecture.\n\n[Video: Google Campus Engineering Overview](https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4)\n\n### 3. Seek Mentorship\nDo not hesitate to connect with seniors. A short 15-minute conversation can save you months of directionless effort. That is one of the reasons I volunteered to be a mentor on this very platform.\n\nFeel free to reach out to me! Wishing you all the very best.`,
    author: {
      name: "Priya Sharma",
      role: "Software Engineer III at Google",
      avatarInitials: "PS"
    },
    publishedDate: new Date("2026-05-12T10:00:00.000Z"),
    category: "success-story",
    tags: ["Google", "Placement Prep", "Career Growth"],
    likes: 84,
    comments: 15,
    featured: true
  },
  {
    id: "blog-2",
    title: "Understanding LLMs and the Future of AI Research",
    excerpt: "Deepa Patel writes about transfer learning, fine-tuning methodologies, and current trends in natural language processing.",
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1000&q=80",
    content: `## The Era of Large Language Models\n\nMachine Learning has advanced at a breakneck speed over the last few years. Large Language Models (LLMs) have transformed how we interact with software. But what does the research landscape look like for fresh graduates?\n\n![Transformer Architecture & Foundation Models](https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80)\n\n### The Shift from Scratch to Pre-training\nPreviously, building an AI model meant training from scratch. Today, we stand on the shoulders of giants. We take pre-trained weights and fine-tune them using techniques like **LoRA (Low-Rank Adaptation)** or **QLoRA** to achieve high performance on niche domains.\n\n[Video: Neural Network Architecture & Model Weights](https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4)\n\n### Research vs Engineering\nAI Engineering involves building applications around existing APIs. AI Research involves understanding *why* things work and building better model architectures. If you plan to go down the research path:\n- Build a solid math foundation (Linear Algebra, Calculus, Probability).\n- Start reading research papers on arXiv.\n- Work on reproducing benchmark results from scratch.\n\nExciting times lie ahead!`,
    author: {
      name: "Deepa Patel",
      role: "Research Scientist at IBM Research",
      avatarInitials: "DP"
    },
    publishedDate: new Date("2026-06-02T11:45:00.000Z"),
    category: "tech",
    tags: ["AI", "Machine Learning", "Research"],
    likes: 42,
    comments: 6,
    featured: false
  },
  {
    id: "blog-3",
    title: "A Complete Guide to Product Management for Engineers",
    excerpt: "Transitioning from coding to product strategy requires a mindset shift. Siddharth Mehta breaks down key tips.",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1000&q=80",
    content: `## Transitioning from Code to Product\n\nAs an engineer, your job is to build the solution right. As a Product Manager (PM), your job is to make sure you are building the *right solution*. Let's talk about how to make this transition.\n\n![Team Product Ideation Session](https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80)\n\n### 1. Shift from 'How' to 'Why'\nWhen presented with a problem, engineers immediately think of the stack, db schema, and api endpoints. As a PM, you must ask:\n- Who is the user experiencing this problem?\n- Why is it worth solving now?\n- How does it align with our business goals?\n\n### 2. Learn User Empathy\nSit in on support calls, watch user session recordings, and study feedback surveys. You cannot design features based on what *you* find convenient. You must design for the average customer.\n\n[Video: Product Roadmap Strategy & Sprint Demos](https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4)\n\n### 3. Talk data, not opinion\nIf you want to propose a new feature, don't say "I think it will be cool." Say "According to our recent onboarding logs, 35% of users drop off at the credit card input step. If we add auto-fill or UPI, we can increase conversion by 5-10%."\n\nFeel free to connect!`,
    author: {
      name: "Siddharth Mehta",
      role: "Senior PM at Amazon",
      avatarInitials: "SM"
    },
    publishedDate: new Date("2026-06-05T09:30:00.000Z"),
    category: "career-tips",
    tags: ["Product Management", "Career Shift", "MBA"],
    likes: 56,
    comments: 8,
    featured: false
  },
  {
    id: "blog-4",
    title: "GEC Inaugurates Advanced AI & Robotics Innovation Center with $2M Alumni Endowment",
    excerpt: "A state-of-the-art research facility dedicated to Autonomous Systems and Deep Learning opens on campus, funded by generous alumni endowments.",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1000&q=80",
    content: `## Transforming Campus Research with Global Alumni Support\n\nWe are thrilled to announce the official opening of the **Center for Artificial Intelligence & Autonomous Robotics** at the GEC campus. Made possible by a landmark $2,000,000 endowment fund contributed by our distinguished alumni worldwide, this center represents a monumental step forward for academic research and student innovation.\n\n![Campus Innovation Center](https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&q=80)\n\n### Lab Facilities & Supercomputing Resources\nThe new center houses cutting-edge infrastructure available to both undergraduate and postgraduate students:\n- **High-Performance Compute Cluster**: Equipped with dedicated NVIDIA H100 tensor core GPUs for training large generative models.\n- **Robotics Test Arena**: Dedicated obstacle courses and vision systems for autonomous rover and drone flight testing.\n- **Industry Incubation Pods**: Spaces where student startups can receive direct mentorship from alumni venture capitalists and technical directors.\n\n### Student Access & Research Grants\nStarting next month, students can apply for research grants of up to ₹2,50,000 per project. Alumni mentors from Google, Microsoft, and NVIDIA will serve as honorary co-advisors on active student publications.\n\nStay tuned for the open house schedule next week!`,
    author: {
      name: "Dr. Rajesh Kumar",
      role: "Department Head & Placement Coordinator",
      avatarInitials: "RK"
    },
    publishedDate: new Date("2026-06-18T14:00:00.000Z"),
    category: "campus-news",
    tags: ["Campus News", "Robotics", "Alumni Grant", "AI Lab"],
    likes: 112,
    comments: 24,
    featured: true
  },
  {
    id: "blog-5",
    title: "Annual Alumni Global Homecoming & Conclave 2026 Announced",
    excerpt: "Over 500+ global alumni leaders are returning to campus for keynote panels, mentorship clinics, seed fund pitch days, and reunion galas.",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1000&q=80",
    content: `## Reconnect, Celebrate & Inspire: Homecoming 2026\n\nThe Alumni Relations Cell is delighted to unveil the dates for the **Annual Alumni Global Homecoming & Conclave 2026**, scheduled from **September 20th to 22nd, 2026**.\n\n![Alumni Gala & Networking](https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&q=80)\n\n### Event Highlights\n1. **Distinguished Alumni Awards**: Celebrating pioneers across technology, civil services, entrepreneurship, and public service.\n2. **Student Venture Showcase**: 10 student-led tech teams will pitch live to an alumni angel investor panel for a ₹25,000,000 seed grant pool.\n3. **1-on-1 Speed Mentorship**: Pre-booked slots for final year students to review resumes and portfolios with engineering managers.\n4. **Evening Gala & Cultural Night**: Rekindling campus memories with musical performances and high tea at the Main Quadrangle.\n\nRSVP is now live under the Events tab in your alumni portal!`,
    author: {
      name: "Alumni Relations Cell",
      role: "GEC Campus Administration",
      avatarInitials: "AR"
    },
    publishedDate: new Date("2026-06-15T09:00:00.000Z"),
    category: "campus-news",
    tags: ["Homecoming 2026", "Campus News", "Networking", "Events"],
    likes: 95,
    comments: 18,
    featured: false
  },
  {
    id: "blog-6",
    title: "From College Hackathon Project to a $50M FinTech Valuation: The PayFlow Story",
    excerpt: "How our final-year distributed payment ledger project transformed into a real-time cross-border settlements engine serving 200k+ merchants.",
    image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=1000&q=80",
    content: `## The Journey of PayFlow: From Hostel Room to Series B\n\nIn 2019, four of us sat in Hostel Block 3 participating in the National Campus Hackathon. Our goal was simple: make UPI micro-payments fail less often during peak traffic hours. Today, PayFlow processes over 40 million transactions monthly across South Asia.\n\n![Team Ideation & Build](https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80)\n\n### Three Lessons for Aspiring Student Founders\n\n#### 1. Solve Problems You Personally Understand\nWe didn't start with complex buzzwords. We started because our campus cafeteria was constantly struggling with server timeouts during lunch break. Solve small, acute pains before tackling global problems.\n\n#### 2. Your College Peers are Your Greatest Asset\nYour co-founders, initial beta testers, and first hires are likely sitting next to you in your lecture hall. The trust you build in college during hackathons is impossible to recreate in corporate boardrooms.\n\n#### 3. Focus on Unit Economics Early\nGrowth without retention is vanity. We spent our first two years polishing latency, fault tolerance, and security before spending a single rupee on marketing.\n\nFeel free to connect with me if you are building in the FinTech or distributed systems space!`,
    author: {
      name: "Rohan Verma",
      role: "Senior Software Engineer & Tech Co-Founder",
      avatarInitials: "RV"
    },
    publishedDate: new Date("2026-06-10T11:20:00.000Z"),
    category: "success-story",
    tags: ["Startup", "FinTech", "Success Story", "Entrepreneurship"],
    likes: 148,
    comments: 32,
    featured: false
  },
  {
    id: "blog-7",
    title: "Cracking Tier-1 Tech Interviews: The Ultimate DSA & System Design Playbook",
    excerpt: "A battle-tested 12-week preparation roadmap covering core DSA patterns, low-level design, distributed system fundamentals, and mock interview etiquette.",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1000&q=80",
    content: `## The 12-Week Blueprint to Top-Tier Placement Offers\n\nInterviewing for top engineering roles can feel overwhelming. Having interviewed candidates and mentored dozens of students through successful placements at Google, Amazon, and Uber, here is the structured strategy I recommend.\n\n![Coding & Preparation](https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80)\n\n### Weeks 1-4: Master Patterns, Not Quantities\nSolving 500 random problems on LeetCode is inefficient. Instead, master the core 14 algorithmic patterns:\n- Two Pointers & Sliding Window\n- Fast & Slow Pointers\n- Monotonic Queue / Stack\n- Modified Binary Search\n- Topological Sort & Graph Traversals (BFS/DFS)\n- Dynamic Programming: Knapsack & Subsequence State Transitions\n\n### Weeks 5-8: System Design & Scalability\nFor senior roles and top startups, understanding architectural trade-offs is non-negotiable:\n- Understand database scaling (Sharding, Replication, Read Replicas vs Write Masters)\n- Caching strategies (Write-through, Write-back, Cache Invalidation via TTL/LRU)\n- Load balancing algorithms and API gateway rate limiting.\n\n### Weeks 9-12: Mock Interviews & Behavioral Mastery\nPractice communicating your thought process out loud. Use the **STAR method** (Situation, Task, Action, Result) for behavioral questions. Be ready to explain trade-offs you made in your past projects.\n\nBest of luck with your placement season!`,
    author: {
      name: "Priya Sharma",
      role: "Software Engineer III at Google",
      avatarInitials: "PS"
    },
    publishedDate: new Date("2026-06-08T08:30:00.000Z"),
    category: "career-tips",
    tags: ["Interview Prep", "DSA", "System Design", "FAANG"],
    likes: 210,
    comments: 45,
    featured: false
  },
  {
    id: "blog-8",
    title: "Building High-Throughput Event-Driven Systems with Apache Kafka & Go",
    excerpt: "Real-world engineering insights on consumer group rebalancing, idempotent message processing, dead-letter queues, and benchmark tuning.",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1000&q=80",
    content: `## Architecting Scalable Message Streams\n\nWhen scaling backend systems beyond 100,000 requests per second, traditional synchronous HTTP request-response architectures quickly hit database connection pool bottlenecks and thread saturation. Event-driven streaming with Apache Kafka and Golang is an industry standard solution.\n\n![Distributed Servers & Data Pipes](https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80)\n\n### Key Architectural Pillars\n\n#### 1. Partition Key Strategy\nAlways choose a partition key that evenly distributes message loads while maintaining strict ordering guarantees where necessary (e.g., partitioning by \`user_id\` for sequential account ledger operations).\n\n#### 2. Idempotency & Exactly-Once Semantics\nNetwork hiccups mean duplicate delivery is inevitable. Use a deduplication layer powered by Redis Bloom Filters and transactional database upserts keyed on a unique \`event_id\`.\n\n#### 3. Dead Letter Queues (DLQ) & Circuit Breaking\nNever let a malformed payload poison your consumer group. After 3 retries with exponential backoff and jitter, route faulty messages to a DLQ topic with Prometheus alerts for debugging.\n\nHappy coding!`,
    author: {
      name: "Rohan Verma",
      role: "Senior Software Engineer at Microsoft",
      avatarInitials: "RV"
    },
    publishedDate: new Date("2026-05-28T16:15:00.000Z"),
    category: "tech",
    tags: ["Kafka", "Golang", "Microservices", "Backend Architecture"],
    likes: 77,
    comments: 12,
    featured: false
  },
  {
    id: "blog-9",
    title: "Resume Masterclass: How to Craft ATS-Proof Technical Portfolios that Get Callbacks",
    excerpt: "What hiring managers and automated applicant tracking systems look for in fresh graduate resumes, along with common pitfalls to avoid.",
    image: "https://images.unsplash.com/photo-1450133064473-71024230f91b?w=1000&q=80",
    content: `## The Anatomy of an ATS-Friendly Tech Resume\n\nAs a recruiter and campus evaluator, I review hundreds of student resumes each placement cycle. Most rejections happen not due to a lack of talent, but because the resume fails to communicate tangible impact clearly to hiring software and screening panels.\n\n![Resume Review & Career Strategy](https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80)\n\n### Core Rules for High Conversion\n\n#### 1. Use the Google X-Y-Z Formula\nInstead of writing:\n> *"Created a React app for hostel management."*\n\nWrite:\n> *"Developed an automated hostel room allocation portal using React and Node.js, reducing manual check-in time by 75% for 1,200+ residential students."*\n\n#### 2. Clean Formatting Without Multi-Column Tables\nMany ATS parsers struggle to extract text from multi-column tables, text boxes, or decorative graphics. Use a clean, single-column standard template with clear section headers (\`Education\`, \`Experience\`, \`Projects\`, \`Technical Skills\`).\n\n#### 3. Provide Working, Accessible Demo Links\nInclude live deployed URLs (Vercel, Render, Netlify) alongside GitHub links. Hiring managers love clicking a live working link to test your UX in 10 seconds.\n\nFeel free to submit your resume for review using the mentorship tab!`,
    author: {
      name: "Anjali Rao",
      role: "Systems Engineer & Alumni Mentor",
      avatarInitials: "AR"
    },
    publishedDate: new Date("2026-05-20T10:00:00.000Z"),
    category: "career-tips",
    tags: ["Resume Tips", "Career Advice", "Placement Prep", "ATS"],
    likes: 165,
    comments: 28,
    featured: false
  }
];

const notifications = [
  {
    id: "notif-1",
    title: "Account Verified",
    content: "Your profile has been successfully verified! Welcome to AlumniConnect.",
    message: "Your profile has been successfully verified! Welcome to AlumniConnect.",
    date: new Date("2026-06-05T08:00:00.000Z"),
    read: false,
    role: "student",
    userId: "stud-1"
  },
  {
    id: "notif-2",
    title: "New Job Opportunity",
    content: "Priya Sharma posted a new job: Software Engineer at Google.",
    message: "Priya Sharma posted a new job: Software Engineer at Google.",
    date: new Date("2026-06-06T10:00:00.000Z"),
    read: false,
    role: "student",
    collegeId: "col-1"
  },
  {
    id: "notif-3",
    title: "Upcoming Event",
    content: "Grand Alumni Reunion 2026 is scheduled for next week. RSVP now!",
    message: "Grand Alumni Reunion 2026 is scheduled for next week. RSVP now!",
    date: new Date("2026-06-07T12:00:00.000Z"),
    read: false,
    role: "student",
    collegeId: "col-1"
  },
  {
    id: "notif-4",
    title: "Connection Request Received",
    content: "Rahul Kumar wants to connect with you.",
    message: "Rahul Kumar wants to connect with you.",
    date: new Date("2026-06-08T09:00:00.000Z"),
    read: false,
    role: "alumni",
    userId: "alum-1"
  },
  {
    id: "notif-5",
    title: "Verification Request",
    content: "Karan Sinha applied for registration. Needs verification.",
    message: "Karan Sinha applied for registration. Needs verification.",
    date: new Date("2026-06-09T15:00:00.000Z"),
    read: false,
    role: "college_admin",
    collegeId: "col-1"
  }
];

const connectionRequests = [
  {
    id: "req-1",
    from: "stud-1",
    to: "alum-1",
    status: "accepted",
    date: new Date("2026-06-08T09:00:00.000Z")
  },
  {
    id: "req-2",
    from: "alum-2",
    to: "stud-1",
    status: "pending",
    date: new Date("2026-06-10T10:00:00.000Z")
  }
];

async function seed() {
  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB at', mongoUri);

    // Delete existing records
    await College.deleteMany({});
    await Member.deleteMany({});
    await PreVerifiedStudent.deleteMany({});
    await Event.deleteMany({});
    await Comment.deleteMany({});
    await Job.deleteMany({});
    await Survey.deleteMany({});
    await SurveyResponse.deleteMany({});
    await Blog.deleteMany({});
    await Team.deleteMany({});
    await Notification.deleteMany({});
    await ConnectionRequest.deleteMany({});

    console.log('Cleared existing data.');

    // Seed new records
    await College.insertMany(colleges);
    
    // Hash mock passwords since insertMany bypasses mongoose save middleware hooks
    const hashedMembers = await Promise.all(members.map(async (m) => {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(m.password || 'demo123', salt);
      return { ...m, password: hashedPassword };
    }));
    await Member.insertMany(hashedMembers);
    await PreVerifiedStudent.insertMany(preVerifiedStudents);
    await Event.insertMany(events);
    await Comment.insertMany(comments);
    await Job.insertMany(jobs);
    await Survey.insertMany(surveys);
    await SurveyResponse.insertMany(surveyResponses);
    await Blog.insertMany(blogs);
    await Notification.insertMany(notifications);
    await ConnectionRequest.insertMany(connectionRequests);

    console.log('Seeded database successfully!');
  } catch (err) {
    console.error('Failed to seed database:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  }
}

seed();
