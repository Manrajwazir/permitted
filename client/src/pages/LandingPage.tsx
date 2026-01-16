import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './LandingPage.css';

// Animated counter
function AnimatedCounter({ end, duration = 2000 }: { end: number; duration?: number }) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let startTime: number;
        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            setCount(Math.floor(progress * end));
            if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
    }, [end, duration]);

    return <span>{count}</span>;
}

// Categories
const categories = [
    { icon: '💼', name: 'Work', slug: 'Work Rules' },
    { icon: '✈️', name: 'Travel', slug: 'Travel' },
    { icon: '📚', name: 'Study', slug: 'Study Status' },
    { icon: '💰', name: 'Tax', slug: 'Tax' },
    { icon: '🏥', name: 'Healthcare', slug: 'Healthcare' },
    { icon: '🎓', name: 'Graduation', slug: 'Graduation' },
];

export default function LandingPage() {
    return (
        <div className="landing">
            {/* Bold Hero */}
            <section className="hero">
                <div className="hero-content">
                    <h1 className="hero-title">
                        <span className="title-small">Are you</span>
                        <span className="title-large">Permitted?</span>
                    </h1>
                    <p className="hero-tagline">
                        The only guide that tells you what happens<br />
                        <em>when you break the rules.</em>
                    </p>
                    <Link to="/questions" className="cta-button">
                        Browse <AnimatedCounter end={35} /> Questions →
                    </Link>
                </div>
                <div className="hero-accent"></div>
            </section>

            {/* Quick Categories */}
            <section className="categories-section">
                <div className="categories-row">
                    {categories.map((cat) => (
                        <Link
                            key={cat.name}
                            to={`/questions?category=${encodeURIComponent(cat.slug)}`}
                            className="category-pill"
                        >
                            <span>{cat.icon}</span>
                            <span>{cat.name}</span>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Value Props */}
            <section className="values-section">
                <div className="value-row">
                    <div className="value-item">
                        <span className="value-number">01</span>
                        <div className="value-content">
                            <h3>Official Sources</h3>
                            <p>Every answer links to IRCC, CRA, or government docs.</p>
                        </div>
                    </div>
                    <div className="value-item">
                        <span className="value-number">02</span>
                        <div className="value-content">
                            <h3>Consequences</h3>
                            <p>We tell you what happens if you do it anyway.</p>
                        </div>
                    </div>
                    <div className="value-item">
                        <span className="value-number">03</span>
                        <div className="value-content">
                            <h3>Human Verified</h3>
                            <p>Researched by humans. Not AI-generated answers.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Bottom CTA */}
            <section className="bottom-cta">
                <p>Stop guessing.</p>
                <Link to="/questions" className="cta-link">
                    Get answers →
                </Link>
            </section>
        </div>
    );
}
