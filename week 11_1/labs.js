const labCards = [...document.querySelectorAll("[data-lab]")];
const labPanel = document.getElementById("lab-panel");
const labHeading = document.getElementById("lab-heading");
const labContent = document.getElementById("lab-content");

const products = [
  { id: "headphones", name: "Pulse Headphones", description: "Comfortable wireless audio for study sessions.", price: 89, icon: "🎧", quantity: 1, cartQuantity: 0 },
  { id: "keyboard", name: "Compact Keyboard", description: "A compact layout for focused work.", price: 64, icon: "⌨️", quantity: 1, cartQuantity: 0 },
  { id: "watch", name: "Everyday Watch", description: "A lightweight companion for daily activity.", price: 119, icon: "⌚", quantity: 1, cartQuantity: 0 },
  { id: "speaker", name: "Mini Speaker", description: "Portable sound in a travel-ready size.", price: 45, icon: "🔊", quantity: 1, cartQuantity: 0 }
];

const courses = [
  { name: "Web Programming", category: "Web programming", seats: 12 },
  { name: "Special Topics", category: "Special topics", seats: 8 },
  { name: "20-Minute Literary Journey", category: "Literary journey", seats: 5 },
  { name: "Discrete Math", category: "Discrete math", seats: 14 },
  { name: "Football", category: "Football", seats: 20 }
];

const students = [
  { name: "Student 01", track: "Web Programming" },
  { name: "Student 02", track: "Computer Science" },
  { name: "Student 03", track: "Design" },
  { name: "Student 04", track: "Frontend Development" },
  { name: "Student 05", track: "Web Programming" }
];

const portfolioProjects = [
  { id: "portfolio", name: "Course Portfolio", category: "Portfolio", description: "Browse the weekly web programming assignments.", href: "../index.html", icon: "▦" },
  { id: "apis", name: "API Exercises", category: "API", description: "Explore the API learning projects from Week 6.", href: "../week%206_2/task%204.html", icon: "⌘" },
  { id: "validation", name: "Form Validation", category: "Forms", description: "See the interactive JavaScript validation exercise.", href: "../week%208_2/task%201.html", icon: "✓" },
  { id: "accessibility", name: "Lighthouse Audit", category: "Accessibility", description: "Review the accessibility audit assignment.", href: "../week%209_1/hw-lighthouse-audit.html", icon: "◉" },
  { id: "performance", name: "Website Performance", category: "Performance", description: "Open the Week 10 performance exercises.", href: "../week%2010/index.html", icon: "↗" },
  { id: "sudoku", name: "Sudoku", category: "Game", description: "Take a break with the portfolio Sudoku game.", href: "../sudoku.html", icon: "9" }
];

const state = {
  activeLab: "",
  courseCategory: "All",
  savedCourses: new Set(["Web Programming"]),
  practiceCount: 0,
  practiceColor: "#d7f36a",
  directoryQuery: "",
  selectedGallery: "portfolio",
  componentTab: "Props",
  selectedWorkCategory: "All",
  reactCounter: 0,
  quizAnswer: "",
  quizChecked: false,
  profile: {
    name: "Aung Sett Khine",
    role: "Web Programming Student",
    email: "aungsettkhine2001@gmail.com"
  }
};

const escapeHTML = (value) => String(value).replace(/[&<>"']/g, (character) => ({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
}[character]));

const formatCurrency = (value) => `$${value.toFixed(2)}`;

function setLabContent(title, html) {
  labHeading.textContent = title;
  labContent.innerHTML = html;
}

function openLab(name) {
  const renderers = {
    product: renderProductLab,
    catalog: renderCatalogLab,
    practice: renderPracticeLab,
    directory: renderDirectoryLab,
    gallery: renderGalleryLab,
    components: renderComponentLab,
    "selected-work": renderSelectedWorkLab,
    state: renderStateLab,
    "task-index": renderTaskIndexLab,
    "live-profile": renderLiveProfileLab
  };
  const render = renderers[name];
  if (!render) {
    throw new Error(`Unknown component lab: ${name}`);
  }

  state.activeLab = name;
  labCards.forEach((card) => {
    const selected = card.dataset.lab === name;
    card.classList.toggle("is-selected", selected);
    card.setAttribute("aria-expanded", String(selected));
  });
  labPanel.hidden = false;
  render();
  const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
  labPanel.scrollIntoView({ behavior, block: "start" });
}

