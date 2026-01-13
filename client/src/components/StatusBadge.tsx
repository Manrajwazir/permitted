import './StatusBadge.css';

interface StatusBadgeProps {
    status: 'YES' | 'NO' | 'DEPENDS';
}

export default function StatusBadge({ status }: StatusBadgeProps) {
    const labels = {
        YES: 'Allowed',
        NO: 'Not Allowed',
        DEPENDS: 'Depends',
    };

    return (
        <span className={`status-badge status-badge--${status.toLowerCase()}`}>
            {labels[status]}
        </span>
    );
}
