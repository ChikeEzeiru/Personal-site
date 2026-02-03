// =======================================================
// 1. HASH ROUTER CONFIGURATION
// =======================================================
// Define which hash leads to which ID
const routes = {
  "": "home", // Default (No hash)
  home: "home",
  work: "work",
  about: "about",
  contact: "contact",
  // Projects (Note: No slashes needed here for keys)
  "projects/hosqare": "hosqare",
  "projects/nina-jojer": "nina-jojer",
  "projects/ibloov": "ibloov",
};

// =======================================================
// 2. MAIN SCRIPT
// =======================================================
window.addEventListener("load", () => {
  console.log("🚀 Hash Router Started");

  // Select Elements
  const navLinks = document.querySelectorAll(".nav-link");
  const allViews = document.querySelectorAll(".main-content, .view-section");
  const allSidebars = document.querySelectorAll(".sidebar-content");
  const backdrop = document.querySelector(".nav-backdrop");

  // --- CORE ROUTER FUNCTION ---
  function handleRoute() {
    // 1. Get the Hash (e.g., "#/work" -> "work")
    // This removes the '#' and any leading '/' so it matches our keys
    let hash = window.location.hash.slice(1);
    if (hash.startsWith("/")) hash = hash.slice(1);

    // 2. Default to home if hash is empty or not found
    const targetId = routes[hash] || "home";
    console.log("📍 Navigating to:", targetId);

    // 3. Find the Section in HTML
    const targetSection = document.getElementById(`view-${targetId}`);

    if (targetSection) {
      // A. Hide ALL Sections
      allViews.forEach((v) => {
        v.classList.remove("active-section", "active-group");
        v.style.display = ""; // Clear inline styles so CSS classes work
      });

      // B. Hide ALL Sidebars
      allSidebars.forEach((s) => {
        s.classList.remove("active-group");
      });

      // C. Show TARGET Section
      targetSection.classList.add("active-section");

      // D. Handle Sidebar
      // Get category (e.g., "work" for a project)
      const category =
        targetSection.getAttribute("data-nav-category") || targetId;

      // Find sidebar (Specific first, then Category fallback)
      let sidebarToShow = document.getElementById(`sidebar-${targetId}`);
      if (!sidebarToShow) {
        sidebarToShow = document.getElementById(`sidebar-${category}`);
      }

      // Show sidebar if found
      if (sidebarToShow) {
        sidebarToShow.classList.add("active-group");
      }

      // E. Update Nav Pill
      navLinks.forEach((l) => {
        l.classList.remove("active-nav");
        // Check if this link matches the current category
        if (l.dataset.target === category) {
          l.classList.add("active-nav");
          moveBackdrop(l);
        }
      });

      // F. Scroll to top
      window.scrollTo(0, 0);
    } else {
      console.warn("❌ Route not found, defaulting to Home");
      // Optional: Redirect to home if route is bad
      if (hash !== "") window.location.hash = "/";
    }
  }

  // --- NAVIGATION HELPERS ---

  // 1. Move the Pill
  function moveBackdrop(activeLink) {
    if (!activeLink || !backdrop) return;
    const linkRect = activeLink.getBoundingClientRect();
    const navRect = activeLink.parentElement.getBoundingClientRect();
    const leftPos = linkRect.left - navRect.left;

    backdrop.style.width = `${linkRect.width}px`;
    backdrop.style.transform = `translateX(${leftPos}px)`;
    backdrop.style.opacity = "1";
  }

  // 2. Global Navigate Function (Available to HTML buttons)
  window.navigateTo = (path) => {
    // Ensure path starts with / for clean URL (e.g., #/work)
    if (!path.startsWith("/")) path = "/" + path;
    window.location.hash = path;
  };

  // --- EVENT LISTENERS ---

  // Listen for hash changes (Back button, manual type, clicks)
  window.addEventListener("hashchange", handleRoute);

  // Resize Listener for Pill
  window.addEventListener("resize", () => {
    const active = document.querySelector(".nav-link.active-nav");
    if (active) moveBackdrop(active);
  });

  // Handle Nav Link Clicks
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const target = link.dataset.target;
      const path = target === "home" ? "/" : target;
      navigateTo(path);
    });
  });

  // --- INITIAL START ---
  handleRoute();
});

// 1. Define your two icons (We use the Data URIs so no files are needed)
const faviconDark =
  "data:image/svg+xml,%3Csvg width='516' height='516' viewBox='0 0 516 516' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M300.22 409.48L288.81 424.89L277.41 409.48L165.71 258.17L277.41 106.95L288.9 91.45L289.51 92.32L300.31 106.95L349.67 173.81H471.47L422.11 106.95L351.58 9H228.05L103.55 177.73H103.38L44 258.17L103.38 338.61L227.96 507.34V507.42H349.41L421.84 409.48L471.29 342.53H349.67L300.22 409.48Z' fill='%23190426'/%3E%3Cpath d='M279.48 260.01L349.67 173.81V342.53L279.48 260.01Z' fill='%23A83AEF'/%3E%3C/svg%3E";

