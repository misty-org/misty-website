import { createPortal } from "react-dom";
import { AnchorDrawer } from "./components/AnchorDrawer";
import { MidnightHome } from "./midnight/MidnightHome";
import { useSectionRoute } from "./useSectionRoute";

/** Serves / and /download; the latter scrolls to its section. */
export default function Home() {
  useSectionRoute();

  return (
    <>
      {/* Keep the fixed drawer above the footer and outside route transforms. */}
      {createPortal(<AnchorDrawer />, document.body)}
      <MidnightHome />
    </>
  );
}
