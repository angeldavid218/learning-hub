import { requireBrandAdmin } from "@/src/auth/session";
import { resolveBrand } from "@/src/brand";

import { AdminHeader } from "./_components/admin-header";
import { AdminSidebar } from "./_components/admin-sidebar";

const DRAWER_ID = "admin-drawer";

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  // Brand comes from the Host header only. requireBrandAdmin handles the
  // login redirect for signed-out users and the 404 for non-admins.
  const brand = await resolveBrand();
  const user = await requireBrandAdmin(brand.id);

  return (
    <div className="drawer lg:drawer-open min-h-screen bg-base-200">
      <input id={DRAWER_ID} type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex min-h-screen flex-col">
        <AdminHeader brandName={brand.name} />
        <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
      </div>
      <div className="drawer-side z-40">
        <label
          htmlFor={DRAWER_ID}
          className="drawer-overlay lg:hidden"
          aria-label="Close navigation"
        />
        <AdminSidebar
          brandName={brand.name}
          userEmail={user.email}
          drawerId={DRAWER_ID}
        />
      </div>
      <label
        htmlFor={DRAWER_ID}
        className="btn btn-circle btn-primary drawer-button fixed bottom-5 right-5 z-50 shadow-lg lg:hidden"
        aria-label="Open navigation"
      >
        <MenuIcon />
      </label>
    </div>
  );
}

const MenuIcon = () => (
  <svg
    className="size-5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    aria-hidden="true"
  >
    <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
  </svg>
);
