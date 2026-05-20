// =====================================================
//  GROUP 2 – ACSAD AUTOMATA  |  src/app.js
// =====================================================

const GROUP_PATH = "./groups/group2/info.json";

// ── DOM refs ──────────────────────────────────────
const groupName      = document.getElementById("groupName");
const memberNames    = document.getElementById("memberNames");
const downloadBtn    = document.getElementById("downloadBtn");
const tabRow         = document.getElementById("tabRow");
const subTabRow      = document.getElementById("subTabRow");
const skeletonState  = document.getElementById("skeletonState");
const emptyState     = document.getElementById("emptyState");
const labPanel       = document.getElementById("labPanel");
const labTitle       = document.getElementById("labTitle");
const labDescription = document.getElementById("labDescription");
const screenshotImage= document.getElementById("screenshotImage");
const previewFallback= document.getElementById("previewFallback");
const codeBlock      = document.getElementById("codeBlock");
const sourceFile     = document.getElementById("sourceFile");
const inputFields    = document.getElementById("inputFields");
const runBtn         = document.getElementById("runBtn");
const clearBtn       = document.getElementById("clearBtn");
const outputBox      = document.getElementById("outputBox");
const attemptsDisplay= document.getElementById("attemptsDisplay");
const sidebar        = document.getElementById("sidebar");
const sidebarToggle  = document.getElementById("sidebarRailToggleBtn");
const sidebarOverlay = document.getElementById("sidebarOverlay");
const mobileSidebarBtn = document.getElementById("mobileSidebarBtn");
const groupList      = document.getElementById("groupList");
const mainContent    = document.querySelector(".main-content");
const scrollTopBtn   = document.getElementById("scrollTopBtn");
const themeToggleBtn = document.getElementById("themeToggleBtn");

// ── State ─────────────────────────────────────────
let groupData       = null;
let currentMain     = null;
let currentValidate = null;
const MAX_ATTEMPTS  = 5;
let attempts        = 0;
let locked          = false;

// ── Boot ──────────────────────────────────────────
(async function init() {
  setupSidebar();
  setupScrollTop();
  setupTheme();
  await loadGroup();
})();

// ── Theme (Light / Dark) ──────────────────────────
function setupTheme() {
  const saved = localStorage.getItem("theme") || "dark";
  applyTheme(saved);

  themeToggleBtn?.addEventListener("click", () => {
    const next = document.documentElement.getAttribute("data-theme") === "light" ? "dark" : "light";
    applyTheme(next);
    localStorage.setItem("theme", next);
  });
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  if (themeToggleBtn) {
    themeToggleBtn.setAttribute("aria-label", theme === "light" ? "Switch to dark mode" : "Switch to light mode");
    themeToggleBtn.innerHTML = theme === "light"
      ? `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`
      : `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`;
  }
}

// ── Scroll-to-top ──────────────────────────────────
function setupScrollTop() {
  if (!scrollTopBtn) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      scrollTopBtn.classList.add("visible");
    } else {
      scrollTopBtn.classList.remove("visible");
    }
  }, { passive: true });

  scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// ── Sidebar ───────────────────────────────────────
function setupSidebar() {
  sidebarToggle.addEventListener("click", () => {
    const collapsed = sidebar.classList.toggle("collapsed");
    sidebarToggle.setAttribute("aria-expanded", String(!collapsed));
    mainContent.classList.toggle("sidebar-collapsed", collapsed);
  });

  mobileSidebarBtn?.addEventListener("click", () => {
    sidebar.classList.add("mobile-open");
    sidebarOverlay.classList.add("mobile-open");
  });

  sidebarOverlay.addEventListener("click", () => {
    sidebar.classList.remove("mobile-open");
    sidebarOverlay.classList.remove("mobile-open");
  });

  renderSidebarNav();
}

function renderSidebarNav() {
  groupList.innerHTML = "";
  const btn = document.createElement("button");
  btn.className = "group-nav-btn active";
  btn.setAttribute("aria-current", "page");
  btn.innerHTML = `<span class="group-avatar">G2</span><span class="group-nav-label">Group 2</span>`;
  btn.addEventListener("click", () => {
    sidebar.classList.remove("mobile-open");
    sidebarOverlay.classList.remove("mobile-open");
  });
  groupList.appendChild(btn);
}

// ── Load Group ────────────────────────────────────
async function loadGroup() {
  showSkeleton();
  try {
    const res = await fetch(GROUP_PATH);
    if (!res.ok) throw new Error(`Failed to fetch info.json (${res.status})`);
    groupData = await res.json();
    renderHero();
    renderTabs();
    selectTab(0);
  } catch (err) {
    hideSkeleton();
    showEmpty(`Could not load group data: ${err.message}`);
  }
}

