export const blogs = [
  {
    id: "blog-1",
    title: "My Journey from GEC to Google: Priya's Story",
    excerpt: "Priya Sharma shares her career trajectory, preparation strategies, and advice for students looking to break into product-based companies.",
    content: `## My Journey from GEC to Google

Growing up in Karnataka, GEC was always the dream college. Studying computer science there laid the groundwork for my career. In this article, I want to share some tips that helped me navigate the transition from campus to Google.

### 1. Master the Fundamentals
Don't rush into learning frameworks like React or Node right away. Spend ample time with **Data Structures & Algorithms**. Understanding how memory works, how collections are organized, and complexity trade-offs is what differentiates high-level engineers.

### 2. Personal Projects Matter
Theory is good, but building *real* projects teaches you how things break. I remember building an automated scheduling system for our college cultural festival. That project taught me about asynchronous tasks, race conditions, and user flows more than any classroom lecture.

### 3. Seek Mentorship
Do not hesitate to connect with seniors. A short 15-minute conversation can save you months of directionless effort. That is one of the reasons I volunteered to be a mentor on this very platform.

Feel free to reach out to me! Wishing you all the very best.`,
    author: {
      name: "Priya Sharma",
      role: "Software Engineer III at Google",
      avatarInitials: "PS"
    },
    publishedDate: "2026-05-12T10:00:00.000Z",
    category: "success-story",
    tags: ["Google", "Placement Prep", "Career Growth"],
    likes: 84,
    likedBy: [],
    comments: 4,
    commentsList: [
      {
        id: "comm-1-1",
        userId: "member-3",
        userName: "Rahul Kumar",
        userRole: "student",
        avatarInitials: "RK",
        text: "This is super inspiring Priya! What specific roadmap or resources would you recommend for mastering Dynamic Programming?",
        createdAt: "2026-05-13T11:20:00.000Z"
      },
      {
        id: "comm-1-2",
        userId: "alum-2",
        userName: "Rohan Verma",
        userRole: "alumni",
        avatarInitials: "RV",
        text: "Couldn't agree more on building real-world projects. At Microsoft, seeing production-ready portfolio code always stands out during technical interviews.",
        createdAt: "2026-05-13T14:45:00.000Z"
      },
      {
        id: "comm-1-3",
        userId: "member-4",
        userName: "Sneha Patil",
        userRole: "student",
        avatarInitials: "SP",
        text: "Thank you for the mentorship offer! Just sent you a connection request on AlumniConnect.",
        createdAt: "2026-05-14T09:10:00.000Z"
      },
      {
        id: "comm-1-4",
        userId: "alum-3",
        userName: "Anjali Rao",
        userRole: "alumni",
        avatarInitials: "AR",
        text: "Mastering the fundamentals before rushing into frameworks is golden advice. Proud of how far you've come Priya!",
        createdAt: "2026-05-14T16:30:00.000Z"
      }
    ],
    image: null,
    featured: true
  },
  {
    id: "blog-2",
    title: "Understanding LLMs and the Future of AI Research",
    excerpt: "Deepa Patel writes about transfer learning, fine-tuning methodologies, and current trends in natural language processing.",
    content: `## The Era of Large Language Models

Machine Learning has advanced at a breakneck speed over the last few years. Large Language Models (LLMs) have transformed how we interact with software. But what does the research landscape look like for fresh graduates?

### The Shift from Scratch to Pre-training
Previously, building an AI model meant training from scratch. Today, we stand on the shoulders of giants. We take pre-trained weights and fine-tune them using techniques like **LoRA (Low-Rank Adaptation)** or **QLoRA** to achieve high performance on niche domains.

### Research vs Engineering
AI Engineering involves building applications around existing APIs. AI Research involves understanding *why* things work and building better model architectures. If you plan to go down the research path:
- Build a solid math foundation (Linear Algebra, Calculus, Probability).
- Start reading research papers on arXiv.
- Work on reproducing benchmark results from scratch.

Exciting times lie ahead!`,
    author: {
      name: "Deepa Patel",
      role: "Research Scientist at IBM Research",
      avatarInitials: "DP"
    },
    publishedDate: "2026-06-02T11:45:00.000Z",
    category: "tech",
    tags: ["AI", "Machine Learning", "Research"],
    likes: 42,
    likedBy: [],
    comments: 6,
    image: null,
    featured: false
  },
  {
    id: "blog-3",
    title: "A Complete Guide to Product Management for Engineers",
    excerpt: "Transitioning from coding to product strategy requires a mindset shift. Siddharth Mehta breaks down key tips.",
    content: `## Transitioning from Code to Product

As an engineer, your job is to build the solution right. As a Product Manager (PM), your job is to make sure you are building the *right solution*. Let's talk about how to make this transition.

### 1. Shift from 'How' to 'Why'
When presented with a problem, engineers immediately think of the stack, db schema, and api endpoints. As a PM, you must ask:
- Who is the user experiencing this problem?
- Why is it worth solving now?
- How does it align with our business goals?

### 2. Learn User Empathy
Sit in on support calls, watch user session recordings, and study feedback surveys. You cannot design features based on what *you* find convenient. You must design for the average customer.

### 3. Talk data, not opinion
If you want to propose a new feature, don't say "I think it will be cool." Say "According to our recent onboarding logs, 35% of users drop off at the credit card input step. If we add auto-fill or UPI, we can increase conversion by 5-10%."`,
    author: {
      name: "Siddharth Mehta",
      role: "Senior PM at Amazon",
      avatarInitials: "SM"
    },
    publishedDate: "2026-06-05T09:30:00.000Z",
    category: "career-tips",
    tags: ["Product Management", "Career Shift", "MBA"],
    likes: 56,
    likedBy: [],
    comments: 8,
    image: null,
    featured: false
  }
];
