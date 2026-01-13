import { Router, Request, Response, NextFunction } from 'express';
import prisma from '../lib/prisma.js';
import { ContextsResponse, ApiResponse } from '../types/api.js';

const router = Router();

/**
 * GET /api/contexts
 * Returns all context options grouped by type (stages, provinces, programs)
 */
router.get('/', async (
    _req: Request,
    res: Response<ApiResponse<ContextsResponse>>,
    next: NextFunction
) => {
    try {
        const contexts = await prisma.context.findMany({
            orderBy: { label: 'asc' },
        });

        const grouped: ContextsResponse = {
            stages: contexts
                .filter((c) => c.type === 'STAGE')
                .map((c) => ({ value: c.value, label: c.label })),
            provinces: contexts
                .filter((c) => c.type === 'PROVINCE')
                .map((c) => ({ value: c.value, label: c.label })),
            programs: contexts
                .filter((c) => c.type === 'PROGRAM')
                .map((c) => ({ value: c.value, label: c.label })),
        };

        res.json({
            success: true,
            data: grouped,
        });
    } catch (error) {
        next(error);
    }
});

export default router;
