import { signOut } from "@/src/auth/actions";

interface PortalHeaderProps {
  userEmail: string | null;
}

export const PortalHeader = ({ userEmail }: PortalHeaderProps) => {
  return (
    <header className="flex items-center justify-between border-b border-base-300 bg-base-100 px-4 py-3 lg:hidden">
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-base-content">
          Your course
        </p>
        {userEmail ? (
          <p className="truncate text-xs text-base-content/60">{userEmail}</p>
        ) : null}
      </div>
      <form action={signOut}>
        <button type="submit" className="btn btn-ghost btn-sm">
          Sign out
        </button>
      </form>
    </header>
  );
};
