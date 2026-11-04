import { useEffect, useState } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { CopyField } from "../../../Setup/CopyField";
import { fetchInviteCode } from "../../api";
import { customRowClass } from "../../components/SettingsRows";

/** The person's invite link. Whoever opens it sees their username. */
export function InviteLink() {
  const [code, setCode] = useState("");
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let current = true;
    fetchInviteCode()
      .then((next) => {
        if (current) setCode(next);
      })
      .catch(() => {
        if (current) setFailed(true);
      });
    return () => {
      current = false;
    };
  }, []);

  return (
    <div className={customRowClass}>
      {failed ? (
        <p className="text-sm text-muted-foreground">Your invite link isn't available right now.</p>
      ) : code ? (
        <CopyField label="Your invite link" value={`${window.location.origin}/r/${code}`} />
      ) : (
        <Skeleton aria-hidden="true" className="h-[4.25rem] w-full" />
      )}
    </div>
  );
}
