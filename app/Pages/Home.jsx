"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

const slides = [
  {
    id: "img1",
    src: "/carousel-1.jpg",
    title: "Unveiling the World's",
    subtitle: "Finest Hotels"
  },
  {
    id: "img2",
    src: "/image.jpg",
    title: "Experience Luxury",
    subtitle: "Beyond Imagination"
  },
  {
    id: "img3",
    src: "/carousel-2.jpg",
    title: "Your Perfect Stay",
    subtitle: "Awaits You"
  }
];

function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gray-900">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src={slide.src}
              alt={`Slide ${index + 1}`}
              fill
              className={`object-cover transition-transform duration-[10000ms] ease-linear ${index === currentSlide ? "scale-110" : "scale-100"
                }`}
              priority={index === 0}
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/20 to-black/80"></div>
            {/* Radial Gradient for focus */}
            <div className="absolute inset-0 bg-radial-gradient from-transparent to-black/40"></div>
          </div>

          {/* Content */}
          <div className="relative h-full flex flex-col items-center justify-center text-center text-white px-4 md:px-20 z-20">
            {/* Title with Animation */}
            <div className="overflow-hidden">
              <h1
                className={`text-5xl md:text-8xl font-bold mb-6 tracking-tight transition-all duration-1000 delay-300 transform ${index === currentSlide
                  ? "translate-y-0 opacity-100"
                  : "translate-y-20 opacity-0"
                  }`}
              >
                <span className="block bg-gradient-to-r from-yellow-300 via-yellow-200 to-yellow-400 bg-clip-text text-transparent drop-shadow-lg">
                  {slide.title}
                </span>
                <span className="block mt-2 md:mt-4 text-white drop-shadow-md">
                  {slide.subtitle}
                </span>
              </h1>
            </div>

            {/* Decorative Line */}
            <div
              className={`w-32 h-1.5 bg-gradient-to-r from-transparent via-yellow-400 to-transparent mb-10 rounded-full transition-all duration-1000 delay-500 transform ${index === currentSlide
                ? "scale-x-100 opacity-100"
                : "scale-x-0 opacity-0"
                }`}
            ></div>

            {/* Buttons */}
            <div
              className={`flex flex-col sm:flex-row gap-5 transition-all duration-1000 delay-700 transform ${index === currentSlide
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
                }`}
            >
              <Link
                href="/Rooms"
                className="group relative px-10 py-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-bold rounded-full overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-yellow-500/50 hover:-translate-y-1"
              >
                <span className="relative z-10 tracking-wider">OUR ROOMS</span>
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-600 to-yellow-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </Link>
              <Link
                href="/Rooms"
                className="group relative px-10 py-4 bg-white/10 backdrop-blur-md text-white font-bold rounded-full overflow-hidden transition-all duration-300 border border-white/30 hover:bg-white/20 hover:shadow-2xl hover:shadow-white/10 hover:-translate-y-1"
              >
                <span className="relative z-10 tracking-wider">BOOK NOW</span>
                <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </Link>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 md:w-16 md:h-16 rounded-full bg-black/20 backdrop-blur-md border border-white/10 flex items-center justify-center text-white text-2xl md:text-3xl transition-all duration-300 hover:bg-yellow-500 hover:border-yellow-500 hover:scale-110 group"
        aria-label="Previous slide"
      >
        <span className="transform group-hover:-translate-x-1 transition-transform duration-300">
          ❮
        </span>
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 md:w-16 md:h-16 rounded-full bg-black/20 backdrop-blur-md border border-white/10 flex items-center justify-center text-white text-2xl md:text-3xl transition-all duration-300 hover:bg-yellow-500 hover:border-yellow-500 hover:scale-110 group"
        aria-label="Next slide"
      >
        <span className="transform group-hover:translate-x-1 transition-transform duration-300">
          ❯
        </span>
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex gap-4">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-500 rounded-full ${index === currentSlide
              ? "w-10 h-2 bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.8)]"
              : "w-2 h-2 bg-white/40 hover:bg-white/80"
              }`}
            aria-label={`Go to slide ${index + 1}`}
          ></button>
        ))}
      </div>

      {/* Scroll Indicator */}
      <div className="absolute top-32 right-4 z-20 hidden md:flex flex-col items-center gap-2 text-white/60 animate-bounce">
        <span className="text-xs font-medium tracking-widest uppercase">Scroll</span>
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </div>
    </div>
  );
}

export default Home;