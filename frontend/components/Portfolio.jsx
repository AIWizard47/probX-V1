import { useEffect, useState } from "react";
import HNavbar from "../HomePage_Component/HNavbar";
import SellCard from "./SellCard";
import axios from "axios";
import Footer from "../landingPage_Component/Footer";
import ExitCard from "./Exitcard";

const Portfolio = () => {
  const [allSellTrade, setAllSellTrade] = useState([]);
  const [allOpenTrade, setOpenSellTrade] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("completed"); // "completed" or "pending"

  const fetchAllSellTrade = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:3000/api/user/pridiction",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data && Array.isArray(response.data.predictions)) {
        setAllSellTrade(response.data.predictions);
      } else {
        console.warn(
          "API response doesn't contain predictions array:",
          response.data
        );
        setAllSellTrade([]);
      }
    } catch (error) {
      console.error("Error fetching trades:", error);
      setError("Failed to load trades. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const fetchAllOpenTrade = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:3000/api/user/trade/open",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data && Array.isArray(response.data.orders)) {
        setOpenSellTrade(response.data.orders);
      } else {
        console.warn(
          "API response doesn't contain orders array:",
          response.data
        );
        setOpenSellTrade([]);
      }
    } catch (error) {
      console.error("Error fetching open trades:", error);
      setError("Failed to load open trades. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch both types of trades when component mounts
    Promise.all([fetchAllSellTrade(), fetchAllOpenTrade()])
      .catch(error => {
        console.error("Error fetching trades:", error);
        setError("Failed to load some trade data. Please try again later.");
      });
  }, []);

  // Determine which trades to display based on active tab
  const tradesToDisplay = activeTab === "completed"
    ? (Array.isArray(allSellTrade) ? allSellTrade : [])
    : (Array.isArray(allOpenTrade) ? allOpenTrade : []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <>
      <HNavbar />
      <div className="bg-[#f5f5f5] min-h-screen py-8 px-4 flex justify-center items-center flex-col">
        <h1 className="text-4xl p-4 mb-4 border-b-2 border-orange-700">
          My Portfolio
        </h1>

        {/* Tab Navigation */}
        <div className="flex gap-4 m-2 mb-6">
          <button
            onClick={() => handleTabChange("completed")}
            className={`text-2xl font-semibold px-4 py-2 rounded-lg transition-colors ${
              activeTab === "completed"
                ? "bg-orange-700 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            Your Orders
          </button>
          <button
            onClick={() => handleTabChange("pending")}
            className={`text-2xl font-semibold px-4 py-2 rounded-lg transition-colors ${
              activeTab === "pending"
                ? "bg-orange-700 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            Pending Orders
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-700"></div>
          </div>
        ) : error ? (
          <div className="text-red-500 text-center py-8">{error}</div>
        ) : tradesToDisplay.length > 0 ? (
          <div className="w-full max-w-4xl space-y-4">
            <div className="text-lg font-medium text-gray-700 mb-4">
              {activeTab === "completed" ? "Your Orders" : "Pending Orders"} ({tradesToDisplay.length})
            </div>

            {
              activeTab  === "completed" ?  tradesToDisplay.map((trade, index) => (
              <SellCard
                key={trade.id || index}
                price={trade.price || 0}
                quantity={trade.quantity || 0}
                tradeType={trade.prediction || trade.tradeType }
                gain={calculateGain(trade)}
                eventTitle={trade.tradeTitle || "Unknown Event"}
                eventId={trade.eventId}
                id={trade.id}
                // status={trade.status || (activeTab === "pending" ? "pending" : "completed")}
              />
            ))
            : tradesToDisplay.map((trade, index) => (
            <ExitCard
              key={trade.id || index}
              price={trade.price || 0}
              quantity={trade.quantity || 0}
              tradeType={trade.prediction || trade.tradeType}
              gain={calculateGain(trade)}
              eventTitle={trade.tradeTitle || "Unknown Event"}
              eventId={trade.eventId}
              id={trade.id} // This is the orderId that will be used for cancellation
            />
          ))
            }


          </div>
        ) : (
          <div className="text-center py-8 text-gray-600">
            <p className="text-xl mb-4">
              No {activeTab === "completed" ? "completed" : "pending"} trades found
            </p>
            <p>
              {activeTab === "completed"
                ? "You haven't completed any trades yet."
                : "You don't have any pending trades."}
            </p>
          </div>
        )}
      </div>

      <Footer bgColor="bg-[#f5f5f5]" textColor="text-black" />
    </>
  );
};

const calculateGain = (trade) => {
  // Implement your actual gain calculation logic here
  return Math.floor(Math.random() * 20) - 10;
};

export default Portfolio;