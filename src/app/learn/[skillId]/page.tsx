import { getNodeById } from "@/data/careers";
import { notFound } from "next/navigation";
import LearnClient from "./LearnClient";

export default async function LearnPage({ params }: any) {
  const p = await params;
  const result = getNodeById(p.skillId);
  if (!result) return notFound();
  return <LearnClient nodeId={p.skillId} />;
}
