// =============================================
//  PageTurner — inscription.js
//  Validation formulaire d'inscription (RegEx)
// =============================================

const REGEX = {
  nom:       /^[A-Za-zÀ-ÖØ-öø-ÿ' -]{2,}$/,
  email:     /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/,
  motdepasse:/^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/
};

function toggleMenu() {
  document.getElementById('nav-links').classList.toggle('open');
}

function setFieldState(inputId, errorId, valid) {
  const input = document.getElementById(inputId);
  const error = document.getElementById(errorId);
  if (valid) {
    input.classList.remove('error');
    input.classList.add('valid');
    error.classList.remove('show');
  } else {
    input.classList.add('error');
    input.classList.remove('valid');
    error.classList.add('show');
  }
  return valid;
}

function validateField(inputId, errorId, regex) {
  const val = document.getElementById(inputId).value.trim();
  return setFieldState(inputId, errorId, regex.test(val));
}

// Validation en temps réel
['prenom','nom'].forEach(id => {
  document.addEventListener('DOMContentLoaded', () => {
    document.getElementById(id)?.addEventListener('blur', () =>
      validateField(id, 'err-' + id, REGEX.nom)
    );
  });
});

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('email')?.addEventListener('blur', () =>
    validateField('email', 'err-email', REGEX.email)
  );
  document.getElementById('motdepasse')?.addEventListener('blur', () =>
    validateField('motdepasse', 'err-motdepasse', REGEX.motdepasse)
  );
  document.getElementById('confirm')?.addEventListener('blur', () => {
    const mdp = document.getElementById('motdepasse').value;
    const confirm = document.getElementById('confirm').value;
    setFieldState('confirm', 'err-confirm', confirm === mdp && confirm.length > 0);
  });
});

function showAlert(id, msg) {
  ['alert-error', 'alert-success'].forEach(c => {
    const el = document.getElementById(c);
    el.classList.remove('show');
    el.textContent = '';
  });
  const el = document.getElementById(id);
  el.textContent = msg;
  el.classList.add('show');
}

function handleInscription() {
  const prenom = document.getElementById('prenom').value.trim();
  const nom    = document.getElementById('nom').value.trim();
  const email  = document.getElementById('email').value.trim();
  const mdp    = document.getElementById('motdepasse').value;
  const confirm = document.getElementById('confirm').value;

  let valid = true;
  valid = setFieldState('prenom', 'err-prenom', REGEX.nom.test(prenom)) && valid;
  valid = setFieldState('nom', 'err-nom', REGEX.nom.test(nom)) && valid;
  valid = setFieldState('email', 'err-email', REGEX.email.test(email)) && valid;
  valid = setFieldState('motdepasse', 'err-motdepasse', REGEX.motdepasse.test(mdp)) && valid;
  valid = setFieldState('confirm', 'err-confirm', confirm === mdp && confirm.length > 0) && valid;

  if (!valid) return;

  const result = inscrire(nom, prenom, email, mdp);
  if (result.success) {
    showAlert('alert-success', '✓ Compte créé avec succès ! Redirection vers la connexion...');
    document.getElementById('inscription-form').style.opacity = '0.5';
    document.getElementById('inscription-form').style.pointerEvents = 'none';
    setTimeout(() => window.location.href = 'connexion.html', 2000);
  } else {
    showAlert('alert-error', '✗ ' + result.message);
  }
}
