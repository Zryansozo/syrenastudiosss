import { useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArrowUpRight, Copy, Download, ArrowLeft } from 'lucide-react';
import PageTransition from '../../components/PageTransition/PageTransition';
import styles from './Contact.module.css';

export default function Contact() {
  const [params] = useSearchParams();
  const resultRef = useRef(null);
  const nameRef = useRef(null);
  const [data, setData] = useState({ name: '', email: '', phone: '', message: '' });
  const [ready, setReady] = useState(false);
  const [copyStatus, setCopyStatus] = useState('');
  const update = event => setData(previous => ({ ...previous, [event.target.name]: event.target.value }));
  const brief = [
    'Hello Syrena,', '', data.message, '',
    `Name: ${data.name}`, `Email: ${data.email}`,
    ...(data.phone ? [`Phone: ${data.phone}`] : []),
    ...(params.get('interest') ? [`Interested in: ${params.get('interest')}`] : []),
  ].join('\n');
  const mailto = `mailto:hello@syrena.agency?subject=${encodeURIComponent(`A new idea from ${data.name}`)}&body=${encodeURIComponent(brief)}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(brief);
      setCopyStatus('Brief copied. It’s ready to paste into your email.');
    } catch {
      setCopyStatus('Copy is unavailable here. You can download your brief instead.');
    }
  };
  const download = () => {
    const url = URL.createObjectURL(new Blob([brief], { type: 'text/plain;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'syrena-project-brief.txt';
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  const submit = event => {
    event.preventDefault();
    setCopyStatus('');
    setReady(true);
    requestAnimationFrame(() => resultRef.current?.focus());
  };
  const edit = () => {
    setReady(false);
    requestAnimationFrame(() => nameRef.current?.focus());
  };

  return <PageTransition>
    <div className={styles.page}>
      <section className={styles.card} aria-labelledby="contact-title">
        <h1 id="contact-title" className={styles.title}>CONTACT</h1>
        <div className={styles.contactInfo}>
          <p><strong>FOR MORE INFO, REACH OUT AT:</strong><br /><a href="mailto:hello@syrena.agency">HELLO@SYRENA.AGENCY</a></p>
          <p className={styles.studioInfo}><strong>SYRENA STUDIO</strong><br />BRANDING, DESIGN & DIGITAL</p>
        </div>
        {ready ? <div className={styles.ready}>
          <h2 ref={resultRef} tabIndex={-1}>YOUR BRIEF IS READY.</h2>
          <p>Nothing has been sent yet. Open your email draft, review it, and send it when you’re ready.</p>
          <pre data-lenis-prevent>{brief}</pre>
          <a className={styles.submit} href={mailto}>OPEN EMAIL DRAFT <ArrowUpRight size={20} aria-hidden="true" /></a>
          <div className={styles.utilityActions}><button type="button" onClick={copy}><Copy size={16} aria-hidden="true" /> Copy brief</button><button type="button" onClick={download}><Download size={16} aria-hidden="true" /> Download .txt</button></div>
          <p role="status" className={styles.fineprint}>{copyStatus}</p>
          <button className={styles.editButton} type="button" onClick={edit}><ArrowLeft size={16} aria-hidden="true" /> Back to edit</button>
        </div> : <form className={styles.form} onSubmit={submit}>
          <div className={styles.fieldGrid}>
            <label>NAME<input ref={nameRef} name="name" value={data.name} onChange={update} autoComplete="name" required maxLength={100} /></label>
            <label>EMAIL<input name="email" type="email" value={data.email} onChange={update} autoComplete="email" required maxLength={150} /></label>
          </div>
          <label>PHONE NUMBER<input name="phone" type="tel" value={data.phone} onChange={update} autoComplete="tel" maxLength={40} /></label>
          <label>MESSAGE<textarea name="message" value={data.message} onChange={update} required rows={8} maxLength={2000} /></label>
          <button type="submit" className={styles.submit}>PREVIEW MESSAGE <ArrowUpRight size={20} aria-hidden="true" /></button>
          <p className={styles.fineprint}>Preview your message, then send it through your email app.</p>
        </form>}
      </section>
    </div>
  </PageTransition>;
}
