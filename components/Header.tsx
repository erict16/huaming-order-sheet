export default function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-navy-900/10 bg-navy text-white shadow-sm">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:px-6">
        {/* Wordmark */}
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-white/10 ring-1 ring-white/20">
            <span className="text-lg font-black leading-none tracking-tighter">HM</span>
          </div>
          <div className="leading-tight">
            <p className="text-sm font-bold tracking-wide">
              HUAMING <span className="font-normal text-white/70">华明</span>
            </p>
            <p className="text-[11px] uppercase tracking-[0.18em] text-white/60">
              Power Equipment
            </p>
          </div>
        </div>

        <div className="ml-auto hidden text-right sm:block">
          <p className="text-sm font-semibold">Tap-Changer Order Sheet</p>
          <p className="text-[11px] text-white/60">
            Order Specifications · Бланк заказа
          </p>
        </div>
        <span className="ml-auto badge bg-white/10 text-white/80 ring-1 ring-white/20 sm:ml-3">
          v0
        </span>
      </div>
    </header>
  );
}
