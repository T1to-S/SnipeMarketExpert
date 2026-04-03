// src/components/layout/Header.tsx
export function Header() {
  return (
    <header className="flex h-14 items-center border-b px-6">
      <div className="flex flex-1 items-center justify-end">
        {/* TODO: Add user menu with NextAuth session */}
      </div>
    </header>
  );
}
