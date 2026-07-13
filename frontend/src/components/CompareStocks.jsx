import { useState } from "react";
import axios from "axios";
import API_URL from "../api";

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

      const response = await axios.get(`${API_URL}/compare?tickers=${tickers}`);

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
        <hr />
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

      {error && <p>{error}</p>}

      {stocks.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-center py-3 px-4 text-2xl font-bold text-white">
                  Rank
                </th>
                <th className="text-center py-3 px-4 text-2xl font-bold text-white">
                  Ticker
                </th>
                <th className="text-center py-3 px-4 text-2xl font-bold text-white">
                  Price
                </th>
                <th className="text-center py-3 px-4 text-2xl font-bold text-white">
                  Return %
                </th>
                <th className="text-center py-3 px-4 text-2xl font-bold text-white">
                  Volatility %
                </th>
                <th className="text-center py-3 px-4 text-2xl font-bold text-white">
                  7 Day MA
                </th>
                <th className="text-center py-3 px-4 text-2xl font-bold text-white">
                  30 Day MA
                </th>
              </tr>
            </thead>
            <tbody>
              {stocks.map((stock, index) => (
                <tr
                  key={stock.ticker}
                  className="border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors"
                >
                  <td className="text-center py-3 px-4 text-white text-xl font-bold">
                    # {index + 1}
                  </td>
                  <td className="text-center py-3 px-4 text-white text-xl font-bold">
                    {stock.ticker}
                  </td>
                  <td className="text-center py-3 px-4 text-white text-xl font-bold">
                    $ {stock.price}
                  </td>
                  <td
                    className={`text-center py-3 px-4 text-xl font-bold ${stock.return_pct >= 0 ? "text-green-400" : "text-red-400"}`}
                  >
                    {stock.return_pct}%
                  </td>
                  <td className="text-center py-3 px-4 text-white text-xl font-bold">
                    {stock.volatility_pct}%
                  </td>
                  <td className="text-center py-3 px-4 text-white text-xl font-bold">
                    $ {stock.ma_7}
                  </td>
                  <td className="text-center py-3 px-4 text-white text-xl font-bold">
                    $ {stock.ma_30}
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
