# GitHub Configuration for InterviewGPT Desktop Releases

This document defines the GitHub configuration for publishing the InterviewGPT desktop application, distributed as SysCore, from a private source repository to this public release repository.

- Product website: [https://www.interviewgpt.in](https://www.interviewgpt.in)
- Private source repository: `rahul-devbox/app-interviewgpt`
- Public release repository: `rahul-devbox/interviewgpt-desktop`

## Private source repository

Configure these Actions repository variables in `app-interviewgpt`:

| Variable                       | Value                      |
| ------------------------------ | -------------------------- |
| `PUBLIC_RELEASE_REPO_OWNER`    | `rahul-devbox`             |
| `PUBLIC_RELEASE_REPO_NAME`     | `interviewgpt-desktop`     |
| `PUBLIC_RELEASE_WORKFLOW_FILE` | `release-from-private.yml` |
| `PUBLIC_RELEASE_WORKFLOW_REF`  | `main`                     |

Configure this Actions secret:

- `PUBLIC_REPO_WORKFLOW_TOKEN`

Use a fine-grained token limited to `interviewgpt-desktop` with Actions read/write, Contents read/write, and Metadata read access.

## Public release repository

Configure this Actions repository variable in `interviewgpt-desktop`:

| Variable                     | Value          |
| ---------------------------- | -------------- |
| `EXPECTED_SOURCE_REPO_OWNER` | `rahul-devbox` |

Configure this Actions secret:

- `SOURCE_REPO_READ_TOKEN`

Use a fine-grained token limited to `app-interviewgpt` with Contents read-only and Metadata read access.

## Release signing secrets

Windows production releases require:

- `WIN_CSC_LINK_BASE64`
- `WIN_CSC_KEY_PASSWORD`

`WIN_CSC_LINK_BASE64` contains the base64-encoded PFX. The workflow validates the certificate and verifies that every published Windows executable is signed by that exact certificate.

Optional macOS signing and notarization use:

- `MAC_CSC_LINK`
- `MAC_CSC_KEY_PASSWORD`
- `APPLE_API_KEY`
- `APPLE_API_KEY_ID`
- `APPLE_API_ISSUER`

Place signing credentials in the protected `production-release` environment whenever possible. Repository-level Actions secrets are also available to the current workflow, but environment secrets provide a clearer release boundary.

## Recommended repository settings

- Enable GitHub Actions.
- Set default workflow token permissions to **Read repository contents and packages**.
- Keep pull-request approval permission disabled for workflow tokens.
- Create a `production-release` environment.
- Restrict signing secrets to trusted release operators.
- Add required reviewers to the production environment when manual release approval is desired.
- Keep the repository homepage set to [https://www.interviewgpt.in](https://www.interviewgpt.in).

Individual workflows explicitly request the narrow write permissions needed for version commits, artifact attestations, and release publication.

## Versioning contract

The release workflow requires exact alignment:

```text
package version: <version>
release tag:     v<version>
```

The private automation bumps the patch version, pushes the matching tag, and dispatches the public workflow with the exact tagged source SHA.

## Normal release flow

1. Merge or push an approved change to `app-interviewgpt/main`.
2. The private workflow creates the next patch version and matching tag.
3. The private workflow dispatches `release-from-private.yml` in this repository.
4. The public workflow validates the requested version, repository allowlist, dependency pins, source quality, and release metadata.
5. Windows and macOS jobs build and upload platform artifacts.
6. The publish job generates checksums, an SBOM, a release manifest, artifact attestations, and the public GitHub release.
7. Users can download from [InterviewGPT](https://www.interviewgpt.in/download) or [GitHub Releases](https://github.com/rahul-devbox/interviewgpt-desktop/releases).

## Security rules

Never commit source code, personal access tokens, signing certificates, backend credentials, user data, resumes, or interview transcripts to `interviewgpt-desktop`.

Review secret access, token expiration, environment protection, and successful release attestations regularly.
