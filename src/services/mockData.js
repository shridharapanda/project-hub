// Default data matching ProjectHub student platform
export const initialProjects = [
  {
    id: "proj-vslv",
    author: {
      name: "VSLV Space Team",
      role: "Aerospace & Embedded Engineers",
      college: "VSSUT, Burla",
      avatarColor: "purple",
      initials: "VS"
    },
    category: "iot",
    badge: "Aerospace · ISRO Backed",
    title: "VSLV-X Suborbital Rocketry & CanSat Telemetry",
    description: "Indigenous solid-propellant suborbital sounding rocket with atmospheric CanSat telemetry and GPS recovery payload. Developed at Idea & Innovation Cell, VSSUT Burla.",
    tags: ["Aerospace", "CanSat", "C++", "Telemetry", "Avionics", "VSSUT"],
    likes: 84,
    liked: false,
    comments: [],
    status: "ISRO Backed",
    neededRoles: ["Avionics Engineer", "Payload Telemetry Dev"]
  },
  {
    id: "proj-1",
    author: {
      name: "Campus AI & Vision Lab",
      role: "Computer Vision & AI Researchers",
      college: "VSSUT, Burla",
      avatarColor: "purple",
      initials: "AI"
    },
    category: "ai",
    badge: "AI / ML",
    title: "AI Attendance System using Facial Recognition",
    description: "An automated real-time classroom attendance tracking system using Python OpenCV and deep face embeddings. Deployed with an admin dashboard for professors.",
    tags: ["Python", "OpenCV", "Flask", "React", "MongoDB", "VSSUT"],
    likes: 34,
    liked: false,
    comments: [],
    status: "Active Recruitment",
    neededRoles: ["UI/UX Designer", "DevOps Engineer"]
  },
  {
    id: "proj-2",
    author: {
      name: "VSSUT IoT & Smart Systems Lab",
      role: "IoT & Embedded Engineers",
      college: "VSSUT, Burla",
      avatarColor: "cyan",
      initials: "SL"
    },
    category: "iot",
    badge: "IoT & Smart Systems",
    title: "Smart Hostel Energy Monitor & Surge Protector",
    description: "ESP32-powered wireless smart plugs with energy metering, anomaly detection, and automated cutoff via MQTT broker and mobile app notifications. Deployed at VSSUT campus hostels.",
    tags: ["ESP32", "C++", "MQTT", "Node.js", "TailwindCSS", "VSSUT"],
    likes: 27,
    liked: false,
    comments: [],
    status: "Prototype Ready",
    neededRoles: ["Embedded C Developer", "Mobile App Dev"]
  },
  {
    id: "proj-3",
    author: {
      name: "Campus Open Source Collective",
      role: "Full-Stack Web Devs",
      college: "VSSUT, Burla",
      avatarColor: "orange",
      initials: "OS"
    },
    category: "web",
    badge: "Web Platform",
    title: "Campus Peer-to-Peer Notes & Book Marketplace",
    description: "Decentralized campus trade platform allowing students to exchange academic notes, textbook rentals, and hardware lab equipment safely.",
    tags: ["Next.js", "Express", "PostgreSQL", "Prisma", "Docker"],
    likes: 42,
    liked: false,
    comments: [],
    status: "Beta Launch",
    neededRoles: ["Frontend Developer"]
  },
  {
    id: "proj-4",
    author: {
      name: "IIT BBS Cybersecurity Lab",
      role: "Network & Security Researchers",
      college: "IIT Bhubaneswar",
      avatarColor: "purple",
      initials: "CS"
    },
    category: "hardware",
    badge: "Cybersecurity",
    title: "Zero-Trust LAN Packet Inspector for College WiFi",
    description: "Lightweight traffic analysis and packet anomaly detection daemon designed for restricted university networks to block ARP poisoning and DNS spoofing.",
    tags: ["Go", "Wireshark", "Linux", "eBPF", "Grafana", "IIT Bhubaneswar"],
    likes: 19,
    liked: false,
    comments: [],
    status: "Research Phase",
    neededRoles: ["Linux Kernel Dev", "Security Researcher"]
  },
  {
    id: "proj-iitbbs-auv",
    author: {
      name: "Team AUV BBS",
      role: "Marine Robotics Engineers",
      college: "IIT Bhubaneswar",
      avatarColor: "blue",
      initials: "AU"
    },
    category: "hardware",
    badge: "Marine Robotics · MoES",
    title: "DeepSea AUV Autonomous Underwater Drone",
    description: "Self-navigating autonomous underwater vehicle (AUV) for deep ocean acoustic sensing, pipeline inspection, and underwater obstacle avoidance using ROS2.",
    tags: ["Robotics", "ROS2", "ComputerVision", "Python", "IIT Bhubaneswar"],
    likes: 62,
    liked: false,
    comments: [],
    status: "Testing Phase",
    neededRoles: ["Acoustic Sensor Dev", "Embedded C++ Eng"]
  },
  {
    id: "proj-nitr-fsae",
    author: {
      name: "Team Black Mamba",
      role: "Formula Student Engineers",
      college: "NIT Rourkela",
      avatarColor: "orange",
      initials: "BM"
    },
    category: "hardware",
    badge: "Formula Student · EV",
    title: "Team Black Mamba Electric Formula Racecar",
    description: "High-performance formula-style student racecar with custom regenerative braking, 400V lithium battery pack, and telemetry dashboard.",
    tags: ["FormulaStudent", "EV", "BMS", "CAD", "NIT Rourkela"],
    likes: 78,
    liked: false,
    comments: [],
    status: "Track Ready",
    neededRoles: ["BMS Software Dev", "Suspension Lead"]
  },
  {
    id: "proj-nitr-drone",
    author: {
      name: "NIT Rourkela Drone & AI Lab",
      role: "Automation & UAV Engineers",
      college: "NIT Rourkela",
      avatarColor: "green",
      initials: "DL"
    },
    category: "ai",
    badge: "AI & Agriculture",
    title: "AI AgriDrone Swarm for Precision Spraying",
    description: "Autonomous UAV drone swarm equipped with multispectral NDVI cameras for real-time crop disease diagnosis and targeted nano-fertilizer spraying.",
    tags: ["Drones", "AI", "PyTorch", "PX4", "NIT Rourkela"],
    likes: 45,
    liked: false,
    comments: [],
    status: "Prototype Ready",
    neededRoles: ["Drone Pilot", "Computer Vision Specialist"]
  },
  {
    id: "proj-bits-hyperloop",
    author: {
      name: "Team Hyperloop India",
      role: "Multidisciplinary Engineers",
      college: "BITS Pilani",
      avatarColor: "purple",
      initials: "HL"
    },
    category: "hardware",
    badge: "Hyperloop · Global Finalist",
    title: "BITS Hyperloop Magnetic Levitation Pod",
    description: "Sub-scale vacuum tube transportation pod featuring passive magnetic levitation skids, eddy-current deceleration brakes, and high-speed telemetry.",
    tags: ["Hyperloop", "MagLev", "LinearInduction", "Simulink", "BITS Pilani"],
    likes: 95,
    liked: false,
    comments: [],
    status: "Global Finalist",
    neededRoles: ["Magnetic Levitation Eng", "Telemetry Specialist"]
  },
  {
    id: "proj-bits-grid",
    author: {
      name: "BITS CleanTech Research Group",
      role: "Smart Grid & Energy Systems",
      college: "BITS Pilani",
      avatarColor: "cyan",
      initials: "CG"
    },
    category: "web",
    badge: "CleanTech · Smart Grid",
    title: "Decentralized Peer-to-Peer Campus Solar Micro-Grid",
    description: "Smart contract-driven peer-to-peer solar energy trading platform for university dormitories and hostel rooftop solar installations.",
    tags: ["Blockchain", "SmartGrids", "Solidity", "React", "BITS Pilani"],
    likes: 38,
    liked: false,
    comments: [],
    status: "Sandbox Live",
    neededRoles: ["Solidity Dev", "Frontend Engineer"]
  }
];

export const initialMembers = [];

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

export const initialConversations = [];

export const initialNotifications = [];

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
