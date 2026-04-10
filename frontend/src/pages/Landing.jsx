import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp, BarChart2, Clock, Brain, Zap, Shield,
  ArrowRight, ChevronDown, Star, CheckCircle2, Menu, X
} from 'lucide-react';

// ─── Animated Counter ────────────────────────────────────────────────────────
const Counter = ({ target, prefix = '', suffix = '', duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const startTime = performance.now();
        const animate = (currentTime) => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setCount(Math.floor(eased * target));
          if (progress < 1) requestAnimationFrame(animate);
          else setCount(target);
        };
        requestAnimationFrame(animate);
      }
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>;
};

// ─── Feature Card ─────────────────────────────────────────────────────────────
const FeatureCard = ({ icon: Icon, title, desc, delay }) => (
  <div className="land-feature-card" style={{ animationDelay: `${delay}ms` }}>
    <div className="land-feature-icon-wrap">
      <Icon size={22} />
    </div>
    <h3 className="land-feature-title">{title}</h3>
    <p className="land-feature-desc">{desc}</p>
  </div>
);

// ─── Testimonial ─────────────────────────────────────────────────────────────
const TestimonialCard = ({ name, role, text, rating, delay }) => (
  <div className="land-testimonial-card" style={{ animationDelay: `${delay}ms` }}>
    <div className="land-testimonial-stars">
      {Array.from({ length: rating }).map((_, i) => (
        <Star key={i} size={14} fill="currentColor" />
      ))}
    </div>
    <p className="land-testimonial-text">"{text}"</p>
    <div className="land-testimonial-author">
      <div className="land-testimonial-avatar">{name[0]}</div>
      <div>
        <div className="land-testimonial-name">{name}</div>
        <div className="land-testimonial-role">{role}</div>
      </div>
    </div>
  </div>
);

