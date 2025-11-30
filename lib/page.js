// Templates
const templates = [
  // Template 1
  {
    excludeElements: ["#sidebar"],
    particles: [
      {
        shape: "circle",
        move: ["emit"],
        easing: "easeOutExpo",
        colors: [
          "rgba(255,182,185,.9)",
          "rgba(250,227,217,.9)",
          "rgba(187,222,214,.9)",
          "rgba(138,198,209,.9)",
        ],
        number: 30,
        duration: [1200, 1800],
        shapeOptions: {
          radius: [16, 32],
        },
      },
      {
        shape: "circle",
        move: ["diffuse"],
        easing: "easeOutExpo",
        colors: ["#FFF"],
        number: 1,
        duration: [1200, 1800],
        shapeOptions: {
          radius: 20,
          alpha: 0.5,
          lineWidth: 6,
        },
      },
    ],
  },
  // Template 2
  {
    excludeElements: ["#sidebar"],
    particles: [
      {
        shape: "circle",
        move: ["emit"],
        easing: "easeOutExpo",
        colors: ["#ff324a", "#31ffa6", "#206eff", "#ffff99"],
        number: 30,
        duration: [1200, 1800],
        shapeOptions: {
          radius: [16, 32],
        },
      },
    ],
  },
  // Template 3
  {
    excludeElements: ["#sidebar"],
    particles: [
      {
        shape: "polygon",
        move: ["emit", "rotate"],
        easing: "easeOutExpo",
        colors: ["#ff324a", "#31ffa6", "#206eff", "#ffff99"],
        number: 30,
        duration: [1200, 1800],
        shapeOptions: {
          radius: [16, 32],
          sides: 5,
        },
      },
      {
        shape: "polygon",
        move: ["diffuse", "rotate"],
        easing: "easeOutExpo",
        colors: ["#FFF"],
        number: 3,
        duration: [1200, 1800],
        shapeOptions: {
          radius: 20,
          alpha: 0.5,
          lineWidth: 6,
          sides: 5,
        },
      },
    ],
  },
  // Template 4
  {
    excludeElements: ["#sidebar"],
    particles: [
      {
        shape: "polygon",
        move: ["diffuse", "rotate"],
        easing: "easeOutExpo",
        colors: ["#FFF"],
        number: 1,
        duration: [1200, 1800],
        shapeOptions: {
          radius: 20,
          alpha: 0.5,
          lineWidth: 6,
          sides: 5,
        },
      },
      {
        shape: "star",
        move: ["diffuse", "rotate"],
        easing: "easeOutExpo",
        colors: ["#FFF"],
        number: 1,
        duration: [1200, 1800],
        shapeOptions: {
          radius: 20,
          alpha: 0.5,
          lineWidth: 6,
          spikes: 5,
        },
      },
      {
        shape: "circle",
        move: ["diffuse", "rotate"],
        easing: "easeOutExpo",
        colors: ["#FFF"],
        number: 1,
        duration: [1200, 1800],
        shapeOptions: {
          radius: 20,
          alpha: 0.5,
          lineWidth: 6,
        },
      },
    ],
  },
];

const defaultConfig = templates[0];

// Load from localStorage
let initialConfig = defaultConfig;
try {
  const savedConfig = localStorage.getItem("mouse-firework-config");
  if (savedConfig) {
    initialConfig = JSON.parse(savedConfig);
  }
} catch (e) {
  console.error("Failed to load saved configuration:", e);
  showToast(
    "Configuration Load Error",
    "Using default configuration.",
    "error"
  );
}

// Initialize Editor
const editor = CodeMirror.fromTextArea(document.getElementById("code-editor"), {
  mode: "application/json",
  value: JSON.stringify(initialConfig, null, 2),
  smartIndent: true,
  styleActiveLine: true,
  lineNumbers: true,
  indentUnit: 2,
  gutters: [
    "CodeMirror-linenumbers",
    "CodeMirror-foldgutter",
    "CodeMirror-lint-markers",
  ],
  lint: true,
  matchBrackets: true,
  autoCloseBrackets: true,
  foldGutter: true,
  theme: "idea",
});

