// Original RGBA artwork, kept intact. Sheet regions are selected by mesh UVs:
// no re-drawn silhouettes, flattened collage, or extra image downloads per prop.
const root = '/images/ocean-puppets/';
const sheet = (file, rect, outline) => ({
  url: `${root}${file}.png`, width: 1448, height: 1086, rect, outline,
});
const single = (file, width, height, rect) => ({ url: `${root}${file}.png`, width, height, rect });
const scrapbook = 'blue_ocean_scrapbook_sticker_sheet';
const clipart = 'blue_ocean_clipart_elements';
const coral = 'vintage_indigo_seaweed_and_coral_clipart_set';
const doodles = 'nautical_blue_doodle_sticker_sheet';

export const oceanArtwork = {
  seahorse: single('vintage_blue_engraved_seahorse_sticker', 1086, 1448, [192, 24, 711, 1416]),
  jellyfish_large: single('watercolor_blue_jellyfish_sticker', 1086, 1448, [48, 16, 1038, 1432]),
  scallop_shell: single('vintage_indigo_engraved_scallop_shell', 1254, 1254, [16, 80, 1228, 1116]),
  starfish_large: single('vintage_indigo_starfish_sticker', 1254, 1254, [8, 48, 1238, 1184]),
  starfish_small: sheet(scrapbook, [267, 20, 181, 178], [
    [0,0],[1,0],[1,.89],[.9,1],[.22,1],[.22,.76],[0,.74],
  ]),
  nautilus_shell: sheet('vintage_blue_ocean_sticker_collection', [922, 744, 425, 342]),
  coral_cream: sheet(coral, [12, 0, 706, 836], [
    [0,.42],[.12,.26],[.36,.16],[.49,0],[.66,.02],[.65,.22],
    [.87,.25],[.94,.42],[.96,.63],[1,.75],[.89,.88],[.63,1],[.34,.97],[.03,.83],
  ]),
  coral_blue: sheet(coral, [680, 10, 245, 715]),
  seaweed: sheet(coral, [1210, 88, 238, 636]),
  postcard_wave: sheet(scrapbook, [8, 592, 332, 252]),
  postcard_palm: sheet(scrapbook, [538, 602, 350, 217]),
  postcard_sailboat: sheet('vintage_blue_ocean_scrapbook_collage', [576, 556, 794, 530], [
    [.02,.23],[.07,.13],[.30,0],[.48,.05],[.63,0],[.63,.08],
    [.92,.04],[.95,.40],[1,.83],[.97,.91],[.32,1],[.07,1],[.04,.68],
  ]),
  paper_cream: sheet(scrapbook, [348, 830, 344, 128]),
  paper_blue: sheet(scrapbook, [1090, 842, 344, 114], [
    [0,0],[.24,0],[.56,.10],[.90,.25],[1,.20],[1,1],[0,1],
  ]),
  paper_wave_torn: sheet(scrapbook, [692, 812, 404, 136], [
    [0,.15],[.10,0],[.5,.02],[.59,.18],[.75,.24],[1,.35],[1,1],[0,1],
  ]),
  paper_tape: sheet(scrapbook, [960, 946, 136, 136]),
  doodle_waves: sheet(doodles, [1024, 632, 408, 231]),
  doodle_heart: sheet(doodles, [406, 70, 186, 275]),
  doodle_orbit: sheet(doodles, [641, 405, 555, 321], [
    [0,.72],[.12,.33],[.35,.06],[.64,0],[.95,.17],[1,.31],[.9,.58],[.63,.87],[.29,1],[.04,.99],
  ]),
  bubble_large: sheet(clipart, [46, 16, 368, 350]),
  bubble_small: sheet(clipart, [992, 90, 182, 178]),
  bubble_pearl: sheet(clipart, [586, 358, 184, 184]),
  fish_one: sheet(clipart, [773, 566, 302, 140]),
  fish_two: sheet(clipart, [1090, 604, 190, 102]),
  fish_three: sheet(clipart, [1209, 714, 199, 107]),
};

export function applyArtworkUV(geometry, artwork) {
  const [x, y, w, h] = artwork.rect;
  const uv = geometry.attributes.uv;
  for (let i = 0; i < uv.count; i++) {
    uv.setXY(i, (x + uv.getX(i) * w) / artwork.width,
      1 - (y + (1 - uv.getY(i)) * h) / artwork.height);
  }
  return geometry;
}
