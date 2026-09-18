import { signOut } from "@/src/auth/actions";

import { AdminNav } from "./admin-nav";

interface AdminSidebarProps {
  brandName: string;
  userEmail: string | null;
  drawerId: string;
}

export const AdminSidebar = ({
  brandName,
  userEmail,
  drawerId,
}: AdminSidebarProps) => {
  return (
    <aside className="flex min-h-full w-72 flex-col border-r border-base-300 bg-base-100">
      <div className="border-b border-base-300 border-t-4 border-t-primary p-5">
        <p className="font-mono text-xs uppercase tracking-widest text-primary">
          Admin
        </p>
        <p className="mt-1 truncate font-display text-base font-semibold text-base-content">
          {brandName}
        </p>
      </div>

      <AdminNav drawerId={drawerId} />

      <div className="border-t border-base-300 p-4">
        {userEmail ? (
          <p className="mb-2 truncate text-xs text-base-content/60">
            {userEmail}
          </p>
        ) : null}
        <form action={signOut}>
          <button
            type="submit"
            className="btn btn-ghost btn-sm w-full justify-start"
          >
            Sign out
          </button>
        </form>
      </div>
    </aside>
  );
};
