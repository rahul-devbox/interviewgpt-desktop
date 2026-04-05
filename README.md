# InterviewGPT Desktop Releases

`interviewgpt-desktop` is the public distribution repository for InterviewGPT Desktop.

It does not contain private source code. It exists to publish release artifacts and release metadata generated from the private `app-interviewgpt` repository.

## Repository Role

This repository publishes:

- Windows NSIS installer builds
- Windows portable builds
- macOS DMG builds
- macOS ZIP builds
- updater metadata
- release checksums
- CycloneDX SBOM files
- release manifest metadata

Current release line in this workspace: `3.0.0`

## What This Repository Must Not Contain

- private Electron source code
- backend secrets
- Supabase credentials
- Clerk secrets
- signing credentials

## Downloading A Release

1. Open the [Releases](../../releases) page.
2. Select the desired tag.
3. Download the asset for your platform.

Typical release assets:

- `InterviewGPT-Setup-<version>.exe`
- `InterviewGPT-Portable-<version>.exe`
- `InterviewGPT-<version>-mac-universal.dmg`
- `InterviewGPT-<version>-mac-universal.zip`
- `latest.yml`
- `latest-mac.yml`
- `portable-win.json`
- `checksums.sha256`
- `sbom.cyclonedx.json`
- `release-manifest.json`

## Release Verification

Before trusting a release, verify:

1. the tag matches the intended version, for example `v3.0.0`
2. the artifact filenames match the same version
3. `checksums.sha256` matches the downloaded binaries
4. `release-manifest.json` points to the expected private source SHA
5. updater metadata files are present

Example checksum verification on Windows PowerShell:

```powershell
Get-FileHash .\InterviewGPT-Setup-3.0.0.exe -Algorithm SHA256
Get-Content .\checksums.sha256
```

## Release Model

The private repository validates source, then dispatches the public release workflow in this repository.

This repository:

1. checks out the exact approved private commit
2. builds release artifacts
3. signs artifacts if signing material is available
4. publishes only binaries and release metadata

## Related Documentation

- [github.md](./github.md)
- [docs/RELEASING.md](./docs/RELEASING.md)
- [docs/dual-repo-release-process.md](./docs/dual-repo-release-process.md)
