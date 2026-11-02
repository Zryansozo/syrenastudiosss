import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, Lock, FileText, Check } from 'lucide-react';
import styles from './LegalModal.module.css';

export default function LegalModal({ isOpen, onClose, modalType }) {
  if (!isOpen) return null;

  const getContent = () => {
    switch (modalType) {
      case 'privacy':
        return {
          title: 'Privacy Policy',
          icon: ShieldCheck,
          updated: 'Updated March 2026',
          sections: [
            {
              heading: '1. Information We Collect',
              text: 'Syrena Digital Agency LLC collects information you provide directly through our project inquiry forms, diagnostic discovery questionnaires, and communications. This includes your name, work email address, company name, project parameters, and estimated budgets.'
            },
            {
              heading: '2. Usage of Client Data',
              text: 'We utilize collected information solely to assess strategic alignment, prepare project proposals, deliver engineering and marketing deliverables, and maintain contractual compliance. We do not sell, rent, or monetize your personal or corporate data under any circumstances.'
            },
            {
              heading: '3. Data Security & Storage',
              text: 'All data is encrypted in transit using TLS 1.3 and at rest with AES-256 encryption. Access is strictly restricted to senior partners and project team members on a least-privilege basis.'
            },
            {
              heading: '4. GDPR & CCPA Compliance',
              text: 'You maintain the right to access, rectify, or request complete deletion of your stored records at any time. For compliance inquiries, contact compliance@syrena.agency.'
            }
          ]
        };
      case 'terms':
        return {
          title: 'Terms of Service',
          icon: FileText,
          updated: 'Effective March 2026',
          sections: [
            {
              heading: '1. Engagement Scope',
              text: 'All agency engagements are governed by individual Statements of Work (SOW) executed between Syrena Digital Agency LLC and the client. Project milestones, delivery timelines, and performance criteria are codified in each respective agreement.'
            },
            {
              heading: '2. Intellectual Property Rights',
              text: 'Upon full settlement of all contractual fees, full intellectual property rights, source code, bespoke design tokens, and creative assets transfer exclusively to the client, subject to standard portfolio demonstration rights.'
            },
            {
              heading: '3. Warranties & SLA',
              text: 'We warrant that all digital platforms, WebGL components, and code deliverables meet WCAG 2.1 AAA accessibility standards and sub-second Core Web Vitals at the time of deployment acceptance.'
            },
            {
              heading: '4. Governing Jurisdiction',
              text: 'These terms are governed by and construed in accordance with the laws of the State of New York, USA, without regard to conflict of law principles.'
            }
          ]
        };
      case 'cookies':
        return {
          title: 'Cookie Preferences & Consent',
          icon: Lock,
          updated: 'Consent Preferences',
          sections: [
            {
              heading: 'Essential Telemetry',
              text: 'Strictly necessary cookies required for session security, smooth navigation caching, and WebGL shader state persistence. These cannot be disabled.'
            },
            {
              heading: 'Performance Analytics',
              text: 'Anonymous telemetry measuring page render speeds, frame rates (60fps budgets), and visitor conversion funnels. Helps us optimize performance.'
            },
            {
              heading: 'Personalization & Motion',
              text: 'Remembers user preference for reduced motion, soundscape controls, and 3D scene fidelity.'
            }
          ]
        };
      case 'security':
      default:
        return {
          title: 'Security & Compliance Standards',
          icon: ShieldCheck,
          updated: 'Verified Compliance',
          sections: [
            {
              heading: 'ISO 27001 & SOC2 Framework',
              text: 'Syrena enforces strict information security controls across all internal engineering pipelines, staging environments, and client asset repositories.'
            },
            {
              heading: 'Continuous Penetration Testing',
              text: 'All production web applications undergo automated dependency vulnerability auditing and third-party penetration testing prior to public deployment.'
            },
            {
              heading: 'Responsible Disclosure',
              text: 'We welcome reports from independent security researchers. Vulnerabilities may be disclosed directly to security@syrena.agency with a 24-hour response SLA.'
            }
          ]
        };
    }
  };

  const content = getContent();
  const Icon = content.icon;

  return (
    <AnimatePresence>
      <div className={styles.modalOverlay} onClick={onClose}>
        <motion.div
          className={styles.modalCard}
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className={styles.modalHeader}>
            <div className={styles.titleRow}>
              <div className={styles.iconWrap}>
                <Icon size={20} />
              </div>
              <div>
                <h3 className={styles.title}>{content.title}</h3>
                <span className={styles.updated}>{content.updated}</span>
              </div>
            </div>
            <button
              className={styles.closeBtn}
              onClick={onClose}
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
          </div>

          <div className={styles.modalBody}>
            {content.sections.map((sec, i) => (
              <div key={i} className={styles.sectionBlock}>
                <h4 className={styles.sectionHeading}>{sec.heading}</h4>
                <p className={styles.sectionText}>{sec.text}</p>
              </div>
            ))}
          </div>

          <div className={styles.modalFooter}>
            <span className={styles.legalNotice}>Syrena Digital Agency LLC &copy; 2026</span>
            <button className={styles.confirmBtn} onClick={onClose}>
              <Check size={16} />
              <span>Acknowledge &amp; Close</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
