import { useState, useEffect } from 'react';
import { Calendar, User, Phone, Mail, FileText, CheckCircle, ArrowRight, Loader, AlertTriangle } from 'lucide-react';

const DEFAULT_SLOTS = ['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'];

const Appointment = ({ preselectedDoctorId, clearPreselectedDoctor }) => {
  const [doctors, setDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [formData, setFormData] = useState({
    patient_name: '',
    phone: '',
    email: '',
    doctor_id: '',
    appointment_date: '',
    message: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [validationError, setValidationError] = useState(null);
  const [successBooking, setSuccessBooking] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [slotMessage, setSlotMessage] = useState(null);

  // Fetch doctors list for dropdown on load
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoadingDoctors(true);
        const res = await fetch('/api/doctors');
        if (!res.ok) throw new Error('Could not load doctors directory.');
        const data = await res.json();
        setDoctors(data);

        // Handle doctor selection routed from the Doctors page
        if (preselectedDoctorId) {
          const doctorExists = data.some(doc => doc.id === Number(preselectedDoctorId));
          if (doctorExists) {
            setFormData(prev => ({ ...prev, doctor_id: String(preselectedDoctorId) }));
          }
          clearPreselectedDoctor();
        }
      } catch (err) {
        console.error('Error fetching doctors:', err);
      } finally {
        setLoadingDoctors(false);
      }
    };
    fetchDoctors();
  }, [preselectedDoctorId, clearPreselectedDoctor]);

  useEffect(() => {
    const fetchAvailableSlots = async () => {
      if (!formData.doctor_id || !formData.appointment_date) {
        setAvailableSlots([]);
        setSelectedSlot('');
        setSlotMessage(null);
        return;
      }

      const doctorId = Number(formData.doctor_id);
      const datePattern = /^\d{4}-\d{2}-\d{2}$/;
      if (!datePattern.test(formData.appointment_date)) {
        setAvailableSlots([]);
        setSelectedSlot('');
        setSlotMessage('Please choose a valid appointment date.');
        return;
      }

      try {
        setLoadingSlots(true);
        setSlotMessage(null);
        setSelectedSlot('');

        const res = await fetch(`/api/doctors/${doctorId}/available-slots?date=${encodeURIComponent(formData.appointment_date)}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || 'Unable to load available time slots.');
        }

        setAvailableSlots(data.availableSlots || []);
        if ((data.availableSlots || []).length === 0) {
          setSlotMessage('No time slots remain for this doctor on the selected date.');
        }
      } catch (err) {
        setAvailableSlots([]);
        setSlotMessage(err.message);
      } finally {
        setLoadingSlots(false);
      }
    };

    fetchAvailableSlots();
  }, [formData.doctor_id, formData.appointment_date]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setValidationError(null);
  };

  const selectedDoctor = doctors.find(doc => doc.id === Number(formData.doctor_id));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError(null);

    // Frontend validations
    const { patient_name, phone, email, doctor_id, appointment_date } = formData;
    if (!patient_name.trim()) return setValidationError('Patient name is required');
    if (!phone.trim()) return setValidationError('Phone number is required');
    if (!email.trim()) return setValidationError('Email address is required');
    if (!doctor_id) return setValidationError('Please select a doctor');
    if (!appointment_date) return setValidationError('Appointment date is required');
    if (!selectedSlot) return setValidationError('Please choose an available time slot');

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return setValidationError('Please enter a valid email address');
    }

    try {
      setSubmitting(true);
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          doctor_id: Number(formData.doctor_id),
          appointment_time: selectedSlot
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit appointment booking.');
      }

      // Show success modal/screen
      setSuccessBooking({
        id: data.appointmentId,
        patientName: formData.patient_name,
        doctorName: selectedDoctor?.name || 'Selected doctor',
        specialization: selectedDoctor?.specialization || '',
        date: formData.appointment_date,
        time: selectedSlot
      });

      // Clear form
      setFormData({
        patient_name: '',
        phone: '',
        email: '',
        doctor_id: '',
        appointment_date: '',
        message: ''
      });
      setSelectedSlot('');
      setAvailableSlots([]);
      setSlotMessage(null);
    } catch (err) {
      setValidationError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="appointment-page fade-in">
      <div className="page-header text-center">
        <h1 className="page-title">Book an <span className="text-gradient">Appointment</span></h1>
        <p className="subtitle mx-auto">Fill out the secure form below. We will reserve your timeslot and send a confirmation to your email.</p>
      </div>

      <div className="appointment-layout">
        {/* Booking Form Card */}
        <div className="booking-card glass-panel">
          <form onSubmit={handleSubmit} className="booking-form">
            
            {validationError && (
              <div className="alert alert-danger">
                <AlertTriangle size={18} />
                <span>{validationError}</span>
              </div>
            )}

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label" htmlFor="patient_name">
                  <User size={14} /> Patient Full Name *
                </label>
                <input
                  type="text"
                  id="patient_name"
                  name="patient_name"
                  className="form-control"
                  placeholder="John Doe"
                  value={formData.patient_name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="phone">
                  <Phone size={14} /> Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="form-control"
                  placeholder="+1 (555) 000-0000"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="email">
                  <Mail size={14} /> Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-control"
                  placeholder="johndoe@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="doctor_id">
                  Select Medical Specialist *
                </label>
                <select
                  id="doctor_id"
                  name="doctor_id"
                  className="form-control"
                  value={formData.doctor_id}
                  onChange={handleChange}
                  disabled={loadingDoctors}
                  required
                >
                  <option value="">-- Choose Doctor --</option>
                  {doctors.map(doc => (
                    <option key={doc.id} value={doc.id}>
                      {doc.name} ({doc.specialization})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="appointment_date">
                  <Calendar size={14} /> Preferred Date *
                </label>
                <input
                  type="date"
                  id="appointment_date"
                  name="appointment_date"
                  className="form-control"
                  value={formData.appointment_date}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Available Time Slots *</label>
              {loadingSlots ? (
                <div className="slot-loading">
                  <Loader size={16} className="spinner" /> Loading available slots...
                </div>
              ) : (
                <>
                  <div className="slot-grid">
                    {DEFAULT_SLOTS.map((slot) => {
                      const isAvailable = availableSlots.includes(slot);
                      return (
                        <button
                          key={slot}
                          type="button"
                          className={`slot-pill ${selectedSlot === slot ? 'active' : ''} ${!isAvailable ? 'disabled' : ''}`}
                          disabled={submitting || !isAvailable}
                          onClick={() => setSelectedSlot(slot)}
                        >
                          {slot}
                        </button>
                      );
                    })}
                  </div>
                  {slotMessage && <p className="slot-message">{slotMessage}</p>}
                </>
              )}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="message">
                <FileText size={14} /> Description of Health Issues / Message
              </label>
              <textarea
                id="message"
                name="message"
                className="form-control text-area"
                rows="4"
                placeholder="Briefly explain the reason for this appointment..."
                value={formData.message}
                onChange={handleChange}
              ></textarea>
            </div>

            <button
              type="submit"
              className="btn btn-primary submit-btn"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Loader size={18} className="spinner" /> Securing Timeslot...
                </>
              ) : (
                <>
                  Submit Booking Request <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Doctor Schedule Overview Panel */}
        <div className="schedule-panel glass-panel">
          <h3>Scheduling <span className="text-gradient">Advisor</span></h3>
          <p className="panel-desc">Selecting a doctor displays their official weekly clinical consultation hours below.</p>
          
          {selectedDoctor ? (
            <div className="selected-doctor-info fade-in">
              <div className="avatar-small">
                <User size={24} />
              </div>
              <div>
                <h4 className="advisor-doc-name">{selectedDoctor.name}</h4>
                <span className="advisor-doc-spec">{selectedDoctor.specialization}</span>
              </div>
              <div className="advisor-schedule-box">
                <span className="box-title">Weekly Schedule:</span>
                <span className="box-days">{selectedDoctor.available_days}</span>
              </div>
            </div>
          ) : (
            <div className="no-doctor-selected">
              <p>No specialist selected. Please select a doctor from the form dropdown to view their available days.</p>
            </div>
          )}

          <div className="advisory-notes">
            <h4>Important Notice:</h4>
            <ul>
              <li>Please verify the doctor's available days before choosing an appointment date.</li>
              <li>Booking requests made during weekends will be reviewed next business day.</li>
              <li>Please arrive 15 minutes before your scheduled appointment time.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {successBooking && (
        <div className="modal-backdrop fade-in">
          <div className="success-modal glass-panel float-element">
            <div className="modal-header">
              <div className="check-icon-wrapper">
                <CheckCircle size={40} />
              </div>
              <h2>Booking Confirmed!</h2>
            </div>
            <div className="modal-body">
              <p className="booking-status-text">Your appointment has been registered successfully in our clinic database.</p>
              
              <div className="booking-summary-card">
                <div className="summary-row">
                  <span className="sum-label">Appointment ID:</span>
                  <span className="sum-value font-mono">#{successBooking.id}</span>
                </div>
                <div className="summary-row">
                  <span className="sum-label">Patient Name:</span>
                  <span className="sum-value">{successBooking.patientName}</span>
                </div>
                <div className="summary-row">
                  <span className="sum-label">Consulting Doctor:</span>
                  <span className="sum-value">{successBooking.doctorName}</span>
                </div>
                <div className="summary-row">
                  <span className="sum-label">Department:</span>
                  <span className="sum-value">{successBooking.specialization}</span>
                </div>
                <div className="summary-row">
                  <span className="sum-label">Scheduled Date:</span>
                  <span className="sum-value">{successBooking.date}</span>
                </div>
                <div className="summary-row">
                  <span className="sum-label">Scheduled Time:</span>
                  <span className="sum-value">{successBooking.time}</span>
                </div>
              </div>
              
              <p className="notice-sub">A reminder email has been sent to your registered address.</p>
            </div>
            <div className="modal-footer">
              <button 
                className="btn btn-primary modal-close-btn"
                onClick={() => setSuccessBooking(null)}
              >
                Close Summary
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .appointment-page {
          display: flex;
          flex-direction: column;
          gap: 40px;
        }

        .appointment-layout {
          display: grid;
          grid-template-columns: 3fr 2fr;
          gap: 30px;
        }

        .booking-card {
          padding: 35px;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px 24px;
        }

        .form-label {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .text-area {
          resize: vertical;
          min-height: 100px;
        }

        .submit-btn {
          width: 100%;
          padding: 14px 20px;
          margin-top: 20px;
          font-size: 1.05rem;
        }

        .alert {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          border-radius: var(--radius-sm);
          margin-bottom: 24px;
          font-family: var(--font-title);
          font-weight: 500;
        }

        .alert-danger {
          background: rgba(220, 53, 69, 0.09);
          border: 1px solid rgba(220, 53, 69, 0.16);
          color: var(--danger);
        }

        .slot-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 12px;
          margin-top: 8px;
        }

        .slot-pill {
          border: 1px solid var(--border-light);
          background: #ffffff;
          color: var(--text-primary);
          border-radius: 999px;
          padding: 10px 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .slot-pill:hover:not(:disabled) {
          transform: translateY(-1px);
          border-color: var(--primary);
          box-shadow: 0 8px 20px rgba(25, 119, 204, 0.12);
        }

        .slot-pill.active {
          background: var(--primary);
          color: #ffffff;
          border-color: transparent;
        }

        .slot-pill.disabled {
          cursor: not-allowed;
          opacity: 0.45;
        }

        .slot-loading,
        .slot-message {
          margin-top: 8px;
          color: var(--text-secondary);
          font-size: 0.9rem;
        }

        .schedule-panel {
          padding: 35px;
          display: flex;
          flex-direction: column;
          gap: 20px;
          height: fit-content;
          background: linear-gradient(135deg, #ffffff, #f4f9fd);
        }

        .panel-desc {
          font-size: 0.95rem;
          color: var(--text-secondary);
        }

        .selected-doctor-info {
          background: #ffffff;
          border: 1px solid var(--border-light);
          border-radius: var(--radius-md);
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .avatar-small {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: rgba(25, 119, 204, 0.09);
          color: var(--primary);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .advisor-doc-name {
          font-size: 1.15rem;
          font-weight: 700;
        }

        .advisor-doc-spec {
          color: var(--secondary);
          font-size: 0.9rem;
          font-weight: 600;
        }

        .advisor-schedule-box {
          border-top: 1px solid rgba(44, 73, 100, 0.08);
          padding-top: 12px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .box-title {
          font-size: 0.75rem;
          text-transform: uppercase;
          color: var(--text-muted);
          letter-spacing: 0.05em;
        }

        .box-days {
          font-size: 0.95rem;
          color: var(--text-primary);
          font-weight: 500;
        }

        .no-doctor-selected {
          padding: 30px 20px;
          text-align: center;
          border: 1px dashed var(--border-light);
          border-radius: var(--radius-md);
          color: var(--text-muted);
          font-size: 0.95rem;
        }

        .advisory-notes {
          border-top: 1px solid rgba(44, 73, 100, 0.08);
          padding-top: 20px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .advisory-notes h4 {
          font-size: 0.95rem;
          color: var(--text-primary);
        }

        .advisory-notes ul {
          padding-left: 20px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .advisory-notes li {
          font-size: 0.85rem;
          color: var(--text-secondary);
        }

        .modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(12, 26, 39, 0.65);
          backdrop-filter: blur(8px);
          z-index: 2000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
        }

        .success-modal {
          max-width: 500px;
          width: 100%;
          padding: 40px;
          text-align: center;
          border: 1px solid rgba(40, 167, 69, 0.2);
          box-shadow: 0 20px 52px rgba(25, 119, 204, 0.1);
        }

        .check-icon-wrapper {
          color: var(--success);
          background: rgba(40, 167, 69, 0.12);
          width: 80px;
          height: 80px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          border: 2px solid rgba(40, 167, 69, 0.2);
        }

        .success-modal h2 {
          font-size: 1.75rem;
          margin-bottom: 12px;
        }

        .booking-status-text {
          color: var(--text-secondary);
          font-size: 0.95rem;
          margin-bottom: 24px;
        }

        .booking-summary-card {
          background: #f8fbfe;
          border: 1px solid var(--border-light);
          border-radius: var(--radius-md);
          padding: 20px;
          text-align: left;
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 24px;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          border-bottom: 1px solid rgba(44, 73, 100, 0.06);
          padding-bottom: 8px;
        }

        .summary-row:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }

        .sum-label {
          color: var(--text-muted);
          font-size: 0.85rem;
        }

        .sum-value {
          font-weight: 600;
          font-size: 0.95rem;
          color: var(--text-primary);
        }

        .font-mono {
          font-family: monospace;
          color: var(--primary);
        }

        .notice-sub {
          font-size: 0.85rem;
          color: var(--text-muted);
        }

        .modal-close-btn {
          width: 100%;
          margin-top: 10px;
        }

        @media (max-width: 900px) {
          .appointment-layout {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 600px) {
          .form-grid {
            grid-template-columns: 1fr;
          }

          .slot-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default Appointment;
