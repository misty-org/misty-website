export function ResourceWip({ title }: { title: string }) {
  return (
    <section className="site-container flex min-h-[65svh] items-center py-20">
      <h1 className="text-3xl font-medium tracking-tight">{title}</h1>
    </section>
  );
}
