import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import axiosClient from "../api/axiosClient";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import toast, { Toaster } from "react-hot-toast";
import "react-circular-progressbar/dist/styles.css";

export default function Goals() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);
  const [bulkUpdating, setBulkUpdating] = useState(false);

  const fetchGoals = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axiosClient.get("/students/goals");
      setGoals(res.data);
      setLastUpdated(new Date());

      // Check notifications
      res.data.forEach((g) => {
        const progress = g.current / g.target;
        const today = new Date();
        const deadline = new Date(g.deadline);
        const totalDays = (deadline - new Date(g.startDate)) / (1000 * 60 * 60 * 24);
        const elapsedDays = (today - new Date(g.startDate)) / (1000 * 60 * 60 * 24);
        const expectedProgress = elapsedDays / totalDays;

        if (progress >= 1) {
          toast.success(`🎉 Goal "${g.title}" completed!`);
        } else if (progress < expectedProgress) {
          toast.error(`⚠ Goal "${g.title}" is behind schedule!`);
        }
      });
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to fetch goals.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
    const interval = setInterval(() => fetchGoals(), 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const getPercentage = (current, target) => (target ? Math.min(100, (current / target) * 100) : 0);

  const getColor = (progress) => {
    if (progress < 40) return "#f87171";
    if (progress < 70) return "#facc15";
    return "#34d399";
  };

  const handleSliderChange = (goalId, newValue) => {
    setGoals((prev) =>
      prev.map((g) => (g.id === goalId ? { ...g, current: Number(newValue) } : g))
    );
  };

  const handleBulkUpdate = async () => {
    setBulkUpdating(true);
    try {
      const updates = goals.map((g) => ({ id: g.id, current: g.current }));
      await axiosClient.put("/students/goals/bulk-update", { goals: updates });
      toast.success("All goals updated successfully!");
      fetchGoals();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update goals.");
    } finally {
      setBulkUpdating(false);
    }
  };
  const handleSendAlerts = async () => {
  if (goals.length === 0) return toast.error("No goals to alert for.");
  try {
    const res = await axiosClient.post("/students/goals/send-alerts", {
      goal_ids: goals.map((g) => g.id),
    });
    toast.success(res.data.message || "Alerts sent successfully!");
  } catch (err) {
    console.error(err);
    toast.error("Failed to send alerts.");
  }
};

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Toaster position="top-right" />
      <Sidebar />
      <div className="flex-1 ml-64">
        <Topbar title="Goals" />
        <main className="mt-16 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Student Goals Progress</h2>
            {lastUpdated && (
              <span className="text-gray-500 text-sm">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </span>
            )}
          </div>

          {error && <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">{error}</div>}

          {loading ? (
            <p>Loading goals...</p>
          ) : goals.length === 0 ? (
            <p>No goals found for this student.</p>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {goals.map((g) => {
                  const progress = getPercentage(g.current, g.target);
                  return (
                    <div key={g.id} className="bg-white p-4 rounded shadow flex flex-col items-center">
                      <CircularProgressbar
                        value={progress}
                        text={`${Math.round(progress)}%`}
                        styles={buildStyles({
                          pathColor: getColor(progress),
                          textColor: "#111827",
                          trailColor: "#d1d5db",
                          textSize: "16px",
                        })}
                      />
                      <h3 className="mt-4 font-semibold text-center">{g.title}</h3>
                      <p className="text-gray-600 text-sm mt-1 text-center">
                        {g.name} | Target: {g.target} | Deadline: {g.deadline}
                      </p>

                      <input
                        type="range"
                        min="0"
                        max={g.target}
                        value={g.current}
                        onChange={(e) => handleSliderChange(g.id, e.target.value)}
                        className="mt-4 w-full"
                      />
                      <p className="mt-2 text-sm text-gray-600">
                        {g.current}/{g.target}
                      </p>

                      {g.history && g.history.length > 0 && (
                        <div className="w-full h-24 mt-4">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={g.history}>
                              <XAxis dataKey="date" hide />
                              <YAxis domain={[0, g.target]} hide />
                              <Tooltip formatter={(value) => [`${value}`, "Progress"]} />
                              <Line
                                type="monotone"
                                dataKey="progress"
                                stroke="#3B82F6"
                                strokeWidth={2}
                                dot={{ r: 2 }}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 text-center">
                <button
                  onClick={handleBulkUpdate}
                  disabled={bulkUpdating}
                  className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition"
                >
                  {bulkUpdating ? "Updating..." : "Update All Goals"}
                </button>
              </div>
              <div className="mt-6 text-center flex justify-center gap-4">
  <button
    onClick={handleBulkUpdate}
    disabled={bulkUpdating}
    className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition"
  >
    {bulkUpdating ? "Updating..." : "Update All Goals"}
  </button>

  <button
    onClick={handleSendAlerts}
    className="bg-purple-500 text-white px-6 py-2 rounded hover:bg-purple-600 transition"
  >
    Send Alerts to Students
  </button>
</div>

            </>
          )}
        </main>
      </div>
    </div>
  );
}
