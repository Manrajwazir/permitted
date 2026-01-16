import { Link } from 'react-router-dom';
import StatusBadge from '../components/StatusBadge';
import { QuestionSummary } from '../services/api';
import './QuestionCard.css';

interface QuestionCardProps {
    question: QuestionSummary;
    icon?: string;
    delay?: number;
}

export default function QuestionCard({ question, icon = '📋', delay = 0 }: QuestionCardProps) {
    return (
        <Link
            to={`/questions/${question.slug}`}
            className="question-card"
            style={{ animationDelay: `${delay}ms` }}
        >
            <div className="question-card-icon">{icon}</div>
            <div className="question-card-content">
                <div className="question-card-header">
                    <span className="question-card-category">{question.category}</span>
                    <StatusBadge status={question.allowed} />
                </div>
                <h3 className="question-card-title">{question.title}</h3>
            </div>
            <div className="question-card-arrow">→</div>
        </Link>
    );
}
