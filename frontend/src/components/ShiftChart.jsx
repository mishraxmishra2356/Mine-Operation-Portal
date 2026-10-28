import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip } from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip);

function ShiftChart({ shifts }) {
  const total = shifts.reduce((s, x) => s + x.tonnes, 0);
  const data = {
    labels: shifts.map((s) => s.name),
    datasets: [{ data: shifts.map((s) => s.tonnes), backgroundColor: "#f59e0b", borderRadius: 4 }],
  };
  const options = {
    indexAxis: "y",
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.parsed.x.toLocaleString("en-IN")} T (${Math.round((ctx.parsed.x / total) * 100)}%)`,
        },
      },
    },
    scales: {
      x: { ticks: { color: "#94a3b8" }, grid: { color: "#1e293b" } },
      y: { ticks: { color: "#94a3b8" }, grid: { display: false } },
    },
  };
  return <Bar data={data} options={options} aria-label="Shift-wise extraction output" role="img" />;
}

export default ShiftChart;
