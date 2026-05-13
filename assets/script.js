const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzHxICAjQj2nXQQCskYQ7fh0Ww-ReKO1E3qGFs_zrGB3cxOzwhrpSEyOqxBsDREDw-sqg/exec";

const leadForm = document.querySelector("#leadForm");
const submitButton = document.querySelector("#submitButton");
const formStatus = document.querySelector("#formStatus");
const mobileStickyCta = document.querySelector(".mobile-sticky-cta");

if (window.lucide) {
  window.lucide.createIcons();
}

const navToggle = document.getElementById("navToggle");
const navMenu = document.getElementById("primary-nav");
const siteHeader = document.querySelector(".site-header");

const setMenu = (open) => {
  if (!navToggle || !navMenu) {
    return;
  }
  navToggle.setAttribute("aria-expanded", String(open));
  navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  navMenu.classList.toggle("is-open", open);
  siteHeader?.classList.toggle("is-open", open);
  document.body.classList.toggle("menu-open", open);
};

navToggle?.addEventListener("click", (event) => {
  event.stopPropagation();
  const isOpen = navToggle.getAttribute("aria-expanded") === "true";
  setMenu(!isOpen);
});

navMenu?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => setMenu(false));
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    setMenu(false);
  }
});

document.addEventListener("click", (event) => {
  if (!siteHeader || !navMenu?.classList.contains("is-open")) {
    return;
  }
  if (!siteHeader.contains(event.target)) {
    setMenu(false);
  }
});

window.addEventListener("resize", () => {
  if (window.innerWidth >= 768) {
    setMenu(false);
  }
});

const updateStickyCta = () => {
  if (!mobileStickyCta) {
    return;
  }

  const formRect = leadForm?.getBoundingClientRect();
  const formIsVisible =
    formRect && formRect.top < window.innerHeight - 80 && formRect.bottom > 80;

  mobileStickyCta.classList.toggle("is-visible", window.scrollY > 520 && !formIsVisible);
};

updateStickyCta();
window.addEventListener("scroll", updateStickyCta, { passive: true });

document.addEventListener("click", (event) => {
  const link = event.target.closest('a[href^="#"]');

  if (!link) {
    return;
  }

  const targetId = link.getAttribute("href");

  if (!targetId || targetId === "#") {
    return;
  }

  const target = document.querySelector(targetId);

  if (!target) {
    return;
  }

  event.preventDefault();
  target.scrollIntoView({
    behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "auto"
      : "smooth",
    block: "start",
  });

  history.pushState(null, "", targetId);
});

const setStatus = (message, type = "") => {
  formStatus.textContent = message;
  formStatus.className = `form-status ${type}`.trim();
};

const hasLiveEndpoint = () =>
  GOOGLE_SCRIPT_URL &&
  GOOGLE_SCRIPT_URL.startsWith("https://") &&
  !GOOGLE_SCRIPT_URL.includes("PASTE_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE");

leadForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!leadForm.checkValidity()) {
    leadForm.reportValidity();
    return;
  }

  const formData = new FormData(leadForm);

  if (formData.get("company")) {
    setStatus("Thank you. We will contact you about the counselling call soon.", "success");
    leadForm.reset();
    return;
  }

  if (!hasLiveEndpoint()) {
    setStatus(
      "Google Sheet is not connected yet. Replace GOOGLE_SCRIPT_URL in assets/script.js with your Apps Script Web App URL.",
      "error"
    );
    return;
  }

  submitButton.disabled = true;
  submitButton.textContent = "Sending...";
  setStatus("Submitting your registration...");

  try {
    await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      body: formData,
    });

    setStatus("Thank you. Your registration has been sent to Pinary.", "success");
    leadForm.reset();
  } catch (error) {
    setStatus("Something went wrong. Please try again or contact us directly on WhatsApp.", "error");
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Submit Registration";
  }
});
