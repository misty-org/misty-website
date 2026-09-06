import { cn } from "@/lib/utils";

type ScrollSceneIntroProps = {
  title: string;
  description?: string;
  id?: string;
  className?: string;
};

/** Static section copy in the normal document flow. */
export function ScrollSceneIntro({ title, description, id, className }: ScrollSceneIntroProps) {
  return (
    <div className={cn("chapter-intro", className)}>
      <div className="site-container">
        <div className="chapter-intro-copy">
          <h2
            id={id}
            className="marketing-heading text-[var(--marketing-foreground)]"
          >
            {title}
          </h2>
          {description ? (
            <p className="mx-auto mt-6 max-w-2xl text-balance marketing-description text-[var(--marketing-muted)]">
              {description}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
