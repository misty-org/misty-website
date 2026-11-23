import { MidnightHome } from "./midnight/MidnightHome";
import { useSectionRoute } from "./use_section_route";

export default function Home() {
  useSectionRoute();

  return <MidnightHome />;
}
