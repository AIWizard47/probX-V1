import axios from "axios";
import { useEffect, useState } from "react";
import RulesSection from "./EventRules";
import Loader from "../components/Loader";
import OrderBook from "./OrderBook";
import ProbabilityChart from "./ProbabilityChart";

const EventDetails = ({ id }) => {
  const eventid = id;
  const [event, setEvent] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/user/event/${eventid}`)
      .then((res) => {
        console.log(res.data.event);
        const recivedEvent = res.data?.event || {};
        if (recivedEvent.length === 0) {
          setEvent({});
        } else {
          setEvent(recivedEvent);
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const starttime = new Date(event.startTime);
  const endtime = new Date(event.endTime);

  const startTime = starttime.toLocaleString("en-US", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "short", // or "long" or "2-digit"
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true, // for AM/PM format
  });

  const endTime = endtime.toLocaleString("en-US", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return loading ? (
    <Loader />
  ) : (
    <div>
      <div className="flex items-center gap-6 mb-8">
        <img
          src={event.eventLogo}
          className="w-30 h-30 object-cover rounded"
          alt=""
        />
        <h1 className="font-black text-3xl font-bold max-w-[500px]">
          {event.eventTitle}
        </h1>
      </div>

      <OrderBook eventId={id}/>
      <ProbabilityChart/>

      <div>
        <div className="bg-white p-10 rounded-xl shadow-md my-16 mx-auto text-gray-800">
          <h2 className="text-2xl font-semibold mb-4">About the event</h2>
          <div className="flex justify-between">
            <div className="mb-4">
              <p className="font-medium">Source of Truth</p>
              <a
                href="https://www.thesportsmandi.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                www.thesportsmandi.com
              </a>
            </div>

            <div>
              <p className="font-medium">Trading started on</p>
              <p>{startTime}</p>
            </div>
            <div>
              <p className="font-medium">Event expires on</p>
              <p>{endTime}</p>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold">Event Overview & Statistics</h3>
            <p className="text-sm leading-relaxed mt-1">{event.description}</p>
          </div>

          <RulesSection />
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
