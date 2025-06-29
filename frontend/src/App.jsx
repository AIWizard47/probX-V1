import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import LandingPage from "../components/LandingPage";
import AuthPage from "../components/AuthPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import HomePage from "../components/HomePage";
import EventPage from "../components/EventPage";
import { BalanceProvider } from "./provider/BalanceContext";
import Portfolio from "../components/Portfolio";
import Carepage from "../landingPage_Component/care_comp/Carepage";
import Readpage from "../landingPage_Component/read_comp/Readpage";

const token = localStorage.getItem("token");

function App() {
  return (
    <>
      <BrowserRouter>
        {/* <YesNoPriceProvider token={token} eventId={eventId}> */}
        <BalanceProvider token={token}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/care" element={<Carepage />} />
            <Route path="/read" element={<Readpage />} />

            <Route path="/auth" element={<AuthPage />} />
            <Route path="/homePage" element={<HomePage />} />
            <Route path="/event/:id" element={<EventPage />} />
            <Route path="/portfolio" element={<Portfolio />} />
          </Routes>
        </BalanceProvider>
        {/* </YesNoPriceProvider> */}
      </BrowserRouter>

      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="dark"
      />
    </>
  );
}

export default App;
