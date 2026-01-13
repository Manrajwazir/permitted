import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import routes from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';

// Load environment variables first
dotenv.config();

// Validate environment (will throw if invalid)
import './config/env.js';

const app = express();
const PORT = process.env.PORT || 3001;
const isDev = process.env.NODE_ENV !== 'production';

// ===========================================
// SECURITY MIDDLEWARE
// ===========================================

// Helmet: Sets various HTTP headers for security
// - XSS protection
// - Prevents clickjacking
// - Hides X-Powered-By header
// - Prevents MIME sniffing
app.use(helmet({
    contentSecurityPolicy: isDev ? false : undefined, // Disable CSP in dev for easier debugging
}));

// CORS: Control which origins can access the API
const allowedOrigins = isDev
    ? ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173']
    : [process.env.FRONTEND_URL || 'https://permitted.com'];

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, curl, etc.)
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));

// Rate Limiting: Prevent abuse
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: isDev ? 1000 : 100,   // 100 requests per 15 min in production
    message: {
        success: false,
        error: {
            code: 'RATE_LIMITED',
            message: 'Too many requests, please try again later.',
        },
    },
    standardHeaders: true,
    legacyHeaders: false,
});

app.use(limiter);

// ===========================================
// BODY PARSING
// ===========================================
app.use(express.json({ limit: '10kb' })); // Limit body size

// ===========================================
// ROUTES
// ===========================================

// Root route - API info
app.get('/', (_req: Request, res: Response) => {
    res.json({
        name: 'Permitted API',
        version: '1.0.0',
        message: 'This is the API server.',
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

// ===========================================
// START SERVER
// ===========================================
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
});
