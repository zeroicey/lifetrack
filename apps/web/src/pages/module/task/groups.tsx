import { useState } from 'react';
import WeekPicker from '@/components/ui/week-picker';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

export default function GroupsPage() {
    const [selectedWeekStart, setSelectedWeekStart] = useState<Date>();
    const [selectedWeekEnd, setSelectedWeekEnd] = useState<Date>();
    const [selectedWeekNumber, setSelectedWeekNumber] = useState<number>();

    const handleWeekChange = (weekStart: Date, weekEnd: Date, weekNumber: number) => {
        setSelectedWeekStart(weekStart);
        setSelectedWeekEnd(weekEnd);
        setSelectedWeekNumber(weekNumber);
        console.log(`选择了第${weekNumber}周: ${format(weekStart, 'yyyy-MM-dd')} 到 ${format(weekEnd, 'yyyy-MM-dd')}`);
    };

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-2xl font-bold mb-4">任务分组页面</h1>
                <p className="text-muted-foreground mb-6">
                    点击日历中的任意一周来选择该周的任务分组
                </p>
            </div>
            
            <WeekPicker 
                value={selectedWeekStart}
                onChange={handleWeekChange}
                className="mx-auto"
            />
            
            {selectedWeekStart && selectedWeekEnd && selectedWeekNumber && (
                <div className="mt-6 p-4 bg-muted rounded-lg">
                    <h3 className="font-semibold mb-2">当前选择：</h3>
                    <p className="text-sm">
                        第{selectedWeekNumber}周 ({format(selectedWeekStart, 'yyyy年MM月dd日', { locale: zhCN })} - {format(selectedWeekEnd, 'MM月dd日', { locale: zhCN })})
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                        该周的任务分组管理
                    </p>
                </div>
            )}
        </div>
    );
}