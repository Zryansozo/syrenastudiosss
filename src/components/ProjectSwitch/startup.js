import { pixelText, pixelRect, cloud, shell, lighthouse, sea, ease } from './pixelArt';

export const STARTUP_DURATION = 3.1;

export function paintStartup(ctx,{time=0,phase='title',reduced=false,colors}) {
  const W=480,H=254;
  ctx.save(); ctx.scale(ctx.canvas.width/W,ctx.canvas.height/H);
  ctx.imageSmoothingEnabled=false;
  const r=(x,y,w,h,color)=>pixelRect(ctx,x,y,w,h,color);
  const text=(value,x,y,size,color,align='center')=>pixelText(ctx,value,x,y,size,color,align);
  r(0,0,W,H,colors.navy);
  const t=reduced ? 2 : time;
  const progress=phase==='playing' && !reduced ? Math.min(time/STARTUP_DURATION,1) : 0;
  const entrance=phase==='playing' && !reduced ? ease((progress-.56)/.44) : 0;
  ctx.save();
  ctx.translate(W/2,H/2); ctx.scale(1+entrance*3.4,1+entrance*3.4);
  ctx.translate(-(W/2+entrance*178),-(H/2+entrance*76));
  // All waiting-screen motion loops: the welcome stays alive after the reveal.
  [[32,26],[78,17],[429,35],[360,20],[21,118]].forEach(([x,y],i)=>{
    const sparkle=reduced ? 1 : .6+Math.sin(t*2+i)*.35;
    ctx.globalAlpha=sparkle; r(x,y,3,3,colors.butter); r(x-2,y+1,7,1,colors.butter); ctx.globalAlpha=1;
  });
  cloud(ctx,((30+t*13)%570)-45,29,colors,.55);
  cloud(ctx,((338+t*8)%570)-45,134,colors,.65);
  const sunY=149-(reduced ? 20 : Math.min(t/2,1)*20)-Math.sin(t*.8)*3;
  r(372,sunY,34,34,colors.butter); r(379,sunY-5,20,44,colors.butter); r(367,sunY+7,44,20,colors.butter);
  sea(ctx,{time:t,y:187,width:W,height:H,colors,reduced});
  r(0,224,W,30,colors.navy);
  r(12,217,100,7,colors.blue); r(17,213,92,4,colors.ice);
  const platforms=[147,213,279,345];
  platforms.forEach((x,i)=>{const y=216-i%2*7; r(x,y,37,5,colors.butter); r(x+4,y+5,29,5,colors.blue);});
  const door=ease((progress-.58)/.12);
  lighthouse(ctx,399,216,colors,{door,beam:true,time:reduced?0:t});
  let x,y;
  if(phase==='playing') {
    const run=ease(progress/.71);
    x=87+run*331;
    y=211-(reduced ? 0 : Math.abs(Math.sin(Math.min(progress/.71,1)*Math.PI*5))*31);
    ctx.globalAlpha=1-ease((progress-.68)/.08);
  } else {
    const lap=(t*.65)%4;
    x=147+lap*66;
    y=208-(reduced?0:Math.abs(Math.sin(lap*Math.PI))*29);
  }
  shell(ctx,x,y,colors,{step:t*20,scale:.8}); ctx.globalAlpha=1;
  const title='SYRENA';
  [...title].forEach((letter,i)=>{
    const reveal=reduced ? 1 : ease((t-i*.14)/.38);
    const bounce=reduced ? 0 : -Math.sin(reveal*Math.PI)*23+Math.sin(t*2+i*.7)*2;
    ctx.globalAlpha=reveal;
    text(letter,124+i*47,45+bounce,8,'#0b1428');
    text(letter,124+i*47,42+bounce,8,colors.ice);
  }); ctx.globalAlpha=1;
  text('WELCOME TO OUR WORLD',240,18,1,colors.blue);
  text('STUDIOS',240,108,3,colors.butter);
  text(phase==='playing' ? 'FOLLOW THE CURRENT' : 'PRESS START',240,153,1,colors.butter);
  ctx.restore();
  if(entrance>.83) {
    ctx.globalAlpha=ease((entrance-.83)/.17); r(0,0,W,H,colors.navy); ctx.globalAlpha=1;
  }
  r(0,H-19,W,19,colors.navy);
  text('BRAND   DIGITAL   PLAY',240,H-12,1,colors.ice);
  ctx.restore();
}

// A short original chiptune, synthesized locally after a user gesture.
export function createStartupSound() {
  let context;
  let master;
  let disposed = false;
  let generation = 0;
  const voices = new Set();
  function stop() {
    generation++;
    voices.forEach((voice) => { try { voice.stop(); } catch { /* Already ended. */ } voice.disconnect(); });
    voices.clear();
  }
  async function play() {
    stop();
    const playingGeneration = generation;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext || disposed) return false;
    try {
      if (!context) {
        context = new AudioContext();
        master = context.createGain();
        master.gain.value = .24;
        master.connect(context.destination);
      }
      await context.resume();
      if (disposed || playingGeneration !== generation || context.state !== 'running') return false;
      const start = context.currentTime + .035;
      const note = (midi, offset, length, type, level) => {
        const oscillator = context.createOscillator();
        const envelope = context.createGain();
        oscillator.type = type;
        oscillator.frequency.value = 440 * 2 ** ((midi - 69) / 12);
        envelope.gain.setValueAtTime(0, start + offset);
        envelope.gain.linearRampToValueAtTime(level, start + offset + .008);
        envelope.gain.exponentialRampToValueAtTime(.001, start + offset + length);
        oscillator.connect(envelope); envelope.connect(master);
        voices.add(oscillator);
        oscillator.onended = () => { oscillator.disconnect(); envelope.disconnect(); voices.delete(oscillator); };
        oscillator.start(start + offset); oscillator.stop(start + offset + length + .02);
      };
      [74,69,78,76,74,81,79,78,76,73,74,78,81,86].forEach((midi, i) => note(midi, i * .18, i === 13 ? .44 : .13, 'square', .11));
      [50,57,54,57,55,62,57].forEach((midi, i) => note(midi, i * .36, .23, 'triangle', .18));
      return true;
    } catch { return false; }
  }
  return { play, stop, dispose() { disposed = true; stop(); if (context && context.state !== 'closed') context.close().catch(() => {}); } };
}
