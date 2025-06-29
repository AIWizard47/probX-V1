import React from "react";
import Navbar from "../Navbar";
import Footer from "../Footer";

const Carepage = () => {
  return (
    <div>
      <Navbar />
      <main className="flex-grow">
        <iframe
          src="landingPage_Component/care_comp/cares/cares.html"
          title="Cares Page"
          width="100%"
          height="2000px"
          style={{
            border: "none",
            width: "100%",
            height: "100vh",
            overflow: "hidden",
          }}
        />
      </main>
      <Footer />
    </div>
  );
};

export default Carepage;