function renderProductLab() {
  const cartCount = products.reduce((sum, product) => sum + product.cartQuantity, 0);
  const cartTotal = products.reduce((sum, product) => sum + product.cartQuantity * product.price, 0);
  const cards = products.map((product) => `
    <article class="lab-surface product-card">
      <span class="product-icon" aria-hidden="true">${product.icon}</span>
      <div>
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <span class="product-price">${formatCurrency(product.price)}</span>
        <div class="lab-actions" aria-label="${product.name} quantity">
          <button class="lab-button" type="button" data-product-action="decrease" data-product-id="${product.id}" aria-label="Decrease ${product.name} quantity">−</button>
          <span aria-live="polite">Quantity: ${product.quantity}</span>
          <button class="lab-button" type="button" data-product-action="increase" data-product-id="${product.id}" aria-label="Increase ${product.name} quantity">+</button>
          <button class="lab-button primary" type="button" data-product-action="add" data-product-id="${product.id}">Add to cart</button>
        </div>
      </div>
    </article>
  `).join("");

  setLabContent("ProductCard Demo", `
    <div class="lab-surface" style="margin-bottom:14px">
      <strong>Cart:</strong> <span id="cart-summary">${cartCount} ${cartCount === 1 ? "item" : "items"} · ${formatCurrency(cartTotal)}</span>
    </div>
    <div class="lab-grid">${cards}</div>
  `);
}

function renderCatalogLab() {
  const categories = ["All", ...new Set(courses.map((course) => course.category))];
  const visibleCourses = state.courseCategory === "All"
    ? courses
    : courses.filter((course) => course.category === state.courseCategory);

  setLabContent("Course Catalog", `
    <div class="lab-surface">
      <div class="lab-filters" role="group" aria-label="Filter courses">
        ${categories.map((category) => `
          <button class="lab-button ${state.courseCategory === category ? "active" : ""}" type="button" data-course-filter="${escapeHTML(category)}" aria-pressed="${state.courseCategory === category}">
            ${escapeHTML(category)}
          </button>
        `).join("")}
      </div>
      <div aria-live="polite">${visibleCourses.length} courses shown</div>
      <ul class="lab-list">
        ${visibleCourses.map((course) => `
          <li class="lab-row">
            <div>
              <strong>${escapeHTML(course.name)}</strong>
              <span class="lab-meta">${escapeHTML(course.category)} · ${course.seats} seats available</span>
            </div>
            <button class="lab-button ${state.savedCourses.has(course.name) ? "primary" : ""}" type="button" data-course-save="${escapeHTML(course.name)}" aria-pressed="${state.savedCourses.has(course.name)}">
              ${state.savedCourses.has(course.name) ? "Saved" : "Save course"}
            </button>
          </li>
        `).join("")}
      </ul>
    </div>
  `);
}

function renderPracticeLab() {
  const colors = ["#d7f36a", "#f0edff", "#f7c7a8", "#b8e4dc"];
  setLabContent("Interactive Practice", `
    <div class="lab-grid">
      <div class="lab-surface">
        <div class="counter-display" style="background:${state.practiceColor}" aria-live="polite">${state.practiceCount}</div>
        <div class="lab-actions">
          <button class="lab-button" type="button" data-practice-action="decrease">−1</button>
          <button class="lab-button" type="button" data-practice-action="increase">+1</button>
          <button class="lab-button primary" type="button" data-practice-action="random-color">Random color</button>
        </div>
      </div>
      <div class="lab-surface">
        <h3>Choose a color</h3>
        <p>Each control updates local state and immediately changes the preview.</p>
        <div class="lab-actions" role="group" aria-label="Counter colors">
          ${colors.map((color) => `
            <button class="lab-color-dot" style="background:${color}" type="button" data-practice-color="${color}" aria-label="Use ${color}" aria-pressed="${state.practiceColor === color}"></button>
          `).join("")}
        </div>
      </div>
    </div>
  `);
}

function directoryRows() {
  const query = state.directoryQuery.trim().toLowerCase();
  const visible = students.filter((student) => (
    student.name.toLowerCase().includes(query) || student.track.toLowerCase().includes(query)
  ));
  const results = visible.map((student) => `
    <li class="lab-row">
      <div><strong>${escapeHTML(student.name)}</strong><span class="lab-meta">${escapeHTML(student.track)}</span></div>
      <span class="lab-badge">Sample</span>
    </li>
  `).join("");

  return {
    count: visible.length,
    html: results || '<li class="lab-row">No matching students. Try another search.</li>'
  };
}

