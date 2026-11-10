// =====================================================
// PROJECTHUB - GLOBAL CONFIGURATION
// =====================================================

// Automatically switches between Localhost (development) and Cloud (production)
const isLocalhost = window.location.hostname === "localhost" || 
                    window.location.hostname === "127.0.0.1" || 
                    window.location.protocol === "file:";

// Set this to your live Render backend URL:
const PRODUCTION_BACKEND_URL = "https://projecthub-backend-j21s.onrender.com";

const BACKEND_URL = isLocalhost 
    ? "http://localhost:5000" 
    : PRODUCTION_BACKEND_URL;

window.PROJECTHUB_CONFIG = {
    BACKEND_URL: BACKEND_URL,
    API_AUTH: `${BACKEND_URL}/api/auth`,
    API_PROJECTS: `${BACKEND_URL}/api/projects`,
    API_MEMBERS: `${BACKEND_URL}/api/members`,
    API_HACKATHONS: `${BACKEND_URL}/api/hackathons`,
    API_MESSAGES: `${BACKEND_URL}/api/messages`
};


// =====================================================
// THEME MANAGER (DARK / LIGHT MODE)
// =====================================================
(function () {
    function getStoredTheme() {
        return localStorage.getItem("ph_theme") || "light";
    }

    function applyTheme(theme) {
        if (theme === "dark") {
            document.documentElement.setAttribute("data-theme", "dark");
        } else {
            document.documentElement.removeAttribute("data-theme");
        }
        localStorage.setItem("ph_theme", theme);
        updateIcons(theme);
    }

    function updateIcons(theme) {
        const icons = document.querySelectorAll("#themeToggleBtn i, .theme-toggle-btn i");
        icons.forEach(icon => {
            if (theme === "dark") {
                icon.className = "fa-solid fa-sun";
                icon.style.color = "#f59e0b";
            } else {
                icon.className = "fa-solid fa-moon";
                icon.style.color = "";
            }
        });
    }

    applyTheme(getStoredTheme());

    function bindToggleButtons() {
        updateIcons(getStoredTheme());
        const toggleButtons = document.querySelectorAll("#themeToggleBtn, .theme-toggle-btn");
        toggleButtons.forEach(btn => {
            if (!btn.dataset.themeBound) {
                btn.dataset.themeBound = "true";
                btn.addEventListener("click", (e) => {
                    e.preventDefault();
                    const current = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
                    applyTheme(current);
                });
            }
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", bindToggleButtons);
    } else {
        bindToggleButtons();
    }
})();
