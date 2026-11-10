// Default data matching ProjectHub student platform
export const initialProjects = [
  {
    id: "proj-1",
    author: {
      name: "Shridhara Panda",
      role: "Full-Stack Developer",
      college: "VSSUT, Burla",
      avatarColor: "purple",
      initials: "SP"
    },
    category: "ai",
    badge: "AI / ML",
    title: "AI Attendance System using Facial Recognition",
    description: "An automated real-time classroom attendance tracking system using Python OpenCV and deep face embeddings. Deployed with an admin dashboard for professors.",
    tags: ["Python", "OpenCV", "Flask", "React", "MongoDB"],
    likes: 34,
    liked: false,
    comments: [
      { id: 1, author: "Rahul Das", text: "Impressive! Are you using ArcFace or FaceNet?", time: "2h ago" },
      { id: 2, author: "Ananya Sharma", text: "Would love to contribute to the frontend dashboard!", time: "1h ago" }
    ],
    status: "Active Recruitment",
    neededRoles: ["UI/UX Designer", "DevOps Engineer"]
  },
  {
    id: "proj-2",
    author: {
      name: "Priya Sahoo",
      role: "IoT Enthusiast",
      college: "NIT Rourkela",
      avatarColor: "cyan",
      initials: "PS"
    },
    category: "iot",
    badge: "IoT & Smart Systems",
    title: "Smart Hostel Energy Monitor & Surge Protector",
    description: "ESP32-powered wireless smart plugs with energy metering, anomaly detection, and automated cutoff via MQTT broker and mobile app notifications.",
    tags: ["ESP32", "C++", "MQTT", "Node.js", "TailwindCSS"],
    likes: 27,
    liked: false,
    comments: [
      { id: 1, author: "Shridhara Panda", text: "Great hardware integration. What current sensor did you use?", time: "5h ago" }
    ],
    status: "Prototype Ready",
    neededRoles: ["Embedded C Developer", "Mobile App Dev"]
  },
  {
    id: "proj-3",
    author: {
      name: "Alex Chen",
      role: "Backend Specialist",
      college: "VSSUT, Burla",
      avatarColor: "orange",
      initials: "AC"
    },
    category: "web",
    badge: "Web Platform",
    title: "Campus Peer-to-Peer Notes & Book Marketplace",
    description: "Decentralized campus trade platform allowing students to exchange academic notes, textbook rentals, and hardware lab equipment safely.",
    tags: ["Next.js", "Express", "PostgreSQL", "Prisma", "Docker"],
    likes: 42,
    liked: true,
    comments: [
      { id: 1, author: "Neha Verma", text: "Super useful for semester exams!", time: "1d ago" }
    ],
    status: "Beta Launch",
    neededRoles: ["Frontend Developer"]
  },
  {
    id: "proj-4",
    author: {
      name: "Debashis Mohapatra",
      role: "Cybersecurity Analyst",
      college: "IIT Bhubaneswar",
      avatarColor: "purple",
      initials: "DM"
    },
    category: "security",
    badge: "Cybersecurity",
    title: "Zero-Trust LAN Packet Inspector for College WiFi",
    description: "Lightweight traffic analysis and packet anomaly detection daemon designed for restricted university networks to block ARP poisoning and DNS spoofing.",
    tags: ["Go", "Wireshark", "Linux", "eBPF", "Grafana"],
    likes: 19,
    liked: false,
    comments: [],
    status: "Research Phase",
    neededRoles: ["Linux Kernel Dev", "Security Researcher"]
  }
];

export const initialMembers = [
  {
    id: "mem-1",
    name: "Shridhara Panda",
    role: "Full-Stack Developer",
    college: "VSSUT, Burla",
    skills: ["React", "Node.js", "MongoDB", "C++", "DSA"],
    projectsCount: 12,
    connectionsCount: 86,
    initials: "SP",
    avatarColor: "purple",
    connected: false
  },
  {
    id: "mem-2",
    name: "Alex Chen",
    role: "Backend & Systems",
    college: "VSSUT, Burla",
    skills: ["Python", "Go", "Docker", "PostgreSQL", "AWS"],
    projectsCount: 8,
    connectionsCount: 114,
    initials: "AC",
    avatarColor: "orange",
    connected: true
  },
  {
    id: "mem-3",
    name: "Ananya Sharma",
    role: "UI/UX & Product Designer",
    college: "KIIT, Bhubaneswar",
    skills: ["Figma", "Design Systems", "Tailwind", "CSS3"],
    projectsCount: 15,
    connectionsCount: 95,
    initials: "AS",
    avatarColor: "cyan",
    connected: false
  },
  {
    id: "mem-4",
    name: "Vikram Sethi",
    role: "AI / ML Researcher",
    college: "IIT Kharagpur",
    skills: ["PyTorch", "NLP", "FastAPI", "Transformers"],
    projectsCount: 6,
    connectionsCount: 78,
    initials: "VS",
    avatarColor: "purple",
    connected: false
  }
];

