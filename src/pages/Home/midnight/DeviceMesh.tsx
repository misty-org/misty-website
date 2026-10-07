import { FileArchive, FileSpreadsheet, FileVideo, Laptop, Monitor, PcCase, Server, type LucideIcon } from "lucide-react";

/**
 * Your devices on the corners of one pipe loop, files moving through the pipes from one device to
 * the next, and every device's files listed together in the middle (SELLING-POINTS.md, point 1).
 * Drawn in SVG; the flow runs on CSS and SMIL and stops for reduced motion (see .mist-mesh in
 * midnight.css).
 */
type Device = { name: string; detail: string; size: string; icon: LucideIcon; x: number; y: number; above: boolean };

const DEVICES: Device[] = [
  { name: "This Mac", detail: "MacBook Air", size: "412 GB", icon: Laptop, x: 150, y: 170, above: true },
  { name: "Studio desktop", detail: "Mac Studio", size: "1.8 TB", icon: Monitor, x: 450, y: 170, above: true },
  { name: "Work PC", detail: "Windows", size: "960 GB", icon: PcCase, x: 450, y: 450, above: false },
  { name: "Office NAS", detail: "Network drive", size: "6.2 TB", icon: Server, x: 150, y: 450, above: false },
];
const TILE = 84;
/** The loop, one pipe per side, each running from one device to the next. */
const PIPES = [
  { id: "top", d: "M150 170H450", length: 300, vertical: false },
  { id: "right", d: "M450 170V450", length: 280, vertical: true },
  { id: "bottom", d: "M450 450H150", length: 300, vertical: false },
  { id: "left", d: "M150 450V170", length: 280, vertical: true },
];
/** Files in flight, each on one pipe from the device it leaves to the next one. */
const FILES: { name: string; icon: LucideIcon; pipe: string; begin: number }[] = [
  { name: "Assets.zip", icon: FileArchive, pipe: "top", begin: 0 },
  { name: "Interview.mov", icon: FileVideo, pipe: "right", begin: 1.5 },
  { name: "Budget.xlsx", icon: FileSpreadsheet, pipe: "bottom", begin: 3 },
];
const LOOP = 4.5;
const CHIP_HEIGHT = 28;
const chipWidth = (name: string) => 32 + name.length * 6.8;
/** Arrival is 60% into each loop. The file stays fully visible until it touches the next tile, then
    fades as it goes in. */
const ARRIVE = 0.6;
const FADED = 0.66;

export function DeviceMesh() {
  return (
    <svg className="mist-mesh" viewBox="80 62 460 500" role="img"
      aria-label="This Mac, a studio desktop, a work PC and an office network drive, linked in a loop of pipes with files moving from one device to the next. In the middle, Files lists every device's storage together.">
      <defs>{PIPES.map(pipe => <path key={pipe.id} id={`mesh-${pipe.id}`} d={pipe.d} />)}</defs>

      {PIPES.map(pipe => (
        <g key={pipe.id}>
          <use href={`#mesh-${pipe.id}`} className="mist-mesh-tube" />
          <use href={`#mesh-${pipe.id}`} className="mist-mesh-core" />
          <use href={`#mesh-${pipe.id}`} className="mist-mesh-flow" />
        </g>
      ))}

      {/* Every device's files, together: what the Files tab shows. */}
      <g className="mist-mesh-panel">
        <rect x="206" y="236" width="182" height="148" rx="14" />
        <text className="mist-mesh-panel-title" x="222" y="262">Files</text>
        {DEVICES.map(({ name, size, icon: Icon }, index) => (
          <g key={name} transform={`translate(0 ${index * 24})`}>
            <Icon x={222} y={279} size={14} strokeWidth={1.75} />
            <text x="242" y="290">{name}</text>
            <text className="mist-mesh-dim" x="374" y="290" textAnchor="end">{size}</text>
          </g>
        ))}
      </g>

      {DEVICES.map(({ name, detail, icon: Icon, x, y, above }) => (
        <g key={name} className="mist-mesh-device">
          <rect x={x - TILE / 2} y={y - TILE / 2} width={TILE} height={TILE} rx="22" />
          <Icon x={x - 17} y={y - 17} size={34} strokeWidth={1.5} />
          <text x={x} y={above ? y - TILE / 2 - 32 : y + TILE / 2 + 28} textAnchor="middle">{name}</text>
          <text className="mist-mesh-dim" x={x} y={above ? y - TILE / 2 - 12 : y + TILE / 2 + 48} textAnchor="middle">{detail}</text>
        </g>
      ))}

      {FILES.map(({ name, icon: Icon, pipe, begin }) => {
        const width = chipWidth(name);
        // Leaves with its back edge on the first tile and stops with its front edge on the next one.
        const { length, vertical } = PIPES.find(candidate => candidate.id === pipe)!;
        const reach = TILE / 2 + (vertical ? CHIP_HEIGHT : width) / 2;
        const from = (reach / length).toFixed(4);
        const to = (1 - reach / length).toFixed(4);
        return (
          <g key={name} className="mist-mesh-file" opacity="0">
            <rect x={-width / 2} y="-14" width={width} height="28" rx="14" />
            <Icon x={-width / 2 + 9} y={-7} size={14} strokeWidth={2} />
            <text x={-width / 2 + 28} y="4.5">{name}</text>
            <animateMotion dur={`${LOOP}s`} begin={`${begin}s`} repeatCount="indefinite" calcMode="linear"
              keyPoints={`${from};${to};${to}`} keyTimes={`0;${ARRIVE};1`}>
              <mpath href={`#mesh-${pipe}`} />
            </animateMotion>
            <animate attributeName="opacity" dur={`${LOOP}s`} begin={`${begin}s`} repeatCount="indefinite"
              values="0;1;1;0;0" keyTimes={`0;.06;${ARRIVE};${FADED};1`} />
          </g>
        );
      })}
    </svg>
  );
}
