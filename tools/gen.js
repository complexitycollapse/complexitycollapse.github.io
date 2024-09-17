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

  const revisionHashes = fs.readdirSync(dirName).map(f => getHash(fs.readFileSync(path.join(dirName, f), "utf8")));

  if (!revisionHashes.includes(hash)) {
    console.log("New revision found for " + filename);
    const revisionName = path.join(dirName, (new Date()).toISOString().replaceAll(":", "-") + ".md");
    console.log(revisionName);
    fs.writeFileSync(revisionName, note, { flush: true });

    const body = converter.makeHtml(note);
    const dom = new JSDOM(body);
    const title = dom.window.document.getElementsByTagName("h1")[0].textContent;

    const html = template.replace("{title}", title).replace("{body}", body);
    fs.writeFileSync(path.join("node", filenameWithoutExtension + ".html"), html);
  }
});
