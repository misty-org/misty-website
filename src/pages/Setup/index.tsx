import { useLayoutEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";

import { Button } from "@misty/ui";
import { SUPPORT_EMAIL } from "@/lib/site";
import AuthCard from "../Auth/AuthCard";
import AuthShell from "../Auth/AuthShell";
import { CopyField } from "./CopyField";
import { mistySetupUrl, parseSetupFragment, type SetupLink } from "./setup_link";

type Reading = { kind: "link"; link: SetupLink } | { kind: "empty" } | { kind: "invalid" };

function readFragment(hash: string): Reading {
  if (!hash.replace(/^#/, "").trim()) return { kind: "empty" };
  const link = parseSetupFragment(hash);
  return link ? { kind: "link", link } : { kind: "invalid" };
}

const linkClass = "text-foreground underline underline-offset-4 hover:text-foreground/80";

function DownloadButton() {
  return (
    <Button size="lg" asChild className="w-full">
      <a href="/download" target="_blank" rel="noopener">
        Download Misty
      </a>
    </Button>
  );
}

function LinkReady({ link }: { link: SetupLink }) {
  return (
    <AuthCard
      footer={
        <p role="note" className="text-center text-page leading-7 text-muted-foreground">
          The key works once and lasts seven days, so treat it like a password. If you close this
          tab, open the link in your email again.
        </p>
      }
    >
      <div className="grid gap-6">
        <div className="grid gap-3 sm:grid-cols-2">
          <Button variant="primary" size="lg" asChild className="w-full">
            <a href={mistySetupUrl(link)}>Open in Misty</a>
          </Button>
          <DownloadButton />
        </div>
        <div className="grid gap-4">
          <p className="text-page leading-7 text-foreground">
            If Misty doesn't open, choose your server in its setup wizard and paste these.
          </p>
          <CopyField label="Server address" value={link.server} />
          <CopyField label="Setup key" value={link.key} />
        </div>
      </div>
    </AuthCard>
  );
}

function LinkMissing({ invalid }: { invalid: boolean }) {
  return (
    <AuthCard>
      <div className="grid gap-6">
        <div className="grid gap-3 text-page leading-7 text-muted-foreground">
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
        </div>
        <DownloadButton />
      </div>
    </AuthCard>
  );
}

export default function Setup() {
  const location = useLocation();
  const navigate = useNavigate();
  const [reading, setReading] = useState(() => readFragment(location.hash));
  const [readHash, setReadHash] = useState(location.hash);

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
    <AuthShell title="Set up Misty" wide>
      {reading.kind === "link" ? (
        <LinkReady link={reading.link} />
      ) : (
        <LinkMissing invalid={reading.kind === "invalid"} />
      )}
    </AuthShell>
  );
}
