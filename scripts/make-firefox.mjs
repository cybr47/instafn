import fs from 'node:fs';
import path from 'node:path';

const manifestPath = path.resolve('dist/manifest.json');
if (!fs.existsSync(manifestPath)) {
  throw new Error('dist/manifest.json not found. Run the normal Vite build first.');
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

// Firefox MV3 uses background.scripts rather than Chrome's service_worker.
if (manifest.background?.service_worker) {
  manifest.background = {
    scripts: [manifest.background.service_worker],
    type: 'module'
  };
}

manifest.browser_specific_settings = {
  ...(manifest.browser_specific_settings ?? {}),
  gecko: {
    ...(manifest.browser_specific_settings?.gecko ?? {}),
    id: 'instafn-firefox@cybr47.github',
    strict_min_version: '121.0',
    data_collection_permissions: {
      required: ['none']
    }
  }
};

fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
console.log('Patched dist/manifest.json for Firefox/AMO.');
