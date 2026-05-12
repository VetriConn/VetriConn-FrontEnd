/**
 * Demo data for Dashboard Inbox/Messages
 */

export const DEMO_CONVERSATIONS = [
  {
    id: "conv-1",
    employer: {
      company_name: "TechCorp Inc.",
      contact_name: "Jennifer Smith",
      email: "jennifer.smith@techcorp.com",
      phone: "(555) 987-6543",
    },
    job: { role: "Software Developer" },
    application_id: "app-1",
    applied_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    last_message: {
      content:
        "We'd love to schedule an interview with you. Are you available next Tuesday?",
      createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    },
  },
  {
    id: "conv-2",
    employer: {
      company_name: "DataViz Solutions",
      contact_name: "Robert Johnson",
      email: "r.johnson@dataviz.com",
      phone: "(555) 876-5432",
    },
    job: { role: "Data Analyst" },
    application_id: "app-2",
    applied_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    last_message: {
      content:
        "Thank you for your application. We're reviewing candidates and will get back to you soon.",
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    },
  },
  {
    id: "conv-3",
    employer: {
      company_name: "StartupXYZ",
      contact_name: "Maria Garcia",
      email: "maria@startupxyz.com",
      phone: "(555) 765-4321",
    },
    job: { role: "Frontend Developer" },
    application_id: "app-3",
    applied_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    last_message: {
      content: "Your portfolio looks impressive! Let's set up a call.",
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
  },
];

export const DEMO_MESSAGES: Record<
  string,
  Array<{
    _id: string;
    sender: "job_seeker" | "employer";
    content: string;
    createdAt: string;
    attachment_url?: string;
    attachment_name?: string;
  }>
> = {
  "app-1": [
    {
      _id: "msg-1-1",
      sender: "job_seeker",
      content:
        "Thank you for considering my application. I'm very excited about this opportunity!",
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      _id: "msg-1-2",
      sender: "employer",
      content:
        "Hi! We were impressed with your background. Your experience with React and TypeScript is exactly what we're looking for.",
      createdAt: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
    },
    {
      _id: "msg-1-3",
      sender: "job_seeker",
      content:
        "That's great to hear! I'd love to learn more about the role and the team.",
      createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    },
    {
      _id: "msg-1-4",
      sender: "employer",
      content:
        "We'd love to schedule an interview with you. Are you available next Tuesday?",
      createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    },
  ],
  "app-2": [
    {
      _id: "msg-2-1",
      sender: "job_seeker",
      content:
        "Hello! I'm very interested in the Data Analyst position. I have 4 years of experience with Python and SQL.",
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      _id: "msg-2-2",
      sender: "employer",
      content:
        "Thank you for your application. We're reviewing candidates and will get back to you soon.",
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    },
  ],
  "app-3": [
    {
      _id: "msg-3-1",
      sender: "job_seeker",
      content:
        "Hi! I'm reaching out about the Frontend Developer role. I've attached my portfolio for your review.",
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      attachment_url: "#",
      attachment_name: "Portfolio_2024.pdf",
    },
    {
      _id: "msg-3-2",
      sender: "employer",
      content: "Your portfolio looks impressive! Let's set up a call.",
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ],
};

export const EMPLOYER_DEMO_CONVERSATIONS = [
  {
    id: "conv-1",
    applicant: {
      full_name: "Sarah Johnson",
      email: "sarah.johnson@email.com",
      phone: "(555) 123-4567",
    },
    job: { role: "Software Developer" },
    application_id: "app-1",
    selected_skills: ["React", "TypeScript", "Node.js"],
    additional_info:
      "I'm very interested in this position and believe my 5 years of experience in full-stack development would be a great fit.",
    applied_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    last_message: {
      content:
        "Thank you for considering my application. I'm available for an interview anytime next week.",
      createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 mins ago
    },
  },
  {
    id: "conv-2",
    applicant: {
      full_name: "Michael Chen",
      email: "m.chen@email.com",
      phone: "(555) 234-5678",
    },
    job: { role: "Data Analyst" },
    application_id: "app-2",
    selected_skills: ["Python", "SQL", "Tableau", "Excel"],
    additional_info:
      "I have extensive experience in data analysis and visualization. Looking forward to discussing how I can contribute to your team.",
    applied_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    last_message: {
      content:
        "I've attached my portfolio with recent projects. Please let me know if you need any additional information.",
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
    },
  },
  {
    id: "conv-3",
    applicant: {
      full_name: "Emily Rodriguez",
      email: "emily.r@email.com",
      phone: "(555) 345-6789",
    },
    job: { role: "Software Developer" },
    application_id: "app-3",
    selected_skills: ["JavaScript", "Vue.js", "CSS", "Git"],
    additional_info:
      "Excited about the opportunity to work on innovative projects. I'm a quick learner and team player.",
    applied_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    last_message: {
      content:
        "Hi! Just following up on my application. Would love to chat about the role.",
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    },
  },
  {
    id: "conv-4",
    applicant: {
      full_name: "David Thompson",
      email: "d.thompson@email.com",
      phone: "(555) 456-7890",
    },
    job: { role: "Data Analyst" },
    application_id: "app-4",
    selected_skills: ["R", "Python", "Machine Learning", "Statistics"],
    additional_info:
      "PhD in Statistics with 3 years of industry experience. Passionate about turning data into actionable insights.",
    applied_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    last_message: {
      content: "Looking forward to hearing from you!",
      createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
    },
  },
];

export const EMPLOYER_DEMO_MESSAGES: Record<
  string,
  Array<{
    _id: string;
    sender: "employer" | "applicant";
    content: string;
    createdAt: string;
    attachment_url?: string;
    attachment_name?: string;
  }>
> = {
  "app-1": [
    {
      _id: "msg-1-1",
      sender: "applicant",
      content:
        "Hello! Thank you for posting this opportunity. I'm very interested in the Software Developer position.",
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      _id: "msg-1-2",
      sender: "employer",
      content:
        "Hi Sarah! Thanks for your interest. I've reviewed your application and I'm impressed with your experience. Would you be available for a quick call this week?",
      createdAt: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
    },
    {
      _id: "msg-1-3",
      sender: "applicant",
      content:
        "Absolutely! I'm available Monday through Friday after 2 PM. What time works best for you?",
      createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    },
    {
      _id: "msg-1-4",
      sender: "employer",
      content:
        "Perfect! How about Tuesday at 3 PM? I'll send you a calendar invite with the video call link.",
      createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    },
    {
      _id: "msg-1-5",
      sender: "applicant",
      content:
        "Thank you for considering my application. I'm available for an interview anytime next week.",
      createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    },
  ],
  "app-2": [
    {
      _id: "msg-2-1",
      sender: "applicant",
      content:
        "Good morning! I'm reaching out regarding the Data Analyst position. I have 4 years of experience in data visualization and statistical analysis.",
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      _id: "msg-2-2",
      sender: "employer",
      content:
        "Hi Michael! Your background looks great. Can you tell me more about your experience with Tableau?",
      createdAt: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
    },
    {
      _id: "msg-2-3",
      sender: "applicant",
      content:
        "I've been using Tableau for 3 years, creating interactive dashboards for executive reporting. I've also worked extensively with Python for data preprocessing and analysis.",
      createdAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
    },
    {
      _id: "msg-2-4",
      sender: "applicant",
      content:
        "I've attached my portfolio with recent projects. Please let me know if you need any additional information.",
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      attachment_url: "#",
      attachment_name: "Michael_Chen_Portfolio.pdf",
    },
  ],
  "app-3": [
    {
      _id: "msg-3-1",
      sender: "applicant",
      content:
        "Hi! I'm very excited about this opportunity. I've been working with Vue.js for the past 2 years and would love to contribute to your team.",
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      _id: "msg-3-2",
      sender: "applicant",
      content:
        "Hi! Just following up on my application. Would love to chat about the role.",
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ],
  "app-4": [
    {
      _id: "msg-4-1",
      sender: "applicant",
      content:
        "Hello! I'm interested in the Data Analyst position. My PhD research focused on predictive modeling and I've since applied these skills in industry settings.",
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      _id: "msg-4-2",
      sender: "applicant",
      content: "Looking forward to hearing from you!",
      createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ],
};
