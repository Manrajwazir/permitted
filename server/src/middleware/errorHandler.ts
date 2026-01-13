import { Request, Response, NextFunction } from 'express';

interface AppError extends Error {
    statusCode?: number;
    code?: string;
}

export function errorHandler(
    err: AppError,
    _req: Request,
    res: Response,
    _next: NextFunction
): void {
    console.error('API Error:', err.message);

    const statusCode = err.statusCode || 500;
    const code = err.code || 'INTERNAL_ERROR';
    const message = statusCode === 500
        ? 'An unexpected error occurred'
        : err.message;

    res.status(statusCode).json({
        success: false,
        error: {
            code,
            message,
        },
    });
}

export class ApiError extends Error {
    statusCode: number;
    code: string;

    constructor(statusCode: number, code: string, message: string) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.name = 'ApiError';
    }

    static notFound(message = 'Resource not found'): ApiError {
        return new ApiError(404, 'NOT_FOUND', message);
    }

    static badRequest(message = 'Invalid request'): ApiError {
        return new ApiError(400, 'BAD_REQUEST', message);
    }

    static internal(message = 'Internal server error'): ApiError {
        return new ApiError(500, 'INTERNAL_ERROR', message);
    }
}
