"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type HomeHeroSlide = {
  src: string;
  alt: string;
};

export function HomeHeroSlider({ slides }: { slides: HomeHeroSlide[] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (slides.length < 2) return undefined;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, [slides.length]);

  return (
    <>
      <div className="home-hero__photo" role="region" aria-roledescription="carousel" aria-label="Imagens do Porto de Bissau">
        {slides.map((slide, index) => (
          <div
            className={`home-hero__slide${index === activeIndex ? " is-active" : ""}`}
            key={slide.src}
            aria-hidden={index !== activeIndex}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              sizes="100vw"
              priority={index === 0}
            />
          </div>
        ))}
      </div>
      <div className="home-hero__dots" aria-label="Escolher imagem do hero">
        {slides.map((slide, index) => (
          <button
            type="button"
            className={index === activeIndex ? "is-active" : undefined}
            key={slide.src}
            aria-label={`Mostrar imagem ${index + 1}`}
            aria-current={index === activeIndex ? "true" : undefined}
            onClick={() => setActiveIndex(index)}
          />
        ))}
      </div>
    </>
  );
}
