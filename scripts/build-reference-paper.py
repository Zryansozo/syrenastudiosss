"""Build real cut-paper contours from the supplied footer reference.

Offline authoring only (Pillow, NumPy, OpenCV):
  python scripts/build-reference-paper.py reference.png
The reference is used as a paper-surface texture, never a footer background.
Branding, navigation and copyright pixels are excluded from all geometry.
"""
import json
import sys
from pathlib import Path

import cv2
import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
DEST = ROOT / 'public' / 'artwork' / 'reference-paper'
DEST.mkdir(parents=True, exist_ok=True)
source = Image.open(sys.argv[1]).convert('RGB')
image = np.array(source)
height, width = image.shape[:2]
assert (width, height) == (1672, 941), 'Use the supplied 1672 × 941 reference.'
smooth = cv2.bilateralFilter(image, 5, 24, 24)
r, g, b = [smooth[:, :, i].astype(float) for i in range(3)]


def region(points):
    mask = np.zeros((height, width), np.uint8)
    cv2.fillPoly(mask, [np.array(points, np.int32)], 255)
    return mask


def trace(mask, area=3, epsilon=.55, external=False):
    mode = cv2.RETR_EXTERNAL if external else cv2.RETR_CCOMP
    contours, hierarchy = cv2.findContours(mask, mode, cv2.CHAIN_APPROX_SIMPLE)
    if hierarchy is None:
        return []

    def ring(contour):
        result = cv2.approxPolyDP(contour, epsilon, True).reshape(-1, 2)
        return result.tolist() if len(result) >= 3 else None

    pieces = []
    for index, contour in enumerate(contours):
        if hierarchy[0][index][3] != -1 or cv2.contourArea(contour) < area:
            continue
        outer = ring(contour)
        if outer is None:
            continue
        holes, child = [], hierarchy[0][index][2]
        while child != -1:
            if cv2.contourArea(contours[child]) > area:
                hole = ring(contours[child])
                if hole is not None:
                    holes.append(hole)
            child = hierarchy[0][child][0]
        pieces.append([outer, *holes])
    return pieces


# Everything outside the ocean is empty space. These selections explicitly
# exclude all UI in the supplied reference, including its different brand name.
allowed = np.full((height, width), 255, np.uint8)
allowed[:225] = 0
allowed[210:311, 45:355] = 0
allowed[270:358, 945:1665] = 0
allowed[873:930, 55:366] = 0
allowed[852:863, 55:420] = 0
visible = ((r > 22) | (g > 45)).astype(np.uint8) * 255
visible &= allowed
visible = cv2.morphologyEx(visible, cv2.MORPH_CLOSE, np.ones((3, 3), np.uint8))

# Fill shadowed interiors of the large paper pieces. Open sky inside the curl
# remains open; fine cut-out holes are retained in the raised foam layer.
base = np.zeros_like(visible)
found = cv2.findContours(visible, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)[0]
for contour in found:
    if cv2.contourArea(contour) >= 9:
        cv2.drawContours(base, [contour], 0, 255, -1)

# Include the near-black indigo ribs, whose values intentionally approach the
# sky. Their real surface texture distinguishes them from empty background.
deep_water = region([(0,480),(210,410),(350,310),(500,265),(640,300),(750,345),(835,410),
                     (815,470),(735,500),(688,548),(696,592),(730,642),(800,694),(875,725),
                     (710,737),(600,701),(450,658),(250,726),(0,745)])
base |= deep_water
base |= region([(0,695),(200,648),(430,635),(600,680),(800,738),(1000,800),(1200,790),
                (1400,740),(1672,600),(1672,941),(0,941)])
base &= allowed

front = region([(0,793),(90,767),(205,740),(322,710),(410,664),(485,620),(536,631),(600,675),
                (670,716),(780,758),(900,794),(1050,817),(1170,817),(1320,790),(1450,730),
                (1570,661),(1672,602),(1672,941),(0,941)])
mountain = region([(982,736),(1048,695),(1113,651),(1149,630),(1179,642),(1223,681),
                   (1290,719),(1338,741),(1280,766),(1040,769)]) & ~front
