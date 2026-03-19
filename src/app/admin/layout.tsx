import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import {
  LayoutDashboard,
  FileText,
  Users,
  AlertTriangle,
  Megaphone,
  Star,
  Mail,
  ExternalLink,
} from "lucide-react";
import { AdminMobileNav } from "./admin-mobile-nav";

const sidebarLinks = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Applications", href: "/admin/applications", icon: FileText },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Mailing List", href: "/admin/waitlist", icon: Mail },
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
      <aside className="hidden md:flex w-64 flex-col bg-white border-r border-border shrink-0">
        {/* Logo */}
        <div className="flex h-16 items-center border-b border-border px-6">
          <Link href="/admin" className="flex items-center gap-2 text-xl font-bold tracking-tight">
            <span className="text-accent">Beauty</span>
            <span className="text-cta">Link</span>
            <span className="rounded-full bg-accent/10 text-accent text-xs font-medium px-2 py-0.5">
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
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted transition-colors hover:bg-gray-50 hover:text-dark"
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-border px-3 py-4 space-y-2">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted transition-colors hover:bg-gray-50 hover:text-dark"
          >
            <ExternalLink className="h-4 w-4 shrink-0" />
            <span>Back to main site</span>
          </Link>
          <p className="px-3 text-xs text-muted">BeautyLink Admin Panel</p>
        </div>
      </aside>

      {/* Mobile Header + Nav */}
      <AdminMobileNav links={sidebarLinks.map(({ label, href }) => ({ label, href }))} />

      {/* Main content */}
      <main className="flex-1 overflow-y-auto bg-background p-4 pt-16 md:pt-8 md:p-8">
        {children}
      </main>
    </div>
  );
}
