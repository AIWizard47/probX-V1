import React from "react";
import Navbar from "../Navbar";
import Footer from "../Footer";

const Readpage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow">
        <iframe
          src={`landingPage_Component/read_comp/read/read.html`}
          title="Read Page"
          style={{
            width: "100%",
            height: "100vh", // Adjust height as needed
            border: "none",
          }}
        />
      </main>

      <Footer />
    </div>
  );
};

export default Readpage;
