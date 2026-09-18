import type { Metadata } from "next";

import { AdminPageTitle } from "./_components/admin-page-title";

export const metadata: Metadata = {
  title: "Dashboard · Admin",
};

export default function AdminDashboardPage() {
  return <AdminPageTitle title="Dashboard" />;
}
