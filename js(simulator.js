/**
 * HIRING PROBLEM — SIMULATOR
 * Probabilistic analysis · CLRS Chapter 5
 *
 * Covers:
 *  - Monte Carlo cost distribution
 *  - Day-by-day candidate stepping
 *  - Theory vs simulation chart (H(n) harmonic numbers)
 */

'use strict';

/* ── STATE ── */
let n = 20, ci = 10, ch = 100, sims = 500;
let stepSeq = [], stepIdx = 0, stepState = null;
let distChartObj = null, harmChartObj = null;

/* ── MATH HELPERS ── */

/** Compute the n-th harmonic number H(n) = 1 + 1/2 + ... + 1/n */
function harmonic(k) {
  let h = 0;
  for (let i = 1; i <= k; i++) h += 1 / i;
  return h;
}

/** Fisher-Yates shuffle (in-place) */
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Run HIRE-ASSISTANT on a random permutation of [1..nVal].
 * Returns the number of hires made.
 */
function simulate(nVal) {
  const perm = shuffle(Array.from({ length: nVal }, (_, i) => i + 1));
  let best = -1, hires = 0;
  for (const q of perm) {
    if (q > best) { best = q; hires++; }
  }
  return hires;
}

/* ── UI HELPERS ── */

function $(id) { return document.getElementById(id); }

function updateLabels() {
  n    = +$('nSlider').value;
  ci   = +$('ciSlider').value;
  ch   = +$('chSlider').value;
  sims = +$('simSlider').value;

  $('nVal').textContent   = n;
  $('ciVal').textContent  = '$' + ci;
  $('chVal').textContent  = '$' + ch;
  $('simVal').textContent = sims;
  $('mTheory').textContent = harmonic(n).toFixed(2);
  $('mWorst').textContent  = '$' + (n * ci + n * ch).toLocaleString();
}

function addLog(msg, cls) {
  const log = $('log');
  const empty = log.querySelector('.log-empty');
  if (empty) empty.remove();
  const d = document.createElement('div');
  d.className = cls;
  d.textContent = msg;
  log.appendChild(d);
  log.scrollTop = log.scrollHeight;
}

/* ── MONTE CARLO ── */

function runMonteCarlo() {
  updateLabels();

  const costs = [];
  let totalH = 0;

  for (let s = 0; s < sims; s++) {
    const h = simulate(n);
    totalH += h;
    costs.push(n * ci + h * ch);
  }

  const avg = costs.reduce((a, b) => a + b, 0) / sims;
  $('mHires').textContent = (totalH / sims).toFixed(2);
  $('mCost').textContent  = '$' + Math.round(avg).toLocaleString();

  renderDistChart(costs);
  renderHarmonicChart();
  resetStep(); // rebuild stream for current n
}

/* ── CHARTS ── */

function renderDistChart(costs) {
  const mn = Math.min(...costs);
  const mx = Math.max(...costs);
  const BINS = 16;
  const bw = Math.max((mx - mn) / BINS, 1);

  const buckets = Array(BINS).fill(0);
  const labels  = Array.from({ length: BINS }, (_, i) => '$' + Math.round(mn + i * bw));

  for (const c of costs) {
    const b = Math.min(BINS - 1, Math.floor((c - mn) / bw));
    buckets[b]++;
  }

  if (distChartObj) distChartObj.destroy();
  distChartObj = new Chart($('distChart'), {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Runs',
        data: buckets,
        backgroundColor: 'rgba(232,255,71,0.2)',
        borderColor:     'rgba(232,255,71,0.6)',
        borderWidth: 1,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: {
          ticks: { color: '#6b6867', font: { family: 'DM Mono', size: 10 }, maxRotation: 45, autoSkip: true },
          grid: { color: 'rgba(255,255,255,0.04)' },
          border: { color: 'rgba(255,255,255,0.08)' },
        },
        y: {
          ticks: { color: '#6b6867', font: { family: 'DM Mono', size: 10 } },
          grid: { color: 'rgba(255,255,255,0.04)' },
          border: { color: 'rgba(255,255,255,0.08)' },
        },
      },
    },
  });
}

