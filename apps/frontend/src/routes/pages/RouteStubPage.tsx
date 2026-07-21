/**
 * Generic stub page reused for every route in the F5 skeleton. A single
 * parameterized component is used instead of one file per route, since
 * 30+ near-identical placeholder files would themselves be a form of
 * duplication — each real feature milestone (P1 onward) replaces its
 * own route's usage of this component with a real page.
 */
export function RouteStubPage({ title }: { title: string }) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-2 p-8 text-center">
      <h1 className="font-display text-2xl font-medium text-foreground">{title}</h1>
      <p className="font-body text-sm text-muted-foreground">
        This page is not built yet — it arrives in a later milestone.
      </p>
    </div>
  );
}
