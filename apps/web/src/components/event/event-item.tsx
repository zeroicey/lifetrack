import { CalendarIcon, ClockIcon, MapPinIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { type Event } from "@/types/event";

interface EventItemProps {
    event: Event;
}

export function EventItem({ event }: EventItemProps) {
    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat("zh-CN", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        }).format(new Date(date));
    };

    const formatTime = (date: Date) => {
        return new Intl.DateTimeFormat("zh-CN", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        }).format(new Date(date));
    };

    const formatDuration = () => {
        const start = new Date(event.start_time);
        const end = new Date(event.end_time);
        const diffMs = end.getTime() - start.getTime();
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffMinutes = Math.floor(
            (diffMs % (1000 * 60 * 60)) / (1000 * 60)
        );

        if (diffHours > 0) {
            return diffMinutes > 0
                ? `${diffHours}小时${diffMinutes}分钟`
                : `${diffHours}小时`;
        }
        return `${diffMinutes}分钟`;
    };

    const isToday = () => {
        const today = new Date();
        const eventDate = new Date(event.start_time);
        return (
            today.getFullYear() === eventDate.getFullYear() &&
            today.getMonth() === eventDate.getMonth() &&
            today.getDate() === eventDate.getDate()
        );
    };

    const isPast = () => {
        return new Date(event.end_time) < new Date();
    };

    const formatReminders = () => {
        if (!event.reminders || event.reminders.length === 0) {
            return null;
        }

        return event.reminders.map((reminder) => {
            const minutes = reminder.remind_before;
            // 验证数值有效性
            if (typeof minutes !== "number" || isNaN(minutes) || minutes < 0) {
                return "无效提醒";
            }

            if (minutes < 60) {
                return `${minutes}分钟前`;
            } else if (minutes < 1440) {
                const hours = Math.floor(minutes / 60);
                return `${hours}小时前`;
            } else {
                const days = Math.floor(minutes / 1440);
                return `${days}天前`;
            }
        });
    };

    return (
        <Card
            className={`transition-all hover:shadow-md ${
                isPast() ? "opacity-75" : ""
            } ${isToday() ? "border-blue-200 bg-blue-50/50" : ""}`}
        >
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <CardTitle className="text-lg font-semibold text-gray-900">
                        {event.name}
                    </CardTitle>
                    <div className="flex gap-1">
                        {isToday() && (
                            <Badge
                                variant="secondary"
                                className="bg-blue-100 text-blue-700"
                            >
                                今天
                            </Badge>
                        )}
                        {isPast() && (
                            <Badge variant="outline" className="text-gray-500">
                                已结束
                            </Badge>
                        )}
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-3">
                {/* 时间信息 */}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CalendarIcon className="h-4 w-4" />
                    <span>{formatDate(event.start_time)}</span>
                    <ClockIcon className="h-4 w-4 ml-2" />
                    <span>
                        {formatTime(event.start_time)} -{" "}
                        {formatTime(event.end_time)}
                    </span>
                    <span className="text-gray-400">({formatDuration()})</span>
                </div>

                {/* 地点信息 */}
                {event.place && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPinIcon className="h-4 w-4" />
                        <span>{event.place}</span>
                    </div>
                )}

                {/* 描述信息 */}
                {event.description && (
                    <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md">
                        {event.description}
                    </div>
                )}

                {/* 提醒信息 */}
                {formatReminders() && (
                    <div className="flex flex-wrap gap-1">
                        {formatReminders()?.map((reminder, index) => (
                            <Badge
                                key={index}
                                variant="outline"
                                className="text-xs text-orange-600 border-orange-200"
                            >
                                🔔 {reminder}
                            </Badge>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
