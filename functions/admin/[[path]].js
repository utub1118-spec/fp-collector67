// functions/admin/[[path]].js — панель: логин + список хитов + детали + поиск
const COOKIE_NAME = "sess";
const SESSION_TTL = 60 * 60 * 24 * 7;

function b64d(s) { try { return decodeURIComponent(escape(atob(s))); } catch { return ""; } }
function b64e(s) { return btoa(unescape(encodeURIComponent(s))); }

async function hmac(secret, data) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(data));
  return [...new Uint8Array(sig)].map(b => b.toString(16).padStart(2, "0")).join("");
}

function parseCookies(req) {
  const h = req.headers.get("Cookie") || ""; const out = {};
  for (const part of h.split(";")) { const [k, ...v] = part.trim().split("="); if (k) out[k] = v.join("="); }
  return out;
}

async function makeSession(env) {
  const exp = Math.floor(Date.now() / 1000) + SESSION_TTL;
  const payload = `exp=${exp}`;
  const sig = await hmac(env.ADMIN_PASS, payload);
  return b64e(`${payload}|${sig}`);
}

async function checkSession(req, env) {
  const c = parseCookies(req)[COOKIE_NAME]; if (!c) return false;
  const decoded = b64d(c); const [payload, sig] = decoded.split("|");
  if (!payload || !sig) return false;
  const expect = await hmac(env.ADMIN_PASS, payload);
  if (sig !== expect) return false;
  const m = payload.match(/exp=(\d+)/);
  if (!m || parseInt(m[1]) < Math.floor(Date.now() / 1000)) return false;
  return true;
}

function loginPage(err) {
  return `<!DOCTYPE html><html lang="ru"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><title>Вход</title>
<style>body{background:#0a0e17;color:#fff;font-family:-apple-system,sans-serif;
display:flex;align-items:center;justify-content:center;height:100vh;margin:0}
.box{width:100%;max-width:340px;padding:28px;background:#111827;border-radius:14px}
input{width:100%;padding:12px;margin-bottom:10px;border:1px solid #374151;border-radius:8px;
background:#0a0e17;color:#fff;box-sizing:border-box}
button{width:100%;padding:12px;background:#2563eb;color:#fff;border:0;border-radius:8px;font-weight:600}
.err{color:#ef4444;font-size:14px;margin-bottom:10px}</style></head>
<body><div class="box"><h2>Панель</h2>
${err ? '<div class="err">Неверный пароль</div>' : ''}
<form method="POST" action="?login=1">
<input name="pass" type="password" placeholder="Пароль" autofocus required>
<button>Войти</button></form></div></body></html>`;
}

function panelPage(hits, q) {
  const rows = hits.map(h => {
    const f = h.fingerprint ? JSON.parse(h.fingerprint) : {};
    const model = (f.ua || "").match(/\(([^)]+)\)/)?.[1] || "";
    return `<tr>
      <td>${h.ts}</td>
      <td>${h.ip || ""}<br><small>${h.city || ""}, ${h.country || ""}</small></td>
      <td>${h.org || ""}</td>
      <td>${model}<br><small>${(f.tz||"")} · ${(f.screen?.w||"")}x${(f.screen?.h||"")}</small></td>
      <td><a href="?view=${h.id}">детали</a></td>
    </tr>`;
  }).join("");
  return `<!DOCTYPE html><html lang="ru"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><title>Панель</title>
<style>body{background:#0a0e17;color:#e5e7eb;font-family:-apple-system,sans-serif;margin:0;padding:16px}
h1{font-size:18px;margin:0 0 12px}
table{width:100%;border-collapse:collapse;font-size:13px}
th,td{text-align:left;padding:8px;border-bottom:1px solid #1f2937;vertical-align:top}
th{color:#9ca3af;font-weight:500}a{color:#60a5fa}small{color:#6b7280}
input[type=text]{padding:8px;background:#111827;border:1px solid #374151;border-radius:6px;color:#fff;width:180px}
</style></head><body><h1>Сбор — ${hits.length}</h1>
<form method="GET"><input type="text" name="q" value="${q||""}" placeholder="IP / город">
<button>Искать</button></form>
<table><thead><tr><th>Время</th><th>IP / Гео</th><th>Провайдер</th><th>Устройство</th><th></th></tr></thead>
<tbody>${rows || '<tr><td colspan="5">пусто</td></tr>'}</tbody></table>
</body></html>`;
}

function detailPage(hit) {
  const f = JSON.parse(hit.fingerprint || "{}");
  const pretty = JSON.stringify(f, null, 2);
  const raw = JSON.stringify(hit, null, 2);
  return `<!DOCTYPE html><html lang="ru"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><title>Детали</title>
<style>body{background:#0a0e17;color:#e5e7eb;font-family:-apple-system,sans-serif;padding:16px}
a{color:#60a5fa}pre{background:#111827;padding:12px;border-radius:8px;overflow:auto;font-size:12px}
h2{font-size:16px}</style></head><body><a href="?">← назад</a>
<h2>ID ${hit.id} — ${hit.ts}</h2>
<h3>Fingerprint</h3><pre>${pretty.replace(/</g,"&lt;")}</pre>
<h3>Сырые данные</h3><pre>${raw.replace(/</g,"&lt;")}</pre>
</body></html>`;
}

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  if (request.method === "POST" && url.searchParams.get("login") === "1") {
    const fd = await request.formData();
    if (fd.get("pass") === env.ADMIN_PASS) {
      const sess = await makeSession(env);
      return new Response("", {
        status: 302,
        headers: {
          "Location": url.pathname,
          "Set-Cookie": `${COOKIE_NAME}=${sess}; Path=/admin; HttpOnly; Secure; SameSite=Strict; Max-Age=${SESSION_TTL}`
        }
      });
    }
    return new Response(loginPage(true), { headers: { "Content-Type": "text/html;charset=utf-8" } });
  }

  if (!(await checkSession(request, env))) {
    return new Response(loginPage(false), { headers: { "Content-Type": "text/html;charset=utf-8" } });
  }

  const view = url.searchParams.get("view");
  if (view) {
    const row = await env.DB.prepare("SELECT * FROM hits WHERE id=?").bind(view).first();
    if (row) {
      return new Response(detailPage(row), { headers: { "Content-Type": "text/html;charset=utf-8" } });
    }
  }

  const q = url.searchParams.get("q") || "";
  let rows;
  if (q) {
    rows = await env.DB.prepare(
      "SELECT * FROM hits WHERE ip LIKE ? OR ua LIKE ? OR city LIKE ? ORDER BY ts DESC LIMIT 500"
    ).bind(`%${q}%`, `%${q}%`, `%${q}%`).all();
  } else {
    rows = await env.DB.prepare("SELECT * FROM hits ORDER BY ts DESC LIMIT 500").all();
  }

  return new Response(panelPage(rows.results || [], q), {
    headers: { "Content-Type": "text/html;charset=utf-8" }
  });
}
