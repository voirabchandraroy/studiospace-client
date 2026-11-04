import { StudioDetails } from "@/components/studios/StudioDetails";

export const metadata = { title: "Studio Details — StudioSpace" };

export default async function StudioDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <StudioDetails id={id} />;
}
