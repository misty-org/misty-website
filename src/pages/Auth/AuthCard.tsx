import type { ReactNode } from "react";
import { Card, Text } from "@misty/ui";

interface AuthCardProps {
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
}

export default function AuthCard({
  title,
  children,
  footer,
}: AuthCardProps) {
  return (
    <Card className="w-full gap-0 p-6 sm:p-8">
      {title ? (
        <Text as="h2" wrap size="display" weight="semibold" tone="bright">
          {title}
        </Text>
      ) : null}

      <div className={title ? "mt-7" : undefined}>{children}</div>

      {footer ? (
        <div className="mt-6 flex items-center justify-center border-t border-border pt-6">
          {footer}
        </div>
      ) : null}
    </Card>
  );
}
