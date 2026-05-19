"use client";

import { Authenticated, Unauthenticated } from "convex/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { Toaster } from "sonner";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";

function AuthGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  return (
    <>
      <Authenticated>
        {isLoginPage ? (
          <RedirectToDashboard />
        ) : (
          <SidebarProvider>
            <AdminSidebar />
            <SidebarInset>
              <header className="flex h-12 items-center border-b px-4 lg:hidden">
                <SidebarTrigger />
              </header>
              {children}
            </SidebarInset>
          </SidebarProvider>
        )}
      </Authenticated>
      <Unauthenticated>
        {isLoginPage ? children : <RedirectToLogin />}
      </Unauthenticated>
    </>
  );
}

function RedirectToDashboard() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/admin/dashboard");
  }, [router]);
  return null;
}

function RedirectToLogin() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/admin/login");
  }, [router]);
  return null;
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TooltipProvider>
      <Toaster />
      <AuthGuard>{children}</AuthGuard>
    </TooltipProvider>
  );
}
