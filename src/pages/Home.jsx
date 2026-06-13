import Threads from '../components/Threads';
import { Heart, Brain, Baby, Activity, Stethoscope, ChevronRight, ShieldAlert, Award, Clock } from 'lucide-react';

const Home = ({ setCurrentPage }) => {
  const services = [
    {
      icon: Heart,
      title: 'Cardiology',
      desc: 'Comprehensive cardiac screenings, heart failure management, and advanced cardiovascular diagnostics.',
      color: '#ff4b5c'
    },
    {
      icon: Brain,
      title: 'Neurology',
      desc: 'Expert care for neurological disorders, nerve function testing, and stroke prevention treatments.',
      color: '#a78bfa'
    },
    {
      icon: Baby,
      title: 'Pediatrics',
      desc: 'Nurturing healthcare for children, immunization clinics, and pediatric milestone monitoring.',
      color: '#34d399'
    },
    {
      icon: Activity,
      title: 'Orthopedics',
      desc: 'Joint replacement, trauma care, sports medicine, and targeted rehabilitative therapies.',
      color: '#fbbf24'
    },
    {
      icon: Stethoscope,
      title: 'General Medicine',
      desc: 'Routine wellness physicals, diagnostic medicine, chronic illness management, and preventative health.',
      color: '#00d2ff'
    }
  ];

  return (
    <div className="home-container fade-in">
      {/* Threads Hero Banner Section */}
      <section className="hero-section glass-panel">
        <div className="threads-background-wrapper">
          <Threads
            color={[0.0, 0.82, 1.0]} // Vibrant medical cyan: RGB scaled 0-1
            amplitude={1.2}
            distance={0.15}
            enableMouseInteraction={true}
          />
        </div>
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <span className="hero-tag">Welcome to MedThreads</span>
          <h1 className="hero-title">
            Next-Gen Medical Care <br />
            <span className="text-gradient">Woven with Excellence</span>
          </h1>
          <p className="hero-description">
            Combining state-of-the-art medical technology with empathetic patient care. Experience a hospital environment designed around your recovery and wellness.
          </p>
          <div className="hero-actions">
            <button className="btn btn-primary" onClick={() => setCurrentPage('appointment')}>
              Book Appointment <ChevronRight size={18} />
            </button>
            <button className="btn btn-secondary" onClick={() => setCurrentPage('doctors')}>
              Meet Doctors
            </button>
          </div>
        </div>
      </section>

      {/* Overview Cards Section */}
      <section className="stats-section grid-3">
        <div className="stat-card glass-panel">
          <Award className="stat-icon" size={32} />
          <h3>A+ Certified Care</h3>
          <p>Recognized nationally for excellence in hygiene, patient-safety protocols, and overall clinical outcomes.</p>
        </div>
        <div className="stat-card glass-panel">
          <Clock className="stat-icon" size={32} />
          <h3>24/7 Consultation</h3>
          <p>Round-the-clock emergency room staffing and immediate access to primary physicians when you need it most.</p>
        </div>
        <div className="stat-card glass-panel">
          <ShieldAlert className="stat-icon" size={32} />
          <h3>Secured Records</h3>
          <p>Fully compliant, encrypted digital health repository ensuring your medical history remains private and accessible.</p>
        </div>
      </section>

      {/* Services Grid Section */}
      <section className="services-section">
        <div className="section-header text-center">
          <h2 className="section-title">Our Medical <span className="text-gradient">Specialties</span></h2>
          <p className="subtitle mx-auto">Explore our range of comprehensive medical departments staffed by certified, world-class medical professionals.</p>
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
          gap: 60px;
        }

        .hero-section {
          position: relative;
          height: 520px;
          border-radius: var(--radius-lg);
          overflow: hidden;
          display: flex;
          align-items: center;
          padding: 0 60px;
          border: 1px solid rgba(0, 210, 255, 0.15);
        }

        .threads-background-wrapper {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
        }

        .hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(to right, rgba(8, 12, 20, 0.95) 40%, rgba(8, 12, 20, 0.4) 100%);
          z-index: 2;
        }

        .hero-content {
          position: relative;
          z-index: 3;
          max-width: 600px;
        }

        .hero-tag {
          font-family: var(--font-title);
          font-size: 0.85rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: var(--secondary);
          background: rgba(0, 245, 212, 0.1);
          padding: 6px 14px;
          border-radius: 50px;
          border: 1px solid rgba(0, 245, 212, 0.2);
          display: inline-block;
          margin-bottom: 20px;
        }

        .hero-title {
          font-size: 3rem;
          line-height: 1.15;
          margin-bottom: 20px;
        }

        .hero-description {
          font-size: 1.1rem;
          color: var(--text-secondary);
          margin-bottom: 30px;
          line-height: 1.6;
        }

        .hero-actions {
          display: flex;
          gap: 16px;
        }

        .stats-section {
          margin-top: -20px;
        }

        .stat-card {
          padding: 30px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          border-left: 4px solid var(--primary);
        }

        .stat-icon {
          color: var(--primary);
          filter: drop-shadow(0 0 8px var(--primary-glow));
        }

        .stat-card h3 {
          font-size: 1.25rem;
        }

        .stat-card p {
          font-size: 0.95rem;
          color: var(--text-secondary);
          line-height: 1.5;
        }

        .section-header {
          margin-bottom: 40px;
        }

        .section-title {
          font-size: 2.25rem;
          margin-bottom: 12px;
        }

        .mx-auto {
          margin-left: auto;
          margin-right: auto;
        }

        .services-grid {
          margin-bottom: 20px;
        }

        .service-card {
          padding: 35px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          transition: all 0.3s ease;
        }

        .service-card:hover {
          transform: translateY(-5px);
          border-color: rgba(0, 210, 255, 0.3);
          box-shadow: 0 12px 30px rgba(0, 210, 255, 0.08);
        }

        .service-icon-wrapper {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.06);
          width: 50px;
          height: 50px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .service-card:hover .service-icon-wrapper {
          background: var(--icon-color);
          border-color: var(--icon-color);
          box-shadow: 0 0 15px var(--icon-color);
        }

        .service-icon {
          color: var(--icon-color);
          transition: all 0.3s ease;
        }

        .service-card:hover .service-icon {
          color: #030712;
        }

        .service-card h3 {
          font-size: 1.35rem;
        }

        .service-card p {
          font-size: 0.95rem;
          color: var(--text-secondary);
          line-height: 1.6;
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
          transition: gap 0.2s ease;
        }

        .service-card:hover .service-link {
          gap: 10px;
          text-decoration: underline;
        }

        @media (max-width: 900px) {
          .hero-section {
            padding: 40px;
            height: auto;
            min-height: 450px;
          }
          .hero-title {
            font-size: 2.25rem;
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
        }
      `}</style>
    </div>
  );
};

export default Home;
