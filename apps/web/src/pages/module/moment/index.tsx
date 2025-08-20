import MomentList from "@/components/moment/moment-list";
import MomentSearch from "@/components/moment/moment-search";
import { Button } from "@/components/ui/button";
import { useNavbarStore } from "@/stores/navbar";
import { useEffect } from "react";
import { Link } from "react-router";

export default function MomentPage() {
    const { setRightContent, clearRightContent } = useNavbarStore();

    useEffect(() => {
        setRightContent(
            <Link to={"/moment/create"}>
                <Button variant={"outline"}>Create a moment</Button>
            </Link>
        );
        return () => clearRightContent();
    }, [clearRightContent, setRightContent]);

    return (
        <div className="overflow-auto h-full w-full flex justify-center">
            <div className="w-full flex flex-col gap-2 p-2 justify-center items-center">
                <MomentSearch />
                <MomentList />
            </div>
        </div>
    );
}
