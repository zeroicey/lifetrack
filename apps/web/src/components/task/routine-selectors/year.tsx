import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface YearSelectorProps {
    onYearSelected: (year: string) => void;
    selectedYear?: string;
}

export default function YearSelector({ onYearSelected, selectedYear }: YearSelectorProps) {
    const currentYear = new Date().getFullYear();
    const yearsPerPage = 12; // 每页显示12个年份，3行4列
    
    const [localSelectedYear, setLocalSelectedYear] = useState<string>(selectedYear || currentYear.toString());
    const [currentPage, setCurrentPage] = useState<number>(0); // 当前页码
    
    // 计算当前页的年份范围
    const getYearsForPage = (page: number) => {
        const startYear = currentYear - 10 + (page * yearsPerPage); // 从当前年份前10年开始
        return Array.from({ length: yearsPerPage }, (_, i) => startYear + i);
    };
    
    const currentYears = getYearsForPage(currentPage);
    
    const handleYearClick = (year: number) => {
        const yearString = year.toString();
        setLocalSelectedYear(yearString);
        onYearSelected(yearString);
    };
    
    const handlePrevPage = () => {
        setCurrentPage(prev => prev - 1);
    };
    
    const handleNextPage = () => {
        setCurrentPage(prev => prev + 1);
    };
    
    const handleThisYear = () => {
        // 计算当前年份应该在哪一页
        const pageForCurrentYear = Math.floor((currentYear - (currentYear - 10)) / yearsPerPage);
        setCurrentPage(pageForCurrentYear);
    };
    
    const startYear = currentYears[0];
    const endYear = currentYears[currentYears.length - 1];
    
    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="text-sm font-medium text-gray-700">
                    Select Year
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleThisYear}
                        className="h-8 px-3 text-xs"
                    >
                        This Year
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handlePrevPage}
                        className="h-8 w-8 p-0"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm text-gray-600 min-w-[80px] text-center">
                        {startYear} - {endYear}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleNextPage}
                        className="h-8 w-8 p-0"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
            
            <div className="grid grid-cols-4 gap-2">
                {currentYears.map((year) => {
                    const isSelected = localSelectedYear === year.toString();
                    const isCurrentYear = year === currentYear;
                    
                    return (
                        <Button
                            key={year}
                            variant={isSelected ? "default" : "outline"}
                            onClick={() => handleYearClick(year)}
                            className={`h-10 text-sm ${
                                isSelected
                                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                                    : isCurrentYear
                                    ? "border-orange-400 text-orange-600 hover:bg-orange-50"
                                    : "hover:bg-gray-50"
                            }`}
                        >
                            {year}
                        </Button>
                    );
                })}
            </div>
            
            {localSelectedYear && (
                <div className="mt-4 p-3 bg-gray-50 rounded-md">
                    <div className="text-sm text-gray-600">
                        Selected: <span className="font-medium text-gray-900">{localSelectedYear}</span>
                    </div>
                </div>
            )}
        </div>
    );
}