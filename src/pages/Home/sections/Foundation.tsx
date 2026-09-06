import { useReveal } from "@/hooks/useReveal";
export function Foundation() {
  const moreRef = useReveal<HTMLParagraphElement>(0.3);
  return (
    <section id="foundation" aria-labelledby="foundation-title" className="foundation-section">
      <div className="foundation-stage">
        <div className="site-container">
          <p ref={moreRef} className="mobile-more-reveal mb-16 text-balance text-center text-[clamp(3rem,7vw,6.75rem)] font-medium leading-[1.05] tracking-[-0.05em] sm:mb-20">And so much more.</p>
          <h2 id="foundation-title" className="text-center">
            <em>Simple</em>, but <em>powerful</em>. That's the goal.
          </h2>
          <div className="foundation-panel">
            <div className="foundation-columns">
              <p>
                Misty gives you a minimal starting point for building a space
                around your work, projects, and everyday activities.
              </p>
              <p>
                We’ve built a core foundation that lets supported apps connect
                through persistent context, keeping relevant information
                available as you move between them.
              </p>
              <p>
                Bringing people into that same space makes it easier to
                collaborate, with less repeated setup, fewer disconnected
                experiences, and less to keep track of across the apps you use
                every day.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
