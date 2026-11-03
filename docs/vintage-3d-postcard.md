# Syrena Studios — Vintage 3D Postcard Brief

## Objective

Create a convincing vintage printed postcard that floats within the existing Syrena lighthouse hero. It must be a real, responsive, two-sided 3D component that visitors can flip. The postcard should feel like an aged seaside keepsake, with tactile paper, restrained blue ink, and delicate coastal artwork.

Project: `D:\skibidi\syrena1-main (2)\syrena1-main (2)\syrena1-main`

Inspect `PostCard3D`, `Home`, and their styles before implementing. Preserve the current lighthouse background, navbar, hero copy, CTA, and surrounding website. Use the attached front and back images as layout references; build an original Syrena design rather than displaying the references as flattened cards.

## Vintage visual direction

- Use warm ivory paper, subtle irregular grain, softly aged edges, and faint variations in printed ink. Weathering should be visible but restrained, with clean, readable text.
- Pair a refined vintage serif identity with a handwritten-style personal note and small, widely spaced postal labels.
- Use navy `#091E39`, ocean blue `#0B345A`, mid blue `#21567C`, muted blue `#4C81A3`, and pale blues `#79A4C0`, `#A3BED3`, `#C0D2E0`. Add a little faded coral for illustrations and stamp details.
- Keep generous empty space, fine borders, and delicate illustrations. Avoid glossy plastic surfaces, neon colors, heavy rounded panels, or oversized modern badges.
- Give the paper a subtle visible edge and a soft directional shadow so it reads as a physical object above the sea. Avoid a conspicuous thick slab or exaggerated bevel.

## Front

1. Place a wide blue coastal scene across approximately the upper 60–65% of the postcard. Use an existing suitable coastal asset or original illustration, with a softly faded print treatment.
2. Use warm ivory paper across the lower portion and a thin inset navy border around the card.
3. Set a clear, live-text **SYRENA STUDIOS** identity in the lower center.
4. Include this exact message: **“Ideas worth keeping, from our shore to yours.”**
5. Add original, delicate coral, shell, and wave illustrations near the lower corners, leaving the identity and message clear.
6. Provide a visible “Turn over” control. The front surface may also activate the flip.

## Back

- Continue the same ivory paper, weathering, ink palette, and thin inset border.
- Divide the writing and address areas with a fine vertical line.
- Place four address lines on the right, with generous spacing.
- Add a scalloped sea-themed stamp in the upper right, a faded circular postmark, and curved wave cancellation lines.
- Include a small “POST CARD” heading and a brief handwritten-style note on the left. Suggested copy:

  > Dear curious mind,
  >
  > Some ideas arrive like the tide: quietly, then all at once. We give them shape through thoughtful brands, expressive websites, and a little sea air.
  >
  > With sea air & good ideas,
  > Syrena

- Include a working “Meet the studio” link to `/about` and a clearly visible “Flip back” button.

## True 3D interaction

- Implement separate front and back faces using CSS perspective, `transform-style: preserve-3d`, and hidden backfaces. Rotate the card 180 degrees around its vertical axis to flip; do not substitute a crossfade or an image swap.
- Separate the pointer-tilt wrapper from the flip wrapper so their transforms do not compete.
- Use a gentle resting angle and small pointer tilt, around 2–4 degrees. Reset tilt when the pointer leaves or a flip starts. Touch scrolling must remain natural.
- Animate the flip smoothly, around 600–800 ms, with restrained easing. The shadow and thin paper edge should support the sense of depth.
- Support click, tap, Enter, and Space through native buttons. Make the visible side's controls keyboard reachable and remove the hidden side from interaction and the accessibility tree.
- Transfer focus to the visible flip control after changing sides. Verify that the newly visible face is no longer inert before focusing it.
- Links and buttons inside the postcard must perform their own actions without causing an accidental flip.
- Provide visible focus rings, hover feedback, and pressed feedback. Use accessible control names.
- Respect `prefers-reduced-motion`: disable pointer tilt and floating motion and switch sides without animated rotation. Preserve every action.

## Fit with the homepage

- Make the card the hero's focal point while leaving the lighthouse visible.
- Keep the existing sea image and its crop. Adjust the postcard's size or spacing if necessary to protect the lighthouse, navigation, annotations, and supporting copy.
- Preserve enough vertical space for the tilted card's full bounds and shadow, including during a flip.
- Use responsive dimensions and readable type at desktop, tablet, and phone widths. Allow a slightly taller card on phones if required for comfortable reading.
- Keep decorative artwork and grain non-interactive with `pointer-events: none`. Do not obstruct links, scrolling, or the flip controls.
- Build the typography, controls, borders, and postal layout in HTML/CSS. Small original SVG illustrations are appropriate for scalable coastal details.

## Acceptance checks

- Check both faces at 1440px desktop, 768px tablet, and 390px and 320px phone widths.
- Confirm that the lighthouse remains visible and the card never collides with the navbar or hero copy.
- Verify both directions of the 3D flip by pointer and keyboard, focus transfer, visible focus states, and the `/about` link.
- Verify that only the visible face is focusable and that touch interactions do not block page scrolling.
- Check reduced-motion mode, repeated flips, pointer exit, and resize behavior.
- Confirm that paper texture does not reduce text contrast and that the result visibly reads as a vintage printed postcard.
- Run the production build and relevant lint checks. Remove temporary QA pages and test artifacts before finishing.

## Expected deliverable

An implemented and tested vintage 3D postcard in this exact local project, with a concise report of changed files, checks performed, and any remaining limitations. This document is the design and implementation brief; it is not evidence that every acceptance check has already passed.

## Implementation record — 4 November 2026

Implemented in `PostCard3D.jsx` and `PostCard3D.module.css`, with a small paper-grain SVG asset and responsive spacing adjustments in `Home.module.css`.

- Original coastal print, coral and shell artwork, live Syrena typography, aged ivory paper, and a fine printed border.
- Postal back with a handwritten-style note, four address lines, scalloped sea stamp, faded postmark, working About link, and visible flip-back button.
- Separate perspective, tilt, and flip layers; two paper faces and a thin physical edge. Focus transfers after the rotation completes, and hidden controls are inert.
- Headless Edge checks passed at 1440, 768, 390, and 320 pixels: both faces fit, no horizontal overflow, and the card clears the hero copy. Visual checks confirmed the lighthouse stays visible.
- Passed mouse, native touch, Enter/Space, focus transfer, hidden-side Tab exclusion, pointer tilt/reset, touch scrolling, About navigation, mobile menu, hero CTA, and reduced-motion checks.
- Production build, component lint, and whitespace checks passed. The build retains an existing size warning for the Services bundle.

The Windows test environment requests reduced motion. The card respects that setting and switches sides immediately; the full animated rotation was also checked with reduced motion disabled in browser emulation. Phone checks used browser emulation rather than physical devices.
