/** Replace src with your own image URL. Existing captures keep every slot usable
 * until final artwork is supplied. Both computer screens share continuity.
 */
export const homeMedia = {
  hero: { src: "/screenshots/misty-home-dashboard-live.png", alt: "Misty browser workspace" },
  gather: { src: "/screenshots/misty-space-overview.webp", alt: "Misty workspace overview" },
  split: { src: "/screenshots/misty-home-dashboard.webp", alt: "Misty workspace preview" },
  agent: { src: "/screenshots/misty-space-library.webp", alt: "Misty space library preview" },
  continuity: { src: "/screenshots/misty-home-dashboard.webp", alt: "Misty workspace" },
  shared: { src: "/screenshots/misty-space-library.webp", alt: "Misty shared space library" },
};
export type HomeMediaSlot = keyof typeof homeMedia;
export const fallbackImage = { src: "/screenshots/misty-home-dashboard.webp", alt: "Misty workspace preview" };
