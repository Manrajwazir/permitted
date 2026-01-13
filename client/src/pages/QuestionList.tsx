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

    if (error) {
        return (
            <div className="question-list-page">
                <div className="error-message">Error: {error}</div>
            </div>
        );
    }

    return (
        <div className="question-list-page">
            <div className="question-list-container">
                <h1 className="page-title">Browse Questions</h1>
                <p className="page-subtitle">
                    Select your situation to see relevant questions
                </p>

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

                {loading ? (
                    <div className="loading-state">
                        <div className="spinner"></div>
                        <p>Loading questions...</p>
                    </div>
                ) : questions.length === 0 ? (
                    <div className="empty-state">
                        <p>No questions found for the selected filters.</p>
                        <p className="empty-hint">Try adjusting your filters above.</p>
                    </div>
                ) : (
                    <div className="question-grid">
                        {questions.map((q) => (
                            <QuestionCard key={q.slug} question={q} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
