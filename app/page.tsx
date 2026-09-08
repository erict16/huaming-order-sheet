import OrderForm from "@/components/OrderForm";

export default function Home() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <header className="mb-8 border-b border-slate-200 pb-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand">
          Huaming · 上海华明
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
          Tap-Changer Order Sheet
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-600">
          Order Specifications / Бланк заказа. Fill the parameters below, review,
          and export a clean Excel with every field. Runs fully in your browser —
          nothing is uploaded.
        </p>
      </header>
      <OrderForm />
      <footer className="no-print mt-12 border-t border-slate-200 pt-6 text-xs text-slate-400">
        v0 · client-side static app · unfilled fields default to standard supply.
        See PLAN.md for the full family map and open questions.
      </footer>
    </main>
  );
}
