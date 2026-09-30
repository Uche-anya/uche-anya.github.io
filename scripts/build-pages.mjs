import { readFile, writeFile, mkdir } from "node:fs/promises";
import { projects } from "../src/projects.js";
import { homeAbout, collectionHeading, projectPage } from "../src/pages.js";

const template = await readFile("dist/index.html", "utf8");
const getSection = (className) => {
  const match = template.match(
    new RegExp(`<section class="${className}[^]*?<\\/section>`),
  );
  if (!match) throw new Error(`Missing section: ${className}`);
  return match[0];
};
const hero = getSection("hero").replace('href="#work"', 'href="/projects/"');
const ownership = getSection("ownership");
const work = getSection("work");
const about = getSection("about");
const contact = getSection("contact").replace("03 / CONTACT", "CONTACT");
const stripStart = template.indexOf('<div class="stack-strip');
const stripEnd = template.indexOf('<section class="ownership');
if (stripStart < 0) throw new Error("Missing technology strip");
const strip = template.slice(stripStart, stripEnd);
const routes = [
  { path: "", page: "home", title: "Uche Anya — Data Engineer & BI Engineer" },
  { path: "projects", page: "projects", title: "Projects — Uche Anya" },
  { path: "about", page: "about", title: "About — Uche Anya" },
  ...projects.map((p) => ({
    path: `projects/${p.id}`,
    page: "project",
    title: `${p.name} — Uche Anya`,
    project: p,
  })),
];
for (const route of routes) {
  let content;
  if (route.page === "home") {
    const selected = work
      .replace(/<div class="filters"[^]*?<\/div>/, "")
      .replace(
        /<a\s+class="all-repos"[^]*?<\/a>/,
        '<a class="all-repos" href="/projects/"><strong>Explore all 11 projects →</strong></a>',
      )
      .replace(
        /A selection of my own engineering projects\.[^]*?implementation and current status\./,
        "Three projects across data platforms, environmental data, and financial modelling.",
      );
    content = hero + strip + ownership + selected + homeAbout + contact;
  } else if (route.page === "projects") {
    content =
      work.replace(
        /<div class="section-top">[^]*?<div class="filters"/,
        `<div class="section-top">${collectionHeading}</div><div class="filters"`,
      ) + contact;
  } else if (route.page === "about") {
    content =
      about.replace(
        /<h2 id="about-title">([^]*?)<\/h2>/,
        '<h1 id="about-title">$1</h1>',
      ) + contact;
  } else content = projectPage(route.project) + contact;
  const nav = [
    ["/", "Home", route.page === "home"],
    [
      "/projects/",
      "Projects",
      route.page === "projects" || route.page === "project",
    ],
    ["/about/", "About", route.page === "about"],
  ]
    .map(
      ([href, label, active]) =>
        `<a href="${href}"${active ? ' aria-current="page"' : ""}>${label}</a>`,
    )
    .join("");
  let html = template
    .replace(
      /<main id="main">[^]*?<\/main>/,
      `<main id="main">${content}</main>`,
    )
    .replace(
      /<nav aria-label="Main navigation">[^]*?<\/nav>/,
      `<nav aria-label="Main navigation">${nav}<a href="#contact" class="nav-contact">Contact ↗</a></nav>`,
    )
    .replace("<body>", `<body data-page="${route.page}" data-prerendered>`)
    .replace(/<title>[^]*?<\/title>/, `<title>${route.title}</title>`)
    .replace('class="wordmark" href="#"', 'class="wordmark" href="/"');
  if (route.project)
    html = html.replace(
      /(name="description"\s+content=")[^"]*/,
      `$1${route.project.description}`,
    );
  const dir = route.path ? `dist/${route.path}` : "dist";
  await mkdir(dir, { recursive: true });
  await writeFile(`${dir}/index.html`, html);
}
console.log(`Built ${routes.length} pages with direct URLs.`);
