import { useState } from "react";
import axios from "axios";
import API_URL from "../api";

function PortfolioAnalyzer() {
  const [investment, setInvestment] = useState(10000);
  const [tickers, setTickers] = useState("AAPL,MSFT,NVDA");
  const [weights, setWeights] = useState("40,30,30");
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyzePortfolio = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/portfolio-analysis`, {
        params: { tickers, weights, investment },
      });
      setPortfolio(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 shadow-2xl">
      <h2 className="text-3xl font-bold text-white mb-4">
        Portfolio Risk Analyzer
      </h2>

      {/* Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <input
          type="number"
          value={investment}
          onChange={(e) => setInvestment(e.target.value)}
          placeholder="Investment Amount"
          className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-[#f2e9e4] focus:ring-10 focus:ring-[#f2e9e4]/20"
        />
        <input
          type="text"
          value={tickers}
          onChange={(e) => setTickers(e.target.value)}
          placeholder="Tickers (comma separated)"
          className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-[#f2e9e4] focus:ring-10 focus:ring-[#f2e9e4]/20"
        />
        <input
          type="text"
          value={weights}
          onChange={(e) => setWeights(e.target.value)}
          placeholder="Weights (%, comma separated)"
          className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-[#f2e9e4] focus:ring-10 focus:ring-[#f2e9e4]/20"
        />
      </div>

      <button
        onClick={analyzePortfolio}
        className="px-6 py-3 bg-[#c9ada7] hover:bg-[#f2e9e4] rounded-xl font-bold hover:scale-105 active:scale-95"
      >
        Analyze Portfolio
      </button>

      {loading && (
        <div role="status" className="flex justify-center items-center py-8">
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

      {/* Results */}
      {portfolio && (
        <>
          {/* Summary Cards */}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-gray-700/50 rounded-xl p-4 text-center">
              <p className="text-white text-sm">Expected Return</p>
              <p className="text-2xl font-bold text-white">
                {portfolio.expected_return_pct} %
              </p>
            </div>
            <div className="bg-gray-700/50 rounded-xl p-4 text-center">
              <p className="text-white text-sm">Volatility</p>
              <p className="text-2xl font-bold text-white">
                {portfolio.portfolio_volatility_pct} %
              </p>
            </div>
            <div className="bg-gray-700/50 rounded-xl p-4 text-center">
              <p className="text-white text-sm mb-1">Risk Level</p>
              <span
                className={`inline-block px-3 py-1 rounded-full text-medium font-semibold ${
                  portfolio.risk_level === "High"
                    ? "bg-red-500/20 text-red-400"
                    : "bg-green-500/20 text-green-400"
                }`}
              >
                {portfolio.risk_level}
              </span>
            </div>
            <div className="bg-gray-700/50 rounded-xl p-4 text-center">
              <p className="text-white text-sm">Best Performer</p>
              <p className="text-2xl font-bold text-white">
                {portfolio.best_performer}
              </p>
            </div>
          </div>

          {/* Stocks Table */}
          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4 text-2xl font-bold text-white">
                    Stock
                  </th>
                  <th className="text-left py-3 px-4 text-2xl font-bold text-white">
                    Allocation %
                  </th>
                  <th className="text-right py-3 px-4 text-2xl font-bold text-white">
                    Return %
                  </th>
                  <th className="text-right py-3 px-4 text-2xl font-bold text-white">
                    Volatility %
                  </th>
                </tr>
              </thead>
              <tbody>
                {portfolio.stocks.map((stock) => (
                  <tr
                    key={stock.ticker}
                    className="border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors"
                  >
                    <td className="py-3 px-4 font-semibold text-white text-xl">
                      {stock.ticker}
                    </td>
                    <td className="py-3 px-4 text-white text-xl">
                      {stock.weight}%
                    </td>
                    <td className="py-3 px-4 text-right text-white text-xl">
                      {stock.return_pct}%
                    </td>
                    <td className="py-3 px-4 text-right text-white text-xl">
                      {stock.volatility_pct}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

export default PortfolioAnalyzer;
