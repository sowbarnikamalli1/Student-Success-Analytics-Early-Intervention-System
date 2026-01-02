import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import {
  getAttendanceVsScore,
  getTrendData,
  getInterventionAnalytics,
  getRiskDistribution,
} from "../api/analyticsApi";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Line, Bar, Pie } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

const StudentDashboard = () => {
  const [attendanceScore, setAttendanceScore] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [interventions, setInterventions] = useState([]);
  const [riskData, setRiskData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedMonth, setSelectedMonth] = useState("All");
  const [selectedSubject, setSelectedSubject] = useState("All");

  useEffect(() => {
    async function fetchStudentData() {
      setLoading(true);
      try {
        const [avs, trend, intervention, risk] = await Promise.all([
          getAttendanceVsScore({ month: selectedMonth, subject: selectedSubject }),
          getTrendData({ month: selectedMonth, subject: selectedSubject }),
          getInterventionAnalytics({ month: selectedMonth, subject: selectedSubject }),
          getRiskDistribution({ month: selectedMonth, subject: selectedSubject }),
        ]);

        setAttendanceScore(avs);
        setTrendData(trend);
        setInterventions(intervention);
        setRiskData(risk);
      } catch (err) {
        console.error("Student analytics error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchStudentData();
  }, [selectedMonth, selectedSubject]);

  /* ==================== CHART DATA ==================== */
  const attendanceVsScoreChart = {
    labels: attendanceScore.map((d) => d.attendance),
    datasets: [
      {
        label: "Score",
        data: attendanceScore.map((d) => d.score),
        borderColor: "#2563eb",
        backgroundColor: "#93c5fd",
      },
    ],
  };

  const performanceTrendChart = {
    labels: trendData.map((d) => d.label),
    datasets: [
      {
        label: "Average Score",
        data: trendData.map((d) => d.value),
        borderColor: "#16a34a",
        backgroundColor: "#86efac",
      },
    ],
  };

  const interventionChart = {
    labels: interventions.map((i) => i.action),
    datasets: [
      {
        label: "Success Rate (%)",
        data: interventions.map((i) => i.success_rate),
        backgroundColor: "#f97316",
      },
    ],
  };

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

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Topbar title="Student Dashboard" />

        <main className="mt-16 p-6">
          {/* ================= FILTERS ================= */}
          <div className="flex gap-2 mb-6">
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

            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="border p-2 rounded"
            >
              <option>All Subjects</option>
              <option>Mathematics</option>
              <option>Physics</option>
              <option>Chemistry</option>
              <option>Computer Science</option>
              <option>Electronics</option>
            </select>
          </div>

          {loading ? (
            <p>Loading analytics...</p>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AnalyticsCard title="Attendance vs Performance">
                <Line data={attendanceVsScoreChart} />
              </AnalyticsCard>

              <AnalyticsCard title="Performance Trend">
                <Line data={performanceTrendChart} />
              </AnalyticsCard>

              <AnalyticsCard title="Intervention Effectiveness">
                <Bar data={interventionChart} />
              </AnalyticsCard>

              <AnalyticsCard title="Risk Distribution">
                <Pie data={riskChart} />
              </AnalyticsCard>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

const AnalyticsCard = ({ title, children }) => (
  <div className="bg-white p-4 rounded shadow">
    <h3 className="font-semibold mb-3">{title}</h3>
    {children}
  </div>
);

export default StudentDashboard;
