# The Hiring Problem — Algorithm Simulator

> An interactive visualization of the classic **Hiring Problem** from *Introduction to Algorithms* (CLRS, §5.1) — featuring Monte Carlo simulation, day-by-day stepping, and probabilistic analysis.

![Preview](assets/preview.png)

## 🔗 Live Demo

**[hiring-problem.vercel.app](https://hiring-problem.vercel.app)** ← deploy your own below

---

## 🧠 The Problem

You need to hire the best engineer. An employment agency sends you **one candidate per day**. After each interview you must decide: hire them (and fire the current employee) or pass. You are committed to always having the best person in the role.

**Costs:**
- `cᵢ` — small fee paid to interview every candidate (unavoidable)
- `cₕ` — large fee paid each time you hire (fire old + place new)

**Question:** What is the expected total cost of this strategy?

---

## 📐 Algorithm (CLRS §5.1)

```
HIRE-ASSISTANT(n)
  best ← 0              // sentinel: rank 0 = worst possible
  for i ← 1 to n
    interview candidate i          // always pay cᵢ
    if candidate i better than best
      best ← i
      hire candidate i             // pay cₕ
```

### Complexity Analysis

| Case | Hires | Total Cost |
|------|-------|------------|
| **Best** | 1 (first candidate is best) | `n·cᵢ + cₕ` |
| **Worst** | n (sorted ascending input) | `n·cᵢ + n·cₕ` |
| **Expected** | H(n) ≈ ln n | `n·cᵢ + cₕ·ln n` |

### Why ln n? — Indicator Random Variables

Let `Xᵢ = 1` if candidate `i` is hired.

Candidate `i` is hired **iff** they are the best among the first `i` candidates. Under a uniformly random permutation, this probability is exactly `1/i`.

By linearity of expectation:

```
E[hires] = Σ(i=1 to n) E[Xᵢ] = Σ(i=1 to n) 1/i = H(n) ≈ ln n + γ
```

where γ ≈ 0.5772 is the Euler–Mascheroni constant.

**Expected cost:** `E[cost] = n·cᵢ + cₕ·H(n)`

---

## 🚀 Getting Started

### Run locally

```bash
git clone https://github.com/YOUR_USERNAME/hiring-problem.git
cd hiring-problem

# No build step needed — just open the file
open index.html
# or: npx serve .
```

### Deploy to Vercel (one command)

```bash
npm i -g vercel
vercel
```

### Deploy to Netlify

```bash
# Drag the project folder to https://app.netlify.com/drop
# or:
npm i -g netlify-cli
netlify deploy --prod --dir .
```

### Deploy to GitHub Pages

1. Push this repo to GitHub
2. Go to **Settings → Pages → Source → Deploy from branch**
3. Select `main` / `root`
4. Your site is live at `https://YOUR_USERNAME.github.io/hiring-problem`

---

## 📁 Project Structure

```
hiring-problem/
├── index.html          # Main page (nav, hero, simulator, theory, pseudocode)
├── css/
│   └── style.css       # All styles — dark terminal aesthetic, responsive
├── js/
│   └── simulator.js    # Algorithm logic, Monte Carlo, Chart.js charts
├── assets/
│   └── preview.png     # Screenshot for README
└── README.md
```

---

## ✨ Features

- **Monte Carlo simulation** — run up to 3,000 trials, see the full cost distribution histogram
- **Day-by-day stepping** — watch each candidate get interviewed with live log output
- **Theory vs simulation chart** — compare H(n) analytical bound against empirical results
- **Adjustable parameters** — n (candidates), cᵢ (interview cost), cₕ (hire cost), simulation count
- **Zero dependencies** — pure HTML/CSS/JS + Chart.js CDN. No build step, no framework.
- **Responsive** — works on mobile and desktop

---

## 📚 References

- Cormen, Leiserson, Rivest, Stein — *Introduction to Algorithms*, 4th ed., §5.1–5.2
- [Harmonic Numbers](https://en.wikipedia.org/wiki/Harmonic_number)
- [Indicator Random Variables](https://en.wikipedia.org/wiki/Indicator_function)

---

## 📄 License

MIT — use freely, attribution appreciated.
