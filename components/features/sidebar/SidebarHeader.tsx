import { SidebarHeader, SidebarTrigger } from "@/components/ui/sidebar";
import Link from "next/link";

export function AppSidebarHeader() {
  return (
    <SidebarHeader className="h-14 border-b">
      <div className="w-full h-full flex items-center justify-between px-4 group-data-[state=collapsed]:justify-center">
        <Link 
          href="/dashboard" 
          className="flex items-center hover:opacity-80 transition-opacity"
        >
          <img 
            src="/logo.png" 
            alt="Nominait Logo" 
            className="h-4 object-contain"
          />
        </Link>
        <SidebarTrigger />
      </div>
    </SidebarHeader>
  );
}