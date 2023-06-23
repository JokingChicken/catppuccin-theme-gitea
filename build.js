const fs = require("fs");
const path = require("path");
const sass = require("sass");
const ctp = require("@catppuccin/palette");

const builder = (flavor, accent) => `
@import "@catppuccin/palette/scss/${flavor}";
$accent: $${accent};
$isDark: ${flavor !== "latte"};
@import "theme";
`;

const accents = [
  "rosewater",
  "flamingo",
  "pink",
  "mauve",
  "red",
  "maroon",
  "peach",
  "yellow",
  "green",
  "teal",
  "sky",
  "sapphire",
  "blue",
  "lavender",
];

fs.mkdirSync(path.join(__dirname, "dist"), { recursive: true });

// the "$1" is added to the front of the string so we still get the starting match added
let themeList = ["$1"];

for (const flavor of Object.keys(ctp.variants)) {
  for (const accent of accents) {
    const input = builder(flavor, accent);
    const themeName = `catppuccin-${flavor}-${accent}`;

    const result = sass.compileString(input, {
      loadPaths: [
        path.join(__dirname, "src"),
        path.join(__dirname, "node_modules"),
      ],
    });

    fs.writeFileSync(
      path.join(__dirname, "dist", `theme-${themeName}.css`),
      result.css
    );

    themeList.push(themeName);
  }
}

const readme = fs.readFileSync("README.md").toString();
fs.writeFileSync(
  "README.md",
  // regex; replace every line starting with: "THEMES = auto,gitea,arc-green"
  readme.replace(/(THEMES = auto,gitea,arc-green).*/, themeList.join(","))
);
