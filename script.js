// MAP URL PATHS TO SECTION NAMES
const routes = {
  "/": "home",
  "/index.html": "home",
  "/work": "work",
  "/about": "about",
  "/contact": "contact",
  // Projects
  "/projects/hosqare": "hosqare",
  "/projects/nina-jojer": "nina-jojer",
  "/projects/ibloov": "ibloov",
};

window.addEventListener("load", () => {
  const navLinks = document.querySelectorAll(".nav-link");
  const allViews = document.querySelectorAll(".main-content, .view-section");
  const allSidebars = document.querySelectorAll(".sidebar-content");
  const backdrop = document.querySelector(".nav-backdrop");

  // --- 1. CORE NAVIGATOR ---
  function handleRoute() {
    // Get path, strip trailing slashes (e.g. /work/ -> /work)
    let path = window.location.pathname.replace(/\/$/, "") || "/";

    // Find the target ID based on the route map; default to 'home'
    const targetId = routes[path] || "home";

    // LOOK FOR THE MAIN CONTENT SECTION (e.g. view-home or view-hosqare)
    const targetSection = document.getElementById(`view-${targetId}`);

    if (targetSection) {
      // A. Hide ALL main sections first
      allViews.forEach((v) => {
        v.classList.remove("active-section");
        v.classList.remove("active-group");
        v.style.display = "none";
      });

      // B. Show ONLY the target main section
      targetSection.classList.add("active-section");
      targetSection.style.display = "flex";

      // C. Handle Sidebar Logic
      // 1. Determine the Nav Category (e.g. "work" for Hosqare)
      const category =
        targetSection.getAttribute("data-nav-category") || targetId;

      // 2. Hide all sidebars initially
      allSidebars.forEach((s) => {
        s.classList.remove("active-group");
        s.style.display = "none";
      });

      // 3. Decide which sidebar to show
      // Priority 1: Specific Sidebar (e.g. sidebar-hosqare)
      let sidebarToShow = document.getElementById(`sidebar-${targetId}`);

      // Priority 2: Category Sidebar (e.g. sidebar-work) if specific one missing
      if (!sidebarToShow) {
        sidebarToShow = document.getElementById(`sidebar-${category}`);
      }

      // 4. Show the chosen sidebar
      if (sidebarToShow) {
        sidebarToShow.classList.add("active-group");
        sidebarToShow.style.display = "flex";
      }

      // D. Update Nav Pill (Always based on Category)
      navLinks.forEach((l) => {
        l.classList.remove("active-nav");
        if (l.dataset.target === category) {
          l.classList.add("active-nav");
          moveBackdrop(l);
        }
      });
    } else {
      console.error(
        `❌ Route Error: Could not find section with id="view-${targetId}"`
      );
    }
  }

  // --- 2. PILL ANIMATION ---
  function moveBackdrop(activeLink) {
    if (!activeLink || !backdrop) return;

    const linkRect = activeLink.getBoundingClientRect();
    const navRect = activeLink.parentElement.getBoundingClientRect();
    const leftPosition = linkRect.left - navRect.left;

    backdrop.style.width = `${linkRect.width}px`;
    backdrop.style.transform = `translateX(${leftPosition}px)`;
    backdrop.style.opacity = "1";
  }

  // --- 3. CLICK HANDLING ---
  // Expose function to global window so HTML onclick="..." works
  window.navigateTo = (path) => {
    history.pushState({}, "", path);
    handleRoute();
  };

  // Browser Back/Forward Button
  window.addEventListener("popstate", handleRoute);

  // Nav Links (Top Menu)
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const target = link.dataset.target;
      const path = target === "home" ? "/" : `/${target}`;
      navigateTo(path);
    });
  });

  // --- 4. INITIAL LOAD ---
  // Run immediately to show correct page
  handleRoute();

  // Handle window resize (keeps pill aligned)
  window.addEventListener("resize", () => {
    const active = document.querySelector(".nav-link.active-nav");
    if (active) moveBackdrop(active);
  });
});
