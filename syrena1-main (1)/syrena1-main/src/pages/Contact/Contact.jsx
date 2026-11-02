import { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, ArrowUpRight, Sparkles } from 'lucide-react';
import PageTransition from '../../components/PageTransition/PageTransition';
import ScrollReveal from '../../components/ScrollReveal/ScrollReveal';
import CinematicText from '../../components/CinematicText/CinematicText';
import Button from '../../components/Button/Button';
import Magnetic from '../../components/Magnetic/Magnetic';
import styles from './Contact.module.css';

const serviceOptions = [
  'SEO Strategy',
  'Performance Paid Media',
  'Social & Viral Ecosystems',
  'Content & Editorial',
  'WebGL & Creative Web',
  'Brand Identity System',
  'Full-Funnel Acceleration',
];

const budgetRanges = ['<$10K', '$10K - $25K', '$25K - $50K', '$50K+'];

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    service: 'Full-Funnel Acceleration',
    budget: '$25K - $50K',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Valid email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email address';
    if (!formData.message.trim()) newErrors.message = 'Please provide details about your project scope';
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setSubmitted(true);
  };

  return (
    <PageTransition>
      {/* ─── PAGE HEADER ─── */}
      <section className={`section section--dark ${styles.pageHeader}`}>
        <div className={styles.headerGlow1} />
        <div className={styles.headerGlow2} />
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div className={styles.headerInner}>
            <span className="label">Start a Project</span>
            <h1 className={styles.pageTitle}>
              <CinematicText type="words" delay={0.1} triggerOnScroll={false}>
                Let's engineer your
              </CinematicText>
              <br />
              <span className={styles.titleHighlight}>
                <CinematicText type="words" delay={0.25} triggerOnScroll={false}>
                  unfair advantage.
                </CinematicText>
              </span>
            </h1>
            <p className={styles.pageDesc}>
              Tell us about your brand goals, target milestones, or technical challenges. Our senior partners will review and respond within 24 hours.
            </p>
          </div>
        </div>
      </section>

      {/* ─── CONTACT SECTION ─── */}
      <section className="section">
        <div className="container">
          <div className={styles.contactGrid}>
            {/* Form */}
            <ScrollReveal direction="left">
              <div className={styles.formWrap}>
                {submitted ? (
                  <div className={styles.successMessage}>
                    <CheckCircle2 size={54} color="var(--frost)" />
                    <h3 className={styles.successTitle}>Inquiry Dispatched</h3>
                    <p className={styles.successDesc}>
                      Thank you, {formData.name}. Our managing partners have received your brief and are preparing an initial strategic assessment. We will connect within 24 hours.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className={styles.form} noValidate>
                    <div className={styles.formHeader}>
                      <h2 className={styles.formTitle}>Project Diagnostic Brief</h2>
                      <p className={styles.formDesc}>Select your requirements and provide your details below.</p>
                    </div>

                    {/* Services Pill Selector */}
                    <div className={styles.fieldSection}>
                      <label className={styles.labelText}>Service Focus</label>
                      <div className={styles.pillsWrap}>
                        {serviceOptions.map((s) => (
                          <button
                            key={s}
                            type="button"
                            className={`${styles.pillBtn} ${formData.service === s ? styles.pillActive : ''}`}
                            onClick={() => setFormData((prev) => ({ ...prev, service: s }))}
                            data-hover
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Budget Selector */}
                    <div className={styles.fieldSection}>
                      <label className={styles.labelText}>Anticipated Budget Scope</label>
                      <div className={styles.pillsWrap}>
                        {budgetRanges.map((b) => (
                          <button
                            key={b}
                            type="button"
                            className={`${styles.pillBtn} ${formData.budget === b ? styles.pillActive : ''}`}
                            onClick={() => setFormData((prev) => ({ ...prev, budget: b }))}
                            data-hover
                          >
                            {b}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className={styles.formGrid}>
                      <div className={styles.field}>
                        <label htmlFor="contact-name" className={styles.labelText}>Full Name *</label>
                        <input
                          id="contact-name"
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Elena Rostova"
                          className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
                        />
                        {errors.name && <span className={styles.error}>{errors.name}</span>}
                      </div>

                      <div className={styles.field}>
                        <label htmlFor="contact-email" className={styles.labelText}>Work Email *</label>
                        <input
                          id="contact-email"
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="elena@enterprise.com"
                          className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                        />
                        {errors.email && <span className={styles.error}>{errors.email}</span>}
                      </div>
                    </div>

                    <div className={styles.field}>
                      <label htmlFor="contact-company" className={styles.labelText}>Company / Organization</label>
                      <input
                        id="contact-company"
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        placeholder="Company name, website URL"
                        className={styles.input}
                      />
                    </div>

                    <div className={styles.field}>
                      <label htmlFor="contact-message" className={styles.labelText}>Project Overview &amp; Goals *</label>
                      <textarea
                        id="contact-message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Detail your growth goals, target timelines, current challenges, and desired outcomes..."
                        rows={4}
                        className={`${styles.input} ${styles.textarea} ${errors.message ? styles.inputError : ''}`}
                      />
                      {errors.message && <span className={styles.error}>{errors.message}</span>}
                    </div>

                    <div style={{ marginTop: '1rem' }}>
                      <Magnetic strength={0.3}>
                        <button type="submit" className={styles.submitBtn} data-hover>
                          <span>Transmit Brief</span>
                          <Send size={16} />
                        </button>
                      </Magnetic>
                    </div>
                  </form>
                )}
              </div>
            </ScrollReveal>

            {/* Direct Info */}
            <ScrollReveal direction="right">
              <div className={styles.infoSide}>
                <div className={styles.infoCard}>
                  <h3 className={styles.infoTitle}>Executive Inquiries</h3>
                  <p className={styles.infoDesc}>
                    For direct partner outreach, speaking invitations, or press inquiries:
                  </p>

                  <div className={styles.infoItems}>
                    <a href="mailto:hello@syrena.agency" className={styles.infoItem} data-hover>
                      <div className={styles.infoIcon}><Mail size={18} /></div>
                      <div>
                        <span className={styles.infoLabel}>Direct Channel</span>
                        <span className={styles.infoValue}>hello@syrena.agency</span>
                      </div>
                    </a>
                    <a href="tel:+1234567890" className={styles.infoItem} data-hover>
                      <div className={styles.infoIcon}><Phone size={18} /></div>
                      <div>
                        <span className={styles.infoLabel}>HQ Telephone</span>
                        <span className={styles.infoValue}>+1 (234) 567-890</span>
                      </div>
                    </a>
                    <div className={styles.infoItem}>
                      <div className={styles.infoIcon}><MapPin size={18} /></div>
                      <div>
                        <span className={styles.infoLabel}>Studio Headquarters</span>
                        <span className={styles.infoValue}>123 Madison Ave, Suite 800<br />New York, NY 10016</span>
                      </div>
                    </div>
                    <div className={styles.infoItem}>
                      <div className={styles.infoIcon}><Clock size={18} /></div>
                      <div>
                        <span className={styles.infoLabel}>Operating Hours</span>
                        <span className={styles.infoValue}>Mon – Fri: 09:00 – 18:00 EST / GMT</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={styles.responseCard}>
                  <div className={styles.responseDot} />
                  <div>
                    <strong className={styles.responseTitle}>Guaranteed SLA</strong>
                    <p className={styles.responseSubtitle}>Executive response guaranteed within 24 business hours.</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
