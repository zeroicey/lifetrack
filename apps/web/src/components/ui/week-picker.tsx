import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { 
  format, 
  getWeek, 
  startOfWeek, 
  endOfWeek, 
  startOfMonth, 
  endOfMonth,
  eachDayOfInterval,
  isSameWeek,
  isSameMonth,
  addMonths,
  subMonths,
  startOfDay,
  isSameDay
} from "date-fns"
import { zhCN } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { Button } from "./button"
import { Card, CardContent, CardHeader, CardTitle } from "./card"

interface WeekPickerProps {
  value?: Date
  onChange?: (weekStart: Date, weekEnd: Date, weekNumber: number) => void
  className?: string
}

export function WeekPicker({ 
  value, 
  onChange,
  className 
}: WeekPickerProps) {
  const [currentDate, setCurrentDate] = React.useState(new Date())
  const [selectedWeekStart, setSelectedWeekStart] = React.useState<Date | null>(
    value ? startOfWeek(value, { weekStartsOn: 1 }) : null
  )

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  
  // 获取日历显示的起始和结束日期（包括前后月份的日期以填充完整的周）
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 })
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 })
  
  // 获取所有要显示的日期
  const calendarDays = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd
  })

  const today = startOfDay(new Date())

  const handleWeekSelect = (day: Date) => {
    const weekStart = startOfWeek(day, { weekStartsOn: 1 })
    const weekEnd = endOfWeek(day, { weekStartsOn: 1 })
    const weekNumber = getWeek(day, { weekStartsOn: 1 })
    
    setSelectedWeekStart(weekStart)
    onChange?.(weekStart, weekEnd, weekNumber)
  }

  const handleMonthChange = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => 
      direction === 'prev' ? subMonths(prev, 1) : addMonths(prev, 1)
    )
  }

  // 将日期按周分组
  const weeks = []
  for (let i = 0; i < calendarDays.length; i += 7) {
    weeks.push(calendarDays.slice(i, i + 7))
  }

  return (
    <Card className={cn("w-full max-w-lg", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <span>选择周次</span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleMonthChange('prev')}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-lg font-semibold min-w-[120px] text-center">
              {format(currentDate, 'yyyy年MM月', { locale: zhCN })}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleMonthChange('next')}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardTitle>
        {selectedWeekStart && (
          <div className="text-sm text-muted-foreground">
            已选择: {format(selectedWeekStart, 'yyyy年MM月dd日', { locale: zhCN })} - 
            {format(endOfWeek(selectedWeekStart, { weekStartsOn: 1 }), 'MM月dd日', { locale: zhCN })}
            （第{getWeek(selectedWeekStart, { weekStartsOn: 1 })}周）
          </div>
        )}
      </CardHeader>
      <CardContent>
        {/* 星期标题 */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['一', '二', '三', '四', '五', '六', '日'].map((day, index) => (
            <div key={index} className="h-8 flex items-center justify-center text-sm font-medium text-muted-foreground">
              {day}
            </div>
          ))}
        </div>

        {/* 日历主体 */}
        <div className="space-y-1">
          {weeks.map((week, weekIndex) => {
            const isSelectedWeek = selectedWeekStart && isSameWeek(week[0], selectedWeekStart, { weekStartsOn: 1 })
            const isCurrentWeekRow = isSameWeek(week[0], today, { weekStartsOn: 1 })

            return (
              <div 
                key={weekIndex} 
                className={cn(
                  "grid grid-cols-7 gap-1 rounded-md transition-all duration-200 cursor-pointer hover:bg-accent/50 p-1",
                  isSelectedWeek && "bg-primary/10 ring-2 ring-primary/20",
                  isCurrentWeekRow && !isSelectedWeek && "bg-accent/30"
                )}
                onClick={() => handleWeekSelect(week[0])}
                title={`选择第${getWeek(week[0], { weekStartsOn: 1 })}周 (${format(week[0], 'MM/dd', { locale: zhCN })} - ${format(week[6], 'MM/dd', { locale: zhCN })})`}
              >
                {week.map((day, dayIndex) => {
                  const isToday = isSameDay(day, today)
                  const isCurrentMonth = isSameMonth(day, currentDate)
                  
                  return (
                    <div
                      key={dayIndex}
                      className={cn(
                        "h-8 flex items-center justify-center text-sm rounded transition-colors",
                        !isCurrentMonth && "text-muted-foreground/40",
                        isCurrentMonth && "text-foreground",
                        isToday && "bg-primary text-primary-foreground font-semibold",
                        isSelectedWeek && !isToday && "text-primary font-medium"
                      )}
                    >
                      {format(day, 'd')}
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>

        <div className="mt-4 flex justify-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const today = new Date()
              setCurrentDate(today)
              handleWeekSelect(today)
            }}
          >
            回到本周
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default WeekPicker
