/**
 * Gera ilustrações "constelação" em SVG para cada signo, sem depender
 * de nenhuma imagem externa. Cada signo tem um layout de pontos
 * determinístico (mesma seed sempre gera o mesmo desenho).
 *
 * O glifo do signo (♈, ♉, ...) usa o caractere Unicode real (o desenho
 * padrão da astrologia, definido pela fonte do sistema) em vez de um
 * traço desenhado à mão — assim o símbolo fica sempre correto.
 * A cor/estilo "emoji colorido" que alguns sistemas aplicam a esses
 * caracteres é neutralizada via CSS (font-variant-emoji + fonte de símbolo),
 * ver .sign-glyph e .zodiac-symbol em css/styles.css.
 */

function seededRandom(seedStr) {
  let seed = 0;
  for (let i = 0; i < seedStr.length; i++) {
    seed = (seed * 31 + seedStr.charCodeAt(i)) >>> 0;
  }
  return function next() {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
}

/**
 * Retorna markup SVG (string) de uma ilustração de constelação para o signo.
 * size: tamanho em px do viewBox quadrado.
 */
function renderConstellationSVG(signId, size = 200) {
  const rand = seededRandom(signId);
  const pointCount = 7 + Math.floor(rand() * 3); // 7-9 pontos
  const points = [];
  const center = size / 2;
  const radius = size * 0.36;

  for (let i = 0; i < pointCount; i++) {
    const angle = (i / pointCount) * Math.PI * 2 + rand() * 0.6;
    const r = radius * (0.55 + rand() * 0.45);
    points.push({
      x: center + Math.cos(angle) * r,
      y: center + Math.sin(angle) * r,
      radius: 1.6 + rand() * 2.2,
    });
  }

  // Conecta pontos em sequência (mais alguns cruzamentos) para lembrar constelação.
  const lines = [];
  for (let i = 0; i < points.length; i++) {
    const next = points[(i + 1) % points.length];
    lines.push([points[i], next]);
  }
  const extraLinks = Math.floor(rand() * 2) + 1;
  for (let i = 0; i < extraLinks; i++) {
    const a = points[Math.floor(rand() * points.length)];
    const b = points[Math.floor(rand() * points.length)];
    if (a !== b) lines.push([a, b]);
  }

  const linesMarkup = lines
    .map(
      ([a, b]) =>
        `<line x1="${a.x.toFixed(1)}" y1="${a.y.toFixed(1)}" x2="${b.x.toFixed(1)}" y2="${b.y.toFixed(1)}" class="constellation-line" />`
    )
    .join("");

  const pointsMarkup = points
    .map(
      (p) =>
        `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="${p.radius.toFixed(1)}" class="constellation-dot" />`
    )
    .join("");

  const sign = ZODIAC_SIGNS[signId];

  return `
    <svg viewBox="0 0 ${size} ${size}" class="sign-icon-svg" role="img" aria-label="Ilustração do signo ${sign.name}">
      ${linesMarkup}
      ${pointsMarkup}
      <text x="${center}" y="${center}" text-anchor="middle" dominant-baseline="central" class="sign-glyph">${sign.symbol}</text>
    </svg>
  `;
}
