import { SidebarTrigger } from "@/components/ui/sidebar";
import { useLocation } from "react-router";
import { Separator } from "@/components/ui/separator";
import MomentNav from "./moment-nav";
import MomentCreateNav from "./moment-create-nav";
import TaskNav from "./task-nav";
import TaskGroupNav from "./task-group-nav";
import EventNav from "./event-nav";
import EventCreateNav from "./event-create-nav";

const rightContents = new Map<string, React.ReactNode>([
    ["/moment", <MomentNav />],
    ["/moment/create", <MomentCreateNav />],
    ["/task", <TaskNav />],
    ["/task/group", <TaskGroupNav />],
    ["/event", <EventNav />],
    ["/event/create", <EventCreateNav />],
]);

export default function Navbar() {
    const location = useLocation();
    return (
        <header className="flex items-center border-b px-4 py-4 gap-2 h-16">
            <SidebarTrigger />
            <Separator orientation="vertical" className="mr-2" />
            {rightContents.get(location.pathname)}
        </header>
    );
}
