"use client";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function Navbar() {
    return (
        <div className="w-full border-b p-1 flex flex-row items-center justify-center">
            <SidebarTrigger />
            <div className="w-full flex items-center flex-1 px-2">
                <span className="font-bold text-lg">lifetrack</span>
            </div>
        </div>
    );
}
