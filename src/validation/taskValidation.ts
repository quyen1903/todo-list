import { TaskDto, ValidationResult } from "../types/task";
import { isValidDateFormat, isStartDateBeforeEndDate } from "../utils/dateUtils";

export const validateTask = (task: TaskDto): ValidationResult => {
    const errors: string[] = [];

    // Validate name
    if (!task.name) {
        errors.push("Task name is required");
    } else if (task.name.length > 80) {
        errors.push("Task name cannot exceed 80 characters");
    }

    // Validate dates
    if (task.startDate !== undefined) {
        if (!isValidDateFormat(task.startDate)) {
            errors.push("Start date must be in YYYY-MM-DD format");
        }
    }

    if (task.endDate !== undefined) {
        if (task.startDate === undefined) {
            errors.push("Start date is required when end date is provided");
        } else {
            if (!isValidDateFormat(task.endDate)) {
                errors.push("End date must be in YYYY-MM-DD format");
            } else if (!isStartDateBeforeEndDate(task.startDate, task.endDate)) {
                errors.push("End date must be after start date");
            }
        }
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};