// ─── Main Landing Page ────────────────────────────────────────────────────────
const Landing = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const heroRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  return (
    <div className="land-root">

      {/* ── Navbar ── */}
      <nav className={`land-nav ${scrolled ? 'scrolled' : ''}`}>
        <div className="land-nav-inner">
          <div className="land-nav-logo">
            <div className="land-nav-logo-icon"><TrendingUp size={18} /></div>
            <span>RecoverX</span>
          </div>

          {/* Desktop links */}
          <div className="land-nav-links">
            <button onClick={() => scrollTo('features')} className="land-nav-link">Features</button>
            <button onClick={() => scrollTo('stats')} className="land-nav-link">Results</button>
            <button onClick={() => scrollTo('testimonials')} className="land-nav-link">Testimonials</button>
            <button onClick={() => scrollTo('pricing')} className="land-nav-link">Pricing</button>
          </div>

          <div className="land-nav-actions">
            <Link to="/login" className="land-nav-signin">Sign in</Link>
            <Link to="/register" className="land-nav-cta">
              Get Started <ArrowRight size={15} />
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button className="land-hamburger" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="land-mobile-menu">
            <button onClick={() => scrollTo('features')} className="land-mobile-link">Features</button>
            <button onClick={() => scrollTo('stats')} className="land-mobile-link">Results</button>
            <button onClick={() => scrollTo('testimonials')} className="land-mobile-link">Testimonials</button>
            <button onClick={() => scrollTo('pricing')} className="land-mobile-link">Pricing</button>
            <Link to="/login" className="land-mobile-link" onClick={() => setMenuOpen(false)}>Sign in</Link>
            <Link to="/register" className="land-mobile-cta" onClick={() => setMenuOpen(false)}>
              Get Started Free <ArrowRight size={15} />
            </Link>
          </div>
        )}
      </nav>

      {/* ── Hero ── */}
      <section className="land-hero" ref={heroRef}>
        {/* Animated background orbs */}
        <div className="land-orb land-orb-1" />
        <div className="land-orb land-orb-2" />
        <div className="land-orb land-orb-3" />

        {/* Grid overlay */}
        <div className="land-hero-grid" />

        <div className="land-hero-inner">
          <div className="land-hero-badge">
            <Zap size={12} />
            <span>AI-Powered Freelance Profit Intelligence</span>
          </div>

          <h1 className="land-hero-title">
            Stop <span className="land-text-gradient">Leaking Money.</span>
            <br />
            Start Maximizing
            <br />
            Every Billable Hour.
          </h1>

          <p className="land-hero-subtitle">
            RecoverX is the intelligent profit dashboard that shows freelancers exactly where their 
            money goes — and how to reclaim it. Track time, expose hidden losses, and grow your income.
          </p>

          <div className="land-hero-actions">
            <Link to="/register" className="land-btn-primary" id="hero-get-started">
              Create Free Account
              <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="land-btn-ghost" id="hero-signin">
              Sign in to Dashboard
            </Link>
          </div>

          <div className="land-hero-social-proof">
            <div className="land-avatars">
              {['A', 'S', 'R', 'M', 'K'].map((l, i) => (
                <div key={i} className="land-avatar" style={{ zIndex: 5 - i }}>{l}</div>
              ))}
            </div>
            <div className="land-proof-text">
              <span className="land-proof-count">2,400+</span> freelancers recovering lost income
            </div>
          </div>
        </div>

        {/* Hero floating UI mockup */}
        <div className="land-hero-mockup">
          <div className="land-mockup-card land-mockup-main">
            <div className="land-mockup-header">
              <div className="land-mockup-dot red" />
              <div className="land-mockup-dot yellow" />
              <div className="land-mockup-dot green" />
              <span className="land-mockup-title">Profit Dashboard</span>
            </div>
            <div className="land-mockup-stats">
              <div className="land-mockup-stat">
                <div className="land-mockup-stat-label">Effective Rate</div>
                <div className="land-mockup-stat-value green">$87<span>/hr</span></div>
              </div>
              <div className="land-mockup-stat">
                <div className="land-mockup-stat-label">Hidden Loss</div>
                <div className="land-mockup-stat-value red">$2,340</div>
              </div>
              <div className="land-mockup-stat">
                <div className="land-mockup-stat-label">Scope Creep</div>
                <div className="land-mockup-stat-value yellow">+18%</div>
              </div>
            </div>
            <div className="land-mockup-bar-wrap">
              <div className="land-mockup-bar-label">Monthly Earnings</div>
              <div className="land-mockup-bars">
                {[40, 55, 45, 70, 65, 80, 90].map((h, i) => (
                  <div key={i} className="land-mockup-bar" style={{ height: `${h}%`, animationDelay: `${i * 100}ms` }} />
                ))}
              </div>
            </div>
          </div>

          {/* Floating alert cards */}
          <div className="land-mockup-alert land-alert-1">
            <Brain size={14} />
            <span>AI Alert: Scope creep detected on "Website Redesign"</span>
          </div>
          <div className="land-mockup-alert land-alert-2 success">
            <CheckCircle2 size={14} />
            <span>$450 recovered by logging revision time</span>
          </div>
        </div>

        {/* Scroll cue */}
        <div className="land-scroll-cue" onClick={() => scrollTo('features')}>
          <ChevronDown size={20} />
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="land-stats" id="stats">
        <div className="land-container">
          <div className="land-stats-grid">
            {[
              { target: 2400, suffix: '+', label: 'Freelancers Using RecoverX', prefix: '' },
              { target: 4200000, suffix: '', label: 'Hidden Revenue Recovered', prefix: '$' },
              { target: 89, suffix: '%', label: 'Report Higher Effective Rate', prefix: '' },
              { target: 12, suffix: 'min', label: 'Average Daily Time to Track', prefix: '' },
            ].map(({ target, suffix, label, prefix }, i) => (
              <div key={i} className="land-stat-block">
                <div className="land-stat-number">
                  <Counter target={target} prefix={prefix} suffix={suffix} />
                </div>
                <div className="land-stat-label">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="land-features" id="features">
        <div className="land-container">
          <div className="land-section-header">
            <div className="land-section-badge">Powerful Features</div>
            <h2 className="land-section-title">
              Everything you need to track, protect, and <span className="land-text-gradient">grow</span> your income
            </h2>
            <p className="land-section-desc">
              Built specifically for freelancers who are tired of doing more work for less money.
            </p>
          </div>

          <div className="land-features-grid">
            <FeatureCard
              icon={Clock}
              title="Intelligent Time Tracking"
              desc="Log hours by category — Billable, Revisions, Admin, Calls. Instantly see where your time actually goes."
              delay={0}
            />
            <FeatureCard
              icon={BarChart2}
              title="Profit & Loss Dashboard"
              desc="Real-time metrics: effective hourly rate, hidden loss, scope creep percentage, and earnings trends."
              delay={100}
            />
            <FeatureCard
              icon={Brain}
              title="AI-Powered Insights"
              desc="Our AI advisor detects toxic client patterns, scope bleed, and communication overhead — then tells you exactly what to do."
              delay={200}
            />
            <FeatureCard
              icon={TrendingUp}
              title="Portfolio Analytics"
              desc="See which clients and project types generate the highest ROI. Double down on what works."
              delay={300}
            />
            <FeatureCard
              icon={Zap}
              title="Instant Loss Recovery"
              desc="Know exactly how much money you've lost to non-billable work. RecoverX shows you how to charge for it."
              delay={400}
            />
            <FeatureCard
              icon={Shield}
              title="Secure & Private"
              desc="Your financial data stays yours. JWT authentication, encrypted passwords, zero third-party data sharing."
              delay={500}
            />
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="land-how" id="how">
        <div className="land-container">
          <div className="land-section-header">
            <div className="land-section-badge">Simple Process</div>
            <h2 className="land-section-title">Up and running in <span className="land-text-gradient">3 minutes</span></h2>
          </div>

          <div className="land-steps">
            {[
              {
                num: '01',
                title: 'Create Your Account',
                desc: 'Sign up in seconds. No credit card needed. Your account is secured with bcrypt-hashed passwords.',
                cta: 'Get Started',
                link: '/register'
              },
              {
                num: '02',
                title: 'Add Projects & Log Time',
                desc: 'Create projects with your rate and estimated hours. Log time entries with smart categories.',
                cta: null
              },
              {
                num: '03',
                title: 'See Your Real Profits',
                desc: 'Your dashboard instantly shows effective rate, hidden losses, scope creep, and AI-driven action items.',
                cta: null
              },
            ].map((step, i) => (
              <div key={i} className="land-step">
                <div className="land-step-num">{step.num}</div>
                <div className="land-step-content">
                  <h3 className="land-step-title">{step.title}</h3>
                  <p className="land-step-desc">{step.desc}</p>
                  {step.cta && (
                    <Link to={step.link} className="land-step-cta">
                      {step.cta} <ArrowRight size={14} />
                    </Link>
                  )}
                </div>
                {i < 2 && <div className="land-step-connector" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="land-testimonials" id="testimonials">
        <div className="land-container">
          <div className="land-section-header">
            <div className="land-section-badge">Social Proof</div>
            <h2 className="land-section-title">Freelancers <span className="land-text-gradient">love</span> RecoverX</h2>
          </div>

          <div className="land-testimonials-grid">
            <TestimonialCard
              name="Arjun Mehta"
              role="UI/UX Designer · Fiverr Pro"
              text="I discovered I was losing $800/month to unpaid revision cycles. RecoverX's AI flagged it on day one. I restructured my contracts and recovered it all."
              rating={5}
              delay={0}
            />
            <TestimonialCard
              name="Priya Sharma"
              role="Full-Stack Dev · Upwork Top Rated"
              text="The scope creep tracker is insane. It predicted my project would go over budget 2 weeks before it did. I raised my price in time and saved the contract."
              rating={5}
              delay={100}
            />
            <TestimonialCard
              name="Rohan Kapoor"
              role="Content Strategist · Independent"
              text="Finally a tool that speaks freelancer. My effective rate jumped from $35/hr to $62/hr in 60 days just by following the AI recommendations."
              rating={5}
              delay={200}
            />
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section className="land-pricing" id="pricing">
        <div className="land-container">
          <div className="land-section-header">
            <div className="land-section-badge">Pricing</div>
            <h2 className="land-section-title">Simple, <span className="land-text-gradient">transparent</span> pricing</h2>
            <p className="land-section-desc">Start free. Upgrade when you're ready to unlock the full AI suite.</p>
          </div>

          <div className="land-pricing-grid">
            {/* Free */}
            <div className="land-pricing-card">
              <div className="land-pricing-tier">Starter</div>
              <div className="land-pricing-price">
                $0<span>/month</span>
              </div>
              <p className="land-pricing-desc">Perfect to get started with profit tracking</p>
              <ul className="land-pricing-features">
                {['Up to 5 active projects', 'Time tracking & logging', 'Basic profit dashboard', 'Real auth with db.json storage'].map(f => (
                  <li key={f}><CheckCircle2 size={15} />{f}</li>
                ))}
              </ul>
              <Link to="/register" className="land-pricing-btn-outline" id="pricing-free-cta">
                Start for Free <ArrowRight size={15} />
              </Link>
            </div>

            {/* Pro — highlighted */}
            <div className="land-pricing-card featured">
              <div className="land-pricing-badge-pill">Most Popular</div>
              <div className="land-pricing-tier">Pro</div>
              <div className="land-pricing-price">
                $12<span>/month</span>
              </div>
              <p className="land-pricing-desc">For serious freelancers who want full AI power</p>
              <ul className="land-pricing-features">
                {['Unlimited projects', 'AI Insights & alerts', 'Scope creep predictor', 'Client ROI analytics', 'Portfolio performance', 'Priority support'].map(f => (
                  <li key={f}><CheckCircle2 size={15} />{f}</li>
                ))}
              </ul>
              <Link to="/register" className="land-pricing-btn-primary" id="pricing-pro-cta">
                Get Pro Access <ArrowRight size={15} />
              </Link>
            </div>

            {/* Agency */}
            <div className="land-pricing-card">
              <div className="land-pricing-tier">Agency</div>
              <div className="land-pricing-price">
                $39<span>/month</span>
              </div>
              <p className="land-pricing-desc">For teams and growing freelance studios</p>
              <ul className="land-pricing-features">
                {['Everything in Pro', 'Up to 5 team members', 'Shared project dashboard', 'Advanced reporting', 'Custom integrations', 'Dedicated account manager'].map(f => (
                  <li key={f}><CheckCircle2 size={15} />{f}</li>
                ))}
              </ul>
              <Link to="/register" className="land-pricing-btn-outline" id="pricing-agency-cta">
                Get Agency <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="land-final-cta">
        <div className="land-final-orb-1" />
        <div className="land-final-orb-2" />
        <div className="land-container land-final-inner">
          <h2 className="land-final-title">
            Ready to stop leaking money?
          </h2>
          <p className="land-final-desc">
            Join 2,400+ freelancers who recovered their hidden income with RecoverX. 
            Free to start. No credit card required.
          </p>
          <div className="land-final-actions">
            <Link to="/register" className="land-btn-primary large" id="final-cta">
              Create Your Free Account <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="land-btn-ghost" id="final-signin">
              Already have an account?
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="land-footer">
        <div className="land-container">
          <div className="land-footer-inner">
            <div className="land-footer-logo">
              <div className="land-nav-logo-icon"><TrendingUp size={16} /></div>
              <span>RecoverX</span>
            </div>
            <p className="land-footer-tagline">
              Intelligent profit tracking for freelancers.
            </p>
          </div>
          <div className="land-footer-bottom">
            <span>© 2026 RecoverX. Built for freelancers.</span>
            <div className="land-footer-links">
              <a href="#" className="land-footer-link">Privacy</a>
              <a href="#" className="land-footer-link">Terms</a>
              <Link to="/login" className="land-footer-link">Sign in</Link>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Landing;
