// js/themes.js
// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
// ----------------------------------------------------------------------------

// 1) Your color + theme definitions (unchanged)
const jsonDataColors = [
  {
    "name": "Default",
    "dataColors": ["#1A81FB","#142091","#E16338","#5F076E","#DA3F9D","#6945B8","#D3AA22","#CF404A"],
    "foreground":"#252423","background":"#FFFFFF","tableAccent":"#B73A3A"
  },
  {
    "name": "Divergent",
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
    "visualStyles":{
      "*":{"*":{
        "background":[{"show":true,"transparency":3}],
        "visualHeader":[{"foreground":{"solid":{"color":"#094782"}},"transparency":3}]
      }},
      "group":{"*":{"background":[{"show":false}]}},
      "basicShape":{"*":{"background":[{"show":false}]}},
      "image":{"*":{"background":[{"show":false}]}},
      "page":{"*":{"background":[{"transparency":100}]}}
    }
  }
];

const themes = [
  {
    "background":"#FFFFFF",
    "visualStyles":{
      "*":{"*":{
        "border":[{"show":true,"color":{"solid":{"color":"#FFFFFF"}},"radius":2}],
        "dropShadow":[{"color":{"solid":{"color":"#FFFFFF"}},"show":true,"position":"Outer","preset":"Custom","shadowSpread":1,"shadowBlur":1,"angle":45,"shadowDistance":1,"transparency":95}]
      }}
    }
  },
  {
    "background":"#252423","foreground":"#FFFFFF","tableAccent":"#FFFFFF",
    "textClasses":{"title":{"color":"#FFF","fontFace":"Segoe UI Bold"}},
    "visualStyles":{
      "*":{"*":{
        "*":[{"fontFamily":"Segoe UI","color":{"solid":{"color":"#252423"}},"labelColor":{"solid":{"color":"#FFFFFF"}},"secLabelColor":{"solid":{"color":"#FFFFFF"}},"titleColor":{"solid":{"color":"#FFFFFF"}}}],
        "labels":[{"color":{"solid":{"color":"#FFFFFF"}}}],
        "categoryLabels":[{"color":{"solid":{"color":"#FFFFFF"}}}],
        "border":[{"show":true,"color":{"solid":{"color":"#484644"}},"radius":2}],
        "dropShadow":[{"color":{"solid":{"color":"#FFFFFF"}},"show":true,"position":"Outer","preset":"Custom","shadowSpread":1,"shadowBlur":1,"angle":45,"shadowDistance":1,"transparency":95}]
      }}
    }
  }
];

// 2) Now the Playground UI builder functions:

// Entry-point: call this to build the entire dropdown
function buildThemePalette() {
  buildThemeSwitcher();
  buildSeparator();
  for (let i = 0; i < jsonDataColors.length; i++) {
    $("#theme-dropdown").append(buildDataColorElement(i));
  }
}

// Dark-mode toggle row
function buildThemeSwitcher() {
  const container = $("<div>")
    .addClass("theme-element-container")
    .attr("role","menuitem");
  container.append($("<span>")
    .addClass("theme-switch-label")
    .attr("id","dark-label-text")
    .text("Dark mode"));
  const label = $("<label>").addClass("switch").attr("aria-labelledby","dark-label-text");
  label.append($("<input>")
    .attr({ id:"theme-slider", type:"checkbox", onchange:"toggleTheme()" }));
  label.append($("<span>").addClass("slider round"));
  container.append(label);
  $("#theme-dropdown").append(container);
}

// Separator
function buildSeparator() {
  $("#theme-dropdown").append(
    $("<div>").addClass("dropdown-separator").attr("role","separator")
  );
}

// One JSON color-set -> radio+swatches
function buildDataColorElement(id) {
  const item = $("<div>").addClass("theme-element-container").attr("role","group");
  const input = $("<input>").attr({
    role:"menuitemradio",
    type:"radio",
    name:"data-color",
    id:"datacolor"+id,
    onclick:"onDataColorWrapperClicked(this)"
  });
  item.append(input);
  item.append($("<span>")
    .addClass("data-color-name")
    .text(jsonDataColors[id].name)
    .on("click",()=> onDataColorWrapperClicked(input)));
  const swatches = $("<div>").addClass("theme-colors")
    .on("click",()=> onDataColorWrapperClicked(input));
  jsonDataColors[id].dataColors.forEach(c =>
    swatches.append($("<div>").addClass("data-color").css("background",c))
  );
  item.append(swatches);
  return item;
}

// User clicked one of the above
function onDataColorWrapperClicked(control) {
  $("#theme-dropdown input[name=data-color]").prop("checked",false);
  $(control).prop("checked",true);
  applyTheme();
}

// Grab slider + radio, re-compose theme and push it
async function applyTheme() {
  const activeColor = Number($("#theme-dropdown input[name=data-color]:checked")
                             .attr("id").slice(-1));
  const dark = $("#theme-slider").is(":checked") ? 1 : 0;
  const newTheme = $.extend({}, jsonDataColors[activeColor], themes[dark]);
  await window.themesShowcaseState.themesReport.applyTheme({ themeJson:newTheme });
}

// Toggle light/dark UI widget styles
function toggleTheme() {
  applyTheme();
  const elems = [$("body"),$(".content"),$(".dropdown"),$(".theme-switch-label"),
                 $(".dropdown-separator"),$(".slider"),$(".btn-theme"),
                 $(".bucket-theme"),$(".data-color-name")];
  elems.forEach(e=>e.toggleClass("dark"));
}
