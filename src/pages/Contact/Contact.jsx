
import { useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArrowUpRight, Copy, Download, Check, ArrowLeft } from 'lucide-react';
import PageTransition from '../../components/PageTransition/PageTransition';
import { Eyebrow, SeaMark } from '../../components/Studio/StudioKit';
import styles from './Contact.module.css';
const interests=['Brand identity','Web & digital','Content & social','Search & campaigns','Not sure yet'];
export default function Contact(){
 const [params]=useSearchParams(); const formRef=useRef(null);
 const [data,setData]=useState({name:'',email:'',company:'',interest:params.get('interest')||'Not sure yet',budget:'',message:''});
 const [ready,setReady]=useState(false); const [copyStatus,setCopyStatus]=useState('');
 const update=e=>setData({...data,[e.target.name]:e.target.value});
 const brief=['Hello Syrena,','',data.message,'','Name: '+data.name,'Email: '+data.email,'Brand / idea: '+(data.company||'To explore'),'Interested in: '+data.interest,'Budget / timing: '+(data.budget||'To discuss')].join('\n');
 const mailto='mailto:hello@syrena.agency?subject='+encodeURIComponent('A new idea from '+data.name)+'&body='+encodeURIComponent(brief);
 const copy=async()=>{try{await navigator.clipboard.writeText(brief);setCopyStatus('Brief copied. Paste it into your email when you’re ready.');}catch{setCopyStatus('Copy is unavailable here. You can download your brief instead.');}};
 const download=()=>{const url=URL.createObjectURL(new Blob([brief],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='syrena-project-brief.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
 const submit=e=>{e.preventDefault();setReady(true);requestAnimationFrame(()=>formRef.current?.focus());};
 return <PageTransition><div className="studio-page">
  <header className={'studio-wrap studio-page-heading '+styles.header}><div><Eyebrow>A MESSAGE IN A BOTTLE, MINUS THE BOTTLE</Eyebrow><h1>We’re all<br/><em>shell ears.</em></h1><p>An idea, a question, a slightly wild “what if?” Start wherever you are. We’d love to explore it with you.</p></div><img src="/images/studio-shellphone.png" alt="A pearlescent conch shell telephone with a lilac cord and yellow starfish" width="1024" height="1024" fetchPriority="high"/></header>
  <section className={'studio-wrap studio-section '+styles.contactGrid}>
   <aside className={styles.aside}><Eyebrow>LET’S FIND YOUR CURRENT</Eyebrow><h2>Big idea?<br/><em>Little spark?</em></h2><p>You don’t need all the answers. A little context gives us a good place to start.</p><a href="mailto:hello@syrena.agency" className={styles.email}>hello@syrena.agency <ArrowUpRight size={17}/></a><div className={styles.note}><SeaMark kind="shell"/><h3>A studio taking shape.</h3><p>Syrena is at the beginning of its journey. We’re here for thoughtful conversations about what we could create together.</p></div><p className="studio-fineprint">The brief builder stays in your browser. It doesn’t submit your information to a server.</p></aside>
   <div className={styles.formCard} ref={formRef} tabIndex={-1}>
    {ready?<div className={styles.ready}><span className={styles.readyIcon}><Check size={28}/></span><Eyebrow>YOUR FIRST RIPPLE</Eyebrow><h2>Your brief<br/><em>is ready.</em></h2><p>Nothing has been sent yet. Open the draft in your email app, review it, and send it when you’re ready.</p><pre>{brief}</pre><a className="studio-action" href={mailto}>Open email draft <ArrowUpRight size={18}/></a><div className={styles.utilityActions}><button type="button" onClick={copy}><Copy size={16}/> Copy brief</button><button type="button" onClick={download}><Download size={16}/> Download .txt</button></div><p role="status" className="studio-fineprint">{copyStatus}</p><button className={styles.editButton} type="button" onClick={()=>setReady(false)}><ArrowLeft size={16}/> Back to edit</button></div>
    :<form onSubmit={submit}><div className={styles.formTop}><Eyebrow>A LITTLE ABOUT YOUR IDEA</Eyebrow><span>01 / SAY HELLO</span></div><fieldset><legend>What are you thinking about?</legend><div className={styles.pills}>{interests.map(item=><button type="button" aria-pressed={data.interest===item} key={item} onClick={()=>setData({...data,interest:item})}>{item}</button>)}</div></fieldset><div className={styles.fieldGrid}><label>Your name <span aria-hidden="true">*</span><input name="name" value={data.name} onChange={update} autoComplete="name" placeholder="What should we call you?" required maxLength={100}/></label><label>Your email <span aria-hidden="true">*</span><input name="email" type="email" value={data.email} onChange={update} autoComplete="email" placeholder="you@example.com" required maxLength={150}/></label></div><label>Brand, business, or idea <span className={styles.optional}>(optional)</span><input name="company" value={data.company} onChange={update} autoComplete="organization" placeholder="Already named, or still a work in progress" maxLength={150}/></label><label>Budget or timing <span className={styles.optional}>(optional)</span><input name="budget" value={data.budget} onChange={update} placeholder="A rough idea is absolutely fine" maxLength={150}/></label><label>Tell us a little more <span aria-hidden="true">*</span><textarea name="message" value={data.message} onChange={update} required rows={5} maxLength={2000} placeholder="What would you like to create? What’s on your mind?"/></label><p className="studio-fineprint">Required fields are marked *. Next, you’ll review a brief you can email, copy, or download. This form does not send anything automatically.</p><button type="submit" className="studio-action">Create my brief <ArrowUpRight size={18}/></button></form>}
   </div>
  </section>
  <div className={'studio-wrap '+styles.bottomNote}><SeaMark kind="wave"/><span>EVERY NEW CURRENT STARTS SOMEWHERE.</span></div>
 </div></PageTransition>;
}
