import { useLayoutEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";

import { PageHeader, PublicPage } from "@/components/marketing";
import { Button } from "@/components/ui/button";
import { SUPPORT_EMAIL } from "@/lib/site";
import { CopyField } from "./CopyField";
import { mistySetupUrl, parseSetupFragment, type SetupLink } from "./setupLink";

type Reading = { kind: "link"; link: SetupLink } | { kind: "empty" } | { kind: "invalid" };

function readFragment(hash: string): Reading {
  if (!hash.replace(/^#/, "").trim()) return { kind: "empty" };
  const link = parseSetupFragment(hash);
  return link ? { kind: "link", link } : { kind: "invalid" };
}

const linkClass = "text-foreground underline underline-offset-4 hover:text-foreground/80";

function DownloadLine() {
  return (
    <p className="text-sm leading-6 text-muted-foreground">
      Don't have Misty yet?{" "}
      {/* A new tab keeps this one, and the key it holds, open. */}
      <a href="/download" target="_blank" rel="noopener" className={linkClass}>
        Download Misty
      </a>
      , install it, then come back to this tab and choose Open in Misty.
    </p>
  );
}

function LinkReady({ link }: { link: SetupLink }) {
  return (
    <div className="grid max-w-xl gap-8">
      <div className="grid gap-4">
        <Button asChild size="lg" className="w-full rounded-full sm:w-fit sm:px-6">
          <a href={mistySetupUrl(link)}>Open in Misty</a>
        </Button>
        <DownloadLine />
      </div>
      <div className="grid gap-4">
        <p className="text-sm leading-6 text-muted-foreground">
          If Misty doesn't open, choose your server in its setup wizard and paste these.
        </p>
        <CopyField label="Server address" value={link.server} />
        <CopyField label="Setup key" value={link.key} />
      </div>
      <p
        role="note"
        className="rounded-lg border border-border bg-muted/40 px-4 py-3 text-sm leading-6 text-foreground/85"
      >
        The key works once and lasts seven days, so treat it like a password. This page read it
        in your browser and never sent it anywhere, and it's gone from the address bar. If you
        close this tab, open the link in your email again.
      </p>
    </div>
  );
}

function LinkMissing({ invalid }: { invalid: boolean }) {
  return (
    <div className="grid max-w-xl gap-4 text-base leading-7 text-muted-foreground">
      <p className="text-foreground">
        {invalid
          ? "This setup link isn't complete. It may have been cut off when it was copied."
          : "There's no setup link here."}
      </p>
      <p>
        Open the link in your setup email again, or type the server address and setup key from
        the email into Misty's setup wizard. For a new key, ask whoever runs your server. For
        Misty Cloud, write to{" "}
        <a href={`mailto:${SUPPORT_EMAIL}`} className={linkClass}>
          {SUPPORT_EMAIL}
        </a>
        .
      </p>
      <DownloadLine />
    </div>
  );
}

/**
 * Where setup emails point: `/setup#server=<host>&key=<key>`. The fragment never leaves the
 * browser. This page reads it once, keeps it only in memory, and clears it from the address
 * bar and the router's history entry.
 */
export default function Setup() {
  const location = useLocation();
  const navigate = useNavigate();
  const [reading, setReading] = useState(() => readFragment(location.hash));
  const [readHash, setReadHash] = useState(location.hash);

  // A fragment-only change, such as a second setup link opened in this tab, is read too.
  if (location.hash && location.hash !== readHash) {
    setReadHash(location.hash);
    setReading(readFragment(location.hash));
  }

  useLayoutEffect(() => {
    if (!location.hash) return;
    navigate(
      { pathname: location.pathname, search: location.search, hash: "" },
      { replace: true, preventScrollReset: true },
    );
  }, [location.hash, location.pathname, location.search, navigate]);

  return (
    <PublicPage>
      <PageHeader
        label="Setup"
        title="Set up Misty"
        description={
          reading.kind === "link"
            ? `This link connects Misty to ${reading.link.server} with your setup key.`
            : "This page opens Misty with the server and setup key from your setup email."
        }
      />
      {reading.kind === "link" ? (
        <LinkReady link={reading.link} />
      ) : (
        <LinkMissing invalid={reading.kind === "invalid"} />
      )}
    </PublicPage>
  );
}
