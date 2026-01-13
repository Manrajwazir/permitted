import { Link, useLocation } from 'react-router-dom';
import './Header.css';

export default function Header() {
    const location = useLocation();
    const isHome = location.pathname === '/';

    return (
        <header className="header">
            <div className="header-content">
                <Link to="/" className="header-logo">
                    Permitted
                </Link>
                {!isHome && (
                    <nav className="header-nav">
                        <Link to="/questions" className="header-link">
                            Browse Questions
                        </Link>
                    </nav>
                )}
            </div>
        </header>
    );
}