far = region([(0,365),(180,365),(320,445),(300,485),(0,512)])
far |= region([(1290,730),(1370,679),(1456,621),(1510,566),(1580,538),(1672,479),
               (1672,746),(1370,791)])
far &= ~front & ~mountain
surfer = region([(615,280),(643,273),(652,257),(676,250),(698,244),(714,245),(721,257),
                  (725,274),(742,289),(742,307),(753,329),(747,342),(718,333),(681,320),
                  (647,300)]) & base
paper = ((r > 95) & (r > g * .87) & (r > b * .88)).astype(np.uint8) * 255
paper = cv2.morphologyEx(paper, cv2.MORPH_CLOSE, np.ones((2, 2), np.uint8))
blue = ((r < 80) & (g > 26) & (g < 90) & (b > g * 1.15) & (b > r * 1.25)).astype(np.uint8) * 255
blue = cv2.morphologyEx(blue, cv2.MORPH_CLOSE, np.ones((3, 3), np.uint8))

layers = [dict(name='ocean-foundation', kind='water', z=0, thickness=.018, pieces=trace(base & ~surfer, 5))]
# Color-following boundaries avoid arbitrary straight seams across the paper.
# The dark foundation is continuous; each blue rib is raised above it.
for index, (low, high) in enumerate([(26,38),(38,51),(51,66),(66,91)]):
    ribs = blue & base & ~surfer & ((g >= low) & (g < high)).astype(np.uint8) * 255
    layers.append(dict(name=f'indigo-ribs-{index}', kind='ribs', z=round(.025+index*.012,3), thickness=.009, pieces=trace(ribs, 4, .5)))

foam_groups = {name: [] for name in ['distant', 'fuji', 'curl', 'foreground']}
for piece in trace(paper & base & ~surfer, 2.5, .43):
    center = np.mean(piece[0], axis=0).astype(int)
    x, y = center
    name = 'foreground' if front[y,x] else 'fuji' if mountain[y,x] else 'distant' if far[y,x] else 'curl'
    foam_groups[name].append(piece)
for name, pieces in foam_groups.items():
    if pieces:
        layers.append(dict(name=f'{name}-foam', kind='foam', z=.083, thickness=.022, pieces=pieces))

# The miniature rider and board keep their exact paper silhouette and contact
# point. The bright board and face are a second physical layer on the cutout.
layers.append(dict(name='surfer', kind='surfer', z=.11, thickness=.028, pieces=trace(surfer, 1.8, .35)))
layers.append(dict(name='surfer-paper', kind='surfer', z=.142, thickness=.015, pieces=trace(surfer & paper, 1.5, .35)))

data = dict(revision=3, width=width, height=height, layers=[layer for layer in layers if layer['pieces']])
(DEST / 'contours-v3.json').write_text(json.dumps(data, separators=(',', ':')), encoding='utf-8')
source.save(DEST / 'paper-surface.webp', 'WEBP', quality=95, method=6)

# Vector brand mark traced from the supplied circular wave stamp. It remains
# a crisp, independently rendered logo next to the real Syrena brand text.
logo = ((r[220:297, 70:146] > 65) & (g[220:297, 70:146] > 65)).astype(np.uint8) * 255
paths = []
for piece in trace(logo, .8, .3):
    path = ''
    for ring in piece:
        path += 'M' + 'L'.join(f'{x},{y}' for x, y in ring) + 'Z'
    paths.append(f'<path d="{path}"/>')
(DEST / 'wave-mark.svg').write_text('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 76 77" fill="#ded2c1" fill-rule="evenodd">'+''.join(paths)+'</svg>', encoding='utf-8')

print(f'{len(data["layers"])} depth layers, {sum(len(layer["pieces"]) for layer in data["layers"])} separate cutouts')
print(f'Texture: {(DEST / "paper-surface.webp").stat().st_size:,} bytes; contours: {(DEST / "contours-v3.json").stat().st_size:,} bytes')

# Authoring diagnostic: shows precisely which pixels become physical paper.
preview = np.zeros_like(image) + [3, 23, 38]
preview[base > 0] = image[base > 0]
preview_path = ROOT / 'papercut.local'
preview_path.mkdir(exist_ok=True)
Image.fromarray(preview.astype(np.uint8)).save(preview_path / 'reference-cutouts.png')
