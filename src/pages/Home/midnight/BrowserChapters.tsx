import { Bookmark, Check, ChevronDown, History, Puzzle, Search } from "lucide-react";
import { Chapter } from "./Chapter";
import { Tile, Tiles } from "./Tiles";

/**
 * The Browser part of the homepage story: the native engine and the basics, then
 * sync (in Chapters.tsx). Agents belong to the Work part, so nothing here mentions them.
 * Engine, extension and import claims follow SELLING-POINTS.md and misty/src-tauri.
 */

/** The engine as a diff from a typical browser to Misty: same app and OS, a different engine underneath. */
const ENGINE_DIFF: { op?: "add" | "del"; line: number; text: string }[] = [
  { line: 1, text: "app: tabs, layouts, sync" },
  { op: "del", line: 2, text: "engine: bundled with the app" },
  { op: "del", line: 3, text: "updates: shipped with the app" },
  { op: "add", line: 2, text: "engine: built into your system" },
  { op: "add", line: 3, text: "updates: from Apple and Microsoft" },
  { line: 4, text: "os: macOS or Windows" },
];

function EngineDiff() {
  return (
    <div className="mist-diff-card">
      <small>typical browser → Misty</small>
      <ol className="mist-diff" aria-label="Misty uses the web engine built into macOS and Windows; a typical browser bundles its own">
        {ENGINE_DIFF.map(({ op, line, text }) => (
          <li key={`${op ?? "ctx"}-${line}`} data-op={op}>
            <span aria-hidden>{line}</span>
            <span aria-hidden>{op === "add" ? "+" : op === "del" ? "−" : ""}</span>
            <span>{text}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

/** What an extension asks for, shown before it installs. Private browsing starts off. */
function ExtensionAccess() {
  return (
    <div className="mist-tile-sheet" aria-hidden="true">
      <header><Puzzle size={16} strokeWidth={1.75} /><i /><small>Firefox Add-ons</small></header>
      <div><b>Read pages</b><small>Asks first</small></div>
      <div><b>Store data</b><small>Allowed</small></div>
      <div data-active><b>Private browsing</b><small>Off</small></div>
    </div>
  );
}

/**
 * The import sheet: pick a browser, see what it has, bring it over. Categories follow the importer's
 * preview in misty/src-tauri/src/infra/browser_import (bookmarks, history, sign-ins, settings).
 */
const IMPORT_ITEMS: [string, string][] = [
  ["Bookmarks", "1,284 links"],
  ["History", "9,320 pages"],
  ["Sign-ins", "86 sites"],
  ["Settings", "Search engine, homepage"],
];

export function ImportSheet() {
  return (
    <div className="mist-tile-import" aria-hidden="true">
      <header>
        <small>Import from</small>
        <span>Chrome<ChevronDown size={14} strokeWidth={1.75} /></span>
      </header>
      <ul>
        {IMPORT_ITEMS.map(([name, count]) => (
          <li key={name}><Check size={14} strokeWidth={2} /><b>{name}</b><small>{count}</small></li>
        ))}
      </ul>
      <footer><span>Import</span></footer>
    </div>
  );
}

/** The address bar with a bookmark, a visited page and a search suggested underneath. */
export function AddressBar() {
  return (
    <div className="mist-tile-omnibox" aria-hidden="true">
      <div className="mist-tile-omnibox-input"><Search size={16} strokeWidth={1.75} />misty docs<i /></div>
      <ul>
        <li><Bookmark size={16} strokeWidth={1.75} /><b>Misty Docs</b><small>Bookmark</small></li>
        <li><History size={16} strokeWidth={1.75} /><b>Getting started</b><small>Yesterday</small></li>
        <li><Search size={16} strokeWidth={1.75} /><b>Web search</b><small>Your pick</small></li>
      </ul>
    </div>
  );
}

export function EngineChapter() {
  return (
    <Chapter id="engine" title={<>Fast, secure,{" "}<span>and lightweight.</span></>}>
      <Tiles>
        {/* Security fixes from Apple and Microsoft are the diff's "updates" line. */}
        <Tile span={8} title="Uses the engine built into macOS and Windows."><EngineDiff /></Tile>
        <Tile span={4} title="See an extension's access before installing."><ExtensionAccess /></Tile>
      </Tiles>
    </Chapter>
  );
}
