import { useState } from "react";
import axios from "axios";

/*
    CompareStocks Component

    Responsibilities:
    - Allow user to enter multiple stock tickers
    - Call the backend /compare endpoint
    - Display comparison results in a table
*/

function CompareStocks() {
  // User input
  const [tickers, setTickers] = useState("AAPL,MSFT,NVDA");

  // API response
  const [stocks, setStocks] = useState([]);

  // Loading indicator
  const [loading, setLoading] = useState(false);

  // Error message
  const [error, setError] = useState("");

  // Fetch comparison data
  const compareStocks = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `http://127.0.0.1:8000/compare?tickers=${tickers}`,
      );

      setStocks(response.data);
    } catch (err) {
      setError("Unable to compare stocks.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-4 mx-5 text-left">
        Input the Stock Codes for Comparison:
      </h2>
      <div className="flex gap-3 mb-8">
        <input
          type="text"
          value={tickers}
          onChange={(e) => setTickers(e.target.value.toUpperCase())}
          placeholder="AAPL, MSFT, NVDA"
          className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-[#f2e9e4] focus:ring-10 focus:ring-[#f2e9e4]/20"
        />

        <button
          onClick={compareStocks}
          className="px-6 py-3 bg-[#c9ada7] hover:bg-[#f2e9e4] rounded-xl font-bold hover:scale-105 active:scale-95"
        >
          Compare
        </button>
      </div>
      {loading && <p>Loading...</p>}

      {error && <p>{error}</p>}

      {stocks.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-4 text-gray-400 text-2xl font-bold text-white">
                  Rank
                </th>
                <th className="text-left py-3 px-4 text-gray-400 text-2xl font-bold text-white">
                  Ticker
                </th>
                <th className="text-right py-3 px-4 text-gray-400 text-2xl font-bold text-white">
                  Return %
                </th>
              </tr>
            </thead>
            <tbody>
              {stocks.map((stock, index) => (
                <tr
                  key={stock.ticker}
                  className="border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors"
                >
                  <td className="py-3 px-4 text-white text-xl font-bold">
                    #{index + 1}
                  </td>
                  <td className="py-3 px-4 text-white text-xl font-bold">
                    {stock.ticker}
                  </td>
                  <td
                    className={`py-3 px-4 text-right text-xl font-bold ${stock.return_pct >= 0 ? "text-green-400" : "text-red-400"}`}
                  >
                    {stock.return_pct}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default CompareStocks;
