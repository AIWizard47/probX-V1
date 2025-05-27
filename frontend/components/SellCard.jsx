import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useBalance } from "../src/provider/BalanceContext";

// Modal Component
const SellModal = ({ isOpen, onClose, event, tradeType, quantity, eventId, onSell, token }) => {
  const [sellPrice, setSellPrice] = useState(0);
  const [availableQuantity, setAvailableQuantity] = useState(0);
  const [loading, setLoading] = useState(false);
  const [fetchingQuantity, setFetchingQuantity] = useState(false);

  // Initialize sell price when modal opens
  useEffect(() => {
    if (isOpen && event) {
      const currentPrice = tradeType === "YES" ? event.yesPrice : event.noPrice;
      setSellPrice(currentPrice || 0);
    }
  }, [isOpen, event, tradeType]);

  // Fetch available quantity when price changes
  useEffect(() => {
    if (sellPrice > 0 && isOpen) {
      fetchAvailableQuantity();
    }
  }, [sellPrice, isOpen]);

  const fetchAvailableQuantity = async () => {
    setFetchingQuantity(true);
    try {
      const response = await axios.get(
        `http://localhost:3000/api/user/orderbook/${eventId}/quantitybuy`,
        {
          params: {
            price: sellPrice,
            tradeType: tradeType
          }
        }
      );
      setAvailableQuantity(response.data.quantity || 0);
    } catch (err) {
      console.error("Error fetching available quantity:", err);
      setAvailableQuantity(0);
    } finally {
      setFetchingQuantity(false);
    }
  };

  const handlePriceChange = (increment) => {
    setSellPrice(prev => Math.min(Math.max(0.5, prev + increment)) , 9.5);
  };

  const handleSell = async () => {
    if (sellPrice <= 0) {
      toast.error("Please set a valid sell price");
      return;
    }

    setLoading(true);
    try {
      await onSell(sellPrice, quantity);
      onClose();
    } catch (err) {
      console.error("Sell failed:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-xs bg-opacity-50 flex items-center justify-center z-1000">
      <div className="bg-white rounded-lg p-6 w-96 max-w-md mx-4">
        <h2 className="text-xl font-bold mb-4">Sell Position</h2>

        {/* Current Market Prices */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Current Market Prices</h3>
          <div className="flex gap-4">
            <div className="flex-1 p-3 bg-green-50 rounded border">
              <p className="text-xs text-gray-600">YES Price</p>
              <p className="text-lg font-bold text-green-600">₹{event?.yesPrice?.toFixed(2) || '0.00'}</p>
            </div>
            <div className="flex-1 p-3 bg-red-50 rounded border">
              <p className="text-xs text-gray-600">NO Price</p>
              <p className="text-lg font-bold text-red-600">₹{event?.noPrice?.toFixed(2) || '0.00'}</p>
            </div>
          </div>
        </div>

        {/* Sell Price Setting */}
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Set Your Sell Price ({tradeType})</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePriceChange(-0.5)}
              className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded flex items-center justify-center text-lg font-bold"
              disabled={loading}
            >
              -
            </button>
            <div className="flex-1 text-center">
              <input
                type="number"
                value={sellPrice.toFixed(2)}
                onChange={(e) => setSellPrice(parseFloat(e.target.value) || 9.5)}
                className="w-full text-center border rounded px-2 py-1 text-lg font-bold"
                step="0.1"
                min="0"
                disabled={loading}
              />
            </div>
            <button
              onClick={() => handlePriceChange(0.5)}
              className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded flex items-center justify-center text-lg font-bold"
              disabled={loading}
            >
              +
            </button>
          </div>
        </div>

        {/* Available Quantity */}
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Available Quantity at ₹{sellPrice.toFixed(2)}:</span>
            <span className="font-bold text-lg">
              {fetchingQuantity ? "..." : availableQuantity}
            </span>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Your quantity: {quantity}
          </div>
        </div>

        {/* Total Value */}
        <div className="mb-6 p-3 bg-gray-50 rounded">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Total Value:</span>
            <span className="font-bold">₹{(sellPrice * quantity).toFixed(2)}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleSell}
            className="flex-1 py-2 px-4 bg-red-600 text-white rounded hover:bg-red-700 transition-colors disabled:opacity-50"
            disabled={loading || sellPrice <= 0}
          >
            {loading ? "Selling..." : "Confirm Sell"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default function SellCard({
  price,
  quantity,
  gain,
  tradeType,
  eventTitle,
  eventId,
  id,
}) {
  const [event, setEvent] = useState({});
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const token = localStorage.getItem("token");
  const { fetchUserData } = useBalance();

  const fetchCurrentPrice = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3000/api/user/event/${eventId}`
      );
      const receivedEvent = res.data?.event || {};
      setEvent(receivedEvent);
    } catch (err) {
      console.error("Error fetching event price:", err);
    }
  };

  useEffect(() => {
    fetchCurrentPrice();
  }, []);

  async function deletePrediction(predictionId) {
    try {
      const response = await axios.delete(
        `http://localhost:3000/api/user/pridiction/${predictionId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Prediction deleted successfully", response.data);
    } catch (err) {
      console.error("Error while deleting prediction:", err);
    }
  }

  const handleSellFromModal = async (sellPrice, sellQuantity) => {
    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:3000/api/user/trade",
        {
          price: sellPrice,
          quantity: sellQuantity,
          orderType: "SELL",
          tradeType: tradeType,
          eventId: parseInt(eventId),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.message === "Order processed successfully") {
        await fetchUserData();
        toast.success("Trade successful.");
        await deletePrediction(parseInt(id));
        await fetchCurrentPrice();
      }
    } catch (err) {
      toast.error("Trade failed");
      console.error(err);
      throw err; // Re-throw to handle in modal
    } finally {
      setLoading(false);
    }
  };

  const handleExitClick = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="h-32 bg-white rounded-lg shadow-md p-4 border border-gray-200">
        <div className="flex flex-col h-full justify-between">
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold text-gray-800">
                {eventTitle}
              </h3>
            </div>

            <div className="grid grid-cols-5 gap-4">
              <div>
                <p className="text-sm text-gray-500">Price</p>
                <p className="text-xl font-bold">₹{price.toFixed(2)}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Quantity</p>
                <p className="text-xl font-bold">{quantity}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Gain</p>
                <p
                  className={`text-xl font-bold ${
                    gain >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {gain >= 0 ? "+" : ""}
                  {gain}%
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Trade Type:</p>
                <div
                  className={`px-3 py-1 rounded-full w-11 text-sm font-medium ${
                    tradeType === "YES"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {tradeType}
                </div>
              </div>

              <div className="flex items-center">
                <button
                  className="w-16 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 text-sm disabled:opacity-50"
                  onClick={handleExitClick}
                  disabled={loading}
                >
                  {loading ? "..." : "Exit"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <SellModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        event={event}
        tradeType={tradeType}
        quantity={quantity}
        eventId={eventId}
        onSell={handleSellFromModal}
        token={token}
      />
    </>
  );
}