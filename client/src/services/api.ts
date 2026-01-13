const API_BASE = '/api';

// Types matching server API
export interface ContextOption {
    value: string;
    label: string;
}

export interface ContextsResponse {
    stages: ContextOption[];
    provinces: ContextOption[];
    programs: ContextOption[];
}

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

interface ApiResponse<T> {
    success: boolean;
    data: T;
}

// Fetch contexts (stages, provinces, programs)
export async function fetchContexts(): Promise<ContextsResponse> {
    const res = await fetch(`${API_BASE}/contexts`);
    const json: ApiResponse<ContextsResponse> = await res.json();
    if (!json.success) throw new Error('Failed to fetch contexts');
    return json.data;
}

// Fetch questions with optional filters
export async function fetchQuestions(filters?: {
    stage?: string;
    province?: string;
    program?: string;
    category?: string;
}): Promise<QuestionSummary[]> {
    const params = new URLSearchParams();
    if (filters?.stage) params.set('stage', filters.stage);
    if (filters?.province) params.set('province', filters.province);
    if (filters?.program) params.set('program', filters.program);
    if (filters?.category) params.set('category', filters.category);

    const url = params.toString()
        ? `${API_BASE}/questions?${params}`
        : `${API_BASE}/questions`;

    const res = await fetch(url);
    const json: ApiResponse<{ questions: QuestionSummary[]; total: number }> = await res.json();
    if (!json.success) throw new Error('Failed to fetch questions');
    return json.data.questions;
}

// Fetch single question by slug
export async function fetchQuestion(slug: string): Promise<QuestionDetail> {
    const res = await fetch(`${API_BASE}/questions/${slug}`);
    const json: ApiResponse<QuestionDetail> = await res.json();
    if (!json.success) throw new Error('Question not found');
    return json.data;
}
