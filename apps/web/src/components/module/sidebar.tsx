"use client";
import {
  Home,
  FileText,
  Calendar,
  CheckSquare,
  Box,
  Repeat,
  File,
} from "lucide-react";
import Link from "next/link";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuBadge,
  SidebarFooter,
} from "@/components/ui/sidebar";

import { useUserStore } from "@/store/user";
import { UserCard } from "./user-card";

// Menu items with badges.
const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
    badge: 5,
  },
  {
    title: "Memo",
    url: "/memo",
    icon: FileText,
    badge: 12,
  },
  {
    title: "Calendar",
    url: "/calendar",
    icon: Calendar,
    badge: 3,
  },
  {
    title: "Task",
    url: "/task",
    icon: CheckSquare,
    badge: 8,
  },
  {
    title: "Link",
    url: "/link",
    icon: Box,
    badge: 15,
  },
  {
    title: "Habit",
    url: "/habit",
    icon: Repeat,
    badge: 7,
  },
  {
    title: "Article",
    url: "/article",
    icon: File,
    badge: 24,
  },
];

export function AppSidebar() {
  const { email, avatar, username } = useUserStore();
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url} className="flex items-center gap-2">
                      <item.icon />
                      <span>{item.title}</span>
                      {item.title !== "Home" && (
                        <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <UserCard
          user={{
            name: username!,
            email: email!,
            avatar: avatar!,
          }}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
