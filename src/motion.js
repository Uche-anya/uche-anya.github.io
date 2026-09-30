import "./motion.css";

const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
const finePointer = matchMedia("(hover: hover) and (pointer: fine)");
let paused = false;
try {
  paused = localStorage.getItem("portfolio-motion") === "paused";
} catch {}
let enabled = !reducedMotion.matches && !paused;
const animations = new Set();
const root = document.documentElement;

const control = document.createElement("button");
control.className = "motion-control";
control.type = "button";
document.body.append(control);
const progress = document.createElement("div");
progress.className = "reading-progress";
progress.setAttribute("aria-hidden", "true");
document.body.append(progress);

function animate(element, keyframes, options) {
  if (!enabled) return;
  const animation = element.animate(keyframes, options);
  animations.add(animation);
  animation.finished
    .then(() => animations.delete(animation))
    .catch(() => animations.delete(animation));
}

// Keep the original list readable to assistive technology; the moving copy is decorative.
const strip = document.querySelector(".stack-strip");
if (strip) {
  const list = strip.querySelector(":scope > div");
  const viewport = document.createElement("div");
  viewport.className = "tech-viewport";
  const track = document.createElement("div");
  track.className = "tech-track";
  list.className = "tech-set";
  list.replaceWith(viewport);
  viewport.append(track);
  track.append(list);
  const copy = list.cloneNode(true);
  copy.setAttribute("aria-hidden", "true");
  track.append(copy);
}

// SVG paths stay in the illustration's coordinate system at every screen size.
const svg = document.querySelector(".pipeline-art");
const ns = "http://www.w3.org/2000/svg";
const paths = [
  "M32 210 L112 165 L249 242 L389 164 L466 207",
  "M35 282 L112 238 L249 315 L389 236 L465 280",
];
if (svg)
  paths.forEach((d, index) => {
    const line = document.createElementNS(ns, "path");
    line.setAttribute("d", d);
    line.setAttribute("class", "signal-line");
    svg.append(line);
    const signal = document.createElementNS(ns, "circle");
    signal.setAttribute("r", "3");
    signal.setAttribute("class", "signal-packet");
    signal.style.offsetPath = `path('${d}')`;
    signal.style.animationDelay = `${index * -3}s`;
    svg.append(signal);
  });

const hero = document.querySelector(".hero-art");
const canvas = document.createElement("canvas");
canvas.className = "data-field";
canvas.setAttribute("aria-hidden", "true");
hero?.prepend(canvas);
const ctx = canvas.getContext("2d");
let width = 0,
  height = 0,
  frame = 0,
  inView = Boolean(hero),
  time = 0,
  last = 0;
