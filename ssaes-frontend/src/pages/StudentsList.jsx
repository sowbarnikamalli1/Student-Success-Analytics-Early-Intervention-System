import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import axiosClient from "../api/axiosClient";

const StudentsList = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchStudents() {
      try {
        const response = await axiosClient.get("/students");
        setStudents(response.data);
      } catch (err) {
        setError(err.response?.data?.detail || "Failed to fetch students");
      } finally {
        setLoading(false);
      }
    }
    fetchStudents();
  }, []);

  // Filtered students based on search
  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.rollNo.toString().includes(search)
  );

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      <div className="flex-1 ml-64">
        <Topbar title="Students List" />

        <main className="mt-16 p-6">
          {/* Search */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search by name or roll no"
              className="w-full md:w-1/3 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">
              {error}
            </div>
          )}

          {/* Loading */}
          {loading ? (
            <p>Loading students...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full bg-white rounded shadow border-collapse">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="px-4 py-2 text-left border">Roll No</th>
                    <th className="px-4 py-2 text-left border">Name</th>
                    <th className="px-4 py-2 text-left border">Email</th>
                    <th className="px-4 py-2 text-left border">Attendance</th>
                    <th className="px-4 py-2 text-left border">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center py-4">
                        No students found.
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((student) => (
                      <tr key={student.id} className="hover:bg-gray-100">
                        <td className="px-4 py-2 border">{student.rollNo}</td>
                        <td className="px-4 py-2 border">{student.name}</td>
                        <td className="px-4 py-2 border">{student.email}</td>
                        <td className="px-4 py-2 border">{student.attendance}%</td>
                        <td className="px-4 py-2 border">
                          {student.status === "high" && (
                            <span className="text-red-600 font-semibold">High Risk</span>
                          )}
                          {student.status === "medium" && (
                            <span className="text-yellow-600 font-semibold">Medium Risk</span>
                          )}
                          {student.status === "low" && (
                            <span className="text-green-600 font-semibold">Low Risk</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default StudentsList;
