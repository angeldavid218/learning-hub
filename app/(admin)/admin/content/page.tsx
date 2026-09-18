import type { Metadata } from "next";

import { AdminPageTitle } from "../_components/admin-page-title";

export const metadata: Metadata = {
  title: "Content · Admin",
};

export default function AdminContentPage() {
  return <AdminPageTitle title="Content" />;
}
