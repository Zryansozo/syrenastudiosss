
import { useEffect, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { SeaMark } from '../Studio/StudioKit';
import styles from './Navbar.module.css';
const links=[['Home','/'],['About','/about'],['Services','/services'],['Work','/work']];
export default function Navbar(){
 const location=useLocation(); const dialog=useRef(null);
 useEffect(()=>{dialog.current?.close();},[location.pathname]);
 return <><a href="#page-content" className={styles.skip}>Skip to content</a><header className={styles.header}><Link to="/" className={styles.brand} aria-label="Syrena home"><SeaMark kind="shell"/><span>syrena<span className={styles.brandDot}>.</span></span></Link><nav className={styles.desktop} aria-label="Main navigation">{links.map(([label,to])=><NavLink key={to} to={to} end={to==='/'} className={({isActive})=>isActive?styles.active:undefined}>{label}</NavLink>)}</nav><Link className={styles.contact} to="/contact">Contact <ArrowUpRight size={17}/></Link><button type="button" className={styles.menu} aria-label="Open navigation" aria-haspopup="dialog" onClick={()=>dialog.current.showModal()}><Menu size={23}/></button></header><dialog ref={dialog} className={styles.dialog} aria-labelledby="navigation-title" data-lenis-prevent onClick={e=>{if(e.target===dialog.current)dialog.current.close();}}><div className={styles.dialogTop}><span id="navigation-title">EXPLORE THE SYRENA WORLD</span><button type="button" aria-label="Close navigation" onClick={()=>dialog.current.close()} autoFocus><X size={22}/></button></div><nav aria-label="Mobile navigation">{[...links,['Contact','/contact']].map(([label,to],i)=><NavLink key={to} to={to} end={to==='/'} onClick={()=>dialog.current.close()}><span>0{i+1}</span>{label}<ArrowUpRight size={25}/></NavLink>)}</nav><div className={styles.dialogBottom}><SeaMark kind="wave"/><span>A NEW STUDIO.<br/>AN OCEAN OF POSSIBILITIES.</span></div></dialog></>;
}
