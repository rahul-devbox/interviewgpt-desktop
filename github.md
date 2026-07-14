# GitHub Setup For Desktop Releases

This document describes the GitHub configuration required for the private-to-public SysCore desktop release flow.

Repositories:

- Private source repo: `app-interviewgpt`
- Public release repo: `interviewgpt-desktop`

## Private Repository Setup

Repository: `app-interviewgpt`

Create these repository variables:

- `PUBLIC_RELEASE_REPO_OWNER`
  Value: the GitHub owner or organization for `interviewgpt-desktop`
- `PUBLIC_RELEASE_REPO_NAME`
  Value: `interviewgpt-desktop`
- `PUBLIC_RELEASE_WORKFLOW_FILE`
  Value: `release-from-private.yml`
- `PUBLIC_RELEASE_WORKFLOW_REF`
  Value: `main`

Create this repository secret:

- `PUBLIC_REPO_WORKFLOW_TOKEN`

Recommended token scope:

- fine-grained PAT
- repository access limited to `interviewgpt-desktop`
- `Actions: Read and write`
- `Contents: Read and write`
- `Metadata: Read`

## Public Repository Setup

Repository: `interviewgpt-desktop`

Create this repository variable:

- `EXPECTED_SOURCE_REPO_OWNER`
  Value: the GitHub owner or organization for `app-interviewgpt`

Create this repository secret:

- `SOURCE_REPO_READ_TOKEN`

Recommended token scope:

- fine-grained PAT
- repository access limited to `app-interviewgpt`
- `Contents: Read-only`
- `Metadata: Read`

## Windows Signing Secrets

Windows releases require these `production-release` environment secrets:

- `WIN_CSC_LINK_BASE64`
- `WIN_CSC_KEY_PASSWORD`

`WIN_CSC_LINK_BASE64` is the base64-encoded PFX. The workflow verifies that every Windows EXE is signed by this exact certificate. A publicly trusted code-signing certificate is required before enabling electron-updater publisher verification.

## Optional macOS Signing Secrets

macOS signing:

- `MAC_CSC_LINK`
- `MAC_CSC_KEY_PASSWORD`

macOS notarization:

- `APPLE_API_KEY`
- `APPLE_API_KEY_ID`
- `APPLE_API_ISSUER`

## Recommended Environment

Create a GitHub environment in `interviewgpt-desktop` named:

- `production-release`

Recommended settings:

- require approval before jobs access environment secrets
- restrict approvers
- place signing secrets on the environment instead of plain repository secrets

## Versioning Rules

The workflows enforce exact version alignment:

- package version: `3.5.16`
- release tag: `v3.5.16`

The tag must always be `v<package.json version>`.

## Normal Release Flow

1. Merge the approved change to `app-interviewgpt/main`.
2. The private workflow bumps the patch version and pushes the matching tag.
3. The private workflow dispatches this repository with the exact tagged source SHA.
4. The public workflow validates, signs, and publishes the artifacts.

## Security Rule

Do not commit source code, personal access tokens, or signing credentials to `interviewgpt-desktop`.
