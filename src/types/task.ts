export interface TaskDto {
    name: string;
    startDate: string;
    endDate: string;
}

export interface TaskResponse extends TaskDto {
    id: number;
}

export interface ValidationResult {
    isValid: boolean;
    errors: string[];
}