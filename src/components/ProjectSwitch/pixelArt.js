const glyphs = {
  '0':['01110','10011','10101','10101','11001','10001','01110'], '1':['00100','01100','00100','00100','00100','00100','01110'],
  '2':['01110','10001','00001','00010','00100','01000','11111'], '3':['11110','00001','00001','01110','00001','00001','11110'],
  '4':['00010','00110','01010','10010','11111','00010','00010'], '5':['11111','10000','10000','11110','00001','00001','11110'],
  '6':['01110','10000','10000','11110','10001','10001','01110'], '7':['11111','00001','00010','00100','01000','01000','01000'],
  '8':['01110','10001','10001','01110','10001','10001','01110'], '9':['01110','10001','10001','01111','00001','00001','01110'],
  '/':['00001','00010','00010','00100','01000','01000','10000'], '-':['00000','00000','00000','11111','00000','00000','00000'],
  '.':['00000','00000','00000','00000','00000','00100','00100'], '&':['01100','10010','10100','01000','10101','10010','01101'],
  A:['01110','10001','10001','11111','10001','10001','10001'], B:['11110','10001','10001','11110','10001','10001','11110'],
  C:['01111','10000','10000','10000','10000','10000','01111'], D:['11110','10001','10001','10001','10001','10001','11110'],
  E:['11111','10000','10000','11110','10000','10000','11111'], F:['11111','10000','10000','11110','10000','10000','10000'],
  G:['01111','10000','10000','10111','10001','10001','01111'], H:['10001','10001','10001','11111','10001','10001','10001'],
  I:['11111','00100','00100','00100','00100','00100','11111'], J:['00111','00010','00010','00010','10010','10010','01100'],
  K:['10001','10010','10100','11000','10100','10010','10001'], L:['10000','10000','10000','10000','10000','10000','11111'],
  M:['10001','11011','10101','10101','10001','10001','10001'], N:['10001','11001','10101','10011','10001','10001','10001'],
  O:['01110','10001','10001','10001','10001','10001','01110'], P:['11110','10001','10001','11110','10000','10000','10000'],
  Q:['01110','10001','10001','10001','10101','10010','01101'], R:['11110','10001','10001','11110','10100','10010','10001'],
  S:['01111','10000','10000','01110','00001','00001','11110'], T:['11111','00100','00100','00100','00100','00100','00100'],
  U:['10001','10001','10001','10001','10001','10001','01110'], V:['10001','10001','10001','10001','10001','01010','00100'],
  W:['10001','10001','10001','10101','10101','11011','10001'], X:['10001','10001','01010','00100','01010','10001','10001'],
  Y:['10001','10001','01010','00100','00100','00100','00100'], Z:['11111','00001','00010','00100','01000','10000','11111'],
  ' ':['00000','00000','00000','00000','00000','00000','00000'],
};

export const ease = (value) => { const t=Math.max(0,Math.min(1,value)); return t*t*(3-2*t); };

export function pixelRect(ctx,x,y,w,h,color) {
  ctx.fillStyle=color; ctx.fillRect(Math.round(x),Math.round(y),w,h);
}

export function pixelText(ctx, value, x, y, size, color, align='left') {
  const text=String(value).toUpperCase();
  const width=(text.length*6-1)*size;
  const left=align==='center' ? x-width/2 : align==='right' ? x-width : x;
  text.split('').forEach((character,index)=>{
    (glyphs[character] || glyphs[' ']).forEach((row,py)=>{
      [...row].forEach((pixel,px)=>{
        if(pixel==='1') pixelRect(ctx,left+(index*6+px)*size,y+py*size,size,size,color);
      });
    });
  });
}

export function cloud(ctx,x,y,colors,scale=1) {
  const r=(dx,dy,w,h,color)=>pixelRect(ctx,x+dx*scale,y+dy*scale,w*scale,h*scale,color);
  r(8,0,20,5,colors.ice); r(3,5,32,6,colors.ice); r(0,11,42,5,colors.ice); r(7,16,29,2,colors.blue);
}

export function shell(ctx,x,y,colors,{step=0,facing=1,scale=1}={}) {
  ctx.save(); ctx.translate(Math.round(x),Math.round(y)); ctx.scale(facing*scale,scale);
  const r=(dx,dy,w,h,color)=>pixelRect(ctx,dx,dy,w,h,color);
  r(-8,-18,14,3,colors.ice); r(-12,-15,23,6,colors.ice); r(-14,-9,27,7,colors.ice);
  r(-10,-2,21,4,colors.butter); r(-3,-17,3,16,colors.blue); r(-9,-12,3,10,colors.blue); r(4,-12,3,10,colors.blue);
  r(11,-7,5,5,colors.butter); r(13,-6,2,2,colors.navy);
  const feet=Math.round(Math.sin(step)*2);
  r(-9+feet,2,8,3,colors.butter); r(5-feet,2,8,3,colors.butter);
  ctx.restore();
}

export function lighthouse(ctx,x,ground,colors,{door=0,beam=0,time=0,scale=1}={}) {
  ctx.save(); ctx.translate(Math.round(x),Math.round(ground)); ctx.scale(scale,scale);
  const r=(dx,dy,w,h,color)=>pixelRect(ctx,dx,dy,w,h,color);
  if(beam) {
    ctx.globalAlpha=.13;
    const side=Math.sin(time*1.4)>0 ? 1 : -1;
    for(let i=0;i<12;i++) r(18+side*i*7,-73-i/2,8,5+i,colors.butter);
    ctx.globalAlpha=1;
  }
  r(-5,0,51,6,colors.blue); r(4,-58,29,58,colors.ice); r(8,-81,21,17,colors.butter);
  r(0,-66,38,7,colors.blue); r(4,-85,30,5,colors.ice); r(13,-91,13,6,colors.blue);
  r(17,-100,4,9,colors.ice); r(18,-99,16,5,Math.sin(time*4)>0 ? colors.butter : colors.blue);
  r(15,-46,7,9,colors.navy); r(15,-27,7,9,colors.navy);
  r(12,-19,14,19,door>0 ? colors.butter : colors.navy);
  if(door) r(12+Math.round(door*12),-19,Math.max(2,14-Math.round(door*12)),19,colors.blue);
  ctx.restore();
}

export function sea(ctx,{time=0,y=170,width=480,height=254,colors,reduced=false,offset=0}) {
  pixelRect(ctx,0,y,width,height-y,'#345578');
  const t=reduced ? 0 : time;
  for(let row=0;row<8;row++) {
    const rise=Math.round(Math.sin(t*2+row*.7)*2);
    for(let x=-100;x<width+100;x+=70) {
      const drift=((t*22+offset*.25)%70+70)%70;
      pixelRect(ctx,x+drift+(row%2)*30,y+row*11+rise,24+row*2,2,row%3 ? colors.blue : colors.ice);
    }
  }
}
