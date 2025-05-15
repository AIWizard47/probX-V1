import React from "react";
import {
  FaLinkedin,
  FaXTwitter,
  FaInstagram,
  FaYoutube,
  FaFacebook,
} from "react-icons/fa6";

const SocialLinks = ({ bgColor = "bg-[#050505]" }) => {
  return (
    <div className={`${bgColor} border-t  border-black py-6 mt-12 mb-[-40px]`}>
      <div className="flex justify-center items-center space-x-10">
        <a
          href="#"
          className="flex items-center space-x-2 text-black hover:text-blue-700"
        >
          <FaLinkedin className="text-5xl bg-black hover:bg-blue-600 transition-all duration-300 ease-in-out text-white p-1 rounded" />
        </a>
        <a
          href="#"
          className="flex items-center space-x-2 text-black hover:text-black"
        >
          <FaXTwitter className="text-5xl transition-all duration-300 ease-in-out bg-black text-white p-1 rounded" />
        </a>
        <a
          href="#"
          className="flex items-center space-x-2 text-black hover:text-pink-600"
        >
          <FaInstagram className="text-5xl transition-all duration-300 ease-in-out bg-black hover:bg-pink-600 text-white p-1 rounded" />
        </a>
        <a
          href="#"
          className="flex items-center space-x-2 text-black hover:text-red-600"
        >
          <FaYoutube className="text-5xl transition-all duration-300 ease-in-out bg-black hover:bg-red-600 text-white p-1 rounded" />
        </a>
        <a
          href="#"
          className="flex items-center space-x-2 text-black hover:text-red-600"
        >
          <FaFacebook className="text-5xl transition-all duration-300 ease-in-out bg-black hover:bg-blue-600 text-white p-1 rounded" />
        </a>
      </div>
    </div>
  );
};

export default SocialLinks;
