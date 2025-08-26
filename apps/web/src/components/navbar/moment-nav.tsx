import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import { useNavigate } from "react-router";

export default function MomentNav() {
    const navigate = useNavigate();
    return (
        <div className="w-full flex justify-between items-center">
            <span className="text-xl">Moment</span>
            <Button
                className="text-md cursor-pointer"
                onClick={() => {
                    navigate("moment/create");
                }}
            >
                <Plus />
                New Moment
            </Button>
        </div>
    );
}
