"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [mounted, setMounted] = useState(false);

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

  useEffect(() => {
    setMounted(true);
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

  // عرض محتوى ثابت أثناء التحميل الأولي لتجنب خطأ Hydration
  if (!mounted) {
    return (
      <div className="relative w-full h-screen overflow-hidden md:-mt-24">
        <div className="absolute inset-0">
          <Image
            width={1920}
            height={1080}
            src="/carousel-1.jpg"
            alt="Slide 1"
            className="w-full h-full object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70"></div>
        </div>
        <div className="relative h-full flex flex-col items-center justify-center mt-12 text-center text-white px-4 md:px-20">
          <h1 className="text-4xl md:text-7xl font-bold mb-4">
            <span className="block bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 bg-clip-text text-transparent">
              Unveiling the World's
            </span>
            <span className="block mt-5">Finest Hotels</span>
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent mb-8"></div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/Rooms"
              className="group relative px-8 py-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-semibold rounded-lg overflow-hidden transition-all duration-300"
            >
              <span className="relative z-10">OUR ROOMS</span>
            </Link>
            <Link
              href="/Rooms"
              className="group relative px-8 py-4 bg-white text-gray-900 font-semibold rounded-lg overflow-hidden transition-all duration-300"
            >
              <span className="relative z-10">BOOK NOW</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen overflow-hidden md:-mt-24">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-all duration-1000 ease-in-out ${index === currentSlide
              ? "opacity-100 scale-100"
              : "opacity-0 scale-105"
            }`}
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              width={1920}
              height={1080}
              src={slide.src}
              alt={`Slide ${index + 1}`}
              className="w-full h-full object-cover"
              priority={index === 0}
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70"></div>
          </div>

          {/* Content */}
          <div className="relative h-full flex flex-col items-center justify-center mt-12 text-center text-white px-4 md:px-20">
            {/* Title with Animation */}
            <h1
              className={`text-4xl md:text-7xl font-bold mb-4 transition-all duration-1000 delay-300 ${index === currentSlide
                  ? "translate-y-0 opacity-100"
                  : "translate-y-10 opacity-0"
                }`}
            >
              <span className="block bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 bg-clip-text text-transparent">
                {slide.title}
              </span>
              <span className="block mt-5">{slide.subtitle}</span>
            </h1>

            {/* Decorative Line */}
            <div
              className={`w-24 h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent mb-8 transition-all duration-1000 delay-500 ${index === currentSlide
                  ? "scale-x-100 opacity-100"
                  : "scale-x-0 opacity-0"
                }`}
            ></div>

            {/* Buttons */}
            <div
              className={`flex flex-col sm:flex-row gap-4 transition-all duration-1000 delay-700 ${index === currentSlide
                  ? "translate-y-0 opacity-100"
                  : "translate-y-10 opacity-0"
                }`}
            >
              <Link
                href="/Rooms"
                className="group relative px-8 py-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-semibold rounded-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-yellow-500/50 hover:scale-105"
              >
                <span className="relative z-10">OUR ROOMS</span>
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-600 to-yellow-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </Link>
              <Link
                href="/Rooms"
                className="group relative px-8 py-4 bg-white text-gray-900 font-semibold rounded-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-white/30 hover:scale-105"
              >
                <span className="relative z-10">BOOK NOW</span>
                <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-gray-200 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </Link>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 md:left-10 top-1/2 -translate-y-1/2 z-20 w-12 h-12 md:w-16 md:h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white text-2xl md:text-3xl transition-all duration-300 hover:bg-yellow-500 hover:border-yellow-500 hover:scale-110 group"
        aria-label="Previous slide"
      >
        <span className="transform group-hover:-translate-x-1 transition-transform duration-300">
          ❮
        </span>
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 md:right-10 top-1/2 -translate-y-1/2 z-20 w-12 h-12 md:w-16 md:h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white text-2xl md:text-3xl transition-all duration-300 hover:bg-yellow-500 hover:border-yellow-500 hover:scale-110 group"
        aria-label="Next slide"
      >
        <span className="transform group-hover:translate-x-1 transition-transform duration-300">
          ❯
        </span>
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 rounded-full ${index === currentSlide
                ? "w-12 h-3 bg-yellow-500"
                : "w-3 h-3 bg-white/50 hover:bg-white/80"
              }`}
            aria-label={`Go to slide ${index + 1}`}
          ></button>
        ))}
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-20 right-1/4 z-10 hidden md:flex flex-col items-center gap-2 text-white/70 animate-bounce">
        <span className="text-sm font-light">Scroll Down</span>
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </div>
    </div>
  );
}

export default Home;