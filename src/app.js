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
const clearBtn       = document.getElementById("clearBtn");       // #4 #13
const outputBox      = document.getElementById("outputBox");
const attemptsDisplay= document.getElementById("attemptsDisplay"); // #3
const sidebar        = document.getElementById("sidebar");
const sidebarToggle  = document.getElementById("sidebarRailToggleBtn");
const sidebarOverlay = document.getElementById("sidebarOverlay");
const mobileSidebarBtn = document.getElementById("mobileSidebarBtn");
const groupList      = document.getElementById("groupList");
const mainContent    = document.querySelector(".main-content");

// ── State ─────────────────────────────────────────
let groupData    = null;
let currentMain  = null;
const MAX_ATTEMPTS = 5; // #3
let attempts     = 0;
let locked       = false;

// ── Boot ──────────────────────────────────────────
(async function init() {
  setupSidebar();
  await loadGroup();
})();

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
    btn.addEventListener("click", () => selectTab(i));
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
  currentMain = null;
  resetAttempts(); // #3 — reset counter on new lab act

  try {
    const codeRes = await fetch(`./groups/group2/${act.file}`);
    if (!codeRes.ok) throw new Error(`Source file not found: ${act.file}`);
    const codeText = await codeRes.text();

    currentMain = extractMain(codeText);

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
    input.type        = "text";
    input.id          = `input-${i}`;
    input.placeholder = inp.placeholder || "";
    input.autocomplete = "off";
    input.spellcheck  = false;
    input.addEventListener("keydown", (e) => { if (e.key === "Enter") runBtn.click(); });

    group.appendChild(label);
    group.appendChild(input);
    inputFields.appendChild(group);
  });
}

// ── Run Button ────────────────────────────────────
runBtn.addEventListener("click", () => {
  // #3 — if locked out, block
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

  const inputs = Array.from(inputFields.querySelectorAll("input")).map(i => i.value);

  try {
    const result = currentMain(inputs);
    outputBox.textContent = result ?? "(no output)";
    outputBox.className   = "output-box success";
    resetAttempts(); // successful run resets counter
  } catch (err) {
    attempts++;
    const remaining = MAX_ATTEMPTS - attempts;

    if (remaining <= 0) {
      locked = true;
      attemptsDisplay.textContent = "Maximum attempts (5/5) reached. Click \"Clear\" to reset.";
      attemptsDisplay.className   = "attempts-display locked";
      runBtn.disabled             = true;
    } else {
      attemptsDisplay.textContent = `Invalid input. Attempts: ${attempts}/${MAX_ATTEMPTS} — ${remaining} remaining.`;
      attemptsDisplay.className   = "attempts-display warning";
    }

    outputBox.textContent = `Error: ${err.message}`;
    outputBox.className   = "output-box error";
  }
});

// ── Clear Button (#4 #13) ─────────────────────────
clearBtn.addEventListener("click", () => {
  // Clear all input fields
  inputFields.querySelectorAll("input").forEach(inp => { inp.value = ""; });
  // Clear output
  outputBox.textContent = "Program output will appear here.";
  outputBox.className   = "output-box";
  // Reset attempt counter
  resetAttempts();
  // Focus first input
  const first = inputFields.querySelector("input");
  if (first) first.focus();
});

// ── Attempt Counter ───────────────────────────────
function resetAttempts() {
  attempts = 0;
  locked   = false;
  runBtn.disabled = false;
  if (attemptsDisplay) {
    attemptsDisplay.textContent = "";
    attemptsDisplay.className   = "attempts-display";
  }
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
  emptyState.hidden     = false;
  emptyState.textContent = msg || "Select a lab act to get started.";
  labPanel.hidden       = true;
}
