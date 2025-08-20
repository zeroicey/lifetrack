import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { X, Plus, Clock, Bell } from "lucide-react";
import { cn } from "@/lib/utils";

export interface RemindInputProps {
    value: number[]; // Array of minutes before event start
    onChange: (value: number[]) => void;
    className?: string;
}

// Predefined reminder options in minutes
const PRESET_REMINDERS = [
    { label: "5 minutes before", value: 5 },
    { label: "15 minutes before", value: 15 },
    { label: "30 minutes before", value: 30 },
    { label: "1 hour before", value: 60 },
    { label: "2 hours before", value: 120 },
    { label: "1 day before", value: 1440 }, // 24 * 60
    { label: "1 week before", value: 10080 }, // 7 * 24 * 60
];

// Custom reminder time units
const TIME_UNITS = [
    { label: "minutes", value: 1 },
    { label: "hours", value: 60 },
    { label: "days", value: 1440 },
    { label: "weeks", value: 10080 },
];

function formatReminderTime(minutes: number): string {
    if (minutes < 60) {
        return `${minutes} minute${minutes !== 1 ? "s" : ""} before`;
    } else if (minutes < 1440) {
        const hours = Math.floor(minutes / 60);
        return `${hours} hour${hours !== 1 ? "s" : ""} before`;
    } else if (minutes < 10080) {
        const days = Math.floor(minutes / 1440);
        return `${days} day${days !== 1 ? "s" : ""} before`;
    } else {
        const weeks = Math.floor(minutes / 10080);
        return `${weeks} week${weeks !== 1 ? "s" : ""} before`;
    }
}

export function RemindInput({ value, onChange, className }: RemindInputProps) {
    const [customValue, setCustomValue] = useState<string>("");
    const [customUnit, setCustomUnit] = useState<string>("60"); // Default to hours

    const addReminder = (minutes: number) => {
        if (!value.includes(minutes)) {
            const newValue = [...value, minutes].sort((a, b) => a - b);
            onChange(newValue);
        }
    };

    const removeReminder = (minutes: number) => {
        const newValue = value.filter((v) => v !== minutes);
        onChange(newValue);
    };

    const addCustomReminder = () => {
        const numValue = parseInt(customValue);
        const unitMultiplier = parseInt(customUnit);

        if (numValue > 0 && !isNaN(numValue)) {
            const totalMinutes = numValue * unitMultiplier;
            addReminder(totalMinutes);
            setCustomValue("");
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            addCustomReminder();
        }
    };

    return (
        <div className={cn("space-y-6", className)}>
            {/* Header */}
            <div className="space-y-2">
                <div className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-blue-600" />
                    <Label className="text-lg font-semibold">
                        Event Reminders
                    </Label>
                </div>
                <p className="text-sm text-muted-foreground">
                    Set up email reminders to be notified before your event
                    starts. You can select multiple reminder times.
                </p>
            </div>

            {/* Selected Reminders */}
            {value.length > 0 && (
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            Selected Reminders ({value.length})
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2">
                            {value.map((minutes) => (
                                <Badge
                                    key={minutes}
                                    variant="secondary"
                                    className="flex items-center gap-1 px-3 py-1"
                                >
                                    {formatReminderTime(minutes)}
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                                        onClick={() => removeReminder(minutes)}
                                    >
                                        <X className="h-3 w-3" />
                                    </Button>
                                </Badge>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Preset Reminders */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-base">Quick Select</CardTitle>
                    <CardDescription>
                        Choose from common reminder times
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {PRESET_REMINDERS.map((preset) => {
                            const isSelected = value.includes(preset.value);
                            return (
                                <Button
                                    key={preset.value}
                                    variant={isSelected ? "default" : "outline"}
                                    size="sm"
                                    className={cn(
                                        "justify-start text-left h-auto py-2 px-3",
                                        isSelected &&
                                            "bg-blue-600 hover:bg-blue-700"
                                    )}
                                    onClick={() => {
                                        if (isSelected) {
                                            removeReminder(preset.value);
                                        } else {
                                            addReminder(preset.value);
                                        }
                                    }}
                                >
                                    {preset.label}
                                </Button>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>

            {/* Custom Reminder */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-base">Custom Reminder</CardTitle>
                    <CardDescription>
                        Set a specific reminder time
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-2">
                        <div className="flex-1">
                            <Input
                                type="number"
                                placeholder="Enter number"
                                value={customValue}
                                onChange={(e) => setCustomValue(e.target.value)}
                                onKeyPress={handleKeyPress}
                                min="1"
                                className="w-full"
                            />
                        </div>
                        <Select
                            value={customUnit}
                            onValueChange={setCustomUnit}
                        >
                            <SelectTrigger className="w-32">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {TIME_UNITS.map((unit) => (
                                    <SelectItem
                                        key={unit.value}
                                        value={unit.value.toString()}
                                    >
                                        {unit.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Button
                            onClick={addCustomReminder}
                            disabled={
                                !customValue || parseInt(customValue) <= 0
                            }
                            size="icon"
                        >
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Preview */}
            <Card className="bg-muted/50">
                <CardHeader className="pb-3">
                    <CardTitle className="text-base">Preview</CardTitle>
                </CardHeader>
                <CardContent>
                    {value.length === 0 ? (
                        <p className="text-sm text-muted-foreground italic">
                            No reminders set. You can skip this step or add
                            reminders above.
                        </p>
                    ) : (
                        <div className="space-y-2">
                            <p className="text-sm font-medium">
                                You will receive {value.length} email reminder
                                {value.length !== 1 ? "s" : ""}:
                            </p>
                            <ul className="text-sm text-muted-foreground space-y-1">
                                {value
                                    .sort((a, b) => b - a) // Sort descending (earliest reminder first)
                                    .map((minutes) => (
                                        <li
                                            key={minutes}
                                            className="flex items-center gap-2"
                                        >
                                            <span className="w-2 h-2 bg-blue-600 rounded-full" />
                                            {formatReminderTime(minutes)}
                                        </li>
                                    ))}
                            </ul>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

export default RemindInput;
