interface AdminPageTitleProps {
  title: string;
}

export const AdminPageTitle = ({ title }: AdminPageTitleProps) => {
  return (
    <h1 className="font-display text-2xl font-semibold text-base-content">
      {title}
    </h1>
  );
};
