import { Toaster } from "@/components/ui/sonner";
import { Outlet } from "react-router";
import QueryProvider from "@/providers/QueryProvider";

export default function RootLayout() {
    return (
        <QueryProvider>
            <Toaster position={"bottom-center"} />
            <Outlet />
        </QueryProvider>
    );
}
