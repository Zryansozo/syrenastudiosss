"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";
import "./macbook-scroll.css";
import {
  IconBrightnessDown,
  IconBrightnessUp,
  IconCaretRightFilled,
  IconCaretUpFilled,
  IconMicrophone,
  IconMoon,
  IconPlayerSkipForward,
  IconPlayerTrackNext,
  IconPlayerTrackPrev,
  IconTable,
  IconVolume,
  IconVolume2,
  IconVolume3,
  IconSearch,
  IconCaretLeftFilled,
  IconCaretDownFilled,
} from "@tabler/icons-react";

export const MacbookScroll = ({
  src,
  showGradient = false,
  title,
  badge,
  children,
}) => {
  const containerRef = useRef(null);
  const viewportRef = useRef(null);
  const imgRef = useRef(null);
  const [maxScrollDistance, setMaxScrollDistance] = useState(630);
  const [scaleFactor, setScaleFactor] = useState(0.96);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const updateMeasurements = () => {
    if (typeof window !== "undefined") {
      const w = window.innerWidth;
      const h = window.innerHeight;
      let s = 1.0;
      if (w < 480) s = 0.52;
      else if (w < 680) s = 0.65;
      else if (w < 920) s = 0.8;
      else if (h < 640) s = 0.78;
      else if (h < 750) s = 0.92;
      else s = 1.0;
      setScaleFactor(s);
    }
    if (imgRef.current && viewportRef.current) {
      const imgH = imgRef.current.offsetHeight;
      const vpH = viewportRef.current.offsetHeight;
      const diff = Math.max(0, imgH - vpH);
      if (diff > 0) {
        setMaxScrollDistance(diff);
      }
    }
  };

  useEffect(() => {
    updateMeasurements();
    window.addEventListener("resize", updateMeasurements);
    return () => window.removeEventListener("resize", updateMeasurements);
  }, [src]);

  // Title fades out quickly right as the lid starts opening
  const titleOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0], { clamp: true });
  const titleY = useTransform(scrollYProgress, [0, 0.12], [0, -40], { clamp: true });

  // Laptop rises slightly as it opens and centers in view
  const laptopY = useTransform(scrollYProgress, [0, 0.12], [0, -30], { clamp: true });

  // === HERO ANIMATION: Lid opens from nearly closed (~85°) to fully upright (0°) ===
  // At scroll 0 the lid is almost shut — user sees the base + barely-open screen edge
  // From 5%→35% scroll the lid sweeps dramatically open like a real MacBook
  const lidRotateX = useTransform(
    scrollYProgress,
    [0, 0.05, 0.35],
    [-85, -85, 0],
    { clamp: true }
  );

  // Scale starts smaller (laptop looks distant/closed) then grows as it opens
  const macbookScale = useTransform(
    scrollYProgress,
    [0, 0.35, 0.85],
    [scaleFactor * 0.80, scaleFactor * 1.02, scaleFactor * 1.02],
    { clamp: true }
  );

  // Image only starts scrolling AFTER the lid is fully open (after 35% scroll)
  const imageTranslateY = useTransform(
    scrollYProgress,
    [0.35, 0.90],
    [0, -maxScrollDistance],
    { clamp: true }
  );

  return (
    <div ref={containerRef} className="macbook-scroll-container">
      {/* Ambient background glow */}
      <div className="macbook-ambient-glow" />

      {/* Sticky Viewport keeps the entire Macbook pinned & centered in view */}
      <div className="macbook-sticky-viewport">
        {/* Title positioned at top in normal flow above the laptop */}
        <motion.div
          style={{
            opacity: titleOpacity,
            y: titleY,
          }}
          className="macbook-title-wrap"
        >
          {title || (
            <div>
              <span className="macbook-eyebrow">
                <span className="macbook-eyebrow-dot" />
                Syrena Portfolio · Digital Atelier
              </span>
              <h2 className="macbook-main-title">
                Crafting Category-Defining Flagships. <br />
                <span className="macbook-title-gradient">Digital Craftsmanship in Motion.</span>
              </h2>
              <p className="macbook-subtitle">
                Scroll down to deploy the flagship experience. Built with precision, performance, and oceanic aesthetics.
              </p>
            </div>
          )}
        </motion.div>

        {/* 3D Macbook Model (Lid + Hinge + Base firmly connected) */}
        <motion.div
          style={{
            scale: macbookScale,
            y: laptopY,
          }}
          className="macbook-3d-scene"
        >
          {/* ─── LID (SCREEN DISPLAY) ─── */}
          <motion.div
            style={{
              rotateX: lidRotateX,
            }}
            className="macbook-lid-assembly"
          >
            <div ref={viewportRef} className="macbook-screen-viewport">
              {children ? (
                children
              ) : (
                <motion.div
                  style={{ y: imageTranslateY }}
                  className="macbook-screen-scroll-track"
                >
                  <img
                    ref={imgRef}
                    src={src || "/linear.webp"}
                    alt="Syrena Flagship Portfolio"
                    className="macbook-full-image"
                    onLoad={updateMeasurements}
                  />
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* ─── HINGE CONNECTOR ─── */}
          <div className="macbook-hinge-connector" />

          {/* ─── BASE CHASSIS (KEYBOARD + TRACKPAD + BADGE) ─── */}
          <div className="macbook-base-chassis">
            <div className="macbook-keyboard-section">
              <div className="macbook-speaker-col">
                <SpeakerGrid />
              </div>
              <div className="macbook-keypad-col">
                <Keypad />
              </div>
              <div className="macbook-speaker-col">
                <SpeakerGrid />
              </div>
            </div>

            <div className="macbook-palm-rest">
              <Trackpad />
              {badge && (
                <div className="macbook-palm-badge">
                  {badge}
                </div>
              )}
            </div>

            <div className="macbook-front-notch" />
          </div>
        </motion.div>

        {showGradient && <div className="macbook-bottom-gradient" />}
      </div>
    </div>
  );
};

