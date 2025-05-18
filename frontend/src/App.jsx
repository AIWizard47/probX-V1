import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import LandingPage from "../components/LandingPage";
import AuthPage from "../components/AuthPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import HomePage from "../components/HomePage";
import EventPage from "../components/EventPage";
import { BalanceProvider } from "./provider/BalanceContext";
import { YesNoPriceProvider } from "./provider/YesNoPrice";


const token = localStorage.getItem("token");

function App() {
  return (
    <>
      <BrowserRouter>
      {/* <YesNoPriceProvider token={token} eventId={eventId}> */}
        <BalanceProvider token={token}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/homePage" element={<HomePage />} />
            <Route path="/event/:id" element={<EventPage />} />
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
