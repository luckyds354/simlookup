const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3001;
const ROOT = __dirname;
const PUBLIC = path.join(ROOT, 'public');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
};

function fetchSim(number) {
  return new Promise((resolve) => {
    const url = `https://simsowner.net.pk/ajax-handler.php?number=${encodeURIComponent(number)}`;
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 15000);
    fetch(url, { signal: ctrl.signal, headers: { 'User-Agent': 'Mozilla/5.0 (SIM-Lookup)' } })
      .then((res) => res.text())
      .then((data) => resolve({ code: 0, data: (data || '').trim() }))
      .catch(() => resolve({ code: 1, data: '' }))
      .finally(() => clearTimeout(timer));
  });
}

function normalizeNumber(raw) {
  let num = String(raw).replace(/[^0-9]/g, '');
  if (num.startsWith('92')) num = '0' + num.slice(2);
  else if (!num.startsWith('0')) num = '0' + num;
  return num;
}

function isMobile(n) { return /^03\d{9}$/.test(n); }
function isCnic(n) { return /^\d{13}$/.test(n); }

function sendJson(res, code, obj) {
  res.writeHead(code, { 'Content-Type': 'application/json; charset=utf-8', 'Access-Control-Allow-Origin': '*' });
  res.end(JSON.stringify(obj));
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const p = url.pathname;

  if (p === '/api/lookup') {
    const raw = url.searchParams.get('number') || '';
    const q = String(raw).replace(/[^0-9]/g, '');
    const num = isCnic(q) ? q : normalizeNumber(q);
    const type = isCnic(num) ? 'cnic' : isMobile(num) ? 'mobile' : 'invalid';
    if (type === 'invalid') {
      return sendJson(res, 400, { error: 'Invalid input. 11-digit mobile (03001234567) ya 13-digit CNIC (1710134515393) dalo.', number: num });
    }
    const result = await fetchSim(num);
    if (result.code !== 0 || !result.data) {
      return sendJson(res, 502, { error: 'SIM lookup server se data nahi mila. Baad me try karo.', number: num });
    }
    try {
      const data = JSON.parse(result.data);
      if (!Array.isArray(data) || !data.length) {
        return sendJson(res, 404, { error: `"${num}" ka koi record nahi mila.`, number: num });
      }
      return sendJson(res, 200, { number: num, type, records: data });
    } catch (e) {
      return sendJson(res, 502, { error: 'Invalid response from SIM server.', raw: result.data.slice(0, 200) });
    }
  }

  let filePath = path.join(PUBLIC, p === '/' ? 'index.html' : p);
  if (!filePath.startsWith(PUBLIC)) return sendJson(res, 403, { error: 'forbidden' });
  fs.readFile(filePath, (err, data) => {
    if (err) return sendJson(res, 404, { error: 'not found' });
    res.writeHead(200, { 'Content-Type': MIME[path.extname(filePath)] || 'application/octet-stream' });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`SIM Lookup online at http://localhost:${PORT}`);
});