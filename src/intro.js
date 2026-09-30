import "./intro.css";

export function playIntro() {
  const preference = matchMedia("(prefers-reduced-motion: reduce)");
  if (preference.matches) return;
  try {
    if (localStorage.getItem("portfolio-motion") === "paused") return;
  } catch {}

  const intro = document.createElement("dialog");
  intro.className = "intro";
  intro.setAttribute("aria-label", "Welcome to Uche Anya’s portfolio");
  intro.innerHTML = `
    <div class="welcome-screen">
      <svg class="welcome-medallion" viewBox="0 0 560 620" role="img" aria-label="Animated medallion architecture: raw data in Bronze, cleaned data in Silver, and reporting tables in Gold">
        <defs>
          <linearGradient id="bronze-surface" x2="1" y2="1"><stop stop-color="#a87954"/><stop offset="1" stop-color="#584436"/></linearGradient>
          <linearGradient id="silver-surface" x2="1" y2="1"><stop stop-color="#a5b4ac"/><stop offset="1" stop-color="#465c51"/></linearGradient>
          <linearGradient id="gold-surface" x2="1" y2="1"><stop stop-color="#c5b273"/><stop offset="1" stop-color="#6a6036"/></linearGradient>
          <pattern id="medallion-grid" width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="1" fill="#d3dcc4" opacity=".12"/></pattern>
        </defs>
        <rect width="560" height="620" fill="url(#medallion-grid)" class="medallion-grid"/>
        <g class="medallion-traces" fill="none">
          <path d="M58 37 120 68M96 18 155 48M136 0 190 28"/>
          <path d="M405 137 480 175Q500 185 480 196L405 237"/>
          <path d="M155 327 80 365Q60 375 80 386L155 427"/>
          <path d="m405 517 62 33M375 532l62 33M345 547l62 33"/>
        </g>
        <g class="medallion-layer medallion-bronze">
          <path class="medallion-side" d="m115 105 165 83 165-83v24l-165 83-165-83Z" fill="#584032"/>
          <path class="medallion-face" d="m115 105 165-83 165 83-165 83Z" fill="url(#bronze-surface)"/>
          <g class="medallion-records" stroke="#eed2b8"><path d="m213 91 45-23 23 12-45 23Zm31 16 45-23 23 12-45 23Zm31 16 45-23 23 12-45 23Z"/></g>
          <text class="medallion-title" x="66" y="184">BRONZE</text><text class="medallion-caption" x="66" y="203">Raw records</text>
        </g>
        <g class="medallion-layer medallion-silver">
          <path class="medallion-side" d="m115 295 165 83 165-83v24l-165 83-165-83Z" fill="#40594c"/>
          <path class="medallion-face" d="m115 295 165-83 165 83-165 83Z" fill="url(#silver-surface)"/>
          <g class="medallion-records" stroke="#e0e9de"><path d="m213 295 67-34 67 34-67 34Zm22-11 67 34m-44-45 67 34m-90 0 67-34m-44 45 67-34"/></g>
          <text class="medallion-title" x="342" y="374">SILVER</text><text class="medallion-caption" x="342" y="393">Cleaned &amp; validated</text>
        </g>
        <g class="medallion-layer medallion-gold">
          <path class="medallion-side" d="m115 485 165 83 165-83v24l-165 83-165-83Z" fill="#62552f"/>
          <path class="medallion-face" d="m115 485 165-83 165 83-165 83Z" fill="url(#gold-surface)"/>
          <g class="medallion-records" stroke="#f4e3af"><path d="m226 490 24 12v-24l-24-12Zm42 0 24 12v-43l-24-12Zm42 0 24 12v-62l-24-12Z"/></g>
          <text class="medallion-title" x="66" y="564">GOLD</text><text class="medallion-caption" x="66" y="583">Reporting tables</text>
        </g>
        <circle class="medallion-packet bronze-packet" r="4"/>
        <circle class="medallion-packet silver-packet" r="4"/>
        <circle class="medallion-packet source-packet" r="3"/>
        <circle class="medallion-packet output-packet" r="3"/>
      </svg>
      <div class="welcome-content">
        <span class="welcome-label"><i aria-hidden="true"></i> DATA & BI ENGINEERING</span>
        <h2 class="welcome-title">Welcome<span>.</span></h2>
        <button class="welcome-enter" type="button" autofocus>Enter portfolio <span aria-hidden="true">↗</span></button>
      </div>
      <div class="welcome-footer"><button class="intro-skip" type="button">Skip intro <span aria-hidden="true">↗</span></button></div>
    </div>
    <div class="intro-frame" hidden>
      <div class="intro-stage" aria-hidden="true">
        <div class="intro-counter"><span class="intro-number">0</span><span class="intro-percent">%</span></div>
        <svg class="intro-pipeline" viewBox="0 0 600 200" fill="none">
          <g class="pipe-branches"><path d="M50 40h65q20 0 20 20v20q0 20 20 20h35"/><path d="M50 160h65q20 0 20-20v-20q0-20 20-20h35"/><path d="M450 100h20q20 0 20-20V60q0-20 20-20h40"/><path d="M450 100h20q20 0 20 20v20q0 20 20 20h40"/></g>
          <path class="pipe-base" d="M50 100H550"/>
          <path class="pipe-fill" pathLength="100" d="M50 100H550"/>
          <g class="pipe-node" data-at="0"><rect x="28" y="78" width="44" height="44" rx="10"/><path d="M40 94h20m-20 12h20"/></g>
          <g class="pipe-node" data-at="0.3"><rect x="178" y="78" width="44" height="44" rx="10"/><path d="m190 100 10-10 10 10-10 10Z"/></g>
          <g class="pipe-node" data-at="0.6"><rect x="328" y="78" width="44" height="44" rx="10"/><ellipse cx="350" cy="92" rx="10" ry="4"/><path d="M340 92v14c0 6 20 6 20 0V92m-20 7c0 6 20 6 20 0"/></g>
          <g class="pipe-node" data-at="1"><rect x="528" y="78" width="44" height="44" rx="10"/><path d="M540 110V99m10 11V90m10 20V96"/></g>
          <g class="pipe-endpoints"><circle cx="50" cy="40" r="5"/><circle cx="50" cy="160" r="5"/><circle cx="550" cy="40" r="5"/><circle cx="550" cy="160" r="5"/></g>
          <circle class="pipe-packet" cx="50" cy="100" r="4"/>
        </svg>
      </div>
      <div class="intro-bottom">
        <div class="intro-track" role="progressbar" aria-label="Intro progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><i></i></div>
        <div class="intro-footer"><button class="intro-skip" type="button">Skip intro <span aria-hidden="true">↗</span></button></div>
      </div>
    </div>`;
  document.body.append(intro);
  document.documentElement.classList.add("intro-active");
  let resolveIntro;
  const finished = new Promise((resolve) => {
    resolveIntro = resolve;
  });
  let done = false;
  let frame = 0;
  const timers = [];
  function finish(immediate = false) {
    if (done) return;
    done = true;
    cancelAnimationFrame(frame);
    timers.forEach(clearTimeout);
    preference.removeEventListener("change", onPreference);
    const remove = () => {
      intro.close();
      intro.remove();
      document.documentElement.classList.remove("intro-active");
      resolveIntro();
    };
    if (immediate) remove();
    else {
      intro.classList.add("intro-exit");
      setTimeout(remove, 650);
    }
  }
  function onPreference(event) {
    if (event.matches) finish(true);
  }
  intro
    .querySelectorAll(".intro-skip")
    .forEach((button) => button.addEventListener("click", () => finish(true)));
  intro.addEventListener("cancel", (event) => {
    event.preventDefault();
    finish(true);
  });
  preference.addEventListener("change", onPreference);
  intro.showModal();
  const number = intro.querySelector(".intro-number");
  const progressbar = intro.querySelector(".intro-track");
  const line = progressbar.querySelector("i");
  const pipe = intro.querySelector(".pipe-fill");
  const packet = intro.querySelector(".pipe-packet");
  const nodes = intro.querySelectorAll(".pipe-node");
  let start = 0;
  let lastValue = -1;
  const nodeStates = [...nodes].map((node) => ({
    node,
    threshold: Number(node.dataset.at),
    filled: false,
  }));
  // The percentage tracks the intro timeline, not network downloads.
  function tick(now) {
    if (done) return;
    const progress = Math.min((now - start) / 4200, 1);
    const eased = progress;
    const value = Math.floor(eased * 100);
    if (value !== lastValue) {
      number.textContent = String(value);
      progressbar.setAttribute("aria-valuenow", String(value));
      lastValue = value;
    }
    line.style.transform = "scaleX(" + eased + ")";
    pipe.style.strokeDashoffset = String(100 - eased * 100);
    packet.setAttribute("cx", String(50 + eased * 500));
    nodeStates.forEach((state) => {
      if (!state.filled && eased >= state.threshold) {
        state.node.classList.add("is-filled");
        state.filled = true;
      }
    });
    if (progress < 1) frame = requestAnimationFrame(tick);
    else timers.push(setTimeout(() => finish(), 250));
  }
  const enter = intro.querySelector(".welcome-enter");
  enter.addEventListener("click", () => {
    if (enter.disabled || done) return;
    enter.disabled = true;
    intro.classList.add("welcome-leaving");
    timers.push(
      setTimeout(() => {
        if (done) return;
        intro.querySelector(".welcome-screen").hidden = true;
        intro.querySelector(".intro-frame").hidden = false;
        intro
          .querySelector(".intro-frame .intro-skip")
          .focus({ preventScroll: true });
        start = performance.now();
        frame = requestAnimationFrame(tick);
        timers.push(setTimeout(() => finish(true), 8000));
      }, 550),
    );
  });
  return finished;
}
