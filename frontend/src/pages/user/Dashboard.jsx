import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaQrcode,
  FaIdCard,
  FaWallet,
  FaHistory,
  FaExclamationTriangle,
  FaCheckCircle,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { fetchRecentActivities } from "../../store/recentactivityslice"; // Assuming you have a userSlice for fetching user data

// Mock data
const mockScannedQRs = [
  {
    id: 1,
    date: "2025-04-12T10:23:45",
    company: "TechGizmo Inc.",
    promotion: "Summer Tech Fest",
    result: "Better luck next time",
  },
  {
    id: 2,
    date: "2025-04-10T16:30:12",
    company: "FreshMart",
    promotion: "Grand Opening Sale",
    result: "Won ₹500",
  },
  {
    id: 3,
    date: "2025-04-05T09:15:30",
    company: "SportStyle",
    promotion: "Run For Life",
    result: "Better luck next time",
  },
  {
    id: 4,
    date: "2025-03-28T14:20:00",
    company: "CoolBeans Coffee",
    promotion: "Morning Coffee Rush",
    result: "Won ₹250",
  },
];

const mockWinnings = [
  {
    id: 1,
    date: "2025-04-10T16:30:12",
    amount: 500,
    company: "FreshMart",
    promotion: "Grand Opening Sale",
    status: "Claimed",
  },
  {
    id: 2,
    date: "2025-03-28T14:20:00",
    amount: 250,
    company: "CoolBeans Coffee",
    promotion: "Morning Coffee Rush",
    status: "Pending",
  },
];

