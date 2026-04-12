# Releasing InterviewGPT Desktop

This is the operator runbook for publishing a desktop release through the dual-repository workflow.

Current version in this workspace: `3.0.0`

## Release Preconditions

Before cutting a release:

- `app-interviewgpt/package.json` is updated to the intended version
- the release commit is merged to the private default branch
- the private validation workflow is passing
- required repository variables and secrets are configured
- the public release environment is ready for approval

## Version Rule

The release tag must match the package version exactly:

- package version: `3.0.0`
- git tag: `v3.0.0`

If they do not match, the workflow fails by design.

## Standard Release Procedure

1. In `app-interviewgpt`, confirm the target version in `package.json`.
2. Run the local validation path if needed:

```bash
npm run check
npm run dist:win:unsigned
```

3. Push the approved release commit to `main`.
4. Create and push the matching annotated tag:

```bash
git tag -a v3.0.0 -m "InterviewGPT 3.0.0"
git push origin v3.0.0
```

5. Wait for the private workflow to complete validation and dispatch the public workflow.
6. Review and approve the `production-release` environment in `interviewgpt-desktop` if approval is required.
7. Wait for public packaging and release publication to finish.

## Expected Public Release Assets

Each release should contain:

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

## Verification Checklist

After the release is published:

1. Verify the public release tag and title.
2. Verify the asset filenames match the release version.
3. Verify `checksums.sha256`.
4. Verify `release-manifest.json` references the intended private source SHA.
5. Verify updater metadata exists:
   - `latest.yml`
   - `latest-mac.yml`
   - `portable-win.json`
6. Install and launch the Windows installer build.
7. Launch the Windows portable build.
8. Verify the app UI reports the same version as the release.

## Signing Behavior

The public workflow behaves as follows:

- if `WIN_CSC_LINK` exists, Windows artifacts are signed
- if `WIN_CSC_LINK` is missing, Windows artifacts are built unsigned
- if `MAC_CSC_LINK` exists, macOS artifacts are signed
- if `MAC_CSC_LINK` is missing, macOS artifacts are built unsigned
- notarization only happens when Apple credentials are configured

Unsigned builds are valid for internal use and development distribution, but macOS auto-update requires a signed app.

## Rollback Guidance

If a release is invalid:

1. do not retag the same broken version
2. mark the public release as draft or remove it
3. fix the issue in `app-interviewgpt`
4. cut a new version and publish a new tag

## Related Docs

- [../github.md](../github.md)
- [dual-repo-release-process.md](./dual-repo-release-process.md)
