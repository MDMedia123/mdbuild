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
      setPage(hash === 'about' ? 'about' : hash === 'solutions' ? 'solutions' : hash === 'why-sg' ? 'why-sg' : 'home');
    };
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <div style={{ width: '100%', fontFamily: "'Inter', sans-serif", color: COLORS.ink, background: COLORS.bg, lineHeight: 1.6, margin: 0, padding: 0 }}>
      <Header />
      {page === 'about' ? <AboutPage /> : page === 'solutions' ? <SolutionsPage /> : page === 'why-sg' ? <WhySGPage /> : <HomePage />}
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
      <Innovation />
      <PatternDivider />
      <Machines />
      <WhyChoose />
      <Certifications />
      <CTA />
    </>
  );
}

function SolutionsPage() {
  const products = [
    {
      title: 'Folding Cartons',
      desc: 'Sophisticated, high-quality folding carton solutions for premium packaging across food, beverage, beauty, and luxury goods.',
      icon: '📦',
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=85&fit=crop&crop=entropy',
      color: COLORS.teal700,
      iconBg: COLORS.teal700,
    },
    {
      title: 'Paper Bag Manufacture',
      desc: 'Eco-friendly paper bags and carrier bags with custom printing for retail and hospitality applications.',
      icon: '🛍️',
      image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=600&q=85&fit=crop&crop=entropy',
      color: '#FF9500',
      iconBg: '#FF9500',
    },
    {
      title: 'Point of Sale',
      desc: 'Eye-catching point of sale displays, counter units, and promotional materials that drive retail engagement.',
      icon: '🏪',
      image: 'https://images.unsplash.com/photo-1555611533-eea19becfd09?w=600&q=85&fit=crop&crop=entropy',
      color: '#6B5B95',
      iconBg: '#6B5B95',
    },
  ];

  const features = [
    { icon: '💡', title: 'End-to-end expertise', desc: 'From design to delivery, we have got you covered.' },
    { icon: '🌱', title: 'Sustainable by design', desc: 'Innovative solutions that reduce impact.' },
    { icon: '✓', title: 'Quality you can trust', desc: 'Uncompromising standards. Consistent results.' },
    { icon: '🚚', title: 'Reliable delivery', desc: 'On time, every time. Across Southern Africa.' },
  ];

  return (
    <>
      <section style={{ padding: '80px 40px', background: '#fff' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', textAlign: 'center', marginBottom: 60 }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: COLORS.teal700, marginBottom: 16 }}>Our Best Offering</div>
          <h1 style={{ fontSize: 'clamp(36px,4.5vw,52px)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 20, lineHeight: 1.1 }}>Our packaging <span style={{ color: COLORS.teal700 }}>solutions</span></h1>
          <p style={{ fontSize: 16, color: COLORS.muted, maxWidth: 700, margin: '0 auto', lineHeight: 1.8 }}>From concept to shelf, we deliver comprehensive packaging and printing solutions tailored to your brand's unique needs.</p>
        </div>

        {/* Premium Product Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 28, maxWidth: 1240, margin: '0 auto' }}>
          {[
            { title: 'Folding Cartons', desc: 'Sophisticated, high-quality folding carton solutions for premium packaging across food, beverage, beauty, and luxury goods.', icon: '📦', image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&q=85&fit=crop&crop=entropy', bgColor: '#1a3a38', textColor: COLORS.teal400 },
            { title: 'Paper Bag Manufacture', desc: 'Eco-friendly paper bags and carrier bags with custom printing for retail and hospitality applications.', icon: '🛍️', image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b3f4?w=600&q=85&fit=crop&crop=entropy', bgColor: '#2a2416', textColor: '#FF9500' },
            { title: 'Point of Sale', desc: 'Eye-catching point of sale displays, counter units, and promotional materials that drive retail engagement.', icon: '🏪', image: 'https://images.unsplash.com/photo-1441986300352-c5ecb3172e4d?w=600&q=85&fit=crop&crop=entropy', bgColor: '#1a1f2e', textColor: '#9B7DD4' },
          ].map((product, i) => (
            <div key={i} style={{ borderRadius: 20, overflow: 'hidden', background: product.bgColor, transition: 'all 0.4s ease', cursor: 'pointer', display: 'flex', flexDirection: 'column', height: '100%', minHeight: 600, boxShadow: '0 10px 40px rgba(0,0,0,0.3)' }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-12px)'; e.currentTarget.style.boxShadow = '0 40px 100px rgba(0,0,0,0.4)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 40px rgba(0,0,0,0.3)'; }}>
              {/* Premium Image */}
              <div style={{ width: '100%', height: 400, overflow: 'hidden', position: 'relative' }}>
                <img src={product.image} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              </div>

              {/* Premium Content */}
              <div style={{ padding: 40, display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                {/* Icon and Title */}
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 28, marginBottom: 16 }}>{product.icon}</div>
                  <h3 style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.015em', margin: 0, color: '#fff', lineHeight: 1.2 }}>{product.title}</h3>
                </div>

                {/* Description */}
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.85)', lineHeight: 1.8, marginBottom: 28, margin: 0 }}>{product.desc}</p>

                {/* CTA */}
                <a href="#solutions" style={{ fontSize: 12, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: product.textColor, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, cursor: 'pointer', transition: 'all 0.3s ease' }} onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.8'; }} onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}>EXPLORE SOLUTIONS →</a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '60px 40px', background: '#fff' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 40 }}>
            {features.map((feature, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>{feature.icon}</div>
                <h4 style={{ fontSize: 16, fontWeight: 800, letterSpacing: '-0.015em', marginBottom: 8, color: COLORS.ink }}>{feature.title}</h4>
                <p style={{ fontSize: 13, color: COLORS.muted, lineHeight: 1.6, margin: 0 }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function WhySGPage() {
  return (
    <>
      <Solutions />
    </>
  );
}

function AboutPage() {
  const [heroIndex, setHeroIndex] = useState(0);

  const heroSlides = [
    { kicker: 'SINCE 1981', title: 'Built on Excellence', desc: 'For over four decades, we\'ve been trusted by leading brands to deliver packaging and printing solutions that make an impact.', cta: 'OUR STORY', image: '/sg-facility-current.jpg' },
    { kicker: 'Our Facilities', title: 'State of the Art', desc: 'Modern manufacturing facilities equipped with cutting-edge technology and staffed by experienced professionals.', cta: 'EXPLORE', image: '/sg-facility-current.jpg' },
    { kicker: 'Our People', title: 'Driven by Passion', desc: 'A talented team committed to excellence, innovation, and creating lasting value for every customer.', cta: 'LEARN MORE', image: '/sg-team.jpg' },
    { kicker: 'Our Promise', title: 'Quality Assured', desc: 'Uncompromising standards across every process, every product, every delivery, every single day.', cta: 'DISCOVER', image: '/sg-facility-current.jpg' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroIndex((prevIndex) => (prevIndex + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroSlides.length]);

  const currentSlide = heroSlides[heroIndex];

  return (
    <>
      <section style={{ position: 'relative', height: '500px', overflow: 'hidden', background: '#1a1a1a' }}>
        {/* Background Image with fade transition */}
        <img src={currentSlide.image} alt={currentSlide.title} style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', opacity: 0.4, transition: 'opacity 0.8s ease-in-out' }} />

        {/* Dark Overlay */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(26,26,26,0.95) 0%, rgba(26,26,26,0.7) 50%, rgba(26,26,26,0.3) 100%)' }} />

        {/* Content Grid */}
        <div style={{ position: 'absolute', inset: 0, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, maxWidth: 1400, margin: '0 auto', padding: '0 60px', alignItems: 'center' }}>
          {/* Left Content with fade transition */}
          <div style={{ color: '#fff', zIndex: 10, transition: 'opacity 0.6s ease-in-out', opacity: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: COLORS.teal400, marginBottom: 12 }}>{currentSlide.kicker}</div>
            <h1 style={{ fontSize: 'clamp(36px,4.5vw,52px)', fontWeight: 900, letterSpacing: '-0.02em', marginBottom: 16, lineHeight: 1.1 }}>
              {currentSlide.title.split(' ').map((word, i) => (
                i === currentSlide.title.split(' ').length - 1 ?
                <span key={i} style={{ color: COLORS.teal400 }}>{word}</span> :
                <span key={i}>{word} </span>
              ))}
            </h1>
            <p style={{ fontSize: 15, lineHeight: 1.7, marginBottom: 28, opacity: 0.9, maxWidth: 450 }}>{currentSlide.desc}</p>
            <button style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '12px 28px', background: COLORS.teal700, color: '#fff', border: 'none', fontSize: 13, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', cursor: 'pointer', borderRadius: 6, transition: 'all 0.3s' }} onMouseEnter={(e) => { e.currentTarget.style.background = COLORS.teal400; }} onMouseLeave={(e) => { e.currentTarget.style.background = COLORS.teal700; }}>
              {currentSlide.cta} →
            </button>
          </div>

          {/* Right Image with fade transition */}
          <div style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 5, transition: 'opacity 0.8s ease-in-out', opacity: 1 }}>
            <img src={currentSlide.image} alt={currentSlide.title} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8, boxShadow: '0 40px 80px rgba(0,0,0,0.4)', transition: 'opacity 0.8s ease-in-out' }} />
          </div>
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

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 60, alignItems: 'center' }}>
            {/* Map Section */}
            <div style={{ background: COLORS.teal100, borderRadius: 20, padding: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 450, position: 'relative', overflow: 'hidden' }}>
              <svg viewBox="0 0 500 600" style={{ width: '100%', height: '100%', maxWidth: '100%' }}>
                {/* South Africa Map Simplified */}
                <path d="M 50 100 L 120 80 L 150 90 L 160 120 L 180 140 L 200 130 L 220 150 L 240 140 L 250 170 L 260 200 L 270 220 L 280 210 L 290 230 L 300 240 L 310 250 L 320 270 L 330 280 L 340 290 L 350 300 L 360 310 L 370 330 L 380 350 L 390 370 L 400 390 L 410 410 L 420 430 L 430 450 L 440 470 L 450 490 L 460 510 L 450 520 L 440 530 L 430 540 L 400 550 L 350 560 L 300 565 L 250 568 L 200 570 L 150 568 L 100 560 L 80 540 L 70 510 L 60 480 L 50 450 L 45 400 L 40 350 L 38 300 L 40 250 L 45 200 L 50 150 L 50 100 Z" fill={COLORS.teal100} stroke={COLORS.teal700} strokeWidth="2"/>

                {/* Location Markers */}
                {/* Cape Town */}
                <circle cx="80" cy="520" r="12" fill={COLORS.teal700}/>
                <text x="80" y="560" textAnchor="middle" fontSize="14" fontWeight="700" fill={COLORS.ink}>Cape Town</text>

                {/* Durban */}
                <circle cx="320" cy="340" r="12" fill={COLORS.teal700}/>
                <text x="320" y="385" textAnchor="middle" fontSize="14" fontWeight="700" fill={COLORS.ink}>Durban Port</text>

                {/* Johannesburg */}
                <circle cx="200" cy="240" r="12" fill={COLORS.teal700}/>
                <text x="200" y="225" textAnchor="middle" fontSize="14" fontWeight="700" fill={COLORS.ink}>Johannesburg</text>

                {/* S&G Logo positions */}
                <text x="80" y="490" textAnchor="middle" fontSize="24" fill={COLORS.teal700} fontWeight="800">S&G</text>
                <text x="320" y="360" textAnchor="middle" fontSize="24" fill={COLORS.teal700} fontWeight="800">S&G</text>
                <text x="200" y="270" textAnchor="middle" fontSize="24" fill={COLORS.teal700} fontWeight="800">S&G</text>
              </svg>
            </div>

            {/* Facilities List */}
            <div style={{ display: 'grid', gap: 12 }}>
              {[
                { facility: 'Bags manufacturing', location: 'Mobeni, Durban', region: 'durban' },
                { facility: 'Cartons manufacturing', location: 'Mobeni, Durban', region: 'durban' },
                { facility: 'SG displays manufacturing', location: 'Mobeni, Durban', region: 'durban' },
                { facility: 'Sales office & warehouse', location: 'Cape Town', region: 'capetown' },
                { facility: 'Sales office', location: 'Johannesburg', region: 'jhb' },
                { facility: 'Security printing division', location: 'Durban', region: 'durban' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, padding: '12px 16px', borderRadius: 8, background: '#fff', border: `1px solid ${COLORS.line}`, transition: 'all 0.2s', cursor: 'pointer' }} onMouseEnter={(e) => { e.currentTarget.style.boxShadow = `0 8px 24px rgba(14,110,104,0.2)`; e.currentTarget.style.transform = 'translateY(-2px)'; }} onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                  <div style={{ background: COLORS.teal700, color: '#fff', padding: '12px 14px', borderRadius: 6, fontSize: 13, fontWeight: 700, textAlign: 'center' }}>{item.facility}</div>
                  <div style={{ background: COLORS.ink, color: '#fff', padding: '12px 14px', borderRadius: 6, fontSize: 13, fontWeight: 600, textAlign: 'center' }}>{item.location}</div>
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
          <a href="#why-sg" style={{ color: COLORS.ink, cursor: 'pointer', textDecoration: 'none' }}>Why S&G</a>
          <a href="#innovation" style={{ color: COLORS.ink, cursor: 'pointer', textDecoration: 'none' }}>Sustainability</a>
          <a href="#about" style={{ color: COLORS.ink, cursor: 'pointer', textDecoration: 'none' }}>Our Story</a>
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

function OurStory() {
  return (
    <section style={{ background: COLORS.teal700, color: '#fff', padding: '80px 0', cursor: 'pointer', transition: 'all 0.3s' }} onClick={() => window.location.hash = 'about'} onMouseEnter={(e) => e.currentTarget.style.opacity = 0.9} onMouseLeave={(e) => e.currentTarget.style.opacity = 1}>
      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 40px' }}>
        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.8)', marginBottom: 16 }}>Learn More</div>
        <h2 style={{ fontSize: 'clamp(32px,4vw,48px)', fontWeight: 800, letterSpacing: '-0.015em', marginBottom: 24, lineHeight: 1.2 }}>Our Story</h2>
        <p style={{ fontSize: 18, maxWidth: 600, lineHeight: 1.8, opacity: 0.95 }}>From the very beginning, our business has revolved around customer satisfaction, innovation, production quality, and a commitment to continuous technological advancement.</p>
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
  const [selectedDivision, setSelectedDivision] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState(null);

  const divisions = [
    { id: 'cartons', name: 'Folding Cartons', icon: '📦' },
    { id: 'bags', name: 'Paper Bag Manufacture', icon: '🛍️' },
    { id: 'displays', name: 'SG Displays', icon: '🎯' },
    { id: 'printing', name: 'Security Printing', icon: '🔐' },
  ];

  const regions = [
    { id: 'durban', name: 'Durban', facilities: 'Manufacturing Hub - All Divisions', email: 'durban@shavegibson.com', phone: '+27 (31) 000-0000' },
    { id: 'capetown', name: 'Cape Town', facilities: 'Sales Office & Warehouse', email: 'capetown@shavegibson.com', phone: '+27 (21) 000-0000' },
    { id: 'jhb', name: 'Johannesburg', facilities: 'Sales Office', email: 'jhb@shavegibson.com', phone: '+27 (11) 000-0000' },
  ];

  return (
    <section style={{ background: COLORS.teal700, color: '#fff', padding: '100px 0' }}>
      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 40px' }}>
        <h2 style={{ color: '#fff', marginBottom: 16, textAlign: 'center', fontSize: 'clamp(28px,3.2vw,40px)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '-0.015em' }}>Let's build better packaging together.</h2>
        <p style={{ textAlign: 'center', fontSize: 16, marginBottom: 50, opacity: 0.9, lineHeight: 1.6 }}>Select your division and region to get in touch with the right team.</p>

        {/* Division Selection */}
        <div style={{ marginBottom: 50 }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.8)', marginBottom: 20, textAlign: 'center' }}>Which division?</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            {divisions.map((div) => (
              <button
                key={div.id}
                onClick={() => setSelectedDivision(div.id)}
                style={{
                  padding: 24,
                  background: selectedDivision === div.id ? '#fff' : 'rgba(255,255,255,0.1)',
                  border: `2px solid ${selectedDivision === div.id ? '#fff' : 'rgba(255,255,255,0.3)'}`,
                  borderRadius: 12,
                  color: selectedDivision === div.id ? COLORS.teal700 : '#fff',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  fontSize: 16,
                  fontWeight: 700,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 12,
                  textAlign: 'center'
                }}
                onMouseEnter={(e) => {
                  if (selectedDivision !== div.id) {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
                    e.currentTarget.style.borderColor = '#fff';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedDivision !== div.id) {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
                  }
                }}
              >
                <span style={{ fontSize: 28 }}>{div.icon}</span>
                {div.name}
              </button>
            ))}
          </div>
        </div>

        {/* Region Selection */}
        <div style={{ marginBottom: 50 }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.8)', marginBottom: 20, textAlign: 'center' }}>Which region?</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
            {regions.map((reg) => (
              <button
                key={reg.id}
                onClick={() => setSelectedRegion(reg.id)}
                style={{
                  padding: 24,
                  background: selectedRegion === reg.id ? '#fff' : 'rgba(255,255,255,0.1)',
                  border: `2px solid ${selectedRegion === reg.id ? '#fff' : 'rgba(255,255,255,0.3)'}`,
                  borderRadius: 12,
                  color: selectedRegion === reg.id ? COLORS.teal700 : '#fff',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  textAlign: 'left',
                  fontSize: 14,
                  fontWeight: 600,
                  lineHeight: 1.6
                }}
                onMouseEnter={(e) => {
                  if (selectedRegion !== reg.id) {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
                    e.currentTarget.style.borderColor = '#fff';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedRegion !== reg.id) {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
                  }
                }}
              >
                <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 8 }}>📍 {reg.name}</div>
                <div style={{ fontSize: 12, opacity: 0.9, marginBottom: 12 }}>{reg.facilities}</div>
                <div style={{ fontSize: 11, opacity: 0.8 }}>{reg.email}</div>
                <div style={{ fontSize: 11, opacity: 0.8 }}>{reg.phone}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Contact CTA */}
        {selectedDivision && selectedRegion && (
          <div style={{ textAlign: 'center', animation: 'fadeIn 0.3s ease' }}>
            <p style={{ fontSize: 16, marginBottom: 24, opacity: 0.95 }}>Great! You've selected <strong>{divisions.find(d => d.id === selectedDivision)?.name}</strong> in <strong>{regions.find(r => r.id === selectedRegion)?.name}</strong>.</p>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '16px 32px', fontWeight: 700, fontSize: 13, letterSpacing: '0.03em', textTransform: 'uppercase', borderRadius: 999, background: '#fff', color: COLORS.teal700, border: 'none', cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>Get in Touch →</button>
              <button style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '16px 32px', fontWeight: 700, fontSize: 13, letterSpacing: '0.03em', textTransform: 'uppercase', borderRadius: 999, border: '1.5px solid rgba(255,255,255,0.7)', color: '#fff', background: 'none', cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.borderColor = '#fff'} onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.7)'}>Request Quote →</button>
            </div>
          </div>
        )}

        {!selectedDivision && !selectedRegion && (
          <div style={{ textAlign: 'center', opacity: 0.8 }}>
            <p style={{ fontSize: 14 }}>Select a division and region above to get started</p>
          </div>
        )}
      </div>
    </section>
  );
}

function InteractiveTimeline() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [imageRotation, setImageRotation] = useState(0);

  const milestones = [
    { year: '1981', title: 'Group Print is Founded', desc: 'Brothers Neville and Alan Gibson Downes establish Group Print, laying the foundation for our future in packaging and printing.', images: ['/sg-facility-current.jpg', '/sg-facility-historical.jpg'], feature1: 'Founding', feature2: 'South Africa', feature3: 'Durban' },
    { year: '1989', title: 'STADPRINT Acquisition', desc: 'The security and printing business Stadprint is acquired, expanding our capabilities in high-security solutions.', images: ['/sg-facility-current.jpg', '/sg-displays.jpg'] },
    { year: '1994', title: 'AFRICAID SOLD', desc: 'Africaid sold to Altech, marking a strategic milestone in our portfolio management.', images: ['/sg-facility-current.jpg', 'https://images.unsplash.com/photo-1585399363565-24270a8319d1?w=600&q=85&fit=crop&crop=entropy'] },
    { year: '2001', title: 'New Ownership', desc: 'The company is acquired by Chairman and Simon Downes, bringing fresh vision and strategic direction.', images: ['/sg-facility-current.jpg', '/sg-truck.jpg'] },
    { year: '2005', title: 'CENSUS Project', desc: 'S&G Security Printing prints the 2011 Census papers for South Africa, demonstrating our security printing excellence.', images: ['/sg-facility-current.jpg', '/sg-pos-display.jpg'] },
    { year: '2011', title: 'Strategic Expansion', desc: 'Strategic expansion and market consolidation strengthens our position as a market leader.', images: ['/sg-facility-current.jpg', '/sg-facility-historical.jpg'] },
    { year: '2019', title: 'COUNTERPOINT & EARTHPAK', desc: 'Acquire interest in Counterpoint Trading and launch earthpak sustainable packaging solution.', images: ['/sg-facility-current.jpg', '/sg-displays.jpg'] },
    { year: '2021', title: 'Plant Expansion', desc: 'The Shave & Gibson Bags factory moves from Hammarsdale to Mobeni with expanded capacity.', images: ['/sg-facility-current.jpg', '/sg-truck.jpg'] },
    { year: '2023', title: 'S&G BAGS', desc: 'Shave & Gibson Packaging acquires remaining interest of Counterpoint Trading.', images: ['/sg-facility-current.jpg', '/sg-pos-display.jpg'] },
    { year: '2024', title: 'Logistics Hub', desc: 'New state-of-the-art logistics hub built on Lerwick Road, enhancing distribution capabilities.', images: ['/sg-facility-current.jpg', 'https://images.unsplash.com/photo-1585399363565-24270a8319d1?w=600&q=85&fit=crop&crop=entropy'] },
    { year: '2025', title: 'BARROWS Acquisition', desc: 'S&G Packaging acquires Barrows corrugated display division, expanding product portfolio.', images: ['/sg-facility-current.jpg', '/sg-facility-historical.jpg'] },
  ];

  useEffect(() => {
    const imageInterval = setInterval(() => {
      setImageRotation((prev) => (prev + 1) % 2);
    }, 3000);
    return () => clearInterval(imageInterval);
  }, []);

  useEffect(() => {
    const yearInterval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % milestones.length);
    }, 5000);
    return () => clearInterval(yearInterval);
  }, [milestones.length]);

  const currentMilestone = milestones[activeIndex];
  const currentImage = currentMilestone.images[imageRotation];

  return (
    <section style={{ padding: '60px 0', background: '#fff' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 40px' }}>
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: COLORS.teal700, marginBottom: 8 }}>Our History</div>
          <h1 style={{ fontSize: 'clamp(32px,4vw,44px)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 12, lineHeight: 1.1 }}>A journey of growth, <span style={{ color: COLORS.teal700 }}>innovation</span> and impact.</h1>
          <p style={{ fontSize: 15, color: COLORS.muted, maxWidth: 700, lineHeight: 1.7 }}>For more than four decades, we've evolved with purpose, investing in technology, people, and sustainable solutions that create value for our customers and communities.</p>
        </div>

        {/* Horizontal Timeline Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 28, overflowX: 'auto', paddingBottom: 12 }}>
          <button
            onClick={() => setActiveIndex(Math.max(0, activeIndex - 1))}
            disabled={activeIndex === 0}
            style={{
              background: 'none',
              border: `2px solid ${COLORS.teal700}`,
              width: 40,
              height: 40,
              borderRadius: '50%',
              cursor: activeIndex === 0 ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: COLORS.teal700,
              fontSize: 20,
              opacity: activeIndex === 0 ? 0.5 : 1,
              transition: 'all 0.2s'
            }}
          >
            ‹
          </button>

          <div style={{ display: 'flex', gap: 24, alignItems: 'center', flex: 1, minWidth: 0 }}>
            {/* Timeline line */}
            <div style={{ position: 'relative', height: '3px', background: COLORS.line, flex: 1, display: 'flex', alignItems: 'center' }}>
              {/* Progress line */}
              <div style={{
                position: 'absolute',
                height: '3px',
                background: COLORS.teal700,
                left: 0,
                width: `${((activeIndex + 1) / milestones.length) * 100}%`,
                transition: 'width 0.4s ease'
              }} />
              {/* Year dots */}
              {milestones.map((m, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  style={{
                    position: 'absolute',
                    left: `${(i / (milestones.length - 1)) * 100}%`,
                    transform: 'translateX(-50%)',
                    width: activeIndex === i ? 18 : 12,
                    height: activeIndex === i ? 18 : 12,
                    borderRadius: '50%',
                    background: activeIndex === i ? COLORS.teal700 : '#fff',
                    border: `2px solid ${COLORS.teal700}`,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    zIndex: 10
                  }}
                  title={m.year}
                />
              ))}
            </div>
          </div>

          <button
            onClick={() => setActiveIndex(Math.min(milestones.length - 1, activeIndex + 1))}
            disabled={activeIndex === milestones.length - 1}
            style={{
              background: 'none',
              border: `2px solid ${COLORS.teal700}`,
              width: 40,
              height: 40,
              borderRadius: '50%',
              cursor: activeIndex === milestones.length - 1 ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: COLORS.teal700,
              fontSize: 20,
              opacity: activeIndex === milestones.length - 1 ? 0.5 : 1,
              transition: 'all 0.2s'
            }}
          >
            ›
          </button>
        </div>

        {/* Year Labels Under Timeline */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 32, gap: 8 }}>
          {milestones.map((m, i) => (
            <span key={i} style={{
              fontSize: activeIndex === i ? 16 : 13,
              fontWeight: activeIndex === i ? 800 : 600,
              color: activeIndex === i ? COLORS.teal700 : COLORS.muted,
              transition: 'all 0.4s ease',
              cursor: 'pointer',
              padding: activeIndex === i ? '8px 12px' : '4px 6px',
              borderRadius: 6,
              background: activeIndex === i ? COLORS.teal100 : 'transparent'
            }} onClick={() => setActiveIndex(i)}>{m.year}</span>
          ))}
        </div>

        {/* Content + Image */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'stretch' }}>
          {/* Left Content */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.teal700, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{currentMilestone.year}</div>
              <h2 style={{ fontSize: 'clamp(24px,3vw,36px)', fontWeight: 800, color: COLORS.ink, marginBottom: 16, lineHeight: 1.2 }}>{currentMilestone.title}</h2>
              <p style={{ fontSize: 15, color: COLORS.muted, lineHeight: 1.7, marginBottom: 24 }}>{currentMilestone.desc}</p>
            </div>
            <button style={{
              alignSelf: 'flex-start',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '12px 24px',
              background: 'none',
              border: `2px solid ${COLORS.teal700}`,
              color: COLORS.teal700,
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              borderRadius: 6,
              transition: 'all 0.3s'
            }} onMouseEnter={(e) => {
              e.currentTarget.style.background = COLORS.teal700;
              e.currentTarget.style.color = '#fff';
            }} onMouseLeave={(e) => {
              e.currentTarget.style.background = 'none';
              e.currentTarget.style.color = COLORS.teal700;
            }}>
              Explore This Era →
            </button>
          </div>

          {/* Right Image with auto-rotation */}
          <div style={{
            borderRadius: 12,
            overflow: 'hidden',
            background: COLORS.bg,
            minHeight: 360,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: COLORS.muted,
            fontSize: 14,
            fontWeight: 500
          }}>
            <img
              src={currentImage}
              alt={currentMilestone.title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
                transition: 'opacity 0.6s ease-in-out'
              }}
            />
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
