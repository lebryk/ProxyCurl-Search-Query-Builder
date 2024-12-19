import { Building, UserCircle } from "lucide-react";
import { 
  SidebarFooter, 
  SidebarSeparator, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton 
} from "@/components/ui/sidebar";
import { useRouter } from "next/navigation";

const footerItems = [
  { icon: UserCircle, label: "Account", path: "/account" },
  { icon: Building, label: "Company Profile", path: "/company" },
];

export function FooterItems() {
  const router = useRouter();

  return (
    <SidebarFooter>
      <SidebarSeparator />
      <SidebarMenu>
        {footerItems.map((item) => (
          <SidebarMenuItem key={item.label}>
            <SidebarMenuButton 
              tooltip={item.label}
              onClick={() => router.push(item.path)}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarFooter>
  );
}