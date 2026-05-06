// =============================================
//  PageTurner — connexion.js
//  Validation et logique de connexion
// =============================================

const EMAIL_REGEX = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;

function toggleMenu() {
  document.getElementById('nav-links').classList.toggle('open');
}

function setField(inputId, errorId, valid) {
  const input = document.getElementById(inputId);
  const error = document.getElementById(errorId);
  if (valid) {
    input.classList.remove('error'); input.classList.add('valid');
    error.classList.remove('show');
  } else {
    input.classList.add('error'); input.classList.remove('valid');
    error.classList.add('show');
  }
  return valid;
}

function showAlert(id, msg) {
  ['alert-error','alert-success'].forEach(c => {
    const el = document.getElementById(c);
    el.classList.remove('show'); el.textContent = '';
  });
  const el = document.getElementById(id);
  el.textContent = msg;
  el.classList.add('show');
}

document.addEventListener('DOMContentLoaded', () => {
  // Rediriger si déjà connecté
  if (isConnecte()) {
    window.location.href = 'index.html';
  }

  document.getElementById('email')?.addEventListener('blur', () => {
    const v = document.getElementById('email').value.trim();
    setField('email', 'err-email', EMAIL_REGEX.test(v));
  });
  document.getElementById('motdepasse')?.addEventListener('blur', () => {
    const v = document.getElementById('motdepasse').value;
    setField('motdepasse', 'err-motdepasse', v.length > 0);
  });
});

function handleConnexion() {
  const email = document.getElementById('email').value.trim();
  const mdp   = document.getElementById('motdepasse').value;

  let valid = true;
  valid = setField('email', 'err-email', EMAIL_REGEX.test(email)) && valid;
  valid = setField('motdepasse', 'err-motdepasse', mdp.length > 0) && valid;
  if (!valid) return;

  const result = connecter(email, mdp);
  if (result.success) {
    showAlert('alert-success', `✓ Bienvenue, ${result.user.prenom} ! Redirection...`);
    setTimeout(() => window.location.href = 'index.html', 1500);
  } else {
    showAlert('alert-error', '✗ ' + result.message);
    document.getElementById('motdepasse').value = '';
    document.getElementById('motdepasse').focus();
  }
}
