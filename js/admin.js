/* ============================================================
   ADMIN JS — Dashboard, Charts, Gestión
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {

  /* ── Sidebar SPA ── */
  const navItems = document.querySelectorAll('.nav-item[data-nav]');
  const titles = {
    'admin-dashboard':  'Dashboard',
    'admin-financiero': 'Financiero',
    'admin-residentes': 'Residentes',
    'admin-comunicados':'Comunicados',
    'admin-votaciones': 'Votaciones',
    'admin-documentos': 'Documentos',
    'admin-reservas':   'Reservas',
    'admin-config':     'Configuración',
  };
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      navigate(item.dataset.nav, navItems);
      const titleEl = document.getElementById('admin-page-title');
      if (titleEl && titles[item.dataset.nav]) titleEl.textContent = titles[item.dataset.nav];
      if (item.dataset.nav === 'admin-dashboard') renderDashboardCharts();
      if (item.dataset.nav === 'admin-votaciones') renderVoteCharts();
      if (item.dataset.nav === 'admin-financiero') renderFinancialCharts();
    });
  });

  /* ══ CHARTS ══════════════════════════════════════════════ */
  const isDark = () => document.documentElement.getAttribute('data-theme') === 'dark';
  const getColors = () => ({
    grid:  isDark() ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
    text:  isDark() ? '#94a3b8' : '#4a5d7a',
    bg:    isDark() ? '#1f2937' : '#ffffff',
  });

  let dashChartsDone = false;
  function renderDashboardCharts() {
    if (dashChartsDone || typeof Chart === 'undefined') return;
    dashChartsDone = true;
    const c = getColors();

    // Cartera morosa - Donut
    const ctx1 = document.getElementById('chart-cartera');
    if (ctx1) new Chart(ctx1, {
      type: 'doughnut',
      data: {
        labels: ['Al día', 'Mora 1-30d', 'Mora 31-90d', 'Mora >90d'],
        datasets: [{
          data: [68, 15, 10, 7],
          backgroundColor: ['#22c55e','#f59e0b','#ef4444','#991b1b'],
          borderWidth: 0,
          hoverOffset: 8
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false, cutout: '70%',
        plugins: {
          legend: {
            position: 'right',
            labels: { color: c.text, font: { family: 'Inter', weight: '600' }, padding: 16, boxWidth: 12, borderRadius: 4 }
          },
          tooltip: { callbacks: { label: ctx => ` ${ctx.label}: ${ctx.raw}%` } }
        }
      }
    });

    // Recaudación mensual - Line
    const ctx2 = document.getElementById('chart-recaudacion');
    if (ctx2) new Chart(ctx2, {
      type: 'line',
      data: {
        labels: ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'],
        datasets: [{
          label: 'Recaudado ($M)',
          data: [18.5,17.2,19.8,16.9,20.1,18.7,21.3,19.5,22.0,18.9,20.5,23.1],
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59,130,246,0.1)',
          fill: true,
          tension: 0.4,
          borderWidth: 3,
          pointBackgroundColor: '#3b82f6',
          pointRadius: 4,
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { labels: { color: c.text, font: { family: 'Inter' } } } },
        scales: {
          x: { ticks: { color: c.text }, grid: { color: c.grid } },
          y: { ticks: { color: c.text, callback: v => `$${v}M` }, grid: { color: c.grid }, beginAtZero: false }
        }
      }
    });
  }

  let voteChartsDone = false;
  function renderVoteCharts() {
    if (voteChartsDone || typeof Chart === 'undefined') return;
    voteChartsDone = true;
    const c = getColors();

    const ctx = document.getElementById('chart-votes');
    if (!ctx) return;
    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Sí, renovar contrato','No, cambiar empresa','Abstención'],
        datasets: [{
          data: [54, 38, 8],
          backgroundColor: ['#22c55e','#ef4444','#94a3b8'],
          borderWidth: 0, hoverOffset: 10
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', labels: { color: c.text, font: { family:'Inter', weight:'600' }, padding:16, boxWidth:14, borderRadius:4 } },
          tooltip: { callbacks: { label: ctx => ` ${ctx.label}: ${ctx.raw}%` } }
        }
      }
    });

    const ctx2 = document.getElementById('chart-participacion');
    if (!ctx2) return;
    new Chart(ctx2, {
      type: 'bar',
      data: {
        labels: ['Asamblea Mar','Encuesta Abr','Votación May','Encuesta Jun'],
        datasets: [{
          label: 'Participación (%)',
          data: [72, 58, 81, 64],
          backgroundColor: 'rgba(37,99,235,0.8)',
          borderRadius: 8, borderSkipped: false,
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: c.text, font: {family:'Inter', weight:'600'} } }
        },
        scales: {
          x: { ticks: { color: c.text }, grid: { color: c.grid } },
          y: { ticks: { color: c.text, callback: v => v+'%' }, grid: { color: c.grid }, min: 0, max: 100 }
        }
      }
    });
  }

  let finChartsDone = false;
  function renderFinancialCharts() {
    if (finChartsDone || typeof Chart === 'undefined') return;
    finChartsDone = true;
    const c = getColors();

    const ctx = document.getElementById('chart-gastos');
    if (!ctx) return;
    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Seguridad', 'Mantenimiento', 'Aseo', 'Administración', 'Servicios Públicos', 'Imprevistos'],
        datasets: [{
          data: [32, 24, 16, 12, 11, 5],
          backgroundColor: ['#2563eb','#0891b2','#059669','#7c3aed','#db2777','#78716c'],
          borderWidth: 0, hoverOffset: 8
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false, cutout: '65%',
        plugins: {
          legend: { position: 'right', labels: { color: c.text, font:{family:'Inter', weight:'600'}, padding:12, boxWidth:12, borderRadius:3 } },
          tooltip: { callbacks: { label: ctx => ` ${ctx.label}: ${ctx.raw}%` } }
        }
      }
    });
  }

  // Render dashboard charts on initial load
  renderDashboardCharts();

  /* ── Communications form ── */
  document.getElementById('comm-form')?.addEventListener('submit', e => {
    e.preventDefault();
    const title = document.getElementById('comm-title')?.value;
    const type  = document.getElementById('comm-type')?.value;

    const feed = document.getElementById('comm-feed');
    if (feed) {
      const typeBadge = { alerta: 'badge-danger', info: 'badge-primary', aviso: 'badge-warning', general: 'badge-neutral' };
      const now = new Date().toLocaleDateString('es-CO', { day:'2-digit', month:'short', year:'numeric' });
      const item = document.createElement('div');
      item.className = 'card mb-3';
      item.innerHTML = `
        <div class="card-body">
          <div class="flex items-center justify-between mb-2">
            <span class="badge ${typeBadge[type] || 'badge-neutral'} news-badge ${type}">${type.toUpperCase()}</span>
            <span class="text-xs text-muted">${now} · Publicado ahora</span>
          </div>
          <h4 class="font-semibold">${title}</h4>
          <div class="flex gap-2 mt-3">
            <button class="btn btn-sm btn-secondary">✏️ Editar</button>
            <button class="btn btn-sm btn-danger" onclick="this.closest('.card').remove()">🗑️ Eliminar</button>
          </div>
        </div>
      `;
      feed.prepend(item);
    }
    e.target.reset();
    showToast('📢 Comunicado publicado', 'La noticia fue enviada a todos los residentes.', 'success');
  });

  /* ── New vote form ── */
  document.getElementById('vote-create-form')?.addEventListener('submit', e => {
    e.preventDefault();
    showToast('✅ Votación creada', 'La encuesta ya está disponible para los residentes.', 'success');
    closeModal('modal-new-vote');
    e.target.reset();
  });

  /* ── User search ── */
  document.getElementById('user-search')?.addEventListener('input', function() {
    const q = this.value.toLowerCase();
    document.querySelectorAll('#users-tbody tr').forEach(row => {
      row.style.display = row.textContent.toLowerCase().includes(q) ? '' : 'none';
    });
  });

  /* ── File upload ── */
  document.querySelectorAll('.upload-zone').forEach(zone => {
    zone.addEventListener('dragover', e => { e.preventDefault(); zone.style.borderColor = 'var(--color-primary)'; });
    zone.addEventListener('dragleave', () => { zone.style.borderColor = ''; });
    zone.addEventListener('drop', e => {
      e.preventDefault();
      zone.style.borderColor = '';
      const file = e.dataTransfer.files[0];
      if (file) showToast('Archivo subido', `"${file.name}" fue cargado correctamente.`, 'success');
    });
    zone.addEventListener('click', () => {
      const inp = zone.querySelector('input[type="file"]');
      if (inp) inp.click();
    });
    const inp = zone.querySelector('input[type="file"]');
    inp?.addEventListener('change', () => {
      if (inp.files[0]) showToast('Archivo subido', `"${inp.files[0].name}" fue cargado exitosamente.`, 'success');
    });
  });

  /* ── Theme observer: re-render charts ── */
  const observer = new MutationObserver(() => {
    dashChartsDone = false; voteChartsDone = false; finChartsDone = false;
  });
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

});
