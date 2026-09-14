const buckets = new Map();
const WINDOW_MS = 60_000;
const MAX_REQUESTS = 5;

export default async function handler(req, res) {
  if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed' });

  const origin = process.env.QUESTION_ALLOWED_ORIGIN;
  if (origin && req.headers.origin !== origin) return json(res, 403, { error: 'Origin not allowed' });

  const ip = String(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown').split(',')[0].trim();
  const now = Date.now();
  const recent = (buckets.get(ip) || []).filter((time) => now - time < WINDOW_MS);
  if (recent.length >= MAX_REQUESTS) return json(res, 429, { error: 'Too many requests' });
  recent.push(now);
  buckets.set(ip, recent);

  let body;
  try {
    body = typeof req.body === 'object' ? req.body : JSON.parse(req.body || '{}');
  } catch {
    return json(res, 400, { error: 'Invalid JSON' });
  }

  // Honeypot catches simple bots without exposing any anti-spam secret to the browser.
  if (body.website) return json(res, 400, { error: 'Invalid submission' });
  const title = clean(body.title, 200);
  const details = clean(body.details, 5000);
  const repo = clean(body.repo, 200);
  const label = clean(body.label, 200);
  if (!title || !details || !/^[-\w.]+\/[-\w.]+$/.test(repo) || !/^page:[\w.-]+\/[\w./-]+$/.test(label)) {
    return json(res, 400, { error: 'Question, details, repository, and page label are required' });
  }

  const allowedRepos = (process.env.QUESTION_REPOS || '').split(',').map((item) => item.trim()).filter(Boolean);
  if (!allowedRepos.includes(repo)) return json(res, 403, { error: 'Repository is not enabled for questions' });
  const token = process.env.GITHUB_APP_INSTALLATION_TOKEN;
  if (!token) return json(res, 503, { error: 'Question service is not configured' });

  const response = await fetch(`https://api.github.com/repos/${repo}/issues`, {
    method: 'POST',
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'User-Agent': 'MSP-Portal-question-service',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ title: `Question about: ${title}`, body: details, labels: [label] })
  });
  if (!response.ok) return json(res, 502, { error: 'GitHub could not create the question' });
  const issue = await response.json();
  return json(res, 201, { url: issue.html_url });
}

function clean(value, max) {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

function json(res, status, payload) {
  res.status(status).setHeader('Content-Type', 'application/json').end(JSON.stringify(payload));
}
