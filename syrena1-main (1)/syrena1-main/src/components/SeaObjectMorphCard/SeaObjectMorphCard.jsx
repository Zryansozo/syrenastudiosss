import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { acquireOceanStage } from '../OceanWorld/oceanStage';
import styles from './SeaObjectMorphCard.module.css';

/**
 * Sea-object trigger for service videos.
 *
 * Important interaction model:
 *  1. The marine object is visible as a standalone physical trigger.
 *  2. First click opens that card and starts its video from the beginning.
 *  3. The video owns its native playback state, so opening another card NEVER
 *     closes or resets an already-open card.
 *  4. The trigger object remains visible as a small toggle on the open card.
 *     Click it a second time to close that card and return to the object state.
 *
 * There is intentionally NO shell -> card morph.
 */
function createVideoPlayer(root) {
  const stage = acquireOceanStage(root.closest('[data-ocean-section]'));
  const video = document.createElement('video');
  video.muted = true;
  video.defaultMuted = true;
  video.playsInline = true;
  video.setAttribute('playsinline', '');
  video.setAttribute('webkit-playsinline', '');
  video.crossOrigin = 'anonymous';
  video.preload = 'auto';
  video.loop = false;
  // Keep the native media element inspectable; its pixels are composited by
  // the shared stage with the original chroma-key shader.
  video.hidden = true;
  video.setAttribute('aria-hidden', 'true');
  root.appendChild(video);

  const texture = new THREE.VideoTexture(video);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uVideo: { value: texture },
    },
    transparent: true,
    depthWrite: false,
    depthTest: false,
    side: THREE.DoubleSide,
    toneMapped: false,
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform sampler2D uVideo;
      varying vec2 vUv;

      vec3 rgbToYuv(vec3 c) {
        return vec3(
          dot(c, vec3(0.299, 0.587, 0.114)),
          dot(c, vec3(-0.14713, -0.28886, 0.436)),
          dot(c, vec3(0.615, -0.51499, -0.10001))
        );
      }

      float greenKey(vec3 c) {
        float greenDominance = c.g - max(c.r, c.b);
        float saturation = max(c.r, max(c.g, c.b)) - min(c.r, min(c.g, c.b));
        float chromaGreen = smoothstep(0.025, 0.115, greenDominance);
        float saturated = smoothstep(0.065, 0.18, saturation);
        float vividGreen = smoothstep(0.16, 0.46, c.g) * smoothstep(0.08, 0.22, greenDominance);
        return clamp(max(chromaGreen * saturated, vividGreen), 0.0, 1.0);
      }

      void main() {
        vec4 px = texture2D(uVideo, vUv);
        float key = greenKey(px.rgb);

        // Neutralise green spill before lowering alpha so the perimeter stays clean.
        float neutral = max(px.r, px.b);
        px.g = mix(px.g, min(px.g, neutral * 1.02 + 0.008), key * 0.92);

        // Soft, anti-aliased transparency around the keyed studio background.
        float alpha = 1.0 - smoothstep(0.12, 0.58, key);

        // Protect near-white paper from being interpreted as chroma green.
        float paperLight = smoothstep(0.72, 0.98, dot(px.rgb, vec3(0.299, 0.587, 0.114)));
        alpha = mix(alpha, 1.0, paperLight * 0.06);

        if (alpha < 0.012) discard;
        gl_FragColor = vec4(px.rgb, alpha);
      }
    `,
  });

  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
  const surface = stage.register(mesh);
  let playGeneration = 0;
  let destroyed = false;
  let endedHandler = null;
  let errorHandler = null;
  let metadataHandler = null;

  const removePlaybackListeners = () => {
    if (endedHandler) {
      video.removeEventListener('ended', endedHandler);
      endedHandler = null;
    }
    if (errorHandler) {
      video.removeEventListener('error', errorHandler);
      errorHandler = null;
    }
    if (metadataHandler) {
      video.removeEventListener('loadedmetadata', metadataHandler);
      metadataHandler = null;
    }
  };

  const play = async (root, src, onStarted, onEnded, onError) => {
    const generation = ++playGeneration;
    surface.attach(root);
    removePlaybackListeners();

    video.pause();
    video.loop = false;

    // Reuse the same video element. Swapping the source does not unmount the
    // element, so card/UI animations cannot accidentally terminate playback.
    video.removeAttribute('src');
    video.load();
    video.src = src;
    video.preload = 'auto';
    video.load();

    metadataHandler = () => {
      // Keep the start position tied to the media's own timeline.
      try {
        video.currentTime = 0;
      } catch {
        // Ignore metadata/teardown races; a newly loaded source starts at 0.
      }
      texture.needsUpdate = true;

    };

    endedHandler = () => {
      // Render once more after the browser transitions to ended so the actual
      // final decoded frame remains visible.

      texture.needsUpdate = true;

      onEnded?.();
    };

    errorHandler = () => {
      surface.close();
      onError?.(video.error);
    };

    video.addEventListener('loadedmetadata', metadataHandler, { once: true });
    video.addEventListener('ended', endedHandler, { once: true });
    video.addEventListener('error', errorHandler, { once: true });

    try {
      // Playback duration is owned entirely by HTML5 video. There is no
      // fixed timer/fixed GSAP duration governing when the video ends.
      await video.play();
      if (destroyed || generation !== playGeneration) return false;
      onStarted?.();
      texture.needsUpdate = true;


      return true;
    } catch (error) {
      if (destroyed || generation !== playGeneration) return false;
      removePlaybackListeners();
      surface.close();
      console.warn(`Unable to play service video: ${src}`, error);
      onError?.(error);
      return false;
    }
  };

  const close = () => {
    ++playGeneration;
    removePlaybackListeners();
    video.pause();
    surface.close();
    try {
      video.currentTime = 0;
    } catch {
      // Ignore reset errors while a source is being unloaded.
    }
    video.removeAttribute('src');
    video.load();
  };

  const destroy = () => {
    destroyed = true;
    close();
    texture.dispose();
    material.dispose();
    mesh.geometry.dispose();
    surface.destroy();
    stage.release();
    video.remove();
    video.removeAttribute('src');
    video.load();
  };

  return { video, play, close, destroy };
}

export default function SeaObjectMorphCard({
  videoSrc,
  objectSrc,
  objectLabel = 'Marine trigger object',
  objectSize = 0.54,
  objectLift = 0,
  objectRotation = 0,
}) {
  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const playerRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    const trigger = triggerRef.current;
    if (!root || !trigger) return undefined;

    const player = createVideoPlayer(root);
    playerRef.current = player;

    let cancelled = false;
    let interactionToken = 0;

    const enter = () => {
      trigger.dataset.hovered = 'true';
    };

    const leave = () => {
      trigger.dataset.hovered = 'false';
      trigger.style.setProperty('--mx', '0px');
      trigger.style.setProperty('--my', '0px');
      trigger.style.setProperty('--rx', '0deg');
      trigger.style.setProperty('--ry', '0deg');
    };

    const open = async () => {
      if (cancelled || root.dataset.state === 'opening' || root.dataset.state === 'playing') return;

      const token = ++interactionToken;
      root.dataset.state = 'opening';
      trigger.dataset.playing = 'true';

      const ok = await player.play(
        root,
        videoSrc,
        () => {
          if (cancelled || token !== interactionToken) return;
          root.dataset.state = 'playing';
        },
        () => {
          if (cancelled || token !== interactionToken) return;
          root.dataset.state = 'complete';
        },
        () => {
          if (cancelled || token !== interactionToken) return;
          root.dataset.state = 'error';
          delete trigger.dataset.playing;
        },
      );

      if (!ok && !cancelled && token === interactionToken) {
        root.dataset.state = 'shell';
        delete trigger.dataset.playing;
      }
    };

    const close = () => {
      if (cancelled) return;
      ++interactionToken;
      player.close();
      root.dataset.state = 'shell';
      delete trigger.dataset.playing;
      trigger.focus({ preventScroll: true });
    };

    const toggle = (event) => {
      event.stopPropagation();
      if (root.dataset.state === 'shell' || root.dataset.state === 'error') {
        open();
        return;
      }
      if (root.dataset.state === 'opening' || root.dataset.state === 'playing' || root.dataset.state === 'complete') {
        close();
      }
    };

    const onKeyDown = (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        toggle(event);
      }
    };

    // Opening a different card does not affect this card. Each card owns its
    // own player, so an already-open card stays open while siblings are revealed.
    trigger.addEventListener('mouseenter', enter, { passive: true });
    trigger.addEventListener('mouseleave', leave, { passive: true });
    trigger.addEventListener('focus', enter, { passive: true });
    trigger.addEventListener('blur', leave, { passive: true });
    trigger.addEventListener('click', toggle);
    trigger.addEventListener('keydown', onKeyDown);

    return () => {
      cancelled = true;
      trigger.removeEventListener('mouseenter', enter);
      trigger.removeEventListener('mouseleave', leave);
      trigger.removeEventListener('focus', enter);
      trigger.removeEventListener('blur', leave);
      trigger.removeEventListener('click', toggle);
      trigger.removeEventListener('keydown', onKeyDown);
      player.destroy();
      playerRef.current = null;
    };
  }, [videoSrc]);

  const style = {
    '--object-size': `${Math.max(0.28, Math.min(0.7, objectSize)) * 100}%`,
    '--object-lift': `${objectLift}px`,
    '--object-rotation': `${objectRotation * 57.2958}deg`,
  };

  return (
    <div ref={rootRef} className={styles.root} data-state="shell" style={style}>
      <button
        ref={triggerRef}
        className={styles.trigger}
        type="button"
        data-sea-trigger
        aria-label={`${objectLabel}: click to play; click again to close`}
      >
        <span className={styles.objectShadow} aria-hidden="true" />
        <img
          className={styles.object}
          src={objectSrc}
          alt=""
          draggable="false"
          aria-hidden="true"
        />
      </button>
    </div>
  );
}
