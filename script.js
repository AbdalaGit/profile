/* =============================================================
   PORTFOLIO SCRIPT
   1. Navbar (scroll state + mobile menu + active link)
   2. Scroll reveal animations
   3. Animated counters
   4. Projects data + render + filter
   5. Contact form validation
   6. Back to top
   ============================================================= */

/* EDIT: Skills — grouped by category. `mark` is the short monogram badge (2 letters). */
const skillGroups = [
  {
    title: "Networking",
    skills: [
      { mark: "IP", name: "TCP/IP & Routing", desc: "Core protocols, static and dynamic routing across network segments.", pct: 80 },
      { mark: "VL", name: "VLANs & Subnetting", desc: "Segmenting traffic and planning address space for a clean topology.", pct: 78 },
      { mark: "PT", name: "Cisco Packet Tracer", desc: "Building and testing multi-router, multi-switch topologies before they're real.", pct: 82 },
      { mark: "NS", name: "Network Simulation", desc: "Designing topologies end to end, from diagram to working lab.", pct: 75 },
    ],
  },
  {
    title: "Systems & Tools",
    skills: [
      { mark: "WS", name: "Windows Server & AD", desc: "Active Directory Domain Services — users, groups and Organizational Units.", pct: 80 },
      { mark: "DD", name: "DNS & DHCP", desc: "Automated IP allocation and internal name resolution, configured and maintained.", pct: 78 },
      { mark: "VB", name: "Oracle VirtualBox", desc: "Standing up full server environments to practice safely before production.", pct: 76 },
      { mark: "WB", name: "Web Basics (HTML/CSS/JS)", desc: "CAPMAS-certified fundamentals — enough to build and ship this site.", pct: 65 },
    ],
  },
];

/* EDIT: Education / Experience — shown as a vertical timeline, most recent first or last as you prefer. */
const timelineItems = [
  {
    date: "2021 — 2025",
    role: "Bachelor's Degree, Information Systems",
    company: "Pharaohs Higher Institute · Grade: Good",
    desc: "Graduated with coursework spanning networking and systems fundamentals alongside general information-systems topics.",
    achievements: [
      "Built hands-on labs simulating enterprise network topologies.",
      "Completed a CAPMAS-certified web development track (HTML, CSS, JavaScript) as an elective.",
    ],
  },
  {
    date: "2024 — 2025",
    role: "CCNA & MCSA Concepts — Self-Study",
    company: "Independent Study",
    desc: "Worked through CCNA and MCSA curricula on my own, building lab environments to practice real configurations rather than just theory.",
    achievements: [
      "Simulated multi-router/switch topologies in Cisco Packet Tracer with VLANs and inter-VLAN routing.",
      "Deployed Windows Server environments in Oracle VirtualBox with AD, DNS and DHCP.",
    ],
  },
];

function renderSkills() {
  const container = document.getElementById("skillsGrid");
  if (!container) return;
  skillGroups.forEach((group, gi) => {
    const groupEl = document.createElement("div");
    groupEl.className = "skill-group reveal-up";
    if (gi > 0) groupEl.style.setProperty("--delay", `${gi * 0.1}s`);

    const rows = group.skills
      .map(
        (skill) => `
      <div class="skill-row">
        <span class="skill-mark">${skill.mark}</span>
        <div class="skill-info">
          <div class="skill-top"><span>${skill.name}</span><span class="skill-pct">${skill.pct}%</span></div>
          <p class="skill-desc">${skill.desc}</p>
          <div class="skill-bar"><span style="--level:${skill.pct}%"></span></div>
        </div>
      </div>`
      )
      .join("");

    groupEl.innerHTML = `<h3 class="skill-group-title">${group.title}</h3>${rows}`;
    container.appendChild(groupEl);
  });
}

