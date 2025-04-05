
import { 
  BarChart3, 
  Home, 
  Layout, 
  List, 
  Settings, 
  Target, 
  Clock,
  Calendar,
  Menu
} from "lucide-react";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem, 
  SidebarTrigger
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";

export function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const menuItems = [
    { icon: Home, label: "Dashboard", path: "/" },
    { icon: Target, label: "Objectives", path: "/objectives" },
    { icon: Layout, label: "Matrix", path: "/matrix" },
    { icon: List, label: "Projects", path: "/projects" },
    { icon: BarChart3, label: "Reports", path: "/reports" },
    { icon: Calendar, label: "Timeline", path: "/timeline" },
  ];
  
  const bottomMenuItems = [
    { icon: Settings, label: "Settings", path: "/settings" },
  ];
  
  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Target className="h-6 w-6 text-sidebar-primary" />
            <span className="font-bold text-lg">Nexus</span>
          </div>
          <SidebarTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </SidebarTrigger>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="py-2">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.path}>
              <SidebarMenuButton
                onClick={() => navigate(item.path)}
                className={
                  location.pathname === item.path
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : ""
                }
              >
                <item.icon className="h-5 w-5 mr-2" />
                <span>{item.label}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      
      <SidebarFooter className="border-t border-sidebar-border py-2">
        <SidebarMenu>
          {bottomMenuItems.map((item) => (
            <SidebarMenuItem key={item.path}>
              <SidebarMenuButton
                onClick={() => navigate(item.path)}
                className={
                  location.pathname === item.path
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : ""
                }
              >
                <item.icon className="h-5 w-5 mr-2" />
                <span>{item.label}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
