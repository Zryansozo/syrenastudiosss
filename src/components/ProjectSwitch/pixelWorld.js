import { pixelText, pixelRect, cloud, shell, lighthouse, sea } from './pixelArt';

export const STATION_SPACING=480;
const W=480,H=254;
const mapTiles=Array.from({length:6},(_,i)=>({x:16+(i%3)*156,y:63+Math.floor(i/3)*79,w:136,h:65}));
const modulo=(value,count)=>(value%count+count)%count;

export function createPixelWorld(projects,colors,onInvalidate) {
  const canvas=document.createElement('canvas');
  canvas.width=960; canvas.height=508;
  const ctx=canvas.getContext('2d');
  const images=new Map();
  let disposed=false;
  const loading=[];
  projects.forEach(project=>{
    if(!project.image) return;
    const image=new Image(); loading.push(image);
    image.onload=()=>{if(!disposed){images.set(project.id,image);onInvalidate();}};
    image.src=project.image.src;
  });
  const r=(x,y,w,h,color)=>pixelRect(ctx,x,y,w,h,color);
  const text=(value,x,y,size=1,color=colors.ice,align='left')=>pixelText(ctx,value,x,y,size,color,align);
  function cover(image,x,y,w,h) {
    const scale=Math.max(w/image.width,h/image.height);
    ctx.save(); ctx.beginPath(); ctx.rect(x,y,w,h); ctx.clip();
    // Keep the artwork readable inside the surrounding pixel scene.
    ctx.imageSmoothingEnabled=true;
    ctx.drawImage(image,x+(w-image.width*scale)/2,y+(h-image.height*scale)/2,image.width*scale,image.height*scale);
    ctx.restore(); ctx.imageSmoothingEnabled=false;
  }
  function artwork(project,x,y,w,h) {
    const image=images.get(project.id);
    if(image){cover(image,x,y,w,h);return;}
    ctx.save(); ctx.beginPath(); ctx.rect(x,y,w,h); ctx.clip();
    r(x,y,w,h,project.id==='tideline'?colors.ice:colors.blue);
    if(project.id==='tideline') {
      r(x+w*.7,y+9,22,22,colors.butter);
      r(x,y+h*.66,w,h*.34,'#345578'); r(x,y+h*.87,w,h*.13,colors.butter);
      text('SOMEWHERE',x+9,y+17,1,colors.navy); text('BY THE SEA',x+9,y+30,1,colors.navy);
    } else {
      for(let row=0;row<9;row++) for(let col=0;col<6;col++) r(x+col*36+(row%2)*12,y+row*11,25,1,colors.ice);
      r(x+12,y+19,113,38,colors.blue);
      text('GOOD',x+18,y+22,2,colors.navy); text('CURRENTS',x+18,y+43,1,colors.navy);
    }
    ctx.restore();
  }
  function smallLabel(value,x,y,max=31) {
    const words=value.toUpperCase().replaceAll('&','AND').split(' ');
    let line='',row=0;
    words.forEach(word=>{
      if((line+' '+word).trim().length>max){text(line,x,y+row*11);line=word;row++;}
      else line=(line+' '+word).trim();
    });
    text(line,x,y+row*11);
  }
  function button(x,y,w,label,primary=false) {
    r(x,y,w,17,primary?colors.butter:'#14233f');
    r(x+2,y+2,w-4,1,primary?colors.ice:colors.blue);
    text(label,x+w/2,y+5,1,primary?colors.navy:colors.ice,'center');
  }
  function hud(selected,overview,travelling) {
    r(0,0,W,23,'#101c32'); r(0,22,W,1,colors.blue);
    text('SYRENA / COASTAL QUEST',12,8,1,colors.ice);
    text(overview?'H BACK':'H MAP',W-12,8,1,colors.butter,'right');
    r(0,H-23,W,23,'#101c32');
    if(overview) {
      text('PICK AN ISLAND TO EXPLORE',12,H-14,1,colors.ice);
      button(391,H-20,77,'H BACK');
    } else {
      button(8,H-20,59,'A PREV'); button(75,H-20,59,'D NEXT');
      text(`${String(selected+1).padStart(2,'0')} / 06`,239,H-14,1,colors.ice,'center');
      button(348,H-20,122,travelling?'OPEN DESTINATION':'OPEN PROJECT',true);
    }
  }
  function drawMap(selected,time,reduced) {
    r(0,23,W,H-23,colors.navy);
    sea(ctx,{time,y:77,width:W,height:H,colors,reduced});
    text('CHOOSE YOUR NEXT ADVENTURE',W/2,34,1,colors.butter,'center');
    // A dotted sea route links the six islands, in reading order.
    for(let i=30;i<450;i+=9) {r(i,105,3,2,colors.ice);r(i,185,3,2,colors.ice);}
    for(let y=106;y<185;y+=8) r(434,y,2,3,colors.ice);
    mapTiles.forEach((tile,index)=>{
      const {x,y,w,h}=tile,project=projects[index],active=index===selected;
      r(x+4,y+5,w-8,h-7,colors.navy);
      r(x,y+6,w,h-17,active?colors.butter:colors.blue);
      r(x+4,y+2,w-8,4,active?colors.butter:colors.blue);
      r(x+5,y+9,w-10,h-25,colors.navy);
      artwork(project,x+9,y+12,38,26);
      text(String(index+1).padStart(2,'0'),x+58,y+15,2,active?colors.butter:colors.ice);
      if(active) shell(ctx,x+w-20,y+36,colors,{scale:.48,step:reduced?0:time*7});
      r(x,y+h-21,w,14,active?colors.butter:colors.blue);
      text(project.title,x+w/2,y+h-18,1,colors.navy,'center');
      r(x+14,y+h-5,w-28,5,colors.blue);
    });
  }
  function station(project,index,x,time) {
    // A small pavilion makes each project a destination along the same shore.
    r(x-107,72,214,91,colors.blue);
    r(x-111,68,222,5,colors.butter); r(x-104,64,208,4,colors.butter);
    r(x-103,76,206,83,colors.navy);
    artwork(project,x-98,80,196,75);
    r(x-109,164,218,44,colors.navy);
    text(project.title,x,169,2,colors.ice,'center');
    smallLabel(project.category,x-101,189,33);
    r(x-105,209,210,6,colors.ice); r(x-113,215,226,7,colors.blue);
    r(x-93,222,8,7,colors.navy); r(x+85,222,8,7,colors.navy);
    // A pennant and numbered milestone identify the station in the world.
    r(x+120,137,3,77,colors.ice);
    const wave=Math.round(Math.sin(time*4+index)*2);
    r(x+123,138,23,14,colors.butter); r(x+144,140+wave,6,10,colors.butter);
    text(String(index+1).padStart(2,'0'),x+134,142,1,colors.navy,'center');
  }
  function landscape(camera,time,selected,travelling,direction,reduced) {
    r(0,23,W,H-23,colors.navy);
    const t=reduced?0:time;
    const sunX=403-Math.sin(camera/1800)*18;
    r(sunX,44,30,30,colors.butter); r(sunX+6,39,18,40,colors.butter);
    cloud(ctx,modulo(70+t*10-camera*.08,560)-45,39,colors,.8);
    cloud(ctx,modulo(330+t*6-camera*.06,560)-45,59,colors,.6);
    // Three scenery speeds give a clear sense of travelling through the bay.
    for(let i=-1;i<4;i++) {
      const x=i*195-modulo(camera*.16,195);
      r(x,100,120,18,'#2a4263'); r(x+20,88,80,12,'#2a4263'); r(x+41,78,44,10,'#2a4263');
    }
    sea(ctx,{time:t,y:118,width:W,height:H,colors,reduced,offset:camera});
    const current=Math.floor(camera/STATION_SPACING);
    for(let worldIndex=current-1;worldIndex<=current+1;worldIndex++) {
      const offset=worldIndex*STATION_SPACING-camera;
      const index=modulo(worldIndex,projects.length);
      // A segmented pier, small platforms, and a lighthouse between each stop.
      r(offset-30,216,480,14,colors.blue);
      for(let p=0;p<480;p+=32) {r(offset+p,216,28,3,colors.ice);r(offset+p+4,222,3,8,colors.navy);}
      lighthouse(ctx,offset-67,215,colors,{time:t,beam:true,scale:.58});
      station(projects[index],index,offset+280,t);
      const bob=Math.sin(t*2+index)*3;
      r(offset+106,185+bob,8,3,colors.butter);r(offset+108,182+bob,4,9,colors.butter);
    }
    const jump=travelling&&!reduced ? Math.abs(Math.sin(t*11))*17 : reduced?0:Math.abs(Math.sin(t*2.6))*4;
    shell(ctx,115,211-jump,colors,{step:t*(travelling?25:4),facing:travelling?direction:1,scale:.95});
    if(travelling) {
      r(144,49,192,13,colors.navy);
      text(`NEXT STOP / ${projects[selected].title}`,240,52,1,colors.butter,'center');
    } else {
      r(22,94,111,18,colors.navy); text('A LITTLE FURTHER',77,100,1,colors.ice,'center');
    }
  }
  return {
    canvas,
    draw({time=0,selected=0,camera=0,travelling=false,direction=1,overview=false,reduced=false,sleeping=false}) {
      ctx.save(); ctx.scale(2,2); ctx.imageSmoothingEnabled=false;
      if(overview) drawMap(selected,time,reduced); else landscape(camera,time,selected,travelling,direction,reduced);
      hud(selected,overview,travelling);
      if(sleeping) {
        r(0,0,W,H,colors.navy); text('DREAMING UP THE NEXT IDEA',240,105,2,colors.ice,'center');
        text('TAP TO WAKE',240,142,1,colors.butter,'center');
      }
      ctx.restore();
    },
    hitTest(u,v,overview) {
      const x=u*W,y=(1-v)*H;
      if(y<24 && x>397) return 'home';
      if(overview) {
        if(y>H-24) return x>385?'home':null;
        const index=mapTiles.findIndex(tile=>x>=tile.x&&x<=tile.x+tile.w&&y>=tile.y&&y<=tile.y+tile.h);
        return index<0?null:`select:${index}`;
      }
      if(y>H-24) {
        if(x<70) return 'previous';
        if(x<140) return 'next';
        if(x>340) return 'open';
        return 'home';
      }
      return 'open';
    },
    dispose() {disposed=true;loading.forEach(image=>{image.onload=null;image.onerror=null;image.src='';});images.clear();},
  };
}
