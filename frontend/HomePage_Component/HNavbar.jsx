import React from "react";
import { FaShoppingBag } from "react-icons/fa";
import { CiWallet } from "react-icons/ci";
import { IoIosLogOut } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const HNavbar = ({ user }) => {
  const char = user?.username?.[0]?.toUpperCase() || "";
  const balance = user?.balance ? Math.floor(user.balance * 100) / 100 : 0;
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
    toast.success("Logout Successfully !");
  };
  return (
    <nav className="bg-[#f5f5f5] shadow-sm border-b-2 border-[#e4e4e4]">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center justify-between w-[100%]">
            <div className="flex  items-center">
              <svg
                className="h-8 w-8 text-black"
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
              <span className="ml-2 text-xl font-bold text-gray-800">
                PredictX
              </span>
            </div>

            <div className="flex mr-20 items-center">
              <div className="flex flex-col items-center mx-7">
                <FaShoppingBag className="text-[1.3rem]   " />
                <p>Portfolio</p>
              </div>
              <div className="flex items-center justify-between w-[6.5rem] h-[2rem] border rounded-md px-3 mr-7 ">
                <CiWallet className="text-xl" />
                <p className="font-semibold">₹{balance}</p>
              </div>

              <div className="rounded-full bg-[#dcdcdc] w-[3rem] h-[3rem] flex items-center justify-center text-2xl font-bold mr-10">
                {char}
              </div>
              <div
                className="flex items-center border px-2 rounded "
                onClick={handleLogout}
              >
                <IoIosLogOut className="text-[2rem] font-bold  " />
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default HNavbar;
