// src/components/layout/Sidebar.tsx
import Link from "next/link";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/scanner", label: "Scanner" },
  { href: "/settings", label: "Settings" },
];

export function Sidebar() {
  return (
    <aside className="flex h-full w-64 flex-col border-r bg-background px-4 py-6">
      <div className="mb-8">
        <h2 className="text-xl font-bold">CS2 Sniper</h2>
      </div>
      <nav className="space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
