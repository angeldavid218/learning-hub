interface AdminHeaderProps {
  brandName: string;
}

/**
 * Always visible, unlike the student portal's mobile-only header, so the admin
 * surface keeps a persistent top bar as one of its distinguishing cues.
 */
export const AdminHeader = ({ brandName }: AdminHeaderProps) => {
  return (
    <header className="flex items-center gap-3 border-b border-base-300 bg-base-100 px-4 py-3 md:px-6 lg:px-8">
      <span className="badge badge-primary badge-outline font-mono text-xs uppercase tracking-wider">
        Admin
      </span>
      <p className="truncate text-sm text-base-content/70">{brandName}</p>
    </header>
  );
};
