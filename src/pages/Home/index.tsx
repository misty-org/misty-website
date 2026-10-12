import { MidnightHome } from "./midnight/MidnightHome";
import { useSectionRoute } from "./useSectionRoute";

/** Serves / and /download; the latter scrolls to its section. */
export default function Home() {
  useSectionRoute();

  return <MidnightHome />;
}
