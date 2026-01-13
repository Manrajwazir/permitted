import { Link } from 'react-router-dom';
import StatusBadge from '../components/StatusBadge';
import { QuestionSummary } from '../services/api';
import './QuestionCard.css';

interface QuestionCardProps {
    question: QuestionSummary;
}

export default function QuestionCard({ question }: QuestionCardProps) {
    return (
        <Link to={`/questions/${question.slug}`} className="question-card">
            <div className="question-card-header">
                <span className="question-card-category">{question.category}</span>
                <StatusBadge status={question.allowed} />
            </div>
            <h3 className="question-card-title">{question.title}</h3>
            <span className="question-card-cta">View Answer →</span>
        </Link>
    );
}
