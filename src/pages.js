import { projects } from "./projects.js";

export const featuredIds = ["finance", "london", "hedge-fund"];
export const projectUrl = (project) => `/projects/${project.id}/`;
export const homeAbout = `<section class="home-about wrap"><p class="eyebrow">ABOUT ME</p><h2>From business questions<br>to the systems <em>behind them.</em></h2><p>I started as a business intelligence analyst, organising sales records, invoices, and spreadsheets so people could make sense of their business. Today I build the pipelines, lakehouses, and infrastructure that make that analysis possible.</p><a href="/about/" class="text-link">More about my journey ↗</a></section>`;
export const collectionHeading =
  '<div><p class="eyebrow">PROJECTS</p><h1>Projects</h1></div><p>Explore the business problem, implementation, and current status of each project.</p>';

export function projectPage(p) {
  return `<article class="case-study wrap">
    <nav class="breadcrumbs" aria-label="Breadcrumb"><a href="/">Home</a><span>/</span><a href="/projects/">Projects</a><span>/</span><span aria-current="page">${p.name}</span></nav>
    <header class="case-header"><p class="eyebrow">${p.label}</p><h1>${p.name}</h1>
    ${p.status ? `<span class="project-status">${p.status}</span>` : ""}
    <p class="case-intro">${p.description}</p>
    <div class="tags">${p.tags.map((t) => `<span>${t}</span>`).join("")}</div></header>
    <div class="case-layout"><aside class="case-index"><p class="eyebrow">ON THIS PAGE</p>
    <a href="#problem">The problem</a><a href="#modelling">Data and modelling</a><a href="#operation">Deployment and operation</a><a href="#results">Results and status</a>
    ${p.repo ? `<a class="text-link" href="https://github.com/Uche-anya/${p.repo}" target="_blank" rel="noopener noreferrer">View repository ↗</a>` : ""}</aside>
    <div class="case-body">
    <section id="problem"><h2>The problem</h2><p>${p.problem}</p></section>
    <div class="project-flow" aria-label="Pipeline stages">${p.flow.map((s) => `<span>${s}</span>`).join('<b aria-hidden="true">→</b>')}</div>
    <section id="modelling"><h2>${p.approachHeading || "Data and modelling"}</h2><p>${p.approach}</p></section>
    <section id="operation"><h2>${p.platformHeading || "Deployment and operation"}</h2><p>${p.platform}</p></section>
    <section id="results"><h2>${p.resultHeading || "Results and current status"}</h2><p>${p.result}</p></section>
    <p class="source-note">${p.sourceNote || "Diagrams are illustrative."}</p></div></div>
    <div class="case-end"><a class="text-link" href="/projects/">← All projects</a><a class="text-link" href="${projectUrl(projects[(projects.indexOf(p) + 1) % projects.length])}">Next project →</a></div>
  </article>`;
}

export function setupPage() {
  const path = location.pathname.replace(/\/+$/, "") || "/";
  const home = path === "/" || path === "/index.html";
  const collection = path === "/projects";
  const about = path === "/about";
  const project = projects.find((p) => path === `/projects/${p.id}`);
  const main = document.querySelector("main");
  const selectedProjects = home
    ? featuredIds.map((id) => projects.find((p) => p.id === id))
    : collection
      ? projects
      : [];
  if (document.body.hasAttribute("data-prerendered"))
    return { home, collection, projects: selectedProjects };
  document.body.dataset.page = home
    ? "home"
    : collection
      ? "projects"
      : about
        ? "about"
        : "project";
  document.querySelector(".header nav").innerHTML =
    [
      ["/", "Home", home],
      ["/projects/", "Projects", collection || !!project],
      ["/about/", "About", about],
    ]
      .map(
        ([href, title, active]) =>
          `<a href="${href}"${active ? ' aria-current="page"' : ""}>${title}</a>`,
      )
      .join("") + '<a href="#contact" class="nav-contact">Contact ↗</a>';
  document.querySelector("footer .wordmark").href = "/";
  document.querySelector(".hero-actions .button").href = "/projects/";

  if (home) {
    document.querySelector(".filters").remove();
    document.querySelector("#about").outerHTML = homeAbout;
    const all = document.querySelector(".all-repos");
    all.href = "/projects/";
    all.removeAttribute("target");
    all.innerHTML = "<strong>Explore all 11 projects →</strong>";
    document.querySelector("#work .section-top > p").textContent =
      "Three projects across data platforms, environmental data, and financial modelling.";
  } else {
    document.querySelector(".hero").remove();
    document.querySelector(".stack-strip").remove();
    document.querySelector(".ownership").remove();
    if (collection) {
      document.querySelector("#about").remove();
      document.querySelector("#work .section-top").innerHTML =
        collectionHeading;
      document.title = "Projects — Uche Anya";
    } else if (about) {
      document.querySelector("#work").remove();
      const title = document.querySelector("#about-title");
      title.outerHTML = `<h1 id="about-title">${title.innerHTML}</h1>`;
      document.title = "About — Uche Anya";
    } else {
      document.querySelector("#work").remove();
      document.querySelector("#about").remove();
      main.insertAdjacentHTML(
        "afterbegin",
        project
          ? projectPage(project)
          : '<section class="wrap missing-page"><h1>Page not found</h1><p>Visit the homepage or explore the projects.</p><a class="text-link" href="/">Back home →</a></section>',
      );
      document.title = project
        ? `${project.name} — Uche Anya`
        : "Page not found — Uche Anya";
    }
  }
  document
    .querySelectorAll(".contact .eyebrow")
    .forEach((el) => (el.textContent = "CONTACT"));
  return { home, collection, projects: selectedProjects };
}
