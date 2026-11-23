import { useEffect, useState } from "react";

import { Skeleton, Text } from "@misty/ui";

import { CopyField } from "../../../Setup/CopyField";
import { fetchInviteCode } from "../../api";
import { customRowClass } from "../../components/SettingsRows";

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
        <Text wrap size="control" tone="muted">
          Your invite link isn't available right now.
        </Text>
      ) : code ? (
        <CopyField label="Your invite link" value={`${window.location.origin}/r/${code}`} />
      ) : (
        <Skeleton className="h-17 w-full" />
      )}
    </div>
  );
}
