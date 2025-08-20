import { useTaskStore } from "@/stores/task";
import { Button } from "../ui/button";
import { useNavigate } from "react-router";
import { useIsPhone } from "@/hooks/use-mobile";

export default function TaskNav() {
    const { selectedTaskGroupName } = useTaskStore();
    const navigate = useNavigate();
    const isPhone = useIsPhone();
    return (
        <div className="w-full flex justify-between items-center">
            <span className="text-xl">Task</span>
            <Button
                disabled={!isPhone}
                variant="outline"
                className="text-md cursor-pointer"
                onClick={() => {
                    navigate("task/group");
                }}
            >
                {selectedTaskGroupName}
            </Button>
        </div>
    );
}
