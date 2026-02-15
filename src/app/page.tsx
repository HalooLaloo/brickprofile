export default function ComingSoonPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center px-4">
      {/* Logo & Brand */}
      <div className="flex items-center gap-3 mb-12">
        <div className="w-12 h-12 rounded-xl bg-[#132039] flex items-center justify-center">
          <svg
            className="w-7 h-7 text-orange-500"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <rect x="2" y="6" width="9" height="5" rx="0.5" />
            <rect x="13" y="6" width="9" height="5" rx="0.5" />
            <rect x="6" y="13" width="9" height="5" rx="0.5" />
            <rect x="17" y="13" width="5" height="5" rx="0.5" />
            <rect x="2" y="13" width="2" height="5" rx="0.5" />
          </svg>
        </div>
        <span className="text-2xl font-bold tracking-tight">BrickProfile</span>
      </div>

      {/* Main Content */}
      <h1 className="text-5xl sm:text-6xl font-bold mb-6 text-center">
        Coming Soon
      </h1>
      <p className="text-lg sm:text-xl text-slate-400 text-center max-w-md mb-16">
        Professional digital profiles for construction companies.
      </p>

      {/* Ecosystem Link */}
      <p className="text-sm text-slate-500">
        Part of the{" "}
        <a
          href="https://brickhub.io"
          target="_blank"
          rel="noopener noreferrer"
          className="text-orange-400 hover:text-orange-300 underline underline-offset-2 transition-colors"
        >
          BrickHub
        </a>{" "}
        ecosystem
      </p>
    </div>
  );
}
