import { useState } from "react";
import axios from "axios";

function PortfolioAnalyzer() {
  const [investment, setInvestment] = useState(10000);
  const [tickers, setTickers] = useState("AAPL,MSFT,NVDA");
  const [weights, setWeights] = useState("40,30,30");
  const [portfolio, setPortfolio] = useState(null);

  const analyzePortfolio = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/portfolio-analysis`,
        {
          params: { tickers, weights, investment },
        },
      );
      setPortfolio(response.data);
    } catch (error) {
      console.log(error);
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
