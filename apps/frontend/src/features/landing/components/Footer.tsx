export function Footer() {
  return (
    <footer className="border-t border-border py-6">
      <div className="mx-auto max-w-7xl px-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} RyuZen. All rights reserved.
      </div>
    </footer>
  );
}