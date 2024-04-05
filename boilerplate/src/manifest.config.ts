import { ManifestV3Export, defineManifest } from '@crxjs/vite-plugin';
import packageJson from '../package.json';
const { version } = packageJson;

type Browser = 'firefox' | 'chrome';
export const browser: Browser = process.env.BROWSER?.trim() == 'firefox' ? 'firefox' : 'chrome';
// console.log({ browser });

const manifest: ManifestV3Export = {
  manifest_version: 3,
  name: packageJson.displayName || packageJson.name,
  version: version,
  action: {
    default_popup: 'popup.html'
  },
  options_page: 'options.html',
  content_scripts: [
    {
      matches: ['http://*/*', 'https://*/*'],
      js: ['src/contentScript/index.ts'],
    }
  ],
  chrome_url_overrides: {
    newtab: 'newtab.html',
  },
  background: browser === 'firefox' ? {
    scripts: ['src/background/index.ts'],
  } : {
    service_worker: 'src/background/index.ts',
  }
};

export default defineManifest(manifest);