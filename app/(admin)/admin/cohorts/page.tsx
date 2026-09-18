import type { Metadata } from "next";

import { AdminPageTitle } from "../_components/admin-page-title";

export const metadata: Metadata = {
  title: "Cohorts · Admin",
};

export default function AdminCohortsPage() {
  return <AdminPageTitle title="Cohorts" />;
}
