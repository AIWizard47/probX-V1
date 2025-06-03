import React from "react";

const Feature3 = () => {
  return (
    <div className="min-h-screen bg-black px-8 py-30 relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Main Content */}
        <div className="text-center">
          {/* Heading */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-12 max-w-5xl mx-auto">
            What will be the return on your opinions?
          </h1>

          {/* Download Button */}
          <button className="inline-flex items-center px-8 py-4 border-2 border-white rounded-full text-white text-lg font-medium hover:bg-white hover:text-black transition-all duration-300 group">
            Download App
            <svg
              className="ml-3 w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Left Image */}
      <div className="absolute left-0 bottom-0 w-1/3 h-2/3">
        <img
          src="../src/assets/person-left.avif"
          alt="Person pointing"
          className="w-full h-full object-cover object-top grayscale"
        />
      </div>

      {/* Right Image */}
      <div className="absolute right-0 bottom-0 w-1/3 h-2/3">
        <img
          src="../src/assets//person-right.avif"
          alt="Person smiling"
          className="w-full h-full object-cover object-top grayscale"
        />
      </div>

      {/* Gradient Overlays for better text readability */}
      <div className="absolute left-0 bottom-0 w-1/3 h-2/3 bg-gradient-to-r from-transparent to-black opacity-50"></div>
      <div className="absolute right-0 bottom-0 w-1/3 h-2/3 bg-gradient-to-l from-transparent to-black opacity-50"></div>
    </div>
  );
};

export default Feature3;
