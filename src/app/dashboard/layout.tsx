"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import {
  IconDashboard,
  IconUsers,
  IconStore,
  IconFiles,
  IconLink,
  IconChart,
  IconLogout,
  IconUser,
  IconMenu,
  IconChevronSidebar,
} from "@/components/icons";

const SIDEBAR_WIDTH = 260;
const SIDEBAR_WIDTH_COLLAPSED = 72;

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { token, userType, email, ready, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    if (!ready) return;
    if (!token) {
      router.replace("/login");
      return;
    }
  }, [ready, token, router]);

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-[var(--text-secondary)]">Loading…</p>
      </div>
    );
  }

  if (!token) {
    return null;
  }

  const isAdmin = userType === "admin";

  const navLink = (
    href: string,
    label: string,
    match: boolean,
    icon: React.ReactNode
  ) => (
    <Link
      href={href}
      title={sidebarCollapsed ? label : undefined}
      className={`flex items-center gap-3 rounded-lg text-sm font-medium transition-colors overflow-hidden ${
        sidebarCollapsed ? "px-3 py-2.5 justify-center" : "px-4 py-2.5"
      } ${
        match
          ? "bg-[var(--sidebar-active-bg)] text-[var(--sidebar-text)]"
          : "text-[var(--sidebar-text-muted)] hover:bg-[var(--sidebar-hover-bg)] hover:text-[var(--sidebar-text)]"
      }`}
    >
      {icon}
      {!sidebarCollapsed && <span className="truncate">{label}</span>}
    </Link>
  );

  const sidebarWidth = sidebarCollapsed ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH;
  const displayName = email || (userType === "admin" ? "Admin" : "Dealer");

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside
        className="fixed left-0 top-0 bottom-0 flex flex-col border-r border-[var(--sidebar-border)] transition-[width] duration-200 ease-in-out"
        style={{
          width: sidebarWidth,
          backgroundColor: "var(--sidebar-bg)",
        }}
      >
        <div
          className={`flex items-center gap-2 p-3 border-b border-[var(--sidebar-border)] min-h-[52px] ${
            sidebarCollapsed ? "justify-center" : "justify-between"
          }`}
        >
          {!sidebarCollapsed && (
            <Link href="/dashboard" className="text-lg font-semibold text-[var(--sidebar-text)] truncate">
              Wallace Dealer Portal
            </Link>
          )}
          <button
            type="button"
            onClick={() => setSidebarCollapsed((c) => !c)}
            className="flex-shrink-0 p-1.5 rounded-lg text-[var(--sidebar-text-muted)] hover:bg-[var(--sidebar-hover-bg)] hover:text-[var(--sidebar-text)] transition-colors"
            title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <IconChevronSidebar collapsed={sidebarCollapsed} />
          </button>
        </div>
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto overflow-x-hidden">
          {navLink("/dashboard", "Dashboard", pathname === "/dashboard", <IconDashboard />)}
          {isAdmin && (
            <>
              {navLink("/dashboard/dealers", "Dealers", pathname.startsWith("/dashboard/dealers"), <IconUsers />)}
              {navLink("/dashboard/vendors", "Vendors", pathname.startsWith("/dashboard/vendors"), <IconStore />)}
              {navLink("/dashboard/files", "Files", pathname.startsWith("/dashboard/files"), <IconFiles />)}
              {navLink("/dashboard/links", "Links", pathname.startsWith("/dashboard/links"), <IconLink />)}
              {navLink("/dashboard/reports", "Reports", pathname.startsWith("/dashboard/reports"), <IconChart />)}
            </>
          )}
        </nav>
        {/* Sidebar footer: user + logout */}
        <div
          className={`flex-shrink-0 border-t border-[var(--sidebar-border)] p-3 ${
            sidebarCollapsed ? "flex flex-col items-center gap-2" : "space-y-2"
          }`}
        >
          <div
            className={`flex items-center gap-3 overflow-hidden ${
              sidebarCollapsed ? "justify-center" : ""
            }`}
            title={sidebarCollapsed ? displayName : undefined}
          >
            <IconUser />
            {!sidebarCollapsed && (
              <span className="text-sm font-medium text-[var(--sidebar-text)] truncate">
                {displayName}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={() => {
              logout();
              router.replace("/login");
            }}
            className={`flex items-center gap-3 w-full rounded-lg text-sm font-medium transition-colors text-[var(--sidebar-text-muted)] hover:bg-[var(--sidebar-hover-bg)] hover:text-[var(--sidebar-text)] ${
              sidebarCollapsed ? "px-3 py-2.5 justify-center" : "px-4 py-2.5"
            }`}
            title={sidebarCollapsed ? "Log out" : undefined}
          >
            <IconLogout />
            {!sidebarCollapsed && <span>Log out</span>}
          </button>
        </div>
      </aside>

      {/* Main area: header + content */}
      <div
        className="flex-1 flex flex-col min-h-screen transition-[margin-left] duration-200 ease-in-out"
        style={{ marginLeft: sidebarWidth }}
      >
        <header
          className="flex-shrink-0 flex items-center justify-between px-6 border-b border-[var(--header-border)]"
          style={{
            height: "var(--header-height)",
            backgroundColor: "var(--header-bg)",
            color: "var(--header-text)",
          }}
        >
          <button
            type="button"
            onClick={() => setSidebarCollapsed((c) => !c)}
            className="p-2 -ml-2 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--marine-light)] hover:text-[var(--marine-primary)] transition-colors md:hidden"
            title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <IconMenu />
          </button>
          <h1 className="text-lg font-semibold">
            {pathname === "/dashboard"
              ? "Dashboard"
              : pathname.startsWith("/dashboard/dealers")
                ? "Dealers"
                : pathname.startsWith("/dashboard/vendors")
                  ? "Vendors"
                  : pathname.startsWith("/dashboard/files")
                    ? "Files"
                    : pathname.startsWith("/dashboard/links")
                      ? "Links"
                      : pathname.startsWith("/dashboard/reports")
                        ? "Reports"
                        : "Dashboard"}
          </h1>
        </header>

        <main className="flex-1 overflow-auto p-6 bg-[var(--surface)]">
          <div className="max-w-5xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
