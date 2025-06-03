import React from "react";

const Features = () => {
  return (
    <div className="min-h-screen bg-black px-8 py-16 -mt-10 pb-[4rem]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-20">
          <h1 className="text-6xl md:text-7xl font-bold text-white leading-tight mb-4">
            Smart choices, responsible play.
          </h1>
          <h2 className="text-6xl md:text-7xl font-bold text-white leading-tight">
            PredictX puts you first.
          </h2>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Card 1 - Fastest news feed */}
          <div className="space-y-6">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
              <img src="../src/assets/news.avif" alt="" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">
                Fastest news feed in the game
              </h3>
              <p className="text-gray-300 leading-relaxed">
                PredictX is all about understanding the world around us and
                being firing from our knowledge. Everything on PredictX is based
                on real events that you can learn about, verify and follow
                yourself.
              </p>
            </div>
          </div>

          {/* Card 2 - All the news without noise */}
          <div className="space-y-6">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
              <div className="w-6 h-10 bg-white clip-path-diamond opacity-80"></div>
              <img src="../src/assets/trading.avif" alt="" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">
                All the news without the noise
              </h3>
              <p className="text-gray-300 leading-relaxed">
                Our experts go through tons of information to get to the very
                core of a world event. They help you form well-informed
                perspectives about events but also a better understanding of the
                world around us.
              </p>
            </div>
          </div>

          {/* Card 3 - Power to exit */}
          <div className="space-y-6">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-200 to-purple-300 rounded-2xl flex items-center justify-center shadow-lg">
              <img src="../src/assets/trades.avif" alt="" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">
                The power to exit, anytime
              </h3>
              <p className="text-gray-300 leading-relaxed">
                PredictX is a skill-based gaming platform that gives you full
                control over your choices. Just like in any strategy-driven
                game, PredictX allows you to exit an event if it's not aligning
                with your expectations, helping you make smarter decisions.
              </p>
            </div>
          </div>

          {/* Card 4 - Pulse of society */}
          <div className="space-y-6">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-300 to-purple-500 rounded-full flex items-center justify-center shadow-lg relative">
              <img src="../src/assets/society.avif" alt="" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">
                The pulse of society is on PredictX
              </h3>
              <p className="text-gray-300 leading-relaxed">
                Beyond sharpening your decision-making skills, PredictX allows
                you to tap into collective market sentiment. Gain insights into
                what people are thinking, analyze trends, and engage with events
                in a responsible way.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;