function renderTimeline() {
  const container = document.getElementById("timelineContainer");
  if (!container) return;
  timelineItems.forEach((item, i) => {
    const el = document.createElement("div");
    el.className = "timeline-item reveal-up";
    if (i > 0) el.style.setProperty("--delay", `${i * 0.1}s`);

    const achievements = item.achievements.map((a) => `<li>${a}</li>`).join("");

    el.innerHTML = `
      <div class="timeline-dot"></div>
      <div class="timeline-content">
        <span class="timeline-date">${item.date}</span>
        <h3 class="timeline-role">${item.role}</h3>
        <p class="timeline-company">${item.company}</p>
        <p class="timeline-desc">${item.desc}</p>
        <ul class="timeline-list">${achievements}</ul>
      </div>`;
    container.appendChild(el);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initNavbar();
  initProjects();
  renderSkills();
  renderTimeline();
  initScrollReveal();
  initCounters();
  initSkillBars();
  initContactForm();
  initBackToTop();
  document.getElementById("year").textContent = new Date().getFullYear();
});

/* ---------- Scroll throttling helper ---------- */
function onScrollThrottled(handler) {
  let ticking = false;
  const wrapped = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      handler();
      ticking = false;
    });
  };
  window.addEventListener("scroll", wrapped, { passive: true });
  return wrapped;
}

