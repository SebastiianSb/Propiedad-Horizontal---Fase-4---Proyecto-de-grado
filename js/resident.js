/* ============================================================
   RESIDENT JS — Módulos e interacciones
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {

  /* ── Sidebar SPA ── */
  const navItems = document.querySelectorAll('.nav-item[data-nav]');
  
  const titles = {
    'home': 'Portal del Residente',
    'finances': 'Mis Cuotas',
    'news': 'Comunicados',
    'voting': 'Votaciones',
    'reservations': 'Reservas'
  };

  function updateHeaderTitle(id) {
    const el = document.getElementById('page-title');
    if (el) el.textContent = titles[id] || 'Portal del Residente';
  }

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      navigate(item.dataset.nav, navItems);
      updateHeaderTitle(item.dataset.nav);
      if (item.dataset.nav === 'finances') renderFinanceChart();
    });
  });

  /* ── Finance Chart ── */
  let financeChartRendered = false;
  function renderFinanceChart() {
    if (financeChartRendered) return;
    if (typeof Chart === 'undefined') return;
    financeChartRendered = true;

    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const gridColor = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)';
    const textColor = isDark ? '#94a3b8' : '#4a5d7a';

    const ctx = document.getElementById('finance-chart');
    if (!ctx) return;
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Ene','Feb','Mar','Abr','May','Jun'],
        datasets: [
          {
            label: 'Recaudado ($)',
            data: [18500000, 17200000, 19800000, 16900000, 20100000, 18700000],
            backgroundColor: 'rgba(37,99,235,0.75)',
            borderRadius: 8,
            borderSkipped: false,
          },
          {
            label: 'Gastos ($)',
            data: [14200000, 15800000, 13500000, 16200000, 14800000, 15300000],
            backgroundColor: 'rgba(220,38,38,0.5)',
            borderRadius: 8,
            borderSkipped: false,
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { labels: { color: textColor, font: { family: 'Inter', weight: '600' } } },
          tooltip: {
            callbacks: {
              label: ctx => ` $${(ctx.raw / 1000000).toFixed(1)}M`
            }
          }
        },
        scales: {
          x: { ticks: { color: textColor }, grid: { color: gridColor } },
          y: {
            ticks: { color: textColor, callback: v => `$${(v/1000000).toFixed(0)}M` },
            grid: { color: gridColor }
          }
        }
      }
    });
  }

  /* ── Voting ── */
  document.querySelectorAll('.vote-option').forEach(opt => {
    opt.addEventListener('click', () => {
      const card = opt.closest('.vote-card');
      if (card.classList.contains('voted')) return;
      card.querySelectorAll('.vote-option').forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
    });
  });

  document.querySelectorAll('.vote-submit-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.vote-card');
      const selected = card.querySelector('.vote-option.selected');
      if (!selected) {
        showToast('Sin selección', 'Por favor selecciona una opción antes de votar.', 'warning');
        return;
      }
      card.classList.add('voted');
      btn.textContent = '✓ Voto registrado';
      btn.disabled = true;
      btn.className = 'btn btn-success w-full mt-4';
      showToast('¡Voto registrado!', `Tu voto fue enviado exitosamente.`, 'success');
    });
  });

  /* ── Quick contact portería ── */
  document.getElementById('btn-porteria')?.addEventListener('click', () => {
    showToast('📞 Llamando a Portería', 'Conectando con el guarda de turno...', 'info', 5000);
  });

  /* ── Package received ── */
  document.querySelectorAll('.pkg-confirm-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.list-item');
      item.style.opacity = '0.5';
      item.style.pointerEvents = 'none';
      showToast('Paquete confirmado', 'Has confirmado la recepción del paquete.', 'success');
    });
  });

});
