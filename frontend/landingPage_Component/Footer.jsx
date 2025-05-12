import React from "react";
import SocialLinks from "./SocialLinks";

const Footer = () => {
  return (
    <footer className="bg-[#050505] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center">
              <svg
                className="h-8 w-8 text-white"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2 12C2 6.48 6.48 2 12 2C17.52 2 22 6.48 22 12C22 17.52 17.52 22 12 22"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M13 2.05C13 2.05 16 6 16 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M11 21.95C11 21.95 8 18 8 12C8 6 11 2.05 11 2.05"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2.63 15.5H12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2.63 8.5H21.37"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="ml-2 text-xl font-bold">PredictX</span>
            </div>
            <p className="mt-4 text-white">
              Trade on your beliefs and insights about future events. PredictX
              is the leading platform for prediction markets.
            </p>
          </div>

          {[
            {
              heading: "Platform",
              links: [
                "Browse Markets",
                "Create Market",
                "Leaderboard",
                "How It Works",
                "API",
              ],
            },
            {
              heading: "Resources",
              links: [
                "Help Center",
                "Blog",
                "Market Rules",
                "FAQ",
                "Contact Us",
              ],
            },
            {
              heading: "Legal",
              links: [
                "Terms of Service",
                "Privacy Policy",
                "Cookie Policy",
                "Risk Disclosure",
              ],
            },
          ].map((section, idx) => (
            <div key={idx}>
              <h3 className="text-lg font-semibold mb-4">{section.heading}</h3>
              <ul className="space-y-2">
                {section.links.map((link, i) => (
                  <li key={i}>
                    <a href="#" className="text-white hover:text-black">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <SocialLinks></SocialLinks>

        <div className="mt-12 border-t border-black pt-8 flex flex-col md:flex-row justify-between">
          <p className="text-white">© 2024 PredictX. All rights reserved.</p>
          <div className="mt-4 md:mt-0">
            <p className="text-white">
              This game may be habit forming or financially risky. Play
              responsibly. 18+ only.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
