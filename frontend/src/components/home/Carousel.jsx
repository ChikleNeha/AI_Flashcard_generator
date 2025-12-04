import React, { useState } from 'react';

const slides = [
  { text: 'How do you create a database session dependency in FastAPI using SQLAlchemy?', gradient: 'from-blue-400 via-purple-400 to-pink-400' },
  { text: 'What steps occur in a FastAPI POST endpoint to create and return a new SQLAlchemy model instance?', gradient: 'from-indigo-400 via-pink-400 to-purple-400' },
  { text: 'How do you define a basic SQLAlchemy model class for a User table?', gradient: 'from-pink-300 via-indigo-300 to-blue-200' },
  { text: 'How do you handle dependency injection for database sessions in FastAPI with SQLAlchemy?', gradient: 'from-purple-500 via-blue-500 to-pink-400' },
  { text: 'What is the purpose of db.refresh(instance) after committing a new SQLAlchemy object in FastAPI?', gradient: 'from-purple-300 via-pink-300 to-indigo-300' },
];

const Carousel = () => {
  const [current, setCurrent] = useState(2);

  const handlePrev = () => setCurrent((prev) => prev > 0 ? prev - 1 : prev);
  const handleNext = () => setCurrent((prev) => prev < slides.length - 1 ? prev + 1 : prev);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-transparent relative z-10 ">
      <div className="relative w-[600px] h-[380px] flex items-center justify-center">
        {/* Previous card */}
        {current > 0 && (
          <div
            className={`absolute left-0 top-1/2 -translate-y-1/2 w-[170px] h-[260px] scale-90 opacity-60 z-10
            rounded-2xl bg-gradient-to-br ${slides[current-1].gradient} border-4 border-purple-200 shadow-xl
            blur-xs transition-all duration-1000 ease-[cubic-bezier(0.77,0,0.175,1)] pointer-events-none flex items-center justify-center`}
          >
            <span className="text-white text-lg font-semibold">{slides[current-1].text}</span>
          </div>
        )}
        {/* Center card */}
        <div
          className={`absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-[220px] h-[320px]
          rounded-2xl bg-gradient-to-br ${slides[current].gradient} border-4 border-purple-400 shadow-2xl z-30
          flex items-center justify-center text-white text-md text-center px-2 font-bold transition-all duration-1000 ease-[cubic-bezier(0.77,0,0.175,1)]`}
        >
          {slides[current].text}
        </div>
        {/* Next card */}
        {current < slides.length - 1 && (
          <div
            className={`absolute right-0 top-1/2 -translate-y-1/2 w-[170px] h-[260px] scale-90 opacity-60 z-10
            rounded-2xl bg-gradient-to-br ${slides[current+1].gradient} border-4 border-purple-200 shadow-xl
            blur-xs transition-all duration-1000 ease-[cubic-bezier(0.77,0,0.175,1)] pointer-events-none flex items-center justify-center`}
          >
            <span className="text-white text-lg font-semibold">{slides[current+1].text}</span>
          </div>
        )}
        {/* Navigation arrows */}
        <button
          onClick={handlePrev}
          disabled={current === 0}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16 text-white bg-purple-400/40 rounded-full p-3 shadow-lg z-40
            disabled:opacity-30"
        >
          &#60;
        </button>
        <button
          onClick={handleNext}
          disabled={current === slides.length - 1}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-16 text-white bg-purple-400/40 rounded-full p-3 shadow-lg z-40
            disabled:opacity-30"
        >
          &#62;
        </button>
      </div>
    </div>
  );
};

export default Carousel;
