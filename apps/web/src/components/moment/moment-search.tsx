import { Search } from "lucide-react";

export default function MomentSearch() {
    return (
        <div className="max-w-[600px] w-full flex items-center border rounded-md gap-2 px-2">
            <input
                type="text"
                placeholder="Search"
                className="w-full p-2 border-none outline-none"
            />
            <button className="">
                <Search />
            </button>
        </div>
    );
}
