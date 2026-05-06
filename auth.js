// =============================================
//  PageTurner — auth.js
//  Gestion des utilisateurs et de la session
// =============================================

const USERS_KEY = 'pageturner_users';
const SESSION_KEY = 'pageturner_session';

// Utilisateurs prédéfinis
const DEFAULT_USERS = [
  { nom: 'Admin', prenom: 'Super', email: 'admin@pageturner.dz', motdepasse: 'Admin123!', role: 'admin' },
  { nom: 'Nom', prenom: 'Prenom', email: 'mail@email.com', motdepasse: 'User2026!', role: 'client' }
];

// Initialiser les utilisateurs si absent
function initUsers() {
  if (!localStorage.getItem(USERS_KEY)) {
    localStorage.setItem(USERS_KEY, JSON.stringify(DEFAULT_USERS));
  }
}

function getUsers() {
  return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

// Connexion
function connecter(email, motdepasse) {
  const users = getUsers();
  const user = users.find(u => u.email === email && u.motdepasse === motdepasse);
  if (user) {
    const session = { email: user.email, nom: user.nom, prenom: user.prenom, role: user.role };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return { success: true, user: session };
  }
  return { success: false, message: 'Email ou mot de passe incorrect.' };
}

// Inscription
function inscrire(nom, prenom, email, motdepasse) {
  const users = getUsers();
  if (users.find(u => u.email === email)) {
    return { success: false, message: 'Cet email est déjà utilisé.' };
  }
  const newUser = { nom, prenom, email, motdepasse, role: 'client' };
  users.push(newUser);
  saveUsers(users);
  return { success: true };
}

// Session
function getSession() {
  return JSON.parse(localStorage.getItem(SESSION_KEY));
}

function deconnecter() {
  localStorage.removeItem(SESSION_KEY);
  window.location.href = getBasePath() + 'index.html';
}

function isConnecte() {
  return !!getSession();
}

// Adapter les chemins selon la page courante
function getBasePath() {
  const path = window.location.pathname;
  if (path.includes('/content/')) return '../';
  return '';
}

// Mettre à jour le menu selon la session
function updateNavSession() {
  const session = getSession();
  const navAuth = document.getElementById('nav-auth');
  if (!navAuth) return;
  if (session) {
    navAuth.innerHTML = `
      <span class="nav-user">👤 ${session.prenom}</span>
      <a href="#" onclick="deconnecter()" class="btn-nav-logout">Déconnexion</a>
    `;
  } else {
    navAuth.innerHTML = `
      <a href="${getBasePath()}connexion.html" class="btn-nav">Connexion</a>
      <a href="${getBasePath()}inscription.html" class="btn-nav btn-nav-primary">Inscription</a>
    `;
  }
}

// ---- Panier ----
const CART_KEY = 'pageturner_cart';

function getCart() {
  return JSON.parse(localStorage.getItem(CART_KEY)) || [];
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartCount();
}

function addToCart(product) {
  const cart = getCart();
  const existing = cart.find(i => i.id === product.id);
  if (existing) {
    existing.quantite++;
  } else {
    cart.push({ ...product, quantite: 1 });
  }
  saveCart(cart);
}

function removeFromCart(id) {
  const cart = getCart().filter(i => i.id !== id);
  saveCart(cart);
}

function updateCartCount() {
  const badge = document.getElementById('cart-count');
  if (!badge) return;
  const total = getCart().reduce((sum, i) => sum + i.quantite, 0);
  badge.textContent = total;
  badge.style.display = total > 0 ? 'flex' : 'none';
}

// Init au chargement
initUsers();
document.addEventListener('DOMContentLoaded', () => {
  updateNavSession();
  updateCartCount();
});
