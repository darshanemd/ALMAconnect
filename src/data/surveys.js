export const surveys = [
  {
    id: "survey-1",
    title: "Alumni Engagement Feedback Survey",
    description: "Help us understand how we can improve our college networking events, mentorship alignment, and newsletter content.",
    targetAudience: "alumni",
    createdBy: "Sri Jayachamarajendra College of Engineering",
    createdDate: "2026-06-01T08:00:00.000Z",
    status: "active",
    anonymous: false,
    responses: 24,
    questions: [
      {
        id: "q-1",
        type: "rating",
        question: "How would you rate the current networking opportunities provided by our alumni network?",
        required: true
      },
      {
        id: "q-2",
        type: "mcq",
        question: "Which type of alumni events are you most interested in attending?",
        options: ["Reunions", "Tech Workshops", "Networking Meetups", "Mentorship Sessions", "Webinars"],
        required: true
      },
      {
        id: "q-3",
        type: "text",
        question: "What suggestions do you have for improving the mentor-mentee matching system?",
        required: false
      }
    ]
  },
  {
    id: "survey-2",
    title: "Curriculum Industry Alignment Review",
    description: "Provide feedback on whether our current computer science curriculum meets the latest requirements of top-tier technology companies.",
    targetAudience: "all",
    createdBy: "RV College of Engineering",
    createdDate: "2026-06-03T10:00:00.000Z",
    status: "active",
    anonymous: true,
    responses: 38,
    questions: [
      {
        id: "q-1",
        type: "mcq",
        question: "Do you think the current programming languages taught (C, Java) are sufficient for entering the industry?",
        options: ["Yes, basic concepts are solid", "No, Python/JavaScript should be prioritized", "Both should coexist"],
        required: true
      },
      {
        id: "q-2",
        type: "rating",
        question: "How well did your college courses prepare you for your first full-time role?",
        required: true
      },
      {
        id: "q-3",
        type: "text",
        question: "Which specific technologies or concepts should be added as electives to the curriculum?",
        required: true
      }
    ]
  }
];
export const mockSurveyResponses = [
  {
    surveyId: "survey-1",
    responses: [
      { qId: "q-1", value: 4 },
      { qId: "q-2", value: "Networking Meetups" },
      { qId: "q-3", value: "Maybe add filters based on current company and shared skills." }
    ],
    submittedBy: "alum-1",
    date: "2026-06-05T10:15:00.000Z"
  },
  {
    surveyId: "survey-1",
    responses: [
      { qId: "q-1", value: 5 },
      { qId: "q-2", value: "Tech Workshops" },
      { qId: "q-3", value: "Ensure direct messaging is enabled as soon as request is accepted." }
    ],
    submittedBy: "alum-2",
    date: "2026-06-06T11:45:00.000Z"
  }
];
export const mockNotifications = [
  {
    id: "notif-1",
    title: "New Job Posted",
    message: "Priya Sharma posted a new job: Software Engineer at Google.",
    date: "2026-06-01T08:05:00.000Z",
    read: false,
    role: "alumni"
  },
  {
    id: "notif-2",
    title: "Connection Request Received",
    message: "Rohan Verma wants to connect with you.",
    date: "2026-06-01T10:10:00.000Z",
    read: false,
    role: "alumni",
    userId: "alum-1"
  },
  {
    id: "notif-3",
    title: "Verification Request",
    message: "Karan Sinha applied for registration. Needs verification.",
    date: "2026-06-01T15:05:00.000Z",
    read: false,
    role: "college_admin",
    collegeId: "col-1"
  }
];
