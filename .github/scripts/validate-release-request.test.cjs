const { test } = require('node:test');
const assert = require('node:assert/strict');
const { validateReleaseRequest } = require('./validate-release-request.cjs');

const valid = {
  REQUESTED_SOURCE_OWNER: 'rahul-devbox',
  GITHUB_REPOSITORY_OWNER: 'rahul-devbox',
  REQUESTED_SOURCE_REPO: 'app-interviewgpt',
  REQUESTED_SOURCE_REF: 'main',
  REQUESTED_SOURCE_SHA: '6e8930b71b2a1ba179582bcbd7bfd0b441f9c124',
  REQUESTED_VERSION: '3.6.19',
  REQUESTED_RELEASE_TAG: 'v3.6.19',
};

test('accepts current releases and explicit owner configuration', () => {
  validateReleaseRequest(valid);
  validateReleaseRequest({ ...valid, EXPECTED_SOURCE_REPO_OWNER: 'RAHUL-DEVBOX' });
  validateReleaseRequest({ ...valid, REQUESTED_VERSION: '3.6.20-beta.1', REQUESTED_RELEASE_TAG: 'v3.6.20-beta.1' });
});

for (const [name, change] of [
  ['untrusted owner', { REQUESTED_SOURCE_OWNER: 'another-owner' }],
  ['missing owner policy', { GITHUB_REPOSITORY_OWNER: '' }],
  ['wrong repo', { REQUESTED_SOURCE_REPO: 'other-repo' }],
  ['floating SHA', { REQUESTED_SOURCE_SHA: 'main' }],
  ['tag mismatch', { REQUESTED_RELEASE_TAG: 'v3.6.18' }],
  ['shell substitution in version', { REQUESTED_VERSION: '3.6.19$(id)' }],
  ['quote injection', { REQUESTED_VERSION: '3.6.19"; echo injected; #' }],
  ['newline in metadata', { REQUESTED_SOURCE_REF: 'main\ninjected' }],
]) {
  test(`rejects ${name} before source code can run`, () => {
    assert.throws(() => validateReleaseRequest({ ...valid, ...change }));
  });
}
