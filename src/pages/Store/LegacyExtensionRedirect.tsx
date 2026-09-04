import { Navigate, useParams } from "react-router";

export function LegacyExtensionRedirect() {
  const { extensionId } = useParams();

  return (
    <Navigate
      replace
      to={extensionId ? `/store/${extensionId}` : "/store"}
    />
  );
}
