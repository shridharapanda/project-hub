export const featuredColleges = [
  {
    id: 'vssut',
    name: 'VSSUT, Burla',
    fullName: 'Veer Surendra Sai University of Technology',
    location: 'Burla, Sambalpur, Odisha',
    estd: 'Estd. 1956 · UCE Burla',
    badge: 'Burla, Odisha',
    filterQuery: 'VSSUT',
    campusImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/VSSUT_Burla_Main_Building.jpg/800px-VSSUT_Burla_Main_Building.jpg',
    fallbackImage: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80',
    stats: {
      stat1: { value: '🚀 1st in India', label: 'Student Sounding Rocket' },
      stat2: { value: '🏆 SIH 1st Prize', label: 'Smart India Hackathon' },
      stat3: { value: '1956', label: 'Oldest Tech Univ in Odisha' },
      stat4: { value: '45+', label: 'Registered Patents' }
    },
    highlightTitle: '💡 45+ Student Patents & IIC Hub',
    highlightDesc: 'ISRO-recognized rocketry team & state-funded student incubation labs.',
    grantApplyLabel: '＋ Apply for VSSUT Grant',
    sponsoredProjects: [
      {
        id: 'proj-vslv',
        grant: '₹2,50,000 GRANT',
        sponsor: 'VSSUT · ISRO',
        title: 'VSLV-X Suborbital CanSat',
        description: 'Indigenous rocketry & telemetry developed by VSSUT students.',
        category: 'hardware',
        skills: ['Solid Propulsion', 'Avionics', 'CanSat', 'Telemetry', 'Embedded C++'],
        tags: ['VSSUT', 'Rocketry', 'Aerospace', 'ISRO'],
        author: {
          name: 'VSLV Space Team',
          college: 'VSSUT, Burla',
          course: 'Aerospace & Mechanical Engg'
        }
      },
      {
        id: 'proj-2',
        grant: '₹1,00,000 GRANT',
        sponsor: 'VSSUT IIC',
        title: 'Smart Campus IoT Grid',
        description: 'Hostel energy monitoring & surge protector system.',
        category: 'hardware',
        skills: ['IoT', 'ESP32', 'React', 'MQTT'],
        tags: ['VSSUT', 'IoT', 'Hardware'],
        author: {
          name: 'Priya Sahoo',
          college: 'VSSUT, Burla',
          course: 'Electrical Engg'
        }
      }
    ],
    modalData: {
      eyebrow: 'CAMPUS SPOTLIGHT · ESTD. 1956',
      heroSubtitle: 'Nestled at the foothills of Hirakud, inspiring 65+ years of engineering breakthroughs.',
      achievements: [
        {
          title: '🚀 VSLV (VSSUT Student Satellite Launch Vehicle)',
          badge: 'ISRO Recognized · Limca Record',
          badgeColor: 'primary',
          desc: "India's pioneer student rocketry mission. Designed and launched multiple indigenous solid-motor suborbital rockets carrying CanSat telemetry payloads."
        },
        {
          title: '🥇 Smart India Hackathon National Champions',
          badge: '1st Prize Winners',
          badgeColor: 'emerald',
          desc: 'Multiple student teams won top honors in AI-driven crop disease diagnostics, drone surveillance, and smart hostel energy management systems.'
        },
        {
          title: '💡 Idea & Innovation Cell (IIC VSSUT)',
          badge: 'University Incubator',
          badgeColor: 'amber',
          desc: 'Dedicated state-of-the-art incubation hub providing prototyping hardware, 3D printing labs, and alumni seed grants to turn student concepts into registered patents.'
        }
      ],
      clubs: [
        '🚀 VSLV Rocketry Club',
        '🤖 Robotics Society (Team Vibhav)',
        '💻 Enigma Coding & Web',
        '🏎️ SAE Collegiate Club (Formula Baja)',
        '🎨 Pixel UI/UX Design Club'
      ]
    }
  },
  {
    id: 'iitbbs',
    name: 'IIT Bhubaneswar',
    fullName: 'Indian Institute of Technology Bhubaneswar',
    location: 'Jatni, Bhubaneswar, Odisha',
    estd: 'Estd. 2008 · National Eminence',
    badge: 'IIT BBS, Odisha',
    filterQuery: 'IIT Bhubaneswar',
    campusImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/IIT_Bhubaneswar_Administrative_Building.jpg/800px-IIT_Bhubaneswar_Administrative_Building.jpg',
    fallbackImage: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80',
    stats: {
      stat1: { value: '🥽 VARCoE Hub', label: '₹10Cr+ MeitY AR/VR Center' },
      stat2: { value: '🌊 AUV Robosub', label: 'Global Marine Robotics' },
      stat3: { value: '2008', label: 'Premier 2nd Gen IIT' },
      stat4: { value: '80+', label: 'Research Lab Patents' }
    },
    highlightTitle: '🔬 VARCoE AR/VR & Ocean Robotics Hub',
    highlightDesc: 'MeitY funded Virtual Reality center & autonomous deep-sea submersible lab.',
    grantApplyLabel: '＋ Apply for IIT BBS Grant',
    sponsoredProjects: [
      {
        id: 'proj-iitbbs-auv',
        grant: '₹3,50,000 GRANT',
        sponsor: 'IIT BBS · MoES',
        title: 'DeepSea AUV Submersible',
        description: 'Autonomous underwater vehicle for deep ocean acoustic sensing & obstacle avoidance.',
        category: 'hardware',
        skills: ['Robotics', 'ROS2', 'ComputerVision', 'Python'],
        tags: ['Robotics', 'ROS2', 'IIT Bhubaneswar'],
        author: {
          name: 'Team AUV BBS',
          college: 'IIT Bhubaneswar',
          course: 'Ocean Engineering & CSE'
        }
      },
      {
        id: 'proj-4',
        grant: '₹1,50,000 GRANT',
        sponsor: 'IIT CyberSec Lab',
        title: 'Zero-Trust WiFi Inspector',
        description: 'Lightweight kernel eBPF traffic analyzer blocking spoofing on campus LAN.',
        category: 'hardware',
        skills: ['Go', 'Wireshark', 'Linux', 'eBPF'],
        tags: ['Cybersecurity', 'Linux', 'IIT Bhubaneswar'],
        author: {
          name: 'Debashis Mohapatra',
          college: 'IIT Bhubaneswar',
          course: 'Cybersecurity Analyst'
        }
      }
    ],
    modalData: {
      eyebrow: 'CAMPUS SPOTLIGHT · ESTD. 2008',
      heroSubtitle: 'State-of-the-art permanent campus at the foot of Barunei Hill, driving deep-tech breakthroughs.',
      achievements: [
        {
          title: '🥽 VARCoE (Virtual & Augmented Reality Center of Excellence)',
          badge: 'MeitY Sponsored · ₹10 Cr Center',
          badgeColor: 'primary',
          desc: 'Pioneering mixed-reality surgical simulation, digital heritage preservation, and spatial computing for defense and medical training.'
        },
        {
          title: '🌊 Autonomous Underwater Vehicle (Team AUV IITBBS)',
          badge: 'International Robosub Finalist',
          badgeColor: 'emerald',
          desc: 'Student robotics team designing autonomous submarines with acoustic localization, doppler velocity logs, and computer vision missions.'
        },
        {
          title: '⚡ National Supercomputing Mission (NSM Node)',
          badge: 'Petaflop Computing Hub',
          badgeColor: 'amber',
          desc: 'High-performance computing cluster enabling student researchers to train foundation AI models, molecular dynamics, and climate simulations.'
        }
      ],
      clubs: [
        '🌊 Team AUV Marine Robotics',
        '🤖 Neuromancers Coding Society',
        '🏎️ Team Alma Fiesta Motorsports',
        '🔭 Nakshatra Astronomy Club',
        '🥽 VARCoE Spatial Computing Lab'
      ]
    }
  },
  {
    id: 'nitr',
    name: 'NIT Rourkela',
    fullName: 'National Institute of Technology Rourkela',
    location: 'Rourkela, Sundargarh, Odisha',
    estd: 'Estd. 1961 · Formerly REC',
    badge: 'NIT RKL, Odisha',
    filterQuery: 'NIT Rourkela',
    campusImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/NIT_Rourkela_Clock_Tower.jpg/800px-NIT_Rourkela_Clock_Tower.jpg',
    fallbackImage: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80',
    stats: {
      stat1: { value: '🏎️ Formula EV', label: 'Team Black Mamba' },
      stat2: { value: '💡 TIIR Hub', label: '50+ Startups Incubated' },
      stat3: { value: '1961', label: 'Top-Ranked National Institute' },
      stat4: { value: '60+', label: 'Active Tech Chapters' }
    },
    highlightTitle: '🚀 TIIR Incubation Foundation & EV Lab',
    highlightDesc: 'Formula student electric racecar development & state-supported bio-incubator.',
    grantApplyLabel: '＋ Apply for NIT RKL Grant',
    sponsoredProjects: [
      {
        id: 'proj-nitr-fsae',
        grant: '₹4,00,000 GRANT',
        sponsor: 'NITR · AutoTech',
        title: 'Black Mamba Formula EV',
        description: 'Custom regenerative braking, 400V battery pack & real-time telemetry racecar.',
        category: 'hardware',
        skills: ['FormulaStudent', 'EV', 'BMS', 'CAD'],
        tags: ['EV', 'Hardware', 'NIT Rourkela'],
        author: {
          name: 'Team Black Mamba',
          college: 'NIT Rourkela',
          course: 'Mechanical & Electrical Engg'
        }
      },
      {
        id: 'proj-nitr-drone',
        grant: '₹1,80,000 GRANT',
        sponsor: 'TIIR Bio-Incubator',
        title: 'AI AgriDrone Swarm',
        description: 'Autonomous drone fleet with multispectral NDVI cameras for precision spraying.',
        category: 'ai',
        skills: ['Drones', 'AI', 'PyTorch', 'PX4'],
        tags: ['Drones', 'AI', 'NIT Rourkela'],
        author: {
          name: 'Subham Mohanty',
          college: 'NIT Rourkela',
          course: 'Automation Engg'
        }
      }
    ],
    modalData: {
      eyebrow: 'CAMPUS SPOTLIGHT · ESTD. 1961',
      heroSubtitle: 'Sprawling 647-acre campus renowned for innovation, Formula Student motorsport, and incubation.',
      achievements: [
        {
          title: '🏎️ Team Black Mamba (Formula Student Electric)',
          badge: 'National Podium Winners',
          badgeColor: 'primary',
          desc: 'Indigenous formula electric racecars engineered with carbon-fiber aerodynamics, high-voltage battery enclosures, and custom telemetry.'
        },
        {
          title: '🏢 TIIR Foundation (Technology Incubation & Industry Relations)',
          badge: 'DST & BIRAC Supported',
          badgeColor: 'emerald',
          desc: 'World-class startup incubator fostering 50+ deep-tech startups across smart manufacturing, clean energy, and biotechnology.'
        },
        {
          title: '🤖 Cyborg Robotics & Autonomous Drones',
          badge: 'TechFest Champions',
          badgeColor: 'amber',
          desc: 'Multi-award winning student robotics chapter specializing in search-and-rescue quadcopters, robotic arms, and bipedal walkers.'
        }
      ],
      clubs: [
        '🏎️ Team Black Mamba Motorsports',
        '🤖 Cyborg Robotics Chapter',
        '💻 Google Developer Groups (GDG NITR)',
        '✈️ Team Udaan Aeromodelling',
        '🌱 TIIR Startup Founders Club'
      ]
    }
  },
  {
    id: 'bits',
    name: 'BITS Pilani',
    fullName: 'Birla Institute of Technology and Science',
    location: 'Pilani, Vidya Vihar, Rajasthan',
    estd: 'Estd. 1964 · Institute of Eminence',
    badge: 'Pilani, Rajasthan',
    filterQuery: 'BITS Pilani',
    campusImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/BITS_Pilani_Clock_Tower.jpg/800px-BITS_Pilani_Clock_Tower.jpg',
    fallbackImage: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80',
    stats: {
      stat1: { value: '🦄 14+ Unicorns', label: 'Top Alma Mater for Founders' },
      stat2: { value: '🚆 Hyperloop', label: 'Global Pod Finalist' },
      stat3: { value: '1964', label: 'Institute of Eminence' },
      stat4: { value: '₹50Cr+', label: 'Alumni Angel Seed Pool' }
    },
    highlightTitle: '🦄 Hyperloop Pod & Sandbox Innovation',
    highlightDesc: 'Alma mater of Swiggy, Postman, BigBasket with global Hyperloop engineering pod team.',
    grantApplyLabel: '＋ Apply for BITS Grant',
    sponsoredProjects: [
      {
        id: 'proj-bits-hyperloop',
        grant: '₹5,00,000 GRANT',
        sponsor: 'BITS Alumni Angel',
        title: 'BITS Hyperloop MagLev Pod',
        description: 'Passive magnetic levitation skids & eddy-current deceleration vacuum pod.',
        category: 'hardware',
        skills: ['Hyperloop', 'MagLev', 'LinearInduction', 'Simulink'],
        tags: ['Hyperloop', 'Hardware', 'BITS Pilani'],
        author: {
          name: 'Team Hyperloop India',
          college: 'BITS Pilani',
          course: 'Multidisciplinary Engineering'
        }
      },
      {
        id: 'proj-bits-grid',
        grant: '₹2,20,000 GRANT',
        sponsor: 'BITS Sandbox CleanTech',
        title: 'Campus P2P Solar Micro-Grid',
        description: 'Smart contract-driven peer-to-peer solar energy trading platform for hostels.',
        category: 'web',
        skills: ['Blockchain', 'SmartGrids', 'Solidity', 'React'],
        tags: ['CleanTech', 'Web', 'BITS Pilani'],
        author: {
          name: 'Rohan Kulkarni',
          college: 'BITS Pilani',
          course: 'Computer Science & Electrical'
        }
      }
    ],
    modalData: {
      eyebrow: 'CAMPUS SPOTLIGHT · ESTD. 1964',
      heroSubtitle: 'Legendary clock-tower campus fostering premier tech entrepreneurship and advanced engineering.',
      achievements: [
        {
          title: '🚆 Team BITS Hyperloop (Global Vacuum Pod Competition)',
          badge: 'Global SpaceX Competitor',
          badgeColor: 'primary',
          desc: 'Designing next-generation sub-scale vacuum pods capable of 400+ km/h with contactless magnetic levitation and pneumatic brakes.'
        },
        {
          title: '🏆 Conquest National Startup Conclave',
          badge: 'India’s Premier Student Accelerator',
          badgeColor: 'emerald',
          desc: 'Flagship student-run acceleration program that has mentored hundreds of early-stage startups with tier-1 VC partner funds.'
        },
        {
          title: '💡 Sandbox Technology Incubator & Pilani FABLab',
          badge: '24/7 Innovation Lab',
          badgeColor: 'amber',
          desc: 'End-to-end prototyping lab featuring CNC multi-axis milling, laser cutting, and GPU clusters open round the clock for student builders.'
        }
      ],
      clubs: [
        '🚆 Team BITS Hyperloop',
        '🚀 Center for Entrepreneurial Leadership (CEL)',
        '💻 BITS Open Source Community',
        '🤖 AcYut Humanoid Robotics',
        '⚡ CleanTech Renewable Energy Club'
      ]
    }
  }
];
