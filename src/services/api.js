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
    const registered = getStorage("ph_registered_users", []);
    const match = registered.find(u => u.email?.toLowerCase() === email.toLowerCase());

    if (match && match.password === password) {
      return {
        success: true,
        token: "ph_token_" + btoa(email),
        user: { name: match.name, email: match.email }
      };
    }

    // Default student demo credentials or any valid email
    if (email.includes("@") && password.length >= 4) {
      const name = email.split("@")[0].replace(".", " ");
      const capitalized = name.charAt(0).toUpperCase() + name.slice(1);
      return {
        success: true,
        token: "ph_token_demo_" + Date.now(),
        user: { name: capitalized, email }
      };
    }

    throw new Error("Invalid email or password (min 4 characters required).");
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
    try {
      const res = await fetch(`${BACKEND_URL}/api/projects`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) return data;
      }
    } catch (e) {
      // fallback
    }
    return getStorage("ph_projects", initialProjects);
  },

  saveProjects(projects) {
    setStorage("ph_projects", projects);
  },

  async createProject(projectData) {
    const current = getStorage("ph_projects", initialProjects);
    const newProject = {
      id: "proj-" + Date.now(),
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
        name: "Shridhara Panda",
        role: "Computer Science Engineering",
        college: "VSSUT, Burla",
        avatarColor: "purple",
        initials: "SP"
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
      const res = await fetch(`${BACKEND_URL}/api/members`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) return data;
      }
    } catch (e) {
      // fallback
    }
    return getStorage("ph_members", initialMembers);
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
    return getStorage("ph_conversations", initialConversations);
  },

  saveConversations(conversations) {
    setStorage("ph_conversations", conversations);
  },

  // Notifications
  getNotifications() {
    return getStorage("ph_notifications", initialNotifications);
  },

  saveNotifications(notifications) {
    setStorage("ph_notifications", notifications);
  }
};
