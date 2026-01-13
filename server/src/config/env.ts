import { cleanEnv, str, port } from 'envalid';

// Validate environment variables on startup
// App will fail fast if required vars are missing

const env = cleanEnv(process.env, {
    NODE_ENV: str({
        choices: ['development', 'production', 'test'],
        default: 'development',
    }),
    PORT: port({ default: 3001 }),
    DATABASE_URL: str({
        desc: 'PostgreSQL connection string',
    }),
    // For production, you'll add:
    // ALLOWED_ORIGINS: str({ default: 'http://localhost:5173' }),
});

export default env;
