/* ============================================================
   GUARD JS — Portería
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {

  /* ── Sidebar SPA ── */
  const navItems = document.querySelectorAll('.nav-item[data-nav]');
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      navigate(item.dataset.nav, navItems, 'data-nav');
      updateHeaderTitle(item.dataset.nav);
    });
  });

  const titles = {
    'guard-dashboard':       'Dashboard de Portería',
    'guard-visitas':         'Gestión de Visitas',
    'guard-correspondencia': 'Registro de Correspondencia',
    'guard-bitacora':        'Bitácora de Novedades',
    'guard-rondas':          'Control de Rondas',
  };
  function updateHeaderTitle(id) {
    const el = document.getElementById('page-title');
    if (el) el.textContent = titles[id] || 'Portería';
  }

  /* ── Visit form ── */
  document.getElementById('visit-form')?.addEventListener('submit', e => {
    e.preventDefault();
    const name  = document.getElementById('visit-name')?.value;
    const apt   = document.getElementById('visit-apt')?.value;
    const type  = document.getElementById('visit-type')?.value;
    const now   = new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });

    const tbody = document.getElementById('visit-log-body');
    if (tbody) {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${now}</td>
        <td><strong>${name}</strong></td>
        <td>${apt}</td>
        <td><span class="badge badge-primary">${type}</span></td>
        <td><span class="badge badge-success">Activa</span></td>
        <td><button class="btn btn-sm btn-danger" onclick="logExit(this)">Registrar Salida</button></td>
      `;
      tbody.prepend(row);
    }
    e.target.reset();
    showToast('Visita registrada', `${name} ingresó al conjunto.`, 'success');
  });

  window.logExit = (btn) => {
    const row = btn.closest('tr');
    row.cells[4].innerHTML = '<span class="badge badge-neutral">Salida</span>';
    btn.remove();
    showToast('Salida registrada', 'La visita ha salido del conjunto.', 'info');
  };

  /* ── Package form ── */
  document.getElementById('package-form')?.addEventListener('submit', e => {
    e.preventDefault();
    const resident = document.getElementById('pkg-resident')?.value;
    const desc     = document.getElementById('pkg-desc')?.value;

    const list = document.getElementById('packages-list');
    if (list) {
      const now = new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
      const item = document.createElement('div');
      item.className = 'list-item';
      item.innerHTML = `
        <div class="list-item-icon" style="background:var(--color-warning-bg);color:var(--color-warning)">📦</div>
        <div class="flex-1">
          <div class="font-semibold text-sm">${desc}</div>
          <div class="text-xs text-muted">Apto ${resident} · Hoy ${now}</div>
        </div>
        <span class="badge badge-warning">Pendiente</span>
      `;
      list.prepend(item);
    }
    e.target.reset();

    // Show notification banner
    const banner = document.getElementById('notif-sent-banner');
    if (banner) {
      banner.style.display = 'flex';
      setTimeout(() => banner.style.display = 'none', 5000);
    }
    showToast('📬 Aviso enviado', `Notificación enviada al residente del Apto ${resident}.`, 'success', 5000);
  });

  /* ── Bitácora ── */
  document.getElementById('bitacora-form')?.addEventListener('submit', e => {
    e.preventDefault();
    const text  = document.getElementById('novedad-text')?.value;
    const level = document.getElementById('novedad-level')?.value;
    if (!text.trim()) return;

    const timeline = document.getElementById('bitacora-timeline');
    if (timeline) {
      const now  = new Date();
      const time = now.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
      const date = now.toLocaleDateString('es-CO');
      const levelColors = { normal: 'primary', urgente: 'danger', alerta: 'warning' };
      const levelLabels = { normal: 'Normal', urgente: '🚨 Urgente', alerta: '⚠️ Alerta' };
      const item = document.createElement('div');
      item.className = 'timeline-item';
      item.innerHTML = `
        <div class="timeline-time">${date} · ${time}</div>
        <div class="timeline-content">
          <div class="flex items-center gap-2 mb-2">
            <span class="badge badge-${levelColors[level]}">${levelLabels[level]}</span>
            <span class="text-xs text-muted">Guarda: Carlos Martínez</span>
          </div>
          <p class="text-sm">${text}</p>
        </div>
      `;
      timeline.prepend(item);
    }
    e.target.reset();
    showToast('Novedad registrada', 'La novedad fue añadida a la bitácora.', 'success');
  });

  /* ── Rondas checklist ── */
  document.querySelectorAll('.checklist-item').forEach(item => {
    item.addEventListener('click', () => {
      item.classList.toggle('done');
      const check = item.querySelector('.check-circle');
      if (check) check.textContent = item.classList.contains('done') ? '✓' : '';
      updateRoundsProgress();
    });
  });

  function updateRoundsProgress() {
    const total = document.querySelectorAll('.checklist-item').length;
    const done  = document.querySelectorAll('.checklist-item.done').length;
    const pct   = Math.round((done / total) * 100);
    const bar   = document.getElementById('rounds-progress-bar');
    const label = document.getElementById('rounds-progress-label');
    if (bar)   bar.style.width   = pct + '%';
    if (label) label.textContent = `${done} / ${total} puntos completados (${pct}%)`;
    if (done === total) showToast('🎉 Ronda completada', 'Todos los puntos de patrullaje han sido verificados.', 'success');
  }

});
