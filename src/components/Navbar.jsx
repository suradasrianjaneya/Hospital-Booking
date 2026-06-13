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
        <div className="brand" onClick={() => handleNavClick('home')}>
          <div className="logo-glow">
            <Activity className="logo-icon" size={24} />
          </div>
          <span className="brand-text">Med<span className="accent-text">Threads</span> Hospital</span>
        </div>

        <div className="desktop-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id || (item.id === 'admin' && currentPage === 'admin-dashboard');
            const isCta = item.id === 'appointment';
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`nav-link ${isActive ? 'active' : ''} ${isCta ? 'cta' : ''}`}
              >
                <Icon size={16} />
                {item.label}
              </button>
            );
          })}
        </div>

        <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

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

      <style>{`
        .navbar-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 76px;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(14px);
          border-bottom: 1px solid var(--border-light);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 6px 24px rgba(25, 119, 204, 0.06);
        }

        .navbar-content {
          width: 100%;
          max-width: 1200px;
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
          background: linear-gradient(135deg, var(--primary), var(--secondary));
          padding: 8px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 20px rgba(25, 119, 204, 0.14);
        }

        .logo-icon {
          color: #ffffff;
        }

        .brand-text {
          font-family: var(--font-title);
          font-size: 1.16rem;
          font-weight: 700;
          letter-spacing: -0.02em;
          color: var(--text-primary);
        }

        .accent-text {
          color: var(--primary);
        }

        .desktop-nav {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .nav-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: transparent;
          border: none;
          color: var(--text-secondary);
          font-family: var(--font-title);
          font-weight: 500;
          font-size: 0.95rem;
          padding: 8px 12px;
          border-radius: 999px;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .nav-link:hover {
          color: var(--primary);
          background: rgba(25, 119, 204, 0.06);
        }

        .nav-link.active {
          color: var(--primary);
          background: rgba(25, 119, 204, 0.08);
          font-weight: 600;
        }

        .nav-link.cta {
          background: var(--primary);
          color: #ffffff;
          padding: 9px 16px;
          box-shadow: 0 8px 20px rgba(25, 119, 204, 0.14);
        }

        .nav-link.cta:hover {
          background: var(--primary-hover);
          color: #fff;
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
          top: 76px;
          left: 0;
          width: 100%;
          height: calc(100vh - 76px);
          background: rgba(255, 255, 255, 0.96);
          z-index: 999;
          display: flex;
          flex-direction: column;
          padding: 24px;
        }

        .mobile-nav {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .mobile-nav-link {
          display: flex;
          align-items: center;
          gap: 12px;
          background: #ffffff;
          border: 1px solid var(--border-light);
          color: var(--text-secondary);
          font-family: var(--font-title);
          font-size: 1rem;
          font-weight: 500;
          padding: 14px 16px;
          border-radius: 12px;
          cursor: pointer;
          width: 100%;
          text-align: left;
          transition: all var(--transition-fast);
        }

        .mobile-nav-link:hover {
          color: var(--primary);
          border-color: var(--primary);
        }

        .mobile-nav-link.active {
          color: var(--primary);
          background: rgba(25, 119, 204, 0.08);
          border-color: rgba(25, 119, 204, 0.2);
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
