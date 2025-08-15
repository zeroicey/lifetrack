import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface MonthSelectorProps {
    onMonthSelected: (month: string) => void;
}

const MonthSelector: React.FC<MonthSelectorProps> = ({ onMonthSelected }) => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    const [selectedYear, setSelectedYear] = useState(currentYear);
    const [selectedMonth, setSelectedMonth] = useState<number | null>(null);

    const months = [
        { value: 1, name: 'Jan' },
        { value: 2, name: 'Feb' },
        { value: 3, name: 'Mar' },
        { value: 4, name: 'Apr' },
        { value: 5, name: 'May' },
        { value: 6, name: 'Jun' },
        { value: 7, name: 'Jul' },
        { value: 8, name: 'Aug' },
        { value: 9, name: 'Sep' },
        { value: 10, name: 'Oct' },
        { value: 11, name: 'Nov' },
        { value: 12, name: 'Dec' }
    ];

    const handlePrevYear = () => {
        setSelectedYear(prev => prev - 1);
    };

    const handleNextYear = () => {
        setSelectedYear(prev => prev + 1);
    };

    const handleThisMonth = () => {
        setSelectedYear(currentYear);
        setSelectedMonth(currentMonth);
        const monthStr = currentMonth.toString().padStart(2, '0');
        onMonthSelected(`${currentYear}-${monthStr}`);
    };

    const handleMonthClick = (month: number) => {
        setSelectedMonth(month);
        const monthStr = month.toString().padStart(2, '0');
        onMonthSelected(`${selectedYear}-${monthStr}`);
    };

    return (
        <div className="space-y-4">
            {/* Year Navigation */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="text-sm font-medium text-gray-700">
                    Select Month
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleThisMonth}
                        className="h-8 px-3 text-xs"
                    >
                        This Month
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handlePrevYear}
                        className="h-8 w-8 p-0"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm text-gray-600 min-w-[60px] text-center font-medium">
                        {selectedYear}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleNextYear}
                        className="h-8 w-8 p-0"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Month Grid */}
            <div className="grid grid-cols-3 gap-2">
                {months.map((month) => {
                    const isSelected = selectedMonth === month.value;
                    const isCurrentMonth = selectedYear === currentYear && month.value === currentMonth;
                    
                    return (
                        <Button
                            key={month.value}
                            variant={isSelected ? "default" : isCurrentMonth ? "secondary" : "outline"}
                            size="sm"
                            onClick={() => handleMonthClick(month.value)}
                            className={`h-10 text-sm ${
                                isCurrentMonth && !isSelected
                                    ? 'bg-orange-100 border-orange-300 text-orange-700 hover:bg-orange-200 hover:border-orange-400'
                                    : ''
                            }`}
                        >
                            {month.name}
                        </Button>
                    );
                })}
            </div>

            {/* Selected Display */}
            {selectedMonth && (
                <div className="text-sm text-gray-600">
                    Selected: {selectedYear}-{selectedMonth.toString().padStart(2, '0')}
                </div>
            )}
        </div>
    );
};

export default MonthSelector;