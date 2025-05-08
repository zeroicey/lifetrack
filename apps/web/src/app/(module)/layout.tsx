import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/module/sidebar";
import { Navbar } from "@/components/module/navbar";

export default function ModuleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex flex-col w-screen h-screen">
        <Navbar />
        <div className="flex-1 overflow-hidden p-3">{children}</div>
      </div>
    </SidebarProvider>
  );
}
