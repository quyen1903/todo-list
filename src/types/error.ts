export interface BaseError {
    status?: number;
    code?: number;
    message?: string;
    messageCode?: string; //for dynamic language in FE
    extras?: object;
}