function renderDirectoryLab() {
  const rows = directoryRows();
  setLabContent("Student Directory", `
    <div class="lab-surface">
      <label class="lab-label" for="directory-search">Search sample students
        <input class="lab-input" id="directory-search" type="search" value="${escapeHTML(state.directoryQuery)}" placeholder="Search by name or study area">
      </label>
      <p id="directory-count" role="status">${rows.count} matches</p>
      <ul class="lab-list" id="directory-results">${rows.html}</ul>
    </div>
  `);
}

function renderGalleryLab() {
  const selected = portfolioProjects.find((project) => project.id === state.selectedGallery);
  setLabContent("Portfolio Gallery", `
    <div class="lab-surface">
      <div class="lab-grid">
        ${portfolioProjects.map((project) => `
          <button class="lab-choice" type="button" data-gallery-project="${project.id}" aria-pressed="${project.id === state.selectedGallery}">
            <span><strong>${escapeHTML(project.name)}</strong><span class="lab-meta">${escapeHTML(project.category)}</span></span>
            <span class="exercise-icon" aria-hidden="true">${project.icon}</span>
          </button>
        `).join("")}
      </div>
      <div class="lab-surface" style="margin-top:16px">
        <span class="lab-badge">${escapeHTML(selected.category)}</span>
        <h3 style="margin-top:12px">${escapeHTML(selected.name)}</h3>
        <p>${escapeHTML(selected.description)}</p>
        <a class="lab-link" href="${selected.href}">Open this portfolio project →</a>
      </div>
    </div>
  `);
}

const componentNotes = {
  Props: "Props are read-only inputs from a parent. Use them to configure a reusable component with different data.",
  "Conditional rendering": "Render the UI that fits the current data. A ternary is useful when choosing between two compact alternatives.",
  Children: "The special children prop lets a component wrap different content while keeping one shared layout."
};

function renderComponentLab() {
  const tabs = Object.keys(componentNotes);
  setLabContent("Component Lab", `
    <div class="lab-surface">
      <div class="lab-filters" role="group" aria-label="Component concepts">
        ${tabs.map((tab) => `
          <button class="lab-button ${state.componentTab === tab ? "active" : ""}" type="button" data-component-tab="${escapeHTML(tab)}" aria-pressed="${state.componentTab === tab}">
            ${escapeHTML(tab)}
          </button>
        `).join("")}
      </div>
      <p id="component-note" aria-live="polite">${componentNotes[state.componentTab]}</p>
    </div>
  `);
}

function renderSelectedWorkLab() {
  const categories = ["All", ...new Set(portfolioProjects.map((project) => project.category))];
  const visible = state.selectedWorkCategory === "All"
    ? portfolioProjects
    : portfolioProjects.filter((project) => project.category === state.selectedWorkCategory);

  setLabContent("React Selected Work", `
    <div class="lab-surface">
      <div class="lab-filters" role="group" aria-label="Filter selected projects">
        ${categories.map((category) => `
          <button class="lab-button ${state.selectedWorkCategory === category ? "active" : ""}" type="button" data-work-filter="${escapeHTML(category)}" aria-pressed="${state.selectedWorkCategory === category}">
            ${escapeHTML(category)}
          </button>
        `).join("")}
      </div>
      <ul class="lab-list">
        ${visible.map((project) => `
          <li class="lab-row">
            <div>
              <strong>${escapeHTML(project.name)}</strong>
              <span class="lab-meta">${escapeHTML(project.description)}</span>
            </div>
            <a class="lab-link" href="${project.href}">View →</a>
          </li>
        `).join("")}
      </ul>
    </div>
  `);
}