// Entity Examples
const entityExamples = {
  square: `class Square extends firework.BaseEntity {
  paint() {
    const { ctx, radius } = this;
    ctx.beginPath();
    ctx.rect(-radius, -radius, radius * 2, radius * 2);
    ctx.closePath();
  }
}`,
  heart: `class Heart extends firework.BaseEntity {
  paint() {
    const { ctx, radius } = this;
    ctx.beginPath();
    const topCurveHeight = radius * 0.3;
    ctx.moveTo(0, topCurveHeight);
    ctx.bezierCurveTo(0, 0, -radius, 0, -radius, topCurveHeight);
    ctx.bezierCurveTo(-radius, (radius + topCurveHeight) / 2, 
                      0, (radius + topCurveHeight) / 2 + radius, 
                      0, (radius + topCurveHeight) / 2 + radius);
    ctx.bezierCurveTo(0, (radius + topCurveHeight) / 2 + radius, 
                      radius, (radius + topCurveHeight) / 2, 
                      radius, topCurveHeight);
    ctx.bezierCurveTo(radius, 0, 0, 0, 0, topCurveHeight);
    ctx.closePath();
  }
}`,
  triangle: `class Triangle extends firework.BaseEntity {
  paint() {
    const { ctx, radius } = this;
    ctx.beginPath();
    ctx.moveTo(0, -radius);
    ctx.lineTo(radius, radius);
    ctx.lineTo(-radius, radius);
    ctx.closePath();
  }
}`,
};

// Entity Editor
const defaultEntityCode = entityExamples.square;

// Custom Entities Storage
let customEntities = {};
try {
  const savedEntities = localStorage.getItem("mouse-firework-custom-entities");
  if (savedEntities) {
    customEntities = JSON.parse(savedEntities);
  }
} catch (e) {
  console.error("Failed to load custom entities:", e);
  showToast(
    "Custom Entities Load Error",
    "Failed to load custom entities.",
    "error"
  );
}

const entityEditor = CodeMirror.fromTextArea(
  document.getElementById("entity-editor"),
  {
    mode: "javascript",
    value: defaultEntityCode,
    smartIndent: true,
    styleActiveLine: true,
    lineNumbers: true,
    indentUnit: 2,
    gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
    matchBrackets: true,
    autoCloseBrackets: true,
    foldGutter: true,
    theme: "idea",
  }
);

// Registered Shapes Tracking
const registeredShapes = new Set(["circle", "polygon", "star"]);

function updateRegisteredShapesList() {
  const list = Array.from(registeredShapes).sort().join(", ");
  const el = document.getElementById("registered-shapes");
  if (el) el.textContent = list;
}

function updateEntitySelect() {
  const select = document.getElementById("entity-select");
  const currentVal = select.value;

  // Clear options except first
  while (select.options.length > 1) {
    select.remove(1);
  }

  // Add entities
  Object.keys(customEntities)
    .sort()
    .forEach((name) => {
      const option = document.createElement("option");
      option.value = name;
      option.text = name;
      select.add(option);
    });

  // Restore selection if possible
  if (customEntities[currentVal]) {
    select.value = currentVal;
  } else {
    select.value = "";
  }
}

// Explicitly set the value to ensure it's loaded
editor.setValue(JSON.stringify(initialConfig, null, 2));

// Register all saved entities
Object.entries(customEntities).forEach(([name, code]) => {
  registerCustomEntity(name, code);
});
updateEntitySelect();

// Initial Firework
const initFirework = () => {
  if (validateConfig(initialConfig)) {
    firework(initialConfig);
  }
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initFirework);
} else {
  initFirework();
}

// Functions
function validateConfig(config) {
  if (!config) return false;
  if (!config.particles || !Array.isArray(config.particles)) {
    showToast("Configuration Error", "Missing or invalid 'particles' array.", "error");
    return false;
  }

  for (const p of config.particles) {
    if (p.shape && !registeredShapes.has(p.shape)) {
      showToast(
        "Configuration Error", 
        `Shape "${p.shape}" is not registered. Please register it first or check for typos.`, 
        "error"
      );
      return false;
    }
  }
  return true;
}

