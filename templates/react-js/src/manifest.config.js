import { defineManifest } from "@crxjs/vite-plugin";
import packageJson from "../package.json";
const { version } = packageJson;

// eslint-disable-next-line no-undef
export const browser =
  process.env.BROWSER?.trim() == "firefox" ? "firefox" : "chrome";

//TODO: add separate entry points
const manifest = {
  manifest_version: 3,
  name: packageJson.displayName || packageJson.name,
  description: packageJson.description,
  version: version,
  action: {
    default_popup: "popup.html",
    default_icon: "icons/48x48.png",
  },
  icons: {
    16: "icons/16x16.png",
    32: "icons/32x32.png",
    48: "icons/48x48.png",
    128: "icons/128x128.png",
  },
  options_page: "options.html",
  content_scripts: [
    {
      matches: ["http://*/*", "https://*/*"],
      js: ["src/entries/contentScript/index.js"],
    },
  ],
  chrome_url_overrides: {
    newtab: "newtab.html",
  },
  background:
    browser === "firefox"
      ? {
          scripts: ["src/entries/background/index.js"],
        }
      : {
          service_worker: "src/entries/background/index.js",
        },
};

export default defineManifest(manifest);
