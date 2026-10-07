import { Bookmark, CircleCheck, History, Import, Puzzle, Search, type LucideIcon } from "lucide-react";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { Chapter } from "./Chapter";

/**
 * The Browser part of the homepage story: the native engine and the basics, then
 * sync (in Chapters.tsx). Agents belong to the Work part, so nothing here mentions them.
 * Engine claims follow misty/src-tauri.
 */

/** Where the web engine lives: inside the system for Misty, inside the app for a typical browser. */
function EngineDiagram() {
  return (
    <div className="mist-engine" aria-label="Misty uses the web engine built into macOS and Windows; a typical browser carries its own copy of Chromium">
      <div className="mist-engine-stack" data-kind="misty">
        <span className="mist-engine-label">Misty</span>
        <div className="mist-engine-box" data-layer="app"><b><BrandLogo /> Misty</b><small>Tabs, layouts, sync and agents</small></div>
        <div className="mist-engine-box" data-layer="os">
          <b>macOS or Windows</b>
          <div className="mist-engine-box" data-layer="engine"><b>Built-in web engine</b><small>WebKit on macOS, WebView2 on Windows</small></div>
        </div>
      </div>
      <div className="mist-engine-stack" data-kind="bundled" aria-hidden="true">
        <span className="mist-engine-label">A typical browser</span>
        <div className="mist-engine-box" data-layer="app">
          <b>The browser</b>
          <div className="mist-engine-box" data-layer="bundled"><b>Its own copy of Chromium</b><small>Shipped and updated with the app</small></div>
        </div>
        <div className="mist-engine-box" data-layer="os"><b>macOS or Windows</b></div>
      </div>
    </div>
  );
}

const ENGINE_CHECKS = ["Uses your system's engine.", "No bundled Chromium.", "Fixes from Apple and Microsoft."];

export function EngineChapter() {
  return (
    <Chapter id="engine" title={<>Fast because it's native.{" "}<span>No bundled Chromium.</span></>}>
      <div className="mist-hub-layout">
        <div className="mist-panel" data-reveal><span className="mist-feature-label">engine</span><EngineDiagram /></div>
        {/* A checklist diagram: each item checked off along one rail. */}
        <ul className="mist-checklist" data-reveal-stagger>
          {ENGINE_CHECKS.map(item => (
            <li key={item}><CircleCheck size={18} strokeWidth={1.75} aria-hidden /><h3>{item}</h3></li>
          ))}
        </ul>
      </div>
      <BrowserBasics />
    </Chapter>
  );
}

/** The rest of the browser, one small tile each. Extensions run on macOS only (see SELLING-POINTS.md). */
const basics: { name: string; text: string; icon: LucideIcon }[] = [
  { name: "Extensions", text: "Review access before you install.", icon: Puzzle },
  { name: "Import", text: "Bring your profiles and settings.", icon: Import },
  { name: "Bookmarks", text: "Save pages for later.", icon: Bookmark },
  { name: "History", text: "Every page you've visited.", icon: History },
  { name: "Search", text: "Your choice of search engine.", icon: Search },
];

function BrowserBasics() {
  return (
    <div className="mist-built-in mist-basics" data-reveal-stagger>
      <h3>Everything else you expect</h3>
      {basics.map(({ name, text, icon: Icon }) => (
        <div key={name} className="mist-built-in-tile">
          {/* A small bare glyph beside the name; no container behind it. */}
          <strong><Icon size={16} strokeWidth={1.75} aria-hidden />{name}</strong>
          <span>{text}</span>
        </div>
      ))}
    </div>
  );
}
