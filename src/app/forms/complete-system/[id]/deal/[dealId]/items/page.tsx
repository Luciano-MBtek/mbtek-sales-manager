import ItemsForm from "./ItemsForm";

export default async function Page({ params }: { params: Promise<{ id: string; dealId: string }> }) {
  const { id, dealId } = await params;
  return (
    <div className="p-4">
      <ItemsForm contactId={id} dealId={dealId} />
    </div>
  );
}
