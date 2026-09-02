import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const websiteRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const outputPath = path.join(
  websiteRoot,
  "src/content/extensions.generated.json",
);
const defaultLocalRoot = path.resolve(websiteRoot, "../misty-extensions");
const localRoot = path.resolve(
  process.env.MISTY_EXTENSIONS_DIR ?? defaultLocalRoot,
);
const remoteIndexUrl =
  "https://raw.githubusercontent.com/misty-org/misty-extensions/main/catalog/index.json";
const remoteInterfaceBaseUrl =
  "https://raw.githubusercontent.com/misty-org/misty-extensions/main/interface";
const interfaceOutputDirectory = path.join(
  websiteRoot,
  "src/generated/extensions",
);
const checkOnly = process.argv.includes("--check");

async function exists(candidate) {
  try {
    await access(candidate);
    return true;
  } catch {
    return false;
  }
}

async function readJsonFile(candidate) {
  return JSON.parse(await readFile(candidate, "utf8"));
}

async function readJsonUrl(url) {
  const response = await fetch(url, {
    headers: { accept: "application/json" },
  });
  if (!response.ok) {
    throw new Error(
      `Extension catalog request failed (${response.status} ${response.statusText}).`,
    );
  }
  return response.json();
}

async function readTextUrl(url) {
  const response = await fetch(url, { headers: { accept: "text/plain" } });
  if (!response.ok) {
    throw new Error(
      `Extension interface request failed (${response.status} ${response.statusText}).`,
    );
  }
  return response.text();
}

async function readInterfaceFile(fileName) {
  const localPath = path.join(localRoot, "interface", fileName);
  if (await exists(localPath)) return readFile(localPath, "utf8");
  return readTextUrl(`${remoteInterfaceBaseUrl}/${fileName}`);
}

async function loadCatalog() {
  const localIndexPath = path.join(localRoot, "catalog/index.json");
  if (await exists(localIndexPath)) {
    const index = await readJsonFile(localIndexPath);
    return Promise.all(
      index.map(async (item) => ({
        ...item,
        ...(await readJsonFile(
          path.join(localRoot, `catalog/${item.id}.json`),
        )),
      })),
    );
  }

  const index = await readJsonUrl(remoteIndexUrl);
  return Promise.all(
    index.map(async (item) => ({
      ...item,
      ...(await readJsonUrl(item.url)),
    })),
  );
}

function normalizedCatalog(entries) {
  return entries
    .filter((entry) => entry.published !== false && entry.status !== "removed")
    .map((entry) => ({
      id: entry.id,
      name: entry.name,
      version: entry.version ?? "",
      overview: entry.overview ?? "",
      status: entry.status ?? "available",
      featuredRank: entry.featured_rank ?? null,
      capabilities: entry.capabilities ?? [],
      whereItAppears: entry.where_it_appears ?? [],
      permissions: entry.permissions ?? [],
      gettingStarted: entry.getting_started ?? [],
      includedTools: (entry.included_tools ?? []).map((tool) =>
        typeof tool === "string" ? tool : tool.name,
      ),
      links: entry.links ?? [],
      verified: entry.verified === true,
      logoUrl: entry.logo_path ?? "",
      platforms: [
        ...new Set(
          (entry.install?.artifacts ?? [])
            .map((artifact) => artifact.platform)
            .filter(Boolean),
        ),
      ],
    }))
    .sort(
      (left, right) =>
        (left.featuredRank ?? Number.POSITIVE_INFINITY) -
          (right.featuredRank ?? Number.POSITIVE_INFINITY) ||
        left.name.localeCompare(right.name),
    );
}

function generatedCatalog(entries) {
  return `${JSON.stringify(entries, null, 2)}\n`;
}

const interfaceManifest = JSON.parse(await readInterfaceFile("manifest.json"));
if (
  interfaceManifest.schemaVersion !== 1 ||
  !Array.isArray(interfaceManifest.files) ||
  interfaceManifest.files.some(
    (fileName) =>
      typeof fileName !== "string" ||
      path.basename(fileName) !== fileName ||
      !/\.(?:css|ts|tsx)$/.test(fileName),
  )
) {
  throw new Error("The published extension interface manifest is invalid.");
}

const outputs = [
  {
    path: outputPath,
    content: generatedCatalog(normalizedCatalog(await loadCatalog())),
  },
  ...(await Promise.all(
    interfaceManifest.files.map(async (fileName) => ({
      path: path.join(interfaceOutputDirectory, fileName),
      content: await readInterfaceFile(fileName),
    })),
  )),
];

const staleOutputs = [];
for (const output of outputs) {
  const current = (await exists(output.path))
    ? await readFile(output.path, "utf8")
    : "";
  if (current !== output.content) staleOutputs.push(output);
}

if (checkOnly) {
  if (staleOutputs.length) {
    console.error(
      "The website extension interface is out of date. Run `npm run sync:extensions`.",
    );
    process.exitCode = 1;
  } else {
    console.log("The website extension interface is current.");
  }
} else if (!staleOutputs.length) {
  console.log("The website extension interface is already current.");
} else {
  for (const output of staleOutputs) {
    await mkdir(path.dirname(output.path), { recursive: true });
    await writeFile(output.path, output.content, "utf8");
  }
  console.log("Updated the website extension catalog and shared interface.");
}
