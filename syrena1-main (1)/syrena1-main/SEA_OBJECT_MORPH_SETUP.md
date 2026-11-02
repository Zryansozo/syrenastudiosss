# Sea Object Trigger / Persistent Toggle

The six marine objects are **triggers only**. There is no shell-to-card morph.

## Interaction

- First click on a marine object: opens that service card and starts its video at `0`.
- The video plays through the real `ended` event.
- The clicked marine object remains visible as a small physical toggle on the open card.
- Clicking that same object again closes only that card and returns it to its original trigger state.
- Opening another service card does **not** close, reset, or replace an already-open card.
- Each card owns its own Three.js `VideoTexture`, renderer, and video element, so multiple cards can remain open simultaneously.
- Hover adds tilt, lift, and a short tactile jitter.

## Video / Chroma

The video is rendered through a Three.js shader with green-screen removal and despill. The render loop runs only while the video is playing, then renders the last frame once it ends.

## Files

`src/components/SeaObjectMorphCard/SeaObjectMorphCard.jsx`
`src/components/SeaObjectMorphCard/SeaObjectMorphCard.module.css`

Service videos live in `public/videos/services/s1.mp4` through `s6.mp4`.
