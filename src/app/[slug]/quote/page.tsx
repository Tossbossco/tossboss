import { notFound } from "next/navigation";
import { loadSparkPackage } from "@/lib/sparks";
import QuotePage from "./QuotePage";
import { Spark } from "@/types/spark";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function QuoteRoute({ params }: Props) {
  const { slug } = await params;
  const sparkPackage = loadSparkPackage(slug);

  if (!sparkPackage) {
    notFound();
  }

  const { spark } = sparkPackage;

  return <QuotePage spark={spark} />;
}
