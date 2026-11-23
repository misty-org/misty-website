import type { ReactNode } from "react";

interface AuthShellProps {
  title: ReactNode;
  children: ReactNode;
  wide?: boolean;
}

export default function AuthShell({ title, children, wide }: AuthShellProps) {
  return (
    <section
      aria-labelledby="auth-page-title"
      className="site-container min-h-[calc(100vh-4rem)] pb-24 pt-8 text-foreground sm:pt-12"
    >
      <div className={`mx-auto flex w-full flex-col gap-8 ${wide ? "max-w-xl" : "max-w-md"}`}>
        <h1
          id="auth-page-title"
          className="text-balance text-center text-display font-medium tracking-[-0.04em] text-foreground outline-none"
        >
          {title}
        </h1>

        <div className="flex w-full flex-col">{children}</div>
      </div>
    </section>
  );
}
