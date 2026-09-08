import AppShell from "@/components/AppShell";
import OrderWizard from "@/components/OrderWizard";
import { getSheet, SHEET_IDS } from "@/lib/schema";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return SHEET_IDS.map((id) => ({ id }));
}

export default async function SheetPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!getSheet(id)) notFound();

  return (
    <AppShell back>
      <OrderWizard sheetId={id} />
    </AppShell>
  );
}
