"use client";
import Link from "next/link";
import { SidebarTrigger } from "@/components/ui/sidebar";

// 右侧的内容用一个列表存储，一个是名字，一个是跳转的链接
interface rightContent {
  name: string;
  url: string;
  onClick?: () => void;
}

export function Navbar() {
  return (
    <div className="w-full p-0.5 flex items-center border-b">
      <SidebarTrigger />
      <div className="w-full flex items-center flex-1 justify-between px-2">
        <div>
          <Link href="/task">task</Link>
        </div>
        <div>
          <div className="flex gap-2">
            <Link href="/task" className="text-sm hover:underline">
              task
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
