import { useState } from "react";
import axios from "axios";

function App() {
  const [ticker, setTicker] = useState("AAPL");
  const [data, setData] = useState(null);

  const fetchData = async () => {
    const res = await axios.get(`http://127.0.0.1:8000/analytics/${ticker}`);

    setData(res.data);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Market Intelligence Platform</h1>

      <input value={ticker} onChange={(e) => setTicker(e.target.value)} />

      <button onClick={fetchData}>Analyze</button>

      {data && (
        <div>
          <h2>{data.ticker}</h2>

          <p>Return: {data.return_pct}%</p>

          <p>Volatility: {data.volatility_pct}%</p>

          <p>7 Day MA: {data.ma_7}</p>

          <p>30 Day MA: {data.ma_30}</p>
        </div>
      )}
    </div>
  );
}

export default App;
