# InterviewGPT Dual-Repository Release Architecture

InterviewGPT Desktop, distributed as SysCore, uses a source-private, artifacts-public release model.

- Product website: [https://www.interviewgpt.in](https://www.interviewgpt.in)
- Website downloads: [https://www.interviewgpt.in/download](https://www.interviewgpt.in/download)
- Public releases: [interviewgpt-desktop/releases](https://github.com/rahul-devbox/interviewgpt-desktop/releases)

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
6. The public workflow signs Windows artifacts, verifies platform metadata, and generates attestations.
7. The public workflow publishes the GitHub release.
8. Users download through the InterviewGPT website or directly from GitHub Releases.

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
- GitHub artifact attestations

## Version Control Rule

The release tag must always equal:

```text
v<package.json version>
```

Example:

- package version: `<version>`
- release tag: `v<version>`

## Signing Model

Windows releases are Authenticode signed with the certificate supplied by the protected release environment. The workflow verifies the signer thumbprint on every generated EXE before publication. A self-signed certificate provides artifact identity but not public Windows trust; production releases should use a publicly trusted code-signing certificate.

macOS signing and notarization are conditional:

- macOS signs when `MAC_CSC_LINK` is configured
- macOS notarizes when valid Apple API credentials are configured
- unsigned macOS builds still complete when signing material is absent

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
