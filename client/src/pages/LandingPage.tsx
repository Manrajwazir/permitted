import { Link } from 'react-router-dom';
import './LandingPage.css';

export default function LandingPage() {
    return (
        <div className="landing">
            <section className="hero">
                <h1 className="hero-title">Permitted</h1>
                <p className="hero-tagline">
                    Verified Rules & Decisions for International Students
                </p>
                <p className="hero-description">
                    Clear, consequence-aware answers to high-risk questions international
                    students face in Canada. Backed by official government sources.
                </p>
                <Link to="/questions" className="cta-button">
                    Check if you're allowed to do something
                </Link>
            </section>

            <section className="trust-section">
                <h2 className="trust-title">Why Trust Permitted?</h2>
                <div className="trust-grid">
                    <div className="trust-item">
                        <span className="trust-icon">✓</span>
                        <h3>Official Sources Only</h3>
                        <p>Every answer links to IRCC, CRA, or provincial government sources.</p>
                    </div>
                    <div className="trust-item">
                        <span className="trust-icon">✓</span>
                        <h3>Human Verified</h3>
                        <p>Each answer is researched and verified by humans, not AI-generated.</p>
                    </div>
                    <div className="trust-item">
                        <span className="trust-icon">✓</span>
                        <h3>Consequence Aware</h3>
                        <p>We tell you what happens if you do it anyway—not just the rules.</p>
                    </div>
                </div>
            </section>
        </div>
    );
}
