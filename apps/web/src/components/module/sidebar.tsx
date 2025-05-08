"use client";
import {
  Home,
  FileText,
  Calendar,
  CheckSquare,
  Box,
  Repeat,
  File,
  Sun,
  Moon,
  User2,
  ChevronUp,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuBadge,
  SidebarFooter,
} from "@/components/ui/sidebar";

import logo from "@/assets/logo.png";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
    title: "Collect",
    url: "/collect",
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
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <User2 /> zeroicey
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuItem asChild>
                  <Link href="/account">Account</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings">Settings</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
