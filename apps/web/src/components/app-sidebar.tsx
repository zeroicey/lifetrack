"use client";
import { Home, FileText, CheckSquare, Repeat } from "lucide-react";

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuBadge,
    SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { NavLink } from "react-router";

type MenuItem = {
    title: string;
    url: string;
    icon: React.ComponentType;
    badge?: number;
    isEnd: boolean;
};

// Menu items with badges.
const items: MenuItem[] = [
    {
        title: "Home",
        url: "/home",
        icon: Home,
        badge: 5,
        isEnd: false,
    },
    {
        title: "Moment",
        url: "/moment",
        icon: FileText,
        badge: 12,
        isEnd: false,
    },
    {
        title: "Task",
        url: "/task",
        icon: CheckSquare,
        badge: 8,
        isEnd: false,
    },
    {
        title: "Habit",
        url: "/habit",
        icon: Repeat,
        badge: 7,
        isEnd: false,
    },
];

export function AppSidebar() {
    return (
        <Sidebar>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarGroupLabel className="flex items-center gap-2">
                            <img
                                src="/logo.png"
                                alt="Lifetrack"
                                className="w-6 h-6"
                            />
                            Lifetrack
                        </SidebarGroupLabel>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <NavLink
                                        to={item.url}
                                        className="flex items-center gap-2"
                                        end={item.isEnd}
                                    >
                                        {({ isActive }) => (
                                            <SidebarMenuButton
                                                isActive={isActive}
                                            >
                                                <item.icon />
                                                <span>{item.title}</span>
                                                <SidebarMenuBadge>
                                                    {item.badge}
                                                </SidebarMenuBadge>
                                            </SidebarMenuButton>
                                        )}
                                    </NavLink>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
}
