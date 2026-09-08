import Header from "@/components/Header";
import OrderForm from "@/components/OrderForm";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-28 pt-6 sm:px-6 sm:pb-12 sm:pt-8">
        <div className="mb-6 sm:mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-steel">
            On-load / de-energized tap changers
          </p>
          <h1 className="mt-1.5 text-2xl font-bold text-navy sm:text-3xl">
            Create an order sheet
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-ink-soft">
            Enter your tap-changer parameters, review, and export a clean Excel with
            every field. Runs fully in your browser — nothing is uploaded.
          </p>
        </div>
        <OrderForm />
      </main>
      <footer className="no-print border-t border-slate-200 bg-white/60">
        <div className="mx-auto max-w-6xl px-4 py-5 text-xs text-ink-muted sm:px-6">
          v0 · client-side static app · unfilled fields default to standard supply.
          See PLAN.md for the full family map and open questions.
        </div>
      </footer>
    </div>
  );
}
