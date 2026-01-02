// src/pages/AdvancedAnalytics.jsx
import React, { useEffect, useState, useCallback } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import {
  getAttendanceVsScore,
  getTrendData,
  getInterventionAnalytics
} from "../api/analyticsApi";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Line, Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend
);

const AdvancedAnalytics = () => {
  const [attendanceScore, setAttendanceScore] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [interventions, setInterventions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    try {
      const [avs, trend, intervention] = await Promise.all([
        getAttendanceVsScore(),
        getTrendData(),
        getInterventionAnalytics(),
      ]);

      setAttendanceScore(avs);
      setTrendData(trend);
      setInterventions(intervention);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Advanced analytics fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();
    const interval = setInterval(fetchAnalytics, 30 * 60 * 1000); // auto-refresh every 30 mins
    return () => clearInterval(interval);
  }, [fetchAnalytics]);

  /* ======================= CHART CONFIG ======================= */
  const attendanceVsScoreChart = {
    labels: attendanceScore.map(d => d.attendance),
    datasets: [
      {
        label: "Score",
        data: attendanceScore.map(d => d.score),
        borderColor: "#2563eb",
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const performanceTrendChart = {
    labels: trendData.map(d => d.label),
    datasets: [
      {
        label: "Average Score",
        data: trendData.map(d => d.value),
        borderColor: "#16a34a",
        backgroundColor: "rgba(134, 239, 172, 0.2)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const interventionChart = {
    labels: interventions.map(i => i.action),
    datasets: [
      {
        label: "Success Rate (%)",
        data: interventions.map(i => i.success_rate),
        backgroundColor: interventions.map(i => i.success_rate > 70 ? "#34d399" : "#f87171"),
      },
    ],
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Topbar title="Advanced Analytics" />

        <main className="mt-16 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Advanced Analytics</h2>
            <span className="text-sm text-gray-500">
              Last updated: {lastUpdated ? lastUpdated.toLocaleTimeString() : "—"}
            </span>
          </div>

          {loading ? (
            <p>Loading analytics...</p>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Attendance vs Score */}
              <AnalyticsCard title="Attendance vs Performance">
                <Line data={attendanceVsScoreChart} />
              </AnalyticsCard>

              {/* Performance Trend */}
              <AnalyticsCard title="Performance Trend">
                <Line data={performanceTrendChart} />
              </AnalyticsCard>

              {/* Intervention Effectiveness */}
              <AnalyticsCard title="Intervention Effectiveness">
                <Bar data={interventionChart} />
              </AnalyticsCard>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

/* ======================= REUSABLE COMPONENT ======================= */
const AnalyticsCard = ({ title, children }) => (
  <div className="bg-white p-4 rounded shadow hover:shadow-lg transition">
    <h3 className="font-semibold mb-3">{title}</h3>
    {children}
  </div>
);

export default AdvancedAnalytics;
