import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import StatusBadge from '../components/StatusBadge';
import SourceCard from '../components/SourceCard';
import Disclaimer from '../components/Disclaimer';
import { fetchQuestion, QuestionDetail } from '../services/api';
import './AnswerDisplay.css';

export default function AnswerDisplay() {
    const { slug } = useParams<{ slug: string }>();
    const [question, setQuestion] = useState<QuestionDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!slug) return;
        setLoading(true);
        fetchQuestion(slug)
            .then(setQuestion)
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, [slug]);

    if (loading) {
        return (
            <div className="answer-page">
                <div className="answer-container">
                    <div className="loading-state">
                        <div className="spinner"></div>
                        <p>Loading answer...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !question) {
        return (
            <div className="answer-page">
                <div className="answer-container">
                    <div className="error-state">
                        <h2>Question Not Found</h2>
                        <p>The question you're looking for doesn't exist.</p>
                        <Link to="/questions" className="back-link">
                            ← Back to Questions
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const verifiedDate = new Date(question.answer.verifiedAt).toLocaleDateString('en-CA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <div className="answer-page">
            <div className="answer-container">
                <Link to="/questions" className="back-link">
                    ← Back to Questions
                </Link>

                <header className="answer-header">
                    <span className="answer-category">{question.category}</span>
                    <h1 className="answer-title">{question.title}</h1>
                    <div className="answer-meta">
                        <StatusBadge status={question.answer.allowed} />
                        <span className="verified-date">Last verified: {verifiedDate}</span>
                    </div>
                </header>

                <section className="answer-section">
                    <h2>Allowed?</h2>
                    <div className={`answer-status answer-status--${question.answer.allowed.toLowerCase()}`}>
                        {question.answer.allowed === 'YES' && 'Yes, this is allowed'}
                        {question.answer.allowed === 'NO' && 'No, this is not allowed'}
                        {question.answer.allowed === 'DEPENDS' && 'It depends on your situation'}
                    </div>
                </section>

                {question.answer.conditions && (
                    <section className="answer-section">
                        <h2>Conditions</h2>
                        <p>{question.answer.conditions}</p>
                    </section>
                )}

                {question.answer.consequences && (
                    <section className="answer-section">
                        <h2>If You Do It Anyway</h2>
                        <p className="consequences-text">{question.answer.consequences}</p>
                    </section>
                )}

                <section className="answer-section">
                    <h2>Official Sources</h2>
                    <div className="sources-list">
                        {question.sources.map((source, i) => (
                            <SourceCard key={i} source={source} />
                        ))}
                    </div>
                </section>

                <Disclaimer />
            </div>
        </div>
    );
}
