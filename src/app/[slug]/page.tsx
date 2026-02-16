import { notFound } from "next/navigation";
import { getSparkBySlug } from "@/lib/sparks";
import SparkPage from "./SparkPage";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function SparkRoute({ params }: Props) {
  const { slug } = await params;
  const spark = getSparkBySlug(slug);

  if (!spark) {
    notFound();
  }

  return <SparkPage spark={spark} />;
}
