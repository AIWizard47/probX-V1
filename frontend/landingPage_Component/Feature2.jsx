import React from "react";

const Feature2 = () => {
  const profiles = [
    {
      name: "Nazar",
      description:
        "Keep an eye on the happenings around you. Be it Politics, Sports, Entertainment and more.",
      color: "bg-purple-400",
      imageUrl: "../src/assets/nazar.avif",
    },
    {
      name: "Khabar",
      description:
        "Understand the news without the noise. Get to the crux of every matter and develop an opinion.",
      color: "bg-purple-300",
      imageUrl: "../src/assets/khabar.avif",
    },
    {
      name: "Jigar",
      description:
        "Have the courage to stand by your opinions about upcoming world events by investing in them.",
      color: "bg-purple-500",
      imageUrl: "../src/assets/jigar.avif",
    },
    {
      name: "Sabar",
      description:
        "Have the patience to negotiate market ups and downs, and take a decision as events unfold.",
      color: "bg-purple-400",
      imageUrl: "../src/assets/sabar.avif",
    },
  ];

  return (
    <div className="min-h-screen bg-black px-8 py-48">
      <div className="max-w-7xl mx-auto">
        {/* Header with decorative quotes */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight">
            <span className="text-purple-400 text-6xl md:text-7xl">"</span>
            News that creates trading
          </h1>
          <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight mb-4">
            opportunity, everyday
            <span className="text-purple-400 text-6xl md:text-7xl ml-2">"</span>
          </h1>
        </div>

        {/* Profile Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {profiles.map((profile, index) => (
            <div key={index} className="text-center">
              {/* Circular Avatar Image */}
              <div className="relative mx-auto mb-6">
                <img
                  src={profile.imageUrl}
                  alt={profile.name}
                  className="w-[80%] object-cover rounded-full mx-auto"
                />
              </div>

              {/* Name */}
              <h3 className="text-2xl font-bold text-white mb-4">
                {profile.name}
              </h3>

              {/* Description */}
              <p className="text-gray-300 leading-relaxed text-center max-w-xs mx-auto">
                {profile.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Feature2;
