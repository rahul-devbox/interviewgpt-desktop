const assert = require('node:assert/strict');

/** Validate before checking out or executing any private source code. */
function validateReleaseRequest(env) {
  const owner = env.REQUESTED_SOURCE_OWNER || '';
  const expectedOwner = env.EXPECTED_SOURCE_REPO_OWNER || env.GITHUB_REPOSITORY_OWNER || '';
  assert(expectedOwner, 'An expected source owner is required.');
  assert(/^[a-zA-Z0-9-]+$/.test(owner), 'Invalid source owner.');
  assert.equal(owner.toLowerCase(), expectedOwner.toLowerCase(), 'Source owner is not allowed.');
  assert.equal(env.REQUESTED_SOURCE_REPO, 'app-interviewgpt', 'Source repository is not allowed.');
  assert(/^[a-f0-9]{40}$/i.test(env.REQUESTED_SOURCE_SHA || ''), 'An exact source commit SHA is required.');
  assert(/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-[a-zA-Z0-9.-]+)?(?:\+[a-zA-Z0-9.-]+)?$/.test(env.REQUESTED_VERSION || ''), 'Invalid release version.');
  assert.equal(env.REQUESTED_RELEASE_TAG, `v${env.REQUESTED_VERSION}`, 'Release tag must match version.');
  assert(typeof env.REQUESTED_SOURCE_REF === 'string' && env.REQUESTED_SOURCE_REF.length > 0 && env.REQUESTED_SOURCE_REF.length <= 1024 && !/[\x00-\x1f\x7f]/.test(env.REQUESTED_SOURCE_REF), 'Invalid source ref metadata.');
}

if (require.main === module) {
  try {
    validateReleaseRequest(process.env);
    console.log('Release request validated before source checkout.');
  } catch (error) {
    // Do not echo untrusted input into workflow commands or logs.
    console.error(error.message.split('\n')[0]);
    process.exitCode = 1;
  }
}

module.exports = { validateReleaseRequest };
