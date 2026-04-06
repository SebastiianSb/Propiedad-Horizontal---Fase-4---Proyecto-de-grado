/* ============================================================
   LOGIN JS
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {

  /* ── Role selection ── */
  const roleCards = document.querySelectorAll('.role-card');
  let selectedRole = 'resident';

  roleCards.forEach(card => {
    card.addEventListener('click', () => {
      roleCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      selectedRole = card.dataset.role;
      const roleLabels = { resident: 'Residente', admin: 'Administrador', guard: 'Guarda de Seguridad' };
      document.getElementById('role-label').textContent = roleLabels[selectedRole];
    });
  });

  /* ── Password toggle ── */
  document.getElementById('toggle-pwd').addEventListener('click', () => {
    const input = document.getElementById('password');
    const icon  = document.getElementById('toggle-pwd');
    if (input.type === 'password') {
      input.type = 'text';
      icon.textContent = '🙈';
    } else {
      input.type = 'password';
      icon.textContent = '👁️';
    }
  });

  /* ── Form submit ── */
  document.getElementById('login-form').addEventListener('submit', e => {
    e.preventDefault();
    const btn = document.getElementById('login-btn');
    btn.textContent = 'Iniciando sesión...';
    btn.disabled = true;

    setTimeout(() => {
      const routes = {
        resident: 'resident.html',
        admin:    'admin.html',
        guard:    'guard.html'
      };
      window.location.href = routes[selectedRole];
    }, 1200);
  });

  /* ── Forgot password ── */
  document.getElementById('forgot-link').addEventListener('click', e => {
    e.preventDefault();
    openModal('modal-forgot');
  });

  document.getElementById('forgot-form')?.addEventListener('submit', e => {
    e.preventDefault();
    closeModal('modal-forgot');
    showToast('Correo enviado', 'Revisa tu bandeja de entrada para restablecer tu contraseña.', 'success');
  });
});
