// js/themes.js
// ----------------------------------------------------------------------------
// 1) Data‐color palettes
const jsonDataColors = [
  {
    name: "Default",
    dataColors: ["#01B8AA","#374649","#FD625E","#F2C80F","#5F6B6D","#8AD4EB","#FE9666","#A66999"],
    tableAccent: "#01B8AA",
    visualStyles: {}
  },
  {
    name: "Tidal",
    dataColors: ["#094782","#0B72D7","#098BF5","#54B5FB","#71C0A7","#57B956","#478F48","#326633"],
    tableAccent: "#094782",
    visualStyles: {
      "*": {
        "*": {
          background: [{ show: true, transparency: 3 }],
          visualHeader: [{ foreground: { solid: { color: "#094782" } }, transparency: 3 }]
        }
      },
      group:       { "*": { background: [{ show: false }] } },
      basicShape:  { "*": { background: [{ show: false }] } },
      image:       { "*": { background: [{ show: false }] } },
      page: {
        "*": { background: [{ transparency: 100 }] }
      }
    }
  }
  // → you can add more palettes here…
];

// 2) Light vs Dark background modes
const themes = [
  {
    name: "Light",
    background: { background: [{ fill: { solid: { color: "#ffffff" } } }] }
  },
  {
    name: "Dark",
    background: { background: [{ fill: { solid: { color: "#2b2b2b" } } }] },
    text:       { labels: [{ color: { solid: { color: "#ffffff" } } }] }
    // → add any other contrasts needed
  }
];

// 3) Build the radio buttons under #theme-palette
function buildThemePalette() {
  const container = $("#theme-palette").empty();
  jsonDataColors.forEach((palette, i) => {
    const id = `datacolor${i}`;
    const radio = $(`
      <div class="custom-control custom-radio">
        <input type="radio" id="${id}" name="data-color" class="custom-control-input">
        <label class="custom-control-label" for="${id}">${palette.name}</label>
      </div>
    `);
    container.append(radio);
  });
}
