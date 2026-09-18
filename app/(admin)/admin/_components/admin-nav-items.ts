export interface AdminNavItem {
  label: string;
  href: string;
}

/**
 * Top-level admin sections, in sidebar order. `/admin` is the dashboard and
 * only matches exactly; every other section also owns its sub-paths.
 */
export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  { label: "Dashboard", href: "/admin" },
  { label: "Users", href: "/admin/users" },
  { label: "Cohorts", href: "/admin/cohorts" },
  { label: "Modules", href: "/admin/modules" },
  { label: "Lessons", href: "/admin/lessons" },
  { label: "Content", href: "/admin/content" },
];

export const isAdminNavItemActive = (
  item: AdminNavItem,
  pathname: string,
): boolean =>
  item.href === "/admin"
    ? pathname === item.href
    : pathname === item.href || pathname.startsWith(`${item.href}/`);
