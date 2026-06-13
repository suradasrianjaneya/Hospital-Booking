import { useState } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Doctors from './pages/Doctors';
import Appointment from './pages/Appointment';
import Contact from './pages/Contact';
import Admin from './pages/Admin';

import { Activity, Phone, Mail, Heart } from 'lucide-react';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);

  const handleSelectDoctor = (docId) => {
    setSelectedDoctorId(docId);
    setCurrentPage('appointment');
  };

  const renderPageContent = () => {
    switch (currentPage) {
      case 'home':
        return <Home setCurrentPage={setCurrentPage} />;
      case 'doctors':
        return <Doctors onSelectDoctor={handleSelectDoctor} />;
      case 'appointment':
        return (
          <Appointment 
            preselectedDoctorId={selectedDoctorId} 
            clearPreselectedDoctor={() => setSelectedDoctorId(null)} 
          />
        );
      case 'contact':
        return <Contact />;
      case 'admin':
        return <Admin />;
      default:
        return <Home setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <div className="app-container">
      {/* Navigation Header */}
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />

      {/* Main Page Viewport */}
      <main className="main-content">
        {renderPageContent()}
      </main>

      {/* Structured Footer */}
      <footer className="footer-panel">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="logo-glow-footer">
              <Activity size={18} />
            </div>
            <span>Med<span className="accent-text">Threads</span> Hospital</span>
          </div>

          <div className="footer-info-row">
            <span><Phone size={12} /> +1 (555) 123-4567</span>
            <span><Mail size={12} /> info@medthreadshospital.com</span>
          </div>

          <div className="footer-copyright">
            <p>Made with <Heart size={10} className="heart-icon" /> &copy; 2026 MedThreads Care Network. All rights reserved.</p>
          </div>
        </div>

        <style>{`
          .footer-panel {
            background: rgba(8, 12, 20, 0.9);
            border-top: 1px solid rgba(255, 255, 255, 0.06);
            padding: 30px 24px;
            margin-top: 60px;
            z-index: 10;
          }

          .footer-content {
            max-width: 1280px;
            margin: 0 auto;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 16px;
            text-align: center;
          }

          .footer-brand {
            display: flex;
            align-items: center;
            gap: 8px;
            font-family: var(--font-title);
            font-weight: 700;
            font-size: 1.15rem;
          }

          .logo-glow-footer {
            background: rgba(0, 210, 255, 0.1);
            color: var(--primary);
            padding: 6px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 1px solid rgba(0, 210, 255, 0.2);
          }

          .accent-text {
            background: linear-gradient(135deg, #00d2ff, #00f5d4);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }

          .footer-info-row {
            display: flex;
            gap: 20px;
            font-size: 0.85rem;
            color: var(--text-secondary);
          }

          .footer-info-row span {
            display: flex;
            align-items: center;
            gap: 6px;
          }

          .footer-copyright {
            font-size: 0.8rem;
            color: var(--text-muted);
            border-top: 1px solid rgba(255, 255, 255, 0.04);
            padding-top: 16px;
            width: 100%;
            max-width: 400px;
          }

          .heart-icon {
            color: #ef4444;
            display: inline-block;
            vertical-align: middle;
            animation: pulse 1.5s infinite;
          }

          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.25); }
          }
        `}</style>
      </footer>
    </div>
  );
}

export default App;
