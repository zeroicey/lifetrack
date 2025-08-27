import { useHabitQuery, useHabitLogQuery } from "@/hooks/use-habit-query";
import { HabitList } from "@/components/habit/habit-list";
import { HabitLogList } from "@/components/habit/habitlog-list";

export default function HabitPage() {
    const { data: habits = [], isLoading } = useHabitQuery();
    const { data: logs = [], isLoading: isLoadingLogs } = useHabitLogQuery();

    return (
        <div className="overflow-auto h-full w-full p-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-[1400px] mx-auto">
                <div>
                    <HabitList 
                        habits={habits} 
                        isLoading={isLoading}
                    />
                </div>
                <div>
                    <HabitLogList 
                        logs={logs} 
                        isLoading={isLoadingLogs}
                    />
                </div>
            </div>
        </div>
    );
}
