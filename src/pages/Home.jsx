import { Heart, Brain, Baby, Activity, Stethoscope, ChevronRight, ShieldCheck, Award, Clock } from 'lucide-react';

const Home = ({ setCurrentPage }) => {
  const services = [
    {
      icon: Heart,
      title: 'Cardiology',
      desc: 'Comprehensive cardiac screenings, heart failure management, and advanced cardiovascular diagnostics.',
      color: '#1977cc'
    },
    {
      icon: Brain,
      title: 'Neurology',
      desc: 'Expert care for neurological disorders, nerve function testing, and stroke prevention treatments.',
      color: '#3fbbc0'
    },
    {
      icon: Baby,
      title: 'Pediatrics',
      desc: 'Nurturing healthcare for children, immunization clinics, and pediatric milestone monitoring.',
      color: '#28a745'
    },
    {
      icon: Activity,
      title: 'Orthopedics',
      desc: 'Joint replacement, trauma care, sports medicine, and targeted rehabilitative therapies.',
      color: '#1977cc'
    },
    {
      icon: Stethoscope,
      title: 'General Medicine',
      desc: 'Routine wellness physicals, diagnostic medicine, chronic illness management, and preventative health.',
      color: '#3fbbc0'
    }
  ];

  return (
    <div className="home-container fade-in">
      <section className="hero-section glass-panel">
        <div className="hero-content">
          <span className="section-tag">Welcome to MedThreads</span>
          <h1 className="hero-title">
            Compassionate care for every step of your health journey.
          </h1>
          <p className="hero-description">
            From preventive screenings to specialized treatment, our medical team delivers trusted, patient-first care in a calm and welcoming environment.
          </p>
          <div className="hero-actions">
            <button className="btn btn-primary" onClick={() => setCurrentPage('appointment')}>
              Book Appointment <ChevronRight size={18} />
            </button>
            <button className="btn btn-secondary" onClick={() => setCurrentPage('doctors')}>
              Meet Doctors
            </button>
          </div>

          <div className="hero-stats">
            <div>
              <strong>500+</strong>
              <span>Appointments</span>
            </div>
            <div>
              <strong>50+</strong>
              <span>Doctors</span>
            </div>
            <div>
              <strong>10+</strong>
              <span>Departments</span>
            </div>
          </div>
        </div>

        <div className="hero-visual" aria-hidden="true">
          <div className="hero-card hero-card-main">
            <div className="hero-avatar">
              <Stethoscope size={40} />
            </div>
            <div>
              <h3>Expert Medical Team</h3>
              <p>Board-certified specialists and coordinated care plans.</p>
            </div>
          </div>
          <div className="hero-card hero-card-small">
            <div className="mini-icon"><ShieldCheck size={18} /></div>
            <div>
              <strong>Same-Day Care</strong>
              <span>Fast access and comfort-focused support.</span>
            </div>
          </div>
          <div className="hero-card hero-card-small alt">
            <div className="mini-icon"><Activity size={18} /></div>
            <div>
              <strong>Modern Diagnostics</strong>
              <span>Precision imaging and accurate results.</span>
            </div>
          </div>
        </div>
      </section>

      <section className="stats-section grid-3">
        <div className="stat-card glass-panel">
          <Award className="stat-icon" size={28} />
          <h3>Award-Winning Care</h3>
          <p>Recognized for patient safety, clinical excellence, and a premium care experience.</p>
        </div>
        <div className="stat-card glass-panel">
          <Clock className="stat-icon" size={28} />
          <h3>Flexible Scheduling</h3>
          <p>Convenient appointment windows with responsive support and follow-up planning.</p>
        </div>
        <div className="stat-card glass-panel">
          <ShieldCheck className="stat-icon" size={28} />
          <h3>Secure Records</h3>
          <p>Protected, organized patient information designed for smooth and reliable care.</p>
        </div>
      </section>

      <section className="services-section">
        <div className="section-header text-center">
          <span className="section-tag">Departments</span>
          <h2 className="section-title">Meet Our <span className="text-gradient">Specialties</span></h2>
          <p className="subtitle mx-auto">Explore comprehensive services backed by experienced clinicians and modern treatment protocols.</p>
        </div>

        <div className="grid-3 services-grid">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div key={index} className="service-card glass-panel">
                <div className="service-icon-wrapper" style={{ '--icon-color': service.color }}>
                  <Icon size={24} className="service-icon" />
                </div>
                <h3>{service.title}</h3>
                <p>{service.desc}</p>
                <button
                  className="service-link"
                  onClick={() => setCurrentPage('appointment')}
                >
                  Schedule in {service.title} <ChevronRight size={14} />
                </button>
              </div>
            );
          })}
        </div>
      </section>

      <style>{`
        .home-container {
          display: flex;
          flex-direction: column;
          gap: 48px;
        }

        .hero-section {
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 32px;
          align-items: center;
          padding: 48px;
          border-radius: var(--radius-lg);
          background: linear-gradient(135deg, #ffffff 0%, #f1f7fd 100%);
        }

        .hero-content {
          max-width: 620px;
        }

        .hero-title {
          font-size: clamp(2rem, 3.4vw, 3rem);
          margin-bottom: 16px;
          max-width: 590px;
        }

        .hero-description {
          font-size: 1.05rem;
          color: var(--text-secondary);
          margin-bottom: 24px;
          line-height: 1.7;
        }

        .hero-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-bottom: 24px;
        }

        .hero-stats {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
        }

        .hero-stats > div {
          display: flex;
          flex-direction: column;
          min-width: 110px;
          padding: 12px 14px;
          border: 1px solid var(--border-light);
          border-radius: var(--radius-sm);
          background: rgba(255, 255, 255, 0.82);
        }

        .hero-stats strong {
          font-size: 1.2rem;
          color: var(--primary);
        }

        .hero-stats span {
          font-size: 0.85rem;
          color: var(--text-secondary);
        }

        .hero-visual {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .hero-card {
          background: #ffffff;
          border: 1px solid var(--border-light);
          border-radius: var(--radius-md);
          padding: 20px;
          box-shadow: var(--shadow-soft);
        }

        .hero-card-main {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .hero-avatar {
          width: 56px;
          height: 56px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(25, 119, 204, 0.12);
          color: var(--primary);
        }

        .hero-card h3 {
          font-size: 1.05rem;
          margin-bottom: 4px;
        }

        .hero-card p,
        .hero-card span {
          color: var(--text-secondary);
          font-size: 0.9rem;
        }

        .hero-card-small {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .hero-card-small.alt {
          margin-left: 24px;
        }

        .mini-icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(63, 187, 192, 0.12);
          color: var(--secondary);
        }

        .stat-card {
          padding: 28px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          border-left: 3px solid var(--primary);
        }

        .stat-icon {
          color: var(--primary);
        }

        .stat-card h3 {
          font-size: 1.1rem;
        }

        .stat-card p {
          font-size: 0.95rem;
          color: var(--text-secondary);
        }

        .section-header {
          margin-bottom: 30px;
        }

        .section-title {
          font-size: 2rem;
          margin-bottom: 10px;
        }

        .mx-auto {
          margin-left: auto;
          margin-right: auto;
        }

        .service-card {
          padding: 28px;
          display: flex;
          flex-direction: column;
          gap: 14px;
          transition: transform var(--transition-normal), box-shadow var(--transition-normal);
        }

        .service-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 16px 34px rgba(44, 73, 100, 0.1);
        }

        .service-icon-wrapper {
          background: rgba(25, 119, 204, 0.08);
          width: 50px;
          height: 50px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background var(--transition-fast);
        }

        .service-card:hover .service-icon-wrapper {
          background: var(--icon-color);
        }

        .service-icon {
          color: var(--icon-color);
          transition: color var(--transition-fast);
        }

        .service-card:hover .service-icon {
          color: #ffffff;
        }

        .service-card h3 {
          font-size: 1.15rem;
        }

        .service-card p {
          font-size: 0.95rem;
          color: var(--text-secondary);
          line-height: 1.65;
          flex-grow: 1;
        }

        .service-link {
          background: transparent;
          border: none;
          color: var(--primary);
          display: flex;
          align-items: center;
          gap: 6px;
          font-weight: 600;
          cursor: pointer;
          padding: 0;
          width: fit-content;
        }

        .service-link:hover {
          gap: 10px;
        }

        @media (max-width: 900px) {
          .hero-section {
            grid-template-columns: 1fr;
            padding: 32px;
          }

          .hero-visual {
            max-width: 480px;
          }
        }

        @media (max-width: 600px) {
          .hero-actions {
            flex-direction: column;
            gap: 12px;
          }

          .btn {
            width: 100%;
          }

          .hero-card-small.alt {
            margin-left: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default Home;
