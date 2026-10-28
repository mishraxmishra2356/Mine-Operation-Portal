import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip } from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip);

function ShiftChart({ shifts }) {
  const total = shifts.reduce((s, x) => s + x.tonnes, 0);
  const data = {
    // "Shift A (Morning)" -> two lines, so the labels don't squeeze the bars on a phone
    labels: shifts.map((s) => s.name.replace(" (", "\n(").split("\n")),
    datasets: [{ data: shifts.map((s) => s.tonnes), backgroundColor: "#f59e0b", borderRadius: 4 }],
  };
  const options = {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        callbacks: {
          title: (items) => shifts[items[0].dataIndex]?.name ?? "",
          label: (ctx) => `${ctx.parsed.x.toLocaleString("en-IN")} T (${Math.round((ctx.parsed.x / total) * 100)}%)`,
        },
      },
    },
    scales: {
      x: { ticks: { color: "#94a3b8", maxTicksLimit: 5 }, grid: { color: "#1e293b" } },
      y: { ticks: { color: "#94a3b8", font: { size: 11 } }, grid: { display: false } },
    },
  };
  return (
    <div className="chart-box">
      <Bar data={data} options={options} aria-label="Shift-wise extraction output" role="img" />
    </div>
  );
}

export default ShiftChart;
