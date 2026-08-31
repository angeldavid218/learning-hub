import { signOut } from "@/src/auth/actions";

interface PortalFooterProps {
  userEmail: string | null;
}

export const PortalFooter = ({ userEmail }: PortalFooterProps) => {
  return (
    <div className="hidden border-t border-base-300 p-4 lg:block">
      {userEmail ? (
        <p className="mb-2 truncate text-xs text-base-content/60">{userEmail}</p>
      ) : null}
      <form action={signOut}>
        <button type="submit" className="btn btn-ghost btn-sm w-full justify-start">
          Sign out
        </button>
      </form>
    </div>
  );
};
