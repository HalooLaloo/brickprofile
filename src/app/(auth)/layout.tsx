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
          <div className="w-8 h-8 rounded-lg bg-[#132039] flex items-center justify-center">
            <svg className="w-5 h-5 text-orange-500" viewBox="0 0 24 24" fill="currentColor">
              <rect x="2" y="6" width="9" height="5" rx="0.5" />
              <rect x="13" y="6" width="9" height="5" rx="0.5" />
              <rect x="6" y="13" width="9" height="5" rx="0.5" />
              <rect x="17" y="13" width="5" height="5" rx="0.5" />
              <rect x="2" y="13" width="2" height="5" rx="0.5" />
            </svg>
          </div>
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
