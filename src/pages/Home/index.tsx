import { MidnightHome } from "./midnight/MidnightHome";
import { useSectionRoute } from "./useSectionRoute";

/** Serves /. */
export default function Home() {
  useSectionRoute();

  return <MidnightHome />;
}
