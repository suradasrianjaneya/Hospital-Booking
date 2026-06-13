import { useState, useEffect } from 'react';
import { User, Calendar, Loader, Filter, CheckCircle2 } from 'lucide-react';

const Doctors = ({ onSelectDoctor }) => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [specializationFilter, setSpecializationFilter] = useState('All');

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/doctors');
      if (!res.ok) throw new Error('Failed to fetch doctor directory.');
      const data = await res.json();
      setDoctors(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Get list of unique specializations for filter dropdown
  const specializations = ['All', ...new Set(doctors.map(d => d.specialization))];

  const filteredDoctors = specializationFilter === 'All'
    ? doctors
    : doctors.filter(doc => doc.specialization === specializationFilter);

  return (
    <div className="doctors-container fade-in">
      <div className="page-header">
        <h1 className="page-title">Meet Our <span className="text-gradient">Specialists</span></h1>
        <p className="subtitle">Our team of certified medical experts is here to provide top-quality healthcare tailored to your needs.</p>
      </div>

      {/* Filter Section */}
      <div className="filter-panel glass-panel">
        <div className="filter-title">
          <Filter size={18} />
          <span>Filter by Specialty:</span>
        </div>
        <div className="filter-options">
          {specializations.map((spec) => (
            <button
              key={spec}
              onClick={() => setSpecializationFilter(spec)}
              className={`filter-btn ${specializationFilter === spec ? 'active' : ''}`}
            >
              {spec}
            </button>
          ))}
        </div>
      </div>

      {/* Loading & Error States */}
      {loading && (
        <div className="loading-state">
          <Loader className="spinner" size={40} />
          <p>Retrieving doctor directory...</p>
        </div>
      )}

      {error && (
        <div className="error-state glass-panel">
          <p className="error-msg">{error}</p>
          <button className="btn btn-secondary" onClick={fetchDoctors}>Try Again</button>
        </div>
      )}

      {/* Doctor Grid */}
      {!loading && !error && (
        <div className="grid-3 doctor-grid">
          {filteredDoctors.map((doctor) => (
            <div key={doctor.id} className="doctor-card glass-panel fade-in">
              <div className="doctor-avatar-wrapper">
                <div className="doctor-avatar">
                  <User size={48} className="avatar-icon" />
                </div>
                <div className="doctor-active-badge">
                  <CheckCircle2 size={16} /> Available
                </div>
              </div>

              <div className="doctor-info">
                <h3 className="doctor-name">{doctor.name}</h3>
                <span className="doctor-specialty">{doctor.specialization}</span>
                
                <div className="doctor-schedule">
                  <span className="schedule-label">Available Days:</span>
                  <div className="schedule-days">
                    {doctor.available_days.split(',').map((day, i) => (
                      <span key={i} className="day-badge">{day.trim()}</span>
                    ))}
                  </div>
                </div>
              </div>

              <button 
                className="btn btn-primary book-btn"
                onClick={() => onSelectDoctor(doctor.id)}
              >
                <Calendar size={16} /> Book Appointment
              </button>
            </div>
          ))}

          {filteredDoctors.length === 0 && (
            <div className="no-results text-center glass-panel">
              <p>No specialists found in this category.</p>
            </div>
          )}
        </div>
      )}

      <style>{`
        .doctors-container {
          display: flex;
          flex-direction: column;
          gap: 30px;
        }

        .page-header {
          margin-bottom: 10px;
        }

        .page-title {
          font-size: 2.5rem;
          margin-bottom: 8px;
        }

        .filter-panel {
          display: flex;
          align-items: center;
          gap: 24px;
          padding: 20px 24px;
          border-radius: var(--radius-md);
        }

        .filter-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: var(--font-title);
          font-weight: 600;
          color: var(--text-primary);
        }

        .filter-options {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .filter-btn {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border-light);
          color: var(--text-secondary);
          padding: 8px 16px;
          border-radius: 30px;
          cursor: pointer;
          font-family: var(--font-title);
          font-weight: 500;
          font-size: 0.9rem;
          transition: all var(--transition-fast);
        }

        .filter-btn:hover {
          color: var(--text-primary);
          background: rgba(255, 255, 255, 0.08);
          border-color: var(--text-muted);
        }

        .filter-btn.active {
          background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
          color: #030712;
          font-weight: 600;
          border-color: transparent;
          box-shadow: 0 4px 15px rgba(0, 210, 255, 0.2);
        }

        .loading-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 80px 0;
          color: var(--text-secondary);
          gap: 16px;
        }

        .spinner {
          animation: spin 1.5s linear infinite;
          color: var(--primary);
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .error-state {
          padding: 40px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }

        .error-msg {
          color: var(--error);
          font-weight: 500;
        }

        .doctor-grid {
          position: relative;
        }

        .doctor-card {
          padding: 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 20px;
          border: 1px solid var(--border-light);
          transition: all var(--transition-normal);
        }

        .doctor-card:hover {
          transform: translateY(-4px);
          border-color: rgba(0, 210, 255, 0.25);
          box-shadow: 0 12px 30px rgba(0, 210, 255, 0.08);
        }

        .doctor-avatar-wrapper {
          position: relative;
        }

        .doctor-avatar {
          width: 90px;
          height: 90px;
          border-radius: 50%;
          background: linear-gradient(135deg, rgba(0, 210, 255, 0.1) 0%, rgba(0, 245, 212, 0.1) 100%);
          border: 2px solid var(--border-light);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--primary);
          transition: all var(--transition-normal);
        }

        .doctor-card:hover .doctor-avatar {
          border-color: var(--primary);
          box-shadow: 0 0 15px rgba(0, 210, 255, 0.2);
          transform: scale(1.05);
        }

        .doctor-active-badge {
          position: absolute;
          bottom: -4px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(16, 185, 129, 0.15);
          border: 1px solid rgba(16, 185, 129, 0.3);
          color: var(--success);
          font-size: 0.75rem;
          font-weight: 600;
          padding: 2px 10px;
          border-radius: 50px;
          display: flex;
          align-items: center;
          gap: 4px;
          white-space: nowrap;
        }

        .doctor-info {
          display: flex;
          flex-direction: column;
          gap: 8px;
          width: 100%;
        }

        .doctor-name {
          font-size: 1.25rem;
          font-weight: 700;
        }

        .doctor-specialty {
          color: var(--secondary);
          font-weight: 600;
          font-size: 0.95rem;
          font-family: var(--font-title);
        }

        .doctor-schedule {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-top: 8px;
          text-align: left;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          padding-top: 12px;
        }

        .schedule-label {
          font-size: 0.8rem;
          color: var(--text-muted);
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .schedule-days {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
        }

        .day-badge {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border-light);
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 0.8rem;
          color: var(--text-secondary);
        }

        .book-btn {
          width: 100%;
          margin-top: auto;
        }

        .no-results {
          grid-column: 1 / -1;
          padding: 50px;
          color: var(--text-secondary);
        }

        @media (max-width: 768px) {
          .filter-panel {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }
        }
      `}</style>
    </div>
  );
};

export default Doctors;