function renderStateLab() {
  let feedback = "Pick an answer, then check it.";
  if (state.quizChecked) {
    feedback = state.quizAnswer === "state"
      ? "Correct. State belongs to the component and can change over time."
      : "Not quite. Props are supplied by a parent; state is component-owned data that changes.";
  }
  const options = [
    { value: "props", label: "Props — values passed in by a parent" },
    { value: "state", label: "State — changing data owned by a component" },
    { value: "css", label: "CSS — visual styling rules" }
  ];

  setLabContent("React State Lab", `
    <div class="lab-grid">
      <div class="lab-surface">
        <h3>State in action</h3>
        <p>A click changes the counter value; in React, updating state causes the component to render again.</p>
        <div class="counter-display" style="background:var(--purple-soft)" aria-live="polite">${state.reactCounter}</div>
        <div class="lab-actions">
          <button class="lab-button" type="button" data-state-counter="decrease" aria-label="Decrease counter">−</button>
          <button class="lab-button" type="button" data-state-counter="reset">Reset</button>
          <button class="lab-button primary" type="button" data-state-counter="increase" aria-label="Increase counter">+</button>
        </div>
        <pre class="lab-code"><code>const [count, setCount] = useState(0);</code></pre>
      </div>
      <div class="lab-surface">
        <h3>Quick check</h3>
        <p>Which React feature should hold a counter that changes after a button click?</p>
        <div role="group" aria-label="Choose the correct React concept">
          ${options.map((option) => `
            <button class="lab-choice" type="button" data-quiz-answer="${option.value}" aria-pressed="${state.quizAnswer === option.value}">
              ${option.label}
            </button>
          `).join("")}
        </div>
        <div class="lab-actions">
          <button class="lab-button primary" type="button" data-quiz-check>Check answer</button>
        </div>
        <p role="status" aria-live="polite">${feedback}</p>
      </div>
    </div>
  `);
}

const taskIndex = [
  { name: "ProfileCard", description: "Props and default values.", href: "exercise 1.html" },
  { name: "Notification List", description: "Lists and conditional icons.", href: "exercise 2.html" },
  { name: "Card & Children", description: "Composition with children.", href: "exercise 3.html" },
  { name: "ProductCard Demo", description: "Products, quantities, and cart state.", lab: "product" },
  { name: "Course Catalog", description: "Category filtering and saved courses.", lab: "catalog" },
  { name: "Interactive Practice", description: "Counter and color state.", lab: "practice" },
  { name: "Student Directory", description: "Live search over sample records.", lab: "directory" },
  { name: "Portfolio Gallery", description: "Select and open portfolio projects.", lab: "gallery" },
  { name: "Component Lab", description: "Props, conditional rendering, and children.", lab: "components" },
  { name: "React Selected Work", description: "Filter work by category.", lab: "selected-work" },
  { name: "React State Lab", description: "State counter and knowledge check.", lab: "state" },
  { name: "Week 11 Task Index", description: "Review the complete exercise list.", lab: "task-index" },
  { name: "Student Profile Card (Live)", description: "Edit fields and preview the result.", lab: "live-profile" }
];

function renderTaskIndexLab() {
  setLabContent("Week 11 Task Index", `
    <div class="lab-surface">
      <ol class="task-index-list">
        ${taskIndex.map((task) => `
          <li>
            <strong>${escapeHTML(task.name)}</strong> — ${escapeHTML(task.description)}
            ${task.href
              ? `<a class="lab-link" href="${task.href}">Open exercise</a>`
              : `<button class="lab-link" type="button" data-open-lab="${task.lab}">Open lab</button>`}
          </li>
        `).join("")}
      </ol>
    </div>
  `);
}

function initials(name) {
  return name.trim().split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "AS";
}

function renderLiveProfileLab() {
  setLabContent("Student Profile Card (Live)", `
    <div class="lab-grid">
      <div class="lab-surface">
        <label class="lab-label" for="profile-name">Name
          <input class="lab-input" id="profile-name" type="text" data-profile-field="name" value="${escapeHTML(state.profile.name)}">
        </label>
        <label class="lab-label" for="profile-role" style="margin-top:12px">Role
          <input class="lab-input" id="profile-role" type="text" data-profile-field="role" value="${escapeHTML(state.profile.role)}">
        </label>
        <label class="lab-label" for="profile-email" style="margin-top:12px">Email
          <input class="lab-input" id="profile-email" type="email" data-profile-field="email" value="${escapeHTML(state.profile.email)}">
        </label>
      </div>
      <article class="lab-surface" aria-label="Live profile preview">
        <div class="profile-preview">
          <span class="profile-initials" id="profile-initials" aria-hidden="true">${escapeHTML(initials(state.profile.name))}</span>
          <div>
            <h3 id="profile-preview-name">${escapeHTML(state.profile.name)}</h3>
            <p id="profile-preview-role">${escapeHTML(state.profile.role)}</p>
            <a class="lab-link" id="profile-preview-email" href="mailto:${escapeHTML(state.profile.email)}">${escapeHTML(state.profile.email)}</a>
          </div>
        </div>
        <p role="status" aria-live="polite">The preview updates as you type.</p>
      </article>
    </div>
  `);
}

