import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import YearSelector from "../routine-selectors/year";
import MonthSelector from "../routine-selectors/month";

interface RoutineGroupSelectDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onGroupSelected?: () => void;
}

export default function RoutineGroupSelectDialog({
    open,
    onOpenChange,
    onGroupSelected,
}: RoutineGroupSelectDialogProps) {
    const [activeTab, setActiveTab] = useState<'Day' | 'Week' | 'Month' | 'Year'>('Day');
    const [selectedYear, setSelectedYear] = useState<string>('');
    const [selectedMonth, setSelectedMonth] = useState<string>('');
    
    const handleClose = () => {
        onOpenChange(false);
    };

    const handleSelect = () => {
        // TODO: 实现选择逻辑
        handleClose();
        onGroupSelected?.();
    };
    
    const tabs = ['Day', 'Week', 'Month', 'Year'] as const;
    
    const handleYearSelected = (year: string) => {
        setSelectedYear(year);
        console.log('Selected year:', year);
    };

    const handleMonthSelected = (month: string) => {
        setSelectedMonth(month);
        console.log('Selected month:', month);
    };
    
    const renderTabContent = () => {
        switch (activeTab) {
            case 'Day':
                return <div className="text-center text-gray-500">Day content will be implemented later</div>;
            case 'Week':
                return <div className="text-center text-gray-500">Week content will be implemented later</div>;
            case 'Month':
                return (
                    <MonthSelector
                        onMonthSelected={handleMonthSelected}
                    />
                );
            case 'Year':
                return <YearSelector onYearSelected={handleYearSelected} selectedYear={selectedYear} />;
            default:
                return <div className="text-center text-gray-500">Content will be implemented later</div>;
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">
                        Select Routine Group
                    </DialogTitle>
                    <DialogDescription className="text-gray-600">
                        Select a routine group for your tasks.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-6 py-4">
                    {/* Tab Navigation */}
                    <div className="flex border-b border-gray-200">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                                    activeTab === tab
                                        ? 'border-blue-600 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                    
                    {/* Tab Content */}
                    <div className="min-h-[200px] py-4">
                        {renderTabContent()}
                    </div>
                    
                    <div className="flex justify-end gap-3 pt-4">
                        <Button variant="outline" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSelect}
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            Select
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}