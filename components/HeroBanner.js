'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function HeroBanner({ slides }) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 6000);

    return () => {
      clearInterval(interval);
    };
  }, [activeIndex, slides.length]);

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
          <h1>{currentSlide.headline}</h1>
          <p className="lead">{currentSlide.body}</p>
          <div className="hero-actions">
            <Link className="btn btn-primary" href={currentSlide.ctaHref}>{currentSlide.ctaLabel}</Link>
            {currentSlide.secondaryHref && currentSlide.secondaryLabel && (
              <Link className="btn btn-secondary" href={currentSlide.secondaryHref}>{currentSlide.secondaryLabel}</Link>
            )}
          </div>
        </div>
        <div className="hero-image">
          <Image src={currentSlide.image} alt={currentSlide.imageAlt} width={1400} height={900} />
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