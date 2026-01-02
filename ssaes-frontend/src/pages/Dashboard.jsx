// src/pages/Dashboard.jsx
import React, { useState, useEffect, useCallback } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import {
  getDashboardStats,
  getRiskDistribution,
  getAttendanceTrend,
  getPerformanceTrend,
  getInterventionAnalytics,
} from "../api/analyticsApi";
import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { Bar, Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

const Dashboard = ({ role }) => {
  const [stats, setStats] = useState(null);
  const [riskData, setRiskData] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [performanceData, setPerformanceData] = useState([]);
  const [interventionData, setInterventionData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  const [selectedDept, setSelectedDept] = useState("All");
  const [selectedMonth, setSelectedMonth] = useState("All");

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const [statsRes, riskRes, attendanceRes, performanceRes, interventionRes] =
        await Promise.all([
          getDashboardStats({ dept: selectedDept, month: selectedMonth }),
          getRiskDistribution({ dept: selectedDept }),
          getAttendanceTrend({ dept: selectedDept, month: selectedMonth }),
          getPerformanceTrend({ dept: selectedDept }),
          role === "Admin" ? getInterventionAnalytics({ dept: selectedDept }) : Promise.resolve([]),
        ]);

      setStats(statsRes);
      setRiskData(riskRes);
      setAttendanceData(attendanceRes);
      setPerformanceData(performanceRes);
      setInterventionData(interventionRes);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Dashboard fetch error:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedDept, selectedMonth, role]);

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchDashboardData]);

  /* ================= CHARTS ================= */
  const riskChart = {
    labels: riskData.map((r) => r.risk),
    datasets: [
      {
        label: "Students",
        data: riskData.map((r) => r.count),
        backgroundColor: riskData.map((r) =>
          r.risk === "High" ? "#f87171" : r.risk === "Medium" ? "#facc15" : "#34d399"
        ),
      },
    ],
  };

  const attendanceChart = {
    labels: attendanceData.map((a) => a.label),
    datasets: [
      {
        label: "Attendance %",
        data: attendanceData.map((a) => a.value),
        borderColor: "#3B82F6",
        backgroundColor: "rgba(59,130,246,0.2)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const performanceChart = {
    labels: performanceData.map((d) => d.exam),
    datasets: [
      {
        label: "Avg Score",
        data: performanceData.map((d) => d.score),
        borderColor: "#6366F1",
        backgroundColor: "rgba(99,102,241,0.2)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const interventionChart = {
    labels: interventionData.map((d) => d.action),
    datasets: [
      {
        label: "Success Rate (%)",
        data: interventionData.map((d) => d.success_rate),
        backgroundColor: interventionData.map((d) =>
          d.success_rate > 70 ? "#34d399" : "#f87171"
        ),
      },
    ],
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Dashboard Report", 10, 10);
    doc.autoTable({
      head: [["Metric", "Value"]],
      body: [
        ["Total Students", stats?.totalStudents],
        ["At-Risk Students", stats?.atRiskStudents],
        ["Avg Attendance", stats?.avgAttendance],
        ["Avg Score", stats?.avgScore],
      ],
    });
    doc.save("dashboard_report.pdf");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Topbar title="Dashboard" />
        <main className="mt-16 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Dashboard Overview</h2>
            <div className="flex gap-2 items-center">
              <span className="text-sm text-gray-500">
                Last updated: {lastUpdated ? lastUpdated.toLocaleTimeString() : "—"}
              </span>
              <button
                onClick={fetchDashboardData}
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
              >
                Refresh
              </button>
              <button
                onClick={exportPDF}
                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
              >
                Export PDF
              </button>
              <CSVLink
                data={riskData}
                filename={"risk_distribution.csv"}
                className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500"
              >
                Export CSV
              </CSVLink>
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-2 mb-6">
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="border p-2 rounded"
            >
              <option>All Departments</option>
              <option>CSE</option>
              <option>ECE</option>
              <option>ME</option>
            </select>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="border p-2 rounded"
            >
              <option>All Months</option>
              <option>Jan</option>
              <option>Feb</option>
              <option>Mar</option>
              <option>Apr</option>
              <option>May</option>
              <option>Jun</option>
              <option>Jul</option>
              <option>Aug</option>
              <option>Sep</option>
              <option>Oct</option>
              <option>Nov</option>
              <option>Dec</option>
            </select>
          </div>

          {loading ? (
            <p>Loading dashboard...</p>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <StatCard title="Total Students" value={stats?.totalStudents} />
                <StatCard title="At-Risk Students" value={stats?.atRiskStudents} />
                <StatCard title="Avg Attendance" value={`${stats?.avgAttendance}%`} />
                <StatCard title="Avg Score" value={`${stats?.avgScore}%`} />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <ChartCard title="Risk Distribution">
                  <Pie data={riskChart} />
                </ChartCard>
                <ChartCard title="Attendance Trend">
                  <Line data={attendanceChart} />
                </ChartCard>
                <ChartCard title="Performance Trend">
                  <Line data={performanceChart} />
                </ChartCard>
                {role === "Admin" && interventionData.length > 0 && (
                  <ChartCard title="Intervention Effectiveness">
                    <Bar data={interventionChart} />
                  </ChartCard>
                )}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

const StatCard = ({ title, value }) => (
  <div className="bg-white p-4 rounded shadow">
    <h3 className="text-sm text-gray-500">{title}</h3>
    <p className="text-2xl font-bold mt-1">{value}</p>
  </div>
);

const ChartCard = ({ title, children }) => (
  <div className="bg-white p-4 rounded shadow hover:shadow-lg transition">
    <h3 className="font-semibold mb-2">{title}</h3>
    {children}
  </div>
);

export default Dashboard;
