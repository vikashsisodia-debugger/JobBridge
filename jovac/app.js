
'use strict';

// ── Particle canvas background ──────────────────────
(function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  const PARTICLE_COUNT = 55;
  const COLORS = ['rgba(129,140,248,', 'rgba(167,139,250,', 'rgba(103,232,249,'];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function createParticle() {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.8 + 0.4,
      dx: (Math.random() - 0.5) * 0.35,
      dy: (Math.random() - 0.5) * 0.35,
      alpha: Math.random() * 0.5 + 0.1,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    };
  }

  function init() { particles = Array.from({ length: PARTICLE_COUNT }, createParticle); }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      p.x += p.dx; p.y += p.dy;
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color + p.alpha + ')';
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => { resize(); init(); });
  resize(); init(); draw();
})();


// ── Tab switching ────────────────────────────────────
function switchTab(tab) {
  const loginPanel    = document.getElementById('panel-login');
  const registerPanel = document.getElementById('panel-register');
  const tabLogin      = document.getElementById('tab-login');
  const tabRegister   = document.getElementById('tab-register');
  const indicator     = document.getElementById('tab-indicator');
  const toast         = document.getElementById('toast');

  // Hide toast on tab switch
  hideToast();

  if (tab === 'login') {
    loginPanel.classList.add('active', 'slide-in');
    registerPanel.classList.remove('active');
    tabLogin.classList.add('active');
    tabLogin.setAttribute('aria-selected', 'true');
    tabRegister.classList.remove('active');
    tabRegister.setAttribute('aria-selected', 'false');
    indicator.classList.remove('right');
    setTimeout(() => loginPanel.classList.remove('slide-in'), 400);
  } else {
    registerPanel.classList.add('active', 'slide-in');
    loginPanel.classList.remove('active');
    tabRegister.classList.add('active');
    tabRegister.setAttribute('aria-selected', 'true');
    tabLogin.classList.remove('active');
    tabLogin.setAttribute('aria-selected', 'false');
    indicator.classList.add('right');
    setTimeout(() => registerPanel.classList.remove('slide-in'), 400);
  }

  // reset all errors
  clearAllErrors();
}


// ── Toggle password visibility ────────────────────────
function togglePassword(inputId, btn) {
  const input  = document.getElementById(inputId);
  const eyeOn  = btn.querySelector('.eye-open');
  const eyeOff = btn.querySelector('.eye-closed');
  if (input.type === 'password') {
    input.type = 'text';
    eyeOn.classList.add('hidden');
    eyeOff.classList.remove('hidden');
    btn.setAttribute('aria-label', 'Hide password');
  } else {
    input.type = 'password';
    eyeOff.classList.add('hidden');
    eyeOn.classList.remove('hidden');
    btn.setAttribute('aria-label', 'Show password');
  }
}


// ── Password strength meter ──────────────────────────
function updateStrengthMeter(password) {
  const bars  = document.getElementById('strength-bars');
  const label = document.getElementById('strength-label');
  if (!bars || !label) return;

  bars.className = 'strength-bars';

  if (!password) { label.textContent = ''; label.style.color = ''; return; }

  let score = 0;
  if (password.length >= 8)                    score++;
  if (/[A-Z]/.test(password))                  score++;
  if (/[0-9]/.test(password))                  score++;
  if (/[^A-Za-z0-9]/.test(password))           score++;

  const levels = ['weak', 'fair', 'good', 'strong'];
  const labels = ['Weak', 'Fair', 'Good', 'Strong'];
  const colors = [
    'var(--clr-error)',
    'var(--clr-warning)',
    '#a3e635',
    'var(--clr-success)'
  ];

  const idx = Math.max(0, score - 1);
  bars.classList.add('strength-' + levels[idx]);
  label.textContent  = labels[idx];
  label.style.color  = colors[idx];
}


// ── Validation helpers ───────────────────────────────
function setError(groupId, errorId, message) {
  const group = document.getElementById(groupId);
  const err   = document.getElementById(errorId);
  if (!group || !err) return;
  group.classList.add('has-error');
  group.classList.remove('valid');
  err.textContent = message;
}

function setValid(groupId, errorId) {
  const group = document.getElementById(groupId);
  const err   = document.getElementById(errorId);
  if (!group || !err) return;
  group.classList.remove('has-error');
  group.classList.add('valid');
  err.textContent = '';
}

function clearAllErrors() {
  document.querySelectorAll('.input-group').forEach(g => {
    g.classList.remove('has-error', 'valid');
  });
  document.querySelectorAll('.field-error').forEach(e => e.textContent = '');
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}


// ── Toast ────────────────────────────────────────────
function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  if (!toast) return;
  const icon = type === 'success' ? '✓' : '✗';
  toast.textContent = icon + '  ' + message;
  toast.className   = 'toast show ' + type;
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => hideToast(), 4000);
}

function hideToast() {
  const toast = document.getElementById('toast');
  if (toast) toast.className = 'toast';
}


// ── Simulate button loading ──────────────────────────
function setLoading(btn, isLoading) {
  if (isLoading) {
    btn.classList.add('loading');
    btn.disabled = true;
  } else {
    btn.classList.remove('loading');
    btn.disabled = false;
  }
}


