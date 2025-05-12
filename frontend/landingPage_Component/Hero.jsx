import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const HeroSection = () => {
  const [isChecked, setIsChecked] = useState(true);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };
  const navigate = useNavigate();
  const handleCreateAccount = () => {
    if (isChecked == false) {
      toast.warning("These is only for 18 years and above . ");
      return;
    }
    navigate("/auth");
  };
  return (
    <div className="px-6  md:p-12 mt-[-80px] ">
      <div className="flex flex-col md:flex-row items-center justify-between">
        {/* Left Section (Text) */}
        <div className="md:w-1/2 w-full text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-bold text-black leading-tight">
            India’s Leading Online Skill Gaming Platform
            <br />
            Trade Your Opinions.
          </h1>
          <p className="mt-3 text-lg text-black">
            Buy and sell shares on future outcomes across politics, sports,
            entertainment, and more.
          </p>
          <div className="mt-8">
            <button
              className="bg-black text-white hover:bg-white hover:text-black font-medium py-3 px-6 rounded shadow-md"
              onClick={handleCreateAccount}
            >
              Create Account
            </button>
            <button className="ml-4 text-black border border-black hover:bg-black hover:text-white hover:border-white font-medium py-3 px-6 rounded-lg">
              Explore Markets
            </button>
          </div>
          <label>
            <input
              type="checkbox"
              checked={isChecked}
              onChange={handleCheckboxChange}
              className="scale-120 mr-2 ml-1 accent-black"
            />
            For 18 years and above only .
          </label>
        </div>

        {/* Right Section (Image) */}
        <div className="md:w-1/2 w-full mt-8 md:mt-0 relative">
          <img
            src="https://probo.in/_next/image?url=https%3A%2F%2Fd39axbyagw7ipf.cloudfront.net%2Fimages%2Fhome%2Fheader%2Fheader-img-20250509_v1.png&w=1200&q=75"
            width={650}
            height={650}
            className="z-10"
            alt="Hero"
          />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
