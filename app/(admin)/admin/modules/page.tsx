import type { Metadata } from "next";

import { AdminPageTitle } from "../_components/admin-page-title";

export const metadata: Metadata = {
  title: "Modules · Admin",
};

export default function AdminModulesPage() {
  return <AdminPageTitle title="Modules" />;
}
