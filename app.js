/* Portfolio interactions: dashboard demo, mobile nav, scroll reveal */
(function () {
  'use strict';

  /* ---- Mobile nav ---- */
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    links.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---- Scroll reveal ---- */
  var revealables = document.querySelectorAll('.section-head, .card, .vault-card, .skill-group, .timeline-item, .ai-strip, .cert');
  if ('IntersectionObserver' in window && matchMedia('(prefers-reduced-motion: reduce)').matches === false) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'none';
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealables.forEach(function (el) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(14px)';
      el.style.transition = 'opacity 600ms cubic-bezier(0.16,1,0.3,1), transform 600ms cubic-bezier(0.16,1,0.3,1)';
      io.observe(el);
    });
    /* Safety fallback: reveal everything after 4s so content is never
       permanently hidden (slow loads, PDF saves, non-scrolling viewers). */
    setTimeout(function () {
      revealables.forEach(function (el) {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
    }, 4000);
    /* Reveal immediately before printing or saving as PDF. */
    window.addEventListener('beforeprint', function () {
      revealables.forEach(function (el) {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
    });
  }

  /* ---- Dashboard demo ---- */
  if (typeof Chart === 'undefined') return;
  Chart.defaults.font.family = "'JetBrains Mono', monospace";
  Chart.defaults.font.size = 11;
  Chart.defaults.color = '#5f6f69';
  Chart.defaults.animation.duration = 700;

  var ACCENT = '#2fe6a0';
  var RED = '#f06a5c';
  var AMBER = '#f0b84c';
  var BLUE = '#5aa7e8';
  var GRID = '#1b2622';

  var quarters = ['Q1 FY24', 'Q2 FY24', 'Q3 FY24', 'Q4 FY24', 'Q1 FY25', 'Q2 FY25', 'Q3 FY25', 'Q4 FY25'];

  var scenarios = {
    base: {
      revenue: [10.2, 10.8, 11.5, 12.1, 11.6, 12.4, 13.0, 13.9],
      expense: [7.4, 7.6, 7.9, 8.1, 7.5, 7.7, 7.9, 8.2],
      kpis: { revenue: '$48.2M', opex: '$31.6M', margin: '34.4%', studies: '650+', rd: '▲ 12.4% YoY', od: '▼ 3.1% vs budget', md: '▲ 4.8 pts YoY', sd: 'Tracked live' }
    },
    bull: {
      revenue: [10.2, 11.2, 12.4, 13.3, 13.0, 14.2, 15.1, 16.4],
      expense: [7.4, 7.7, 8.0, 8.3, 7.8, 8.0, 8.2, 8.6],
      kpis: { revenue: '$58.3M', opex: '$32.9M', margin: '43.6%', studies: '650+', rd: '▲ 24.8% YoY', od: '▼ 5.4% vs budget', md: '▲ 11.2 pts YoY', sd: 'Tracked live' }
    },
    bear: {
      revenue: [10.2, 10.4, 10.6, 10.8, 10.1, 10.3, 10.5, 10.7],
      expense: [7.4, 7.7, 8.1, 8.5, 8.2, 8.4, 8.6, 8.8],
      kpis: { revenue: '$42.3M', opex: '$34.5M', margin: '18.4%', studies: '650+', rd: '▼ 8.1% YoY', od: '▲ 6.2% vs budget', md: '▼ 9.6 pts YoY', sd: 'Tracked live' }
    }
  };

  var lineChart = new Chart(document.getElementById('chart-line'), {
    type: 'line',
    data: {
      labels: quarters,
      datasets: [
        {
          label: 'Revenue',
          data: scenarios.base.revenue,
          borderColor: ACCENT,
          backgroundColor: 'rgba(47,230,160,0.08)',
          fill: true,
          tension: 0.4,
          borderWidth: 2,
          pointRadius: 3,
          pointBackgroundColor: ACCENT
        },
        {
          label: 'Expense',
          data: scenarios.base.expense,
          borderColor: RED,
          backgroundColor: 'transparent',
          tension: 0.4,
          borderWidth: 2,
          borderDash: [5, 4],
          pointRadius: 2,
          pointBackgroundColor: RED
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { labels: { boxWidth: 10, usePointStyle: true } },
        tooltip: {
          backgroundColor: '#17201e',
          borderColor: '#233029',
          borderWidth: 1,
          callbacks: { label: function (c) { return c.dataset.label + ': $' + c.parsed.y.toFixed(1) + 'M'; } }
        }
      },
      scales: {
        x: { grid: { color: GRID } },
        y: { grid: { color: GRID }, ticks: { callback: function (v) { return '$' + v + 'M'; } } }
      }
    }
  });

  var donutChart = new Chart(document.getElementById('chart-donut'), {
    type: 'doughnut',
    data: {
      labels: ['Personnel', 'Clinical Ops', 'IT & Data', 'Facilities', 'Other'],
      datasets: [{
        data: [42, 24, 14, 11, 9],
        backgroundColor: [ACCENT, BLUE, AMBER, RED, '#5f6f69'],
        borderColor: '#131917',
        borderWidth: 3,
        hoverOffset: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '62%',
      plugins: {
        legend: { position: 'right', labels: { boxWidth: 10, usePointStyle: true } },
        tooltip: {
          backgroundColor: '#17201e', borderColor: '#233029', borderWidth: 1,
          callbacks: { label: function (c) { return c.label + ': ' + c.parsed + '%'; } }
        }
      }
    }
  });

  var barChart = new Chart(document.getElementById('chart-bar'), {
    type: 'bar',
    data: {
      labels: ['Research', 'Finance', 'IT', 'Ops', 'Marketing'],
      datasets: [{
        label: 'Variance',
        data: [4.2, -2.1, 1.6, -0.8, 2.9],
        backgroundColor: ['#2fe6a0', '#f06a5c', '#5aa7e8', '#f0b84c', '#5f6f69'],
        borderRadius: 4,
        barThickness: 18
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#17201e', borderColor: '#233029', borderWidth: 1,
          callbacks: { label: function (c) { return (c.parsed.y > 0 ? '+' : '') + c.parsed.y + '% vs budget'; } }
        }
      },
      scales: {
        x: { grid: { display: false } },
        y: { grid: { color: GRID }, ticks: { callback: function (v) { return v + '%'; } } }
      }
    }
  });

  function setKpis(s) {
    document.getElementById('kpi-revenue').textContent = s.revenue;
    document.getElementById('kpi-opex').textContent = s.opex;
    document.getElementById('kpi-margin').textContent = s.margin;
    document.getElementById('kpi-studies').textContent = s.studies;
    document.getElementById('kpi-revenue-delta').textContent = s.rd;
    document.getElementById('kpi-opex-delta').textContent = s.od;
    document.getElementById('kpi-margin-delta').textContent = s.md;
    document.getElementById('kpi-studies-delta').textContent = s.sd;
  }

  document.querySelectorAll('.filter-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.filter-btn').forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      var s = scenarios[btn.dataset.scenario] || scenarios.base;
      setKpis(s.kpis);
      lineChart.data.datasets[0].data = s.revenue;
      lineChart.data.datasets[1].data = s.expense;
      lineChart.update();
    });
  });
})();
