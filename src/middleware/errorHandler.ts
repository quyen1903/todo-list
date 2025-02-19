import { Request, Response, NextFunction } from "express";

interface AppError extends Error {
    statusCode?: number;
}

export const errorHandler = (
    err: AppError,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    console.error(`Error [${statusCode}]: ${message}`);
    if (statusCode === 500) {
        console.error(err.stack);
    }

    res.status(statusCode).json({
        status: "error",
        statusCode,
        message
    });
};

export class NotFoundError extends Error {
    statusCode = 404;
    constructor(message: string) {
        super(message);
        this.name = "NotFoundError";
    }
}

export class ValidationError extends Error {
    statusCode = 400;
    errors: string[];
    
    constructor(message: string, errors: string[] = []) {
        super(message);
        this.name = "ValidationError";
        this.errors = errors;
    }
}

export const asyncHandler = (fn: Function) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
