import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface YearSelectorProps {
    onYearSelected: (year: string) => void;
    selectedYear?: string;
}

export default function YearSelector({ onYearSelected, selectedYear }: YearSelectorProps) {
    const currentYear = new Date().getFullYear();
    const yearsPerPage = 12; // Display 12 years per page, 3 rows x 4 columns
    
    const [localSelectedYear, setLocalSelectedYear] = useState<string>(selectedYear || currentYear.toString());
    const [currentPage, setCurrentPage] = useState<number>(0); // Current page number
    
    // Calculate year range for current page
    const getYearsForPage = (page: number) => {
        const startYear = currentYear - 10 + (page * yearsPerPage); // Start from 10 years before current year
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
    

    
    const startYear = currentYears[0];
    const endYear = currentYears[currentYears.length - 1];
    
    return (
        <div className="space-y-3">
            <div className="flex items-center justify-center gap-2">
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
            
            <div className="grid grid-cols-4 gap-2">
                {currentYears.map((year) => {
                    const isSelected = localSelectedYear === year.toString();
                    const isCurrentYear = year === currentYear;
                    
                    return (
                        <Button
                            key={year}
                            variant={isSelected ? "default" : isCurrentYear ? "secondary" : "outline"}
                            onClick={() => handleYearClick(year)}
                            className={`h-8 text-xs ${
                                isSelected
                                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                                    : isCurrentYear
                                    ? "bg-orange-100 border-orange-300 text-orange-700 hover:bg-orange-200 hover:border-orange-400"
                                    : "hover:bg-gray-50"
                            }`}
                        >
                            {year}
                        </Button>
                    );
                })}
            </div>
            

        </div>
    );
}