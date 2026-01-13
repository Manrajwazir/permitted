// API Response Types

export interface ApiResponse<T> {
    success: true;
    data: T;
}

export interface ApiError {
    success: false;
    error: {
        code: string;
        message: string;
    };
}

// Context Types
export interface ContextOption {
    value: string;
    label: string;
}

export interface ContextsResponse {
    stages: ContextOption[];
    provinces: ContextOption[];
    programs: ContextOption[];
}

// Question Types
export interface QuestionSummary {
    slug: string;
    title: string;
    category: string;
    allowed: 'YES' | 'NO' | 'DEPENDS';
}

export interface QuestionSource {
    name: string;
    url: string;
    authority: string;
    accessedAt: string;
}

export interface QuestionAnswer {
    allowed: 'YES' | 'NO' | 'DEPENDS';
    conditions: string | null;
    consequences: string | null;
    verifiedAt: string;
}

export interface QuestionDetail {
    slug: string;
    title: string;
    category: string;
    answer: QuestionAnswer;
    sources: QuestionSource[];
}

export interface QuestionsListResponse {
    questions: QuestionSummary[];
    total: number;
}

// Query Parameters
export interface QuestionsQueryParams {
    stage?: string;
    province?: string;
    program?: string;
    category?: string;
}
