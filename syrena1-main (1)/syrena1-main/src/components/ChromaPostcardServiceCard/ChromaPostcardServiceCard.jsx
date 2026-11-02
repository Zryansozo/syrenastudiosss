import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import styles from './ChromaPostcardServiceCard.module.css';

const DEFAULT_SOURCE_WIDTH = 1176;
const DEFAULT_SOURCE_HEIGHT = 2016;
const DEFAULT_MAX_PROCESS_WIDTH = 420;

function drawChromaFrame(video, canvas, ctx) {
  if (
    video.readyState < 2 ||
    canvas.width === 0 ||
    canvas.height === 0
  ) {
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  const image = ctx.getImageData(
    0,
    0,
    canvas.width,
    canvas.height
  );

  const data = image.data;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    const dominance = g - Math.max(r, b);
    const saturation = g - (r + b) * 0.5;

    if (dominance <= 24 || saturation <= 10) {
      continue;
    }

    const keyStrength = Math.min(
      1,
      Math.max(0, (dominance - 24) / 72) * 0.78 +
        Math.max(0, (saturation - 10) / 90) * 0.22
    );

    // Green spill suppression around the key edge.
    if (keyStrength > 0.12) {
      data[i + 1] = Math.min(
        g,
        Math.max(r, b) + 12
      );
    }

    data[i + 3] = Math.round(
      (1 - keyStrength) * 255
    );

    if (keyStrength > 0.72) {
      data[i + 3] = 0;
    }
  }

  ctx.putImageData(image, 0, 0);
}

