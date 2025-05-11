import React from "react";
import {
  FaLinkedin,
  FaXTwitter,
  FaInstagram,
  FaYoutube,
} from "react-icons/fa6";

const SocialLinks = () => {
  return (
    <div className="bg-gray-100 border-t  border-black py-6 mt-12 mb-[-40px]">
      <div className="flex justify-center items-center space-x-10">
        <a
          href="#"
          className="flex items-center space-x-2 text-black hover:text-blue-700"
        >
          <FaLinkedin className="text-2xl bg-black text-white p-1 rounded" />
          <span className="font-semibold">LinkedIn</span>
        </a>
        <a
          href="#"
          className="flex items-center space-x-2 text-black hover:text-black"
        >
          <FaXTwitter className="text-2xl bg-black text-white p-1 rounded" />
          <span className="font-semibold">Twitter</span>
        </a>
        <a
          href="#"
          className="flex items-center space-x-2 text-black hover:text-pink-600"
        >
          <FaInstagram className="text-2xl bg-black text-white p-1 rounded" />
          <span className="font-semibold">Instagram</span>
        </a>
        <a
          href="#"
          className="flex items-center space-x-2 text-black hover:text-red-600"
        >
          <FaYoutube className="text-2xl bg-black text-white p-1 rounded" />
          <span className="font-semibold">Youtube</span>
        </a>
      </div>
    </div>
  );
};

export default SocialLinks;
