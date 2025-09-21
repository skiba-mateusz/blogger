import type React from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./app-sidebar";

export function AppLayout({ children }: React.PropsWithChildren) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="p-2 w-full">
        <SidebarTrigger className="mb-2" />
        {children}
      </main>
    </SidebarProvider>
  );
}
