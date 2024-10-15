import showdown from 'showdown';
import fs from 'fs';
import path from 'path';
import { createHash } from 'crypto';
import { JSDOM } from 'jsdom';
import * as paths from './gen-paths.js';

let regenAll = false;

if (process.argv.includes("--regen")) {
  regenAll = true;
  console.log("Regenerating all HTML");
}

function getHash(note) {
  return createHash('sha256').update(note).digest('hex');
}

function createIncoming(dom, href, text) {
  const el = dom.createElement("a");
  el.href = href;
  el.textContent = text;
  el.classList.add("incoming");
  return el;
}

const notesFiles = fs.readdirSync("notes");
const nodeDirs = fs.readdirSync("revisions", { withFileTypes: true }).filter(d => d.isDirectory()).map(d => d.name);
const converter = new showdown.Converter({ simplifiedAutoLink: true, disableForced4SpacesIndentedSublists: true });
const template = fs.readFileSync("node-template.html", "utf8");

notesFiles.forEach(filename => {
  const note = fs.readFileSync(path.join("notes", filename), "utf8");
  const hash = getHash(note);
  const filenameWithoutExtension = filename.replace(".md", "");
  const dirName = path.join("revisions", filenameWithoutExtension);
  const htmlFilename = path.join("node", filenameWithoutExtension + ".html");
  
  if (!nodeDirs.includes(filenameWithoutExtension)) {
    console.log("New note found: " + filename);
    fs.mkdirSync(dirName);
    nodeDirs.push(filenameWithoutExtension);
  }

  const revisionFilenames = fs.readdirSync(dirName).sort();
  let previousRevision = undefined;

  if (!regenAll && revisionFilenames.length > 0) {
    previousRevision = fs.readFileSync(path.join(dirName, revisionFilenames[revisionFilenames.length - 1]), "utf8");
    if (getHash(previousRevision) === hash) {
      return;
    }
  }

  // Create new revision
  if (!regenAll) {
    console.log("New revision found for " + filename);
    const revisionName = path.join(dirName, (new Date()).toISOString().replaceAll(":", "_") + ".md");
    fs.writeFileSync(revisionName, note, { flush: true });
  }

  // Make HTML
  const body = converter.makeHtml(note);
  const dom = new JSDOM(body).window.document;
  const title = dom.getElementsByTagName("h1")[0].textContent;

  const html = template.replace("{title}", title).replace("{body}", body);
  fs.writeFileSync(htmlFilename, html);

  const outgoingLinks = Array.from(dom.getElementsByTagName("a")).filter(l => l.href.startsWith("/node/"));
  fs.writeFileSync(path.join("links", filenameWithoutExtension + ".txt"), JSON.stringify(
    [{ title, homeHref: "/" + htmlFilename.replaceAll("\\", "/") }].concat(outgoingLinks.map(l => l.href))));
});

// Handle reverse linking and paths

paths.loadPaths();

const allLinks = new Map();
const titles = new Map();

nodeDirs.map(d => JSON.parse(fs.readFileSync(path.join("links", d + ".txt")))).forEach(out => {
  const { title, homeHref } = out.shift();
  titles.set(homeHref, title);
  out.forEach(href => {
    if (!allLinks.has(href)) {
      allLinks.set(href, []);
    }
    allLinks.get(href).push(homeHref);
  });
});

nodeDirs.map(d => {
  const htmlFilename = path.join("node", d + ".html");
  const href = "/node/" + d + ".html";
  const incoming = allLinks.get(href) ?? [];
  incoming.sort();

  const dom = new JSDOM(fs.readFileSync(htmlFilename, "utf8")).window.document;

  if (incoming.length === 0) {
    const container = dom.getElementsByClassName("incoming")[0];
    container.classList.add("hidden");
  }

  const incomingNode = dom.getElementsByClassName("incoming-links-list")[0];
  incomingNode.innerHTML = "";

  incoming.forEach(linkHref => {
    const title = titles.get(linkHref);
    const child = createIncoming(dom, linkHref, title);
    if (incomingNode.lastChild) {
      incomingNode.insertAdjacentHTML('beforeend', ",&nbsp;");
    }
    incomingNode.appendChild(child);
  });

  const previousPathsNode = dom.getElementsByClassName("previous-paths-list")[0];
  previousPathsNode.innerHTML = "";
  const nextPathsNode = dom.getElementsByClassName("next-paths-list")[0];
  nextPathsNode.innerHTML = "";

  const { next, previous } = paths.getPathsForNode(dom, titles, d);
  previous.forEach(el => previousPathsNode.appendChild(el));
  next.forEach(el => nextPathsNode.appendChild(el));

  fs.writeFileSync(htmlFilename, "<!DOCTYPE html>\n" + dom.documentElement.outerHTML);
});

paths.generatePaths(regenAll, titles);
