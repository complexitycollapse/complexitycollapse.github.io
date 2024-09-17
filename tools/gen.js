import showdown from 'showdown';
import fs from 'fs';
import path from 'path';
import { createHash } from 'crypto';
import { JSDOM } from 'jsdom';

function getHash(note) {
  return createHash('sha256').update(note).digest('hex');
}

const notesFiles = fs.readdirSync("notes");
const nodeDirs = fs.readdirSync("revisions", { withFileTypes: true }).filter(d => d.isDirectory()).map(d => d.name);
const converter = new showdown.Converter();
const template = fs.readFileSync("template.html", "utf8");

notesFiles.forEach(filename => {
  const note = fs.readFileSync(path.join("notes", filename), "utf8");
  const hash = getHash(note);
  const filenameWithoutExtension = filename.replace(".md", "");
  const dirName = path.join("revisions", filenameWithoutExtension);
  
  if (!nodeDirs.includes(filenameWithoutExtension)) {
    console.log("New note found: " + filename);
    fs.mkdirSync(dirName);
  }

  const revisionFilenames = fs.readdirSync(dirName).sort();
  const revisions = revisionFilenames.map(f => fs.readFileSync(path.join(dirName, f), "utf8"));
  const previousRevisionFilename = revisionFilenames[revisionFilenames.length - 1];
  const previousRevision = revisions[revisions.length - 1];

  if (getHash(previousRevision) === hash) {
    return;
  }

  // Create new revision
  console.log("New revision found for " + filename);
  const revisionName = path.join(dirName, (new Date()).toISOString().replaceAll(":", "_") + ".md");
  fs.writeFileSync(revisionName, note, { flush: true });

  // Make HTML
  const body = converter.makeHtml(note);
  const dom = new JSDOM(body);
  const oldDom = new JSDOM(fs.readFileSync(path.join("node", previousRevisionFilename + ".html"), "utf8"));
  const title = dom.window.document.getElementsByTagName("h1")[0].textContent;
  const html = template.replace("{title}", title).replace("{body}", body);

  // Two-way links
  const newLinks = dom.window.document.getElementsByTagName("a").filter(l => l.href.startsWith("/node/"));
  const oldLinks = oldDom.window.document.getElementsByTagName("a").filter(l => l.href.startsWith("/node/"));
  const addedLinks = newLinks.filter(l => !oldLinks.find(l2 => l2.href === l.href));
  console.log(newLinks);

  fs.writeFileSync(path.join("node", filenameWithoutExtension + ".html"), html);
});
