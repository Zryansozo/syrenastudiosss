"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, RefreshCcw, X, Compass, Sparkles } from 'lucide-react';
import './interactive-book.css';

export default function InteractiveBook({
    coverImage = "/images/cyanotype-fullscreen-hero.jpg",
    bookTitle = "The Syrena Codex",
    bookAuthor = "Syrena Atelier",
    category = "Thought Leadership",
    pages = [],
    className,
    width = 380,
    height = 540,
    initialOpen = false,
    onPageChange,
}) {
    const [isOpen, setIsOpen] = useState(initialOpen);
    const [currentPageIndex, setCurrentPageIndex] = useState(-1);
    const [isHovering, setIsHovering] = useState(false);

    // Calculate dynamic width/height values for animations
    const widthNum = typeof width === 'number' ? width : 380;
    const heightNum = typeof height === 'number' ? height : 540;

    // Sync container shift with cover open
    const BOOK_OPEN_DURATION = 1.35;
    const EASING = [0.25, 0, 0, 1]; // milder smoothing

    const handleOpenBook = () => {
        setIsOpen(true);
        if (currentPageIndex === -1 && pages.length > 0) {
            // keep at -1 for inner cover or spread 0
        }
    };

    const handleCloseBook = (e) => {
        e?.stopPropagation();
        setIsOpen(false);
        setCurrentPageIndex(-1);
        if (onPageChange) onPageChange(-1);
    };

    const nextPage = (e) => {
        e?.stopPropagation();
        if (currentPageIndex < pages.length - 1) {
            setCurrentPageIndex((prev) => {
                const next = prev + 1;
                if (onPageChange) onPageChange(next);
                return next;
            });
        }
    };

    const prevPage = (e) => {
        e?.stopPropagation();
        if (currentPageIndex >= 0) {
            setCurrentPageIndex((prev) => {
                const next = prev - 1;
                if (onPageChange) onPageChange(next);
                return next;
            });
        }
    };

    const restartBook = (e) => {
        e?.stopPropagation();
        setCurrentPageIndex(-1);
        if (onPageChange) onPageChange(-1);
    };

    // Keyboard navigation
    useEffect(() => {
        if (!isOpen) return;
        const handleKeyDown = (e) => {
            if (e.key === 'ArrowRight') nextPage();
            if (e.key === 'ArrowLeft') prevPage();
            if (e.key === 'Escape') handleCloseBook();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, currentPageIndex, pages.length]);

    // Responsive width calculation
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const actualWidth = isMobile ? Math.min(widthNum, 310) : widthNum;
    const actualHeight = isMobile ? Math.min(heightNum, 460) : heightNum;

    return (
        <div
            className={cn("interactive-book-stage", className)}
            style={{
                width: typeof width === 'number' ? (isOpen ? widthNum * 2.15 : widthNum * 1.5) : '100%',
                height: typeof height === 'number' ? heightNum + 100 : 'auto',
                transition: 'width 0.8s cubic-bezier(0.25, 0, 0, 1)',
            }}
        >
            <motion.div
                className="relative preserve-3d book-cover-wrap"
                style={{ width: actualWidth, height: actualHeight }}
                initial={{ x: 0 }}
                animate={{ x: isOpen ? actualWidth / 2 : 0 }}
                transition={{ duration: BOOK_OPEN_DURATION, ease: EASING }}
            >
                {/* ═══════════════ FRONT COVER ═══════════════ */}
                <motion.div
                    className="absolute inset-0 w-full h-full origin-left"
                    initial={{ rotateY: 0, zIndex: 100 }}
                    animate={{
                        rotateY: isOpen ? -180 : (isHovering ? -15 : 0),
                        zIndex: isOpen ? 0 : 100
                    }}
                    transition={{
                        rotateY: { duration: BOOK_OPEN_DURATION, ease: EASING },
                        zIndex: { delay: isOpen ? BOOK_OPEN_DURATION * 0.6 : BOOK_OPEN_DURATION * 0.4 }
                    }}
                    style={{ transformStyle: 'preserve-3d', transformOrigin: 'left center' }}
                    onClick={!isOpen ? handleOpenBook : undefined}
                    onHoverStart={() => !isOpen && setIsHovering(true)}
                    onHoverEnd={() => setIsHovering(false)}
                >
                    {/* Front Face (Cover) */}
                    <div
                        className="absolute inset-0 w-full h-full backface-hidden book-front-face cursor-pointer select-none"
                        style={{ transform: 'translateZ(0.5px)' }}
                    >
                        {/* Background Artwork */}
                        <div
                            className="book-cover-image"
                            style={{ backgroundImage: `url(${coverImage})` }}
                        />
                        {/* Oceanic Dark Overlay */}
                        <div className="book-cover-overlay" />

                        {/* Gold / Angel Falls Embossed Inner Frame */}
                        <div className="book-cover-emboss-frame" />
                        <div className="book-cover-corner-ornament" style={{ top: 18, left: 32, borderTop: '2px solid var(--cobalt)', borderLeft: '2px solid var(--cobalt)' }} />
                        <div className="book-cover-corner-ornament" style={{ top: 18, right: 18, borderTop: '2px solid var(--cobalt)', borderRight: '2px solid var(--cobalt)' }} />
                        <div className="book-cover-corner-ornament" style={{ bottom: 18, left: 32, borderBottom: '2px solid var(--cobalt)', borderLeft: '2px solid var(--cobalt)' }} />
                        <div className="book-cover-corner-ornament" style={{ bottom: 18, right: 18, borderBottom: '2px solid var(--cobalt)', borderRight: '2px solid var(--cobalt)' }} />

                        {/* Book Metadata & Title Block */}
                        <div className="book-cover-info">
                            <span className="book-cover-category-badge">{category}</span>
                            <h1 className="book-cover-title">{bookTitle}</h1>
                            <div className="book-cover-author">
                                <span>{bookAuthor}</span>
                                <span style={{ color: 'var(--cobalt)', fontSize: '9px' }}>VOL. 2026</span>
                            </div>
                        </div>

                        {/* Spine Ribs & Metallic Depth */}
                        <div className="book-spine-highlight" />
                        <div className="book-spine-crease" />
                    </div>

                    {/* Back Face of Cover (Inner Left Cover) */}
                    <div
                        className="absolute inset-0 w-full h-full backface-hidden book-inner-cover cursor-pointer select-none p-6"
                        style={{ transform: 'rotateY(180deg) translateZ(0.5px)' }}
                        onClick={(e) => {
                            e.stopPropagation();
                            prevPage();
                        }}
                    >
                        <div className="inner-cover-frame">
                            <div className="inner-cover-logo-seal">
                                <Compass size={28} strokeWidth={1.5} />
                            </div>
                            <h2 className="inner-cover-title">{bookTitle}</h2>
                            <div className="inner-cover-line" />
                            <p className="inner-cover-edition">Interactive Oceanic Edition</p>
                            <p style={{ fontSize: '11px', color: 'var(--navy)', marginTop: '14px', maxWidth: '240px', lineHeight: 1.6 }}>
                                Strategic dispatches, WebGL engineering paradigms, and brand moats published by Syrena Atelier.
                            </p>
                            <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--cobalt)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.14em' }}>
                                <Sparkles size={12} />
                                <span>{pages.length} Curated Dispatches</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* ═══════════════ PAGES STACK ═══════════════ */}
                <div className="absolute inset-0 w-full h-full z-0" style={{ transformStyle: 'preserve-3d' }}>
                    {pages.map((page, index) => {
                        const isFlipped = isOpen && index <= currentPageIndex;

                        return (
                            <motion.div
                                key={index}
                                className="absolute inset-0 w-full h-full origin-left book-page-sheet"
                                style={{ transformStyle: 'preserve-3d', transformOrigin: 'left center' }}
                                initial={{ rotateY: 0, zIndex: pages.length - index }}
                                animate={{
                                    rotateY: isFlipped ? -180 : 0,
                                    zIndex: isFlipped ? index + 1 : pages.length - index
                                }}
                                transition={{
                                    duration: 0.6,
                                    ease: [0.645, 0.045, 0.355, 1]
                                }}
                            >
                                {/* Front Face of Page (Right Side when open) */}
                                <div
                                    className="absolute inset-0 w-full h-full backface-hidden page-front-face cursor-pointer select-none"
                                    style={{ transform: 'translateZ(0.5px)' }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        nextPage();
                                    }}
                                >

                                    <div className="page-header-row">
                                        <div className="page-header-tag">
                                            <Compass size={11} />
                                            <span>Syrena Dispatch</span>
                                        </div>
                                        <div className="page-number-label">
                                            {page.pageNumber ? page.pageNumber * 2 - 1 : index * 2 + 1}
                                        </div>
                                    </div>

                                    <div className="flex-1 overflow-y-auto pr-1">
                                        {page.title && (
                                            <h3 className="page-article-title">
                                                {page.title}
                                            </h3>
                                        )}
                                        <div className="page-body-content">
                                            {page.content}
                                        </div>
                                    </div>

                                    {/* Page turn curl indicator on bottom right */}
                                    <div className="page-corner-curl" />
                                </div>

                                {/* Back Face of Page (Left Side when flipped) */}
                                <div
                                    className="absolute inset-0 w-full h-full backface-hidden page-back-face cursor-pointer select-none"
                                    style={{ transform: 'rotateY(180deg) translateZ(0.5px)' }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        prevPage();
                                    }}
                                >

                                    <div className="page-header-row">
                                        <div className="page-number-label">
                                            {page.pageNumber ? page.pageNumber * 2 : index * 2 + 2}
                                        </div>
                                        <div className="page-header-tag">
                                            <span>Navigational Notes</span>
                                            <Compass size={11} />
                                        </div>
                                    </div>

                                    <div className="flex-1 overflow-y-auto pr-1">
                                        {page.backContent ? (
                                            <div className="page-body-content">
                                                {page.backContent}
                                            </div>
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center text-center opacity-40">
                                                <Compass size={48} strokeWidth={1} style={{ color: 'var(--cobalt)', marginBottom: '12px' }} />
                                                <span style={{ fontFamily: 'Cinzel, serif', fontSize: '13px', color: 'var(--navy)', letterSpacing: '0.1em' }}>
                                                    Syrena Editorial Record
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}

                    {/* ═══════════════ BACK COVER (STATIC) ═══════════════ */}
                    <div
                        className="absolute inset-0 w-full h-full book-back-cover select-none"
                        style={{ transform: 'translateZ(-1px)', zIndex: -1 }}
                    >
                        <div className="back-cover-inner">
                            <Compass size={36} strokeWidth={1.5} style={{ color: 'var(--cobalt)', marginBottom: '12px' }} />
                            <p className="back-cover-title">The End of Volume I</p>
                            <p className="back-cover-sub">PORT OF SYRENA • ARCHIVE COMPLETE</p>
                            <button
                                type="button"
                                onClick={restartBook}
                                className="book-restart-btn"
                                data-hover
                            >
                                <RefreshCcw size={13} />
                                <span>Read From Beginning</span>
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* ═══════════════ OPEN BOOK CONTROLS & HUD ═══════════════ */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Close Button Top Right */}
                        <motion.button
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            onClick={handleCloseBook}
                            className="book-floating-btn"
                            title="Close Book (Esc)"
                            aria-label="Close book"
                            data-hover
                        >
                            <X size={20} />
                        </motion.button>

                        {/* Side Left Navigation Arrow */}
                        {currentPageIndex >= 0 && (
                            <motion.button
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                onClick={prevPage}
                                className="book-nav-arrow left-arrow"
                                title="Previous Page (Left Arrow)"
                                aria-label="Previous page"
                                data-hover
                            >
                                <ChevronLeft size={22} />
                            </motion.button>
                        )}

                        {/* Side Right Navigation Arrow */}
                        {currentPageIndex < pages.length - 1 && (
                            <motion.button
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10 }}
                                onClick={nextPage}
                                className="book-nav-arrow right-arrow"
                                title="Next Page (Right Arrow)"
                                aria-label="Next page"
                                data-hover
                            >
                                <ChevronRight size={22} />
                            </motion.button>
                        )}

                        {/* Bottom Page Indicator HUD */}
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 15 }}
                            className="book-controls-hud"
                        >
                            <button
                                type="button"
                                className="book-hud-btn"
                                onClick={prevPage}
                                disabled={currentPageIndex < 0}
                                title="Previous Spread"
                                data-hover
                            >
                                <ChevronLeft size={16} />
                            </button>

                            <span className="book-hud-page-count">
                                {currentPageIndex < 0 ? (
                                    <span>Cover / Prologue</span>
                                ) : (
                                    <span>
                                        Spread {currentPageIndex + 1} of {pages.length}
                                    </span>
                                )}
                            </span>

                            <button
                                type="button"
                                className="book-hud-btn"
                                onClick={nextPage}
                                disabled={currentPageIndex >= pages.length - 1}
                                title="Next Spread"
                                data-hover
                            >
                                <ChevronRight size={16} />
                            </button>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* ═══════════════ "CLICK TO OPEN" HINT ═══════════════ */}
            {!isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    className="book-open-hint"
                    onClick={handleOpenBook}
                    data-hover
                >
                    <span className="book-pulse-dot" />
                    <span>Click Book to Open</span>
                </motion.div>
            )}
        </div>
    );
}

export { InteractiveBook };
