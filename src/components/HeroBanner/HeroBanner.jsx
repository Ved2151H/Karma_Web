import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const SLIDES = [
  {
    id: 1,
    subtitle: 'Industrial Safety Solutions',
    title: 'Advanced Face Protection',
    description: 'Premium face shields and visors engineered for extreme impact and chemical splash resistance.',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1600',
    link: '/category/face',
  },
  {
    id: 2,
    subtitle: 'Industrial Safety Solutions',
    title: 'Precision Eye Protection',
    description: 'Sleek, scratch-resistant safety glasses and goggles providing optimal clarity and UV shielding.',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=1600',
    link: '/category/eye',
  },
  {
    id: 3,
    subtitle: 'Industrial Safety Solutions',
    title: 'Heavy-Duty Hand Protection',
    description: 'Cut-resistant, heat-resistant, and high-dexterity safety gloves for versatile hand protection.',
    image: 'https://images.unsplash.com/photo-1590786275628-309e52d713be?q=80&w=1600',
    link: '/category/hand',
  },
  {
    id: 4,
    subtitle: 'Industrial Safety Solutions',
    title: 'Ultimate Foot Protection',
    description: 'Steel-toe, slip-resistant, and puncture-proof safety shoes designed for maximum comfort and durability.',
    image: 'https://images.unsplash.com/photo-1533727937480-da3a97967e95?q=80&w=1600',
    link: '/category/foot',
  },
];

function HeroBanner() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handlePrev = () => {
    setCurrent((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  };

  const handleNext = () => {
    setCurrent((prev) => (prev + 1) % SLIDES.length);
  };

  return (
    <div className="relative w-full h-[320px] md:h-[450px] lg:h-[600px] overflow-hidden select-none bg-neutral-900">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0 w-full h-full"
        >
          {/* Background image with Unsplash fallback */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-10000 scale-105"
            style={{ backgroundImage: `url(${SLIDES[current].image})` }}
          />

          {/* Dark Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />

          {/* Content Container */}
          <div className="absolute inset-0 flex items-center px-6 sm:px-12 lg:px-24">
            <div className="max-w-xl text-white">
              <motion.span
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="inline-block text-brand-red text-xs sm:text-sm font-bold tracking-widest uppercase mb-2 sm:mb-3"
              >
                {SLIDES[current].subtitle}
              </motion.span>
              
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="font-display text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-3 sm:mb-4 leading-tight"
              >
                {SLIDES[current].title}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="text-neutral-300 text-xs sm:text-sm lg:text-base leading-relaxed mb-6 sm:mb-8 font-sans opacity-95"
              >
                {SLIDES[current].description}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="flex items-center gap-3 sm:gap-4"
              >
                <Link
                  to={SLIDES[current].link}
                  className="bg-brand-red text-white text-xs sm:text-sm font-semibold uppercase tracking-wider px-5 py-2.5 sm:px-6 sm:py-3 rounded-md hover:bg-red-700 transition-colors shadow-lg cursor-pointer"
                >
                  Explore Products
                </Link>
                <a
                  href="#about"
                  className="border border-white text-white text-xs sm:text-sm font-semibold uppercase tracking-wider px-5 py-2.5 sm:px-6 sm:py-3 rounded-md hover:bg-white/10 transition-colors cursor-pointer"
                >
                  Learn More
                </a>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/40 hover:bg-brand-red text-white flex items-center justify-center cursor-pointer transition-colors duration-200"
        aria-label="Previous Slide"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/40 hover:bg-brand-red text-white flex items-center justify-center cursor-pointer transition-colors duration-200"
        aria-label="Next Slide"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {SLIDES.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 cursor-pointer ${
              index === current ? 'bg-brand-red w-6 sm:w-8' : 'bg-white/50 hover:bg-white'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default HeroBanner;
