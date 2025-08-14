import type { TaskGroupType } from "@/types/task";
import { format } from "date-fns/format";

export const genNameFromType = (type: TaskGroupType) => {
    switch (type) {
        case "day":
            return format(new Date(), "yyyy-MM-dd");
        case "week":
            return format(new Date(), "yyyy-'W'ww");
        case "month":
            return format(new Date(), "yyyy-MM");
        case "year":
            return format(new Date(), "yyyy");
        default:
            throw new Error("Invalid task group type");
    }
};

const typePatterns: { type: TaskGroupType; regex: RegExp }[] = [
    { type: "day", regex: /^\d{4}-\d{2}-\d{2}$/ },
    { type: "week", regex: /^\d{4}-W\d{2}$/ },
    { type: "month", regex: /^\d{4}-\d{2}$/ },
    { type: "year", regex: /^\d{4}$/ },
];

export const getTypeFromName = (name: string): TaskGroupType => {
    for (const pattern of typePatterns) {
        if (pattern.regex.test(name)) {
            return pattern.type;
        }
    }
    return "custom";
};
