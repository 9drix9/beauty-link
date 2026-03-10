import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import {
  LayoutDashboard,
  FileText,
  Users,
  AlertTriangle,
  Megaphone,
  Star,
} from "lucide-react";
import { AdminMobileNav } from "./admin-mobile-nav";

const sidebarLinks = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Applications", href: "/admin/applications", icon: FileText },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Disputes", href: "/admin/disputes", icon: AlertTriangle },
  { label: "Banners", href: "/admin/banners", icon: Megaphone },
  { label: "Featured", href: "/admin/featured", icon: Star },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col bg-gray-900 text-white shrink-0">
        {/* Logo */}
        <div className="flex h-16 items-center border-b border-white/10 px-6">
          <Link href="/admin" className="text-xl font-bold tracking-tight">
            <span className="text-purple-400">Beauty</span>
            <span className="text-orange-400">Link</span>
            <span className="ml-2 text-sm font-normal text-white/60">
              Admin
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white"
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-white/10 px-6 py-4">
          <p className="text-xs text-white/40">BeautyLink Admin Panel</p>
        </div>
      </aside>

      {/* Mobile Header + Nav */}
      <AdminMobileNav links={sidebarLinks.map(({ label, href }) => ({ label, href }))} />

      {/* Main content */}
      <main className="flex-1 overflow-y-auto bg-gray-50 p-4 pt-16 md:pt-8 md:p-8">
        {children}
      </main>
    </div>
  );
}
