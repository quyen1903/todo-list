export interface TaskDto {
    name: string;
    startDate?: string | null;
    endDate?: string | null;
}

export interface TaskResponse extends TaskDto {
    id: string;
}

export interface ValidationResult {
    isValid: boolean;
    errors: string[];
}