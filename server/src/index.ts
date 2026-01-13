import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Root route - API info
app.get('/', (_req: Request, res: Response) => {
    res.json({
        name: 'Permitted API',
        version: '1.0.0',
        message: 'This is the API server. Visit the frontend at http://localhost:5173',
        endpoints: {
            health: '/api/health',
            contexts: '/api/contexts',
            questions: '/api/questions',
        },
    });
});

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
    res.json({
        success: true,
        data: {
            status: 'ok',
            timestamp: new Date().toISOString(),
            service: 'permitted-api',
        },
    });
});

// API Routes
app.use('/api', routes);

// Error Handler (must be last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