/* ---------- 1. NAVBAR ---------- */
function initNavbar() {
  const header = document.getElementById("siteHeader");
  const toggle = document.getElementById("navToggle");
  const menu = document.getElementById("navMenu");
  const links = document.querySelectorAll(".nav-link");

  const onScroll = () => {
    header.classList.toggle("scrolled", window.scrollY > 30);
  };
  onScroll();
  onScrollThrottled(onScroll);

  toggle.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("open");
    toggle.classList.toggle("open", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  links.forEach((link) => {
    link.addEventListener("click", () => {
      menu.classList.remove("open");
      toggle.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });

  // Active link highlighting based on section in view
  const sections = [...links]
    .map((l) => document.querySelector(l.getAttribute("href")))
    .filter(Boolean);

  const setActive = () => {
    const scrollPos = window.scrollY + window.innerHeight * 0.35;
    let currentId = sections[0]?.id;
    sections.forEach((sec) => {
      if (sec.offsetTop <= scrollPos) currentId = sec.id;
    });
    links.forEach((l) => {
      l.classList.toggle("active-link", l.getAttribute("href") === `#${currentId}`);
    });
  };
  setActive();
  onScrollThrottled(setActive);
}

/* ---------- 2. SCROLL REVEAL ---------- */
function initScrollReveal() {
  const targets = document.querySelectorAll(".reveal-up");
  if (!("IntersectionObserver" in window)) {
    targets.forEach((t) => t.classList.add("in-view"));
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
  );
  targets.forEach((t) => observer.observe(t));
}

/* ---------- 3. ANIMATED COUNTERS ---------- */
function initCounters() {
  const stats = document.querySelectorAll(".stat");
  if (!stats.length) return;

  const animateStat = (el) => {
    const target = parseInt(el.dataset.target, 10) || 0;
    const suffix = el.dataset.suffix || "";
    const numEl = el.querySelector(".stat-num");
    const duration = 1400;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const value = Math.round(target * eased);
      numEl.textContent = value + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateStat(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );
  stats.forEach((s) => observer.observe(s));
}

/* ---------- 4. PROJECTS ---------- */

/* EDIT: Projects & Labs — add, remove or edit entries here. Each item needs:
   title, description, image, category (networking | systems | other),
   technologies (array), liveUrl, githubUrl (set to "" to hide a button) */
const projects = [
  {
    title: "Enterprise Network Simulation",
    description: "Designed and simulated a multi-router, multi-switch LAN topology in Cisco Packet Tracer, with VLANs and inter-VLAN routing to segment traffic and improve security.",
    image: "assets/images/project-1.jpg",
    category: "networking",
    technologies: ["Cisco Packet Tracer", "VLANs", "Routing & Switching"],
    liveUrl: "",
    githubUrl: "",
  },
  {
    title: "Windows Server Infrastructure Setup",
    description: "Deployed a Windows Server environment in Oracle VirtualBox and configured Active Directory, DNS and DHCP end to end for automated IP allocation and internal name resolution.",
    image: "assets/images/project-2.jpg",
    category: "systems",
    technologies: ["Windows Server", "Active Directory", "DNS / DHCP"],
    liveUrl: "",
    githubUrl: "",
  },
  {
    title: "This Portfolio Site",
    description: "Designed and built this personal portfolio from scratch as a bonus web project, applying HTML, CSS and JavaScript fundamentals from my CAPMAS certification.",
    image: "assets/images/project-3.jpg",
    category: "other",
    technologies: ["HTML", "CSS", "JavaScript"],
    liveUrl: "",
    githubUrl: "",
  },
];

function createProjectCard(project) {
  const card = document.createElement("article");
  card.className = "project-card";
  card.dataset.category = project.category;

  const techTags = project.technologies
    .map((t) => `<span class="tag">${t}</span>`)
    .join("");

  const liveBtn = project.liveUrl
    ? `<a href="${project.liveUrl}" target="_blank" rel="noopener" aria-label="View live project">
         <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><path d="M15 3h6v6"/><path d="M10 14 21 3"/></svg>
       </a>`
    : "";

  const githubBtn = project.githubUrl
    ? `<a href="${project.githubUrl}" target="_blank" rel="noopener" aria-label="View source on GitHub">
         <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.52-1.34-1.28-1.7-1.28-1.7-1.04-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.56-.29-5.25-1.28-5.25-5.71 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.47.11-3.06 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.64 1.59.24 2.77.12 3.06.74.81 1.19 1.84 1.19 3.1 0 4.44-2.7 5.42-5.27 5.7.41.36.78 1.07.78 2.16 0 1.56-.01 2.82-.01 3.2 0 .31.21.67.8.56A10.51 10.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z"/></svg>
       </a>`
    : "";

  card.innerHTML = `
    <div class="project-media">
      <img src="${project.image}" alt="${project.title} preview" loading="lazy" decoding="async"
           onerror="this.src='https://placehold.co/640x440/171a21/c9a24b?text=${encodeURIComponent(project.title)}'">
      <div class="project-overlay">${liveBtn}${githubBtn}</div>
    </div>
    <div class="project-body">
      <h3 class="project-title">${project.title}</h3>
      <p class="project-desc">${project.description}</p>
      <div class="project-tags">${techTags}</div>
    </div>
  `;
  return card;
}

function initProjects() {
  const grid = document.getElementById("projectGrid");
  if (!grid) return;

  projects.forEach((project) => grid.appendChild(createProjectCard(project)));

  const filterButtons = document.querySelectorAll(".filter-btn");
  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.dataset.filter;
      const cards = grid.querySelectorAll(".project-card");
      cards.forEach((card) => {
        const match = filter === "all" || card.dataset.category === filter;
        card.classList.toggle("hidden", !match);
      });
    });
  });
}

/* ---------- SKILL BARS ---------- */
function initSkillBars() {
  const bars = document.querySelectorAll(".skill-bar");
  if (!bars.length) return;
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );
  bars.forEach((b) => observer.observe(b));
}

/* ---------- 5. CONTACT FORM VALIDATION ---------- */
/* EDIT: EmailJS credentials — get your Public Key from EmailJS dashboard → Account → General,
   then paste it below. The form won't actually send email until this is filled in. */
const EMAILJS_PUBLIC_KEY = "f3y6AywB11gJymcWj";
const EMAILJS_SERVICE_ID = "service_hv9zkmv";
const EMAILJS_TEMPLATE_ID = "template_4r76awf";

function initContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;

  if (window.emailjs && EMAILJS_PUBLIC_KEY && EMAILJS_PUBLIC_KEY !== "YOUR_EMAILJS_PUBLIC_KEY") {
    emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
  }

  const status = document.getElementById("formStatus");
  const submitBtn = form.querySelector('button[type="submit"]');
  const submitBtnDefaultText = submitBtn ? submitBtn.textContent : "";

  const fields = {
    name: { input: document.getElementById("cName"), error: document.getElementById("cNameError") },
    email: { input: document.getElementById("cEmail"), error: document.getElementById("cEmailError") },
    subject: { input: document.getElementById("cSubject"), error: document.getElementById("cSubjectError") },
    message: { input: document.getElementById("cMessage"), error: document.getElementById("cMessageError") },
  };

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function setError(field, message) {
    field.input.closest(".form-field").classList.add("error");
    field.error.textContent = message;
  }
  function clearError(field) {
    field.input.closest(".form-field").classList.remove("error");
    field.error.textContent = "";
  }

  function validate() {
    let valid = true;

    if (!fields.name.input.value.trim()) {
      setError(fields.name, "Please enter your name.");
      valid = false;
    } else {
      clearError(fields.name);
    }

    if (!fields.email.input.value.trim()) {
      setError(fields.email, "Please enter your email.");
      valid = false;
    } else if (!emailPattern.test(fields.email.input.value.trim())) {
      setError(fields.email, "Please enter a valid email address.");
      valid = false;
    } else {
      clearError(fields.email);
    }

    if (!fields.subject.input.value.trim()) {
      setError(fields.subject, "Please add a subject.");
      valid = false;
    } else {
      clearError(fields.subject);
    }

    if (!fields.message.input.value.trim()) {
      setError(fields.message, "Please write a short message.");
      valid = false;
    } else if (fields.message.input.value.trim().length < 10) {
      setError(fields.message, "Message should be at least 10 characters.");
      valid = false;
    } else {
      clearError(fields.message);
    }

    return valid;
  }

  // Clear individual field errors as the user types
  Object.values(fields).forEach(({ input }) => {
    input.addEventListener("input", () => {
      const field = Object.values(fields).find((f) => f.input === input);
      if (field.input.value.trim()) clearError(field);
    });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    status.textContent = "";
    status.className = "form-status";

    if (!validate()) {
      status.textContent = "Please fix the fields highlighted above.";
      status.classList.add("error");
      return;
    }

    const templateParams = {
      name: fields.name.input.value.trim(),
      email: fields.email.input.value.trim(),
      phone: "",
      message: `Subject: ${fields.subject.input.value.trim()}\n\n${fields.message.input.value.trim()}`,
      time: new Date().toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" }),
    };

    if (!window.emailjs || EMAILJS_PUBLIC_KEY === "YOUR_EMAILJS_PUBLIC_KEY") {
      console.warn("EmailJS isn't configured yet — set EMAILJS_PUBLIC_KEY in js/script.js.");
      status.textContent = "Thanks — your message has been noted. I'll reply soon!";
      status.classList.add("success");
      form.reset();
      Object.values(fields).forEach(clearError);
      return;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending…";
    }

    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams).then(
      () => {
        status.textContent = "Thanks — your message has been sent. I'll reply soon!";
        status.classList.add("success");
        form.reset();
        Object.values(fields).forEach(clearError);
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = submitBtnDefaultText;
        }
      },
      (err) => {
        console.error("EmailJS error:", err);
        status.textContent = "Something went wrong sending your message. Please try again or email me directly.";
        status.classList.add("error");
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = submitBtnDefaultText;
        }
      }
    );
  });
}

/* ---------- 6. BACK TO TOP ---------- */
function initBackToTop() {
  const btn = document.getElementById("backToTop");
  if (!btn) return;

  const toggleVisibility = () => {
    btn.classList.toggle("show", window.scrollY > 480);
  };
  toggleVisibility();
  onScrollThrottled(toggleVisibility);

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}
