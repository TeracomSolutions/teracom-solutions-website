'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function HeroBanner({ slides }) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    // Honour prefers-reduced-motion: an auto-advancing carousel is exactly
    // the kind of unsolicited motion WCAG 2.2.2 (Pause, Stop, Hide) and
    // 2.3.3 ask to be suppressed for users who have opted out. The manual
    // prev/next/dot controls still work.
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;

    // activeIndex is deliberately not a dependency -- the functional update
    // below doesn't need it, and including it tore down and recreated the
    // interval on every single slide change.
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 6000);

    return () => {
      clearInterval(interval);
    };
  }, [slides.length]);

  const goToSlide = (index) => {
    setActiveIndex(index);
  };

  const goToPrev = () => {
    setActiveIndex((prevIndex) => (prevIndex === 0 ? slides.length - 1 : prevIndex - 1));
  };

  const goToNext = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % slides.length);
  };

  const currentSlide = slides[activeIndex];

  return (
    <section className="hero hero-home">
      <div className="container hero-layout">
        <div className="hero-copy">
          <div className="eyebrow">{currentSlide.eyebrow}</div>
          <h1 className={currentSlide.isNews ? 'hero-news-headline' : undefined}>{currentSlide.headline}</h1>
          <p className="lead">{currentSlide.body}</p>
          <div className="hero-actions">
            {/* A news slide's CTA is the publisher's own article. next/link
                would try to client-side navigate to an external origin, and
                an off-site link opened in place loses the visitor. */}
            {currentSlide.ctaExternal ? (
              <a
                className="btn btn-primary"
                href={currentSlide.ctaHref}
                target="_blank"
                rel="noopener noreferrer"
              >
                {currentSlide.ctaLabel}
              </a>
            ) : (
              <Link className="btn btn-primary" href={currentSlide.ctaHref}>{currentSlide.ctaLabel}</Link>
            )}
            {currentSlide.secondaryHref && currentSlide.secondaryLabel && (
              <Link className="btn btn-secondary" href={currentSlide.secondaryHref}>{currentSlide.secondaryLabel}</Link>
            )}
          </div>
        </div>
        <div className="hero-image hero-blend">
          {/* The hero image is the homepage's Largest Contentful Paint
              element. Without `priority` Next lazy-loads it, so the browser
              only discovers it after hydration -- a direct, measurable LCP
              penalty on the single most important page. Only the first slide
              gets it: the rest are not in the initial viewport render and
              preloading all of them would compete for bandwidth with the one
              that actually counts. `sizes` stops the browser downloading a
              1400px-wide asset to fill a ~55% column on desktop. */}
          {currentSlide.imageExternal ? (
            /* A news story's own image, served from the publisher's CDN.
               next/image would need every one of those hosts enumerated in
               next.config remotePatterns, and they change whenever a
               publisher changes host. */
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={currentSlide.image}
              alt={currentSlide.imageAlt}
              width={1400}
              height={900}
              loading={activeIndex === 0 ? 'eager' : 'lazy'}
              decoding="async"
            />
          ) : (
            <Image
              src={currentSlide.image}
              alt={currentSlide.imageAlt}
              width={1400}
              height={900}
              priority={activeIndex === 0}
              sizes="(max-width: 980px) 100vw, 55vw"
            />
          )}
        </div>
      </div>
      <div className="hero-controls">
        <div role="group" aria-label="Hero banner navigation">
          <button 
            className="btn btn-secondary hero-control-btn" 
            onClick={goToPrev}
            aria-label="Previous slide"
          >
            &larr;
          </button>
          <div className="hero-dots">
            {slides.map((_, index) => (
              <button
                key={index}
                className={`hero-dot ${index === activeIndex ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
                aria-current={index === activeIndex ? 'true' : undefined}
              />
            ))}
          </div>
          <button 
            className="btn btn-secondary hero-control-btn" 
            onClick={goToNext}
            aria-label="Next slide"
          >
            &rarr;
          </button>
        </div>
      </div>
    </section>
  );
}