import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    // Simulate API call for message receipt
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 1200);
  };

  return (
    <div className="contact-page fade-in">
      <div className="page-header">
        <h1 className="page-title">Contact <span className="text-gradient">Us</span></h1>
        <p className="subtitle">Have inquiries or feedback? Reach out to our administrative support desk directly.</p>
      </div>

      <div className="contact-layout">
        {/* Contact Info Cards */}
        <div className="info-column">
          <div className="info-card glass-panel">
            <div className="icon-wrapper">
              <MapPin size={22} />
            </div>
            <div className="info-text">
              <h4>Hospital Address</h4>
              <p>100 Medical Center Plaza</p>
              <p>Suite 400, Cityville, CV 12345</p>
            </div>
          </div>

          <div className="info-card glass-panel">
            <div className="icon-wrapper">
              <Phone size={22} />
            </div>
            <div className="info-text">
              <h4>Phone Contacts</h4>
              <p>Primary: +1 (555) 123-4567</p>
              <p>Emergency Line: +1 (555) 911-0000</p>
            </div>
          </div>

          <div className="info-card glass-panel">
            <div className="icon-wrapper">
              <Mail size={22} />
            </div>
            <div className="info-text">
              <h4>Email Communications</h4>
              <p>General: info@medthreadshospital.com</p>
              <p>Admissions: care@medthreadshospital.com</p>
            </div>
          </div>

          <div className="info-card glass-panel">
            <div className="icon-wrapper">
              <Clock size={22} />
            </div>
            <div className="info-text">
              <h4>Visiting Hours</h4>
              <p>Daily: 9:00 AM – 8:00 PM</p>
              <p>ICU Visits: 11:00 AM – 1:00 PM</p>
            </div>
          </div>
        </div>

        {/* Contact Form Card */}
        <div className="form-card glass-panel">
          {submitted ? (
            <div className="feedback-submitted text-center fade-in">
              <div className="check-glow">
                <CheckCircle size={44} />
              </div>
              <h3>Message Sent!</h3>
              <p className="subtitle">Thank you for getting in touch. A clinic administrator will reply to your inquiry within 24 business hours.</p>
              <button 
                className="btn btn-secondary" 
                onClick={() => setSubmitted(false)}
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="contact-form">
              <h3>Submit an <span className="text-gradient">Inquiry</span></h3>
              <p className="form-helper">Have a question? Complete the form below and we will contact you shortly.</p>

              <div className="form-group">
                <label className="form-label" htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="form-control"
                  placeholder="Jane Smith"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-control"
                  placeholder="janesmith@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="subject">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  className="form-control"
                  placeholder="Question about medical services..."
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  className="form-control"
                  rows="4"
                  placeholder="Write details of your query here..."
                  value={formData.message}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="btn btn-primary send-btn"
                disabled={submitting}
              >
                {submitting ? 'Sending Message...' : (
                  <>
                    Send Inquiry <Send size={16} />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>

      <style>{`
        .contact-page {
          display: flex;
          flex-direction: column;
          gap: 30px;
        }

        .page-title {
          font-size: 2.5rem;
          margin-bottom: 8px;
        }

        .contact-layout {
          display: grid;
          grid-template-columns: 2fr 3fr;
          gap: 32px;
        }

        .info-column {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .info-card {
          padding: 20px 24px;
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .icon-wrapper {
          width: 48px;
          height: 48px;
          background: rgba(0, 210, 255, 0.1);
          border: 1px solid var(--border-light);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--primary);
          flex-shrink: 0;
        }

        .info-card:hover .icon-wrapper {
          color: #030712;
          background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
          box-shadow: 0 0 15px rgba(0, 210, 255, 0.3);
        }

        .info-text h4 {
          font-size: 1.05rem;
          font-weight: 700;
          margin-bottom: 4px;
        }

        .info-text p {
          font-size: 0.9rem;
          color: var(--text-secondary);
          line-height: 1.4;
        }

        .form-card {
          padding: 40px;
        }

        .contact-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .contact-form h3 {
          font-size: 1.6rem;
        }

        .form-helper {
          font-size: 0.9rem;
          color: var(--text-secondary);
          margin-top: -8px;
          margin-bottom: 8px;
        }

        .send-btn {
          width: 100%;
          padding: 14px;
          font-size: 1rem;
        }

        .feedback-submitted {
          padding: 40px 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 16px;
        }

        .check-glow {
          color: var(--success);
          background: rgba(16, 185, 129, 0.15);
          width: 80px;
          height: 80px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid rgba(16, 185, 129, 0.3);
          box-shadow: 0 0 20px rgba(16, 185, 129, 0.1);
        }

        .feedback-submitted h3 {
          font-size: 1.75rem;
        }

        @media (max-width: 900px) {
          .contact-layout {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default Contact;
