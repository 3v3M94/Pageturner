// =============================================
//  PageTurner — commande.js
//  Gestion du panier et validation commande
// =============================================

const REGEX_CMD = {
  nom:     /^[A-Za-zÀ-ÖØ-öø-ÿ' -]{2,}$/,
  email:   /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/,
  tel:     /^(0)(5|6|7)[0-9]{8}$/,
  adresse: /^.{10,}$/,
  cp:      /^[0-9]{5}$/
};

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

function setField(inputId, errorId, valid) {
  const el = document.getElementById(inputId);
  const er = document.getElementById(errorId);
  if (!el) return valid;
  if (valid) { el.classList.remove('error'); el.classList.add('valid'); er?.classList.remove('show'); }
  else       { el.classList.add('error'); el.classList.remove('valid'); er?.classList.add('show'); }
  return valid;
}

// Pre-fill form if user is logged in
function prefillFromSession() {
  const session = getSession();
  if (!session) return;
  const el = id => document.getElementById(id);
  if (el('d-prenom')) el('d-prenom').value = session.prenom || '';
  if (el('d-nom'))    el('d-nom').value    = session.nom    || '';
  if (el('d-email'))  el('d-email').value  = session.email  || '';
}

function renderCart() {
  const list    = document.getElementById('cart-items-list');
  const summary = document.getElementById('order-summary');
  const total   = document.getElementById('total-price');
  const cart    = getCart();

  if (cart.length === 0) {
    list.innerHTML = `
      <div class="cart-empty">
        <p>🛒</p>
        <p style="font-size:1.1rem; font-weight:600; color:var(--espresso); margin-bottom:8px;">Votre panier est vide</p>
        <p>Explorez notre catalogue pour trouver vos livres préférés.</p>
        <a href="produits.html" class="btn-primary" style="display:inline-flex; margin-top:20px;">Voir le catalogue →</a>
      </div>
    `;
    summary.innerHTML = '<p style="color:var(--muted); font-size:0.88rem; text-align:center; padding:12px 0;">Aucun article</p>';
    total.textContent = '0 DA';

    // Masquer le formulaire
    const deliveryCard = document.getElementById('delivery-card');
    const summaryBtn   = document.querySelector('#summary-card .btn-form');
    if (deliveryCard) deliveryCard.style.display = 'none';
    if (summaryBtn)   summaryBtn.style.display   = 'none';
    return;
  }

  // Render items
  list.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img class="cart-item-img" src="${getProductImage(item)}" alt="${item.nom}" />
      <div class="cart-item-info">
        <div class="cart-item-name">${item.nom}</div>
        <div class="cart-item-price">${formatPrice(item.prix)}</div>
        <div class="cart-item-qty">
          <button class="qty-btn" onclick="changeQty(${item.id}, -1)">−</button>
          <span class="qty-num">${item.quantite}</span>
          <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
        </div>
      </div>
      <button class="remove-btn" onclick="deleteItem(${item.id})" title="Supprimer">✕</button>
    </div>
  `).join('');

  // Render summary
  summary.innerHTML = cart.map(item => `
    <div class="summary-row">
      <span>${item.nom} × ${item.quantite}</span>
      <span>${formatPrice(item.prix * item.quantite)}</span>
    </div>
  `).join('');

  const totalVal = cart.reduce((s, i) => s + i.prix * i.quantite, 0);
  total.textContent = formatPrice(totalVal);
}

function changeQty(id, delta) {
  const cart = getCart();
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.quantite += delta;
  if (item.quantite <= 0) {
    saveCart(cart.filter(i => i.id !== id));
  } else {
    saveCart(cart);
  }
  renderCart();
}

function deleteItem(id) {
  removeFromCart(id);
  renderCart();
  showToast('Article retiré du panier.');
}

function validateDelivery() {
  const tel = document.getElementById('d-tel')?.value.replace(/\s/g, '') || '';
  let v = true;
  v = setField('d-prenom', 'err-d-prenom', REGEX_CMD.nom.test(document.getElementById('d-prenom')?.value.trim() || '')) && v;
  v = setField('d-nom',    'err-d-nom',    REGEX_CMD.nom.test(document.getElementById('d-nom')?.value.trim() || ''))    && v;
  v = setField('d-email',  'err-d-email',  REGEX_CMD.email.test(document.getElementById('d-email')?.value.trim() || '')) && v;
  v = setField('d-tel',    'err-d-tel',    REGEX_CMD.tel.test(tel))                                                       && v;
  v = setField('d-adresse','err-d-adresse',REGEX_CMD.adresse.test(document.getElementById('d-adresse')?.value.trim() || '')) && v;
  v = setField('d-wilaya', 'err-d-wilaya', REGEX_CMD.nom.test(document.getElementById('d-wilaya')?.value.trim() || ''))  && v;
  v = setField('d-cp',     'err-d-cp',     REGEX_CMD.cp.test(document.getElementById('d-cp')?.value.trim() || ''))       && v;
  return v;
}

function handleCommande() {
  const cart = getCart();
  if (cart.length === 0) {
    showToast('Votre panier est vide !');
    return;
  }
  if (!validateDelivery()) {
    document.getElementById('delivery-error').textContent = '✗ Veuillez corriger les erreurs dans le formulaire.';
    document.getElementById('delivery-error').classList.add('show');
    document.getElementById('delivery-card').scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }

  // Vider le panier et confirmer
  saveCart([]);
  document.getElementById('commande-content').style.display = 'none';
  document.getElementById('order-success').style.display    = 'block';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.addEventListener('DOMContentLoaded', () => {
  renderCart();
  prefillFromSession();
});
