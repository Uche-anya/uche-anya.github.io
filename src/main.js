import "./style.css";
import "./refinements.css";
import { playIntro } from "./intro.js";
import { projects } from "./projects.js";
import { setupPage, projectUrl } from "./pages.js";
import "./pages.css";
const page = setupPage();
const introFinished = page.home ? playIntro() : undefined;
const charts = {
  azure: `<div class="lakehouse">${["BRONZE", "SILVER", "GOLD"].map((t, i) => `<div><i>▤</i><b>${t}</b><small>${["Raw & ingested", "Clean & structured", "Reporting tables"][i]}</small></div>${i < 2 ? "<span>→</span>" : ""}`).join("")}</div>`,
  rides: `<div class="ride-visual"><div class="ring"><span>TRIP<br>INSIGHTS</span></div><div class="bars">${[35, 56, 43, 74, 63, 91, 80, 100, 76, 58, 70, 88].map((h) => `<i style="height:${h}%"></i>`).join("")}</div></div>`,
  air: '<div class="air-visual"><div class="orbit"></div><div class="orbit two"></div><div class="orbit three"></div><span class="air-core">AQI<small>POLLUTANT METRICS</small></span><span class="pollutant p1">PM₂.₅</span><span class="pollutant p2">NO₂</span><span class="pollutant p3">PM₁₀</span></div>',
  finance:
    '<svg class="chart" viewBox="0 0 450 150" aria-hidden="true"><path d="M0 30h450M0 70h450M0 110h450" stroke="#ffffff18"/><path d="m0 123 28-15 25 9 29-34 24 10 30-35 27 20 28-32 25 10 30-25 28 12 27-24 28 7 30-20 40 8" fill="none" stroke="#b8ce9a" stroke-width="3"/><path d="m0 132 28-7 25 6 29-18 24 4 30-9 27 8 28-20 25 8 30-16 28 9 27-16 28 10 30-22 40 4" fill="none" stroke="#cf9a68" stroke-width="2"/></svg>',
  london:
    '<svg class="chart" viewBox="0 0 600 150" aria-hidden="true"><path d="M0 35h600M0 75h600M0 115h600M80 0v150M180 0v150M280 0v150M380 0v150M480 0v150" stroke="#aaa89540"/><path d="m0 105 20-10 20 20 20-45 20 15 20-40 20 32 20-20 20 45 20-10 20 30 20-20 20 10 20-25 20 7 20-44 20 13 20-30 20 42 20-15 20 26 20-10 20 25 20-5 20-35 20 10 20-48 20 24 20-12 20 35" fill="none" stroke="#557a6a" stroke-width="2"/><path d="M0 127Q60 130 120 99T240 99T360 70T480 106T600 68" fill="none" stroke="#bd7049" stroke-width="2"/></svg>',
};
const total = String(projects.length).padStart(2, "0");
document
  .querySelectorAll("[data-project-count]")
  .forEach((el) => (el.textContent = total));
document.querySelectorAll("[data-platform-count]").forEach((el) => {
  el.textContent = String(
    projects.filter((p) => p.platforms.includes(el.dataset.platformCount))
      .length,
  ).padStart(2, "0");
});
const platformArt = (p) =>
  '<div class="platform-art">' +
  p.flow
    .map((label, i) => "<span><b>0" + (i + 1) + "</b>" + label + "</span>")
    .join('<i aria-hidden="true">↓</i>') +
  "</div>";
const grid = document.querySelector("#project-grid");
if (grid)
  grid.innerHTML = page.projects
    .map((p, i) => {
      const number = String(i + 1).padStart(2, "0");
      const hasDetails = Boolean(p.approach);
      const badge = p.status
        ? '<span class="project-status">' + p.status + "</span>"
        : "";
      const visual = p.flow.length
        ? charts[p.id] || platformArt(p)
        : '<div class="development-art"><span>IN DEVELOPMENT</span><strong>' +
          p.name +
          "</strong></div>";
      const title = hasDetails
        ? '<a class="project-open" href="' +
          projectUrl(p) +
          '" data-project="' +
          p.id +
          '" aria-label="Read case study: ' +
          p.name +
          '">' +
          p.title +
          "</a>"
        : p.title;
      const content = `<div class="project-visual" aria-hidden="true"><div class="mini-label">${p.name.toUpperCase()}<span>FIG. ${number}</span></div>${visual}<div class="mini-bottom">${p.status ? "WORK IN PROGRESS" : p.categories.includes("platform") ? "BUILD → DEPLOY → OPERATE" : "MODEL → VALIDATE → APPLY"}<span>${p.flow.length ? "ILLUSTRATIVE" : ""}</span></div></div><div class="project-content">${badge}<div class="project-kicker"><span>${p.label}</span><span>${number} / ${total}</span></div><div class="project-heading"><h3>${title}</h3>${hasDetails ? '<span aria-hidden="true">↗</span>' : ""}</div><p>${p.description}</p><div class="tags">${p.tags.map((t) => "<span>" + t + "</span>").join("")}</div>${hasDetails ? '<span class="case-link">' + "Read project" + " ↗</span>" : ""}</div>`;
      return `<article class="project-card ${p.id}" data-project-id="${p.id}" data-categories="${p.categories.join(" ")}">${content}</article>`;
    })
    .join("");
document.querySelectorAll("[data-filter]").forEach((button) =>
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    document.querySelectorAll("[data-filter]").forEach((b) => {
      b.classList.toggle("active", b === button);
      b.setAttribute("aria-pressed", String(b === button));
    });
    let count = 0;
    document.querySelectorAll(".project-card").forEach((card) => {
      const project = projects.find((p) => p.id === card.dataset.projectId);
      card.hidden =
        filter === "wip"
          ? project.status !== "Work in progress"
          : filter !== "all" &&
            !project.categories.includes(filter) &&
            !project.platforms.includes(filter);
      if (!card.hidden) count++;
    });
    const label = button.childNodes[0].textContent.trim();
    document.querySelector("#filter-status").textContent =
      `${label}: ${count} project${count === 1 ? "" : "s"}`;
  }),
);
document.querySelector("#year").textContent = new Date().getFullYear();

Promise.resolve(introFinished)
  .then(() => import("./motion.js"))
  .catch(() => {
    // The portfolio remains usable if the optional motion layer cannot load.
    document.documentElement.classList.add("motion-paused");
  });
