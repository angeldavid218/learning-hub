import type { Metadata } from "next";

import { AdminPageTitle } from "../_components/admin-page-title";

export const metadata: Metadata = {
  title: "Users · Admin",
};

export default function AdminUsersPage() {
  return <AdminPageTitle title="Users" />;
}
