const fs = require('node:fs');
const path = require('node:path');

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

function main() {
  const output = readRequiredArg('output');
  const sourceRepository = readRequiredArg('source-repository');
  const sourceRef = readRequiredArg('source-ref');
  const sourceSha = readRequiredArg('source-sha');
  const releaseRepository = readRequiredArg('release-repository');
  const releaseTag = readRequiredArg('release-tag');
  const workflowRunUrl = readArg('workflow-run-url');

  const version = readRequiredArg('version');

  const manifest = {
    version,
    releaseTag,
    sourceRepository,
    sourceRef,
    sourceSha,
    releaseRepository,
    buildTimestamp: new Date().toISOString(),
  };

  if (workflowRunUrl) {
    manifest.workflowRunUrl = workflowRunUrl;
  }

  const outputPath = path.resolve(output);
  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(outputPath, JSON.stringify(manifest, null, 2) + '\n', 'utf8');
  console.log(`Release manifest written to ${outputPath}`);
}

main();