export const Lid = ({
  src,
  children,
  rotate,
}) => {
  return (
    <motion.div
      style={{
        rotateX: rotate || 0,
      }}
      className="macbook-lid-assembly"
    >
      <div className="macbook-screen-viewport">
        {children ? (
          children
        ) : (
          <img
            src={src || "/linear.webp"}
            alt="Syrena Flagship Portfolio"
            className="macbook-full-image"
          />
        )}
      </div>
    </motion.div>
  );
};

export const Trackpad = () => {
  return <div className="macbook-trackpad" />;
};

export const Keypad = () => {
  return (
    <div className="macbook-keypad">
      {/* First Row */}
      <div className="macbook-key-row">
        <KBtn className="w-10 items-end justify-start pb-[2px] pl-[4px]">
          esc
        </KBtn>
        <KBtn>
          <IconBrightnessDown />
          <span>F1</span>
        </KBtn>
        <KBtn>
          <IconBrightnessUp />
          <span>F2</span>
        </KBtn>
        <KBtn>
          <IconTable />
          <span>F3</span>
        </KBtn>
        <KBtn>
          <IconSearch />
          <span>F4</span>
        </KBtn>
        <KBtn>
          <IconMicrophone />
          <span>F5</span>
        </KBtn>
        <KBtn>
          <IconMoon />
          <span>F6</span>
        </KBtn>
        <KBtn>
          <IconPlayerTrackPrev />
          <span>F7</span>
        </KBtn>
        <KBtn>
          <IconPlayerSkipForward />
          <span>F8</span>
        </KBtn>
        <KBtn>
          <IconPlayerTrackNext />
          <span>F9</span>
        </KBtn>
        <KBtn>
          <IconVolume3 />
          <span>F10</span>
        </KBtn>
        <KBtn>
          <IconVolume2 />
          <span>F11</span>
        </KBtn>
        <KBtn>
          <IconVolume />
          <span>F12</span>
        </KBtn>
        <KBtn>
          <div className="macbook-touchid-outer">
            <div className="macbook-touchid-inner" />
          </div>
        </KBtn>
      </div>

      {/* Second Row */}
      <div className="macbook-key-row">
        <KBtn>
          <span>~</span>
          <span>`</span>
        </KBtn>
        <KBtn>
          <span>!</span>
          <span>1</span>
        </KBtn>
        <KBtn>
          <span>@</span>
          <span>2</span>
        </KBtn>
        <KBtn>
          <span>#</span>
          <span>3</span>
        </KBtn>
        <KBtn>
          <span>$</span>
          <span>4</span>
        </KBtn>
        <KBtn>
          <span>%</span>
          <span>5</span>
        </KBtn>
        <KBtn>
          <span>^</span>
          <span>6</span>
        </KBtn>
        <KBtn>
          <span>&</span>
          <span>7</span>
        </KBtn>
        <KBtn>
          <span>*</span>
          <span>8</span>
        </KBtn>
        <KBtn>
          <span>(</span>
          <span>9</span>
        </KBtn>
        <KBtn>
          <span>)</span>
          <span>0</span>
        </KBtn>
        <KBtn>
          <span>&mdash;</span>
          <span>_</span>
        </KBtn>
        <KBtn>
          <span>+</span>
          <span> = </span>
        </KBtn>
        <KBtn className="w-10 items-end justify-end pb-[2px] pr-[4px]">
          delete
        </KBtn>
      </div>

      {/* Third Row */}
      <div className="macbook-key-row">
        <KBtn className="w-10 items-end justify-start pb-[2px] pl-[4px]">
          tab
        </KBtn>
        <KBtn><span>Q</span></KBtn>
        <KBtn><span>W</span></KBtn>
        <KBtn><span>E</span></KBtn>
        <KBtn><span>R</span></KBtn>
        <KBtn><span>T</span></KBtn>
        <KBtn><span>Y</span></KBtn>
        <KBtn><span>U</span></KBtn>
        <KBtn><span>I</span></KBtn>
        <KBtn><span>O</span></KBtn>
        <KBtn><span>P</span></KBtn>
        <KBtn>
          <span>&#123;</span>
          <span>[</span>
        </KBtn>
        <KBtn>
          <span>&#125;</span>
          <span>]</span>
        </KBtn>
        <KBtn>
          <span>|</span>
          <span>\</span>
        </KBtn>
      </div>

      {/* Fourth Row */}
      <div className="macbook-key-row">
        <KBtn className="w-[2.8rem] items-end justify-start pb-[2px] pl-[4px]">
          caps
        </KBtn>
        <KBtn><span>A</span></KBtn>
        <KBtn><span>S</span></KBtn>
        <KBtn><span>D</span></KBtn>
        <KBtn><span>F</span></KBtn>
        <KBtn><span>G</span></KBtn>
        <KBtn><span>H</span></KBtn>
        <KBtn><span>J</span></KBtn>
        <KBtn><span>K</span></KBtn>
        <KBtn><span>L</span></KBtn>
        <KBtn>
          <span>:</span>
          <span>;</span>
        </KBtn>
        <KBtn>
          <span>"</span>
          <span>'</span>
        </KBtn>
        <KBtn className="w-[2.85rem] items-end justify-end pb-[2px] pr-[4px]">
          return
        </KBtn>
      </div>

      {/* Fifth Row */}
      <div className="macbook-key-row">
        <KBtn className="w-[3.6rem] items-end justify-start pb-[2px] pl-[4px]">
          shift
        </KBtn>
        <KBtn><span>Z</span></KBtn>
        <KBtn><span>X</span></KBtn>
        <KBtn><span>C</span></KBtn>
        <KBtn><span>V</span></KBtn>
        <KBtn><span>B</span></KBtn>
        <KBtn><span>N</span></KBtn>
        <KBtn><span>M</span></KBtn>
        <KBtn>
          <span>&lt;</span>
          <span>,</span>
        </KBtn>
        <KBtn>
          <span>&gt;</span>
          <span>.</span>
        </KBtn>
        <KBtn>
          <span>?</span>
          <span>/</span>
        </KBtn>
        <KBtn className="w-[3.6rem] items-end justify-end pb-[2px] pr-[4px]">
          shift
        </KBtn>
      </div>

      {/* Sixth Row */}
      <div className="macbook-key-row">
        <KBtn className="items-end justify-start pb-[2px] pl-[2px]">
          fn
        </KBtn>
        <KBtn className="items-end justify-start pb-[2px] pl-[2px]">
          control
        </KBtn>
        <KBtn className="items-end justify-start pb-[2px] pl-[2px]">
          option
        </KBtn>
        <KBtn className="w-8 items-end justify-start pb-[2px] pl-[2px]">
          command
        </KBtn>
        <KBtn className="w-[8.2rem]" />
        <KBtn className="w-8 items-end justify-start pb-[2px] pl-[2px]">
          command
        </KBtn>
        <KBtn className="items-end justify-start pb-[2px] pl-[2px]">
          option
        </KBtn>
        <div className="flex h-full flex-1 flex-col items-center justify-end">
          <KBtn className="h-1/2 w-full">
            <IconCaretUpFilled />
          </KBtn>
          <div className="flex h-1/2 w-full">
            <KBtn className="h-full w-1/2">
              <IconCaretLeftFilled />
            </KBtn>
            <KBtn className="h-full w-1/2">
              <IconCaretDownFilled />
            </KBtn>
            <KBtn className="h-full w-1/2">
              <IconCaretRightFilled />
            </KBtn>
          </div>
        </div>
      </div>
    </div>
  );
};

export const KBtn = ({
  className,
  children,
  childrenClassName,
  backlit = true,
}) => {
  return (
    <div
      className={cn(
        "macbook-kbtn-wrap",
        backlit && "macbook-kbtn-backlit"
      )}
    >
      <div
        className={cn(
          "macbook-kbtn-inner",
          className
        )}
      >
        <div className={cn("macbook-kbtn-label", childrenClassName)}>
          {children}
        </div>
      </div>
    </div>
  );
};

export const SpeakerGrid = () => {
  return <div className="macbook-speaker-grid" />;
};

export const AceternityLogo = () => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 56 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4"
    >
      <circle cx="28" cy="28" r="26" fill="var(--navy)" stroke="var(--cobalt)" strokeWidth="2" />
      <path
        d="M28 14C24 20 18 25 18 31C18 37 22.5 41 28 43C33.5 41 38 37 38 31C38 25 32 20 28 14Z"
        fill="var(--ice)"
      />
    </svg>
  );
};
