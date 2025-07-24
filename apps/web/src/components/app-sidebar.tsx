"use client";
import { Home, FileText, CheckSquare, Box, Repeat } from "lucide-react";

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

// Menu items with badges.
const items = [
    {
        title: "Home",
        url: "/",
        icon: Home,
        badge: 5,
    },
    {
        title: "Moment",
        url: "/moment",
        icon: FileText,
        badge: 12,
    },
    {
        title: "Task",
        url: "/task",
        icon: CheckSquare,
        badge: 8,
    },
    {
        title: "Habit",
        url: "/habit",
        icon: Repeat,
        badge: 7,
    },
];

export function AppSidebar() {
    return (
        <Sidebar>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarGroupLabel>Application</SidebarGroupLabel>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <NavLink
                                            to={item.url}
                                            className="flex items-center gap-2"
                                        >
                                            <item.icon />
                                            <span>{item.title}</span>
                                            {item.title !== "Home" && (
                                                <SidebarMenuBadge>
                                                    {item.badge}
                                                </SidebarMenuBadge>
                                            )}
                                        </NavLink>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
}
