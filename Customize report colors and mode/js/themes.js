// js/themes.js
// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
// ----------------------------------------------------------------------------

// ——— Your two JSON arrays (no changes) ——————————————————————————————

const jsonDataColors = [
  {
    "name":"Default",
    "dataColors":["#1A81FB","#142091","#E16338","#5F076E","#DA3F9D","#6945B8","#D3AA22","#CF404A"],
    "foreground":"#252423","background":"#FFFFFF","tableAccent":"#B73A3A"
  },
  {
    "name":"Divergent",
    "dataColors":["#B73A3A","#EC5656","#F28A90","#F8BCBD","#99E472","#23C26F","#0AAC00","#026645"],
    "foreground":"#252423","background":"#F4F4F4","tableAccent":"#B73A3A"
  },
  {
    "name":"Executive",
    "dataColors":["#3257A8","#37A794","#8B3D88","#DD6B7F","#6B91C9","#F5C869","#77C4A8","#DEA6CF"],
    "background":"#FFFFFF","foreground":"#9C5252","tableAccent":"#6076B4"
  },
  {
    "name":"Tidal",
    "dataColors":["#094782","#0B72D7","#098BF5","#54B5FB","#71C0A7","#57B956","#478F48","#326633"],
    "tableAccent":"#094782",
    "visualStyles":{ /* … */ }
  }
];

const themes = [
  { /* light theme visuals … */ },
  { /* dark theme visuals … */ }
];

// ——— The Playground UI-builder functions —————————————————————————————————

function buildThemePalette() {
  buildThemeSwitcher();
  buildSeparator();
  for (let i=0; i<jsonDataColors.length; i++) {
    themesList.append(buildDataColorElement(i));
  }
}

function buildThemeSwitcher() {
  const div = document.createElement("div");
  div.className="theme-element-container"; div.setAttribute("role","menuitem");
  const span = document.createElement("span");
  span.className="theme-switch-label"; span.id="dark-label-text";
  span.textContent="Dark mode";
  div.appendChild(span);

  const label = document.createElement("label");
  label.className="switch"; label.setAttribute("aria-labelledby","dark-label-text");
  const input = document.createElement("input");
  input.id="theme-slider"; input.type="checkbox"; input.onchange=toggleTheme;
  const slider = document.createElement("span");
  slider.className="slider round";
  label.appendChild(input); label.appendChild(slider);
  div.appendChild(label);

  themesList.append(div);
}

function buildSeparator() {
  const sep = document.createElement("div");
  sep.className="dropdown-separator"; sep.setAttribute("role","separator");
  themesList.append(sep);
}

function buildDataColorElement(id) {
  const item = document.createElement("div");
  item.className="theme-element-container"; item.setAttribute("role","group");
  const input = document.createElement("input");
  input.type="radio"; input.name="data-color"; input.id="datacolor"+id;
  input.setAttribute("role","menuitemradio");
  input.onclick = () => onDataColorWrapperClicked(input);
  item.appendChild(input);

  const label = document.createElement("span");
  label.className="data-color-name";
  label.textContent = jsonDataColors[id].name;
  label.onclick = () => onDataColorWrapperClicked(input);
  item.appendChild(label);

  const swatches = document.createElement("div");
  swatches.className="theme-colors";
  swatches.onclick = () => onDataColorWrapperClicked(input);
  jsonDataColors[id].dataColors.forEach(c => {
    const dot = document.createElement("div");
    dot.className="data-color";
    dot.style.background = c;
    swatches.appendChild(dot);
  });
  item.appendChild(swatches);

  return item;
}

function onDataColorWrapperClicked(control) {
  $("input[name=data-color]", themesList).prop("checked", false);
  control.checked = true;
  applyTheme();
}

async function applyTheme() {
  const idx = Number($("input[name=data-color]:checked", themesList)[0].id.slice(-1));
  const themeIndex = document.getElementById("theme-slider").checked ? 1 : 0;
  const newTheme = $.extend({}, jsonDataColors[idx], themes[themeIndex]);
  await themesShowcaseState.themesReport.applyTheme({ themeJson: newTheme });
}

async function toggleTheme() {
  await applyTheme();
  [ bodyElement, contentElement, dropdownDiv, themeSwitchLabel,
    horizontalSeparator, sliderCheckbox, themeButton, themeBucket,
    dataColorNameElements
  ].forEach(e => e.toggleClass("dark"));
}
