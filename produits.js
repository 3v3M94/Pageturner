// =============================================
//  PageTurner — produits.js
//  Catalogue : filtrage + modal détail/achat
// =============================================

let currentCat = 'tous';
let searchTerm = '';

function toggleMenu() {
  document.getElementById('nav-links').classList.toggle('open');
}

function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2800);
}

function formatPrice(p) {
  return p.toLocaleString('fr-DZ') + ' DA';
}

// ── Rendu de la grille ──────────────────────

function renderProducts() {
  const grid    = document.getElementById('products-grid');
  const countEl = document.getElementById('results-count');

  let filtered = PRODUCTS;

  if (currentCat !== 'tous') {
    filtered = filtered.filter(p => p.categorie === currentCat);
  }

  if (searchTerm.trim().length > 0) {
    const q = searchTerm.toLowerCase();
    filtered = filtered.filter(p =>
      p.nom.toLowerCase().includes(q) ||
      (p.auteur && p.auteur.toLowerCase().includes(q)) ||
      p.description.toLowerCase().includes(q)
    );
  }

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div style="grid-column:1/-1;text-align:center;padding:64px 0;color:var(--muted);">
        <p style="font-size:3rem;margin-bottom:16px;">🔍</p>
        <p style="font-size:1.1rem;font-weight:600;color:var(--espresso);">Aucun résultat trouvé</p>
        <p style="margin-top:8px;">Essayez une autre catégorie ou un autre mot-clé.</p>
      </div>`;
    countEl.textContent = '';
    return;
  }

  grid.innerHTML = filtered.map(p => {
    const imgSrc = getProductImage(p);
    return `
      <article class="product-card" onclick="openModal(${p.id})" style="cursor:pointer;">
        <div class="product-img-wrap">
          <img src="${imgSrc}" alt="${p.nom}" loading="lazy" />
        </div>
        <div class="product-body">
          <div class="product-cat">${p.categorie.charAt(0).toUpperCase() + p.categorie.slice(1)}</div>
          <div class="product-name">${p.nom}</div>
          ${p.auteur ? `<div class="product-author">par ${p.auteur}</div>` : ''}
          <div class="product-price">${formatPrice(p.prix)} <span>DZD</span></div>
          <button class="btn-add-cart" onclick="event.stopPropagation(); quickAdd(${p.id})">
            🛒 Ajouter au panier
          </button>
        </div>
      </article>`;
  }).join('');

  countEl.textContent =
    filtered.length + ' article' + (filtered.length > 1 ? 's' : '') +
    ' trouvé' + (filtered.length > 1 ? 's' : '');
}

// ── Filtrage ────────────────────────────────

function filterProducts(cat, btn) {
  currentCat = cat;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderProducts();
}

function handleSearch() {
  searchTerm = document.getElementById('search-input').value;
  renderProducts();
}

// ── Ajout rapide sans modal ─────────────────

function quickAdd(id) {
  const p = PRODUCTS.find(x => x.id === id);
  if (!p) return;
  addToCart(p);
  showToast('✓ "' + p.nom + '" ajouté au panier');
}

// ── Modal détail produit ────────────────────

function openModal(id) {
  const p = PRODUCTS.find(x => x.id === id);
  if (!p) return;

  const imgSrc = getProductImage(p);
  const modal  = document.getElementById('product-modal');
  const body   = document.getElementById('modal-body');

  body.innerHTML = `
    <div class="modal-inner">
      <div class="modal-img-col">
        <img src="${imgSrc}" alt="${p.nom}" class="modal-cover" />
        <div class="modal-stock ${p.stock < 5 ? 'low' : ''}">
          ${p.stock < 5 ? '⚠ Plus que ' + p.stock + ' en stock !' : '✓ En stock (' + p.stock + ' disponibles)'}
        </div>
      </div>
      <div class="modal-info-col">
        <div class="modal-cat">${p.categorie.toUpperCase()}</div>
        <h2 class="modal-title">${p.nom}</h2>
        ${p.auteur ? `<p class="modal-author">par <strong>${p.auteur}</strong></p>` : ''}
        <p class="modal-desc">${p.description}</p>
        <div class="modal-price">${formatPrice(p.prix)}</div>

        <div class="modal-qty-row">
          <label>Quantité :</label>
          <div class="modal-qty">
            <button onclick="changeModalQty(-1)">−</button>
            <span id="modal-qty-val">1</span>
            <button onclick="changeModalQty(1)">+</button>
          </div>
        </div>

        <button class="btn-modal-buy" onclick="addFromModal(${p.id})">
          🛒 Ajouter au panier
        </button>
        <a href="commande.html" class="btn-modal-order" onclick="addFromModal(${p.id})">
          ⚡ Acheter maintenant
        </a>
      </div>
    </div>`;

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('product-modal').classList.remove('open');
  document.body.style.overflow = '';
}

let modalQty = 1;
function changeModalQty(delta) {
  modalQty = Math.max(1, modalQty + delta);
  document.getElementById('modal-qty-val').textContent = modalQty;
}

function addFromModal(id) {
  const p = PRODUCTS.find(x => x.id === id);
  if (!p) return;
  for (let i = 0; i < modalQty; i++) addToCart(p);
  showToast('✓ ' + modalQty + '× "' + p.nom + '" ajouté' + (modalQty > 1 ? 's' : '') + ' au panier');
  closeModal();
  modalQty = 1;
}

// Fermer en cliquant sur l'overlay
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('product-modal').addEventListener('click', function(e) {
    if (e.target === this) closeModal();
  });

  // URL param ?cat=
  const urlCat = new URLSearchParams(window.location.search).get('cat') || 'tous';
  currentCat = urlCat;
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.cat === urlCat);
  });

  renderProducts();
});
