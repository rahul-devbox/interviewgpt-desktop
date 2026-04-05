const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

function readArg(name) {
  const flag = `--${name}`;
  const index = process.argv.indexOf(flag);
  if (index < 0) {
    return null;
  }

  return process.argv[index + 1] || null;
}

function readRequiredArg(name) {
  const value = readArg(name);
  if (!value) {
    throw new Error(`Missing required argument: --${name}`);
  }

  return value;
}

function computeFileSha512(filePath) {
  const fileBuffer = fs.readFileSync(filePath);
  return crypto.createHash('sha512').update(fileBuffer).digest('base64');
}

function findPortableExe(releaseDir, version) {
  const expectedName = `InterviewGPT-Portable-${version}.exe`;
  const fullPath = path.join(releaseDir, expectedName);
  if (fs.existsSync(fullPath)) {
    return { fileName: expectedName, filePath: fullPath };
  }

  const entries = fs.readdirSync(releaseDir);
  const portableEntry = entries.find(
    (entry) => entry.toLowerCase().includes('portable') && entry.endsWith('.exe'),
  );

  if (!portableEntry) {
    throw new Error(
      `No portable executable found in ${releaseDir}. Expected ${expectedName} or a file containing "portable" in its name.`,
    );
  }

  return { fileName: portableEntry, filePath: path.join(releaseDir, portableEntry) };
}

function main() {
  const releaseDir = path.resolve(readRequiredArg('release-dir'));
  const version = readRequiredArg('version');
  const releaseRepository = readRequiredArg('release-repository');
  const releaseTag = readRequiredArg('release-tag');
  const output = readRequiredArg('output');

  if (!fs.existsSync(releaseDir)) {
    throw new Error(`Release directory not found: ${releaseDir}`);
  }

  const { fileName, filePath } = findPortableExe(releaseDir, version);
  const stat = fs.statSync(filePath);
  const sha512 = computeFileSha512(filePath);

  const downloadBaseUrl =
    `https://github.com/${releaseRepository}/releases/download/${releaseTag}`;

  const manifest = {
    version,
    url: `${downloadBaseUrl}/${fileName}`,
    sha512,
    fileName,
    size: stat.size,
    notes: null,
    releaseDate: new Date().toISOString(),
    releaseRepository,
  };

  const outputPath = path.resolve(output);
  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(outputPath, JSON.stringify(manifest, null, 2) + '\n', 'utf8');
  console.log(`Portable update manifest written to ${outputPath}`);
}

main();
