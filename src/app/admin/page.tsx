import { getDashboardData } from "@/lib/loaders";
import Dashboard from "@/components/dashboard/Dashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const data = await getDashboardData();

  return <Dashboard data={data} />;
}
