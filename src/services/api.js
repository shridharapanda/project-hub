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
    let list = getStorage("ph_projects", initialProjects);
    if (!list.some(p => p.id === 'proj-vslv')) {
      const vslv = initialProjects.find(p => p.id === 'proj-vslv');
      if (vslv) list = [vslv, ...list];
    }
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
    let list = getStorage("ph_members", initialMembers);
    try {
      const usersDb = JSON.parse(localStorage.getItem('ph_users_db') || '{}');
      list = list.map(m => {
        const mEmail = (m.email || '').toLowerCase().trim();
        const mName = (m.name || '').toLowerCase().trim();
        const matchedUser = (mEmail && usersDb[mEmail]) || (mName && usersDb[mName]);
        if (matchedUser && (matchedUser.avatarImage || matchedUser.profilePicture)) {
          return {
            ...m,
            avatarImage: matchedUser.avatarImage || matchedUser.profilePicture,
            college: matchedUser.college || m.college,
            role: matchedUser.role || m.role,
            skills: matchedUser.skills || m.skills
          };
        }
        return m;
      });
    } catch (e) {}
    return list;
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
