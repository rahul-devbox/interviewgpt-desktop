# Releasing InterviewGPT Desktop

This runbook covers production releases of the InterviewGPT desktop application, distributed as SysCore, through the private-source/public-artifacts workflow.

- Website downloads: [https://www.interviewgpt.in/download](https://www.interviewgpt.in/download)
- Public GitHub releases: [interviewgpt-desktop/releases](https://github.com/rahul-devbox/interviewgpt-desktop/releases)

## Release prerequisites

Before pushing an approved source change:

- `app-interviewgpt/main` is synchronized with the remote branch.
- `npm run check` passes in the private source repository.
- protected dependency versions match the dependency-pin policy.
- required repository variables and access tokens are configured.
- the Windows signing certificate is valid and available to the release workflow.
- the `production-release` environment is configured.
- Apple signing and notarization credentials are configured when a trusted macOS release is required.

## Version rule

The package version and release tag must align exactly:

```text
package version: <version>
git tag:         v<version>
```

The private workflow automatically creates the next patch version and matching tag. Do not manually reuse or move an existing release tag.

## Standard release procedure

1. Run the full private-source validation:

   ```bash
   npm run check
   ```

2. Push the approved source commit to `app-interviewgpt/main`.
3. Confirm the private **Auto Release on Push to Main** workflow:
   - bumps the patch version;
   - pushes the version commit and tag;
   - dispatches the public release workflow with the exact source SHA.
4. Confirm the public **Release From Private Source** workflow completes:
   - source validation;
   - Windows packaging and signature verification;
   - macOS packaging and update-metadata verification;
   - public release publication.
5. Review the published release and confirm that the website download path points users to the current version.

## Expected release assets

Each public release should include:

- `SysCore-Setup-<version>.exe`
- `SysCore-Portable-<version>.exe`
- `SysCore-<version>-mac-universal.dmg`
- `SysCore-<version>-mac-universal.zip`
- Windows and macOS blockmaps
- `latest.yml`
- `latest-mac.yml`
- `portable-win.json`
- `checksums.sha256`
- `sbom.cyclonedx.json`
- `release-manifest.json`

## Post-release verification

1. Verify the release is neither a draft nor a prerelease unless intended.
2. Verify the tag, title, artifact filenames, and package version match.
3. Verify every expected asset was uploaded.
4. Validate `checksums.sha256` against downloaded binaries.
5. Confirm `release-manifest.json` references the expected private source repository and exact source SHA.
6. Confirm updater metadata is present:
   - `latest.yml`
   - `latest-mac.yml`
   - `portable-win.json`
7. Verify GitHub artifact attestations.
8. Confirm the release notes report `Windows packaging mode: signed`.
9. Confirm the reported macOS packaging mode matches the available Apple credentials.
10. Install and launch the Windows installer and portable builds.
11. Test the macOS package on the supported architecture and security configuration.
12. Confirm the app reports the published version.

## Signing behavior

Windows artifacts are Authenticode signed with the configured PFX. The workflow verifies the signer thumbprint on every generated executable before publication.

A self-signed certificate provides artifact identity but does not establish public Windows publisher trust or bypass Smart App Control. Use a publicly trusted code-signing certificate for production distribution. While a self-signed certificate is configured, updater publisher verification remains disabled and the updater relies on the SHA-512 value in GitHub-hosted release metadata.

macOS behavior is credential-dependent:

- releases are signed when `MAC_CSC_LINK` is configured;
- releases are notarized when valid Apple API credentials are configured;
- the workflow can produce unsigned macOS artifacts when signing material is absent;
- every release note records the selected macOS packaging mode.

## Rollback and recovery

If a release is invalid:

1. stop promoting or linking to the affected release;
2. do not retag the same version;
3. mark the public release as a draft or remove it when appropriate;
4. fix the issue in `app-interviewgpt`;
5. publish a new patch version and tag;
6. verify the replacement release before restoring website links.

## Related documentation

- [GitHub configuration](../github.md)
- [Dual-repository release architecture](./dual-repo-release-process.md)
- [Public README](../README.md)