function showToast(title, message, type = "error") {
  let container = document.querySelector(".toast-container");
  if (!container) {
    container = document.createElement("div");
    container.className = "toast-container";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
        <div class="toast-content">
          <div class="toast-title">${title}</div>
          <div class="toast-message">${message}</div>
        </div>
      `;

  container.appendChild(toast);

  // Trigger reflow
  toast.offsetHeight;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3000);
}

function toggleSidebar() {
  document.getElementById("sidebar").classList.toggle("collapsed");
}

function switchTab(tabName) {
  // Update buttons
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.classList.remove("active");
    if (btn.getAttribute("onclick").includes(tabName)) {
      btn.classList.add("active");
    }
  });

  // Update panes
  document.querySelectorAll(".tab-pane").forEach((pane) => {
    pane.classList.remove("active");
  });
  document.getElementById(`tab-${tabName}`).classList.add("active");

  // Refresh editors to fix rendering issues when hidden
  if (tabName === "config") editor.refresh();
  if (tabName === "entity") entityEditor.refresh();
}

function registerCustomEntity(name, code) {
  try {
    // Create a function that returns the class
    // We wrap it to avoid global scope pollution and allow 'firework' access
    const createClass = new Function("firework", `return ${code}`);
    const EntityClass = createClass(firework);

    if (typeof EntityClass === "function") {
      firework.registerEntity(name, EntityClass);
      registeredShapes.add(name);
      updateRegisteredShapesList();
      return true;
    }
  } catch (e) {
    console.error("Failed to register entity:", e);
    showToast("Entity Registration Error", e.message, "error");
    return false;
  }
  return false;
}

function loadSelectedEntity() {
  const select = document.getElementById("entity-select");
  const name = select.value;

  if (name && customEntities[name]) {
    document.getElementById("entity-name").value = name;
    entityEditor.setValue(customEntities[name]);
  } else {
    document.getElementById("entity-name").value = "custom";
    entityEditor.setValue(defaultEntityCode);
  }
}

function deleteCurrentEntity() {
  const select = document.getElementById("entity-select");
  const name = select.value;

  if (name && customEntities[name]) {
    if (confirm(`Delete entity "${name}"?`)) {
      delete customEntities[name];
      localStorage.setItem(
        "mouse-firework-custom-entities",
        JSON.stringify(customEntities)
      );

      // Note: We can't easily unregister from firework lib without reloading,
      // but we can remove from our list
      registeredShapes.delete(name);
      updateRegisteredShapesList();
      updateEntitySelect();
      loadSelectedEntity(); // Reset to new
    }
  }
}

function loadEntityExample(type) {
  if (entityExamples[type]) {
    entityEditor.setValue(entityExamples[type]);
    document.getElementById("entity-name").value = type;
    document.getElementById("entity-select").value = ""; // Reset select to "New"
  }
}

function chooseTemplate(index) {
  if (templates[index]) {
    const config = templates[index];
    const configStr = JSON.stringify(config, null, 2);
    editor.setValue(configStr);
    applyConfig();
  }
}

function applyConfig() {
  let config;
  let configStr;

  try {
    configStr = editor.getValue();
    config = JSON.parse(configStr);
  } catch (e) {
    console.error("Invalid JSON configuration:", e);
    showToast("Configuration Error", "Invalid JSON: " + e.message, "error");
    return;
  }

  if (!validateConfig(config)) {
    return;
  }

  try {
    // 1. Apply Custom Entity
    const entityName = document.getElementById("entity-name").value.trim();
    const entityCode = entityEditor.getValue();

    if (entityName && entityCode) {
      if (registerCustomEntity(entityName, entityCode)) {
        // Save to customEntities
        customEntities[entityName] = entityCode;
        localStorage.setItem(
          "mouse-firework-custom-entities",
          JSON.stringify(customEntities)
        );
        updateEntitySelect();
        // Select the just saved entity
        document.getElementById("entity-select").value = entityName;
      }
    }
  } catch (e) {
    console.error("Failed to register custom entity:", e);
    showToast("Entity Error", e.message, "error");
  }

  // Ensure UI elements are excluded to prevent accidental triggers
  const requiredExcludes = ["#sidebar", "button", "a", "input"];
  if (!config.excludeElements) config.excludeElements = [];

  requiredExcludes.forEach((selector) => {
    if (!config.excludeElements.includes(selector)) {
      config.excludeElements.push(selector);
    }
  });

  firework(config);

  // Save to localStorage
  localStorage.setItem("mouse-firework-config", configStr);

  // Visual feedback for button
  const btn = document.querySelector(".btn-primary");
  const originalText = btn.innerText;
  btn.innerText = "Applied!";
  btn.style.background = "#10b981";
  setTimeout(() => {
    btn.innerText = originalText;
    btn.style.background = "";
  }, 1000);
}
