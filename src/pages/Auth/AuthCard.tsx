import type { ReactNode } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
    <Card className="w-full flex-col gap-0 rounded-xl bg-card p-6 text-card-foreground shadow-xl ring-1 ring-foreground/10 sm:p-8">
      {title ? (
        <CardHeader className="p-0">
          <CardTitle
            role="heading"
            aria-level={2}
            className="text-2xl font-semibold"
          >
            {title}
          </CardTitle>
        </CardHeader>
      ) : null}

      <CardContent className={title ? "mt-7 p-0" : "p-0"}>
        {children}
      </CardContent>

      {footer ? (
        <CardFooter className="mt-6 justify-center border-t border-border p-0 pt-6">
          {footer}
        </CardFooter>
      ) : null}
    </Card>
  );
}