export default function ChromaPostcardServiceCard({
  videoSrc,
  ariaLabel = 'Animated service postcard',
}) {
  const cardRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const frameCallbackRef = useRef(null);
  const hoverTweenRef = useRef(null);

  useEffect(() => {
    const card = cardRef.current;
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!card || !video || !canvas) {
      return undefined;
    }

    const ctx = canvas.getContext('2d', {
      alpha: true,
      willReadFrequently: true,
    });

    if (!ctx) {
      return undefined;
    }

    let isVisible = true;
    let destroyed = false;
    let usingVideoFrameCallback = false;

    const sourceWidth =
      video.videoWidth || DEFAULT_SOURCE_WIDTH;
    const sourceHeight =
      video.videoHeight || DEFAULT_SOURCE_HEIGHT;
    const aspect = sourceWidth / sourceHeight;

    const resize = () => {
      const width = card.clientWidth;

      if (!width) {
        return;
      }

      const processWidth = Math.min(
        width,
        DEFAULT_MAX_PROCESS_WIDTH
      );
      const processHeight = Math.max(
        1,
        Math.round(processWidth / aspect)
      );

      canvas.width = processWidth;
      canvas.height = processHeight;
    };

    const processFrame = () => {
      if (destroyed || !isVisible) {
        return;
      }

      drawChromaFrame(video, canvas, ctx);

      if (!('requestVideoFrameCallback' in HTMLVideoElement.prototype)) {
        rafRef.current = requestAnimationFrame(processFrame);
      }
    };

    const scheduleVideoFrame = () => {
      if (destroyed || !isVisible) {
        return;
      }

      drawChromaFrame(video, canvas, ctx);

      if (
        typeof video.requestVideoFrameCallback === 'function'
      ) {
        usingVideoFrameCallback = true;
        frameCallbackRef.current =
          video.requestVideoFrameCallback(
            scheduleVideoFrame
          );
      }
    };

    const startRendering = () => {
      cancelAnimationFrame(rafRef.current);

      if (
        typeof video.requestVideoFrameCallback === 'function'
      ) {
        scheduleVideoFrame();
      } else {
        usingVideoFrameCallback = false;
        processFrame();
      }
    };

    const stopRendering = () => {
      cancelAnimationFrame(rafRef.current);

      if (
        usingVideoFrameCallback &&
        typeof video.cancelVideoFrameCallback === 'function' &&
        frameCallbackRef.current != null
      ) {
        video.cancelVideoFrameCallback(
          frameCallbackRef.current
        );
        frameCallbackRef.current = null;
      }
    };

    const setVisibility = (visible) => {
      isVisible = visible;

      if (visible) {
        video.play().catch(() => {});
        startRendering();
      } else {
        stopRendering();
        video.pause();
      }
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(card);

    const intersectionObserver =
      new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          setVisibility(entry?.isIntersecting ?? true);
        },
        {
          root: null,
          rootMargin: '250px 0px',
          threshold: 0,
        }
      );

    intersectionObserver.observe(card);

    const handleMetadata = () => {
      resize();
    };

    video.addEventListener(
      'loadedmetadata',
      handleMetadata
    );

    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.autoplay = true;

    resize();
    video.play().catch(() => {});
    startRendering();

    return () => {
      destroyed = true;
      stopRendering();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      video.removeEventListener(
        'loadedmetadata',
        handleMetadata
      );
    };
  }, [videoSrc]);

  useEffect(() => {
    const card = cardRef.current;
    const canvas = canvasRef.current;

    if (!card || !canvas) {
      return undefined;
    }

    const isCoarsePointer = () =>
      window.matchMedia('(pointer: coarse)').matches;

    const handleEnter = () => {
      if (isCoarsePointer()) {
        return;
      }

      hoverTweenRef.current?.kill();

      hoverTweenRef.current = gsap.timeline();

      hoverTweenRef.current.to(card, {
        y: -7,
        rotateX: 1.1,
        rotateY: -1.3,
        duration: 0.45,
        ease: 'power3.out',
      });

      hoverTweenRef.current.to(
        canvas,
        {
          scale: 1.018,
          duration: 0.45,
          ease: 'power3.out',
        },
        0
      );
    };

    const handleLeave = () => {
      if (isCoarsePointer()) {
        return;
      }

      hoverTweenRef.current?.kill();

      hoverTweenRef.current = gsap.timeline();

      hoverTweenRef.current.to(card, {
        y: 0,
        rotateX: 0,
        rotateY: 0,
        duration: 0.55,
        ease: 'power3.out',
      });

      hoverTweenRef.current.to(
        canvas,
        {
          scale: 1,
          duration: 0.5,
          ease: 'power3.out',
        },
        0
      );
    };

    const handleMove = (event) => {
      if (isCoarsePointer()) {
        return;
      }

      const rect = card.getBoundingClientRect();
      const x =
        ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y =
        ((event.clientY - rect.top) / rect.height) * 2 - 1;

      gsap.to(card, {
        rotateY: x * 1.5,
        rotateX: y * -1.1,
        duration: 0.3,
        ease: 'power2.out',
        overwrite: true,
      });
    };

    const handlePointerDown = () => {
      gsap.fromTo(
        card,
        { scale: 0.992 },
        {
          scale: 1,
          duration: 0.35,
          ease: 'power3.out',
        }
      );
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handlePointerDown();
      }
    };

    card.addEventListener(
      'pointerenter',
      handleEnter
    );
    card.addEventListener(
      'pointerleave',
      handleLeave
    );
    card.addEventListener(
      'pointermove',
      handleMove
    );
    card.addEventListener(
      'pointerdown',
      handlePointerDown
    );
    card.addEventListener(
      'keydown',
      handleKeyDown
    );

    return () => {
      card.removeEventListener(
        'pointerenter',
        handleEnter
      );
      card.removeEventListener(
        'pointerleave',
        handleLeave
      );
      card.removeEventListener(
        'pointermove',
        handleMove
      );
      card.removeEventListener(
        'pointerdown',
        handlePointerDown
      );
      card.removeEventListener(
        'keydown',
        handleKeyDown
      );

      hoverTweenRef.current?.kill();
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className={styles.card}
      role="button"
      tabIndex={0}
      aria-label={ariaLabel}
    >
      <video
        ref={videoRef}
        className={styles.sourceVideo}
        src={videoSrc}
        muted
        loop
        playsInline
        autoPlay
        preload="metadata"
        aria-hidden="true"
      />

      <canvas
        ref={canvasRef}
        className={styles.canvas}
        aria-hidden="true"
      />

      <div
        className={styles.shadow}
        aria-hidden="true"
      />
    </div>
  );
}
