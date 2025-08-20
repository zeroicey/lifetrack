import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import BasicInput from "@/components/event/setp-inputs/basic-input";
import { TimeInput } from "@/components/event/step-inputs/time-input";
import { isAfter, format, addHours } from "date-fns";

interface EventFormData {
    name: string;
    description: string;
    location: string;
    startDate?: Date;
    startTime: string;
    endDate?: Date;
    endTime: string;
}

const TOTAL_STEPS = 3;

export default function EventCreatePage() {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState<EventFormData>({
        name: "",
        description: "",
        location: "",
        startTime: "",
        endTime: ""
    });

    const updateFormData = (data: Partial<EventFormData>) => {
        setFormData(prev => ({ ...prev, ...data }));
    };

    const validateCurrentStep = (): boolean => {
        switch (currentStep) {
            case 1:
                // Validate basic info: name is required
                return formData.name.trim() !== "";
            case 2:
                // Validate time settings: check if end time is after start time
                return validateTimeRange();
            case 3:
                // Third step validation logic (to be implemented)
                return true;
            default:
                return true;
        }
    };

    const validateTimeRange = (): boolean => {
        const now = new Date();
        const startDate = formData.startDate || now;
        const endDate = formData.endDate || addHours(now, 1);
        const startTime = formData.startTime || format(now, 'HH:mm');
        const endTime = formData.endTime || format(addHours(now, 1), 'HH:mm');

        // Create full datetime objects for comparison
        const [startHour, startMinute] = startTime.split(':').map(Number);
        const [endHour, endMinute] = endTime.split(':').map(Number);

        const startDateTime = new Date(startDate);
        startDateTime.setHours(startHour, startMinute, 0, 0);

        const endDateTime = new Date(endDate);
        endDateTime.setHours(endHour, endMinute, 0, 0);

        return isAfter(endDateTime, startDateTime);
    };

    const handleNext = () => {
        if (!validateCurrentStep()) {
            // If validation fails, don't allow proceeding to next step
            return;
        }
        
        if (currentStep < TOTAL_STEPS) {
            setCurrentStep(prev => prev + 1);
        }
    };

    // Get processed form data (with default values)
    const getProcessedFormData = (): EventFormData => {
        const now = new Date();
        return {
            name: formData.name.trim(),
            description: formData.description.trim() || "The description of this event",
            location: formData.location.trim() || "Unknown",
            startDate: formData.startDate || now,
            startTime: formData.startTime || format(now, 'HH:mm'),
            endDate: formData.endDate || addHours(now, 1),
            endTime: formData.endTime || format(addHours(now, 1), 'HH:mm')
        };
    };

    const handlePrevious = () => {
        if (currentStep > 1) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <BasicInput 
                        data={formData}
                        onUpdate={updateFormData}
                    />
                );
            case 2:
                return (
                    <TimeInput 
                        data={formData}
                        onUpdate={updateFormData}
                    />
                );
            case 3:
                return <div>Step 3: Reminder Settings (To be implemented)</div>;
            default:
                return null;
        }
    };

    return (
        <div className="container mx-auto py-6 max-w-2xl">
            <Card>
                <CardHeader>
                    <CardTitle className="text-center">
                        Create Event - Step {currentStep} of {TOTAL_STEPS}
                    </CardTitle>
                    <div className="flex justify-center mt-4">
                        <div className="flex space-x-2">
                            {Array.from({ length: TOTAL_STEPS }, (_, i) => (
                                <div
                                    key={i + 1}
                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                                        i + 1 === currentStep
                                            ? "bg-blue-500 text-white"
                                            : i + 1 < currentStep
                                            ? "bg-green-500 text-white"
                                            : "bg-gray-200 text-gray-600"
                                    }`}
                                >
                                    {i + 1}
                                </div>
                            ))}
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {renderStepContent()}
                    
                    <div className="flex justify-between mt-6">
                        <Button 
                            variant="outline" 
                            onClick={handlePrevious}
                            disabled={currentStep === 1}
                        >
                            Previous
                        </Button>
                        <Button 
                            onClick={handleNext}
                            disabled={currentStep === TOTAL_STEPS || !validateCurrentStep()}
                        >
                            {currentStep === TOTAL_STEPS ? "Complete" : "Next"}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
