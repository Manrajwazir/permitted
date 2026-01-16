import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import FilterBar from '../components/FilterBar';
import QuestionCard from '../components/QuestionCard';
import {
    fetchContexts,
    fetchQuestions,
    ContextsResponse,
    QuestionSummary,
} from '../services/api';
import './QuestionList.css';

// Category icons mapping
const categoryIcons: Record<string, string> = {
    'Work Rules': '💼',
    'Travel': '✈️',
    'Study Status': '📚',
    'Tax': '💰',
    'Healthcare': '🏥',
    'Graduation': '🎓',
    'Financial': '💵',
    'Immigration': '🛂',
    'Housing': '🏠',
    'Provincial Services': '🏛️',
};

export default function QuestionList() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [contexts, setContexts] = useState<ContextsResponse | null>(null);
    const [questions, setQuestions] = useState<QuestionSummary[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Get filters from URL
    const selectedStage = searchParams.get('stage') || '';
    const selectedProvince = searchParams.get('province') || '';
    const selectedProgram = searchParams.get('program') || '';
    const selectedCategory = searchParams.get('category') || '';

    // Get unique categories from questions
    const categories = [...new Set(questions.map(q => q.category))].sort();

    // Update URL when filters change
    const updateFilter = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams);
        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        setSearchParams(params);
    };

    // Fetch contexts on mount
    useEffect(() => {
        fetchContexts()
            .then(setContexts)
            .catch((err) => setError(err.message));
    }, []);

    // Fetch questions when filters change
    useEffect(() => {
        setLoading(true);
        fetchQuestions({
            stage: selectedStage || undefined,
            province: selectedProvince || undefined,
            program: selectedProgram || undefined,
        })
            .then(setQuestions)
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, [selectedStage, selectedProvince, selectedProgram]);

    // Filter by category client-side
    const filteredQuestions = selectedCategory
        ? questions.filter(q => q.category === selectedCategory)
        : questions;

    if (error) {
        return (
            <div className="question-list-page">
                <div className="error-message">Error: {error}</div>
            </div>
        );
    }

    return (
        <div className="question-list-page">
            <div className="question-list-header">
                <h1 className="page-title">Browse Questions</h1>
                <p className="page-subtitle">
                    Find answers to your immigration questions
                </p>
            </div>

            <div className="question-list-container">
                {/* Category Pills */}
                <div className="category-pills">
                    <button
                        className={`category-pill ${!selectedCategory ? 'active' : ''}`}
                        onClick={() => updateFilter('category', '')}
                    >
                        All Topics
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            className={`category-pill ${selectedCategory === cat ? 'active' : ''}`}
                            onClick={() => updateFilter('category', cat)}
                        >
                            <span className="pill-icon">{categoryIcons[cat] || '📋'}</span>
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Context Filters */}
                {contexts && (
                    <FilterBar
                        stages={contexts.stages}
                        provinces={contexts.provinces}
                        programs={contexts.programs}
                        selectedStage={selectedStage}
                        selectedProvince={selectedProvince}
                        selectedProgram={selectedProgram}
                        onStageChange={(v) => updateFilter('stage', v)}
                        onProvinceChange={(v) => updateFilter('province', v)}
                        onProgramChange={(v) => updateFilter('program', v)}
                    />
                )}

                {/* Results Count */}
                {!loading && (
                    <div className="results-count">
                        <span className="count-number">{filteredQuestions.length}</span>
                        <span className="count-label">
                            question{filteredQuestions.length !== 1 ? 's' : ''} found
                        </span>
                    </div>
                )}

                {/* Questions */}
                {loading ? (
                    <div className="loading-state">
                        <div className="spinner"></div>
                        <p>Loading questions...</p>
                    </div>
                ) : filteredQuestions.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">🔍</div>
                        <h3>No questions found</h3>
                        <p>Try adjusting your filters or browse all topics.</p>
                        <button
                            className="reset-button"
                            onClick={() => setSearchParams(new URLSearchParams())}
                        >
                            Clear all filters
                        </button>
                    </div>
                ) : (
                    <div className="question-grid">
                        {filteredQuestions.map((q, index) => (
                            <QuestionCard
                                key={q.slug}
                                question={q}
                                icon={categoryIcons[q.category] || '📋'}
                                delay={index * 50}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
