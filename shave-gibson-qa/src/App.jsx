import React, { useState, useEffect } from 'react';

const COLORS = {
  teal900: '#0B4F4B',
  teal700: '#0E6E68',
  teal500: '#188A82',
  teal400: '#5FBBB2',
  teal100: '#EAF4F3',
  ink: '#1B2422',
  muted: '#5B6B69',
  line: '#E2E8E7',
  bg: '#FAFAF9',
};

export default function App() {
  const [page, setPage] = useState('home');

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1) || 'home';
      setPage(hash === 'about' ? 'about' : 'home');
    };
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <div style={{ width: '100%', fontFamily: "'Inter', sans-serif", color: COLORS.ink, background: COLORS.bg, lineHeight: 1.6, margin: 0, padding: 0 }}>
      <Header />
      {page === 'about' ? <AboutPage /> : <HomePage />}
      <Footer />
    </div>
  );
}

function HomePage() {
  return (
    <>
      <Hero />
      <PatternDivider />
      <Journey />
      <Industries />
      <Innovation />
      <PatternDivider />
      <Solutions />
      <Machines />
      <WhyChoose />
      <Certifications />
      <CTA />
    </>
  );
}

function AboutPage() {
  return (
    <>
      <section style={{ position: 'relative', height: '600px', overflow: 'hidden' }}>
        <img src="/sg-facility-current.jpg" alt="Shave & Gibson Facility" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(14,110,104,0.7) 0%, rgba(14,110,104,0.4) 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-end', padding: '60px 40px', maxWidth: 1240, margin: '0 auto' }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#fff', marginBottom: 10, opacity: 0.9 }}>Our Story</div>
          <h1 style={{ fontSize: 'clamp(36px,5vw,56px)', lineHeight: 1.06, textTransform: 'uppercase', fontWeight: 800, letterSpacing: '-0.015em', color: '#fff', maxWidth: 600 }}>Built on <span style={{ color: COLORS.teal400 }}>Excellence</span></h1>
        </div>
      </section>

      <section style={{ padding: '80px 0', background: '#fff' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 40px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 50, alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: COLORS.teal700, marginBottom: 20 }}>Since 1981</div>
              <p style={{ color: COLORS.muted, fontSize: 18, marginBottom: 24, lineHeight: 1.8 }}>Since opening our doors in 1981, Shave & Gibson has grown into one of South Africa's largest and most respected privately-owned manufacturers of folding carton packaging and high-security print solutions.</p>
              <p style={{ color: COLORS.muted, fontSize: 16, lineHeight: 1.8 }}>For over four decades, our award-winning reputation has been built on four simple promises:<br /><br /><strong style={{ color: COLORS.ink }}>✓ Uncompromising quality</strong><br /><strong style={{ color: COLORS.ink }}>✓ Exceptional service</strong><br /><strong style={{ color: COLORS.ink }}>✓ Relentless innovation</strong><br /><strong style={{ color: COLORS.ink }}>✓ Committed to a sustainable future</strong></p>
            </div>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'relative', borderRadius: 20, overflow: 'hidden', boxShadow: `0 40px 80px rgba(11,79,75,0.25)` }}>
                <img src="/sg-facility-historical.jpg" alt="S&G Historical" style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 20 }} />
              </div>
              <div style={{ position: 'absolute', bottom: -30, right: -30, width: 200, height: 200, background: COLORS.teal100, borderRadius: '50%', zIndex: -1 }} />
            </div>
          </div>
        </div>
      </section>

      <PatternDivider />

      <InteractiveTimeline />

      <PatternDivider />

      <section style={{ padding: '80px 0' }}>
        <div style={{ maxWidth: '100%', margin: 0 }}>
          <div style={{ position: 'relative', height: '500px', overflow: 'hidden' }}>
            <img src="/sg-team.jpg" alt="Shave & Gibson Team" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(11,79,75,0.6) 0%, transparent 50%)' }} />
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '60px 40px', maxWidth: 1240, margin: '0 auto', width: '100%' }}>
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.8)', marginBottom: 10 }}>Our People</div>
              <h2 style={{ fontSize: 'clamp(32px,4vw,48px)', fontWeight: 800, letterSpacing: '-0.015em', color: '#fff' }}>Dedicated to <span style={{ color: COLORS.teal400 }}>Excellence</span></h2>
            </div>
          </div>
          <div style={{ background: COLORS.teal700, color: '#fff', padding: '50px 40px', textAlign: 'center' }}>
            <p style={{ fontSize: 18, maxWidth: 800, margin: '0 auto', lineHeight: 1.8 }}>Our team of talented and committed professionals is the heart of everything we do. With decades of combined experience in packaging and security printing, we're driven by a shared commitment to delivering excellence.</p>
          </div>
        </div>
      </section>

      <PatternDivider />

      <section style={{ padding: '80px 0' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 40px' }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: COLORS.teal700, marginBottom: 10 }}>Nationwide Presence</div>
          <h2 style={{ fontSize: 'clamp(26px,2.8vw,36px)', fontWeight: 800, letterSpacing: '-0.015em', marginBottom: 50 }}>Our <span style={{ color: COLORS.teal700 }}>Locations</span></h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'start' }}>
            <div style={{ background: COLORS.teal100, borderRadius: 20, padding: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 400, color: COLORS.teal700, fontSize: 18, fontWeight: 600 }}>
              [Interactive Map Coming Soon]
            </div>
            <div style={{ display: 'grid', gap: 14 }}>
              {[
                { facility: 'Bags manufacturing', location: 'Mobeni, Durban' },
                { facility: 'Cartons manufacturing', location: 'Mobeni, Durban' },
                { facility: 'SG displays manufacturing', location: 'Mobeni, Durban' },
                { facility: 'Sales office & warehouse', location: 'Cape Town' },
                { facility: 'Sales office', location: 'Johannesburg' },
                { facility: 'Security printing division', location: 'Durban' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 12, padding: '14px', borderRadius: 8, background: '#fff', border: `1px solid ${COLORS.line}`, transition: 'all 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.boxShadow = `0 10px 30px rgba(14,110,104,0.15)`; e.currentTarget.style.transform = 'translateY(-2px)'; }} onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                  <div style={{ background: COLORS.teal700, color: '#fff', padding: '14px 16px', borderRadius: 6, fontSize: 13, fontWeight: 700, textAlign: 'center' }}>{item.facility}</div>
                  <div style={{ background: COLORS.ink, color: '#fff', padding: '14px 16px', borderRadius: 6, fontSize: 13, fontWeight: 600, textAlign: 'center' }}>{item.location}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <PatternDivider />

      <section style={{ background: COLORS.teal700, color: '#fff', padding: '100px 0', textAlign: 'center' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 40px' }}>
          <h2 style={{ fontSize: 'clamp(32px,4vw,48px)', marginBottom: 24, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '-0.015em' }}>Let's Build <span style={{ color: COLORS.teal400 }}>Together</span></h2>
          <p style={{ fontSize: 18, marginBottom: 40, opacity: 0.9, lineHeight: 1.8 }}>Whether you're looking for innovative packaging solutions, high-security printing, or reliable partnership, we're ready to exceed your expectations.</p>
          <button style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '16px 32px', fontWeight: 700, fontSize: 14, letterSpacing: '0.03em', textTransform: 'uppercase', borderRadius: 999, background: '#fff', color: COLORS.teal700, border: 'none', cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>Get in Touch Today →</button>
        </div>
      </section>
    </>
  );
}

function Header() {
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 50, background: `rgba(250,250,249,0.95)`, backdropFilter: 'blur(8px)', borderBottom: `1px solid ${COLORS.line}` }}>
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 40px', maxWidth: 1240, margin: '0 auto' }}>
        <a href="#home" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
          <img src="/logo.png" alt="Shave & Gibson" style={{ height: 50, objectFit: 'contain' }} />
        </a>
        <div style={{ display: 'flex', gap: 26, fontSize: '12.5px', fontWeight: 600, letterSpacing: '0.03em', textTransform: 'uppercase', alignItems: 'center' }}>
          <a href="#solutions" style={{ color: COLORS.ink, cursor: 'pointer', textDecoration: 'none' }}>Solutions</a>
          <a href="#industries" style={{ color: COLORS.ink, cursor: 'pointer', textDecoration: 'none' }}>Industries</a>
          <a href="#innovation" style={{ color: COLORS.ink, cursor: 'pointer', textDecoration: 'none' }}>Sustainability</a>
          <a href="#about" style={{ color: COLORS.ink, cursor: 'pointer', textDecoration: 'none' }}>About</a>
          <div style={{ position: 'relative' }} onMouseLeave={() => setContactOpen(false)}>
            <button onMouseEnter={() => setContactOpen(true)} onClick={() => setContactOpen(!contactOpen)} style={{ background: 'none', border: 'none', color: COLORS.ink, fontWeight: 600, cursor: 'pointer', fontSize: '12.5px', textTransform: 'uppercase' }}>Contact ▼</button>
            {contactOpen && (
              <div style={{ position: 'absolute', top: 'calc(100% + 12px)', right: 0, width: 300, background: '#fff', border: `1px solid ${COLORS.line}`, borderRadius: 14, boxShadow: `0 16px 40px rgba(11,79,75,0.18)`, padding: 8, zIndex: 60 }}>
                {[{ label: 'Main Office', email: 'hello@shavegibson.com', sub: 'Durban, South Africa' }, { label: 'Sales', email: 'sales@shavegibson.com' }, { label: 'SG Displays', email: 'displays@shavegibson.com' }].map((c, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: 12, borderRadius: 9, cursor: 'pointer' }} onMouseEnter={(e) => e.currentTarget.style.background = COLORS.teal100} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                    <div style={{ width: 34, height: 34, borderRadius: 8, background: COLORS.teal100, color: COLORS.teal700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>📍</div>
                    <div>
                      <b style={{ display: 'block', fontSize: 13, fontWeight: 700 }}>{c.label}</b>
                      <em style={{ display: 'block', fontSize: '11.5px', fontStyle: 'normal', color: COLORS.teal700, fontWeight: 600, marginTop: 2 }}>{c.email}</em>
                      {c.sub && <small style={{ display: 'block', fontSize: 11, color: COLORS.muted, fontWeight: 400, marginTop: 3 }}>{c.sub}</small>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <button style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 22px', fontWeight: 700, fontSize: 12, letterSpacing: '0.03em', textTransform: 'uppercase', borderRadius: 999, background: COLORS.teal700, color: '#fff', border: 'none', cursor: 'pointer', transition: 'all 0.2s' }}>Get In Touch</button>
      </nav>
    </header>
  );
}

function PatternDivider() {
  return <div style={{ width: '100%', height: 40, backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Crect width='40' height='40' fill='%23ffffff'/%3E%3Cpath d='M0,0 A20,20 0 0,1 20,20 L0,20 Z' fill='%230E6E68'/%3E%3Cpath d='M40,40 A20,20 0 0,1 20,20 L40,20 Z' fill='%235FBBB2'/%3E%3C/svg%3E")`, backgroundRepeat: 'repeat', backgroundSize: '40px 40px' }} />;
}

function Hero() {
  return (
    <section style={{ padding: '70px 0 0' }}>
      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.05fr', gap: 50, alignItems: 'center', paddingBottom: 60 }}>
          <div>
            <h1 style={{ fontSize: 'clamp(28px,3.5vw,40px)', lineHeight: 1.06, textTransform: 'uppercase', fontWeight: 800, letterSpacing: '-0.015em' }}>Engineered<br />to perform.<br /><span style={{ color: COLORS.teal700 }}>Delivered with pride.</span></h1>
            <p style={{ color: COLORS.muted, fontSize: 16, maxWidth: 440, margin: '20px 0 30px', lineHeight: 1.6 }}>From concept and design to manufacturing, security printing and sustainable innovation — we help brands package a better future.</p>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              <button style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 26px', fontWeight: 700, fontSize: 13, letterSpacing: '0.03em', textTransform: 'uppercase', borderRadius: 999, background: COLORS.teal700, color: '#fff', border: 'none', cursor: 'pointer', transition: 'all 0.2s' }}>Start Your Journey →</button>
              <button style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 26px', fontWeight: 700, fontSize: 13, letterSpacing: '0.03em', textTransform: 'uppercase', borderRadius: 999, border: `1.5px solid ${COLORS.ink}`, color: COLORS.ink, background: 'none', cursor: 'pointer', transition: 'all 0.2s' }}>Explore Our Solutions</button>
            </div>
          </div>
          <div style={{ position: 'relative', background: COLORS.teal100, aspectRatio: '1 / 0.85', borderRadius: 20, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 30px 60px -20px rgba(11,79,75,0.35), 0 10px 24px rgba(11,79,75,0.14)`, minHeight: 400 }}>
            <img src="/sg-hero-product.jpg" alt="S&G Products" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          </div>
        </div>
      </div>
    </section>
  );
}

function Journey() {
  const steps = [
    { name: 'Idea', icon: '<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.4.3.5.7.5 1.1V16h6v-1c0-.4.1-.8.5-1.1A6 6 0 0 0 12 3Z"/>' },
    { name: 'Design & CAD', icon: '<path d="M4 20l1-4L16 5l3 3L8 19l-4 1Z"/><path d="M14 7l3 3"/>' },
    { name: 'Prototype', icon: '<path d="M12 3 3 8l9 5 9-5-9-5Z"/><path d="M3 8v8l9 5 9-5V8"/><path d="M12 13v8"/>' },
    { name: 'Testing', icon: '<path d="M10 2v6.3c0 .5-.15 1-.44 1.4L4.6 17.4A2.5 2.5 0 0 0 6.6 21h10.8a2.5 2.5 0 0 0 2-4L14.4 9.7A2.4 2.4 0 0 1 14 8.3V2"/><path d="M8.5 2h7"/><path d="M7.5 14h9"/>' },
    { name: 'Manufacture', icon: '<path d="M3 21V10l5 3.5V10l5 3.5V10l5 3.5V21H3Z"/><path d="M3 21h18"/><path d="M7 21v-4M12 21v-4M17 21v-4"/>' },
    { name: 'Quality', icon: '<path d="M12 3 5 6v5c0 4.5 3 8 7 10 4-2 7-5.5 7-10V6l-7-3Z"/><path d="m9 12 2 2 4-4"/>' },
    { name: 'Distribution', icon: '<path d="M3 7h11v10H3z"/><path d="M14 10h4l3 3v4h-7z"/><circle cx="7" cy="18.5" r="1.6"/><circle cx="17.5" cy="18.5" r="1.6"/>' },
    { name: 'Retail Shelf', icon: '<path d="M4 4h16v4H4z"/><path d="M4 12h16v4H4z"/><path d="M4 4v16M20 4v16"/>' },
  ];

  return (
    <section style={{ background: COLORS.teal700, color: '#fff', padding: '40px 0' }}>
      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 30 }}>
          <div style={{ minWidth: 200, flexShrink: 0 }}>
            <span style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.65)', fontWeight: 700 }}>The Journey</span>
            <h3 style={{ fontSize: 22, marginTop: 6, fontWeight: 700 }}>From idea to shelf.</h3>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, overflowX: 'auto', padding: '4px 0', flex: 1 }}>
            {steps.map((step, i) => (
              <React.Fragment key={i}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, minWidth: 80, flexShrink: 0 }}>
                  <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(255,255,255,0.12)', border: '1.5px solid rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" dangerouslySetInnerHTML={{ __html: step.icon }} />
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.75)', whiteSpace: 'nowrap', textAlign: 'center' }}>{step.name}</span>
                </div>
                {i < steps.length - 1 && <span style={{ fontSize: 16, margin: '0 -4px', flexShrink: 0, color: 'rgba(255,255,255,0.5)' }}>→</span>}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Industries() {
  const industries = [
    { name: 'Food', desc: 'Fresh & convenient. Packaging that keeps food safe and tasty.', img: 'ind_food.jpg', icon: '<circle cx="8" cy="12" r="6"/><path d="M16 5v6M19 5v6M17.5 5v6M16 11v8M19 11v3a2 2 0 0 1-2 2h0"/>' },
    { name: 'Beverage', desc: 'Premium protection. Designed to elevate every drink.', img: 'ind_beverage.jpg', icon: '<path d="M8 2h8l-1 6a3 3 0 0 1-3 2.5 3 3 0 0 1-3-2.5L8 2Z"/><path d="M12 10.5V22M8 22h8"/>' },
    { name: 'Beauty', desc: 'Beautifully crafted packaging that reflects the quality within.', img: 'ind_beauty.jpg', icon: '<path d="M9 3h6l1 3H8l1-3Z"/><path d="M8 6h8l-1 12a3 3 0 0 1-3 3 3 3 0 0 1-3-3L8 6Z"/><path d="M9 11h6"/>' },
    { name: 'Pharmaceutical', desc: 'Safe. Secure. Compliant. Packaging that protects lives.', img: 'ind_pharma.jpg', icon: '<rect x="3" y="9" width="18" height="6" rx="3" transform="rotate(-45 12 12)"/><path d="M9.5 9.5l5 5"/>' },
    { name: 'Retail', desc: 'Stand out on shelf. Packaging that builds brand love.', img: 'ind_retail.jpg', icon: '<path d="M6 8h12l-1 12a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L6 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>' },
    { name: 'QSR', desc: 'Fast. Functional. Reliable packaging for every order.', img: 'ind_qsr.jpg', icon: '<path d="M4 10a8 8 0 0 1 16 0Z"/><path d="M3 10h18M4 14h16"/><path d="M5 14a1 1 0 0 0-1 1 2 2 0 0 0 2 2h12a2 2 0 0 0 2-2 1 1 0 0 0-1-1"/>' },
    { name: 'Agriculture', desc: 'From farm to market. Sustainable packaging for a growing world.', img: 'ind_agri.jpg', icon: '<path d="M12 21c-4-1-7-4.5-7-9 2 0 3.5.6 4.6 1.7C11 15 12 17 12 21Z"/><path d="M12 21c4-1 7-4.5 7-9-2 0-3.5.6-4.6 1.7C13 15 12 17 12 21Z"/><path d="M12 12V3"/>' },
    { name: 'Industrial', desc: 'Strong. Durable. Reliable. Built to protect what powers industries.', img: 'ind_industrial.jpg', icon: '<path d="M4 20V9l5 3.5V9l5 3.5V9l5 3.5V20H4Z"/><circle cx="12" cy="15" r="1.4"/>' },
  ];

  return (
    <section style={{ padding: '90px 0' }} id="industries">
      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 40px' }}>
        <div style={{ marginBottom: 44 }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: COLORS.teal700, marginBottom: 10 }}>Our Solutions</div>
          <h2 style={{ fontSize: 'clamp(26px,2.8vw,36px)', fontWeight: 800, letterSpacing: '-0.015em' }}>Tailored packaging<br />for every <span style={{ color: COLORS.teal700 }}>industry.</span></h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 24 }}>
          {industries.map((ind, i) => (
            <div key={i} style={{ background: '#fff', border: `1px solid ${COLORS.line}`, borderRadius: 8, overflow: 'hidden', cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)'} onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}>
              <img src={`/${ind.img}`} alt={ind.name} style={{ width: '100%', height: 200, objectFit: 'cover' }} />
              <div style={{ padding: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={COLORS.teal700} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" dangerouslySetInnerHTML={{ __html: ind.icon }} />
                  <h3 style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.015em', margin: 0 }}>{ind.name}</h3>
                </div>
                <p style={{ fontSize: 14, color: COLORS.muted, lineHeight: 1.6, margin: 0 }}>{ind.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Innovation() {
  const stats = [
    { num: '1', title: 'Structural Design', desc: 'Smart, functional design that performs.', icon: '<path d="M12 2 21 7v10l-9 5-9-5V7l9-5Z"/><path d="M3 7l9 5 9-5"/><path d="M12 12v9"/>' },
    { num: '2', title: 'Rapid Prototyping', desc: 'From concept to prototype in record time.', icon: '<path d="M12 2 21 7v10l-9 5-9-5V7l9-5Z"/><path d="M3 7l9 5 9-5"/><path d="M12 12v9"/><path d="M12 2v10"/>' },
    { num: '3', title: 'Material Development', desc: 'Sustainable, high-performance materials.', icon: '<path d="M12 3 21 8l-9 5-9-5 9-5Z"/><path d="M3 12l9 5 9-5"/><path d="M3 16l9 5 9-5"/>' },
    { num: '4', title: 'Packaging Testing', desc: 'Rigorous testing to global standards.', icon: '<rect x="5" y="4" width="14" height="17" rx="2"/><rect x="9" y="2.5" width="6" height="3" rx="1"/><path d="M8.2 11.5l1.4 1.4L12.4 10"/><path d="M8.2 15.8h7.6"/>' },
    { num: '5', title: 'Design Optimisation', desc: 'Smarter design. Lower cost.', icon: '<line x1="4" y1="6" x2="20" y2="6"/><circle cx="9" cy="6" r="2"/><line x1="4" y1="12" x2="20" y2="12"/><circle cx="15" cy="12" r="2"/><line x1="4" y1="18" x2="20" y2="18"/><circle cx="11" cy="18" r="2"/>' },
    { num: '6', title: 'Sustainability', desc: 'Better materials. Lower impact.', icon: '<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>' },
  ];

  return (
    <section style={{ padding: '50px 0', background: COLORS.teal100 }} id="innovation">
      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 50, alignItems: 'start' }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: COLORS.teal700, marginBottom: 10 }}>Innovation Centre</div>
            <h2 style={{ fontSize: 'clamp(24px,2.8vw,32px)', marginBottom: 24, fontWeight: 800, letterSpacing: '-0.015em' }}>Innovation starts long before production.</h2>
            <p style={{ color: COLORS.muted, fontSize: 16, marginBottom: 32, lineHeight: 1.6 }}>Our Innovation Centre combines creativity, engineering and technology to develop smarter packaging solutions.</p>
            <button style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 26px', fontWeight: 700, fontSize: 13, letterSpacing: '0.03em', textTransform: 'uppercase', borderRadius: 999, background: COLORS.teal700, color: '#fff', border: 'none', cursor: 'pointer' }}>Explore Innovation Centre →</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24 }}>
            {stats.map((card, i) => (
              <div key={i} style={{ background: '#fff', borderRadius: 8, padding: 24, border: `1px solid ${COLORS.line}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 6, background: COLORS.teal700, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 18, flexShrink: 0 }}>{card.num}</div>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={COLORS.teal700} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" dangerouslySetInnerHTML={{ __html: card.icon }} />
                </div>
                <div style={{ borderTop: `2px solid ${COLORS.teal700}`, marginBottom: 16, paddingTop: 16 }}></div>
                <h4 style={{ fontSize: 14, fontWeight: 800, marginBottom: 8, color: COLORS.ink, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{card.title}</h4>
                <p style={{ fontSize: 13, color: COLORS.muted, lineHeight: 1.6, margin: 0 }}>{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Solutions() {
  const pillars = [
    { title: 'Sustainability', desc: 'We are redefining a sustainable offering for consistency and lasting value, delivered through high-quality sustainable materials and a commitment to fair, stable pricing for the long term.', icon: '<path d="M5 21c0-9 5-16 14-16 0 9-5 16-14 16Z"/><path d="M5 21c3-4 7-7 11-9"/>' },
    { title: 'Innovation', desc: 'We push boundaries. Our innovation centre and in-house design team constantly explore smarter, faster, greener ways to package products and safeguard brands.', icon: '<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.4.3.5.7.5 1.1V16h6v-1c0-.4.1-.8.5-1.1A6 6 0 0 0 12 3Z"/>' },
    { title: 'Quality', desc: 'We demand the best because our customers deserve the best. Every product we deliver meets the highest standards for performance, durability, and presentation.', icon: '<path d="M12 3 5 6v5c0 4.5 3 8 7 10 4-2 7-5.5 7-10V6l-7-3Z"/><path d="m9 12 2 2 4-4"/>' },
    { title: 'Service Delivery', desc: 'We pride ourselves on delivering on time in full, every time — with the flexibility to adapt to your business needs. Our customer-first mindset ensures fast, flexible, dependable service on every job.', icon: '<path d="M3 7h11v10H3z"/><path d="M14 10h4l3 3v4h-7z"/><circle cx="7" cy="18.5" r="1.6"/><circle cx="17.5" cy="18.5" r="1.6"/>' },
  ];

  return (
    <section style={{ padding: '90px 0' }} id="solutions">
      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 40px' }}>
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: COLORS.teal700, marginBottom: 10 }}>What Drives Us</div>
          <h2 style={{ fontSize: 'clamp(26px,2.8vw,36px)', fontWeight: 800, letterSpacing: '-0.015em' }}>Our key<br /><span style={{ color: COLORS.teal700 }}>pillars.</span></h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
          {pillars.map((pillar, i) => (
            <div key={i} style={{ background: '#fff', border: `1px solid ${COLORS.line}`, borderRadius: 8, padding: 24 }}>
              <div style={{ width: 40, height: 40, borderRadius: 8, background: COLORS.teal100, display: 'flex', alignItems: 'center', justifyContent: 'center', color: COLORS.teal700, marginBottom: 16 }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" dangerouslySetInnerHTML={{ __html: pillar.icon }} />
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 8, letterSpacing: '-0.015em', color: COLORS.ink }}>{pillar.title}</h3>
              <p style={{ fontSize: 14, color: COLORS.muted, lineHeight: 1.6, margin: 0 }}>{pillar.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Machines() {
  return (
    <section style={{ padding: '60px 40px 80px' }}>
      <div style={{ maxWidth: 1240, margin: '0 auto' }}>
        <div style={{ marginBottom: 44 }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: COLORS.teal700, marginBottom: 10 }}>Behind The Scenes</div>
          <h2 style={{ fontSize: 'clamp(26px,2.8vw,36px)', fontWeight: 800, letterSpacing: '-0.015em' }}>See our machines<br /><span style={{ color: COLORS.teal700 }}>in action.</span></h2>
        </div>
        <div style={{ background: COLORS.teal100, height: 300, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 80 }}>⚙️</div>
      </div>
    </section>
  );
}

function WhyChoose() {
  return (
    <section style={{ background: COLORS.ink, color: '#fff', padding: '80px 0' }}>
      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 40px' }}>
        <h2 style={{ color: '#fff', marginBottom: 48, fontSize: 'clamp(28px,3.2vw,40px)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '-0.015em' }}>Why choose <span style={{ color: COLORS.teal400 }}>Shave & Gibson?</span></h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 32 }}>
          {[{ title: 'Quality Assured', desc: 'Certified to the highest standards.' }, { title: 'Proven Track Record', desc: '20+ years serving major brands.' }, { title: 'Innovation First', desc: 'Cutting-edge technology and design.' }, { title: 'Sustainable', desc: 'Eco-friendly materials and processes.' }].map((item, i) => (
            <div key={i} style={{ padding: 16 }}>
              <div style={{ fontSize: 24, marginBottom: 12 }}>✓</div>
              <b style={{ fontSize: 14, fontWeight: 700 }}>{item.title}</b>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', marginTop: 6, lineHeight: 1.6 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Certifications() {
  return (
    <section style={{ padding: '90px 0' }} id="certifications">
      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 40px' }}>
        <div style={{ marginBottom: 44 }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: COLORS.teal700, marginBottom: 10 }}>Quality & Compliance</div>
          <h2 style={{ fontSize: 'clamp(26px,2.8vw,36px)', fontWeight: 800, letterSpacing: '-0.015em' }}>Certified. Trusted. <span style={{ color: COLORS.teal700 }}>Proven.</span></h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24 }}>
          {[{ title: 'ISO 9001:2015', subtitle: 'Quality Management System' }, { title: 'ISO 14001', subtitle: 'Environmental Management' }, { title: 'Print Secure®', subtitle: 'High-security printing' }, { title: 'FSC Certified', subtitle: 'Responsible forestry' }].map((cert, i) => (
            <div key={i} style={{ background: '#fff', border: `1px solid ${COLORS.line}`, borderRadius: 8, padding: 24, textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)'} onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}>
              <div style={{ fontSize: 24, marginBottom: 12 }}>✓</div>
              <b style={{ fontSize: 14, fontWeight: 700, display: 'block' }}>{cert.title}</b>
              <small style={{ fontSize: 12, color: COLORS.muted, display: 'block', marginTop: 4, lineHeight: 1.6 }}>{cert.subtitle}</small>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section style={{ background: COLORS.teal700, color: '#fff', padding: '80px 0' }}>
      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 40px' }}>
        <h2 style={{ color: '#fff', marginBottom: 24, textAlign: 'center', fontSize: 'clamp(28px,3.2vw,40px)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '-0.015em' }}>Let's build better packaging together.</h2>
        <p style={{ textAlign: 'center', fontSize: 16, marginBottom: 32, opacity: 0.9, lineHeight: 1.6 }}>Get in touch with our team to discuss your next project.</p>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 26px', fontWeight: 700, fontSize: 13, letterSpacing: '0.03em', textTransform: 'uppercase', borderRadius: 999, border: '1.5px solid rgba(255,255,255,0.7)', color: '#fff', background: 'none', cursor: 'pointer' }}>Get in Touch</button>
          <button style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 26px', fontWeight: 700, fontSize: 13, letterSpacing: '0.03em', textTransform: 'uppercase', borderRadius: 999, background: '#fff', color: COLORS.teal700, border: 'none', cursor: 'pointer' }}>Request Quote</button>
        </div>
      </div>
    </section>
  );
}

function InteractiveTimeline() {
  const [active, setActive] = useState(0);

  const events = [
    { year: '1981', title: 'The Beginning', desc: 'Alan Gibson and Neville Shave purchase Group Print & Packaging' },
    { year: '1995', title: 'Strategic Leap', desc: 'Acquisition of Stradprint & Security Printing Division' },
    { year: '2005', title: 'New Era', desc: 'Acquired by Chairman Simon Downes for expansion' },
  ];

  return (
    <section style={{ padding: '60px 0', background: COLORS.teal100 }}>
      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 40px' }}>
        <div style={{ marginBottom: 40 }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: COLORS.teal700, marginBottom: 10 }}>Our Growth</div>
          <h2 style={{ fontSize: 'clamp(24px,2.5vw,32px)', fontWeight: 800, letterSpacing: '-0.015em' }}>From humble beginnings to <span style={{ color: COLORS.teal700 }}>industry leader</span></h2>
        </div>

        <div style={{ position: 'relative', padding: '40px 0' }}>
          {/* Timeline line */}
          <div style={{ position: 'absolute', top: '40px', left: '60px', right: '60px', height: '3px', background: COLORS.teal400, zIndex: 0 }} />

          {/* Timeline dots and events */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 30, position: 'relative', zIndex: 1 }}>
            {events.map((event, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                {/* Clickable dot */}
                <div
                  onClick={() => setActive(i)}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    background: active === i ? COLORS.teal700 : '#fff',
                    border: `3px solid ${COLORS.teal700}`,
                    margin: '0 auto 24px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    transform: active === i ? 'scale(1.3)' : 'scale(1)',
                  }}
                  onMouseEnter={(e) => {
                    if (active !== i) {
                      e.currentTarget.style.transform = 'scale(1.15)';
                      e.currentTarget.style.background = COLORS.teal400;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (active !== i) {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.background = '#fff';
                    }
                  }}
                />

                {/* Year label */}
                <div style={{ fontSize: 24, fontWeight: 800, color: COLORS.teal700, marginBottom: 8 }}>{event.year}</div>

                {/* Expandable content */}
                <div
                  style={{
                    maxHeight: active === i ? '200px' : '0px',
                    overflow: 'hidden',
                    transition: 'max-height 0.3s ease',
                  }}
                >
                  <h3 style={{ fontSize: 16, fontWeight: 800, color: COLORS.ink, marginBottom: 8 }}>{event.title}</h3>
                  <p style={{ fontSize: 13, color: COLORS.muted, lineHeight: 1.6 }}>{event.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer style={{ background: COLORS.ink, color: '#fff', paddingTop: 60, paddingBottom: 40 }}>
      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 40, marginBottom: 32 }}>
          <div>
            <h4 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>Solutions</h4>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li><a href="#" style={{ color: '#fff', fontSize: 13, lineHeight: 1.8, opacity: 0.75, cursor: 'pointer', textDecoration: 'none' }}>Folding Cartons</a></li>
              <li><a href="#" style={{ color: '#fff', fontSize: 13, lineHeight: 1.8, opacity: 0.75, cursor: 'pointer', textDecoration: 'none' }}>SG Displays</a></li>
              <li><a href="#" style={{ color: '#fff', fontSize: 13, lineHeight: 1.8, opacity: 0.75, cursor: 'pointer', textDecoration: 'none' }}>Security Printing</a></li>
            </ul>
          </div>
          <div>
            <h4 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>Company</h4>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li><a href="#" style={{ color: '#fff', fontSize: 13, lineHeight: 1.8, opacity: 0.75, cursor: 'pointer', textDecoration: 'none' }}>About</a></li>
              <li><a href="#" style={{ color: '#fff', fontSize: 13, lineHeight: 1.8, opacity: 0.75, cursor: 'pointer', textDecoration: 'none' }}>Innovation</a></li>
              <li><a href="#" style={{ color: '#fff', fontSize: 13, lineHeight: 1.8, opacity: 0.75, cursor: 'pointer', textDecoration: 'none' }}>Sustainability</a></li>
            </ul>
          </div>
          <div>
            <h4 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>Contact</h4>
            <p style={{ fontSize: 13, lineHeight: 1.8 }}>
              <a href="mailto:hello@shavegibson.com" style={{ color: '#fff', opacity: 0.75, cursor: 'pointer', textDecoration: 'none' }}>hello@shavegibson.com</a><br />
              <a href="tel:+27661234567" style={{ color: '#fff', opacity: 0.75, cursor: 'pointer', textDecoration: 'none' }}>+27 (66) 123-4567</a>
            </p>
          </div>
        </div>
        <div style={{ borderTop: `1px solid ${COLORS.line}`, paddingTop: 24, marginTop: 32, textAlign: 'center', fontSize: 12, color: COLORS.muted }}>
          © 2024 Shave & Gibson. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
