// src/pages/AdminDashboard.jsx
import React, { useEffect, useState, useCallback } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
import "jspdf-autotable";

import {
  getDashboardStats,
  getRiskDistribution,
  getAttendanceTrend,
  getPerformanceTrend,
  getInterventionAnalytics,
  getStudentsList
} from "../api/analyticsApi";

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

import { Bar, Pie, Line } from "react-chartjs-2";

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

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [riskData, setRiskData] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [performanceData, setPerformanceData] = useState([]);
  const [interventionData, setInterventionData] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Filters & Pagination
  const [selectedDept, setSelectedDept] = useState("All");
  const [selectedMonth, setSelectedMonth] = useState("All");
  const [page] = useState(1);
  const pageSize = 50; // showing 50 students per page

  const fetchAdminData = useCallback(async () => {
    setLoading(true);
    try {
      const [statsRes, riskRes, attendanceRes, performanceRes, interventionRes, studentsRes] = await Promise.all([
        getDashboardStats({ dept: selectedDept, month: selectedMonth }),
        getRiskDistribution({ dept: selectedDept }),
        getAttendanceTrend({ dept: selectedDept, month: selectedMonth }),
        getPerformanceTrend({ dept: selectedDept }),
        getInterventionAnalytics({ dept: selectedDept }),
        getStudentsList({ dept: selectedDept, page, pageSize })
      ]);

      setStats(statsRes);
      setRiskData(riskRes);
      setAttendanceData(attendanceRes);
      setPerformanceData(performanceRes);
      setInterventionData(interventionRes);
      setStudents(studentsRes);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Admin dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [selectedDept, selectedMonth, page]);

  useEffect(() => {
    fetchAdminData();
    const interval = setInterval(fetchAdminData, 30 * 60 * 1000); // auto-refresh every 30 mins
    return () => clearInterval(interval);
  }, [fetchAdminData]);

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Admin Dashboard Report", 10, 10);
    doc.autoTable({
      head: [["Metric", "Value"]],
      body: [
        ["Total Students", stats?.totalStudents],
        ["At-Risk Students", stats?.atRiskStudents],
        ["Avg Attendance", stats?.avgAttendance],
        ["Avg Score", stats?.avgScore]
      ]
    });
    doc.save("admin_dashboard_report.pdf");
  };

  /* Chart Configurations */
  const riskChart = {
    labels: riskData.map(r => r.risk),
    datasets: [
      {
        label: "Students",
        data: riskData.map(r => r.count),
        backgroundColor: riskData.map(r =>
          r.risk === "High" ? "#f87171" : r.risk === "Medium" ? "#facc15" : "#34d399"
        )
      }
    ]
  };

  const attendanceChart = {
    labels: attendanceData.map(a => a.label),
    datasets: [
      {
        label: "Attendance %",
        data: attendanceData.map(a => a.value),
        borderColor: "#3B82F6",
        backgroundColor: "rgba(59,130,246,0.2)",
        tension: 0.4,
        fill: true
      }
    ]
  };

  const performanceChart = {
    labels: performanceData.map(p => p.exam),
    datasets: [
      {
        label: "Avg Score",
        data: performanceData.map(p => p.score),
        borderColor: "#6366F1",
        backgroundColor: "rgba(99,102,241,0.2)",
        tension: 0.4,
        fill: true
      }
    ]
  };

  const interventionChart = {
    labels: interventionData.map(i => i.action),
    datasets: [
      {
        label: "Success Rate (%)",
        data: interventionData.map(i => i.success_rate),
        backgroundColor: interventionData.map(i => i.success_rate > 70 ? "#34d399" : "#f87171")
      }
    ]
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Topbar title="Admin Dashboard" />

        <main className="mt-16 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Dashboard Overview</h2>
            <div className="flex gap-2 items-center">
              <span className="text-sm text-gray-500">
                Last updated: {lastUpdated ? lastUpdated.toLocaleTimeString() : "—"}
              </span>
              <button onClick={fetchAdminData} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
                Refresh
              </button>
              <button onClick={exportPDF} className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">
                Export PDF
              </button>
              <CSVLink data={students} filename="students_list.csv" className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500">
                Export CSV
              </CSVLink>
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-2 mb-6">
            <select value={selectedDept} onChange={e => setSelectedDept(e.target.value)} className="border p-2 rounded">
              <option>All Departments</option>
              <option>CSE</option>
              <option>ECE</option>
              <option>ME</option>
            </select>
            <select value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)} className="border p-2 rounded">
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
              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <StatCard title="Total Students" value={stats?.totalStudents} />
                <StatCard title="At-Risk Students" value={stats?.atRiskStudents} />
                <StatCard title="Avg Attendance" value={`${stats?.avgAttendance}%`} />
                <StatCard title="Avg Score" value={`${stats?.avgScore}%`} />
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <ChartCard title="Risk Distribution"><Pie data={riskChart} /></ChartCard>
                <ChartCard title="Attendance Trend"><Line data={attendanceChart} /></ChartCard>
                <ChartCard title="Performance Trend"><Line data={performanceChart} /></ChartCard>
                <ChartCard title="Intervention Effectiveness"><Bar data={interventionChart} /></ChartCard>
              </div>

              {/* Student List */}
              <div className="overflow-x-auto bg-white rounded shadow p-4">
                <h3 className="text-lg font-semibold mb-3">Student List</h3>
                <table className="w-full table-auto border-collapse">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="border p-2">ID</th>
                      <th className="border p-2">Name</th>
                      <th className="border p-2">Dept</th>
                      <th className="border p-2">Attendance %</th>
                      <th className="border p-2">Avg Score</th>
                      <th className="border p-2">Risk</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((s) => (
                      <tr key={s.id} className="hover:bg-gray-100">
                        <td className="border p-2">{s.id}</td>
                        <td className="border p-2">{s.name}</td>
                        <td className="border p-2">{s.dept}</td>
                        <td className="border p-2">{s.attendance}</td>
                        <td className="border p-2">{s.avgScore}</td>
                        <td className="border p-2">{s.risk}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

/* ========================= REUSABLE COMPONENTS ========================= */
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

export default AdminDashboard;
