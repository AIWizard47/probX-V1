import React, { useState } from "react";

const icons = [
  {
    alt: "yt",
    src: "/img/dock-items/yt.png",
    scale: "scale-[0.7]",
    zIndex: "z-[4]",
  },
  {
    alt: "vote",
    src: "/img/dock-items/vote.png",
    scale: "scale-[0.8]",
    zIndex: "z-[5]",
  },
  {
    alt: "news",
    src: "/img/dock-items/news.png",
    scale: "scale-[0.9]",
    zIndex: "z-[6]",
  },
  {
    alt: "cricket",
    src: "/img/dock-items/cricket.png",
    scale: "scale-[1]",
    zIndex: "z-[100]",
  },
  {
    alt: "football",
    src: "/img/dock-items/football.png",
    scale: "scale-[0.9]",
    zIndex: "z-[6]",
  },
  {
    alt: "basketball",
    src: "/img/dock-items/basketball.png",
    scale: "scale-[0.8]",
    zIndex: "z-[5]",
  },
  {
    alt: "yt",
    src: "/img/dock-items/yt.png",
    scale: "scale-[0.7]",
    zIndex: "z-[4]",
  },
];

export default function DockSection() {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <section className="flex min-h-screen flex-col items-center justify-center py-[50px] bg-black mt-[-3rem] ">
      <div className="relative">
        <div className="flex items-center justify-center space-x-4">
          {icons.map((icon, index) => {
            let scaleClass = icon.scale;

            if (hoveredIndex === index) {
              scaleClass = "scale-[1.3]";
            } else if (
              hoveredIndex === index - 1 ||
              hoveredIndex === index + 1 ||
              hoveredIndex === index + 2 ||
              hoveredIndex === index - 2
            ) {
              scaleClass = "scale-[1.1]";
            } else if (
              hoveredIndex === index - 3 ||
              hoveredIndex === index + 3
            ) {
              scaleClass = "scale-[0.9]";
            }

            return (
              <div
                key={index}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={`flex size-24 shrink-0 items-center justify-center rounded-full border border-[#5386ED33] bg-gradient-to-b from-[#080D18] to-[#0F1B32] mx-[-1.2rem] ${icon.zIndex} transform ${scaleClass} transition-transform duration-300 ease-in-out`}
              >
                <img
                  src={icon.src}
                  alt={icon.alt}
                  className="size-12"
                  loading="lazy"
                  style={{ color: "transparent" }}
                />
              </div>
            );
          })}
        </div>
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="706"
            height="165"
            fill="none"
            class="-translate-y-8"
          >
            <g opacity="0.5">
              <path
                fill="url(#dock-platform_svg__a)"
                d="M353 163.5c96.707 0 184.295-6.663 247.739-17.448 31.709-5.391 57.459-11.823 75.316-19 8.921-3.586 15.959-7.391 20.793-11.407 4.818-4.003 7.652-8.395 7.652-13.145s-2.834-9.142-7.652-13.145c-4.834-4.016-11.872-7.821-20.793-11.407-17.857-7.177-43.607-13.609-75.316-19C537.295 48.163 449.707 41.5 353 41.5s-184.295 6.663-247.739 17.448c-31.71 5.391-57.459 11.823-75.316 19-8.92 3.586-15.96 7.391-20.793 11.407C4.334 93.358 1.5 97.75 1.5 102.5s2.834 9.142 7.652 13.145c4.834 4.016 11.872 7.821 20.793 11.407 17.857 7.177 43.607 13.609 75.316 19C168.705 156.837 256.293 163.5 353 163.5"
              ></path>
              <path
                fill="#000"
                d="M353 163.5c96.707 0 184.295-6.663 247.739-17.448 31.709-5.391 57.459-11.823 75.316-19 8.921-3.586 15.959-7.391 20.793-11.407 4.818-4.003 7.652-8.395 7.652-13.145s-2.834-9.142-7.652-13.145c-4.834-4.016-11.872-7.821-20.793-11.407-17.857-7.177-43.607-13.609-75.316-19C537.295 48.163 449.707 41.5 353 41.5s-184.295 6.663-247.739 17.448c-31.71 5.391-57.459 11.823-75.316 19-8.92 3.586-15.96 7.391-20.793 11.407C4.334 93.358 1.5 97.75 1.5 102.5s2.834 9.142 7.652 13.145c4.834 4.016 11.872 7.821 20.793 11.407 17.857 7.177 43.607 13.609 75.316 19C168.705 156.837 256.293 163.5 353 163.5"
              ></path>
              <path
                stroke="url(#dock-platform_svg__b)"
                stroke-width="3"
                d="M353 163.5c96.707 0 184.295-6.663 247.739-17.448 31.709-5.391 57.459-11.823 75.316-19 8.921-3.586 15.959-7.391 20.793-11.407 4.818-4.003 7.652-8.395 7.652-13.145s-2.834-9.142-7.652-13.145c-4.834-4.016-11.872-7.821-20.793-11.407-17.857-7.177-43.607-13.609-75.316-19C537.295 48.163 449.707 41.5 353 41.5s-184.295 6.663-247.739 17.448c-31.71 5.391-57.459 11.823-75.316 19-8.92 3.586-15.96 7.391-20.793 11.407C4.334 93.358 1.5 97.75 1.5 102.5s2.834 9.142 7.652 13.145c4.834 4.016 11.872 7.821 20.793 11.407 17.857 7.177 43.607 13.609 75.316 19C168.705 156.837 256.293 163.5 353 163.5Z"
              ></path>
              <path
                stroke="url(#dock-platform_svg__c)"
                stroke-width="3"
                d="M353 163.5c96.707 0 184.295-6.663 247.739-17.448 31.709-5.391 57.459-11.823 75.316-19 8.921-3.586 15.959-7.391 20.793-11.407 4.818-4.003 7.652-8.395 7.652-13.145s-2.834-9.142-7.652-13.145c-4.834-4.016-11.872-7.821-20.793-11.407-17.857-7.177-43.607-13.609-75.316-19C537.295 48.163 449.707 41.5 353 41.5s-184.295 6.663-247.739 17.448c-31.71 5.391-57.459 11.823-75.316 19-8.92 3.586-15.96 7.391-20.793 11.407C4.334 93.358 1.5 97.75 1.5 102.5s2.834 9.142 7.652 13.145c4.834 4.016 11.872 7.821 20.793 11.407 17.857 7.177 43.607 13.609 75.316 19C168.705 156.837 256.293 163.5 353 163.5Z"
              ></path>
            </g>
            <g opacity="0.5">
              <path
                fill="url(#dock-platform_svg__d)"
                d="M353 143.5c96.707 0 184.294-6.607 247.737-17.302 31.709-5.345 57.458-11.723 75.314-18.839 8.92-3.555 15.958-7.329 20.792-11.31C701.66 92.08 704.5 87.72 704.5 83s-2.84-9.08-7.657-13.048c-4.834-3.982-11.872-7.756-20.792-11.31-17.856-7.117-43.605-13.495-75.314-18.84C537.294 29.107 449.707 22.5 353 22.5s-184.294 6.607-247.737 17.302c-31.709 5.345-57.458 11.723-75.314 18.84-8.92 3.554-15.958 7.328-20.792 11.31C4.34 73.92 1.5 78.279 1.5 83s2.84 9.08 7.657 13.048c4.834 3.982 11.872 7.756 20.792 11.311 17.856 7.116 43.605 13.494 75.314 18.839C168.706 136.893 256.293 143.5 353 143.5"
              ></path>
              <path
                fill="#000"
                d="M353 143.5c96.707 0 184.294-6.607 247.737-17.302 31.709-5.345 57.458-11.723 75.314-18.839 8.92-3.555 15.958-7.329 20.792-11.31C701.66 92.08 704.5 87.72 704.5 83s-2.84-9.08-7.657-13.048c-4.834-3.982-11.872-7.756-20.792-11.31-17.856-7.117-43.605-13.495-75.314-18.84C537.294 29.107 449.707 22.5 353 22.5s-184.294 6.607-247.737 17.302c-31.709 5.345-57.458 11.723-75.314 18.84-8.92 3.554-15.958 7.328-20.792 11.31C4.34 73.92 1.5 78.279 1.5 83s2.84 9.08 7.657 13.048c4.834 3.982 11.872 7.756 20.792 11.311 17.856 7.116 43.605 13.494 75.314 18.839C168.706 136.893 256.293 143.5 353 143.5"
              ></path>
              <path
                stroke="url(#dock-platform_svg__e)"
                stroke-width="3"
                d="M353 143.5c96.707 0 184.294-6.607 247.737-17.302 31.709-5.345 57.458-11.723 75.314-18.839 8.92-3.555 15.958-7.329 20.792-11.31C701.66 92.08 704.5 87.72 704.5 83s-2.84-9.08-7.657-13.048c-4.834-3.982-11.872-7.756-20.792-11.31-17.856-7.117-43.605-13.495-75.314-18.84C537.294 29.107 449.707 22.5 353 22.5s-184.294 6.607-247.737 17.302c-31.709 5.345-57.458 11.723-75.314 18.84-8.92 3.554-15.958 7.328-20.792 11.31C4.34 73.92 1.5 78.279 1.5 83s2.84 9.08 7.657 13.048c4.834 3.982 11.872 7.756 20.792 11.311 17.856 7.116 43.605 13.494 75.314 18.839C168.706 136.893 256.293 143.5 353 143.5Z"
              ></path>
              <path
                stroke="url(#dock-platform_svg__f)"
                stroke-width="3"
                d="M353 143.5c96.707 0 184.294-6.607 247.737-17.302 31.709-5.345 57.458-11.723 75.314-18.839 8.92-3.555 15.958-7.329 20.792-11.31C701.66 92.08 704.5 87.72 704.5 83s-2.84-9.08-7.657-13.048c-4.834-3.982-11.872-7.756-20.792-11.31-17.856-7.117-43.605-13.495-75.314-18.84C537.294 29.107 449.707 22.5 353 22.5s-184.294 6.607-247.737 17.302c-31.709 5.345-57.458 11.723-75.314 18.84-8.92 3.554-15.958 7.328-20.792 11.31C4.34 73.92 1.5 78.279 1.5 83s2.84 9.08 7.657 13.048c4.834 3.982 11.872 7.756 20.792 11.311 17.856 7.116 43.605 13.494 75.314 18.839C168.706 136.893 256.293 143.5 353 143.5Z"
              ></path>
            </g>
            <path
              fill="url(#dock-platform_svg__g)"
              d="M353 123.5c96.707 0 184.295-6.663 247.739-17.448 31.709-5.391 57.459-11.823 75.316-19 8.921-3.586 15.959-7.391 20.793-11.407 4.818-4.003 7.652-8.395 7.652-13.145s-2.834-9.142-7.652-13.145c-4.834-4.016-11.872-7.821-20.793-11.407-17.857-7.177-43.607-13.609-75.316-19C537.295 8.163 449.707 1.5 353 1.5S168.705 8.163 105.261 18.948c-31.71 5.391-57.459 11.823-75.316 19-8.92 3.586-15.96 7.391-20.793 11.407C4.334 53.358 1.5 57.75 1.5 62.5s2.834 9.142 7.652 13.145c4.834 4.016 11.872 7.821 20.793 11.407 17.857 7.177 43.607 13.609 75.316 19C168.705 116.837 256.293 123.5 353 123.5"
            ></path>
            <path
              stroke="url(#dock-platform_svg__h)"
              stroke-width="3"
              d="M353 123.5c96.707 0 184.295-6.663 247.739-17.448 31.709-5.391 57.459-11.823 75.316-19 8.921-3.586 15.959-7.391 20.793-11.407 4.818-4.003 7.652-8.395 7.652-13.145s-2.834-9.142-7.652-13.145c-4.834-4.016-11.872-7.821-20.793-11.407-17.857-7.177-43.607-13.609-75.316-19C537.295 8.163 449.707 1.5 353 1.5S168.705 8.163 105.261 18.948c-31.71 5.391-57.459 11.823-75.316 19-8.92 3.586-15.96 7.391-20.793 11.407C4.334 53.358 1.5 57.75 1.5 62.5s2.834 9.142 7.652 13.145c4.834 4.016 11.872 7.821 20.793 11.407 17.857 7.177 43.607 13.609 75.316 19C168.705 116.837 256.293 123.5 353 123.5Z"
            ></path>
            <path
              stroke="url(#dock-platform_svg__i)"
              stroke-width="3"
              d="M353 123.5c96.707 0 184.295-6.663 247.739-17.448 31.709-5.391 57.459-11.823 75.316-19 8.921-3.586 15.959-7.391 20.793-11.407 4.818-4.003 7.652-8.395 7.652-13.145s-2.834-9.142-7.652-13.145c-4.834-4.016-11.872-7.821-20.793-11.407-17.857-7.177-43.607-13.609-75.316-19C537.295 8.163 449.707 1.5 353 1.5S168.705 8.163 105.261 18.948c-31.71 5.391-57.459 11.823-75.316 19-8.92 3.586-15.96 7.391-20.793 11.407C4.334 53.358 1.5 57.75 1.5 62.5s2.834 9.142 7.652 13.145c4.834 4.016 11.872 7.821 20.793 11.407 17.857 7.177 43.607 13.609 75.316 19C168.705 116.837 256.293 123.5 353 123.5Z"
            ></path>
            <defs>
              <linearGradient
                id="dock-platform_svg__a"
                x1="353"
                x2="353"
                y1="43"
                y2="162"
                gradientUnits="userSpaceOnUse"
              >
                <stop></stop>
                <stop offset="1" stop-color="#3C3C3C"></stop>
              </linearGradient>
              <linearGradient
                id="dock-platform_svg__b"
                x1="3"
                x2="703"
                y1="102.5"
                y2="102.5"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#3B49E1"></stop>
                <stop offset="0.15" stop-color="#A4BF2B"></stop>
                <stop offset="0.3" stop-color="#EA4E43"></stop>
                <stop offset="0.502" stop-color="#EA5953"></stop>
                <stop offset="0.7" stop-color="#EA4E43"></stop>
                <stop offset="0.85" stop-color="#A4BF2B"></stop>
                <stop offset="1" stop-color="#3B49E1"></stop>
              </linearGradient>
              <linearGradient
                id="dock-platform_svg__c"
                x1="353"
                x2="353"
                y1="43"
                y2="162"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0.352"></stop>
                <stop offset="1" stop-opacity="0"></stop>
              </linearGradient>
              <linearGradient
                id="dock-platform_svg__d"
                x1="353"
                x2="353"
                y1="24"
                y2="142"
                gradientUnits="userSpaceOnUse"
              >
                <stop></stop>
                <stop offset="1" stop-color="#3C3C3C"></stop>
              </linearGradient>
              <linearGradient
                id="dock-platform_svg__e"
                x1="3"
                x2="703"
                y1="83"
                y2="83"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#3B49E1"></stop>
                <stop offset="0.15" stop-color="#A4BF2B"></stop>
                <stop offset="0.3" stop-color="#EA4E43"></stop>
                <stop offset="0.502" stop-color="#EA5953"></stop>
                <stop offset="0.7" stop-color="#EA4E43"></stop>
                <stop offset="0.85" stop-color="#A4BF2B"></stop>
                <stop offset="1" stop-color="#3B49E1"></stop>
              </linearGradient>
              <linearGradient
                id="dock-platform_svg__f"
                x1="353"
                x2="353"
                y1="24"
                y2="142"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0.352"></stop>
                <stop offset="1" stop-opacity="0"></stop>
              </linearGradient>
              <linearGradient
                id="dock-platform_svg__g"
                x1="353"
                x2="353"
                y1="3"
                y2="122"
                gradientUnits="userSpaceOnUse"
              >
                <stop></stop>
                <stop offset="1" stop-color="#3C3C3C"></stop>
              </linearGradient>
              <linearGradient
                id="dock-platform_svg__h"
                x1="3"
                x2="703"
                y1="62.5"
                y2="62.5"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#3B49E1"></stop>
                <stop offset="0.15" stop-color="#A4BF2B"></stop>
                <stop offset="0.3" stop-color="#EA4E43"></stop>
                <stop offset="0.502" stop-color="#EA5953"></stop>
                <stop offset="0.7" stop-color="#EA4E43"></stop>
                <stop offset="0.85" stop-color="#A4BF2B"></stop>
                <stop offset="1" stop-color="#3B49E1"></stop>
              </linearGradient>
              <linearGradient
                id="dock-platform_svg__i"
                x1="353"
                x2="353"
                y1="3"
                y2="122"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0.352"></stop>
                <stop offset="1" stop-opacity="0"></stop>
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div>
          <div>
            <div className="flex justify-center">
              <span className="text-white font-semibold text-5xl mr-2">
                Cricket
              </span>{" "}
              <span className="text-blue-400 font-semibold text-5xl mr-2">
                Football
              </span>{" "}
              <span className="text-yellow-400 font-semibold text-5xl mr-2">
                Tweet
              </span>
            </div>

            <div className="flex justify-center">
              <span className="text-fuchsia-500 font-semibold text-5xl mr-2">
                News
              </span>{" "}
              <span className="text-white font-semibold text-5xl mr-2">
                Youtube
              </span>{" "}
              <span className="text-fuchsia-900 font-semibold text-5xl mr-2">
                Election
              </span>
            </div>

            <div className="flex justify-center">
              <span className="text-amber-200 font-semibold text-5xl mr-2">
                Entertainment
              </span>{" "}
              <span className="text-indigo-700 font-semibold text-5xl mr-2">
                Instagram
              </span>{" "}
              <span className="text-yellow-400 font-semibold text-5xl mr-2">
                &
              </span>
            </div>
            <div className="flex justify-center">
              <span className="text-white font-semibold text-5xl mr-2">
                Economy
              </span>{" "}
            </div>
          </div>
        </div>
      </div>
      <div className="text-white flex flex-col justify-center items-center py-[200px] ">
        <div>
          {" "}
          <p className="text-5xl font-bold">PridtX is Transparent</p>
        </div>
        <div className="w-[50vw] text-gray-500">
          <h1 className="text-2xl font-semibold mt-5 flex justify-center flex-col items-center">
            <p>
              Every step is built to ensure real users engage in every opinion
            </p>
            <p>trade. The platform is designed to be intuitive, insightful,</p>
            <p>and easy to navigate for a smooth, informed experience.</p>
          </h1>
        </div>
      </div>
    </section>
  );
}
