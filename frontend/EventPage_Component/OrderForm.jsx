import axios from "axios";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import  { ButtonLoader } from "../components/Loader";
import { useBalance } from "../src/provider/BalanceContext";


export default function OrderForm({ id }) {
  const eventid = id;
  const [event, setEvent] = useState({});
  const [loading, setLoading] = useState(false);
  const { fetchUserData } = useBalance();

  const fetchYesNoPrices = async ()=>{
     axios
      .get(`http://localhost:3000/api/user/event/${eventid}`)
      .then((res) => {
        const recivedEvent = res.data?.event || {};
        if (Object.keys(recivedEvent).length === 0) {
          setEvent({});
        } else {

          setEvent(recivedEvent);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  useEffect(()=>{
    fetchYesNoPrices()
  }, [])


  const yesPrice = event.yesPrice;
  const noPrice = event.noPrice;

  const [selectedOption, setSelectedOption] = useState("yes");
  const [quantity, setQuantity] = useState(1);

  const currentPrice = selectedOption === "yes" ? yesPrice : noPrice;
  const totalPut = (currentPrice * quantity).toFixed(2);
  const totalGet = (10 * quantity).toFixed(2);

  const handleOptionChange = (option) => {
    setSelectedOption(option);
  };
  let orderPrice = 5;
  if (selectedOption === "yes") {
    orderPrice = Math.max(event.yesPrice, 0.01);
  } else {
    orderPrice = Math.max(event.noPrice, 0.01);
  }

  const tradeType = selectedOption.toUpperCase();

 const handleTradeOrder = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");

    try {
        const res = await axios.post(
            "http://localhost:3000/api/user/trade",
            {
                price: orderPrice,
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

        if (res.data.message === "Trade success") {
            await fetchUserData(); // ✅ properly awaited
            toast.success("Trade successful.");
            await fetchYesNoPrices()
        }
    } catch (err) {
        toast.error("Trade failed");
        console.error(err);
    } finally {
        setLoading(false);
    }
};


  return (
    <div className="max-w-sm min-w-sm mx-auto border-gray-200 border-2 rounded-lg shadow-md p-4 bg-white">
      <div className="flex justify-between rounded-full bg-gray-100 p-1 mb-4">
        <button
          className={`flex-1 ${
            selectedOption === "yes"
              ? "bg-blue-600 text-white"
              : "text-gray-700"
          } rounded-full py-1 font-medium`}
          onClick={() => handleOptionChange("yes")}
        >
          Yes ₹{yesPrice}
        </button>
        <button
          className={`flex-1 ${
            selectedOption === "no" ? "bg-red-600 text-white" : "text-gray-700"
          } rounded-full py-1 font-medium`}
          onClick={() => handleOptionChange("no")}
        >
          No ₹{noPrice}
        </button>
      </div>

      <div className="mb-2 text-sm font-medium">Set price</div>

      <div className="border-gray-200 border-2 p-1 rounded-lg">
        <div className="border-[0.1 px] rounded-lg p-4 mb-2 bg-gray-50">
          <div className="mb-3 flex justify-between py-5 text-[20px] font-bold">
            <label className="block text-black mb-1">Price</label>
            <div className="flex items-center space-x-2">
              <span className="font-semibold">₹{currentPrice}</span>
            </div>
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

      <button
        className={`w-full text-white py-2 rounded-md font-semibold mt-5 hover:${
          selectedOption === "yes" ? "bg-blue-700" : "bg-red-700"
        } ${selectedOption === "yes" ? "bg-blue-600" : "bg-red-600"}`}
        onClick={handleTradeOrder}
        disabled={loading}
      >
        {loading ? <ButtonLoader /> : " Place order"}
      </button>
    </div>
  );
}
