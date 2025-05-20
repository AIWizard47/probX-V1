import { useState } from 'react';

export default function SellCard({ price , quantity , gain , tradeType , eventTitle  }) {
  return (
    <div className=" h-32 bg-white rounded-lg shadow-md p-4 border border-gray-200">
      <div className="flex flex-col h-full justify-between">
        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold text-gray-800">{eventTitle}</h3>
          </div>

          <div className="grid grid-cols-5 gap-30 ">
            <div>
              <p className="text-sm text-gray-500">Price</p>
              <p className="text-xl font-bold">{price.toFixed(2)}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Quantity</p>
              <p className="text-xl font-bold">{quantity}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Gain</p>
              <p className={`text-xl font-bold ${gain >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {gain >= 0 ? '+' : ''}{gain}%
              </p>
            </div>

            <div >
              <span className="text-sm text-gray-600">Trade Type:</span>
              <div
                className={`px-3 py-1 rounded-full w-11 text-sm font-medium ${
                  tradeType === "YES" ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}
              >
                {tradeType}
              </div>

              </div>
            <div className="flex items-center ">
              <button
                className="w-16 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 text-sm"
              >
                Exit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}