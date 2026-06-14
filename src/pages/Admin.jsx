import { useState, useEffect } from 'react';
import {
  Calendar, LogIn, LogOut, Plus, Trash2, Edit, Save, X,
  LayoutDashboard, Stethoscope, Mail, Phone, Clock
} from 'lucide-react';

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState(null);
  
  // Dashboard states
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'doctors' | 'appointments'
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);

  // Doctor CRUD states
  const [showDoctorModal, setShowDoctorModal] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null); // null for "Add", object for "Edit"
  const [doctorForm, setDoctorForm] = useState({ name: '', specialization: '', available_days: '' });
  const [doctorError, setDoctorError] = useState(null);

  // Load state on mount (e.g. check localStorage for saved session)
  useEffect(() => {
    const savedToken = localStorage.getItem('adminToken');
    if (savedToken) {
      setIsAuthenticated(true);
      fetchDashboardData();
    }
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [docRes, appRes] = await Promise.all([
        fetch('/api/doctors'),
        fetch('/api/appointments')
      ]);
      if (docRes.ok && appRes.ok) {
        const docs = await docRes.json();
        const apps = await appRes.json();
        setDoctors(docs);
        setAppointments(apps);
      }
    } catch (err) {
      console.error('Error fetching admin dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError(null);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm)
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Login failed');
      }
      localStorage.setItem('adminToken', data.token);
      setIsAuthenticated(true);
      fetchDashboardData();
    } catch (err) {
      setLoginError(err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsAuthenticated(false);
    setLoginForm({ username: '', password: '' });
  };

  // Doctors Actions (CRUD)
  const handleOpenAddModal = () => {
    setEditingDoctor(null);
    setDoctorForm({ name: '', specialization: '', available_days: '' });
    setDoctorError(null);
    setShowDoctorModal(true);
  };

  const handleOpenEditModal = (doctor) => {
    setEditingDoctor(doctor);
    setDoctorForm({ 
      name: doctor.name, 
      specialization: doctor.specialization, 
      available_days: doctor.available_days 
    });
    setDoctorError(null);
    setShowDoctorModal(true);
  };

  const handleDoctorSubmit = async (e) => {
    e.preventDefault();
    setDoctorError(null);
    
    const { name, specialization, available_days } = doctorForm;
    if (!name.trim() || !specialization.trim() || !available_days.trim()) {
      return setDoctorError('All fields are required');
    }

    const url = editingDoctor ? `/api/doctors/${editingDoctor.id}` : '/api/doctors';
    const method = editingDoctor ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(doctorForm)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save doctor details.');
      
      setShowDoctorModal(false);
      fetchDashboardData();
    } catch (err) {
      setDoctorError(err.message);
    }
  };

  const handleDeleteDoctor = async (id) => {
    if (!window.confirm('Are you sure you want to delete this doctor? This will also remove all their associated appointments.')) return;
    try {
      const res = await fetch(`/api/doctors/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete doctor');
      }
      fetchDashboardData();
    } catch (err) {
      alert(err.message);
    }
  };

  // Appointments Actions
  const handleDeleteAppointment = async (id) => {
    if (!window.confirm('Are you sure you want to cancel/delete this appointment?')) return;
    try {
      const res = await fetch(`/api/appointments/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete appointment');
      }
      fetchDashboardData();
    } catch (err) {
      alert(err.message);
    }
  };

  // Render Login Panel
  if (!isAuthenticated) {
    return (
      <div className="login-container fade-in">
        <div className="login-card glass-panel">
          <div className="login-header">
            <div className="login-icon-box">
              <LogIn size={24} />
            </div>
            <h2>Admin Login</h2>
            <p className="login-subtitle">Authenticate to access the clinical registry dashboard.</p>
          </div>

          <form onSubmit={handleLoginSubmit} className="login-form">
            {loginError && <div className="alert alert-danger">{loginError}</div>}
            
            <div className="form-group">
              <label className="form-label" htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                className="form-control"
                placeholder="Enter username"
                value={loginForm.username}
                onChange={(e) => setLoginForm(prev => ({ ...prev, username: e.target.value }))}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                className="form-control"
                placeholder="Enter password"
                value={loginForm.password}
                onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary login-btn">
              Authenticate Account
            </button>
            <div className="credential-hints">
              <p>Demo Username: <code>admin</code></p>
              <p>Demo Password: <code>admin123</code></p>
            </div>
          </form>
        </div>

        <style>{`
          .login-container {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 60px 0;
          }
          .login-card {
            max-width: 440px;
            width: 100%;
            padding: 40px;
          }
          .login-header {
            text-align: center;
            margin-bottom: 24px;
          }
          .login-icon-box {
            color: var(--primary);
            background: rgba(0, 210, 255, 0.1);
            width: 54px;
            height: 54px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 16px;
            border: 1px solid var(--border-light);
          }
          .login-subtitle {
            font-size: 0.85rem;
            color: var(--text-secondary);
            margin-top: 4px;
          }
          .login-form {
            display: flex;
            flex-direction: column;
            gap: 16px;
          }
          .login-btn {
            width: 100%;
            padding: 12px;
            margin-top: 8px;
          }
          .credential-hints {
            margin-top: 16px;
            border-top: 1px dashed var(--border-light);
            padding-top: 16px;
            font-size: 0.8rem;
            color: var(--text-muted);
            display: flex;
            justify-content: space-between;
          }
          .credential-hints code {
            color: var(--secondary);
            background: rgba(0, 245, 212, 0.05);
            padding: 1px 4px;
            border-radius: 4px;
          }
        `}</style>
      </div>
    );
  }

  // Render Admin Dashboard
  return (
    <div className="admin-container fade-in">
      <div className="admin-header glass-panel">
        <div className="admin-title-box">
          <LayoutDashboard className="admin-icon" size={22} />
          <div>
            <h2>Admin Management Center</h2>
            <p className="admin-subtitle">Registry systems database administration console.</p>
          </div>
        </div>

        <div className="admin-controls">
          <button className="btn btn-secondary logout-btn" onClick={handleLogout}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="tabs-container">
        <button 
          onClick={() => setActiveTab('dashboard')} 
          className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
        >
          Dashboard Stats
        </button>
        <button 
          onClick={() => setActiveTab('doctors')} 
          className={`tab-btn ${activeTab === 'doctors' ? 'active' : ''}`}
        >
          Manage Doctors ({doctors.length})
        </button>
        <button 
          onClick={() => setActiveTab('appointments')} 
          className={`tab-btn ${activeTab === 'appointments' ? 'active' : ''}`}
        >
          View Appointments ({appointments.length})
        </button>
      </div>

      {/* Loading overlay */}
      {loading && <p className="loading-indicator">Updating administrative data...</p>}

      {/* TAB 1: DASHBOARD OVERVIEW */}
      {!loading && activeTab === 'dashboard' && (
        <div className="tab-content fade-in">
          <div className="grid-2 stats-grid">
            <div className="stat-card-admin glass-panel cursor-pointer" onClick={() => setActiveTab('doctors')}>
              <div className="card-top">
                <Stethoscope size={36} className="text-secondary" />
                <span className="count-num text-secondary">{doctors.length}</span>
              </div>
              <h3>Active Medical Specialists</h3>
              <p>Registered medical practitioners currently open for online appointment slot allocation.</p>
            </div>

            <div className="stat-card-admin glass-panel cursor-pointer" onClick={() => setActiveTab('appointments')}>
              <div className="card-top">
                <Calendar size={36} className="text-primary" />
                <span className="count-num text-primary">{appointments.length}</span>
              </div>
              <h3>Scheduled Appointments</h3>
              <p>Active medical consult bookings awaiting execution in the central patient directory.</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DOCTORS CRUD MANAGER */}
      {!loading && activeTab === 'doctors' && (
        <div className="tab-content fade-in">
          <div className="panel-actions">
            <h3>Medical Specialists Directory</h3>
            <button className="btn btn-primary add-doc-btn" onClick={handleOpenAddModal}>
              <Plus size={16} /> Add New Doctor
            </button>
          </div>

          <div className="table-responsive glass-panel">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Full Name</th>
                  <th>Clinical Specialization</th>
                  <th>Clinical Availability</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {doctors.map(doc => (
                  <tr key={doc.id}>
                    <td>#{doc.id}</td>
                    <td className="bold-cell">{doc.name}</td>
                    <td><span className="table-specialty">{doc.specialization}</span></td>
                    <td className="days-cell">{doc.available_days}</td>
                    <td>
                      <div className="table-actions">
                        <button className="action-btn edit-btn" onClick={() => handleOpenEditModal(doc)} title="Edit Doctor">
                          <Edit size={16} />
                        </button>
                        <button className="action-btn delete-btn" onClick={() => handleDeleteDoctor(doc.id)} title="Delete Doctor">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {doctors.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center empty-cell">No doctors found. Click 'Add New Doctor' to register one.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: APPOINTMENTS LIST */}
      {!loading && activeTab === 'appointments' && (
        <div className="tab-content fade-in">
          <div className="panel-actions">
            <h3>Registered Appointment Books</h3>
          </div>

          <div className="table-responsive glass-panel">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Patient Name</th>
                  <th>Doctor Name</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {[...appointments].sort((a, b) => {
                  const dateCompare = new Date(a.appointment_date) - new Date(b.appointment_date);
                  if (dateCompare !== 0) return dateCompare;
                  return (a.appointment_time || '').localeCompare(b.appointment_time || '');
                }).map(app => (
                  <tr key={app.id}>
                    <td>#{app.id}</td>
                    <td className="bold-cell">{app.patient_name}</td>
                    <td>
                      <div className="doctor-details">
                        <span className="doc-name">{app.doctor_name}</span>
                        <span className="doc-spec">{app.doctor_specialization}</span>
                      </div>
                    </td>
                    <td className="bold-cell">{app.appointment_date}</td>
                    <td>{app.appointment_time}</td>
                    <td>{app.phone}</td>
                    <td>{app.email}</td>
                    <td>
                      <button className="cancel-appointment-btn" onClick={() => handleDeleteAppointment(app.id)} title="Cancel Appointment">
                        <Trash2 size={16} /> Cancel Book
                      </button>
                    </td>
                  </tr>
                ))}
                {appointments.length === 0 && (
                  <tr>
                    <td colSpan="8" className="text-center empty-cell">No appointments scheduled currently.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* DOCTOR CREATE/UPDATE DIALOG MODAL */}
      {showDoctorModal && (
        <div className="modal-backdrop fade-in">
          <div className="success-modal doctor-modal glass-panel">
            <div className="modal-header">
              <h3>{editingDoctor ? 'Edit Doctor Details' : 'Register New Doctor'}</h3>
              <button className="close-x-btn" onClick={() => setShowDoctorModal(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleDoctorSubmit} className="modal-form">
              {doctorError && <div className="alert alert-danger">{doctorError}</div>}

              <div className="form-group">
                <label className="form-label" htmlFor="doc_name">Doctor Name</label>
                <input
                  type="text"
                  id="doc_name"
                  className="form-control"
                  placeholder="e.g. Dr. Jane Foster"
                  value={doctorForm.name}
                  onChange={(e) => setDoctorForm(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="doc_spec">Clinical Specialization</label>
                <input
                  type="text"
                  id="doc_spec"
                  className="form-control"
                  placeholder="e.g. Cardiology"
                  value={doctorForm.specialization}
                  onChange={(e) => setDoctorForm(prev => ({ ...prev, specialization: e.target.value }))}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="doc_days">Available Days</label>
                <input
                  type="text"
                  id="doc_days"
                  className="form-control"
                  placeholder="e.g. Monday, Wednesday, Friday"
                  value={doctorForm.available_days}
                  onChange={(e) => setDoctorForm(prev => ({ ...prev, available_days: e.target.value }))}
                  required
                />
                <span className="input-hint">Comma separated list of days (e.g. Tuesday, Thursday)</span>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowDoctorModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary save-doc-btn">
                  <Save size={16} /> Save Doctor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .admin-container {
          display: flex;
          flex-direction: column;
          gap: 30px;
        }

        .admin-header {
          padding: 24px 30px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: linear-gradient(135deg, #ffffff, #f4f9fd);
        }

        .admin-title-box {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .admin-icon {
          color: var(--primary);
        }

        .admin-subtitle {
          font-size: 0.85rem;
          color: var(--text-secondary);
        }

        .tabs-container {
          display: flex;
          gap: 12px;
          border-bottom: 1px solid rgba(44, 73, 100, 0.08);
          padding-bottom: 6px;
        }

        .tab-btn {
          background: transparent;
          border: none;
          color: var(--text-secondary);
          font-family: var(--font-title);
          font-weight: 600;
          font-size: 1rem;
          padding: 10px 18px;
          cursor: pointer;
          position: relative;
          transition: color 0.2s ease;
        }

        .tab-btn:hover {
          color: var(--text-primary);
        }

        .tab-btn.active {
          color: var(--primary);
        }

        .tab-btn.active::after {
          content: '';
          position: absolute;
          bottom: -7px;
          left: 0;
          width: 100%;
          height: 2px;
          background: var(--primary);
          box-shadow: 0 0 8px rgba(25, 119, 204, 0.18);
        }

        .loading-indicator {
          color: var(--text-secondary);
          text-align: center;
          padding: 40px 0;
        }

        .stats-grid {
          margin-top: 10px;
        }

        .cursor-pointer {
          cursor: pointer;
        }

        .stat-card-admin {
          padding: 30px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          transition: all 0.3s ease;
          background: linear-gradient(135deg, #ffffff, #f4f9fd);
        }

        .stat-card-admin:hover {
          transform: translateY(-4px);
          border-color: var(--primary);
        }

        .card-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .count-num {
          font-family: var(--font-title);
          font-size: 3.2rem;
          font-weight: 800;
          line-height: 1;
        }

        .panel-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .table-responsive {
          overflow-x: auto;
          border-radius: var(--radius-md);
        }

        .admin-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          font-size: 0.95rem;
        }

        .admin-table th {
          background: #f4f9fd;
          border-bottom: 1px solid rgba(44, 73, 100, 0.08);
          padding: 16px 20px;
          font-family: var(--font-title);
          font-weight: 600;
          color: var(--text-secondary);
        }

        .admin-table td {
          border-bottom: 1px solid rgba(44, 73, 100, 0.06);
          padding: 16px 20px;
          color: var(--text-primary);
          vertical-align: middle;
        }

        .admin-table tr:hover {
          background: #fbfdff;
        }

        .bold-cell {
          font-weight: 600;
        }

        .table-specialty {
          color: var(--secondary);
          font-weight: 600;
          font-size: 0.9rem;
        }

        .days-cell {
          font-size: 0.9rem;
          color: var(--text-secondary);
        }

        .table-actions {
          display: flex;
          gap: 8px;
        }

        .action-btn {
          width: 32px;
          height: 32px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          border: none;
          transition: all 0.2s ease;
        }

        .edit-btn {
          background: rgba(25, 119, 204, 0.1);
          color: var(--primary);
        }

        .edit-btn:hover {
          background: var(--primary);
          color: #ffffff;
        }

        .delete-btn {
          background: rgba(220, 53, 69, 0.1);
          color: var(--danger);
          display: inline-flex;
          align-items: center;
          gap: 6px;
          width: auto;
          padding: 0 12px;
        }

        .delete-btn:hover {
          background: var(--danger);
          color: white;
        }

        .cancel-appointment-btn {
          background: rgba(220, 53, 69, 0.1);
          color: var(--danger);
          border: 1px solid rgba(220, 53, 69, 0.15);
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          border-radius: 6px;
          font-weight: 600;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .cancel-appointment-btn:hover {
          background: var(--danger);
          color: white;
        }

        .empty-cell {
          padding: 40px !important;
          color: var(--text-muted);
        }

        .patient-details, .doctor-details {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .patient-name, .doc-name {
          font-weight: 700;
        }

        .patient-contact {
          font-size: 0.8rem;
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .doc-spec {
          font-size: 0.8rem;
          color: var(--secondary);
          font-weight: 600;
        }

        .date-badge-admin {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(25, 119, 204, 0.09);
          border: 1px solid rgba(25, 119, 204, 0.16);
          color: var(--primary);
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 0.85rem;
        }

        .message-cell {
          max-width: 200px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          font-size: 0.9rem;
          color: var(--text-secondary);
        }

        .doctor-modal {
          max-width: 480px;
          width: 100%;
          padding: 35px;
          background: #ffffff;
          box-shadow: 0 20px 52px rgba(25, 119, 204, 0.15);
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid rgba(44, 73, 100, 0.08);
          padding-bottom: 16px;
          margin-bottom: 20px;
        }

        .close-x-btn {
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          transition: color 0.2s ease;
        }

        .close-x-btn:hover {
          color: var(--text-primary);
        }

        .modal-form {
          text-align: left;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .input-hint {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          border-top: 1px solid rgba(44, 73, 100, 0.08);
          padding-top: 20px;
          margin-top: 10px;
        }
      `}</style>
    </div>
  );
};

export default Admin;