function closeLab() {
  labPanel.hidden = true;
  state.activeLab = "";
  labCards.forEach((card) => {
    card.classList.remove("is-selected");
    card.setAttribute("aria-expanded", "false");
  });
}

document.addEventListener("click", (event) => {
  const target = event.target.closest("button");
  if (!target) {
    return;
  }

  if (target.id === "close-lab") {
    closeLab();
    return;
  }

  if (target.dataset.lab) {
    openLab(target.dataset.lab);
    return;
  }

  if (target.dataset.openLab) {
    openLab(target.dataset.openLab);
    return;
  }

  if (target.dataset.productAction) {
    const product = products.find((item) => item.id === target.dataset.productId);
    if (!product) {
      throw new Error(`Unknown product: ${target.dataset.productId}`);
    }
    if (target.dataset.productAction === "increase") {
      product.quantity += 1;
    } else if (target.dataset.productAction === "decrease") {
      product.quantity = Math.max(1, product.quantity - 1);
    } else if (target.dataset.productAction === "add") {
      product.cartQuantity += product.quantity;
    } else {
      throw new Error(`Unknown product action: ${target.dataset.productAction}`);
    }
    renderProductLab();
    return;
  }

  if (target.dataset.courseFilter) {
    state.courseCategory = target.dataset.courseFilter;
    renderCatalogLab();
    return;
  }

  if (target.dataset.courseSave) {
    if (state.savedCourses.has(target.dataset.courseSave)) {
      state.savedCourses.delete(target.dataset.courseSave);
    } else {
      state.savedCourses.add(target.dataset.courseSave);
    }
    renderCatalogLab();
    return;
  }

  if (target.dataset.practiceAction) {
    if (target.dataset.practiceAction === "increase") {
      state.practiceCount += 1;
    } else if (target.dataset.practiceAction === "decrease") {
      state.practiceCount -= 1;
    } else if (target.dataset.practiceAction === "random-color") {
      state.practiceColor = `hsl(${Math.floor(Math.random() * 360)} 75% 72%)`;
    }
    renderPracticeLab();
    return;
  }

  if (target.dataset.practiceColor) {
    state.practiceColor = target.dataset.practiceColor;
    renderPracticeLab();
    return;
  }

  if (target.dataset.galleryProject) {
    state.selectedGallery = target.dataset.galleryProject;
    renderGalleryLab();
    return;
  }

  if (target.dataset.componentTab) {
    state.componentTab = target.dataset.componentTab;
    renderComponentLab();
    return;
  }

  if (target.dataset.workFilter) {
    state.selectedWorkCategory = target.dataset.workFilter;
    renderSelectedWorkLab();
    return;
  }

  if (target.dataset.stateCounter) {
    if (target.dataset.stateCounter === "increase") {
      state.reactCounter += 1;
    } else if (target.dataset.stateCounter === "decrease") {
      state.reactCounter -= 1;
    } else if (target.dataset.stateCounter === "reset") {
      state.reactCounter = 0;
    }
    renderStateLab();
    return;
  }

  if (target.dataset.quizAnswer) {
    state.quizAnswer = target.dataset.quizAnswer;
    state.quizChecked = false;
    renderStateLab();
    return;
  }

  if (target.hasAttribute("data-quiz-check")) {
    state.quizChecked = true;
    renderStateLab();
  }
});

document.addEventListener("input", (event) => {
  const input = event.target;
  if (input.id === "directory-search") {
    state.directoryQuery = input.value;
    const rows = directoryRows();
    document.getElementById("directory-count").textContent = `${rows.count} matches`;
    document.getElementById("directory-results").innerHTML = rows.html;
    return;
  }

  const field = input.dataset.profileField;
  if (!field) {
    return;
  }

  state.profile[field] = input.value;
  document.getElementById("profile-preview-name").textContent = state.profile.name;
  document.getElementById("profile-preview-role").textContent = state.profile.role;
  document.getElementById("profile-preview-email").textContent = state.profile.email;
  document.getElementById("profile-preview-email").href = `mailto:${state.profile.email}`;
  document.getElementById("profile-initials").textContent = initials(state.profile.name);
});

labCards.forEach((card) => {
  card.setAttribute("aria-expanded", "false");
});
