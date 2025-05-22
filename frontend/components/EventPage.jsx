import { useParams } from "react-router-dom";
import HNavbar from "../HomePage_Component/HNavbar";
import Footer from "../landingPage_Component/Footer";
import OrderForm from "../EventPage_Component/OrderForm";
import EventDetails from "../EventPage_Component/EventDetails";
import { getUser } from "../utils";
import OrderBook from "../EventPage_Component/OrderBook";

export default function EventPage() {
  const { id } = useParams();
  const user = getUser();
  if (!user) {
    window.location.href = "/login";
  }

  return (
    <div className="min-h-screen flex flex-col">
      <HNavbar  />

      <div className="flex flex-1 px-30 py-10 bg-[#f5f5f5]">
        <div className="w-2/3 pr-4 overflow-y-auto max-h-[calc(100vh-80px)] scrollbar-hide">
          <div className="left pb-5">
            <span className="font-semibold text-lg text-[#959595] mr-2">
              Home{"  >"}
            </span>
            <span className="font-semibold text-black font-medium">
              Event Details
            </span>{" "}
          </div>


          <EventDetails id={id}></EventDetails>
        </div>

        <div className="w-1/3">
          <div className="sticky top-24">
            {" "}
            <OrderForm id={id} />
          </div>
        </div>
      </div>

      <Footer bgColor="bg-[#f5f5f5]" textColor="text-black" />
    </div>
  );
}
