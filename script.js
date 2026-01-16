document.addEventListener("DOMContentLoaded", () => {
  const navLinks = document.querySelectorAll(".nav-link");
  const backdrop = document.querySelector(".nav-backdrop");

  // FUNCTION: Move the pill to a specific link
  function moveBackdrop(activeLink) {
    if (!activeLink || !backdrop) return;

    // Get position relative to the parent container
    const linkRect = activeLink.getBoundingClientRect();
    const navRect = activeLink.parentElement.getBoundingClientRect();

    const leftPosition = linkRect.left - navRect.left;
    const width = linkRect.width;

    // Apply styles
    backdrop.style.width = `${width}px`;
    backdrop.style.transform = `translateX(${leftPosition}px)`;
  }

  // LOGIC: Loop through links to find which one matches the current URL
  // We use 'window.location.href' to get the current browser address
  let activeFound = false;

  navLinks.forEach((link) => {
    // Remove manually added 'active' classes from HTML to avoid conflicts
    link.classList.remove("active");

    // Check if the link's href matches the current page
    if (link.href === window.location.href) {
      link.classList.add("active");
      activeFound = true;
    }

    // Add click event for instant feedback (before the page reloads)
    link.addEventListener("click", () => {
      moveBackdrop(link);
    });
  });

  // If no link matched (e.g., first load), default to the first one or specific one
  if (!activeFound && navLinks.length > 0) {
    // Optional: specific fallback logic, e.g., highlight Home if on root path
    navLinks[0].classList.add("active");
  }

  // INITIALIZE: Move the backdrop to the correct link immediately
  const currentActive = document.querySelector(".nav-link.active");
  moveBackdrop(currentActive);

  // RESPONSIVENESS: Recalculate if the window is resized
  window.addEventListener("resize", () => {
    const currentActive = document.querySelector(".nav-link.active");
    moveBackdrop(currentActive);
  });
});
