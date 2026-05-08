"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { useQuery } from "convex/react";
import {
  FolderOpen,
  Info,
  LayoutDashboard,
  LogOut,
  Paintbrush,
  Phone,
  Settings,
  Sparkles,
  Star,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { api } from "../../../convex/_generated/api";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const mainNav = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
];

const contentNav = [
  { href: "/admin/hero", label: "Hero", icon: Sparkles },
  { href: "/admin/services", label: "Services", icon: Paintbrush },
  { href: "/admin/projects", label: "Projects", icon: FolderOpen },
  { href: "/admin/about", label: "About", icon: Info },
  { href: "/admin/reviews", label: "Reviews", icon: Star },
  { href: "/admin/contact", label: "Contact", icon: Phone },
];

const systemNav = [
  { href: "/admin/settings", label: "Site Settings", icon: Settings },
  { href: "/admin/users", label: "Users", icon: Users },
];

function NavLink({
  href,
  label,
  icon: Icon,
  isActive,
}: {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  isActive: boolean;
}) {
  const { setOpenMobile } = useSidebar();

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        isActive={isActive}
        render={<Link href={href} onClick={() => setOpenMobile(false)} />}
      >
        <Icon />
        <span>{label}</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

function SidebarNav() {
  const pathname = usePathname();

  return (
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            {mainNav.map((item) => (
              <NavLink
                key={item.href}
                href={item.href}
                label={item.label}
                icon={item.icon}
                isActive={pathname === item.href}
              />
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <SidebarGroup>
        <SidebarGroupLabel>Website Sections</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {contentNav.map((item) => (
              <NavLink
                key={item.href}
                href={item.href}
                label={item.label}
                icon={item.icon}
                isActive={pathname === item.href}
              />
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <SidebarGroup>
        <SidebarGroupLabel>System</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {systemNav.map((item) => (
              <NavLink
                key={item.href}
                href={item.href}
                label={item.label}
                icon={item.icon}
                isActive={pathname === item.href}
              />
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  );
}

function SidebarUserMenu() {
  const user = useQuery(api.auth.currentUser);
  const { signOut } = useAuthActions();

  return (
    <SidebarFooter className="border-t border-sidebar-border">
      <SidebarMenu>
        <SidebarMenuItem>
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
              {user?.name?.charAt(0).toUpperCase() || "A"}
            </div>
            <div className="flex flex-1 flex-col items-start text-left min-w-0">
              <span className="text-sm font-medium truncate">
                {user?.name || "Admin"}
              </span>
              <span className="text-xs text-muted-foreground truncate">
                {user?.email}
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
              onClick={() => signOut()}
              title="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  );
}

function SidebarHeaderContent() {
  return (
    <SidebarHeader className="border-b border-sidebar-border">
      <Link
        href="/admin/dashboard"
        className="flex items-center gap-2.5 px-2 py-1 font-semibold text-lg"
      >
        <div className="size-8 rounded-lg bg-primary flex items-center justify-center">
          <Paintbrush className="size-4 text-primary-foreground" />
        </div>
        <span>M5 Admin</span>
      </Link>
    </SidebarHeader>
  );
}

export function AdminSidebar() {
  return (
    <Sidebar>
      <SidebarHeaderContent />
      <SidebarNav />
      <SidebarUserMenu />
    </Sidebar>
  );
}
