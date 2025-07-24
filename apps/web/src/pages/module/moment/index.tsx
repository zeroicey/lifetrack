import MomentList from "@/components/moment/moment-list";
import MomentSearch from "@/components/moment/moment-search";

export default function MomentPage() {
    return (
        <div className="border rounded-lg overflow-auto h-full w-full flex justify-center">
            <div className="w-[500px] flex flex-col gap-2 p-2">
                <MomentSearch />
                <MomentList />
            </div>
        </div>
    );
}
