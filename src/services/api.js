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
