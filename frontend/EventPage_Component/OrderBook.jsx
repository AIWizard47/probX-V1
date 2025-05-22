

// export default OrderBook;
import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';

// OrderBook Service for API calls
const API_BASE_URL = 'http://localhost:3000/api/user';

const OrderBookService = {
  async fetchOrderBookYES(eventId) {
    const response = await fetch(`${API_BASE_URL}/orderbook/yes/${eventId}`);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  async fetchOrderBookNO(eventId) {
    const response = await fetch(`${API_BASE_URL}/orderbook/no/${eventId}`);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  async fetchOrderBookSummary(eventId) {
    const response = await fetch(`${API_BASE_URL}/orderbook/${eventId}/summary`);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    return response.json();
  }
};

const OrderBook = ({ eventId = 'demo' }) => {
  const [activeTab, setActiveTab] = useState('Order Book');
  const [yesOrders, setYesOrders] = useState([]);
  const [noOrders, setNoOrders] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Fallback sample data
  const setSampleData = () => {
    const sampleYesOrders = [
      { price: 6.50, yesQty: 923, yesOrderCount: 5 },
      { price: 7.00, yesQty: 1650, yesOrderCount: 8 },
      { price: 7.50, yesQty: 253, yesOrderCount: 3 },
      { price: 8.00, yesQty: 2, yesOrderCount: 1 },
      { price: 9.00, yesQty: 1, yesOrderCount: 1 }
    ];

    const sampleNoOrders = [
      { price: 4.00, noQty: 12, noOrderCount: 2 },
      { price: 4.50, noQty: 1219, noOrderCount: 12 },
      { price: 5.00, noQty: 6223, noOrderCount: 25 },
      { price: 5.50, noQty: 251, noOrderCount: 4 },
      { price: 6.00, noQty: 3, noOrderCount: 1 }
    ];

    const sampleSummary = {
      yes: {
        totalQuantity: 2829,
        orderCount: 18,
        averagePrice: 7.2
      },
      no: {
        totalQuantity: 7708,
        orderCount: 44,
        averagePrice: 4.8
      }
    };

    setYesOrders(sampleYesOrders);
    setNoOrders(sampleNoOrders);
    setSummary(sampleSummary);
    setLastUpdated(new Date());
  };

  // Fetch order book data from Node.js API
  useEffect(() => {
    const fetchOrderBook = async () => {
      if (!eventId) {
        setError('Event ID is required');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch both order books and summary
        const [yesResult, noResult, summaryResult] = await Promise.all([
          OrderBookService.fetchOrderBookYES(eventId),
          OrderBookService.fetchOrderBookNO(eventId),
          OrderBookService.fetchOrderBookSummary(eventId).catch(() => null)
        ]);

        if (yesResult.success) {
          // Transform API data to component format
          const transformedYesOrders = yesResult.data.map(item => ({
            price: item.yesPrice || item.price,
            yesQty: item.yesQty || 0,
            yesOrderCount: item.yesOrderCount || 0
          }));
          setYesOrders(transformedYesOrders);
        } else {
          throw new Error(yesResult.message || 'Failed to fetch YES order book');
        }

        if (noResult.success) {
          // Transform API data to component format
          const transformedNoOrders = noResult.data.map(item => ({
            price: item.noPrice || item.price,
            noQty: item.noQty || 0,
            noOrderCount: item.noOrderCount || 0
          }));
          setNoOrders(transformedNoOrders);
        } else {
          throw new Error(noResult.message || 'Failed to fetch NO order book');
        }

        if (summaryResult?.success) {
          setSummary(summaryResult.data);
        }

        setLastUpdated(new Date());

      } catch (err) {
        console.error('Error fetching order book:', err);
        setError(err.message);
        // Fallback to sample data for development
        setSampleData();
      } finally {
        setLoading(false);
      }
    };

    fetchOrderBook();

    // Set up polling to refresh data every 5 seconds
    const interval = setInterval(fetchOrderBook, 5000);

    return () => clearInterval(interval);
  }, [eventId]);

  const maxYesQty = yesOrders.length > 0 ? Math.max(...yesOrders.map(item => item.yesQty || 0)) : 1;
  const maxNoQty = noOrders.length > 0 ? Math.max(...noOrders.map(item => item.noQty || 0)) : 1;

  const getYesBarWidth = (qty) => qty > 0 ? Math.min((qty / maxYesQty) * 100, 100) : 0;
  const getNoBarWidth = (qty) => qty > 0 ? Math.min((qty / maxNoQty) * 100, 100) : 0;

  const handleRefresh = async () => {
    if (!eventId) return;

    try {
      setLoading(true);
      setError(null);

      const [yesResult, noResult] = await Promise.all([
        OrderBookService.fetchOrderBookYES(eventId),
        OrderBookService.fetchOrderBookNO(eventId)
      ]);

      if (yesResult.success) {
        const transformedYesOrders = yesResult.data.map(item => ({
          price: item.yesPrice || item.price,
          yesQty: item.yesQty || 0,
          yesOrderCount: item.yesOrderCount || 0
        }));
        setYesOrders(transformedYesOrders);
      } else {
        throw new Error(yesResult.message || 'Failed to fetch YES order book');
      }

      if (noResult.success) {
        const transformedNoOrders = noResult.data.map(item => ({
          price: item.noPrice || item.price,
          noQty: item.noQty || 0,
          noOrderCount: item.noOrderCount || 0
        }));
        setNoOrders(transformedNoOrders);
      } else {
        throw new Error(noResult.message || 'Failed to fetch NO order book');
      }

      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error refreshing order book:', err);
      setError(err.message);
      // Fallback to sample data on error
      setSampleData();
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => price ? parseFloat(price).toFixed(2) : '-';
  const formatQuantity = (qty) => qty > 0 ? qty.toLocaleString() : '-';
  const formatTime = (date) => date ? date.toLocaleTimeString() : 'Never';

  // Combine YES and NO orders for display
  const combinedOrderData = [];
  const maxLength = Math.max(yesOrders.length, noOrders.length);
  for (let i = 0; i < maxLength; i++) {
    combinedOrderData.push({
      yesPrice: yesOrders[i]?.price,
      yesQty: yesOrders[i]?.yesQty,
      yesOrderCount: yesOrders[i]?.yesOrderCount,
      noPrice: noOrders[i]?.price,
      noQty: noOrders[i]?.noQty,
      noOrderCount: noOrders[i]?.noOrderCount
    });
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 mx-auto max-w-7xl shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4 border-b border-gray-200 gap-3">
        <h1 className="text-xl font-semibold text-gray-900">Market Order Book</h1>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">
            {lastUpdated ? `Updated: ${formatTime(lastUpdated)}` : 'Loading...'}
          </span>
          <button
            onClick={handleRefresh}
            disabled={loading}
            className={`flex items-center gap-2 px-3 py-1.5 text-sm text-white rounded-md transition-colors ${
              loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('Order Book')}
          className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'Order Book'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
          }`}
        >
          Order Book
        </button>
        <button
          onClick={() => setActiveTab('Summary')}
          className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'Summary'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
          }`}
        >
          Summary
        </button>
      </div>

      {/* Order Book Content */}
      {activeTab === 'Order Book' && (
        <div className="p-4 sm:p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">Error: {error}</p>
              <button
                onClick={handleRefresh}
                className="mt-2 text-xs text-red-800 underline hover:no-underline"
              >
                Try again
              </button>
            </div>
          )}

          {loading && yesOrders.length === 0 && noOrders.length === 0 ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
              <p className="mt-2 text-sm text-gray-500">Loading order book...</p>
            </div>
          ) : (
            <>
              {/* Column Headers - Mobile */}
              <div className="sm:hidden grid grid-cols-2 gap-4 mb-4 pb-2 border-b border-gray-100">
                <div className="text-left">
                  <div className="text-sm font-medium text-green-600 uppercase tracking-wide">YES</div>
                </div>
                <div className="text-left">
                  <div className="text-sm font-medium text-red-600 uppercase tracking-wide">NO</div>
                </div>
              </div>

              {/* Column Headers - Desktop */}
              <div className="hidden sm:grid grid-cols-6 gap-4 mb-4 pb-2 border-b border-gray-100">
                <div className="text-left text-sm font-medium text-gray-600 uppercase tracking-wide">
                  YES PRICE
                </div>
                <div className="text-right text-sm font-medium text-gray-600 uppercase tracking-wide">
                  QUANTITY
                </div>
                <div className="text-right text-sm font-medium text-gray-600 uppercase tracking-wide">
                  ORDERS
                </div>
                <div className="text-left text-sm font-medium text-gray-600 uppercase tracking-wide">
                  NO PRICE
                </div>
                <div className="text-right text-sm font-medium text-gray-600 uppercase tracking-wide">
                  QUANTITY
                </div>
                <div className="text-right text-sm font-medium text-gray-600 uppercase tracking-wide">
                  ORDERS
                </div>
              </div>

              {/* Order Rows */}
              {combinedOrderData.length > 0 ? (
                <div className="space-y-2">
                  {combinedOrderData.map((row, index) => (
                    <div key={index} className="grid grid-cols-2 sm:grid-cols-6 gap-2 sm:gap-4 py-2 hover:bg-gray-50 rounded">
                      {/* Mobile YES View */}
                      <div className="sm:hidden space-y-1">
                        <div className="flex justify-between">
                          <span className="text-xs text-gray-500">Price:</span>
                          <span className="text-green-700 font-medium">{formatPrice(row.yesPrice)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-xs text-gray-500">Qty:</span>
                          <div className="relative w-3/4">
                            <div
                              className="absolute left-0 top-0 h-full bg-green-100 rounded-sm"
                              style={{ width: `${getYesBarWidth(row.yesQty)}%` }}
                            ></div>
                            <div className="relative text-right text-gray-900 font-medium py-1 px-2">
                              {formatQuantity(row.yesQty)}
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-xs text-gray-500">Orders:</span>
                          <span className="text-gray-600">{row.yesOrderCount || '-'}</span>
                        </div>
                      </div>

                      {/* Desktop YES View */}
                      <div className="hidden sm:block text-green-700 font-medium">
                        {formatPrice(row.yesPrice)}
                      </div>
                      <div className="hidden sm:block relative">
                        <div
                          className="absolute left-0 top-0 h-full bg-green-100 rounded-sm"
                          style={{ width: `${getYesBarWidth(row.yesQty)}%` }}
                        ></div>
                        <div className="relative text-right text-gray-900 font-medium py-1 px-2">
                          {formatQuantity(row.yesQty)}
                        </div>
                      </div>
                      <div className="hidden sm:block text-right text-gray-600">
                        {row.yesOrderCount || '-'}
                      </div>

                      {/* Mobile NO View */}
                      <div className="sm:hidden space-y-1">
                        <div className="flex justify-between">
                          <span className="text-xs text-gray-500">Price:</span>
                          <span className="text-red-700 font-medium">{formatPrice(row.noPrice)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-xs text-gray-500">Qty:</span>
                          <div className="relative w-3/4">
                            <div
                              className="absolute left-0 top-0 h-full bg-red-100 rounded-sm"
                              style={{ width: `${getNoBarWidth(row.noQty)}%` }}
                            ></div>
                            <div className="relative text-right text-gray-900 font-medium py-1 px-2">
                              {formatQuantity(row.noQty)}
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-xs text-gray-500">Orders:</span>
                          <span className="text-gray-600">{row.noOrderCount || '-'}</span>
                        </div>
                      </div>

                      {/* Desktop NO View */}
                      <div className="hidden sm:block text-red-700 font-medium">
                        {formatPrice(row.noPrice)}
                      </div>
                      <div className="hidden sm:block relative">
                        <div
                          className="absolute left-0 top-0 h-full bg-red-100 rounded-sm"
                          style={{ width: `${getNoBarWidth(row.noQty)}%` }}
                        ></div>
                        <div className="relative text-right text-gray-900 font-medium py-1 px-2">
                          {formatQuantity(row.noQty)}
                        </div>
                      </div>
                      <div className="hidden sm:block text-right text-gray-600">
                        {row.noOrderCount || '-'}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No orders available</p>
                  <p className="text-sm mt-1">Orders will appear here as they are placed</p>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Summary Content */}
      {activeTab === 'Summary' && (
        <div className="p-4 sm:p-6">
          {summary ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h3 className="text-lg font-semibold text-green-800 mb-3">YES Orders</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-green-700">Total Quantity:</span>
                    <span className="font-medium text-gray-900">{summary.yes.totalQuantity.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-green-700">Order Count:</span>
                    <span className="font-medium text-gray-900">{summary.yes.orderCount}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-green-700">Average Price:</span>
                    <span className="font-medium text-gray-900">{formatPrice(summary.yes.averagePrice)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <h3 className="text-lg font-semibold text-red-800 mb-3">NO Orders</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-red-700">Total Quantity:</span>
                    <span className="font-medium text-gray-900">{summary.no.totalQuantity.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-red-700">Order Count:</span>
                    <span className="font-medium text-gray-900">{summary.no.orderCount}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-red-700">Average Price:</span>
                    <span className="font-medium text-gray-900">{formatPrice(summary.no.averagePrice)}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
              <p className="mt-2 text-sm text-gray-500">Loading summary...</p>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              <p>Summary data not available</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OrderBook;