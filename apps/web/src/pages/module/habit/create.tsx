import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useHabitCreateMutation } from "@/hooks/use-habit-query";
import { useNavigate } from "react-router";
import type { HabitCreate } from "@/types/habit";

export default function HabitCreatePage() {
    const navigate = useNavigate();
    const { mutate: createHabit, isPending: isCreating } = useHabitCreateMutation();
    
    const [formData, setFormData] = useState<HabitCreate>({
        name: "",
        description: "",
    });

    const handleInputChange = (field: keyof HabitCreate, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = () => {
        if (!formData.name.trim()) {
            return;
        }

        createHabit(formData, {
            onSuccess: () => {
                setFormData({ name: "", description: "" });
                navigate("/habit");
            }
        });
    };

    const isFormValid = formData.name.trim() !== "";

    return (
        <div className="overflow-auto h-full w-full flex justify-center p-4">
            <div className="max-w-[500px] w-full">
                <Card>
                    <CardHeader>
                        <CardTitle>Create New Habit</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Habit Name *</Label>
                            <Input
                                id="name"
                                placeholder="Enter habit name"
                                value={formData.name}
                                onChange={(e) => handleInputChange("name", e.target.value)}
                            />
                        </div>
                        
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                placeholder="Enter habit description (optional)"
                                value={formData.description}
                                onChange={(e) => handleInputChange("description", e.target.value)}
                                rows={4}
                            />
                        </div>
                        
                        <div className="flex gap-3 pt-4">
                            <Button
                                variant="default"
                                onClick={handleSubmit}
                                disabled={!isFormValid || isCreating}
                                className="flex-1"
                            >
                                {isCreating ? "Creating..." : "Create Habit"}
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => navigate("/habit")}
                                className="flex-1"
                            >
                                Cancel
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}