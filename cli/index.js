import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { execSync } from 'child_process';

const uploadsDir = path.join(__dirname, '../uploads');
const metadataFile = path.join(__dirname, '../data/documents.json');

// These paths are for your frontend sync
const svelteUploadsDir = path.join(__dirname, '../svelte-app/public/uploads');
const svelteMetadataFile = path.join(__dirname, '../svelte-app/public/documents.json');

if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
if (!fs.existsSync(metadataFile)) fs.writeFileSync(metadataFile, '[]');
if (!fs.existsSync(svelteUploadsDir)) fs.mkdirSync(svelteUploadsDir, { recursive: true });

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function prompt(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

function syncToFrontend(fileName) {
  const srcFilePath = path.join(uploadsDir, fileName);
  const destFilePath = path.join(svelteUploadsDir, fileName);

  fs.copyFileSync(srcFilePath, destFilePath);
  fs.copyFileSync(metadataFile, svelteMetadataFile);
}

async function main() {
  const filePath = await prompt('Path to file: ');
  const tags = await prompt('Tags (comma-separated): ');
  const description = await prompt('Description: ');

  const fileName = path.basename(filePath);
  const destPath = path.join(uploadsDir, fileName);
  fs.copyFileSync(filePath, destPath);

  const now = new Date().toISOString();
  const metadata = JSON.parse(fs.readFileSync(metadataFile, 'utf-8'));

  metadata.push({
    file: fileName,
    uploadedAt: now,
    tags: tags.split(',').map(t => t.trim()),
    description
  });
  fs.writeFileSync(metadataFile, JSON.stringify(metadata, null, 2));

  // Sync to frontend
  syncToFrontend(fileName);

  // Git version control
  execSync('git add .');
  execSync(`git commit -m "loaf upload: ${fileName}"`);
  execSync('git push');

  console.log(`✅ Uploaded, synced, and committed ${fileName}`);
  rl.close();
}

main();
