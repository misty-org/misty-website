// The official marks of the engines Misty runs, copied from the app's engine-config/engineMarks.json.
// The shapes come from lobe-icons (https://github.com/lobehub/lobe-icons, MIT, Copyright (c) 2023
// LobeHub); Hermes wears Hermes Agent's and Oh My Pi its own gradient π (https://github.com/can1357/oh-my-pi,
// MIT). The marks belong to their owners and only name their products.
import { createElement, useId, type ReactNode } from "react";
import shapes from "./engineMarks.json";

/** One SVG element as engineMarks.json stores it: tag, attributes, children. */
type Shape = [string, Record<string, string>, Shape[]?];
type Mark = [Record<string, string>, Shape[]];
const marks = shapes as unknown as Record<string, Mark>;

/** An engine's official mark, with its gradient ids made this instance's own so they never clash. */
export function EngineMark({ engine, size = 18 }: { engine: string; size?: number }) {
  const prefix = `em${useId().replace(/[^A-Za-z0-9_-]/g, "")}-`;
  const mark = marks[engine];
  if (!mark) return null;
  const own = (attributes: Record<string, string>) => Object.fromEntries(Object.entries(attributes).map(([name, value]) =>
    [name, name === "id" ? `${prefix}${value}` : value.replace(/url\(#/g, `url(#${prefix}`)]));
  const draw = ([tag, attributes, children = []]: Shape, key: number): ReactNode =>
    createElement(tag, { key, ...own(attributes) }, ...children.map(draw));
  const [root, children] = mark;
  return <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" {...root}>{children.map(draw)}</svg>;
}