const pointer = { x: -1000, y: -1000 };
// Fixed starting positions keep the illustration reproducible.
const nodes = Array.from({ length: 30 }, (_, i) => ({
  x: ((i * 73 + 19) % 997) / 997,
  y: ((i * 137 + 53) % 991) / 991,
  speed: 0.12 + (i % 5) * 0.025,
}));
function resize() {
  width = hero.clientWidth;
  height = hero.clientHeight;
  const ratio = Math.min(devicePixelRatio || 1, 2);
  canvas.width = width * ratio;
  canvas.height = height * ratio;
  if (ctx) ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  if (!frame) draw(0);
}
function draw(delta) {
  if (!ctx) return;
  time += delta;
  ctx.clearRect(0, 0, width, height);
  const points = nodes.map((n, i) => ({
    x: ((n.x + time * n.speed * 0.000018) % 1) * width,
    y: n.y * height + Math.sin(time * 0.00025 + i) * 12,
  }));
  for (let i = 0; i < points.length; i++) {
    const a = points[i];
    for (let j = i + 1; j < points.length; j++) {
      const b = points[j],
        distance = Math.hypot(a.x - b.x, a.y - b.y);
      if (distance < 90) {
        ctx.strokeStyle = `rgba(89,115,73,${(1 - distance / 90) * 0.2})`;
        ctx.lineWidth = 0.7;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }
    const near = Math.hypot(a.x - pointer.x, a.y - pointer.y) < 100;
    ctx.fillStyle = near ? "#c65c37" : "rgba(92,116,73,.38)";
    ctx.beginPath();
    ctx.arc(a.x, a.y, near ? 2.7 : 1.5, 0, Math.PI * 2);
    ctx.fill();
  }
}
function tick(timestamp) {
  frame = 0;
  if (!enabled || !inView || document.hidden) return;
  draw(last ? Math.min(timestamp - last, 40) : 0);
  last = timestamp;
  frame = requestAnimationFrame(tick);
}
function syncCanvas() {
  if (frame) cancelAnimationFrame(frame);
  frame = 0;
  last = 0;
  if (enabled && inView && !document.hidden)
    frame = requestAnimationFrame(tick);
  else draw(0);
}
if (hero) {
  new ResizeObserver(resize).observe(hero);
  new IntersectionObserver((entries) => {
    inView = entries[0].isIntersecting;
    syncCanvas();
  }).observe(hero);
}
document.addEventListener("visibilitychange", () => {
  root.classList.toggle("page-hidden", document.hidden);
  syncCanvas();
});

// Translate only decorative layers; text and click targets stay in place.
document.querySelectorAll(".hero-art,.project-card").forEach((target) => {
  const surface = target.querySelector(".project-visual") || target;
  target.addEventListener("pointermove", (event) => {
    if (!enabled || !finePointer.matches) return;
    const r = surface.getBoundingClientRect();
    const x = (event.clientX - r.left) / r.width,
      y = (event.clientY - r.top) / r.height;
    surface.style.setProperty("--pointer-x", `${x * 100}%`);
    surface.style.setProperty("--pointer-y", `${y * 100}%`);
    surface.style.setProperty("--rotate-x", `${(y - 0.5) * -7}deg`);
    surface.style.setProperty("--rotate-y", `${(x - 0.5) * 9}deg`);
    if (surface === hero) {
      pointer.x = event.clientX - r.left;
      pointer.y = event.clientY - r.top;
    }
  });
  target.addEventListener("pointerleave", () => {
    surface.style.setProperty("--rotate-x", "0deg");
    surface.style.setProperty("--rotate-y", "0deg");
    pointer.x = -1000;
    pointer.y = -1000;
  });
});

const observed = document.querySelectorAll(
  ".project-card,.ownership-grid article,.journey-grid article,.principles article,.section-top,.about-grid,.current-focus,.contact-row",
);
const revealed = new WeakSet();
const observer = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      entry.target.classList.toggle("is-in-view", entry.isIntersecting);
      if (entry.isIntersecting && !revealed.has(entry.target)) {
        revealed.add(entry.target);
        animate(
          entry.target,
          [
            { opacity: 0.15, translate: "0 28px" },
            { opacity: 1, translate: "0 0" },
          ],
          { duration: 700, easing: "cubic-bezier(.16,1,.3,1)" },
        );
      }
    }
  },
  { threshold: 0.08 },
);
observed.forEach((element, index) => {
  element.style.setProperty("--motion-index", index % 4);
  observer.observe(element);
});
document
  .querySelectorAll(".bars i,.platform-art>span,.platform-art>i")
  .forEach((element, index) =>
    element.style.setProperty("--item-index", index % 12),
  );
document
  .querySelectorAll('.chart path[fill="none"]')
  .forEach((path) => path.setAttribute("pathLength", "1"));

document.querySelectorAll("[data-filter]").forEach((button) =>
  button.addEventListener("click", () => {
    document
      .querySelectorAll(".project-card:not([hidden])")
      .forEach((card, index) =>
        animate(
          card,
          [
            { opacity: 0.35, scale: ".98" },
            { opacity: 1, scale: "1" },
          ],
          {
            duration: 350,
            delay: Math.min(index * 35, 180),
            easing: "ease-out",
          },
        ),
      );
  }),
);
let progressFrame = 0;
function updateProgress() {
  progressFrame = 0;
  const max = root.scrollHeight - innerHeight;
  progress.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
}
addEventListener(
  "scroll",
  () => {
    if (!progressFrame) progressFrame = requestAnimationFrame(updateProgress);
  },
  { passive: true },
);
addEventListener("resize", updateProgress);
updateProgress();

function syncPreference() {
  enabled = !reducedMotion.matches && !paused;
  root.classList.toggle("motion-enabled", enabled);
  root.classList.toggle("motion-paused", !enabled);
  control.textContent = enabled ? "Ⅱ Pause motion" : "▷ Motion off";
  control.setAttribute(
    "aria-label",
    enabled
      ? "Pause animations"
      : reducedMotion.matches
        ? "Animations off: reduced motion preference"
        : "Resume animations",
  );
  control.setAttribute("aria-pressed", String(!enabled));
  control.disabled = reducedMotion.matches;
  if (!enabled) {
    animations.forEach((animation) => animation.cancel());
    animations.clear();
    document.querySelectorAll(".hero-art,.project-visual").forEach((el) => {
      el.style.setProperty("--rotate-x", "0deg");
      el.style.setProperty("--rotate-y", "0deg");
    });
  }
  syncCanvas();
}
control.addEventListener("click", () => {
  paused = !paused;
  try {
    localStorage.setItem("portfolio-motion", paused ? "paused" : "enabled");
  } catch {}
  syncPreference();
});
reducedMotion.addEventListener("change", syncPreference);
syncPreference();
document.querySelectorAll(".hero-copy>*").forEach((el, index) =>
  animate(
    el,
    [
      { opacity: 0, translate: "0 22px" },
      { opacity: 1, translate: "0 0" },
    ],
    { duration: 850, delay: index * 90, easing: "cubic-bezier(.16,1,.3,1)" },
  ),
);
