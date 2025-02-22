// src/utils/dateUtils.ts
export const isValidDateFormat = (dateString?: string|null): boolean => {
    if(!dateString ) return false 

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(dateString)) {
        return false;
    }

    // Validate date is real
    const date = new Date(dateString);
    const isValid = !isNaN(date.getTime());
    
    // Validate that the parsed date matches the input string when converted back
    if (isValid) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;
        return formattedDate === dateString;
    }
    
    return false;
};

export const isStartDateBeforeEndDate = (startDate?: string | null, endDate?: string | null): boolean => {
    if (!startDate || !endDate) return false;

    const start = new Date(startDate);
    const end = new Date(endDate);
    return start <= end;
};
