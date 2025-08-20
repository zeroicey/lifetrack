import { useNavigate } from "react-router";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "../ui/breadcrumb";
import { ArrowLeft, ArrowRightLeft } from "lucide-react";

export default function TaskGroupNav() {
    const navigate = useNavigate();
    return (
        <div className="w-full flex items-center justify-between">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink
                            className="cursor-pointer text-xl"
                            onClick={() => navigate("task")}
                        >
                            Task
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage className="text-lg">
                            Groups
                        </BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <span
                className="flex items-center gap-2 text-lg cursor-pointer"
                onClick={() => navigate("task")}
            >
                <ArrowLeft size={16} />
                Back
            </span>
        </div>
    );
}
