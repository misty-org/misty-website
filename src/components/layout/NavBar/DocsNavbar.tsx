import Navbar from ".";

export function DocsNavbar({
  docsMenuOpen,
  onOpenDocsMenu,
  onOpenSearch,
}: {
  docsMenuOpen: boolean;
  onOpenDocsMenu: () => void;
  onOpenSearch: () => void;
}) {
  return (
    <Navbar
      onOpenSettings={() => undefined}
      docs={{ menuOpen: docsMenuOpen, onOpenMenu: onOpenDocsMenu, onOpenSearch }}
    />
  );
}
