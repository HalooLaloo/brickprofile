import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="p-4">
        <Link href="/" className="flex items-center gap-2 w-fit">
          <img src="/logo.jpeg" alt="BrickProfile" className="w-8 h-8 rounded-lg" />
          <span className="text-xl font-bold">BrickProfile</span>
        </Link>
      </header>

      {/* Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        {children}
      </main>

      {/* Footer */}
      <footer className="p-4 text-center text-sm text-dark-500">
        Part of the Snap Ecosystem: SiteSnap • QuoteSnap • BrickProfile
      </footer>
    </div>
  );
}
