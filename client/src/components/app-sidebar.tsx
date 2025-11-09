import {
  Calendar,
  ClipboardList,
  FileText,
  Home,
  School,
  ClipboardCheck,
  Plus,
  LogOut,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

const menuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  {
    title: "Daftar Tugas",
    url: "/tasks",
    icon: ClipboardList,
  },
  {
    title: "Jadwal Kegiatan",
    url: "/calendar",
    icon: Calendar,
  },
  {
    title: "Kegiatan Supervisi",
    url: "/supervisions",
    icon: ClipboardCheck,
  },
  {
    title: "Sekolah Binaan",
    url: "/schools",
    icon: School,
  },
  {
    title: "Tugas Tambahan",
    url: "/additional",
    icon: Plus,
  },
  {
    title: "Laporan",
    url: "/reports",
    icon: FileText,
  },
];

export function AppSidebar() {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();

  const handleLogout = () => {
    // Clear auth token
    localStorage.removeItem('auth_token');
    
    // Show toast notification
    toast({
      title: "Berhasil",
      description: "Anda telah keluar dari aplikasi",
    });
    
    // Redirect to login page
    setLocation('/login');
  };

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-lg font-bold px-4 py-4">
            Pengawas Sekolah
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location === item.url}>
                    <Link href={item.url} data-testid={`link-${item.url.slice(1) || 'dashboard'}`}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t">
        <button
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          onClick={handleLogout}
          data-testid="button-logout"
        >
          <LogOut className="h-4 w-4" />
          <span>Keluar</span>
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}
