import {
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from "chart.js";

import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Pie } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
);

const AnalyticsDashboard = () => {
    const pieData = {
    labels: [
    "Completed",
    "Running",
    "Pending",
  ],

  datasets: [
    {
      data: [12, 4, 2],

      backgroundColor: [
        "#22c55e",
        "#3b82f6",
        "#f59e0b",
      ],

      borderWidth: 0,
    },
  ],
};
const lineData = {

  labels: [
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
    "Sun",
  ],

  datasets: [

    {
      label: "Projects",

      data: [2, 5, 3, 6, 7, 5, 8],

      borderColor: "#3b82f6",

      tension: 0.4,

      fill: false,

    },

  ],

};
  return (
  <div className="space-y-6">

    <h1 className="text-3xl font-bold text-white">
      📊 Analytics Dashboard
    </h1>

    {/* Stats */}

    <div className="grid grid-cols-4 gap-5">

      <div className="bg-slate-900 rounded-xl p-6 border border-slate-700">
        <p className="text-slate-400">Projects</p>
        <h2 className="text-4xl font-bold mt-3">18</h2>
      </div>

      <div className="bg-green-900 rounded-xl p-6">
        <p>Completed</p>
        <h2 className="text-4xl font-bold mt-3">12</h2>
      </div>

      <div className="bg-blue-900 rounded-xl p-6">
        <p>Running</p>
        <h2 className="text-4xl font-bold mt-3">4</h2>
      </div>

      <div className="bg-orange-900 rounded-xl p-6">
        <p>Pending</p>
        <h2 className="text-4xl font-bold mt-3">2</h2>
      </div>

    </div>

    {/* Charts */}

    <div className="grid grid-cols-2 gap-6">

  <div className="bg-slate-900 rounded-xl p-6 border border-slate-700">

    <h2 className="text-xl font-bold mb-4">
      Project Status
    </h2>

    <Pie data={pieData} />

  </div>

  <div className="bg-slate-900 rounded-xl p-6 border border-slate-700">

    <h2 className="text-xl font-bold mb-4">
      Weekly Activity
    </h2>

    <Line data={lineData} />

  </div>

    </div>

  </div>
);
};

export default AnalyticsDashboard;