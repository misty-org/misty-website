import { PageHeader, PublicPage } from "@/components/marketing";
import { marketingCopy } from "@/content/marketingCopy";
import EngineTable from "./sections/EngineTable";

/** Chromium, Gecko and Kiri side by side, by what extensions can do on each. */
export default function Kiri() {
  return (
    <PublicPage>
      <PageHeader
        label="Kiri"
        title={marketingCopy.kiri.title}
        description={marketingCopy.kiri.description}
      />
      <EngineTable />
    </PublicPage>
  );
}
