import './StatusBadge.css';

interface StatusBadgeProps {
    status: 'YES' | 'NO' | 'DEPENDS';
    size?: 'default' | 'large';
}

export default function StatusBadge({ status, size = 'default' }: StatusBadgeProps) {
    const labels = {
        YES: 'Allowed',
        NO: 'Not Allowed',
        DEPENDS: 'Depends',
    };

    return (
        <span className={`status-badge status-badge--${status.toLowerCase()} status-badge--${size}`}>
            {labels[status]}
        </span>
    );
}
