// =============================================
//  PageTurner — main.js  (page d'accueil)
// =============================================

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

function handleAddToCart(id) {
  const p = PRODUCTS.find(x => x.id === id);
  if (!p) return;
  addToCart(p);
  showToast('✓ "' + p.nom + '" ajouté au panier');
}

function loadFeatured() {
  const grid = document.getElementById('featured-products');
  if (!grid) return;

  // Afficher les 8 premiers produits
  const featured = PRODUCTS.slice(0, 8);

  grid.innerHTML = featured.map(p => {
    const imgSrc = getProductImage(p);
    return `
      <article class="product-card">
        <a href="produits.html" style="text-decoration:none;color:inherit;">
          <div class="product-img-wrap">
            <img src="${imgSrc}" alt="${p.nom}" loading="lazy" />
          </div>
        </a>
        <div class="product-body">
          <div class="product-cat">${p.categorie.charAt(0).toUpperCase() + p.categorie.slice(1)}</div>
          <div class="product-name">${p.nom}</div>
          ${p.auteur ? `<div class="product-author">par ${p.auteur}</div>` : ''}
          <div class="product-price">${formatPrice(p.prix)} <span>DZD</span></div>
          <button class="btn-add-cart" onclick="handleAddToCart(${p.id})">
            🛒 Ajouter au panier
          </button>
        </div>
      </article>`;
  }).join('');
}

document.addEventListener('DOMContentLoaded', loadFeatured);
