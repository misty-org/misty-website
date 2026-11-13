import { useEffect, useState } from "react";
import { useParams } from "react-router";

import { SiteLink } from "@/components/SiteLink";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { apiBase } from "@/lib/apiBase";
import AuthCard from "../Auth/AuthCard";
import AuthShell from "../Auth/AuthShell";
import AuthSteps, { type AuthStep } from "../Auth/AuthSteps";

const STEPS: AuthStep[] = [
  {
    text: "Create your free Misty account.",
    action: (
      <Button asChild>
        <SiteLink to="/register">Create account</SiteLink>
      </Button>
    ),
  },
  {
    text: "Download Misty and install it on your computer.",
    action: (
      <Button asChild variant="outline">
        <SiteLink to="/download">Download</SiteLink>
      </Button>
    ),
  },
];

/** Who a code's link is from, or null when it names nobody any more. */
async function fetchInviter(code: string): Promise<string | null> {
  try {
    const response = await fetch(`${apiBase}/invites/${encodeURIComponent(code)}`);
    if (!response.ok) return null;
    return ((await response.json()) as { name: string }).name;
  } catch {
    return null;
  }
}

/** The landing page an invite link opens. */
export default function Invite() {
  const { code = "" } = useParams();
  // Undefined while asking the server.
  const [inviter, setInviter] = useState<string | null | undefined>(undefined);

  useEffect(() => {
    let current = true;
    void fetchInviter(code).then((name) => {
      if (current) setInviter(name);
    });
    return () => {
      current = false;
    };
  }, [code]);

  const title =
    inviter === undefined ? (
      <Skeleton aria-label="Loading who invited you" className="mx-auto h-9 w-72 max-w-full" />
    ) : inviter ? (
      `${inviter} invited you to Misty`
    ) : (
      "You're invited to Misty"
    );

  return (
    <AuthShell title={title} wide>
      <AuthCard
        footer={
          <p className="text-center text-base leading-7 text-pretty text-muted-foreground">
            Misty is one shared workspace where people and agents collaborate. It's free and open
            source.
          </p>
        }
      >
        <AuthSteps steps={STEPS} />
      </AuthCard>
    </AuthShell>
  );
}
