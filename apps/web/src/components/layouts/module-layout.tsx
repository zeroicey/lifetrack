import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Outlet } from "react-router";
import Navbar from "@/components/navbar";

export default function ModuleLayout() {
    return (
        <SidebarProvider>
            <div className="flex h-screen w-screen overflow-hidden">
                <AppSidebar />

                <div className="flex flex-col flex-1 overflow-hidden ">
                    <Navbar />
                    <div className="flex-1 overflow-auto p-1">
                        <Outlet />
                    </div>
                </div>
            </div>
        </SidebarProvider>
    );
}
