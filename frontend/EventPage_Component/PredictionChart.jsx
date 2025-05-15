// import { useState } from "react";
// import {
//   AreaChart,
//   Area,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   BarChart,
//   Bar,
//   ReferenceLine,
// } from "recharts";

// // Sample data for the line chart
// const generateLineData = (baseline = 55, spike = 75) => {
//   const data = [];
//   for (let i = 0; i < 60; i++) {
//     let value = baseline + Math.random() * 2 - 1;

//     // Create a spike around position 45
//     if (i >= 43 && i <= 47) {
//       const distance = Math.abs(i - 45);
//       value = spike - distance * 5;
//     }

//     data.push({
//       time: `${Math.floor(i / 6) + 21}:${(i % 6) * 10}`,
//       value: Math.round(value),
//     });
//   }
//   return data;
// };

// // Sample data for the bar chart
// const generateBarData = () => {
//   const data = [];
//   for (let i = 0; i < 20; i++) {
//     const value = Math.random() * 20 + (i === 0 ? 30 : 5);
//     data.push({
//       hour: i,
//       value: Math.round(value),
//       color: Math.random() > 0.5 ? "#dbeafe" : "#fee2e2",
//     });
//   }
//   return data;
// };

// export default function PredictionChart() {
//   const [timeRange, setTimeRange] = useState("1h");
//   const [lineData] = useState(generateLineData());
//   const [barData] = useState(generateBarData());

//   const timeRanges = [
//     { id: "1h", label: "1 h" },
//     { id: "6h", label: "6 h" },
//     { id: "12h", label: "12 h" },
//     { id: "1d", label: "1 d" },
//     { id: "all", label: "All" },
//   ];

//   const CustomTooltip = ({ active, payload }) => {
//     if (active && payload && payload.length) {
//       return (
//         <div className="bg-white p-2 border border-gray-200 rounded-md shadow-sm">
//           <p className="text-gray-900 font-medium">{`${payload[0].value}%`}</p>
//         </div>
//       );
//     }
//     return null;
//   };

//   return (
//     <div className="bg-white rounded-lg shadow-md p-4 w-full max-w-4xl">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-4">
//         <div className="flex items-center">
//           <div className="bg-blue-100 p-2 rounded-lg mr-3">
//             <svg
//               className="w-5 h-5 text-blue-500"
//               xmlns="http://www.w3.org/2000/svg"
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="2"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//             >
//               <polyline points="9 18 15 12 9 6"></polyline>
//             </svg>
//           </div>
//           <div>
//             <div className="font-bold text-gray-800">YES</div>
//             <div className="text-xl font-bold text-blue-500">
//               55% Probability
//             </div>
//           </div>
//         </div>
//         <div>
//           <button className="text-gray-500 hover:text-gray-700">
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="h-6 w-6"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
//               />
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
//               />
//             </svg>
//           </button>
//         </div>
//       </div>

//       {/* Time Range Selector */}
//       <div className="flex mb-8 border-b border-gray-200">
//         {timeRanges.map((range) => (
//           <button
//             key={range.id}
//             className={`px-4 py-2 ${
//               timeRange === range.id
//                 ? "text-blue-500 border-b-2 border-blue-500 font-medium"
//                 : "text-gray-500"
//             }`}
//             onClick={() => setTimeRange(range.id)}
//           >
//             {range.label}
//           </button>
//         ))}
//         <div className="flex-grow"></div>
//         <div className="text-gray-400 py-2 flex items-center">
//           <span className="mr-1">•</span>probo.
//         </div>
//       </div>

//       {/* Line Chart */}
//       <div className="h-64 mb-6">
//         <ResponsiveContainer width="100%" height="100%">
//           <AreaChart
//             data={lineData}
//             margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
//           >
//             <defs>
//               <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
//                 <stop offset="5%" stopColor="#dbeafe" stopOpacity={0.8} />
//                 <stop offset="95%" stopColor="#dbeafe" stopOpacity={0.2} />
//               </linearGradient>
//             </defs>
//             <XAxis
//               dataKey="time"
//               tick={{ fontSize: 12, fill: "#9ca3af" }}
//               axisLine={false}
//               tickLine={false}
//               interval={7}
//             />
//             <YAxis
//               domain={[0, 100]}
//               ticks={[0, 25, 50, 75, 100]}
//               tick={{ fontSize: 12, fill: "#9ca3af" }}
//               axisLine={false}
//               tickLine={false}
//               orientation="right"
//             />
//             <Tooltip content={<CustomTooltip />} />
//             <Area
//               type="monotone"
//               dataKey="value"
//               stroke="#3b82f6"
//               strokeWidth={2}
//               fillOpacity={1}
//               fill="url(#colorValue)"
//               dot={false}
//               activeDot={{ r: 6, fill: "#3b82f6", strokeWidth: 0 }}
//             />
//             <ReferenceLine y={50} stroke="#e5e7eb" strokeDasharray="3 3" />
//           </AreaChart>
//         </ResponsiveContainer>
//       </div>

//       {/* Bar Chart */}
//       <div className="h-32">
//         <ResponsiveContainer width="100%" height="100%">
//           <BarChart
//             data={barData}
//             margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
//           >
//             <Bar
//               dataKey="value"
//               fill="#dbeafe"
//               radius={[4, 4, 0, 0]}
//               fillOpacity={0.8}
//             />
//           </BarChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// }

import React from "react";

const PredictionChart = () => {
  return <div></div>;
};

export default PredictionChart;
