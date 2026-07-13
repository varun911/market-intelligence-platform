import { useState } from "react";
import axios from "axios";
import StockChart from "./components/StockChart";
import CompareStocks from "./components/CompareStocks";
import PortfolioAnalyzer from "./components/PortfolioAnalyzer";
import API_URL from "./api";

function App() {
  const [ticker, setTicker] = useState("AAPL");
  const [data, setData] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [compareTickers, setCompareTickers] = useState("AAPL,MSFT,NVDA");
  const [comparisonData, setComparisonData] = useState([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch both endpoints in parallel
      const [resAnalytics, resHistory, resComparison] = await Promise.all([
        // Analytics endpoint
        axios.get(`${API_URL}/analytics/${ticker}`),
        // Historical Price endpoint
        axios.get(`${API_URL}/history/${ticker}`),
        // Compare Stocks endpoint
        axios.get(`${API_URL}/compare?tickers=${compareTickers}`),
      ]);
      console.log("Analytics:", resAnalytics.data);
      console.log("History:", resHistory.data);
      console.log("History length:", resHistory.data.records?.length);
      console.log("Comparison Data:", resComparison.data);

      setData(resAnalytics.data);
      setHistory(resHistory.data.records || []);
      setComparisonData(resComparison.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLoading(false);
  };

  // First div with the ticker input and analyze button
  return (
    <div className="min-h-screen bg-[#22223b] p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-white">
          Market Intelligence Platform
        </h1>

        <div className="flex gap-3 mb-8">
          <input
            value={ticker}
            onChange={(e) => setTicker(e.target.value.toUpperCase())}
            placeholder="Enter ticker..."
            className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-[#f2e9e4] focus:ring-10 focus:ring-[#f2e9e4]/20"
          />
          <button
            onClick={fetchData}
            className="px-6 py-3 bg-[#c9ada7] hover:bg-[#f2e9e4] rounded-xl font-bold hover:scale-105 active:scale-95"
          >
            Analyze
          </button>
        </div>
        <div>
          {loading && (
            <div
              role="status"
              className="flex justify-center items-center py-8"
            >
              <svg
                aria-hidden="true"
                className="w-12 h-12 text-gray-600 animate-spin fill-purple-500"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
          )}
        </div>

        {/* First card with the analytics data that is pulled from the python backend, showcases the following:
        - Return
        - Volatility
        - 7 Day Moving Average
        - 30 Day Moving Average
        */}

        {data && (
          <div className="bg-[#4a4e69] backdrop-blur-sm border border-gray-700 rounded-2xl p-6 shadow-2xl">
            <h2 className="text-4xl font-bold mb-4 text-white text-center">
              {data.ticker}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-gray-700 rounded-xl px-4 py-3 flex justify-between items-center">
                <span className="text-white text-2xl">Return</span>
                <span
                  className={`font-bold text-2xl ${data.return_pct >= 0 ? "text-green-400" : "text-red-400"}`}
                >
                  {data.return_pct}%
                </span>
              </div>

              <div className="bg-gray-700 rounded-xl px-4 py-3 flex justify-between items-center">
                <span className="text-white text-2xl">Volatility</span>
                <span className="font-bold text-2xl text-blue-400">
                  {data.volatility_pct}%
                </span>
              </div>

              <div className="bg-gray-700 rounded-xl px-4 py-3 flex justify-between items-center">
                <span className="text-white text-2xl">7 Day MA</span>
                <span className="font-bold text-2xl text-yellow-400">
                  ${data.ma_7}
                </span>
              </div>

              <div className="bg-gray-700 rounded-xl px-4 py-3 flex justify-between items-center">
                <span className="text-white text-2xl">30 Day MA</span>
                <span className="font-bold text-2xl text-purple-400">
                  ${data.ma_30}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Creating a second card to showcase the historical price data/chart */}

      <div className="bg-[#4a4e69] backdrop-blur-sm border border-gray-700 rounded-2xl p-6 mt-6 shadow-2xl">
        <h2 className="text-4xl font-bold mb-4 text-white text-center">
          Historical Price Data
        </h2>
        {history.length > 0 && (
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 shadow-2xl">
            <StockChart history={history} />
          </div>
        )}
      </div>

      <div className="bg-[#4a4e69] backdrop-blur-sm border border-gray-700 rounded-2xl p-6 mt-6 shadow-2xl">
        <h2 className="text-4xl font-bold mb-4 text-white text-center">
          Compare Stocks
        </h2>
        <CompareStocks />
        <hr className="text-white" />
      </div>

      <div className="bg-[#4a4e69] backdrop-blur-sm border border-gray-700 rounded-2xl p-6 mt-6 shadow-2xl">
        <h2 className="text-4xl font-bold mb-4 text-white text-center">
          Portfolio Analyzer
        </h2>
        <PortfolioAnalyzer />
      </div>
    </div>
  );
}

export default App;
