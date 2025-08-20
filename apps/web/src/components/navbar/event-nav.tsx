import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import { useNavigate } from "react-router";

export default function EventNav() {
    const navigate = useNavigate();
    return (
        <div className="w-full flex justify-between items-center">
            <span className="text-xl">Event</span>
            <Button
                variant="outline"
                className="text-md cursor-pointer"
                onClick={() => {
                    navigate("event/create");
                }}
            >
                <Plus />
                New Event
            </Button>
        </div>
    );
}
