import { defineManifest } from '@crxjs/vite-plugin';
import packageJson from '../package.json';
const { version } = packageJson;


// eslint-disable-next-line no-undef
export const browser = process.env.BROWSER?.trim() == 'firefox' ? 'firefox' : 'chrome';
console.log({ browser });

//TODO: add separate entry points
const manifest = {
  manifest_version: 3,
  name: packageJson.displayName || packageJson.name,
  description: packageJson.description,
  version: version,
  action: {
    default_popup: 'index.html'
  },
  options_page: 'index.html',
  // content_scripts: [
  //   {
  //     matches: ['http://*/*', 'https://*/*'],
  //     js: ['src/contentScript/index.ts'],
  //   }
  // ],
  chrome_url_overrides: {
    newtab: 'index.html',
  },
  // background: browser === 'firefox' ? {
  //   scripts: ['src/background/index.ts'],
  // } : {
  //   service_worker: 'src/background/index.ts',
  // }
};

export default defineManifest(manifest);