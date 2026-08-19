export async function onRequestGet({ request }) {
  const url = new URL(request.url);
  const raw = url.searchParams.get('number') || '';
  const q = String(raw).replace(/[^0-9]/g, '');

  const isCnic = (n) => /^\d{13}$/.test(n);
  const isMobile = (n) => /^03\d{9}$/.test(n);
  const normalize = (r) => {
    let num = String(r).replace(/[^0-9]/g, '');
    if (num.startsWith('92')) num = '0' + num.slice(2);
    else if (!num.startsWith('0')) num = '0' + num;
    return num;
  };

  const num = isCnic(q) ? q : normalize(q);
  const type = isCnic(num) ? 'cnic' : isMobile(num) ? 'mobile' : 'invalid';

  if (type === 'invalid') {
    return json(400, { error: 'Invalid input. 11-digit mobile (03001234567) ya 13-digit CNIC (1710134515393) dalo.', number: num });
  }

  try {
    const res = await fetch(
      'https://simsowner.net.pk/ajax-handler.php?number=' + encodeURIComponent(num),
      { headers: { 'User-Agent': 'Mozilla/5.0 (SIM-Lookup)' } }
    );
    const text = await res.text();
    if (!text.trim()) return json(502, { error: 'SIM lookup server se data nahi mila. Baad me try karo.', number: num });
    const data = JSON.parse(text);
    if (!Array.isArray(data) || !data.length) return json(404, { error: `"${num}" ka koi record nahi mila.`, number: num });
    return json(200, { number: num, type, records: data });
  } catch (e) {
    return json(502, { error: 'SIM lookup server se data nahi mila. Baad me try karo.', number: num });
  }
}

function json(code, obj) {
  return new Response(JSON.stringify(obj), {
    status: code,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-store',
    },
  });
}