export const initialHackathons = [
  {
    id: "hack-1",
    day: "18",
    month: "NOV",
    title: "InnovateX National Hackathon 2026",
    organizer: "VSSUT Student Tech Council",
    mode: "Hybrid / 36 Hours",
    prize: "₹1,50,000",
    teamsCount: 84,
    status: "upcoming",
    badge: "National Flagship",
    description: "Annual multi-track hackathon spanning AI, Sustainable Tech, Web3, and HealthTech."
  },
  {
    id: "hack-2",
    day: "04",
    month: "DEC",
    title: "Smart Odisha Hackathon Challenge",
    organizer: "Govt of Odisha & IIT-BBS",
    mode: "Offline / On-Campus",
    prize: "₹3,00,000",
    teamsCount: 120,
    status: "upcoming",
    badge: "State Level",
    description: "Solve municipal and state-level challenges in public health, smart agriculture, and green transit."
  },
  {
    id: "hack-3",
    day: "28",
    month: "OCT",
    title: "Campus Web3 & Fintech Sprint",
    organizer: "DevHub Community",
    mode: "Virtual",
    prize: "$2,000 USD",
    teamsCount: 65,
    status: "completed",
    badge: "Global Virtual",
    description: "Speed sprint focused on decentralized lending and micro-payments for college campuses."
  }
];

export const initialConversations = [
  {
    id: "conv-1",
    user: {
      id: "u-1",
      name: "Alex Chen",
      role: "Backend Specialist",
      initials: "AC",
      avatarClass: "orange",
      online: true
    },
    lastMessage: "Hey! Let's connect our Flask API with the React frontend tonight.",
    time: "10:45 AM",
    unread: 2,
    messages: [
      { id: 1, sender: "them", text: "Hey Shridhara, checked out your facial recognition project!", time: "10:30 AM" },
      { id: 2, sender: "me", text: "Thanks Alex! We just finished the vector database embedding tests.", time: "10:38 AM" },
      { id: 3, sender: "them", text: "Hey! Let's connect our Flask API with the React frontend tonight.", time: "10:45 AM" }
    ]
  },
  {
    id: "conv-2",
    user: {
      id: "u-2",
      name: "Ananya Sharma",
      role: "UI/UX Designer",
      initials: "AS",
      avatarClass: "cyan",
      online: true
    },
    lastMessage: "Sent you the updated Figma prototype for the hackathon card!",
    time: "Yesterday",
    unread: 0,
    messages: [
      { id: 1, sender: "them", text: "Hi! How do you like the new card elevation colors?", time: "Yesterday" },
      { id: 2, sender: "them", text: "Sent you the updated Figma prototype for the hackathon card!", time: "Yesterday" }
    ]
  },
  {
    id: "conv-3",
    user: {
      id: "u-3",
      name: "Priya Sahoo",
      role: "IoT Engineer",
      initials: "PS",
      avatarClass: "purple",
      online: false
    },
    lastMessage: "The sensor arrived! I'll test the MQTT broker cutoff.",
    time: "Nov 5",
    unread: 0,
    messages: [
      { id: 1, sender: "them", text: "The sensor arrived! I'll test the MQTT broker cutoff.", time: "Nov 5" }
    ]
  }
];

export const initialNotifications = [
  {
    id: "notif-1",
    icon: "fa-user-plus",
    title: "Connection Request",
    description: "Ananya Sharma wants to connect with you.",
    time: "10m ago",
    read: false,
    action: "connect"
  },
  {
    id: "notif-2",
    icon: "fa-heart",
    title: "Project Liked",
    description: "Alex Chen and 3 others liked your Facial Recognition project.",
    time: "1h ago",
    read: false
  },
  {
    id: "notif-3",
    icon: "fa-calendar-check",
    title: "Hackathon Reminder",
    description: "Team registrations for InnovateX close in 3 days.",
    time: "4h ago",
    read: true
  }
];

export const sponsoredProjects = [
  {
    id: "sp-1",
    title: "Smart Campus Transit",
    description: "Build real-time GPS tracking and shuttle availability for university buses.",
    tag: "SPONSORED",
    grant: "₹50,000 Grant by Alumni Foundation"
  },
  {
    id: "sp-2",
    title: "AI Agro-Yield Prediction",
    description: "Satellite imagery and soil moisture analysis for regional farmer cooperatives.",
    tag: "SPONSORED",
    grant: "Sponsored by Agritech Labs"
  }
];
