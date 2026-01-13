import { Router, Request, Response, NextFunction } from 'express';
import prisma from '../lib/prisma.js';
import { ApiError } from '../middleware/errorHandler.js';
import {
    ApiResponse,
    QuestionDetail,
    QuestionsListResponse,
    QuestionSummary,
} from '../types/api.js';

const router = Router();

// Valid enum values for validation
const VALID_STAGES = ['PRE_ARRIVAL', 'STUDYING', 'GRADUATING'];
const VALID_PROVINCES = ['ON', 'BC', 'AB', 'QC', 'MB', 'SK', 'NS', 'NB', 'NL', 'PE', 'NT', 'YT', 'NU'];
const VALID_PROGRAMS = ['COLLEGE_DIPLOMA', 'UNDERGRADUATE', 'MASTERS', 'PHD', 'LANGUAGE_PROGRAM'];

/**
 * GET /api/questions
 * List questions with optional context filtering
 */
router.get('/', async (
    req: Request,
    res: Response<ApiResponse<QuestionsListResponse>>,
    next: NextFunction
) => {
    try {
        const { stage, province, program, category } = req.query;

        // Validate query params
        if (stage && typeof stage === 'string' && !VALID_STAGES.includes(stage)) {
            throw ApiError.badRequest(`Invalid stage: ${stage}`);
        }
        if (province && typeof province === 'string' && !VALID_PROVINCES.includes(province)) {
            throw ApiError.badRequest(`Invalid province: ${province}`);
        }
        if (program && typeof program === 'string' && !VALID_PROGRAMS.includes(program)) {
            throw ApiError.badRequest(`Invalid program: ${program}`);
        }

        // Build AND filter conditions - question must match ALL selected filters
        const contextAndConditions = [];

        if (stage && typeof stage === 'string') {
            contextAndConditions.push({
                contexts: {
                    some: {
                        context: { value: stage },
                    },
                },
            });
        }

        if (province && typeof province === 'string') {
            contextAndConditions.push({
                contexts: {
                    some: {
                        context: { value: province },
                    },
                },
            });
        }

        if (program && typeof program === 'string') {
            contextAndConditions.push({
                contexts: {
                    some: {
                        context: { value: program },
                    },
                },
            });
        }

        // Query questions with AND filtering
        const questions = await prisma.question.findMany({
            where: {
                ...(category && typeof category === 'string' ? { category } : {}),
                ...(contextAndConditions.length > 0
                    ? { AND: contextAndConditions }
                    : {}),
            },
            include: {
                answer: true,
            },
            orderBy: { title: 'asc' },
        });

        const summaries: QuestionSummary[] = questions.map((q) => ({
            slug: q.slug,
            title: q.title,
            category: q.category,
            allowed: q.answer?.allowed ?? 'DEPENDS',
        }));

        res.json({
            success: true,
            data: {
                questions: summaries,
                total: summaries.length,
            },
        });
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/questions/:slug
 * Get single question with full answer and sources
 */
router.get('/:slug', async (
    req: Request<{ slug: string }>,
    res: Response<ApiResponse<QuestionDetail>>,
    next: NextFunction
) => {
    try {
        const { slug } = req.params;

        // Validate slug format (lowercase, alphanumeric, hyphens)
        if (!/^[a-z0-9-]+$/.test(slug)) {
            throw ApiError.badRequest('Invalid slug format');
        }

        const question = await prisma.question.findUnique({
            where: { slug },
            include: {
                answer: {
                    include: {
                        sources: true,
                    },
                },
            },
        });

        if (!question) {
            throw ApiError.notFound('Question not found');
        }

        if (!question.answer) {
            throw ApiError.notFound('Answer not found for this question');
        }

        const detail: QuestionDetail = {
            slug: question.slug,
            title: question.title,
            category: question.category,
            answer: {
                allowed: question.answer.allowed,
                conditions: question.answer.conditions,
                consequences: question.answer.consequences,
                verifiedAt: question.answer.verifiedAt.toISOString(),
            },
            sources: question.answer.sources.map((s) => ({
                name: s.name,
                url: s.url,
                authority: s.authority,
                accessedAt: s.accessedAt.toISOString(),
            })),
        };

        res.json({
            success: true,
            data: detail,
        });
    } catch (error) {
        next(error);
    }
});

export default router;
