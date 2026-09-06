export function ResourceWip({ title, message }: { title: string; message: string }) {
  return (
    <section className="site-container flex min-h-[65svh] items-center py-20">
      <div className="max-w-lg">
        <p className="mb-4 text-sm text-muted-foreground">{title}</p>
        <h1 className="text-3xl font-medium tracking-tight">Work in progress.</h1>
        <p className="mt-3 text-base text-muted-foreground">{message}</p>
      </div>
    </section>
  );
}