function Dashboard() {
  const [user, setUser] = useState(null);
  const [totalWinnings, setTotalWinnings] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { activities, loading, error } = useSelector(
    (state) => state.activities
  );

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/login");
      return;
    }

    // Set user data
    setUser(JSON.parse(userData));
    const user = JSON.parse(userData);
    console.log("User data:", userData);
    if (user._id) {
      const userId = user._id;
      dispatch(fetchRecentActivities(userId));
    }

    // Calculate total winnings (would come from API in real app)

    setIsLoading(false);
  }, [navigate, dispatch]);
  useEffect(() => {
    if (activities.length > 0) {
      const total = activities.reduce(
        (sum, activity) => sum + (activity.prizemoney || 0),
        0
      );
      setTotalWinnings(total);
    }
  }, [activities]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  function formatDate(dateStr) {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "Invalid date";
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  const winningScans = activities.filter(
    (activity) => activity.prizemoney && activity.prizemoney !== 0
  );

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      {/* Header */}
      <div className="bg-primary-600 text-white py-16">
        <div className="container-custom">
          <motion.h1
            className="text-3xl font-bold"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            User Dashboard
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-2"
          >
            Welcome back, {user?.name}
          </motion.p>
        </div>
      </div>

      {/* KYC Alert if not verified */}
      {!user?.isKycVerified && (
        <div className="bg-gold-50 border-l-4 border-gold-500 p-4 mt-4 container-custom">
          <div className="flex">
            <div className="flex-shrink-0">
              <FaExclamationTriangle className="h-5 w-5 text-gold-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gold-800">
                Complete KYC verification to claim winnings.
                <Link to="/user/kyc" className="font-medium underline ml-1">
                  Verify now
                </Link>
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="container-custom mt-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-xl font-bold text-primary-600">
                      {user?.name?.charAt(0) || "U"}
                    </span>
                  </div>
                  <div className="ml-3">
                    <h3 className="font-semibold">{user?.name}</h3>
                    <p className="text-sm text-slate-500">{user?.email}</p>
                  </div>
                </div>

                <nav className="space-y-1">
                  <button
                    onClick={() => setActiveTab("overview")}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                      activeTab === "overview"
                        ? "bg-primary-50 text-primary-600"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <FaQrcode className="mr-3 h-5 w-5" />
                    Overview
                  </button>

                  <button
                    onClick={() => setActiveTab("winnings")}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                      activeTab === "winnings"
                        ? "bg-primary-50 text-primary-600"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <FaWallet className="mr-3 h-5 w-5" />
                    My Winnings
                  </button>

                  <button
                    onClick={() => setActiveTab("history")}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                      activeTab === "history"
                        ? "bg-primary-50 text-primary-600"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <FaHistory className="mr-3 h-5 w-5" />
                    Scan History
                  </button>

                  <Link
                    to="/user/kyc"
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                      user?.isKycVerified
                        ? "bg-success-50 text-success-600"
                        : "bg-gold-50 text-gold-700"
                    }`}
                  >
                    <FaIdCard className="mr-3 h-5 w-5" />
                    {user?.isKycVerified ? "KYC Verified" : "Verify KYC"}
                    {user?.isKycVerified && (
                      <FaCheckCircle className="ml-2 h-4 w-4" />
                    )}
                  </Link>
                </nav>
              </div>
            </div>

            <div className="mt-6">
              <Link
                to="/user/offers"
                className="btn btn-primary w-full flex items-center justify-center"
              >
                <FaQrcode className="mr-2" />
                Browse Campaigns
              </Link>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3">
            {activeTab === "overview" && (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-white rounded-xl shadow-md p-6">
                    <h3 className="text-lg font-semibold mb-2">
                      Total Winnings
                    </h3>
                    <p className="text-3xl font-bold text-primary-600">
                      ₹{totalWinnings}
                    </p>
                    <p className="text-sm text-slate-500 mt-1">
                      From {winningScans.length} winning scans
                    </p>
                  </div>

                  <div className="bg-white rounded-xl shadow-md p-6">
                    <h3 className="text-lg font-semibold mb-2">Total Scans</h3>
                    <p className="text-3xl font-bold text-primary-600">
                      {activities.length}
                    </p>
                    <p className="text-sm text-slate-500 mt-1">
                      Win rate:{" "}
                      {Math.round(
                        (winningScans.length / mockScannedQRs.length) * 100
                      )}
                      %
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                  <div className="p-6 pb-0 border-b">
                    <h3 className="text-lg font-semibold">Recent Activity</h3>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {activities.slice(0, 3).map((scan) => (
                      <div key={scan._id} className="p-6">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">{scan.brandName}</p>
                            <p className="text-sm text-slate-500">
                              {scan.eventTitle}
                            </p>
                          </div>
                          <div className="text-right">
                            <p
                              className={
                                scan.prizemoney !== 0
                                  ? "text-success-600 font-medium"
                                  : "text-slate-500"
                              }
                            >
                              {scan.prizemoney
                                ? `win ₹${scan.prizemoney}`
                                : "Didn't won"}
                            </p>
                            <p className="text-xs text-slate-400">
                              {formatDate(scan.activityTime)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 bg-slate-50 text-center">
                    <button
                      onClick={() => setActiveTab("history")}
                      className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                    >
                      View All Activity
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "winnings" && (
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-6 border-b">
                  <h3 className="text-lg font-semibold">My Winnings</h3>
                </div>

                {winningScans.length === 0 ? (
                  <div className="p-6 text-center">
                    <p className="text-slate-500">
                      You haven't won any prizes yet. Keep scanning!
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {activities
                      .filter((a) => a.prizemoney !== 0)
                      .map((activity) => (
                        <div key={activity._id} className="p-6 border-b">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium">
                                ₹{activity.prizemoney}
                              </p>
                              <p className="text-sm text-slate-500">
                                {activity.brandName} - {activity.eventTitle}
                              </p>
                              <p className="text-xs text-slate-400 mt-1">
                                {formatDate(activity.activityTime)}
                              </p>
                            </div>
                            <div className="text-right">
                              <span className="px-2 py-1 text-xs rounded-full bg-gold-100 text-gold-800">
                                Pending
                              </span>

                              {!user?.isKycVerified && (
                                <button
                                  className="block mt-2 text-sm text-primary-600 hover:text-primary-700"
                                  disabled
                                >
                                  Verify KYC to Claim
                                </button>
                              )}

                              {user?.isKycVerified && (
                                <button className="block mt-2 text-sm text-primary-600 hover:text-primary-700">
                                  Claim Now
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "history" && (
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-6 border-b">
                  <h3 className="text-lg font-semibold">Scan History</h3>
                </div>

                {activities.length === 0 ? (
                  <div className="p-6 text-center">
                    <p className="text-slate-500">
                      You haven't scanned any QR codes yet.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                      <thead className="bg-slate-50">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
                          >
                            Date
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
                          >
                            Company
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
                          >
                            Promotion
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
                          >
                            Result
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-slate-200">
                        {activities.map((activity) => (
                          <tr key={activity._id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                              {formatDate(activity.activityTime)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                              {activity.brandName}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                              {activity.eventTitle}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="text-sm text-success-600 font-medium">
                                ₹{activity.prizemoney}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
