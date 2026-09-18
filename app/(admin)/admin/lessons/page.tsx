import type { Metadata } from "next";

import { AdminPageTitle } from "../_components/admin-page-title";

export const metadata: Metadata = {
  title: "Lessons · Admin",
};

export default function AdminLessonsPage() {
  return <AdminPageTitle title="Lessons" />;
}
