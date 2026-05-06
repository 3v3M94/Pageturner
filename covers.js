// =============================================
//  PageTurner — covers.js
//  Génération de couvertures SVG embarquées
//  (aucune dépendance réseau)
// =============================================

/**
 * Génère une couverture de livre SVG inline.
 * @param {Object} p - produit avec nom, auteur, coverColor, coverIcon
 * @returns {string} data URI SVG
 */
function buildCover(p) {
  const bg     = (p.coverColor && p.coverColor[0]) || '#2D1B0E';
  const accent = (p.coverColor && p.coverColor[1]) || '#D4A843';
  const icon   = p.coverIcon || '📖';

  // Découper le titre en lignes (max ~16 chars/ligne)
  const words = p.nom.split(' ');
  const lines = [];
  let cur = '';
  for (const w of words) {
    if ((cur + ' ' + w).trim().length > 16 && cur.length > 0) {
      lines.push(cur.trim()); cur = w;
    } else {
      cur = (cur + ' ' + w).trim();
    }
  }
  if (cur) lines.push(cur);

  // Calcul du Y de départ pour centrer le bloc titre
  const lineH  = 30;
  const totalH = lines.length * lineH;
  const startY = 200 - totalH / 2 + 16;

  // Auteur tronqué
  const authorDisplay = p.auteur
    ? (p.auteur.length > 22 ? p.auteur.substring(0, 20) + '…' : p.auteur)
    : '';

  const titleRows = lines.map((l, i) =>
    `<text x="150" y="${startY + i * lineH}" font-family="Georgia,'Times New Roman',serif"
      font-size="20" font-weight="bold" fill="${accent}" text-anchor="middle"
      letter-spacing="0.5">${escXML(l)}</text>`
  ).join('\n    ');

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="420" viewBox="0 0 300 420">
  <defs>
    <linearGradient id="gBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%"   stop-color="${bg}"/>
      <stop offset="100%" stop-color="${darken(bg)}"/>
    </linearGradient>
    <linearGradient id="gSpine" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%"   stop-color="${accent}" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="${accent}" stop-opacity="0"/>
    </linearGradient>
  </defs>

  <!-- Fond -->
  <rect width="300" height="420" fill="url(#gBg)"/>

  <!-- Effet texture lignes diagonales -->
  <g opacity="0.04">
    ${diagonalLines(accent)}
  </g>

  <!-- Tranche gauche (effet livre) -->
  <rect x="0" y="0" width="22" height="420" fill="url(#gSpine)"/>
  <line x1="22" y1="0" x2="22" y2="420" stroke="${accent}" stroke-width="1.5" opacity="0.6"/>

  <!-- Bordure intérieure décorative -->
  <rect x="30" y="16" width="254" height="388" fill="none"
    stroke="${accent}" stroke-width="1" opacity="0.25" rx="1"/>
  <rect x="34" y="20" width="246" height="380" fill="none"
    stroke="${accent}" stroke-width="0.4" opacity="0.15" rx="1"/>

  <!-- Bandeau haut -->
  <rect x="30" y="16" width="254" height="52" fill="${accent}" opacity="0.12"/>
  <line x1="30" y1="68" x2="284" y2="68" stroke="${accent}" stroke-width="0.8" opacity="0.4"/>

  <!-- Catégorie en haut -->
  <text x="157" y="47" font-family="Arial,sans-serif" font-size="9" font-weight="700"
    fill="${accent}" text-anchor="middle" letter-spacing="3" opacity="0.9"
    text-transform="uppercase">${escXML(p.categorie.toUpperCase())}</text>

  <!-- Icône centrale -->
  <text x="157" y="148" font-family="Arial,sans-serif" font-size="48"
    fill="${accent}" text-anchor="middle" opacity="0.22">${icon}</text>

  <!-- Séparateur haut titre -->
  <line x1="60" y1="${startY - 20}" x2="240" y2="${startY - 20}"
    stroke="${accent}" stroke-width="0.8" opacity="0.35"/>

  <!-- Titre -->
  ${titleRows}

  <!-- Séparateur bas titre -->
  <line x1="60" y1="${startY + totalH + 6}" x2="240" y2="${startY + totalH + 6}"
    stroke="${accent}" stroke-width="0.8" opacity="0.35"/>

  <!-- Auteur -->
  ${authorDisplay ? `<text x="157" y="${startY + totalH + 28}" font-family="Georgia,'Times New Roman',serif"
    font-size="12" fill="${accent}" text-anchor="middle" opacity="0.75" font-style="italic"
    letter-spacing="0.5">${escXML(authorDisplay)}</text>` : ''}

  <!-- Bandeau bas -->
  <rect x="30" y="370" width="254" height="34" fill="${accent}" opacity="0.1"/>
  <line x1="30" y1="370" x2="284" y2="370" stroke="${accent}" stroke-width="0.8" opacity="0.4"/>
  <text x="157" y="391" font-family="Arial,sans-serif" font-size="8" font-weight="700"
    fill="${accent}" text-anchor="middle" letter-spacing="4" opacity="0.6">PAGETURNER</text>
</svg>`;

  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

function escXML(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function darken(hex) {
  // Assombrit légèrement la couleur hex pour le dégradé
  try {
    const n = parseInt(hex.replace('#',''), 16);
    const r = Math.max(0, ((n >> 16) & 0xff) - 30);
    const g = Math.max(0, ((n >>  8) & 0xff) - 30);
    const b = Math.max(0, ((n      ) & 0xff) - 30);
    return '#' + [r,g,b].map(x => x.toString(16).padStart(2,'0')).join('');
  } catch(e) { return hex; }
}

function diagonalLines(color) {
  const lines = [];
  for (let i = -10; i < 60; i += 4) {
    lines.push(
      `<line x1="${i * 10}" y1="0" x2="${i * 10 + 420}" y2="420" stroke="${color}" stroke-width="1"/>`
    );
  }
  return lines.join('\n    ');
}

/**
 * Retourne src de l'image : externe si définie, sinon SVG généré.
 */
function getProductImage(p) {
  if (p.image && p.image.trim().length > 0) return p.image;
  return buildCover(p);
}
