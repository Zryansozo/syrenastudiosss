# Shared ocean and lighthouse implementation

Services retains its six existing SeaObjectMorphCard triggers and keyed video artwork. OceanWorld and the six native players lease one section-scoped Three.js stage (oceanStage.js): one scene, orthographic camera, WebGL canvas, renderer, section pointer controller, and GSAP ticker callback. No per-card render loops remain. The canvas covers only the visible viewport slice of the continuous world, limiting mobile GPU allocation. The stage pauses rendering offscreen or in hidden tabs and disposes textures, geometry, observers, listeners, and its ticker callback on the last release.

The original chroma-key shader and native video lifecycle are retained. Each card independently plays, completes on `ended`, and closes/resets on its second trigger click. Opening other cards does not reset existing media or environmental animation. Playback generation guards prevent late play promises from reopening a closed card.

Supplied pack textures remain individual assets. The source PNG crops include baked sheet backgrounds and neighboring artwork despite the pack describing them as transparent. Scene silhouette geometry masks the crops without replacing their pixels. The boat uses the project's existing boat artwork, split into separately masked hull and sail. The supplied lighthouse PNG is copied unchanged and displayed through separate body and lantern CSS masks. The reference collage is no longer used as the Services background.

Lighthouse links keep their destinations. Targeting uses actual row/lamp rectangles and clamps vertical-difference rotation to -7 through +7 degrees. Focus-visible and hover share the controller, with keyboard focus taking precedence. Only the lantern and beam rotate. Idle motion is recreated from its current pose after interaction to avoid killed-tween resume failures. Reduced motion disables idle and makes targeting immediate.

## Verification

- Production build passes.
- Oxlint passes with existing unrelated warnings (unused imports/variables and existing effect/export warnings).
- Browser: one Services canvas with all six cards open simultaneously; no console errors.
- Native media observed playing independently, then all six reached `currentTime === duration` and `ended === true`.
- Actual S1-S6 durations: 5.955625, 4.352535, 5.948993, 1.482309, 5.965833, 5.968698 seconds.
- All six second clicks returned their cards to `shell`.
- 390px mobile: no horizontal page overflow, one shared canvas, lighthouse left of navigation, beam visible, keyboard focus ring preserved.
- Desktop keyboard targeting: About Studio -4.75672 degrees; Get in Touch +4.17047 degrees. Lantern and beam transforms matched; body transform remained `none`.
- Pointer parallax, independent puppet poses, resize handling, reduced-motion behavior, and disposal verified in implementation. Reduced-motion system preference was not changed during browser QA.

The existing Vite large-bundle warning remains; this work reuses the installed Three.js and GSAP dependencies.

## Puppet-motion follow-up

Replaced centre-based drifting with mounting-point rigs, independent pendulum sway and yaw, a sail parented to the boat rig, and offset silhouette shadows. Closed service triggers now move independently through CSS individual transforms driven by the same stage ticker; open-card controls keep their stable existing placement. Mobile/tablet reduce amplitude rather than slowing motion to a near standstill.

The verification browser reported reduced motion enabled. Added a keyboard-accessible ocean motion opt-in/pause button; system preference remains the default and no OS settings are changed. A clean page-load check confirmed that enabling motion advances the clock and produces six different changing object poses. Opening S1 continued native playback with one canvas while the puppet clock advanced. Build/lint passed with existing unrelated warnings.

## Immersive composition and lighthouse follow-up

Built richer perimeter clusters from the existing individual asset pack: overlapping torn paper and postcards, foreground shell/starfish framing, receding coral and small individually masked fish. Kept the center dark and unobstructed by added decorations. Distant layers use softened texture sampling, lower contrast and opacity; near paper layers receive a thin exposed edge and restrained cast shadows. Added one lightweight atmospheric plane and a 36-point suspended-particle draw, both updated by the existing stage ticker. No extra renderer, canvas, camera, postprocessing targets, or animation loops. Puppet rigs and native card playback are preserved, with subtle depth breathing for the seahorse/jellyfish.

Reworked the supplied lighthouse artwork into separate fixed tower, balcony and roof layers, with a pivoting lantern room, translucent panes, structural framing and an ivory internal light. A navy/ivory print filter and paper grain give the retained artwork a matte illustrated character. Beam/head share the lamp-centered pivot and remain constrained to +/-7 degrees. Navigation destinations and layout are retained.

Final browser checks: one world and canvas with all six videos playing concurrently; all six reached their native durations and ended; second activation reset all six to shell. At 390px there was no horizontal overflow, the lighthouse remained on the left, its tower transform was none, and focus illuminated the Capabilities row. Fresh preview reported no console errors. Production build passed; lint retains previously documented unrelated warnings.

## Transparent puppet artwork update

The ten new PNGs from the user already had genuine RGBA transparency, so their pixels were kept intact and copied into `public/images/ocean-puppets`. The old pack remains only for the deep navy paper bed and the existing boat/sail rig. `oceanArtwork.js` selects individual props from the new transparent sheets through texture UV regions; the same source texture is reused for multiple props. Paper thickness and cast shadows now follow the original PNG alpha, avoiding rectangular backing planes. A small alpha cutoff removes low-opacity edge specks. Asset crops were checked against the source sheet and refined to exclude neighboring stickers.

The existing shared stage still drives all puppet, bubble, fish, coral, sail, card and pointer motion with one renderer, camera, scene, and GSAP ticker callback. A fresh desktop browser run confirmed one ocean world and canvas while S1–S6 played to their native `ended` events; second activations returned all six to `shell`. Puppet poses continued changing and browser console had no errors. At a true 390px CSS viewport, the page width stayed within the viewport, one ocean world/canvas remained, and the transparent jellyfish/coral/bubbles rendered against the ocean without opaque image rectangles. Production build and lint passed; lint retains the unrelated existing warnings and Vite retains its large bundle warning.
