import { useState } from 'react';
import { Activity, Menu, X, Calendar, User, Phone, Home as HomeIcon, LayoutDashboard } from 'lucide-react';

const Navbar = ({ currentPage, setCurrentPage }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: HomeIcon },
    { id: 'doctors', label: 'Doctors', icon: User },
    { id: 'appointment', label: 'Book Appointment', icon: Calendar },
    { id: 'contact', label: 'Contact', icon: Phone },
    { id: 'admin', label: 'Admin Portal', icon: LayoutDashboard },
  ];

  const handleNavClick = (pageId) => {
    setCurrentPage(pageId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className="navbar-container">
      <div className="navbar-content">
        {/* Brand/Logo */}
        <div className="brand" onClick={() => handleNavClick('home')}>
          <div className="logo-glow">
            <Activity className="logo-icon" size={24} />
          </div>
          <span className="brand-text">Med<span className="accent-text">Threads</span> Hospital</span>
        </div>

        {/* Desktop Navigation */}
        <div className="desktop-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id || (item.id === 'admin' && currentPage === 'admin-dashboard');
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`nav-link ${isActive ? 'active' : ''}`}
              >
                <Icon size={16} />
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Mobile Menu Button */}
        <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-nav-overlay fade-in">
          <div className="mobile-nav">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id || (item.id === 'admin' && currentPage === 'admin-dashboard');
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`mobile-nav-link ${isActive ? 'active' : ''}`}
                >
                  <Icon size={20} />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Styled inline for custom navbar elements to maintain css structure */}
      <style>{`
        .navbar-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 70px;
          background: rgba(8, 12, 20, 0.75);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .navbar-content {
          width: 100%;
          max-width: 1280px;
          padding: 0 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
        }

        .logo-glow {
          background: linear-gradient(135deg, #00d2ff, #00f5d4);
          padding: 8px;
          border-radius: 50%;
          box-shadow: 0 0 15px rgba(0, 210, 255, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .logo-icon {
          color: #080c14;
        }

        .brand-text {
          font-family: 'Outfit', sans-serif;
          font-size: 1.3rem;
          font-weight: 800;
          letter-spacing: -0.03em;
        }

        .accent-text {
          background: linear-gradient(135deg, #00d2ff, #00f5d4);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .desktop-nav {
          display: flex;
          gap: 8px;
        }

        .nav-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: transparent;
          border: none;
          color: var(--text-secondary);
          font-family: 'Outfit', sans-serif;
          font-weight: 500;
          font-size: 0.95rem;
          padding: 8px 16px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .nav-link:hover {
          color: var(--text-primary);
          background: rgba(255, 255, 255, 0.04);
        }

        .nav-link.active {
          color: #030712;
          background: linear-gradient(135deg, #00d2ff, #00f5d4);
          box-shadow: 0 4px 15px rgba(0, 210, 255, 0.3);
          font-weight: 600;
        }

        .mobile-menu-btn {
          display: none;
          background: transparent;
          border: none;
          color: var(--text-primary);
          cursor: pointer;
        }

        .mobile-nav-overlay {
          position: fixed;
          top: 70px;
          left: 0;
          width: 100%;
          height: calc(100vh - 70px);
          background: rgba(8, 12, 20, 0.95);
          backdrop-filter: blur(10px);
          z-index: 999;
          display: flex;
          flex-direction: column;
          padding: 24px;
        }

        .mobile-nav {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .mobile-nav-link {
          display: flex;
          align-items: center;
          gap: 12px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.05);
          color: var(--text-secondary);
          font-family: 'Outfit', sans-serif;
          font-size: 1.1rem;
          font-weight: 500;
          padding: 16px;
          border-radius: 12px;
          cursor: pointer;
          width: 100%;
          text-align: left;
          transition: all 0.2s ease;
        }

        .mobile-nav-link:hover {
          color: var(--text-primary);
          background: rgba(255, 255, 255, 0.08);
        }

        .mobile-nav-link.active {
          color: #030712;
          background: linear-gradient(135deg, #00d2ff, #00f5d4);
          font-weight: 600;
          box-shadow: 0 4px 20px rgba(0, 210, 255, 0.4);
        }

        @media (max-width: 768px) {
          .desktop-nav {
            display: none;
          }
          .mobile-menu-btn {
            display: block;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
