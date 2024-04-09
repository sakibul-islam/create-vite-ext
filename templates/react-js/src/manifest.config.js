import { defineManifest } from '@crxjs/vite-plugin';
import packageJson from '../package.json';
const { version } = packageJson;


// eslint-disable-next-line no-undef
export const browser = process.env.BROWSER?.trim() == 'firefox' ? 'firefox' : 'chrome';

//TODO: add separate entry points
const manifest = {
  manifest_version: 3,
  name: packageJson.displayName || packageJson.name,
  description: packageJson.description,
  version: version,
  action: {
    default_popup: 'index.html'
  },
  options_page: 'options.html',
  content_scripts: [
    {
      matches: ['http://*/*', 'https://*/*'],
      js: ['src/entries/contentScript/index.js'],
    }
  ],
  chrome_url_overrides: {
    newtab: 'newtab.html',
  },
  background: browser === 'firefox' ? {
    scripts: ['src/entries/background/index.js'],
  } : {
    service_worker: 'src/entries/background/index.js',
  }
};

export default defineManifest(manifest);