// ── LOGIN form submission ─────────────────────────────
document.getElementById('login-form').addEventListener('submit', async function (e) {
  e.preventDefault();
  clearAllErrors();

  const email    = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;
  const btn      = document.getElementById('login-submit-btn');

  let valid = true;

  if (!email) {
    setError('login-email-group', 'login-email-error', 'Email address is required.');
    valid = false;
  } else if (!isValidEmail(email)) {
    setError('login-email-group', 'login-email-error', 'Please enter a valid email address.');
    valid = false;
  } else {
    setValid('login-email-group', 'login-email-error');
  }

  if (!password) {
    setError('login-password-group', 'login-password-error', 'Password is required.');
    valid = false;
  } else if (password.length < 6) {
    setError('login-password-group', 'login-password-error', 'Password must be at least 6 characters.');
    valid = false;
  } else {
    setValid('login-password-group', 'login-password-error');
  }

  if (!valid) return;

  // Simulate async login
  setLoading(btn, true);
  await simulateRequest(1400);
  setLoading(btn, false);

  // TODO: Replace with real API call
  // const res = await fetch('/api/login', { method: 'POST', body: JSON.stringify({ email, password }) });
  // if (!res.ok) { showToast('Invalid email or password.', 'error'); return; }

  showToast('Welcome back! Signing you in…', 'success');

  // Simulate redirect after success
  setTimeout(() => {
    window.location.href = 'dashboard.html'; // change to your actual route
  }, 1800);
});


// ── REGISTER form submission ──────────────────────────
document.getElementById('register-form').addEventListener('submit', async function (e) {
  e.preventDefault();
  clearAllErrors();

  const fname    = document.getElementById('reg-fname').value.trim();
  const lname    = document.getElementById('reg-lname').value.trim();
  const email    = document.getElementById('reg-email').value.trim();
  const password = document.getElementById('reg-password').value;
  const confirm  = document.getElementById('reg-confirm').value;
  const terms    = document.getElementById('agree-terms').checked;
  const btn      = document.getElementById('register-submit-btn');

  let valid = true;

  if (!fname) {
    setError('reg-fname-group', 'reg-fname-error', 'First name is required.');
    valid = false;
  } else if (fname.length < 2) {
    setError('reg-fname-group', 'reg-fname-error', 'First name must be at least 2 characters.');
    valid = false;
  } else {
    setValid('reg-fname-group', 'reg-fname-error');
  }

  if (!lname) {
    setError('reg-lname-group', 'reg-lname-error', 'Last name is required.');
    valid = false;
  } else {
    setValid('reg-lname-group', 'reg-lname-error');
  }

  if (!email) {
    setError('reg-email-group', 'reg-email-error', 'Email address is required.');
    valid = false;
  } else if (!isValidEmail(email)) {
    setError('reg-email-group', 'reg-email-error', 'Please enter a valid email address.');
    valid = false;
  } else {
    setValid('reg-email-group', 'reg-email-error');
  }

  if (!password) {
    setError('reg-password-group', 'reg-password-error', 'Password is required.');
    valid = false;
  } else if (password.length < 8) {
    setError('reg-password-group', 'reg-password-error', 'Password must be at least 8 characters.');
    valid = false;
  } else {
    setValid('reg-password-group', 'reg-password-error');
  }

  if (!confirm) {
    setError('reg-confirm-group', 'reg-confirm-error', 'Please confirm your password.');
    valid = false;
  } else if (confirm !== password) {
    setError('reg-confirm-group', 'reg-confirm-error', 'Passwords do not match.');
    valid = false;
  } else {
    setValid('reg-confirm-group', 'reg-confirm-error');
  }

  if (!terms) {
    showToast('Please accept the Terms of Service to continue.', 'error');
    valid = false;
  }

  if (!valid) return;

  // Simulate async register
  setLoading(btn, true);
  await simulateRequest(1600);
  setLoading(btn, false);

  // TODO: Replace with real API call
  // const res = await fetch('/api/register', { method: 'POST', body: JSON.stringify({ fname, lname, email, password }) });
  // if (!res.ok) { showToast('An account with this email already exists.', 'error'); return; }

  showToast('Account created! Welcome to JOVAC 🎉', 'success');

  setTimeout(() => { switchTab('login'); }, 1800);
});


// ── Social login ─────────────────────────────────────
function socialLogin(provider) {
  showToast(provider + ' sign-in coming soon!', 'error');
  // TODO: Redirect to OAuth endpoint
  // window.location.href = `/auth/${provider.toLowerCase()}`;
}


// ── Forgot password ───────────────────────────────────
document.getElementById('forgot-password-link').addEventListener('click', function (e) {
  e.preventDefault();
  const email = document.getElementById('login-email').value.trim();
  if (!email || !isValidEmail(email)) {
    setError('login-email-group', 'login-email-error', 'Enter your email above to reset your password.');
    return;
  }
  showToast('Password reset link sent to ' + email, 'success');
});


// ── Real-time validation on blur ─────────────────────
function addBlurValidation(inputId, groupId, errorId, validate) {
  const input = document.getElementById(inputId);
  if (!input) return;
  input.addEventListener('blur', () => {
    const msg = validate(input.value);
    if (msg) setError(groupId, errorId, msg);
    else if (input.value) setValid(groupId, errorId);
  });
}

addBlurValidation(
  'login-email', 'login-email-group', 'login-email-error',
  v => !v ? '' : !isValidEmail(v) ? 'Invalid email address.' : ''
);
addBlurValidation(
  'reg-email', 'reg-email-group', 'reg-email-error',
  v => !v ? '' : !isValidEmail(v) ? 'Invalid email address.' : ''
);
addBlurValidation(
  'reg-confirm', 'reg-confirm-group', 'reg-confirm-error',
  v => {
    const pw = document.getElementById('reg-password').value;
    return v && v !== pw ? 'Passwords do not match.' : '';
  }
);


// ── Utility ───────────────────────────────────────────
function simulateRequest(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
