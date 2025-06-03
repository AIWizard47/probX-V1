import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";

const categories = [
  { label: "All events", route: "All EVENTS" },
  { label: "Cricket", route: "CRICKET" },
  { label: "Crypto", route: "CRYPTO" },
  { label: "Youtube", route: "YOUTUBE" },
  { label: "Instagram", route: "INSTAGRAM" },
  { label: "News", route: "NEWS" },
  { label: "Tweet", route: "TWEET" },
  { label: "Movie", route: "MOVIE" },
  { label: "Stock Market", route: "STOCKMARKET" },
  { label: "Football", route: "FOOTBALL" },
  { label: "Gaming", route: "GAMING" },
  { label: "Chess", route: "CHESS" },
  { label: "Kabbadi", route: "KABBADI" },
  { label: "PridictX", route: "PRIDICTX" },
];

export default function CategoryTabs() {
  const [activeRoute, setActiveRoute] = useState("All EVENTS");
  const [events, setEvents] = useState([{}]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (activeRoute === "All EVENTS") {
      axios
        .get("http://localhost:3000/api/user/event")
        .then((res) => {
          //console.log(res.data.events);
          setEvents(res.data.events);
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      axios
        .get(`http://localhost:3000/api/user/event/category/${activeRoute}`)
        .then((res) => {
          //console.log(res.data.events);
          const receivedEvents = res.data?.events || [];
          if (receivedEvents.length === 0) {
            setEvents([]);
          } else {
            setEvents(receivedEvents);
          }
        })
        .catch((err) => {
          // coming error in which cateogery where no events is published .
          setEvents([]);
          console.log(err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [activeRoute]);

  const navigate = useNavigate();

  const handleEventPage = (eve) => {
    navigate(`/event/${eve.id}`);
  };

  return (
    <>
      <div>
        <div className="border-b flex items-center justify-center">
          <nav className="flex space-x-10 overflow-x-auto px-4 py-2 text-sm font-medium text-gray-600 whitespace-nowrap">
            {categories.map(({ label, route }) => (
              <button
                key={route}
                onClick={() => setActiveRoute(route)}
                className={`pb-1 ${
                  activeRoute === route
                    ? "text-black font-semibold border-b-2 border-black"
                    : "hover:text-black"
                }`}
              >
                {label}
              </button>
            ))}
          </nav>
        </div>

        <div className="px-10 py-5">
          <div>
            <h1 className="text-2xl font-bold border-b-1">{activeRoute}</h1>
          </div>

          {events.length === 0 ? (
            loading ? (
              <Loader />
            ) : (
              <div className="pt-10 h-[60vh]">
                <h1 className="font-bold text-2xl text-shadow-pink-100 font-stretch-180% ">
                  NO Eventes published yet Plese Visits another events .
                </h1>
              </div>
            )
          ) : loading ? (
            <Loader />
          ) : (
            <div className="pt-5 grid grid-cols-3 gap-3 min-h-[70vh]">
              {events.map((eve) => (
                <div
                  key={eve.id}
                  className="max-w-[400px] h-50 rounded-xl shadow- p-5 bg-white space-y-3 border-0 flex flex-col justify-between "
                  onClick={() => handleEventPage(eve)}
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={eve.eventLogo}
                      alt="EventLogo"
                      className="w-14 h-14 object-cover rounded"
                    />
                    <h2 className="font-semibold text-base text-gray-800">
                      {eve.eventTitle}
                    </h2>
                  </div>

                  {/* Match details */}
                  <p className="text-sm text-gray-600">
                    <span className="inline-block mr-1"></span>
                    {eve.details}
                    <span className="text-blue-600 cursor-pointer ml-1">
                      Read more
                    </span>
                  </p>

                  {/* Buttons */}
                  <div className="flex gap-2">
                    <button className="flex-1 py-2 rounded-md bg-blue-50 text-blue-600 font-semibold border border-blue-200 hover:bg-blue-100">
                      Yes ₹{eve.yesPrice.toFixed(2)}
                    </button>
                    <button className="flex-1 py-2 rounded-md bg-red-50 text-red-600 font-semibold border border-red-200 hover:bg-red-100">
                      No ₹{eve.noPrice.toFixed(2)}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
