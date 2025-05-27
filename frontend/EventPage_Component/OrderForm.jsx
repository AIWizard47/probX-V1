import axios from "axios";
import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { ButtonLoader } from "../components/Loader";
import { useBalance } from "../src/provider/BalanceContext";

export default function OrderForm({ id }) {
  const [availableQuantity, setAvailableQuantity] = useState(0);
  const eventid = id;
  const [event, setEvent] = useState({});
  const [loading, setLoading] = useState(false);
  const { fetchUserData } = useBalance();

  const [customPrice, setCustomPrice] = useState(0);
  const [selectedOption, setSelectedOption] = useState("yes");
  const [quantity, setQuantity] = useState(1);

  const fetchYesNoPrices = useCallback(async () => {
    try {
      const res = await axios.get(`http://localhost:3000/api/user/event/${eventid}`);
      const receivedEvent = res.data?.event || {};
      setEvent(receivedEvent);
      const initialPrice = selectedOption === "yes" ? receivedEvent.yesPrice : receivedEvent.noPrice;
      setCustomPrice(initialPrice || 0.5); // Default to minimum price if not available
    } catch (err) {
      console.error("Error fetching prices:", err);
      setEvent({});
    }
  }, [eventid, selectedOption]);

  useEffect(() => {
    fetchYesNoPrices();
  }, [fetchYesNoPrices]);

  useEffect(() => {
    if (event.yesPrice && event.noPrice) {
      const newPrice = selectedOption === "yes" ? event.yesPrice : event.noPrice;
      setCustomPrice(newPrice);
    }
  }, [selectedOption, event.yesPrice, event.noPrice]);

  const yesPrice = event.yesPrice || 0;
  const noPrice = event.noPrice || 0;

  const totalPut = (customPrice * quantity).toFixed(2);
  const totalGet = (10 * quantity).toFixed(2);

  const handleOptionChange = (option) => {
    setSelectedOption(option);
  };

  const handlePriceChange = (e) => {
    const value = parseFloat(e.target.value);
    if (isNaN(value)) return;

    const clampedValue = Math.min(Math.max(value, 0.5), 9.99);
    setCustomPrice(clampedValue);
  };

  const adjustPrice = (increment) => {
    setCustomPrice(prev => {
      const newPrice = prev + increment;
      return parseFloat(Math.min(Math.max(newPrice, 0.5), 9.99).toFixed(2));
    });
  };

  const resetToMarketPrice = () => {
    const marketPrice = selectedOption === "yes" ? yesPrice : noPrice;
    setCustomPrice(marketPrice);
  };

  const tradeType = selectedOption.toUpperCase();

  const fetchAvailableQuantity = useCallback(async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/user/orderbook/${eventid}/quantitysell`,
        {
          params: {
            price: customPrice,
            tradeType: tradeType
          }
        }
      );
      if (response.data.success) {
        setAvailableQuantity(response.data.quantity);
      }
    } catch (error) {
      console.error("Error fetching available quantity:", error);
      setAvailableQuantity(0);
    }
  }, [eventid, customPrice, tradeType]);

  useEffect(() => {
    fetchAvailableQuantity();
  }, [fetchAvailableQuantity]);

  const handleTradeOrder = async () => {
    if (customPrice < 0.5 || customPrice > 9.99) {
      toast.error("Price must be between ₹0.5 and ₹9.99");
      return;
    }

    setLoading(true);
    const token = localStorage.getItem("token");

    try {
      const res = await axios.post(
        "http://localhost:3000/api/user/trade",
        {
          price: customPrice,
          quantity: quantity,
          orderType: "BUY",
          tradeType: tradeType,
          eventId: parseInt(eventid),
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
        await fetchYesNoPrices();
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Trade failed";
      toast.error(errorMsg);
      console.error("Trade error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleMinus = () => {
    adjustPrice(-0.5);
  };

  const handlePlus = () => {
    adjustPrice(0.5);
  };

  return (
    <div className="max-w-sm min-w-sm mx-auto border-gray-200 border-2 rounded-lg shadow-md p-4 bg-white">
      <div className="flex justify-between rounded-full bg-gray-100 p-1 mb-4">
        <button
          className={`flex-1 ${
            selectedOption === "yes" ? "bg-blue-600 text-white" : "text-gray-700"
          } rounded-full py-1 font-medium`}
          onClick={() => handleOptionChange("yes")}
        >
          Yes ₹{yesPrice.toFixed(2)}
        </button>
        <button
          className={`flex-1 ${
            selectedOption === "no" ? "bg-red-600 text-white" : "text-gray-700"
          } rounded-full py-1 font-medium`}
          onClick={() => handleOptionChange("no")}
        >
          No ₹{noPrice.toFixed(2)}
        </button>
      </div>

      <div className="mb-2 text-sm font-medium">Set price</div>

      <div className="border-gray-200 border-2 p-1 rounded-lg">
        <div className="border-[0.1 px] rounded-lg p-4 mb-2 bg-gray-50">
          <div className="mb-3 flex justify-between items-center py-3 text-[18px] font-bold">
            <div className="block text-[15px]">
              Available Quantity
              <div className="text-[10px]">{availableQuantity}</div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleMinus}
                className="px-2 py-1 bg-gray-200 rounded text-sm"
                disabled={customPrice <= 0.5}
              >
                −
              </button>
              <div className="flex items-center">
                <span className="mr-1">₹</span>
                <input
                  type="number"
                  value={customPrice.toFixed(2)}
                  onChange={handlePriceChange}
                  min="0.5"
                  max="9.99"
                  step="0.01"
                  className="w-16 text-center border border-gray-300 rounded px-1 py-1 text-sm"
                />
              </div>
              <button
                onClick={handlePlus}
                className="px-2 py-1 bg-gray-200 rounded text-sm"
                disabled={customPrice >= 9.99}
              >
                +
              </button>
            </div>
          </div>

          <div className="mb-3 flex justify-between items-center text-sm text-gray-600">
            <span>
              Market Price: ₹
              {selectedOption === "yes" ? yesPrice.toFixed(2) : noPrice.toFixed(2)}
            </span>
            <button
              onClick={resetToMarketPrice}
              className="text-blue-600 hover:text-blue-800 underline text-xs"
            >
              Reset to market
            </button>
          </div>

          <div className="mb-3 flex justify-between pb-5 text-[20px] font-bold">
            <label className="block text-black mb-1">Quantity ⚙️</label>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                className="px-2 py-1 bg-gray-200 rounded"
              >
                −
              </button>
              <span className="font-semibold">{quantity}</span>
              <button
                onClick={() => setQuantity((prev) => prev + 1)}
                className="px-2 py-1 bg-gray-200 rounded"
              >
                +
              </button>
            </div>
          </div>

          <div className="flex justify-between text-sm font-medium pt-2 mt-2">
            <div>
              ₹{totalPut}{" "}
              <span className="block text-black pt-2 text-[15px]">You put</span>
            </div>
            <div className="text-green-600">
              ₹{totalGet}{" "}
              <span className="block text-black pt-2 text-[15px]">You get</span>
            </div>
          </div>
        </div>
      </div>

      {Math.abs(customPrice - (selectedOption === "yes" ? yesPrice : noPrice)) > 0.5 && (
        <div className="mb-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
          ⚠️ Your price differs significantly from market price
        </div>
      )}

      <button
        className={`w-full text-white py-2 rounded-md font-semibold mt-5 hover:${
          selectedOption === "yes" ? "bg-blue-700" : "bg-red-700"
        } ${selectedOption === "yes" ? "bg-blue-600" : "bg-red-600"}`}
        onClick={handleTradeOrder}
        disabled={loading || customPrice < 0.5 || customPrice > 9.99}
      >
        {loading ? <ButtonLoader /> : `Place order at ₹${customPrice.toFixed(2)}`}
      </button>
    </div>
  );
}