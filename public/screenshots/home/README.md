# Homepage images

The homepage uses existing Misty screenshots until your final images are ready.

1. Add your image to this folder (WebP, PNG, or JPEG).
2. Set its `src` in `src/pages/Home/midnight/homeMedia.ts`, for example `/screenshots/home/hero.webp`.

Slots: `hero`, `gather`, `split`, `agent`, `shared`, and `continuity`.
The single `hero` screenshot sits to the left of the hero text on desktop.
Both computer screens use the same `continuity` image.

Use a 16:10 image at 1600 × 1000 or larger for the main frames. Other ratios fit without cropping. The device screens use 16:9. Missing replacement images fall back to the shipped dashboard screenshot rather than leaving an empty panel.
