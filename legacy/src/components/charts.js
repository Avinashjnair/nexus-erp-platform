/* ═══════════════════════════
   NEXUS ERP — Chart Helpers
═══════════════════════════ */

function renderSparkline(containerId, values, color = 'var(--accent)') {
  const el = document.getElementById(containerId);
  if (!el) return;
  const max = Math.max(...values);
  el.innerHTML = values.map(v => {
    const h = Math.max(4, Math.round((v / max) * 36));
    return `<div class="spark-bar" style="height:${h}px;background:${color};opacity:${0.4 + (v/max)*0.6}"></div>`;
  }).join('');
}

function renderDonut(containerId, segments) {
  const el = document.getElementById(containerId);
  if (!el) return;
  const total = segments.reduce((s, x) => s + x.value, 0);
  let offset = 0;
  const r = 30, cx = 40, cy = 40, circ = 2 * Math.PI * r;
  const slices = segments.map(seg => {
    const len = (seg.value / total) * circ;
    const gap = 2;
    const d = `stroke-dasharray:${len - gap} ${circ - len + gap};stroke-dashoffset:${-offset}`;
    offset += len;
    return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${seg.color}" stroke-width="8" style="${d}" stroke-linecap="round" transform="rotate(-90 ${cx} ${cy})"/>`;
  }).join('');
  el.innerHTML = `<svg viewBox="0 0 80 80" class="mini-donut">${slices}<text x="40" y="44" text-anchor="middle" style="font-family:var(--font-head);font-size:12px;font-weight:700;fill:var(--text)">${total}</text></svg>`;
}

function renderProgressRing(containerId, pct, color='var(--accent)') {
  const el = document.getElementById(containerId);
  if (!el) return;
  const r = 28, circ = 2 * Math.PI * r;
  const fill = (pct / 100) * circ;
  el.innerHTML = `<svg viewBox="0 0 64 64" width="64" height="64">
    <circle cx="32" cy="32" r="${r}" fill="none" stroke="var(--bg4)" stroke-width="5"/>
    <circle cx="32" cy="32" r="${r}" fill="none" stroke="${color}" stroke-width="5"
      stroke-dasharray="${fill} ${circ}" stroke-linecap="round"
      transform="rotate(-90 32 32)" style="transition:stroke-dasharray 1s ease"/>
    <text x="32" y="36" text-anchor="middle" style="font-family:var(--font-head);font-size:11px;font-weight:700;fill:var(--text)">${pct}%</text>
  </svg>`;
}

function renderBarChart(containerId, labels, values, color = 'var(--accent)') {
  const el = document.getElementById(containerId);
  if (!el) return;
  const max = Math.max(...values, 1);
  const h = 120;
  const bw = Math.floor(280 / labels.length) - 6;
  const bars = labels.map((l, i) => {
    const bh = Math.max(4, Math.round((values[i] / max) * h));
    const x = i * (bw + 6) + 4;
    return `
      <rect x="${x}" y="${h - bh + 20}" width="${bw}" height="${bh}" fill="${color}" rx="3" opacity="0.8"/>
      <text x="${x + bw/2}" y="${h + 36}" text-anchor="middle" style="font-size:9px;fill:var(--text3);font-family:var(--font-body)">${l}</text>
      <text x="${x + bw/2}" y="${h - bh + 14}" text-anchor="middle" style="font-size:9px;fill:var(--text2);font-family:var(--font-body)">${values[i]}</text>
    `;
  }).join('');
  el.innerHTML = `<svg viewBox="0 0 ${labels.length * (bw + 6) + 8} ${h + 44}" width="100%" style="overflow:visible">${bars}</svg>`;
}
