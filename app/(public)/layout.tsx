export default function PublicLayout({ children }: LayoutProps<"/">) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-base-200 p-4">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body gap-4">{children}</div>
      </div>
    </main>
  );
}
