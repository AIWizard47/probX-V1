import React, { useState, useEffect } from 'react';
import { Settings, RotateCcw, RefreshCw } from 'lucide-react';

const SingleEventChart = ({ eventId  }) => {
  const [activeTab, setActiveTab] = useState('All');
  const [eventData, setEventData] = useState(null);
  const [filteredChartData, setFilteredChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const tabs = ['1 h', '3 h', '6 h', '12 h', 'All'];

  // Fetch event data from API
  useEffect(() => {
    const fetchEventData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:3000/api/user/orderbook/probability/${eventId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();

        if (result.success && result.data) {
          // Transform the chart data to match expected format
          const transformedChartData = result.data.chartData.map(item => ({
            timestamp: item.timestamp,
            y: item.y,
            yesPrice: item.yesPrice,
            noPrice: item.noPrice
          }));

          setEventData({
            ...result.data,
            chartData: transformedChartData
          });
          setFilteredChartData(transformedChartData);
        } else {
          throw new Error('Invalid data format from API');
        }
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
        console.error("Error fetching event data:", err);
      }
    };

    fetchEventData();
  }, [eventId]);

  // Filter chart data based on selected time period
  const filterDataByPeriod = (period, data) => {
    if (period === 'All' || !data || data.length === 0) {
      return data || [];
    }

    const now = new Date();
    const periodHours = {
      '1 h': 1,
      '3 h': 3,
      '6 h': 6,
      '12 h': 12
    };

    const hoursBack = periodHours[period] || 24;
    const cutoffTime = new Date(now.getTime() - (hoursBack * 60 * 60 * 1000));

    return data.filter(point =>
      new Date(point.timestamp) >= cutoffTime
    );
  };

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    const filtered = filterDataByPeriod(tab, eventData?.chartData || []);
    setFilteredChartData(filtered);
  };

  // Simulate refresh
  const handleRefresh = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3000/api/user/orderbook/probability/${eventId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();

      if (result.success && result.data) {
        const transformedChartData = result.data.chartData.map(item => ({
          timestamp: item.timestamp,
          y: item.y,
          yesPrice: item.yesPrice,
          noPrice: item.noPrice
        }));

        setEventData({
          ...result.data,
          chartData: transformedChartData
        });
        setFilteredChartData(filterDataByPeriod(activeTab, transformedChartData));
      }
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
      console.error("Error refreshing event data:", err);
    }
  };

  // Rest of your component functions (generateTimeLabels, generatePath, generateAreaPath) remain the same
  // Generate time labels for x-axis
  const generateTimeLabels = () => {
    if (!filteredChartData || filteredChartData.length === 0) return [];

    const maxLabels = 8;
    const step = Math.max(1, Math.floor(filteredChartData.length / maxLabels));

    return filteredChartData
      .filter((_, index) => index % step === 0 || index === filteredChartData.length - 1)
      .map(point => {
        const date = new Date(point.timestamp);
        const time = date.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        });
        const dateStr = date.toLocaleDateString('en-US', {
          day: 'numeric',
          month: 'short'
        });
        return `${time}\n${dateStr}`;
      });
  };

  // Generate SVG path for the line chart
  const generatePath = () => {
    if (!filteredChartData || filteredChartData.length === 0) return '';

    const width = 400;
    const height = 120;
    const maxY = 100;
    const minY = 0;

    const pathData = filteredChartData.map((point, index) => {
      const x = (index / Math.max(filteredChartData.length - 1, 1)) * width;
      const y = height - ((point.y - minY) / (maxY - minY)) * height;
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');

    return pathData;
  };

  // Generate area path for filled area under curve
  const generateAreaPath = () => {
    if (!filteredChartData || filteredChartData.length === 0) return '';

    const width = 400;
    const height = 120;
    const maxY = 100;
    const minY = 0;

    const linePoints = filteredChartData.map((point, index) => {
      const x = (index / Math.max(filteredChartData.length - 1, 1)) * width;
      const y = height - ((point.y - minY) / (maxY - minY)) * height;
      return `${x} ${y}`;
    }).join(' L ');

    return `M 0 ${height} L ${linePoints} L ${width} ${height} Z`;
  };

  const timeLabels = generateTimeLabels();

  if (loading && !eventData) {
    return (
      <div className="w-full max-w-4xl mx-auto bg-white rounded-lg border border-gray-200 p-6 flex items-center justify-center">
        <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Loading event data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-4xl mx-auto bg-white rounded-lg border border-gray-200 p-6 text-red-500">
        Error loading event data: {error}
      </div>
    );
  }

  if (!eventData) {
    return (
      <div className="w-full max-w-4xl mx-auto bg-white rounded-lg border border-gray-200 p-6 text-gray-500">
        No event data available
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto bg-white mt-8 rounded-lg border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-full ${eventData.status === 'YES' ? 'bg-blue-100' : 'bg-red-100'}`}>
            <RotateCcw className={`w-4 h-4 ${eventData.status === 'YES' ? 'text-blue-600' : 'text-red-600'}`} />
          </div>
          <div>
            <div className="text-sm font-medium text-gray-600">{eventData.status}</div>
            <div className={`text-2xl font-bold ${eventData.status === 'YES' ? 'text-blue-600' : 'text-red-600'}`}>
              {eventData.currentProbability}% Probability
            </div>
            <div className="text-sm text-gray-500">
              Yes: ₹{eventData.yesPrice?.toFixed(2)} | No: ₹{eventData.noPrice?.toFixed(2)}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <RefreshCw className={`w-4 h-4 text-gray-400 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <div className="text-right">
            <div className="text-xs text-gray-400">probo.</div>
          </div>
          <Settings className="w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-600" />
        </div>
      </div>

      {/* Event Info */}
      <div className="mb-4 p-3 bg-gray-50 rounded">
        <h3 className="font-medium text-gray-900">{eventData.eventTitle}</h3>
        <div className="text-sm text-gray-600 mt-1">
          Liquidity: Yes ₹{eventData.yesLiquidity?.toLocaleString()} | No ₹{eventData.noLiquidity?.toLocaleString()}
        </div>
      </div>

      {/* Time period tabs */}
      <div className="flex gap-8 mb-6 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabChange(tab)}
            disabled={loading}
            className={`pb-2 px-1 text-sm font-medium transition-colors ${
              activeTab === tab
                ? 'text-gray-900 border-b-2 border-gray-900'
                : 'text-gray-500 hover:text-gray-700'
            } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Loading indicator */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Loading...</span>
        </div>
      )}

      {/* Chart container */}
      {!loading && filteredChartData && filteredChartData.length > 0 && (
        <div className="relative">
          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 h-32 flex flex-col justify-between text-xs text-gray-400 -ml-8">
            <span>100%</span>
            <span>75%</span>
            <span>50%</span>
            <span>25%</span>
            <span>0%</span>
          </div>

          {/* Main chart area */}
          <div className="ml-4">
            <svg width="100%" height="120" viewBox="0 0 400 120" className="overflow-visible">
              {/* Grid lines */}
              <defs>
                <pattern id="grid" width="40" height="30" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 30" fill="none" stroke="#f3f4f6" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />

              {/* Area under curve */}
              <path
                d={generateAreaPath()}
                fill="rgba(59, 130, 246, 0.1)"
              />

              {/* Main line */}
              <path
                d={generatePath()}
                fill="none"
                stroke="#3b82f6"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Data points */}
              {filteredChartData.map((point, index) => {
                const x = (index / Math.max(filteredChartData.length - 1, 1)) * 400;
                const y = 120 - ((point.y / 100) * 120);
                return (
                  <circle
                    key={index}
                    cx={x}
                    cy={y}
                    r="3"
                    fill="#3b82f6"
                    className="hover:r-4 transition-all cursor-pointer"
                  >
                    <title>{`${point.y}% at ${new Date(point.timestamp).toLocaleString()}`}</title>
                  </circle>
                );
              })}
            </svg>

            {/* X-axis time labels */}
            <div className="flex justify-between mt-4 text-xs text-gray-400 px-2">
              {timeLabels.map((label, index) => (
                <div key={index} className="text-center leading-tight whitespace-pre-line">
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* No data message */}
      {!loading && (!filteredChartData || filteredChartData.length === 0) && (
        <div className="text-center py-8 text-gray-500">
          No data available for the selected time period
        </div>
      )}

      {/* Probability bars at bottom */}
      {!loading && eventData.probabilityBars && eventData.probabilityBars.length > 0 && (
        <div className="mt-6">
          <div className="text-sm font-medium text-gray-700 mb-2">Trading Activity</div>
          <div className="flex items-end gap-1 h-12 px-4">
            {eventData.probabilityBars.map((bar, index) => (
              <div
                key={index}
                className={`flex-1 rounded-sm transition-all hover:opacity-80 ${
                  bar.type === 'yes' ? 'bg-blue-300' : 'bg-red-300'
                }`}
                style={{ height: `${bar.height}px` }}
                title={`${bar.type.toUpperCase()} trade`}
              />
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-1 px-4">
            <span>Yes Trades</span>
            <span>No Trades</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SingleEventChart;