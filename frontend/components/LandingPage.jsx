import React from "react";
import Navbar from "../landingPage_Component/Navbar";
import HeroSection from "../landingPage_Component/Hero";
import Footer from "../landingPage_Component/Footer";
import CircularIcons from "../landingPage_Component/CircularIcon";

const LandingPage = () => {
  return (
    <div>
      <Navbar></Navbar>
      <main className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <HeroSection></HeroSection>
      </main>
      <CircularIcons></CircularIcons>
      <Footer></Footer>
    </div>
  );
};

export default LandingPage;
