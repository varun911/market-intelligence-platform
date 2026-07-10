import { useState } from "react";
import axios from "axios";
import StockChart from "./components/StockChart";
import CompareStocks from "./components/CompareStocks";
import PortfolioAnalyzer from "./components/PortfolioAnalyzer";

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
        axios.get(`http://127.0.0.1:8000/analytics/${ticker}`),
        // Historical Price endpoint
        axios.get(`http://127.0.0.1:8000/history/${ticker}`),
        // Compare Stocks endpoint
        axios.get(`http://127.0.0.1:8000/compare?tickers=${compareTickers}`),
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
