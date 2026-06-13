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
          background: linear-gradient(135deg, #ffffff, #f4f9fd);
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
          background: #ffffff;
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
          color: var(--primary);
          border-color: var(--primary);
        }

        .filter-btn.active {
          background: var(--primary);
          color: #ffffff;
          font-weight: 600;
          border-color: transparent;
          box-shadow: 0 8px 20px rgba(25, 119, 204, 0.16);
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
          color: var(--danger);
          font-weight: 500;
        }

        .doctor-grid {
          position: relative;
        }

        .doctor-card {
          padding: 28px 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 18px;
          border: 1px solid #DCE7F1;
          border-radius: 16px;
          background: linear-gradient(180deg, #ffffff 0%, #fcfeff 100%);
          box-shadow: 0 12px 30px rgba(44, 73, 100, 0.08);
          transition: transform 250ms ease, box-shadow 250ms ease, border-color 250ms ease;
          min-height: 100%;
          height: 100%;
          justify-content: space-between;
        }

        .doctor-card:hover {
          transform: translateY(-8px);
          border-color: #1977CC;
          box-shadow: 0 18px 40px rgba(25, 119, 204, 0.15);
        }

        .doctor-avatar-wrapper {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          padding-bottom: 4px;
        }

        .doctor-avatar {
          width: 96px;
          height: 96px;
          border-radius: 50%;
          background: linear-gradient(135deg, rgba(25, 119, 204, 0.14), rgba(63, 187, 192, 0.16));
          border: 1px solid rgba(25, 119, 204, 0.14);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--primary);
          transition: transform 250ms ease, border-color 250ms ease, box-shadow 250ms ease;
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.75);
        }

        .doctor-card:hover .doctor-avatar {
          transform: scale(1.05);
          border-color: #1977CC;
          box-shadow: 0 10px 24px rgba(25, 119, 204, 0.12);
        }

        .doctor-active-badge {
          position: static;
          transform: none;
          background: rgba(40, 167, 69, 0.12);
          border: 1px solid rgba(40, 167, 69, 0.2);
          color: var(--success);
          font-size: 0.76rem;
          font-weight: 700;
          padding: 6px 12px;
          border-radius: 999px;
          display: flex;
          align-items: center;
          gap: 5px;
          white-space: nowrap;
        }

        .doctor-info {
          display: flex;
          flex-direction: column;
          gap: 10px;
          width: 100%;
          align-items: center;
          flex: 1;
        }

        .doctor-name {
          font-size: 1.28rem;
          font-weight: 700;
          color: #2C4964;
          margin: 0;
          line-height: 1.25;
        }

        .doctor-specialty {
          color: #1977CC;
          font-weight: 700;
          font-size: 0.98rem;
          font-family: var(--font-title);
          letter-spacing: 0.01em;
        }

        .doctor-card:hover .doctor-specialty {
          color: #135a9a;
        }

        .doctor-schedule {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-top: 6px;
          text-align: center;
          border-top: 1px solid rgba(44, 73, 100, 0.08);
          padding-top: 12px;
          width: 100%;
          align-items: center;
        }

        .schedule-label {
          font-size: 0.8rem;
          color: var(--text-muted);
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .schedule-days {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 6px;
        }

        .day-badge {
          background: #F5FAFF;
          border: 1px solid #DCE7F1;
          padding: 6px 10px;
          border-radius: 999px;
          font-size: 0.8rem;
          color: #47637A;
          font-weight: 600;
        }

        .book-btn {
          width: auto;
          min-width: 168px;
          margin-top: auto;
          padding: 10px 16px;
          border-radius: 999px;
          font-weight: 600;
          box-shadow: none;
          transition: background-color 250ms ease, transform 250ms ease, box-shadow 250ms ease;
        }

        .doctor-card:hover .book-btn {
          background: #1977CC;
          color: #ffffff;
          transform: translateY(-1px);
          box-shadow: 0 8px 18px rgba(25, 119, 204, 0.18);
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
