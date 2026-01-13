import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import LandingPage from './pages/LandingPage';
import QuestionList from './pages/QuestionList';
import AnswerDisplay from './pages/AnswerDisplay';
import './App.css';

function App() {
    return (
        <BrowserRouter>
            <div className="app">
                <Header />
                <main className="main-content">
                    <Routes>
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/questions" element={<QuestionList />} />
                        <Route path="/questions/:slug" element={<AnswerDisplay />} />
                    </Routes>
                </main>
            </div>
        </BrowserRouter>
    );
}

export default App;
