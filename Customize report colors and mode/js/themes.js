// js/themes.js
// ----------------------------------------------------------------------------
// Grab the <ul id="theme-dropdown"> so builder functions can append into it
window.themesList = document.getElementById("theme-dropdown");

// === 1) Palette definitions ===
const jsonDataColors = [
  {
    "name": "Default",
    "dataColors": ["#1A81FB","#142091","#E16338","#5F076E","#DA3F9D","#6945B8","#D3AA22","#CF404A"],
    "foreground":"#252423",
    "background":"#FFFFFF",
    "tableAccent":"#B73A3A"
  },
  {
    "name": "Divergent",
    "dataColors": ["#B73A3A","#EC5656","#F28A90","#F8BCBD","#99E472","#23C26F","#0AAC00","#026645"],
    "foreground":"#252423",
    "background":"#F4F4F4",
    "tableAccent":"#B73A3A"
  },
  {
    "name": "Executive",
    "dataColors": ["#3257A8","#37A794","#8B3D88","#DD6B7F","#6B91C9","#F5C869","#77C4A8","#DEA6CF"],
    "background":"#FFFFFF",
    "foreground":"#9C5252",
    "tableAccent":"#6076B4"
  },
  {
    "name": "Tidal",
    "dataColors": ["#094782","#0B72D7","#098BF5","#54B5FB","#71C0A7","#57B956","#478F48","#326633"],
    "tableAccent":"#094782",
    "visualStyles": {
      "*": {
        "*": {
          "background":[{"show":true,"transparency":3}],
          "visualHeader":[{"foreground":{"solid":{"color":"#094782"}},"transparency":3}]
        }
      },
      "group":      {"*":{"background":[{"show":false}]}},
      "basicShape": {"*":{"background":[{"show":false}]}},
      "image":      {"*":{"background":[{"show":false}]}},
      "page":       {"*":{"background":[{"transparency":100}]}}
    }
  }
];

// === 2) Light / Dark theme definitions ===
const themes = [
  {
    "background":"#FFFFFF",
    "visualStyles":{
      "*":{"*":{
        "border":[{"show":true,"color":{"solid":{"color":"#FFFFFF"}},"radius":2}],
        "dropShadow":[{"color":{"solid":{"color":"#FFFFFF"}},"show":true,
                      "position":"Outer","preset":"Custom","shadowSpread":1,
                      "shadowBlur":1,"angle":45,"shadowDistance":1,"transparency":95}]
      }}
    }
  },
  {
    "background":"#252423",
    "foreground":"#FFFFFF",
    "tableAccent":"#FFFFFF",
    "textClasses":{
      "title":{"color":"#FFF","fontFace":"Segoe UI Bold"}
    },
    "visualStyles":{
      "*":{"*":{
        "*":[{"fontFamily":"Segoe UI","color":{"solid":{"color":"#252423"}},
              "labelColor":{"solid":{"color":"#FFFFFF"}},
              "secLabelColor":{"solid":{"color":"#FFFFFF"}},
              "titleColor":{"solid":{"color":"#FFFFFF"}}}],
        "labels":[{"color":{"solid":{"color":"#FFFFFF"}}}],
        "categoryLabels":[{"color":{"solid":{"color":"#FFFFFF"}}}],
        "border":[{"show":true,"color":{"solid":{"color":"#484644"}},"radius":2}],
        "dropShadow":[{"color":{"solid":{"color":"#FFFFFF"}},"show":true,
                      "position":"Outer","preset":"Custom","shadowSpread":1,
                      "shadowBlur":1,"angle":45,"shadowDistance":1,"transparency":95}]
      }}
    }
  }
];

// === 3) Build the full palette (slider + separators + radios) ===
function buildThemePalette() {
  buildThemeSwitcher();
  buildSeparator();
  jsonDataColors.forEach((_, idx) => {
    themesList.appendChild(buildDataColorElement(idx));
  });
}

// --- 3a) Dark mode toggle row ---
function buildThemeSwitcher() {
  const div = document.createElement("div");
  div.className = "theme-element-container";
  div.setAttribute("role","menuitem");

  // label
  const label = document.createElement("span");
  label.className = "theme-switch-label";
  label.id        = "dark-label-text";
  label.textContent = "Dark mode";
  div.appendChild(label);

  // switch
  const sw = document.createElement("label");
  sw.className = "switch";
  sw.setAttribute("aria-labelledby","dark-label-text");
  const cb = document.createElement("input");
  cb.type = "checkbox";
  cb.id   = "theme-slider";
  cb.onchange = toggleTheme;
  const slider = document.createElement("span");
  slider.className = "slider round";
  sw.append(cb, slider);
  div.appendChild(sw);

  themesList.appendChild(div);
}

// --- 3b) Separator line ---
function buildSeparator() {
  const sep = document.createElement("div");
  sep.className = "dropdown-separator";
  sep.setAttribute("role","separator");
  themesList.appendChild(sep);
}

// --- 3c) One radio + color swatches row ---
function buildDataColorElement(id) {
  const wrapper = document.createElement("div");
  wrapper.className = "theme-element-container";
  wrapper.setAttribute("role","group");

  const input = document.createElement("input");
  input.type  = "radio";
  input.name  = "data-color";
  input.id    = "datacolor" + id;
  input.setAttribute("role","menuitemradio");
  input.setAttribute("aria-label", jsonDataColors[id].name + " color theme");
  input.onclick = () => onDataColorWrapperClicked(id);
  wrapper.appendChild(input);

  const nameSpan = document.createElement("span");
  nameSpan.className = "data-color-name";
  nameSpan.textContent = jsonDataColors[id].name;
  nameSpan.onclick = () => onDataColorWrapperClicked(id);
  wrapper.appendChild(nameSpan);

  const colorsDiv = document.createElement("div");
  colorsDiv.className = "theme-colors";
  colorsDiv.onclick = () => onDataColorWrapperClicked(id);
  jsonDataColors[id].dataColors.forEach(c => {
    const dot = document.createElement("div");
    dot.className = "data-color";
    dot.style.background = c;
    colorsDiv.appendChild(dot);
  });
  wrapper.appendChild(colorsDiv);

  return wrapper;
}

// === 4) Handlers to apply the theme to the embedded report ===

function onDataColorWrapperClicked(id) {
  // clear old selection
  document.querySelectorAll("input[name=data-color]").forEach(r=>r.checked=false);
  // check new
  document.getElementById("datacolor"+id).checked = true;
  applyTheme();
}

async function applyTheme() {
  const activeId = +document.querySelector("input[name=data-color]:checked")
                      .id.replace("datacolor","");
  const darkMode  = document.getElementById("theme-slider").checked ? 1 : 0;
  const newTheme  = Object.assign({}, jsonDataColors[activeId], themes[darkMode]);
  await window.themesShowcaseState.report.applyTheme({ themeJson: newTheme });
}

async function toggleTheme() {
  await applyTheme();
  // toggle UI dark classes
  document.querySelectorAll(
    "body, .content, .dropdown, .theme-container, .theme-switch-label, .dropdown-separator, .slider, .btn-theme, .bucket-theme, .data-color-name"
  ).forEach(el => el.classList.toggle("dark"));
}
