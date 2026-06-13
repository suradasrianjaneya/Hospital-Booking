import { Heart, Brain, Baby, Activity, Stethoscope, ChevronRight, ShieldCheck, Award, Clock } from 'lucide-react';
import heroBg from "../assets/hero-bg.jpg";


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
      <div className="hero-shell">
       

        <section
          className="hero-section"
          style={{
            backgroundImage: `url(${heroBg})`,
          }}
        >
          <div className="hero-overlay">
            <div className="hero-container">
              <div className="hero-content">
                <span className="section-tag">Welcome to MedThreads India</span>

                <h1 className="hero-title">
                  Compassionate care for every step of your health journey.
                </h1>

                <p className="hero-description">
                  From preventive screenings to specialized treatment, our medical team
                  delivers trusted, patient-first care in a calm and welcoming environment.
                </p>

                <div className="hero-actions">
                  <button
                    className="btn btn-primary"
                    onClick={() => setCurrentPage("appointment")}
                  >
                    Book Appointment
                    <ChevronRight size={18} />
                  </button>

                  <button
                    className="btn btn-secondary"
                    onClick={() => setCurrentPage("doctors")}
                  >
                    Meet Doctors
                  </button>
                </div>

                <div className="hero-stats">
                  <div>
                    <strong>5,000+</strong>
                    <span>Appointments</span>
                  </div>

                  <div>
                    <strong>150+</strong>
                    <span>Doctors</span>
                  </div>

                  <div>
                    <strong>15+</strong>
                    <span>Departments</span>
                  </div>
                </div>
              </div>

              <div className="hero-floating-cards">
                <div className="hero-card hero-card-main">
                  <div className="hero-avatar">
                    <Stethoscope size={40} />
                  </div>
                  <div>
                    <h3>Expert Medical Team</h3>
                    <p>
                      Board-certified specialists and coordinated care plans.
                    </p>
                  </div>
                </div>

                <div className="hero-card hero-card-small">
                  <div className="mini-icon">
                    <ShieldCheck size={18} />
                  </div>
                  <div>
                    <h3>Same-Day Care </h3>
                    <p>
                      Fast access and comfort-focused support.
                    </p>
                  </div>
                </div>

                <div className="hero-card hero-card-small alt">
                  <div className="mini-icon">
                    <Activity size={18} />
                  </div>
                  <div>
                    <h3>Modern Diagnostics </h3>
                    <p>
                      Precision imaging and accurate results.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <section className="why-choose-section">
        <div className="why-choose-grid">
          <div className="feature-card feature-card-primary">
            <div className="feature-card-icon">
              <ShieldCheck size={48} />
            </div>
            <span className="feature-card-label">Welcome to MedThreads India</span>
            <h3>Compassionate care for every step of your health journey.</h3>
            <p>From preventive screenings to specialized treatment, our medical team delivers trusted, patient-first care in a calm and welcoming environment.</p>
            <button className="feature-btn" onClick={() => setCurrentPage('appointment')}>
              Book Appointment <ChevronRight size={18} />
            </button>
          </div>
          <div className="feature-card feature-card-secondary">
            <div className="feature-card-icon">
              <Award size={48} />
            </div>
            <h3>Award-Winning Care</h3>
            <p>Recognized for patient safety, clinical excellence, and a premium care experience.</p>
          </div>
          <div className="feature-card feature-card-secondary">
            <div className="feature-card-icon">
              <Clock size={48} />
            </div>
            <h3>Flexible Scheduling</h3>
            <p>Convenient appointment windows with responsive support and follow-up planning.</p>
          </div>
          <div className="feature-card feature-card-secondary">
            <div className="feature-card-icon">
              <ShieldCheck size={48} />
            </div>
            <h3>Secure Records</h3>
            <p>Protected, organized patient information designed for smooth and reliable care.</p>
          </div>
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
          gap: 40px;
        }

        .hero-shell {
          width: 100vw;
          margin-left: calc(50% - 50vw);
          padding: 0;
        }

        .hero-section {
          position: relative;
          display: flex;
          align-items: center;
          min-height: 90vh;
          width: 100%;
          overflow: hidden;
          background-repeat: no-repeat;
          background-size: cover;
          background-position: center right;
        }

        .hero-overlay {
          width: 100%;
          min-height: 90vh;
          display: flex;
          align-items: center;
          background: linear-gradient(90deg, rgba(255, 255, 255, 0.92) 0%, rgba(255, 255, 255, 0.84) 45%, rgba(255, 255, 255, 0.38) 100%);
        }

        .hero-container {
          width: min(100%, 1200px);
          margin: 0 auto;
          padding: 72px 24px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 32px;
        }

        .hero-content {
          max-width: 620px;
          animation: fadeIn 0.45s ease forwards;
        }

        .hero-title {
          font-size: 64px;
          margin-bottom: 16px;
          max-width: 590px;
          line-height: 1.08;
          font-weight: 700;
          color: #2c4964;
        }

        .hero-description {
          font-size: 20px;
          color: #444444;
          margin-bottom: 24px;
          line-height: 1.75;
          max-width: 575px;
        }

        .hero-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-bottom: 24px;
        }

        .hero-stats {
          display: flex;
          gap: 14px;
          flex-wrap: wrap;
          margin-top: 8px;
        }

        .hero-stats > div {
          display: flex;
          flex-direction: column;
          min-width: 120px;
          padding: 14px 16px;
          border: 1px solid rgba(220, 231, 241, 0.95);
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }

        .hero-stats strong {
          font-size: 1.2rem;
          color: #1977cc;
        }

        .hero-stats span {
          font-size: 0.9rem;
          color: #444444;
        }

        .hero-floating-cards {
          width: 100%;
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 20px;
          margin-top: 8px;
        }

        .hero-card {
          background: rgba(255, 255, 255, 0.85);
          border: 1px solid rgba(255, 255, 255, 0.75);
          border-radius: 18px;
          padding: 22px;
          box-shadow: 0 14px 34px rgba(44, 73, 100, 0.12);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }

        .hero-card-main {
          display: flex;
          align-items: center;
          gap: 16px;
          width: 100%;
        }

        .hero-avatar {
          width: 58px;
          height: 58px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(25, 119, 204, 0.12);
          color: #1977cc;
          flex-shrink: 0;
        }

        .hero-card h3 {
          font-size: 1.05rem;
          margin-bottom: 4px;
        }

        .hero-card p,
        .hero-card span {
          color: #444444;
          font-size: 0.92rem;
        }

        .hero-card-small {
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
        }

        .mini-icon {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(25, 119, 204, 0.1);
          color: #1977cc;
          flex-shrink: 0;
        }

        @media (max-width: 900px) {
          .hero-floating-cards {
            grid-template-columns: 1fr;
          }
        }

        .why-choose-section {
          display: flex;
          justify-content: center;
        }

        .why-choose-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.25fr) minmax(0, 0.85fr) minmax(0, 0.85fr) minmax(0, 0.85fr);
          gap: 24px;
          width: min(100%, 1200px);
          align-items: stretch;
        }

        .feature-card {
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 14px;
          padding: 32px 30px;
          border-radius: 18px;
          border: 1px solid rgba(220, 231, 241, 0.8);
          box-shadow: 0 12px 30px rgba(44, 73, 100, 0.08);
          transition: transform 0.25s ease, box-shadow 0.25s ease;
          min-height: 282px;
          overflow: hidden;
        }

        .feature-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 18px 36px rgba(44, 73, 100, 0.14);
        }

        .feature-card-primary {
          background: #1977cc;
          color: #ffffff;
          padding: 40px;
          min-height: 100%;
          justify-content: flex-end;
          grid-row: span 2;
        }

        .feature-card-primary h3,
        .feature-card-primary p,
        .feature-card-primary .feature-card-label {
          color: #ffffff;
        }

        .feature-card-primary h3 {
          font-size: 1.6rem;
          line-height: 1.25;
          max-width: 420px;
        }

        .feature-card-secondary {
          background: rgba(255, 255, 255, 0.86);
          backdrop-filter: blur(8px);
        }

        .feature-card-secondary h3 {
          font-size: 1.18rem;
        }

        .feature-card-secondary p {
          color: #444444;
          font-size: 0.95rem;
          line-height: 1.7;
        }

        .feature-card-icon {
          width: 60px;
          height: 60px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(25, 119, 204, 0.1);
          color: #1977cc;
          margin-bottom: 4px;
        }

        .feature-card-primary .feature-card-icon {
          background: rgba(255, 255, 255, 0.18);
          color: #ffffff;
        }

        .feature-card-label {
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          opacity: 0.85;
        }

        .feature-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: fit-content;
          padding: 12px 20px;
          margin-top: 8px;
          border: 1px solid rgba(255, 255, 255, 0.25);
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.18);
          color: #ffffff;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.25s ease;
        }

        .feature-btn:hover {
          background: #ffffff;
          color: #1977cc;
          transform: translateY(-2px);
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

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 1100px) {
          .hero-section {
            grid-template-columns: 1fr;
            padding: 56px 42px;
          }

          .hero-visual {
            max-width: 560px;
            margin-left: 0;
            width: 100%;
          }

          .why-choose-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .feature-card-primary {
            grid-column: 1 / -1;
            grid-row: auto;
          }
        }

        @media (max-width: 700px) {
          .hero-shell {
            padding: 0 16px;
          }

          .hero-section {
            min-height: auto;
            padding: 40px 22px;
            border-radius: 24px;
          }

          .hero-actions {
            flex-direction: column;
            gap: 12px;
          }

          .btn {
            width: 100%;
          }

          .hero-stats {
            flex-direction: column;
          }

          .hero-card-small.alt {
            margin-left: 0;
          }

          .why-choose-grid {
            grid-template-columns: 1fr;
          }

          .feature-card {
            min-height: auto;
          }
        }
      `}</style>
    </div>
  );
};

export default Home;
