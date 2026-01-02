import axiosClient from "./axiosClient";

/**
 * ============================
 * DASHBOARD KPIs / STATS
 * ============================
 * Used for top stat cards
 */
export const getDashboardStats = async () => {
  try {
    const res = await axiosClient.get("/analytics/stats/");
    return res.data;
    /*
      {
        totalStudents: number,
        atRiskStudents: number,
        avgAttendance: number,
        avgScore: number
      }
    */
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * ============================
 * RISK DISTRIBUTION
 * ============================
 * Used for Pie / Bar charts
 */
export const getRiskDistribution = async () => {
  try {
    const res = await axiosClient.get("/analytics/risk-distribution/");
    return res.data;
    /*
      [
        { risk: "Low", count: number },
        { risk: "Medium", count: number },
        { risk: "High", count: number }
      ]
    */
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * ============================
 * ATTENDANCE TREND
 * ============================
 * Used for Line chart
 */
export const getAttendanceTrend = async () => {
  try {
    const res = await axiosClient.get("/analytics/attendance-trend/");
    return res.data;
    /*
      [
        { label: "Jan", value: 85 },
        { label: "Feb", value: 82 }
      ]
    */
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * ============================
 * PERFORMANCE TREND
 * ============================
 * Used for Line / History charts
 */
export const getPerformanceTrend = async () => {
  try {
    const res = await axiosClient.get("/analytics/performance-trend/");
    return res.data;
    /*
      [
        { label: "IA-1", value: 68 },
        { label: "IA-2", value: 72 }
      ]
    */
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * ============================
 * ATTENDANCE vs SCORE
 * ============================
 * Used for Scatter chart
 */
export const getAttendanceVsScore = async () => {
  try {
    const res = await axiosClient.get("/analytics/attendance-vs-score/");
    return res.data;
    /*
      [
        { attendance: 75, score: 60 },
        { attendance: 90, score: 85 }
      ]
    */
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * ============================
 * AT-RISK STUDENTS (ALERTS)
 * ============================
 * Used in Risk Alerts page
 */
export const getRiskAlerts = async () => {
  try {
    const res = await axiosClient.get("/analytics/alerts/");
    return res.data;
    /*
      [
        { id, name, rollNo, attendance, score, riskLevel }
      ]
    */
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * ============================
 * FACULTY INTERVENTION ANALYTICS
 * ============================
 */
export const getInterventionAnalytics = async () => {
  try {
    const res = await axiosClient.get("/analytics/interventions/");
    return res.data;
    /*
      [
        { action: "Counselling", successRate: 72 }
      ]
    */
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * ============================
 * ✅ ALIASES (IMPORT ERROR FIX)
 * ============================
 * Keeps older pages working
 */
export const getHistoryData = getPerformanceTrend;
export const getTrendData = getPerformanceTrend;
export const getAlertsData = getRiskAlerts;