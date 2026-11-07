// Original pixel lettering and coastal scene; no external sprites or font requests.
const glyphs = {
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

export function paintStartup(ctx, { time = 0, phase = 'title', reduced = false, colors }) {
  const { navy, ice, blue, butter } = colors;
  const w = ctx.canvas.width;
  const h = ctx.canvas.height;
  ctx.clearRect(0, 0, w, h);
  ctx.imageSmoothingEnabled = false;
  ctx.fillStyle = navy;
  ctx.fillRect(0, 0, w, h);
  const rect = (x, y, width, height, color) => { ctx.fillStyle = color; ctx.fillRect(Math.round(x), Math.round(y), width, height); };
  function text(value, y, size, color, bounce = false) {
    const left = Math.round((w - (value.length * 6 - 1) * size) / 2);
    [...value].forEach((letter, index) => {
      const offset = bounce && !reduced ? Math.round(-Math.sin(Math.min(1, Math.max(0, (time - index * .065) / .65)) * Math.PI) * 10) : 0;
      const glyph = glyphs[letter] || glyphs[' '];
      glyph.forEach((row, py) => [...row].forEach((pixel, px) => {
        if (pixel === '1') rect(left + (index * 6 + px) * size, y + py * size + offset, size, size, color);
      }));
    });
  }
  // Sparse stars, stepped clouds, a rising sun and a little lighthouse.
  [[22,28],[69,17],[331,24],[356,69],[301,43],[34,96]].forEach(([x,y], i) => {
    rect(x, y, 2, 2, i % 2 ? blue : butter);
    if (i % 2 === 0) { rect(x-2,y+1,6,1,butter); rect(x+1,y-2,1,6,butter); }
  });
  const cloud = (x, y) => { rect(x+6,y,22,4,ice); rect(x,y+4,37,5,ice); rect(x+5,y+9,25,3,blue); };
  cloud(19, 64); cloud(320, 86);
  const progress = phase === 'playing' ? Math.min(time / 2.9, 1) : 0;
  const sunY = 150 - (reduced ? 20 : Math.min(time / 1.2, 1) * 20) - progress * 10;
  rect(291,sunY,25,25,butter); rect(296,sunY-4,15,33,butter); rect(287,sunY+5,33,15,butter);
  rect(0,155,w,h-155,'#345578');
  rect(0,155,w,2,blue);
  for (let row = 0; row < 4; row++) {
    for (let x = -20; x < w + 20; x += 56) {
      const drift = reduced ? 0 : Math.floor(time * 5) % 14;
      rect(x + (row % 2) * 22 + drift, 165 + row * 10, 22, 1, row % 2 ? blue : ice);
    }
  }
  rect(15,153,72,7,blue); rect(22,149,56,4,ice);
  rect(43,125,12,24,ice); rect(40,120,18,6,blue); rect(44,114,10,7,butter);
  rect(41,111,16,3,ice); rect(47,104,4,7,blue); rect(47,134,4,6,navy);
  [133,201,267,333].forEach((x, index) => {
    const y = 169 - (index % 2) * 9;
    rect(x,y,27,5,butter); rect(x+3,y+5,21,4,blue);
  });
  // A tiny jumping seashell travels across the platforms during the jingle.
  const shellX = phase === 'playing' ? 80 + progress * 260 : 96;
  const shellY = phase === 'playing' && !reduced ? 152 - Math.abs(Math.sin(progress * Math.PI * 4)) * 18 : 151;
  rect(shellX+3,shellY-8,9,3,ice); rect(shellX,shellY-5,15,6,ice); rect(shellX+3,shellY+1,9,3,butter);
  rect(shellX+6,shellY-6,3,7,blue);
  text('WELCOME TO OUR WORLD', 20, 1, blue);
  text('SYRENA', 45, 7, '#0b1428', true);
  text('SYRENA', 42, 7, ice, true);
  text('STUDIOS', 101, 3, butter, true);
  text(phase === 'playing' ? 'A NEW CREATIVE CURRENT' : 'PRESS START', 137, 1, phase === 'playing' ? ice : butter);
  text('BRAND   DIGITAL   PLAY', 191, 1, ice);
  // A gentle block wipe opens the gallery, without a flash.
  if (phase === 'playing' && progress > .88 && !reduced) {
    const columns = Math.ceil((progress - .88) / .12 * 24);
    for (let x = 0; x < columns; x++) rect(x * 16, 0, 16, h, navy);
  }
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
