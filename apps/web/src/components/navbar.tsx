import { SidebarTrigger } from "@/components/ui/sidebar";
import { useLocation } from "react-router";
import { Separator } from "@/components/ui/separator";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useNavbarStore } from "@/stores/navbar";

export default function Navbar() {
    const rightContent = useNavbarStore((state) => state.rightContent);
    const location = useLocation();

    // 处理路径生成面包屑
    const generateBreadcrumbs = () => {
        const pathSegments = location.pathname
            .split("/")
            .filter((segment) => segment !== "");

        if (pathSegments.length === 0) {
            return (
                <BreadcrumbItem>
                    <BreadcrumbPage>Home</BreadcrumbPage>
                </BreadcrumbItem>
            );
        }

        if (pathSegments.length === 1) {
            // 单层路径，如 /moment
            const pageName =
                pathSegments[0].charAt(0).toUpperCase() +
                pathSegments[0].slice(1);
            return (
                <BreadcrumbItem>
                    <BreadcrumbPage>{pageName}</BreadcrumbPage>
                </BreadcrumbItem>
            );
        }

        // 多层路径，如 /moment/create
        const parentName =
            pathSegments[0].charAt(0).toUpperCase() + pathSegments[0].slice(1);
        const childName =
            pathSegments[1].charAt(0).toUpperCase() + pathSegments[1].slice(1);

        return (
            <>
                <BreadcrumbItem>
                    <BreadcrumbLink href={`/${pathSegments[0]}`}>
                        {parentName}
                    </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                    <BreadcrumbPage>{childName}</BreadcrumbPage>
                </BreadcrumbItem>
            </>
        );
    };

    return (
        <header className="flex h-12 items-center justify-between border-b px-4">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <Breadcrumb>
                    <BreadcrumbList>{generateBreadcrumbs()}</BreadcrumbList>
                </Breadcrumb>
            </div>
            {rightContent && <div className="ml-auto">{rightContent}</div>}
        </header>
    );
}
