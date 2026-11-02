
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';

const root=new URL('../',import.meta.url);
const pages=['Home','About','Services','Work','Contact','FAQ'];
for(const name of pages){
 const base='src/pages/'+name+'/'+name;
 const jsx=readFileSync(new URL(base+'.jsx',root),'utf8');
 const css=readFileSync(new URL(base+'.module.css',root),'utf8');
 for(const match of jsx.matchAll(/styles\.(\w+)/g)) assert(css.includes('.'+match[1]),name+': missing class '+match[1]);
 for(const match of jsx.matchAll(/(?:src|href)="(\/images\/[^"]+)"/g)) assert(existsSync(new URL('public'+match[1],root)),'Missing asset '+match[1]);
 assert(!/Revenue Growth|ROAS Increase|Pipeline Velocity|Guaranteed SLA|24 hours|senior partners|market dominance/i.test(jsx),name+': stale claim');
}
for(let i=1;i<=6;i++) assert(existsSync(new URL('public/videos/services/s'+i+'.mp4',root)),'Missing preserved ocean film '+i);
for(const file of ['scallop','conch','coral','seastar','jellyfish','cowrie']) assert(existsSync(new URL('public/images/sea-triggers/'+file+'.webp',root)));
for(const asset of ['studio-jellyfish.png','studio-shellphone.png','studio-daydream.png','syrena-studio-sculpture.png']) assert(existsSync(new URL('public/images/'+asset,root)));
const home=readFileSync(new URL('src/pages/Home/Home.jsx',root),'utf8');
const services=readFileSync(new URL('src/pages/Services/Services.jsx',root),'utf8');
const postcard=readFileSync(new URL('src/components/PostCard3D/PostCard3D.jsx',root),'utf8');
assert(home.includes('<PostCard3D'));
assert(services.includes('<OceanWorld')&&services.includes('<SeaObjectMorphCard'));
assert(!postcard.includes('EST. 2024'));
console.log('PASS: six page styles, local assets, retained ocean/postcard, and stale-claim checks.');


// Check shared navigation and decorative-component hooks as well.
for(const name of ['Navbar','Footer','PostCard3D']){
 const base='src/components/'+name+'/'+name;
 const jsx=readFileSync(new URL(base+'.jsx',root),'utf8');
 const css=readFileSync(new URL(base+'.module.css',root),'utf8');
 for(const [,hook] of jsx.matchAll(/styles\.(\w+)/g)) assert(css.includes('.'+hook),name+': missing class '+hook);
}
const contact=readFileSync(new URL('src/pages/Contact/Contact.jsx',root),'utf8');
assert(contact.includes('Nothing has been sent yet.'));
assert(contact.includes('navigator.clipboard.writeText(brief)'));
assert(contact.includes("encodeURIComponent(brief)"));
assert(!contact.includes('setSubmitted(true)'));
const nav=readFileSync(new URL('src/components/Navbar/Navbar.jsx',root),'utf8');
assert(nav.includes('<NavLink')&&nav.includes('<dialog')&&nav.includes('Skip to content'));
const work=readFileSync(new URL('src/pages/Work/Work.jsx',root),'utf8');
assert(work.includes('studio concept')&&work.includes('aria-pressed={filter===item}'));
console.log('PASS: shared style hooks, draft-only contact flow, semantic navigation, and labelled concept controls.');
console.log('Note: these are source checks. Browser interaction and visual review are separate checks.');
