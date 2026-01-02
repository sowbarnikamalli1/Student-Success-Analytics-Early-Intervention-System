import React, { useEffect, useState, useRef } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import axiosClient from "../api/axiosClient";
import { List } from "react-window";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Papa from "papaparse";

const ROW_HEIGHT = 50;
const TABLE_HEIGHT = 600;

const RiskAlerts = () => {
  const [students, setStudents] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [error, setError] = useState("");
  const [filterRisk, setFilterRisk] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);
  const prevStudentIds = useRef(new Set());

  // Fetch at-risk students
  const fetchStudents = async (showToast = false) => {
    setLoading(true);
    setError("");
    try {
      const res = await axiosClient.get("/students/atrisk");
      const newIds = res.data.filter((s) => !prevStudentIds.current.has(s.id));
      if (newIds.length > 0 && showToast) {
        toast.info(`${newIds.length} new at-risk student(s) found!`);
      }
      prevStudentIds.current = new Set(res.data.map((s) => s.id));
      setStudents(res.data);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to fetch risk alerts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
    const interval = setInterval(() => fetchStudents(true), 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Filter & search
  useEffect(() => {
    let temp = [...students];
    if (filterRisk !== "All") temp = temp.filter((s) => s.riskLevel === filterRisk);
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      temp = temp.filter(
        (s) => s.name.toLowerCase().includes(query) || String(s.rollNo).includes(query)
      );
    }
    setFiltered(temp);
  }, [students, filterRisk, searchQuery]);

  const getRiskBadge = (risk) => {
    switch (risk?.toLowerCase()) {
      case "high":
        return "bg-red-500 text-white px-2 py-1 rounded";
      case "medium":
        return "bg-yellow-400 text-white px-2 py-1 rounded";
      case "low":
        return "bg-green-500 text-white px-2 py-1 rounded";
      default:
        return "";
    }
  };

  const handleBulkAlert = async () => {
    if (filtered.length === 0) return alert("No students selected.");
    setBulkLoading(true);
    try {
      const res = await axiosClient.post("/students/atrisk/alert", {
        students: filtered.map((s) => s.id),
      });
      toast.success(res.data.message || "Alerts sent successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to send alerts.");
    } finally {
      setBulkLoading(false);
    }
  };

  const handleBulkIntervention = async () => {
    if (filtered.length === 0) return alert("No students selected.");
    setBulkLoading(true);
    try {
      const res = await axiosClient.post("/students/atrisk/intervene", {
        students: filtered.map((s) => s.id),
      });
      toast.success(res.data.message || "Interventions marked successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to mark interventions.");
    } finally {
      setBulkLoading(false);
    }
  };

  // Download filtered CSV
  const handleDownloadCSV = () => {
    if (filtered.length === 0) return alert("No students to export.");
    const csv = Papa.unparse(
      filtered.map((s) => ({
        RollNo: s.rollNo,
        Name: s.name,
        Attendance: s.attendance,
        Score: s.score,
        RiskLevel: s.riskLevel,
      }))
    );
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "at_risk_students.csv";
    link.click();
  };

  const Row = ({ index, style }) => {
    const s = filtered[index];
    const isNew = !prevStudentIds.current.has(s.id);
    return (
      <div
        style={{ ...style, display: "flex", borderBottom: "1px solid #e5e7eb" }}
        className={`hover:bg-gray-100 ${isNew ? "bg-blue-100 animate-pulse" : ""}`}
      >
        <div className="flex-1 px-4 py-2">{s.name}</div>
        <div className="w-28 px-4 py-2 text-center">{s.rollNo}</div>
        <div className="w-28 px-4 py-2 text-center">{s.attendance}%</div>
        <div className="w-28 px-4 py-2 text-center">{s.score}</div>
        <div className="w-28 px-4 py-2 text-center">
          <span className={getRiskBadge(s.riskLevel)}>{s.riskLevel}</span>
        </div>
        <div className="w-32 px-4 py-2 text-center space-x-1">
          <button className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition">
            Alert
          </button>
          <button className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 transition">
            Intervention
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Topbar title="Risk Alerts" />
        <ToastContainer position="top-right" autoClose={5000} />
        <main className="mt-16 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">At-Risk Students</h2>
            <div className="flex items-center gap-2">
              <span className="text-gray-600 text-sm">
                Last Updated: {lastUpdated ? lastUpdated.toLocaleTimeString() : "-"}
              </span>
              <button
                onClick={() => fetchStudents(true)}
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
              >
                Refresh Now
              </button>
            </div>
          </div>

          <div className="flex gap-2 mb-4">
            <select
              value={filterRisk}
              onChange={(e) => setFilterRisk(e.target.value)}
              className="border p-2 rounded"
            >
              <option>All</option>
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
            <input
              type="text"
              placeholder="Search by Name or Roll No"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border p-2 rounded flex-1"
            />
            <button
              onClick={handleBulkAlert}
              disabled={bulkLoading}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            >
              {bulkLoading ? "Sending..." : "Send Alerts"}
            </button>
            <button
              onClick={handleBulkIntervention}
              disabled={bulkLoading}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
            >
              {bulkLoading ? "Processing..." : "Mark Interventions"}
            </button>
            <button
              onClick={handleDownloadCSV}
              className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800 transition"
            >
              Download CSV
            </button>
          </div>

          {error && (
            <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">{error}</div>
          )}

          {loading ? (
            <p>Loading...</p>
          ) : filtered.length === 0 ? (
            <p>No students match your filters.</p>
          ) : (
            <div className="bg-white rounded shadow-md overflow-hidden">
              <div className="flex bg-gray-200 font-semibold">
                <div className="flex-1 px-4 py-2">Name</div>
                <div className="w-28 px-4 py-2 text-center">Roll No</div>
                <div className="w-28 px-4 py-2 text-center">Attendance</div>
                <div className="w-28 px-4 py-2 text-center">Score</div>
                <div className="w-28 px-4 py-2 text-center">Risk Level</div>
                <div className="w-32 px-4 py-2 text-center">Actions</div>
              </div>
              <List
                height={TABLE_HEIGHT}
                itemCount={filtered.length}
                itemSize={ROW_HEIGHT}
                width="100%"
              >
                {Row}
              </List>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default RiskAlerts;
