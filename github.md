# GitHub Setup For Desktop Releases

This document describes the GitHub configuration required for the private-to-public InterviewGPT desktop release flow.

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

## Optional Signing Secrets

These are optional. If they are missing, unsigned builds still proceed.

Windows signing:

- `WIN_CSC_LINK`
- `WIN_CSC_KEY_PASSWORD`

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

- package version: `3.0.0`
- release tag: `v3.0.0`

The tag must always be `v<package.json version>`.

## Normal Release Flow

1. Update `app-interviewgpt/package.json`
2. Merge the approved release commit to `main`
3. Create and push the matching tag:

```bash
git tag -a v3.0.0 -m "InterviewGPT 3.0.0"
git push origin v3.0.0
```

4. The private workflow validates source and dispatches the public workflow.
5. The public workflow checks out the approved private commit SHA.
6. The public workflow builds and publishes release artifacts.

## Security Rule

Do not commit source code, personal access tokens, or signing credentials to `interviewgpt-desktop`.
