import { Search, Star, FileSearch, Scale, Send, ClipboardCheck, Database } from "lucide-react";
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { useRouter, usePathname } from "next/navigation";

const menuItems = [
  { icon: FileSearch, label: "Search Query Builder", path: "/search" },
  { icon: Search, label: "Candidate Search", path: "/search-results" },
  { icon: Star, label: "Shortlist & Profiles Enrichment", path: "/shortlist" },
  { icon: ClipboardCheck, label: "Culture Fit Survey", path: "/survey" },
  { icon: Scale, label: "Compare Candidates", path: "/compare" },
  { icon: Send, label: "Outreach", path: "/outreach" },
  { icon: Database, label: "Cache Tester", path: "/cache-tester" },
];

export function MenuItems() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <SidebarMenu className="px-2 py-3">
      {menuItems.map((item) => (
        <SidebarMenuItem key={item.path}>
          <SidebarMenuButton
            onClick={() => router.push(item.path)}
            tooltip={item.label}
            style={{ color: pathname === item.path ? "#2563eb" : undefined }}
          >
            <item.icon className="h-4 w-4" />
            <span>{item.label}</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}