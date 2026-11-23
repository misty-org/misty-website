import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";

import { useAuth } from "@/AuthContext";
import { useUserStore } from "@/store/user_store";
import { isSettingsPathname } from "./settings_route";
import { fetchMe } from "./api";

export function useAccountSettings({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { user, sessionReady, logout, setUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { me, loading, setMe, setLoading, patchMe } = useUserStore();
  const [loadError, setLoadError] = useState("");

  const returnTo = isSettingsPathname(location.pathname)
    ? location.pathname
    : undefined;

  useEffect(() => {
    if (!open || !sessionReady) return;
    if (user) return;

    void Promise.resolve().then(() => {
      onOpenChange(false);
      navigate("/signin", { state: returnTo ? { from: returnTo } : undefined });
    });
  }, [open, user, sessionReady, navigate, onOpenChange, returnTo]);

  useEffect(() => {
    if (!open || !user || me) return;

    let active = true;
    void Promise.resolve().then(async () => {
      if (!active) return;
      setLoadError("");
      setLoading(true);
      try {
        const account = await fetchMe();
        if (active) setMe(account);
      } catch (error) {
        if (!active) return;
        const requestError = error as Error & { status?: number };
        if (requestError.status === 401) {
          onOpenChange(false);
          logout("/signin");
          return;
        }
        setLoadError(
          requestError.message || "Could not load your Misty account.",
        );
      } finally {
        if (active) setLoading(false);
      }
    });

    return () => {
      active = false;
    };
  }, [open, user, me, logout, navigate, onOpenChange, setLoading, setMe]);

  function renameAccount(username: string) {
    patchMe({ username });
    if (user) setUser({ ...user, name: username });
  }

  function bumpAvatarVersion() {
    patchMe({ avatar_version: (me?.avatar_version ?? 0) + 1 });
  }

  function finishDeletion() {
    logout("/");
  }

  return {
    me,
    loading,
    loadError,
    renameAccount,
    bumpAvatarVersion,
    finishDeletion,
  };
}
