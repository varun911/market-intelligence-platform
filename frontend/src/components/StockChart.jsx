import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

function StockChart({ history }) {
  console.log("StockChart received:", history.length, "records");

  const labels = history.map((item) =>
    new Date(item.Date).toLocaleDateString(),
  );
  const prices = history.map((item) => item.Close);

  const data = {
    labels: labels,
    datasets: [
      {
        label: "Closing Price",
        data: prices,
        borderColor: "#7c3aed",
        backgroundColor: "rgba(124, 58, 237, 0.1)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  return (
    <div style={{ height: "400px", width: "100%", position: "relative" }}>
      <Line
        data={data}
        options={{ responsive: true, maintainAspectRatio: false }}
      />
    </div>
  );
}

export default StockChart;
