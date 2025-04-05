
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Outlet } from "react-router-dom";

export function MainLayout() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1 overflow-x-hidden">
          <div className="container mx-auto p-4 md:p-6 max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