// ── Hero ──────────────────────────────────────────
function renderHero() {
  groupName.textContent = groupData.group || "Group 2";
  memberNames.textContent = Array.isArray(groupData.members) && groupData.members.length > 0
    ? groupData.members.join("  ·  ")
    : "Members not listed.";

  if (groupData.download) {
    downloadBtn.href = `./groups/group2/${groupData.download}`;
    downloadBtn.removeAttribute("aria-disabled");
  }
}

// ── Tabs ──────────────────────────────────────────
function renderTabs() {
  tabRow.innerHTML = "";
  groupData.labacts.forEach((act, i) => {
    const btn = document.createElement("button");
    btn.className = "tab-btn";
    btn.setAttribute("role", "tab");
    btn.setAttribute("aria-selected", "false");
    btn.textContent = act.name;
    btn.addEventListener("click", () => {
      selectTab(i);
      if (window.innerWidth <= 640) {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
    tabRow.appendChild(btn);
  });
}

function selectTab(index) {
  tabRow.querySelectorAll(".tab-btn").forEach((btn, i) => {
    btn.classList.toggle("active", i === index);
    btn.setAttribute("aria-selected", String(i === index));
  });

  const act = groupData.labacts[index];

  if (act.subtabs && act.subtabs.length > 0) {
    renderSubTabs(act.subtabs);
    subTabRow.hidden = false;
    selectSubTab(act.subtabs, 0);
  } else {
    subTabRow.hidden = true;
    subTabRow.innerHTML = "";
    loadLabAct(act);
  }
}

function renderSubTabs(subtabs) {
  subTabRow.innerHTML = "";
  subtabs.forEach((sub, i) => {
    const btn = document.createElement("button");
    btn.className = "sub-tab-btn";
    btn.setAttribute("role", "tab");
    btn.setAttribute("aria-selected", "false");
    btn.textContent = sub.name;
    btn.addEventListener("click", () => selectSubTab(subtabs, i));
    subTabRow.appendChild(btn);
  });
}

function selectSubTab(subtabs, index) {
  subTabRow.querySelectorAll(".sub-tab-btn").forEach((btn, i) => {
    btn.classList.toggle("active", i === index);
    btn.setAttribute("aria-selected", String(i === index));
  });
  loadLabAct(subtabs[index]);
}

// ── Load Lab Act ──────────────────────────────────
async function loadLabAct(act) {
  showSkeleton();
  currentMain     = null;
  currentValidate = null;
  resetAttempts();

  outputBox.textContent = "Program output will appear here.";
  outputBox.className   = "output-box";

  try {
    const codeRes = await fetch(`./groups/group2/${act.file}`);
    if (!codeRes.ok) throw new Error(`Source file not found: ${act.file}`);
    const codeText = await codeRes.text();

    currentMain     = extractMain(codeText);
    currentValidate = extractValidate(codeText);

    labTitle.textContent       = act.name;
    labDescription.textContent = act.description || "";
    sourceFile.textContent     = act.file;
    codeBlock.textContent      = codeText;
    codeBlock.className        = act.file.endsWith(".java") ? "language-java" : "language-javascript";

    if (act.screenshot) {
      screenshotImage.src    = `./groups/group2/${act.screenshot}`;
      screenshotImage.hidden = false;
      previewFallback.hidden = true;
      screenshotImage.onerror = () => {
        screenshotImage.hidden = true;
        previewFallback.hidden = false;
      };
    } else {
      screenshotImage.hidden = true;
      previewFallback.hidden = false;
    }

    renderInputFields(act.inputs || []);
    hljs.highlightElement(codeBlock);
    hideSkeleton();
    showPanel();

  } catch (err) {
    hideSkeleton();
    showEmpty(`Error loading lab act: ${err.message}`);
  }
}

// ── Input Fields ──────────────────────────────────
function renderInputFields(inputs) {
  inputFields.innerHTML = "";

  inputs.forEach((inp, i) => {
    const group = document.createElement("div");
    group.className = "input-group";

    const label = document.createElement("label");
    label.htmlFor = `input-${i}`;
    label.textContent = inp.label || `Input ${i + 1}`;

    const input = document.createElement("input");
    input.type         = "text";
    input.id           = `input-${i}`;
    input.placeholder  = inp.placeholder || "";
    input.autocomplete = "off";
    input.spellcheck   = false;

    input.addEventListener("input", () => {
      updateRunBtnState();
      input.classList.remove("input-error");
    });

    input.addEventListener("keydown", (e) => { if (e.key === "Enter") runBtn.click(); });

    group.appendChild(label);
    group.appendChild(input);
    inputFields.appendChild(group);
  });

  updateRunBtnState();
}

// disable Run if any input field is empty (and not locked)
function updateRunBtnState() {
  if (locked) return;
  const allFilled = Array.from(inputFields.querySelectorAll("input"))
    .every(inp => inp.value.trim() !== "");
  runBtn.disabled = !allFilled;
}

// ── Run Button ────────────────────────────────────
runBtn.addEventListener("click", () => {
  if (locked) {
    outputBox.textContent = "Maximum attempts reached. Please click \"Clear\" to reset and try again.";
    outputBox.className   = "output-box error";
    return;
  }

  if (!currentMain) {
    outputBox.textContent = "Error: No algorithm loaded.";
    outputBox.className   = "output-box error";
    return;
  }

  const inputEls = Array.from(inputFields.querySelectorAll("input"));
  const inputs   = inputEls.map(i => i.value);

  // Clear previous error outlines
  inputEls.forEach(inp => inp.classList.remove("input-error"));

  // ── Per-field validation ──
  if (currentValidate) {
    const fieldErrors = currentValidate(inputs);
    const hasErrors   = fieldErrors.some(e => e !== null);

    if (hasErrors) {
      attempts++;
      const remaining = MAX_ATTEMPTS - attempts;

      // Mark only the fields that actually failed
      fieldErrors.forEach((err, i) => {
        if (err !== null && inputEls[i]) inputEls[i].classList.add("input-error");
      });

      // Show all error messages in the output box
      const allErrors = fieldErrors
        .map((err, i) => err !== null ? `Field ${i + 1}: ${err}` : null)
        .filter(Boolean)
        .join("\n");
      outputBox.textContent = `Error:\n${allErrors}`;
      outputBox.className   = "output-box error";

      if (remaining <= 0) {
        locked = true;
        attemptsDisplay.textContent = "Maximum attempts (5/5) reached. Click \"Clear\" to reset.";
        attemptsDisplay.className   = "attempts-display locked";
        runBtn.disabled             = true;
      } else {
        attemptsDisplay.textContent = `Invalid input. Attempts: ${attempts}/${MAX_ATTEMPTS} — ${remaining} remaining.`;
        attemptsDisplay.className   = "attempts-display warning";
      }
      return;
    }
  }

  // ── Run main() ──
  try {
    const result = currentMain(inputs);
    outputBox.textContent = result ?? "(no output)";
    outputBox.className   = "output-box success";
    resetAttempts();
  } catch (err) {
    attempts++;
    const remaining = MAX_ATTEMPTS - attempts;

    // validate() should have caught field errors above; if main() still throws,
    // it's an unexpected runtime error — mark all fields as a fallback.
    inputEls.forEach(inp => inp.classList.add("input-error"));
    outputBox.textContent = `Error: ${err.message}`;
    outputBox.className   = "output-box error";

    if (remaining <= 0) {
      locked = true;
      attemptsDisplay.textContent = "Maximum attempts (5/5) reached. Click \"Clear\" to reset.";
      attemptsDisplay.className   = "attempts-display locked";
      runBtn.disabled             = true;
    } else {
      attemptsDisplay.textContent = `Invalid input. Attempts: ${attempts}/${MAX_ATTEMPTS} — ${remaining} remaining.`;
      attemptsDisplay.className   = "attempts-display warning";
    }
  }
});

// ── Clear Button ──────────────────────────────────
clearBtn.addEventListener("click", () => {
  inputFields.querySelectorAll("input").forEach(inp => {
    inp.value = "";
    inp.classList.remove("input-error");
  });
  outputBox.textContent = "Program output will appear here.";
  outputBox.className   = "output-box";
  resetAttempts();
  updateRunBtnState();
  const first = inputFields.querySelector("input");
  if (first) first.focus();
});

// ── Attempt Counter ───────────────────────────────
function resetAttempts() {
  attempts = 0;
  locked   = false;
  if (attemptsDisplay) {
    attemptsDisplay.textContent = "";
    attemptsDisplay.className   = "attempts-display";
  }
  updateRunBtnState();
}

// ── Extract main() ────────────────────────────────
function extractMain(source) {
  try {
    const wrapped = `${source}\nreturn main;`;
    // eslint-disable-next-line no-new-func
    const fn = new Function(wrapped)();
    if (typeof fn !== "function") throw new Error("main() not found in source.");
    return fn;
  } catch (err) {
    throw new Error(`Could not load algorithm: ${err.message}`);
  }
}

// ── Extract validate() ────────────────────────────
function extractValidate(source) {
  try {
    const wrapped = `${source}\nreturn typeof validate === "function" ? validate : null;`;
    // eslint-disable-next-line no-new-func
    return new Function(wrapped)();
  } catch {
    return null;
  }
}

// ── UI State Helpers ──────────────────────────────
function showSkeleton() {
  skeletonState.style.display = "flex";
  emptyState.hidden = true;
  labPanel.hidden   = true;
}

function hideSkeleton() {
  skeletonState.style.display = "none";
}

function showPanel() {
  emptyState.hidden = true;
  labPanel.hidden   = false;
}

function showEmpty(msg) {
  emptyState.hidden      = false;
  emptyState.textContent = msg || "Select a lab act to get started.";
  labPanel.hidden        = true;
}