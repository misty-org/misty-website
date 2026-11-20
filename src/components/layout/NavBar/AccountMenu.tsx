import {
  Avatar,
  AvatarFallback,
  DropdownMenu,
  DropdownMenuContent,
  MenuItem,
  MenuLabel,
  MenuSeparator,
  MenuTrigger,
  Text,
} from "@misty/ui";

/** Avatar dropdown shown in the desktop bar once a visitor is signed in. */
export default function AccountMenu({
  displayName,
  email,
  initials,
  onOpenSettings,
  onSignOut,
}: {
  displayName: string;
  email: string;
  initials: string;
  onOpenSettings: () => void;
  onSignOut: () => void;
}) {
  return (
    <DropdownMenu>
      <MenuTrigger
        iconOnly
        label="Open account menu"
        icon={
          <Avatar size="sm">
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        }
      />
      <DropdownMenuContent align="end" width="md">
        <MenuLabel>
          <Text size="control" tone="bright" weight="medium">
            {displayName}
          </Text>
          <Text size="control" tone="muted">
            {email}
          </Text>
        </MenuLabel>
        <MenuSeparator />
        <MenuItem label="Settings" onSelect={onOpenSettings} />
        <MenuSeparator />
        <MenuItem label="Sign out" danger onSelect={onSignOut} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
