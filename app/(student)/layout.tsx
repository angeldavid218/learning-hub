import { getRequestPathname } from "@/src/auth/request";
import { requireUser } from "@/src/auth/session";

import { CourseSidebar } from "./_components/course-sidebar";
import { PortalFooter } from "./_components/portal-footer";
import { PortalHeader } from "./_components/portal-header";
import {
  findModuleForLesson,
  PLACEHOLDER_CATALOG,
} from "./_data/mock-catalog";

export default async function StudentLayout({
  children,
}: LayoutProps<"/">) {
  const user = await requireUser();
  const pathname = await getRequestPathname();
  const activeLessonSlug =
    pathname?.match(/\/lessons\/([^/]+)/)?.[1] ?? null;
  const defaultOpenModuleId = activeLessonSlug
    ? findModuleForLesson(PLACEHOLDER_CATALOG, activeLessonSlug)
    : (PLACEHOLDER_CATALOG.modules[0]?.id ?? null);

  return (
    <div className="drawer lg:drawer-open min-h-screen bg-base-200">
      <input
        id="student-portal-drawer"
        type="checkbox"
        className="drawer-toggle"
      />
      <div className="drawer-content flex min-h-screen flex-col">
        <PortalHeader userEmail={user.email} />
        <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
      </div>
      <div className="drawer-side z-40">
        <label
          htmlFor="student-portal-drawer"
          className="drawer-overlay lg:hidden"
          aria-label="Close navigation"
        />
        <div className="flex min-h-full w-72 flex-col bg-base-100">
          <CourseSidebar
            catalog={PLACEHOLDER_CATALOG}
            activeLessonSlug={activeLessonSlug}
            defaultOpenModuleId={defaultOpenModuleId}
          />
          <PortalFooter userEmail={user.email} />
        </div>
      </div>
      <label
        htmlFor="student-portal-drawer"
        className="btn btn-circle btn-primary drawer-button fixed bottom-5 right-5 z-50 shadow-lg lg:hidden"
        aria-label="Open navigation"
      >
        <MenuIcon />
      </label>
    </div>
  );
};

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
