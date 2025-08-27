import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, Clock } from "lucide-react";
import { HabitLogItem } from "@/components/habit/habitlog-item";
import { type HabitLog } from "@/types/habit";

interface HabitLogListProps {
    logs: HabitLog[];
    isLoading: boolean;
}

export function HabitLogList({ logs, isLoading }: HabitLogListProps) {
    if (isLoading) {
        return (
            <Card className="h-full">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Habit Logs
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex justify-center items-center py-8">
                        <div>Loading logs...</div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    All Habit Logs
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                {logs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 px-6">
                        <Clock className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">
                            No logs yet
                        </h3>
                        <p className="text-muted-foreground text-center">
                            No logs found. Start tracking by adding your first
                            log entry.
                        </p>
                    </div>
                ) : (
                    <ScrollArea className="h-[600px] px-6">
                        <div className="py-4">
                            {logs.map((log) => (
                                <HabitLogItem key={log.id} log={log} />
                            ))}
                        </div>
                    </ScrollArea>
                )}
            </CardContent>
        </Card>
    );
}
