import fs from 'fs';
import { join } from 'path';
import { createHash } from 'crypto';

const paths = new Map();
const hashes = new Map();
const requireUpdate = [];
const nodeToPath = new Map();

export function loadPaths() {

  // Load all the hashes of the path files
  const hashLines = getLines(fs.readFileSync("path-hashes.txt", "utf8"));
  hashLines.forEach(line => {
    const [name, hash] = line.split(" ");
    if (!hash) { return; }
    hashes.set(name, hash);
  });

  const allPaths = fs.readdirSync("pathdefs");

  // Check for new paths
  allPaths.forEach(path => {
    const name = path.substring(0, path.length - 4);
    if (!hashes.has(name)) {
      console.log("Found new path: " + name);
      const filename = join("pathdefs", name + ".txt");
      const contents = fs.readFileSync(filename, "utf8");
      const hash = createHash('sha256').update(contents).digest('hex');
      fs.appendFileSync("path-hashes.txt", name + " " + hash + "\n");
      hashes.set(name, hash);
    }
  });

  // Gather the details for each path
  for (const [name, hash] of hashes.entries()) {
    const filename = join("pathdefs", name + ".txt");
    const contents = fs.readFileSync(filename, "utf8");
    const actualHash = createHash('sha256').update(contents).digest('hex')
    if (actualHash !== hash) {
      requireUpdate.push(name);
    }
    const lines = getLines(contents);
    const path = {
      name,
      href: "/node/" + name + ".html",
      humanReadableName: lines.shift(),
      description: lines.shift(),
      nodes: lines
    };
    paths.set(name, path);

    lines.forEach(node => {
      if (!nodeToPath.has(node)) {
        nodeToPath.set(node, []);
      }
      nodeToPath.get(node).push(path.name);
    });
  }
}

export function getPathsForNode(dom, titles, node) {
  const pathsForNode = nodeToPath.get(node) ?? [];
  const previous = [];
  const next = [];

  pathsForNode.forEach(pathName => {
    const path = paths.get(pathName);
    const index = path.nodes.indexOf(node);
    if (index > 0) {
      previous.push(createPathElement(dom, titles, path, index - 1));
    }
    if (index < path.nodes.length - 1) {
      next.push(createPathElement(dom, titles, path, index + 1));
    }
  });

  return { previous: previous.sort(), next: next.sort()};
}

function createPathElement(dom, titles, path, index) {
  const el = dom.createElement("a");
  const name = path.nodes[index];
  el.href = "/node/" + name + ".html";
  el.textContent = titles.get(el.href) + " (" + path.humanReadableName + ")";
  return el;
}

function getLines(contents) {
  return contents.replaceAll("\r", "").split("\n").map(line => line.trim()).filter(line => line.length > 0);
}

export function generatePaths(regenAll, titles) {
  const pathsToGenerate = regenAll ? [...paths.keys()] : pathsToGenerate;
  const template = fs.readFileSync("path-template.html", "utf8");

  pathsToGenerate.forEach(pathName => {
    const path = paths.get(pathName);

    const body = path.nodes.map(name => {
      const href = "/node/" + name + ".html";      
      return `<li><a href="${href}">${titles.get(href)}</a></li>\n`;
    }).join("");
    console.log(body);

    const data = template.replaceAll("{title}", path.humanReadableName).replaceAll("{description}", path.description).replaceAll("{body}", body);
    fs.writeFileSync(join("path", path.name + ".html"), data);
  });
}
