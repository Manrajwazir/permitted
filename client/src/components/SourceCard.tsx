import { QuestionSource } from '../services/api';
import './SourceCard.css';

interface SourceCardProps {
    source: QuestionSource;
}

export default function SourceCard({ source }: SourceCardProps) {
    const formattedDate = new Date(source.accessedAt).toLocaleDateString('en-CA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <a
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="source-card"
        >
            <div className="source-card-header">
                <span className="source-card-authority">{source.authority}</span>
                <span className="source-card-date">Accessed: {formattedDate}</span>
            </div>
            <p className="source-card-name">{source.name}</p>
            <span className="source-card-link">View Official Source ↗</span>
        </a>
    );
}
