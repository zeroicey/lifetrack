import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar } from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { type HabitLog } from "@/types/habit";

interface HabitLogItemProps {
    log: HabitLog;
}

export function HabitLogItem({ log }: HabitLogItemProps) {
    return (
        <Card className="mb-3">
            <CardContent className="p-4">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="text-xs">
                                {log.habit_name}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                                #{log.id}
                            </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                <span>
                                    {format(new Date(log.happened_at), "MMM dd, yyyy")}
                                </span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span>
                                    {format(new Date(log.happened_at), "HH:mm")}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(log.happened_at), {
                            addSuffix: true,
                        })}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}