import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import StatusBadge from '../components/StatusBadge';
import SourceCard from '../components/SourceCard';
import Disclaimer from '../components/Disclaimer';
import { fetchQuestion, QuestionDetail } from '../services/api';
import './AnswerDisplay.css';

// Category icons
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

// Collapsible section component
function CollapsibleSection({
    title,
    icon,
    children,
    defaultOpen = true,
    variant = 'default'
}: {
    title: string;
    icon: string;
    children: React.ReactNode;
    defaultOpen?: boolean;
    variant?: 'default' | 'warning';
}) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <section className={`collapsible-section ${variant}`}>
            <button
                className="collapsible-header"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="collapsible-icon">{icon}</span>
                <h2>{title}</h2>
                <span className={`collapsible-arrow ${isOpen ? 'open' : ''}`}>
                    ›
                </span>
            </button>
            {isOpen && (
                <div className="collapsible-content">
                    {children}
                </div>
            )}
        </section>
    );
}

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
                        <div className="error-icon">🔍</div>
                        <h2>Question Not Found</h2>
                        <p>The question you're looking for doesn't exist.</p>
                        <Link to="/questions" className="back-button">
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

    const categoryIcon = categoryIcons[question.category] || '📋';

    return (
        <div className="answer-page">
            {/* Header */}
            <div className="answer-page-header">
                <div className="answer-container">
                    <Link to="/questions" className="back-link">
                        ← Back to Questions
                    </Link>

                    <div className="answer-title-section">
                        <span className="answer-category-badge">
                            <span className="category-icon">{categoryIcon}</span>
                            {question.category}
                        </span>
                        <h1 className="answer-title">{question.title}</h1>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="answer-container">
                {/* Status Card */}
                <div className={`status-card status-card--${question.answer.allowed.toLowerCase()}`}>
                    <div className="status-card-content">
                        <StatusBadge status={question.answer.allowed} size="large" />
                        <div className="status-text">
                            {question.answer.allowed === 'YES' && 'Yes, this is allowed'}
                            {question.answer.allowed === 'NO' && 'No, this is not allowed'}
                            {question.answer.allowed === 'DEPENDS' && 'It depends on your situation'}
                        </div>
                    </div>
                    <div className="verified-badge">
                        <span>✓ Verified</span>
                        <span className="verified-date">{verifiedDate}</span>
                    </div>
                </div>

                {/* Conditions */}
                {question.answer.conditions && (
                    <CollapsibleSection title="Conditions & Requirements" icon="📋">
                        <p>{question.answer.conditions}</p>
                    </CollapsibleSection>
                )}

                {/* Consequences */}
                {question.answer.consequences && (
                    <CollapsibleSection
                        title="If You Break This Rule"
                        icon="⚠️"
                        variant="warning"
                    >
                        <p>{question.answer.consequences}</p>
                    </CollapsibleSection>
                )}

                {/* Sources */}
                <CollapsibleSection title="Official Sources" icon="🔗">
                    <div className="sources-list">
                        {question.sources.map((source, i) => (
                            <SourceCard key={i} source={source} />
                        ))}
                    </div>
                </CollapsibleSection>

                <Disclaimer />
            </div>
        </div>
    );
}
