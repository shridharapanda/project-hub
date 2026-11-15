import {
  initialProjects,
  initialMembers,
  initialHackathons,
  initialConversations,
  initialNotifications
} from './mockData';

const BACKEND_URL = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
  ? "http://localhost:5000"
  : "https://projecthub-backend-j21s.onrender.com";

// Helper for local storage persistence
function getStorage(key, fallback) {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : fallback;
  } catch (e) {
    return fallback;
  }
}

function setStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error("Storage error:", e);
  }
}

export const api = {
  // Authentication
  async login(email, password) {
    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      if (res.ok) {
        const data = await res.json();
        return data;
      }
    } catch (e) {
      console.warn("Backend login unavailable, fallback to local authentication");
    }

    // Local authentication fallback
    let cleanEmail = (email || '').trim().toLowerCase();
    if (cleanEmail && !cleanEmail.includes('@')) {
      cleanEmail = `${cleanEmail}@gmail.com`;
    }

    const registered = getStorage("ph_registered_users", []);
    const match = registered.find(u => u.email?.toLowerCase() === cleanEmail);

    if (match && match.password === password) {
      return {
        success: true,
        token: "ph_token_" + btoa(cleanEmail),
        user: { name: match.name, email: match.email }
      };
    }

    // Gmail ID or email with at least 4 characters password
    if (cleanEmail.includes("@") && password.length >= 4) {
      const username = cleanEmail.split("@")[0].replace(/[._\-+]/g, " ").trim();
      const capitalized = username
        .split(/\s+/)
        .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(" ");

      return {
        success: true,
        token: "ph_token_gmail_" + Date.now(),
        user: {
          name: capitalized || "Student Builder",
          email: cleanEmail,
          provider: cleanEmail.includes("gmail") ? "gmail" : "email"
        }
      };
    }

    throw new Error("Invalid Gmail / password (minimum 4 characters required).");
  },

  async register(name, email, password) {
    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn("Backend register unavailable, fallback to local registration");
    }

    const registered = getStorage("ph_registered_users", []);
    registered.push({ name, email, password });
    setStorage("ph_registered_users", registered);

    return {
      success: true,
      token: "ph_token_" + btoa(email),
      user: { name, email }
    };
  },

  // Projects
  async getProjects() {
    let list = getStorage("ph_projects", initialProjects);

    // Fetch live cloud projects from MongoDB on Render so friends see each other's work
    try {
      const res = await fetch(`${BACKEND_URL}/api/projects`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.projects) && data.projects.length > 0) {
          const cloudProjects = data.projects.map(cp => {
            const rawCat = (cp.category || "web").toLowerCase();
            const normalizedCategory = rawCat.includes("ai") || rawCat.includes("ml")
              ? "ai"
              : rawCat.includes("hardware") || rawCat.includes("iot")
              ? "hardware"
              : "web";

            return {
              id: cp._id,
              _id: cp._id,
              title: cp.title,
              description: cp.description,
              category: normalizedCategory,
              skills: Array.isArray(cp.skills) ? cp.skills : [],
              requiredMembers: cp.requiredMembers || 3,
              githubLink: cp.githubLink || "",
              demoLink: cp.demoLink || "",
              mediaUrl: cp.image || "",
              likes: Array.isArray(cp.likes) ? cp.likes.length : 0,
              likedBy: Array.isArray(cp.likes) ? cp.likes : [],
              liked: false,
              comments: [],
              badge: cp.category || "Cloud Project",
              author: {
                name: cp.creator?.name || "Student Builder",
                college: cp.creator?.college || "VSSUT, Burla",
                role: cp.creator?.branch || "Student Developer",
                avatarImage: cp.creator?.profilePicture || null,
                initials: (cp.creator?.name || "SB").slice(0, 2).toUpperCase()
              },
              tags: [cp.category || "Student", ...(Array.isArray(cp.skills) ? cp.skills : [])],
              createdAt: cp.createdAt
            };
          });

          // Cloud projects at the top, then local projects
          const merged = [...cloudProjects];
          list.forEach(lp => {
            const id = lp.id || lp._id;
            if (!merged.some(m => (m.id || m._id) === id)) {
              merged.push(lp);
            }
          });
          list = merged;
          setStorage("ph_projects", list);
        }
      }
    } catch (e) {
      console.warn("Backend getProjects unavailable, using local cache");
    }

    // Ensure all featured spotlight projects are present
    const keyProjectIds = [
      'proj-vslv',
      'proj-2',
      'proj-4',
      'proj-iitbbs-auv',
      'proj-nitr-fsae',
      'proj-nitr-drone',
      'proj-bits-hyperloop',
      'proj-bits-grid'
    ];
    let hasAdded = false;
    keyProjectIds.forEach(id => {
      if (!list.some(p => (p.id || p._id) === id)) {
        const item = initialProjects.find(p => (p.id || p._id) === id);
        if (item) {
          list.push(item);
          hasAdded = true;
        }
      }
    });
    if (hasAdded) {
      setStorage("ph_projects", list);
    }

    // Sanitize any legacy random names and comments from projects
    const nameReplacements = {
      'priya sahoo': { name: 'VSSUT IoT & Smart Systems Lab', role: 'IoT & Embedded Engineers' },
      'alex chen': { name: 'Campus Open Source Collective', role: 'Full-Stack Web Devs' },
      'debashis mohapatra': { name: 'IIT BBS Cybersecurity Lab', role: 'Network & Security Researchers' },
      'subham mohanty': { name: 'NIT Rourkela Drone & AI Lab', role: 'Automation & UAV Engineers' },
      'rohan kulkarni': { name: 'BITS CleanTech Research Group', role: 'Smart Grid & Energy Systems' }
    };

    const bannedCommenters = ['alex chen', 'rahul das', 'ananya sharma', 'neha verma', 'debashis mohapatra', 'priya sahoo'];

    list = list.map(p => {
      const lowerAuthor = (p.author?.name || '').toLowerCase().trim();
      let updatedAuthor = p.author;
      if (nameReplacements[lowerAuthor]) {
        updatedAuthor = {
          ...p.author,
          name: nameReplacements[lowerAuthor].name,
          role: nameReplacements[lowerAuthor].role
        };
      }
      const cleanComments = (p.comments || []).filter(c => !bannedCommenters.some(b => (c.author || '').toLowerCase().includes(b)));
      return {
        ...p,
        author: updatedAuthor,
        comments: cleanComments
      };
    });

    try {
      const usersDb = JSON.parse(localStorage.getItem('ph_users_db') || '{}');
      list = list.map(p => {
        if (!p.author) return p;
        const pAuthorEmail = (p.author.email || '').toLowerCase().trim();
        const pAuthorName = (p.author.name || '').toLowerCase().trim();
        const authorUser = (pAuthorEmail && usersDb[pAuthorEmail]) || (pAuthorName && usersDb[pAuthorName]);
        if (authorUser && (authorUser.avatarImage || authorUser.profilePicture)) {
          return {
            ...p,
            author: {
              ...p.author,
              avatarImage: authorUser.avatarImage || authorUser.profilePicture
            }
          };
        }
        return p;
      });
    } catch (e) {}
    return list;
  },

  syncUserProfileAcrossPlatform(user) {
    if (!user) return;
    try {
      const avatar = user.avatarImage || user.profilePicture || null;
      const userNameNorm = (user.name || '').toLowerCase().trim();
      const userEmailNorm = (user.email || '').toLowerCase().trim();

      // 1. Update author on all projects
      const projects = getStorage("ph_projects", initialProjects);
      const updatedProjects = projects.map(p => {
        const pAuthorName = (p.author?.name || '').toLowerCase().trim();
        const pAuthorEmail = (p.author?.email || '').toLowerCase().trim();
        if ((userEmailNorm && pAuthorEmail === userEmailNorm) || (userNameNorm && pAuthorName === userNameNorm)) {
          return {
            ...p,
            author: {
              ...p.author,
              name: user.name,
              avatarImage: avatar,
              college: user.college || p.author?.college,
              role: user.role || p.author?.role
            }
          };
        }
        return p;
      });
      setStorage("ph_projects", updatedProjects);

      // 2. Update member listing
      const members = getStorage("ph_members", initialMembers);
      const updatedMembers = members.map(m => {
        const mName = (m.name || '').toLowerCase().trim();
        const mEmail = (m.email || '').toLowerCase().trim();
        if ((userEmailNorm && mEmail === userEmailNorm) || (userNameNorm && mName === userNameNorm)) {
          return {
            ...m,
            name: user.name,
            avatarImage: avatar,
            college: user.college || m.college,
            role: user.role || m.role,
            skills: user.skills || m.skills
          };
        }
        return m;
      });
      setStorage("ph_members", updatedMembers);

      // Trigger instant cross-component refresh
      window.dispatchEvent(new Event('ph_profile_updated'));
    } catch (e) {
      console.warn("Failed to sync user across platform", e);
    }
  },

  saveProjects(projects) {
    setStorage("ph_projects", projects);
  },

  async createProject(projectData) {
    const current = getStorage("ph_projects", initialProjects);
    let cloudId = null;

    // Map category to backend enum: ["AI/ML", "Web Development", "Mobile Development", "Cybersecurity", "Data Science", "Open Source", "Social Impact", "Other"]
    let backendCategory = "Web Development";
    const cat = (projectData.category || "").toLowerCase();
    if (cat.includes("ai") || cat.includes("ml")) backendCategory = "AI/ML";
    else if (cat.includes("mobile") || cat.includes("app")) backendCategory = "Mobile Development";
    else if (cat.includes("cyber") || cat.includes("security")) backendCategory = "Cybersecurity";
    else if (cat.includes("data")) backendCategory = "Data Science";
    else if (cat.includes("social")) backendCategory = "Social Impact";
    else if (cat.includes("open")) backendCategory = "Open Source";
    else if (cat.includes("hardware") || cat.includes("iot")) backendCategory = "Other";
    else backendCategory = "Web Development";

    const token = localStorage.getItem("token");
    if (token && !token.startsWith("ph_token_demo_")) {
      try {
        const skillsArr = Array.isArray(projectData.skills)
          ? projectData.skills
          : (projectData.skills || "").split(",").map(s => s.trim()).filter(Boolean);

        const res = await fetch(`${BACKEND_URL}/api/projects`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
          },
          body: JSON.stringify({
            title: projectData.title,
            description: projectData.description,
            category: backendCategory,
            skills: skillsArr.length > 0 ? skillsArr : ["React", "JavaScript"],
            requiredMembers: parseInt(projectData.requiredMembers, 10) || 3,
            githubLink: projectData.githubLink || "",
            demoLink: projectData.demoLink || ""
          })
        });
        if (res.ok) {
          const d = await res.json();
          if (d.success && d.project?._id) {
            cloudId = d.project._id;
          }
        }
      } catch (err) {
        console.warn("Cloud project creation failed, using local fallback", err);
      }
    }

    const newProject = {
      id: cloudId || "proj-" + Date.now(),
      _id: cloudId,
      title: projectData.title,
      category: projectData.category || "web",
      description: projectData.description,
      skills: Array.isArray(projectData.skills)
        ? projectData.skills
        : (projectData.skills || "").split(",").map(s => s.trim()).filter(Boolean),
      requiredMembers: parseInt(projectData.requiredMembers, 10) || 2,
      githubLink: projectData.githubLink || "",
      demoLink: projectData.demoLink || "",
      mediaUrl: projectData.mediaUrl || "",
      likes: 0,
      liked: false,
      comments: [],
      badge: projectData.badge || "Student Project",
      author: projectData.author || {
        name: "Student Builder",
        role: "Student Innovator",
        college: "Engineering College",
        avatarColor: "purple",
        initials: "SB"
      },
      createdAt: new Date().toISOString()
    };

    const updated = [newProject, ...current];
    setStorage("ph_projects", updated);
    return { success: true, project: newProject };
  },

  likeProject(projectId, userEmail = 'default_user') {
    const current = getStorage("ph_projects", initialProjects);
    let action = 'liked';
    let targetProject = null;
    const normEmail = (userEmail || 'default_user').toLowerCase().trim();

    const updated = current.map(p => {
      const id = p.id || p._id;
      if (id === projectId) {
        targetProject = p;
        const likedBy = Array.isArray(p.likedBy)
          ? [...p.likedBy]
          : (p.liked ? ['default_user'] : []);
        const idx = likedBy.indexOf(normEmail);

        if (idx > -1) {
          // Unlike
          likedBy.splice(idx, 1);
          action = 'unliked';
          return {
            ...p,
            likedBy,
            likes: Math.max(0, (p.likes || 1) - 1),
            liked: false
          };
        } else {
          // Like
          likedBy.push(normEmail);
          action = 'liked';
          return {
            ...p,
            likedBy,
            likes: (p.likes || 0) + 1,
            liked: true
          };
        }
      }
      return p;
    });

    setStorage("ph_projects", updated);
    return { updatedProjects: updated, action, project: targetProject };
  },

  addComment(projectId, comment) {
    const current = getStorage("ph_projects", initialProjects);
    const updated = current.map(p => {
      const id = p.id || p._id;
      if (id === projectId) {
        const comments = p.comments || [];
        return {
          ...p,
          comments: [...comments, comment]
        };
      }
      return p;
    });
    setStorage("ph_projects", updated);
    return updated;
  },

  submitCollaboration(projectId, collabData) {
    const collabs = getStorage("ph_collab_requests", []);
    const newCollab = {
      id: "collab-" + Date.now(),
      projectId,
      ...collabData,
      createdAt: new Date().toISOString()
    };
    collabs.push(newCollab);
    setStorage("ph_collab_requests", collabs);

    // Also push a real notification into notifications storage
    const notifications = getStorage("ph_notifications", initialNotifications);
    notifications.unshift({
      id: "notif-" + Date.now(),
      icon: "fa-user-plus",
      title: "New Collaboration Request",
      description: `New application for "${collabData.role || 'Contributor'}" submitted.`,
      time: "Just now",
      read: false,
      action: "connect"
    });
    setStorage("ph_notifications", notifications);

    return newCollab;
  },

  // Members
  async getMembers() {
    try {
      const usersDb = JSON.parse(localStorage.getItem('ph_users_db') || '{}');
      const bannedNames = ['alex chen', 'ananya sharma', 'vikram sethi', 'priya sahoo', 'debashis mohapatra'];

      const realMembers = [];
      const seen = new Set();

      // Collect all real registered users
      Object.values(usersDb).forEach(u => {
        if (!u || !u.name) return;
        const key = (u.email || u.name).toLowerCase().trim();
        const lowerName = u.name.toLowerCase().trim();
        if (bannedNames.some(b => lowerName.includes(b))) return;
        if (seen.has(key)) return;
        seen.add(key);

        realMembers.push({
          id: u.id || 'mem-' + key.replace(/[^a-z0-9]/g, ''),
          name: u.name,
          email: u.email || '',
          role: u.role || 'Student Builder',
          college: u.college || 'Engineering College',
          skills: Array.isArray(u.skills) ? u.skills : (u.skills ? u.skills.split(',').map(s => s.trim()).filter(Boolean) : ['JavaScript', 'React']),
          avatar: u.avatar || u.name.slice(0, 2).toUpperCase(),
          avatarImage: u.avatarImage || u.profilePicture || null,
          bio: u.bio || '',
          mentor: Boolean(u.mentor),
          available: true
        });
      });

      // Clean storage of old fake members
      setStorage("ph_members", realMembers);
      return realMembers;
    } catch (e) {
      return [];
    }
  },

  saveMembers(members) {
    setStorage("ph_members", members);
  },

  // Hackathons
  async getHackathons() {
    try {
      const res = await fetch(`${BACKEND_URL}/api/hackathons`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) return data;
      }
    } catch (e) {
      // fallback
    }
    return getStorage("ph_hackathons", initialHackathons);
  },

  saveHackathons(hackathons) {
    setStorage("ph_hackathons", hackathons);
  },

  // Messages / Conversations
  getConversations() {
    let convs = getStorage("ph_conversations", initialConversations);
    const banned = ['alex chen', 'ananya sharma', 'priya sahoo'];
    convs = (convs || []).filter(c => !banned.some(b => c.user?.name?.toLowerCase().includes(b)));
    return convs;
  },

  saveConversations(conversations) {
    setStorage("ph_conversations", conversations);
  },

  // Notifications
  getNotifications() {
    let notifs = getStorage("ph_notifications", initialNotifications);
    const banned = ['ananya sharma', 'alex chen'];
    notifs = (notifs || []).filter(n => !banned.some(b => n.description?.toLowerCase().includes(b) || n.fromName?.toLowerCase().includes(b)));
    return notifs;
  },

  saveNotifications(notifications) {
    setStorage("ph_notifications", notifications);
  }
};
