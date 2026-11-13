/** Images for the homepage's screenshot slots. Each points at an existing capture until final artwork replaces it. */
export const homeMedia = {
  shared: { src: "/screenshots/misty-space-library.webp", alt: "Misty shared space library" },
};
export type HomeMediaSlot = keyof typeof homeMedia;
/** Shown when a slot's image fails to load. It must stay a different file from every slot's own image. */
export const fallbackImage = { src: "/screenshots/misty-home-dashboard.webp", alt: "Misty workspace preview" };
