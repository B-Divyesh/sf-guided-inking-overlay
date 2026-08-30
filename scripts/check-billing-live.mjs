import assert from 'node:assert/strict';

const apiBase = process.env.BILLING_API_BASE || 'https://api.sociobot.in';
const productOrigin = process.env.PRODUCT_ORIGIN || 'https://guided-inking-overlay.sociobot.in';
const product = 'guided-inking-overlay';
const invalidLicense = `qa-invalid-${Date.now()}-${Math.random().toString(36).slice(2)}`;
const verifyUrl = `${apiBase}/api/v1/products/${product}/verify?license=${encodeURIComponent(invalidLicense)}`;
const checkoutUrl = `${apiBase}/api/v1/products/${product}/checkout`;

function request(url, options = {}) {
  return fetch(url, {
    redirect: 'manual',
    headers: { Accept: 'application/json', Origin: productOrigin },
    ...options,
  });
}

function assertBrowserAccess(response) {
  assert.equal(response.headers.get('access-control-allow-origin'), productOrigin, 'billing API must allow the production app origin');
}

const invalid = await request(verifyUrl);
assert.equal(invalid.status, 200, `invalid license verification must return 200, got ${invalid.status}`);
assertBrowserAccess(invalid);
assert.match(invalid.headers.get('cache-control') || '', /no-store/i, 'license verdict must not be cacheable');
assert.deepEqual(await invalid.json(), { valid: false, reason: 'invalid', expires_at: null });

const checkout = await request(checkoutUrl, { method: 'HEAD' });
assert.ok(checkout.status >= 300 && checkout.status < 400, `checkout must redirect, got ${checkout.status}`);
assert.match(checkout.headers.get('location') || '', /^https:\/\/checkout\.dodopayments\.com\//, 'checkout must redirect to the hosted Dodo checkout');

let rateLimitEvidence = '';
if (process.argv.includes('--rate-limit')) {
  const responses = [];
  for (let count = 0; count < 35; count += 1) responses.push(await request(verifyUrl));
  const limited = responses.find((response) => response.status === 429);
  assert.ok(limited, 'a 35-request single-client probe must reach the license API allowance');
  const retryAfter = limited.headers.get('retry-after') || '';
  assert.match(retryAfter, /^\d+$/, 'the rate-limited response must include Retry-After');
  rateLimitEvidence = `; observed HTTP 429 with Retry-After: ${retryAfter}s`;
}

console.log(`Billing live check passed: invalid verdict and checkout redirect at ${apiBase}${rateLimitEvidence}.`);
