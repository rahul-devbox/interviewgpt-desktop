# Dual-Repo Release Architecture

InterviewGPT Desktop uses a source-private, artifacts-public release model.

## Repository Split

- Private source repo: `app-interviewgpt`
- Public release repo: `interviewgpt-desktop`

The private repo owns source code, packaging logic, and validation. The public repo owns release publication only.

## Why The Split Exists

Desktop binaries are always inspectable. Obfuscation, ASAR packaging, code signing, and notarization can raise the cost of reverse engineering, but they do not make a client secret.

The correct security boundary is:

1. private source code stays in the private repo
2. release binaries are generated from an exact approved commit SHA
3. only binaries and release metadata are published publicly
4. secrets and sensitive business logic remain on the server

## Trust Boundaries

The desktop app must never be treated as a trusted environment for:

- backend secrets
- Supabase service credentials
- Clerk secrets
- payment secrets
- licensing secrets
- server-side authorization decisions

The desktop app is responsible for UI and client execution only. Sensitive operations remain on the backend.

## Release Flow

1. `app-interviewgpt` validates source quality and release metadata.
2. The private workflow resolves:
   - package version
   - source ref
   - source commit SHA
   - release tag
3. The private workflow dispatches `interviewgpt-desktop`.
4. The public workflow checks out the exact private source SHA.
5. The public workflow builds release artifacts and metadata.
6. The public workflow publishes the GitHub release.

## Build Outputs

The current desktop release flow produces:

- Windows NSIS installer
- Windows portable executable
- macOS DMG
- macOS ZIP
- `latest.yml`
- `latest-mac.yml`
- `portable-win.json`
- `checksums.sha256`
- `sbom.cyclonedx.json`
- `release-manifest.json`

## Version Control Rule

The release tag must always equal:

```text
v<package.json version>
```

Example:

- package version: `3.0.0`
- release tag: `v3.0.0`

## Signing Model

Signing is conditional:

- Windows signs when `WIN_CSC_LINK` is configured
- macOS signs when `MAC_CSC_LINK` is configured
- unsigned builds still complete when signing material is absent

This keeps the release pipeline usable in development and early-stage distribution while still supporting proper signed releases when certificates are available.

## Security Summary

Safe pattern:

- client UI in Electron
- authentication and authorization on the web/backend
- data access on the web/backend
- secrets on the server
- public repository limited to artifacts and metadata

Unsafe pattern:

- putting backend secrets in the desktop app
- publishing private desktop source in the public repo
- using the client as the trust boundary for business-critical enforcement
