// rune.js — rune.sifr.space
// Page-specific JavaScript for Project Rune website.

// Draws Navigation Bar Dividers
function drawNavDividers() {
  const logo = document.querySelector(".nav-logo-link");
  const svg = document.getElementById("nav-divider-svg");
  const navbar = document.getElementById("navbar");

  const navH = navbar.getBoundingClientRect().height;
  const logoBox = logo.getBoundingClientRect();
  const W = window.innerWidth;

  const logoLeft = logoBox.left;
  const logoCenterY = logoBox.top + logoBox.height / 2;

  // Size the SVG to exactly cover the viewport width and navbar height
  svg.setAttribute("viewBox", `0 0 ${W} ${navH}`);
  svg.style.width = W + "px";
  svg.style.height = navH + "px";

  // upturnWidth: width of the curved upturn section at each screen edge
  // 0.104 derived from Figma SVG proportions — upturn is ~10.4% of total width
  const upturnWidth = W * 0.104;
  const upturnStart = W - upturnWidth;

  // Left curve:
  // starts at middle-left of logo, runs straight horizontal to upturn point,
  // then curves up to top-left corner
  const leftPath =
    `M ${logoLeft} ${logoCenterY} ` +
    `L ${upturnWidth} ${logoCenterY} ` +
    `C ${upturnWidth} ${logoCenterY} 0 ${logoCenterY} 0 0`;

  // Right curve:
  // starts at middle-right of logo, runs straight horizontal to upturn point,
  // then curves up to top-right corner
  const rightPath =
    `M ${logoBox.right} ${logoCenterY} ` +
    `L ${upturnStart} ${logoCenterY} ` +
    `C ${upturnStart} ${logoCenterY} ${W} ${logoCenterY} ${W} 0`;

  document.getElementById("nav-divider-left").setAttribute("d", leftPath);
  document.getElementById("nav-divider-right").setAttribute("d", rightPath);

  // Filled area above left curve
  // Trace: top-left corner → along top edge to logo → down to line → back along curve → close
  const leftFill =
    `M 0 0 ` +
    `L ${logoLeft} 0 ` +
    `L ${logoLeft} ${logoCenterY} ` +
    `L ${upturnWidth} ${logoCenterY} ` +
    `C ${upturnWidth} ${logoCenterY} 0 ${logoCenterY} 0 0 ` +
    `Z`;

  // Filled area above right curve
  // Trace: top-right corner → along top edge to logo → down to line → back along curve → close
  const rightFill =
    `M ${W} 0 ` +
    `L ${logoBox.right} 0 ` +
    `L ${logoBox.right} ${logoCenterY} ` +
    `L ${upturnStart} ${logoCenterY} ` +
    `C ${upturnStart} ${logoCenterY} ${W} ${logoCenterY} ${W} 0 ` +
    `Z`;

  // Filled rectangle above the logo — covers the gap between left and right fills
  const centerFill =
    `M ${logoLeft - 1} 0 ` +
    `L ${logoBox.right + 1} 0 ` +
    `L ${logoBox.right + 1} ${logoCenterY} ` +
    `L ${logoLeft - 1} ${logoCenterY} ` +
    `Z`;

  document.getElementById("nav-fill-center").setAttribute("d", centerFill);
  document.getElementById("nav-fill-left").setAttribute("d", leftFill);
  document.getElementById("nav-fill-right").setAttribute("d", rightFill);
}

// Mobile drawer open/close
const drawerToggle = document.getElementById("drawer-toggle");
const navDrawer = document.getElementById("nav-drawer");
const drawerBackdrop = document.getElementById("drawer-backdrop");

function openDrawer() {
  navDrawer.classList.add("is-open");
  drawerBackdrop.classList.add("is-open");
  drawerToggle.classList.add("is-hidden");
  drawerToggle.setAttribute("aria-expanded", "true");
  navDrawer.setAttribute("aria-hidden", "false");
  document.documentElement.classList.add("drawer-locked");
}

function closeDrawer() {
  navDrawer.classList.remove("is-open");
  drawerBackdrop.classList.remove("is-open");
  drawerToggle.classList.remove("is-hidden");
  drawerToggle.setAttribute("aria-expanded", "false");
  navDrawer.setAttribute("aria-hidden", "true");
  document.documentElement.classList.remove("drawer-locked");
}

drawerToggle.addEventListener("click", openDrawer);
drawerBackdrop.addEventListener("click", closeDrawer);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeDrawer();
});
navDrawer
  .querySelectorAll(".drawer-link, .nav-drawer-icon-link")
  .forEach((link) => link.addEventListener("click", closeDrawer));

// Draws Footer Divider
function drawFooterDivider() {
  const container = document.querySelector(".footer-divider-container");
  const svg = document.getElementById("footer-divider-svg");

  const W = container.getBoundingClientRect().width;
  const H = 75; // sets the height of the divider line

  // Size the SVG to exactly cover the viewport width and navbar height
  svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
  svg.style.width = W + "px";
  svg.style.height = H + "px";

  // downturnWidth: width of the curved upturn section at each screen edge
  // 0.104 derived from Figma SVG proportions — downturn is ~10.4% of total width
  const downturnWidth = W * 0.104;

  const flatY = 0;
  const edgeY = H;

  const d =
    `M 0 ${edgeY} ` +
    `C 0 ${flatY} ${downturnWidth} ${flatY} ${downturnWidth} ${flatY} ` +
    `L ${W - downturnWidth} ${flatY} ` +
    `C ${W - downturnWidth} ${flatY} ${W} ${flatY} ${W} ${edgeY}`;

  document.getElementById("footer-divider-path").setAttribute("d", d);
}

// Per-section scroll cues — show the cue while the section's bottom
// is near the bottom of the viewport (works regardless of section height)
const sections = document.querySelectorAll("section[id]");

const cueObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      const cue = entry.target.querySelector(".scroll-cue");
      if (!cue) return;

      // isIntersecting here means: part of this section is within the
      // bottom detection band → the section's lower region is in view
      if (entry.isIntersecting) {
        cue.classList.remove("is-hidden");
      } else {
        cue.classList.add("is-hidden");
      }
    });
  },
  {
    // Shrink detection to the bottom ~15% of the viewport.
    // -85% top margin pushes the top boundary down to 85% of the height,
    // leaving only the bottom 15% as the active zone.
    rootMargin: "-85% 0px 0px 0px",
    threshold: 0,
  },
);

sections.forEach((section) => cueObserver.observe(section));

// Scroll-reveal — fade cards in the first time they enter the viewport
const revealEls = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      } else {
        entry.target.classList.remove("is-visible");
      }
    });
  },
  {
    threshold: 0.15,
  },
);

revealEls.forEach((el) => revealObserver.observe(el));

// Run once DOM is ready, then again on every resize
document.addEventListener("DOMContentLoaded", () => {
  drawNavDividers();
  drawFooterDivider();
});
window.addEventListener("resize", () => {
  drawNavDividers();
  drawFooterDivider();
});