"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { ADMIN_NAV_ITEMS, isAdminNavItemActive } from "./admin-nav-items";

interface AdminNavProps {
  /** id of the drawer checkbox, so the sidebar can close itself on mobile. */
  drawerId: string;
}

/**
 * Client component only for `usePathname`: the layout persists across
 * client-side navigations, so a server-derived active state would go stale
 * after the first click. Renders no data of its own.
 */
export const AdminNav = ({ drawerId }: AdminNavProps) => {
  const pathname = usePathname();

  // Close the mobile drawer once navigation lands; on desktop the drawer is
  // permanently open via lg:drawer-open and the checkbox has no effect.
  useEffect(() => {
    const drawer = document.getElementById(drawerId);

    if (drawer instanceof HTMLInputElement) {
      drawer.checked = false;
    }
  }, [drawerId, pathname]);

  return (
    <nav className="flex-1 overflow-y-auto p-3" aria-label="Admin sections">
      <ul className="menu w-full gap-0.5 p-0">
        {ADMIN_NAV_ITEMS.map((item) => {
          const isActive = isAdminNavItemActive(item, pathname);

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={isActive ? "menu-active" : undefined}
                aria-current={isActive ? "page" : undefined}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
