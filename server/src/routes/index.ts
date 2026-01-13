import { Router } from 'express';
import contextsRouter from './contexts.js';
import questionsRouter from './questions.js';

const router = Router();

router.use('/contexts', contextsRouter);
router.use('/questions', questionsRouter);

export default router;
