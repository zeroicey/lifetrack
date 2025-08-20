import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface EventFormData {
    name: string;
    description: string;
    location: string;
}

interface BasicInputProps {
    data: EventFormData;
    onUpdate: (data: Partial<EventFormData>) => void;
}

export default function BasicInput({ data, onUpdate }: BasicInputProps) {
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onUpdate({ name: e.target.value });
    };

    const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onUpdate({ description: e.target.value });
    };

    const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onUpdate({ location: e.target.value });
    };

    // Handle default values
    const getDescriptionValue = () => {
        return data.description || "";
    };

    const getLocationValue = () => {
        return data.location || "";
    };

    // Get final submission values (with default value handling)
    const getFinalDescription = () => {
        const trimmed = data.description.trim();
        return trimmed || "The description of this event";
    };

    const getFinalLocation = () => {
        const trimmed = data.location.trim();
        return trimmed || "Unknown";
    };

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                    Event Name <span className="text-red-500">*</span>
                </Label>
                <Input
                    id="name"
                    type="text"
                    placeholder="Enter event name"
                    value={data.name}
                    onChange={handleNameChange}
                    className={`${
                        !data.name.trim() ? "border-red-300 focus:border-red-500" : ""
                    }`}
                />
                {!data.name.trim() && (
                    <p className="text-sm text-red-500">Event name is required</p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium">
                    Event Description
                </Label>
                <Textarea
                    id="description"
                    placeholder="Enter event description (optional)"
                    value={getDescriptionValue()}
                    onChange={handleDescriptionChange}
                    rows={3}
                    className="resize-none"
                />
                <p className="text-xs text-gray-500">
                    If left empty, default description will be used: "{getFinalDescription()}"
                </p>
            </div>

            <div className="space-y-2">
                <Label htmlFor="location" className="text-sm font-medium">
                    Event Location
                </Label>
                <Input
                    id="location"
                    type="text"
                    placeholder="Enter event location (optional)"
                    value={getLocationValue()}
                    onChange={handleLocationChange}
                />
                <p className="text-xs text-gray-500">
                    If left empty, default location will be used: "{getFinalLocation()}"
                </p>
            </div>

            {/* Form preview section */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Preview</h4>
                <div className="space-y-1 text-sm text-gray-600">
                    <div><strong>Event Name:</strong> {data.name || "(Not filled)"}</div>
                    <div><strong>Event Description:</strong> {getFinalDescription()}</div>
                    <div><strong>Event Location:</strong> {getFinalLocation()}</div>
                </div>
            </div>
        </div>
    );
}