const faviconLight =
  "data:image/svg+xml,%3Csvg width='516' height='516' viewBox='0 0 516 516' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M300.22 409.48L288.81 424.89L277.41 409.48L165.71 258.17L277.41 106.95L288.9 91.45L289.51 92.32L300.31 106.95L349.67 173.81H471.47L422.11 106.95L351.58 9H228.05L103.55 177.73H103.38L44 258.17L103.38 338.61L227.96 507.34V507.42H349.41L421.84 409.48L471.29 342.53H349.67L300.22 409.48Z' fill='%23FFFFFF'/%3E%3Cpath d='M279.48 260.01L349.67 173.81V342.53L279.48 260.01Z' fill='%23A83AEF'/%3E%3C/svg%3E";

// 2. Select the elements
const faviconTag = document.getElementById("dynamic-favicon");
const matcher = window.matchMedia("(prefers-color-scheme: dark)");

// 3. The Swap Function
function updateFavicon() {
  if (matcher.matches) {
    // System is Dark -> Use White Icon
    faviconTag.href = faviconLight;
  } else {
    // System is Light -> Use Dark Icon
    faviconTag.href = faviconDark;
  }
}

// 4. Run immediately and Listen for changes
updateFavicon();
matcher.addEventListener("change", updateFavicon);

document.addEventListener("DOMContentLoaded", function () {
  // 1. Select all videos with the class 'lazy-video'
  const lazyVideos = document.querySelectorAll("video.lazy-video");

  // 2. Check if the browser supports IntersectionObserver (It should!)
  if ("IntersectionObserver" in window) {
    const videoObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          // IF VIDEO IS IN VIEW
          if (entry.isIntersecting) {
            const video = entry.target;

            // Play the video (this triggers the download)
            // We use a promise to prevent errors if the user scrolls too fast
            const playPromise = video.play();
            if (playPromise !== undefined) {
              playPromise.catch((error) => {
                // Auto-play was prevented (browser settings)
                // Show controls so user can play manually
                // video.controls = true;
              });
            }
          }

          // IF VIDEO LEAVES VIEW
          else {
            // Pause it to save resources
            entry.target.pause();
          }
        });
      },
      {
        rootMargin: "0px 0px 200px 0px", // Starts loading 200px BEFORE it enters screen
      }
    );

    // 3. Start watching every video
    lazyVideos.forEach((video) => {
      videoObserver.observe(video);
    });
  }
});

/* ========================================= */
/* CONTACT SWITCHER LOGIC (ROBUST VERSION)   */
/* ========================================= */

window.switchContact = function (mode) {
  const btnEmail = document.getElementById("btn-email");
  const btnCalendar = document.getElementById("btn-calendar");
  const backdrop = document.querySelector(".toggle-backdrop");

  // Safety Check: If elements are missing, stop
  if (!btnEmail || !btnCalendar || !backdrop) return;

  // Decide active button
  const activeBtn = mode === "email" ? btnEmail : btnCalendar;

  // Update classes
  btnEmail.classList.remove("active");
  btnCalendar.classList.remove("active");
  activeBtn.classList.add("active");

  // --- THE FIX: Handle Hidden Elements ---
  // If the button has no width (section is hidden), the math fails.
  // We check if width > 0 before applying styles.
  if (activeBtn.offsetWidth > 0) {
    backdrop.style.width = activeBtn.offsetWidth + "px";
    backdrop.style.transform = `translateX(${activeBtn.offsetLeft}px)`;
    backdrop.style.opacity = "1"; // Ensure it's visible
  } else {
    // Optional: If hidden, hide the pill so it doesn't float weirdly
    backdrop.style.opacity = "0";
  }

  // Toggle Content Views
  const viewCalendar = document.getElementById("view-calendar");
  const viewEmail = document.getElementById("view-email");
  const activeView = document.getElementById("view-" + mode);

  if (viewCalendar) viewCalendar.classList.remove("active-view");
  if (viewEmail) viewEmail.classList.remove("active-view");
  if (activeView) activeView.classList.add("active-view");
};

// INITIALIZATION
// We use a slight delay or 'window.onload' to ensure fonts/layout are ready
window.addEventListener("load", () => {
  // Try to initialize
  switchContact("email");

  // EXTRA SAFETY:
  // If your site uses tabs, run this again whenever the 'Contact' tab is clicked
  // You can create a specialized observer if needed, but a timeout helps catch late renders.
  setTimeout(() => switchContact("email"), 300);
});

/* ========================================= */
/* COPY EMAIL LOGIC                          */
/* ========================================= */
window.copyEmail = function () {
  const emailText = document.getElementById("my-email").innerText;

  // NOTE: This API only works on HTTPS sites or Localhost!
  navigator.clipboard
    .writeText(emailText)
    .then(() => {
      const label = document.getElementById("copy-text");
      const originalText = "Copy";

      label.innerText = "Copied!";
      label.style.color = "#6927da";
      label.style.fontWeight = "600";

      setTimeout(() => {
        label.innerText = originalText;
        label.style.color = "";
        label.style.fontWeight = "";
      }, 2000);
    })
    .catch((err) => {
      console.error("Clipboard failed: ", err);
      // Fallback for non-secure contexts (optional)
      alert("Copied to clipboard: " + emailText);
    });
};