function renderHarmonicChart() {
  // Sample a spread of n values including current n
  const ns = [1, 2, 3, 5, 8, 13, 21, 34, 55, n]
    .filter((v, i, a) => a.indexOf(v) === i)
    .sort((a, b) => a - b);

  const theoryH = ns.map(x => +harmonic(x).toFixed(3));
  const simH    = ns.map(x => {
    let t = 0;
    for (let s = 0; s < 300; s++) t += simulate(x);
    return +(t / 300).toFixed(3);
  });

  if (harmChartObj) harmChartObj.destroy();
  harmChartObj = new Chart($('harmChart'), {
    type: 'line',
    data: {
      labels: ns.map(x => String(x)),
      datasets: [
        {
          label: 'Theory H(n)',
          data: theoryH,
          borderColor: '#e8ff47',
          backgroundColor: 'rgba(232,255,71,0.05)',
          tension: 0.4,
          pointRadius: 4,
          pointBackgroundColor: '#e8ff47',
          borderWidth: 2,
          fill: true,
        },
        {
          label: 'Simulated',
          data: simH,
          borderColor: '#47b8ff',
          tension: 0.4,
          pointRadius: 4,
          pointBackgroundColor: '#47b8ff',
          borderWidth: 2,
          borderDash: [5, 4],
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: {
          ticks: { color: '#6b6867', font: { family: 'DM Mono', size: 10 } },
          grid: { color: 'rgba(255,255,255,0.04)' },
          border: { color: 'rgba(255,255,255,0.08)' },
        },
        y: {
          ticks: { color: '#6b6867', font: { family: 'DM Mono', size: 10 } },
          grid: { color: 'rgba(255,255,255,0.04)' },
          border: { color: 'rgba(255,255,255,0.08)' },
        },
      },
    },
  });
}

/* ── STEP-THROUGH ── */

function resetStep() {
  updateLabels();

  stepSeq   = shuffle(Array.from({ length: n }, (_, i) => i + 1));
  stepIdx   = 0;
  stepState = { best: -1, hires: 0 };

  const stream = $('stream');
  stream.innerHTML = '';

  for (let i = 0; i < n; i++) {
    const d = document.createElement('div');
    d.className = 'cand pending';
    d.id = 'sc' + i;
    d.title = 'Day ' + (i + 1);
    d.textContent = '?';
    stream.appendChild(d);
  }

  $('log').innerHTML = '<span class="log-empty">Stepping through ' + n + ' candidates… press "Step" to interview the next.</span>';
  $('mHires').textContent = '—';
  $('mCost').textContent  = '—';
}

function stepOne() {
  if (stepIdx === 0 && (!stepState || stepState.best === -1)) {
    resetStep();
  }

  if (stepIdx >= n) {
    addLog(
      '── All ' + n + ' candidates reviewed. Total hires: ' + stepState.hires +
      ' | Total cost: $' + (n * ci + stepState.hires * ch).toLocaleString(),
      'log-done'
    );
    return;
  }

  const qual = stepSeq[stepIdx];
  const el   = $('sc' + stepIdx);
  el.textContent = qual;

  if (qual > stepState.best) {
    // Demote previous best from "current" → "hired"
    for (let j = 0; j < stepIdx; j++) {
      const p = $('sc' + j);
      if (p && p.classList.contains('current')) p.className = 'cand hired';
    }

    stepState.best = qual;
    stepState.hires++;
    el.className = 'cand current';
    addLog(
      'Day ' + (stepIdx + 1) + ': #' + qual + ' → HIRED — new best!  Hires so far: ' + stepState.hires,
      'log-hire'
    );
  } else {
    el.className = 'cand interviewed';
    addLog(
      'Day ' + (stepIdx + 1) + ': #' + qual + ' → passed  (current best is #' + stepState.best + ')',
      'log-pass'
    );
  }

  stepIdx++;
  $('mHires').textContent = stepState.hires;
  $('mCost').textContent  = '$' + (Math.min(stepIdx, n) * ci + stepState.hires * ch).toLocaleString();
}

/** Fast-forward through all remaining candidates */
function runAll() {
  while (stepIdx < n) stepOne();
}

/* ── WIRE-UP ── */

['nSlider', 'ciSlider', 'chSlider', 'simSlider'].forEach(id => {
  $(id).addEventListener('input', updateLabels);
});

$('btnMC').addEventListener('click', runMonteCarlo);
$('btnStep').addEventListener('click', stepOne);
$('btnAll').addEventListener('click', runAll);
$('btnReset').addEventListener('click', resetStep);

// Init on page load
updateLabels();
resetStep();
