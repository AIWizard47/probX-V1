import { useEffect, useState } from "react";
import HNavbar from "../HomePage_Component/HNavbar";
import SellCard from "./SellCard";
import axios from "axios";

const Portfolio = () => {
  // Initialize with empty array to prevent undefined errors
  const [allSellTrade, setAllSellTrade] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

      // Check for tardes (not trades) in the response
      if (response.data && Array.isArray(response.data.predictions)) {
        setAllSellTrade(response.data.predictions);
      } else {
        console.warn(
          "API response doesn't contain tardes array:",
          response.data
        );
        setAllSellTrade([]); // Set to empty array if data is missing or malformed
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching trades:", error);
      setError("Failed to load trades. Please try again later.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllSellTrade();
  }, []);

  // Create a safe array to check against, ensuring it's always an array
  const tradesToDisplay = Array.isArray(allSellTrade) ? allSellTrade : [];

  return (
    <>
      <HNavbar />
      <div className="bg-[#f5f5f5] min-h-screen py-8 px-4 flex justify-center items-center flex-col">
        <h1 className="text-4xl p-4 mb-6 border-b-2 border-orange-700">
          My Portfolio
        </h1>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-700"></div>
          </div>
        ) : error ? (
          <div className="text-red-500 text-center py-8">{error}</div>
        ) : tradesToDisplay.length > 0 ? (
          <div className="w-full max-w-4xl space-y-4">
            {tradesToDisplay.map((trade, index) => (
              <SellCard
                key={trade.id || index}
                price={trade.price || 0}
                quantity={trade.quantity || 0}
                tradeType={trade.prediction || "NO"}
                gain={calculateGain(trade)} // Calculate gain since it's not in the API response
                eventTitle={trade.tradeTitle || "Unknown Event"}
                eventId={trade.eventId}
                id={trade.id}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-600">
            <p className="text-xl mb-4">No trades found</p>
            <p>You haven't made any trades yet.</p>
          </div>
        )}
      </div>
    </>
  );
};

// Helper function to calculate gain (example - replace with your actual calculation)
const calculateGain = (trade) => {
  // This is a placeholder - implement your actual gain calculation logic
  // For example, you might calculate based on initial price vs current price
  return Math.floor(Math.random() * 20) - 10; // Just for demo - returns random number between -10 and 10
};

export default Portfolio;
