"use client";

import { useState, useEffect } from "react";

const destinations = [
  {
    name: "Bali, Indonesia",
    emoji: "🏝️",
    gradient: "from-blue-400 to-cyan-400",
  },
  {
    name: "Paris, France",
    emoji: "🗼",
    gradient: "from-pink-400 to-rose-400",
  },
  {
    name: "Tokyo, Japan",
    emoji: "🏯",
    gradient: "from-purple-400 to-pink-400",
  },
  {
    name: "New York, USA",
    emoji: "🗽",
    gradient: "from-yellow-400 to-orange-400",
  },
  {
    name: "Iceland",
    emoji: "🏔️",
    gradient: "from-cyan-400 to-blue-400",
  },
];

export const HeroCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % destinations.length);
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-96 flex items-center justify-center overflow-hidden">
      {destinations.map((dest, index) => {
        const offset = ((index - currentIndex + destinations.length) % destinations.length) - 2;
        const isActive = offset === 0;
        
        return (
          <div
            key={index}
            className={`absolute transition-all duration-700 ease-out ${
              isActive ? "opacity-100 scale-100 z-10" : "opacity-40 scale-90"
            }`}
            style={{
              transform: `translateX(${offset * 280}px) ${
                isActive ? "rotate(0deg)" : offset < 0 ? "rotate(-5deg)" : "rotate(5deg)"
              }`,
            }}
          >
            <div
              className={`w-64 h-80 rounded-3xl shadow-2xl bg-gradient-to-br ${dest.gradient} flex flex-col items-center justify-center text-white p-8 transform hover:scale-105 transition-transform`}
            >
              <div className="text-8xl mb-4">{dest.emoji}</div>
              <h3 className="text-2xl font-bold text-center">{dest.name}</h3>
            </div>
          </div>
        );
      })}
    </div>
  );
};
