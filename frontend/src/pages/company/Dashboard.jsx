import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaPlus,
  FaQrcode,
  FaUsers,
  FaMoneyBillWave,
  FaChartLine,
  FaDownload,
  FaEllipsisH,
} from "react-icons/fa";

import { useDispatch, useSelector } from "react-redux";
import { fetchMyPromotions } from "../../store/promotionslice";
import { getRecentActivitiesByCompany } from "../../store/recentactivityslice";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [currentAccount, setCurrentAccount] = useState(null);
  const { promotions, loading, error } = useSelector(
    (state) => state.promotion
  );
  const {
    activities,
    loading: activitiesLoading,
    error: activitiesError,
  } = useSelector((state) => state.activities);

  const handleButtonClick = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        if (accounts.length > 0) {
          setIsWalletConnected(true);
          setCurrentAccount(accounts[0]);
          navigate("/company/promotion/create");
        }
      } catch (error) {
        console.error("Error connecting wallet:", error);
      }
    } else {
      // Fallback for mobile
      if (isMobile()) {
        const dappUrl = encodeURIComponent(window.location.href); // Your website URL
        window.location.href = `https://metamask.app.link/dapp/Qreward.netlify.app`;
      } else {
        alert("Metamask not found. Please install Metamask extension.");
      }
    }
  };

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("user");
    console.log("User data:", userData);
    if (!userData) {
      navigate("/login");
      return;
    }

    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== "company") {
      navigate("/login");
      return;
    }

    setUser(parsedUser);

    setIsLoading(false);
  }, [navigate]);
  useEffect(() => {
    dispatch(fetchMyPromotions());
    dispatch(getRecentActivitiesByCompany());
  }, [dispatch]);
  const getTotalBudget = () => {
    return promotions.reduce((acc, promo) => acc + promo.totalBudget, 0);
  };

  useEffect(() => {
    checkWalletConnection();
  }, []);
  const checkWalletConnection = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        if (accounts.length > 0) {
          setIsWalletConnected(true);
          setCurrentAccount(accounts[0]);
        }
      } catch (error) {
        console.error("Error checking wallet connection:", error);
      }
    }
  };
  const isMobile = () => {
    return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  };

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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date);
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const activePromotions = promotions.filter(
    (promo) => promo.status === "Active"
  ).length;
  const totalQRCodes = promotions.reduce(
    (sum, promo) => sum + promo.totalQRCodes,
    0
  );
  const totalScannedQRCodes = promotions.reduce(
    (sum, promo) => sum + promo.scannedQRCodes,
    0
  );

  const sortedActivities = [...activities].sort(
    (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
  );

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      {/* Header */}
      <div className="bg-primary-600 text-white py-12 md:py-16">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl font-bold">Company Dashboard</h1>
              <p className="mt-2">
                Welcome, {user?.companyName || "Company Name"}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-4 md:mt-0"
            >
              <button
                onClick={handleButtonClick}
                className="btn btn-gold btn-lg flex items-center"
              >
                <FaPlus className="mr-2" />
                {isWalletConnected ? "Create New Promotion" : "Connect Wallet"}
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="container-custom mt-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            className="bg-white rounded-xl shadow-md p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-500 mb-1">Total Invested</p>
                <h3 className="text-2xl font-bold">
                  {formatCurrency(getTotalBudget())}
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  Across all promotions
                </p>
              </div>
              <div className="bg-primary-100 p-3 rounded-full">
                <FaMoneyBillWave className="text-primary-600 text-xl" />
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-white rounded-xl shadow-md p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-500 mb-1">Active Promotions</p>
                <h3 className="text-2xl font-bold">{activePromotions}</h3>
                <p className="text-sm text-slate-500 mt-1">
                  Out of {promotions.length} total
                </p>
              </div>
              <div className="bg-primary-100 p-3 rounded-full">
                <FaChartLine className="text-primary-600 text-xl" />
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-white rounded-xl shadow-md p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-500 mb-1">Total QR Codes</p>
                <h3 className="text-2xl font-bold">
                  {totalQRCodes.toLocaleString()}
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  {totalScannedQRCodes.toLocaleString()} scanned
                </p>
              </div>
              <div className="bg-primary-100 p-3 rounded-full">
                <FaQrcode className="text-primary-600 text-xl" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Promotions */}
        <motion.div
          className="bg-white rounded-xl shadow-md overflow-hidden mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h2 className="text-xl font-semibold">Your Promotions</h2>
            <Link
              to="/company/promotion/list"
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              View All
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
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
                    Budget
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
                  >
                    Timeline
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
                  >
                    QR Codes
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {promotions.map((promotion) => (
                  <tr key={promotion.promotionId}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-slate-900">
                        {promotion.title}
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-900">
                        ₹{promotion.totalBudget.toLocaleString()}
                      </div>
                      {/* You can add prize details here if needed */}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-900">
                        {formatDate(promotion.startDate)}
                      </div>
                      <div className="text-xs text-slate-500">
                        to {formatDate(promotion.endDate)}
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
            ${
              promotion.status === "Active"
                ? "bg-green-100 text-green-800"
                : "bg-slate-100 text-slate-800"
            }`}
                      >
                        {promotion.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      <div className="flex items-center">
                        <span className="mr-2">{promotion.totalQRCodes}</span>
                        {promotion.status === "Active" &&
                          promotion.totalQRCodes > 0 &&
                          promotion.scannedQRCodes !== undefined && (
                            <div className="w-24 bg-slate-200 rounded-full h-2">
                              <div
                                className="bg-primary-500 h-2 rounded-full"
                                style={{
                                  width: `${Math.min(
                                    100,
                                    (promotion.scannedQRCodes /
                                      promotion.totalQRCodes) *
                                      100
                                  )}%`,
                                }}
                              ></div>
                            </div>
                          )}
                      </div>
                      {promotion.status === "Active" &&
                        promotion.totalQRCodes > 0 &&
                        promotion.scannedQRCodes !== undefined && (
                          <span className="text-xs">
                            {promotion.scannedQRCodes} scanned (
                            {Math.round(
                              (promotion.scannedQRCodes /
                                promotion.totalQRCodes) *
                                100
                            )}
                            %)
                          </span>
                        )}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        {promotion.status === "Active" && (
                          <button className="text-primary-600 hover:text-primary-900">
                            <FaDownload title="Download QR Codes" />
                          </button>
                        )}
                        <button className="text-slate-400 hover:text-slate-500">
                          <FaEllipsisH title="More Options" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Recent Activity */}
        {/* <motion.div
      className="bg-white rounded-xl shadow-md overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.5 }}
    >
      <div className="p-6 border-b border-slate-100">
        <h2 className="text-xl font-semibold">Recent Activity</h2>
      </div>

      <div className="divide-y divide-slate-100">
        {sortedActivities.length > 0 ? (
          sortedActivities.map((activity) => (
            <div key={activity.id} className="p-4 flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mr-4 ${
                  activity.type === "scan"
                    ? "bg-primary-100"
                    : "bg-gold-100"
                }`}
              >
                {activity.type === "scan" ? (
                  <FaQrcode className="text-primary-600" />
                ) : (
                  <FaUsers className="text-gold-600" />
                )}
              </div>

              <div className="flex-grow">
                <p className="text-sm font-medium">
                  {activity.type === "scan" ? (
                    <>
                      QR Code{" "}
                      <span className="text-primary-600">
                        {activity.qrId}
                      </span>{" "}
                      was scanned
                    </>
                  ) : (
                    <>
                      {activity.name} {activity.action}
                    </>
                  )}
                </p>
                <p className="text-xs text-slate-500">
                  {activity.promotion} -{" "}
                  {formatDateTime(activity.timestamp)}
                </p>
              </div>

              {activity.type === "scan" && (
                <div className="ml-4">
                  <span
                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      activity.result === "No Win"
                        ? "bg-slate-100 text-slate-800"
                        : "bg-success-100 text-success-800"
                    }`}
                  >
                    {activity.result}
                  </span>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="p-6 text-center text-slate-500">
            No recent activity to display
          </div>
        )}
      </div>
    </motion.div> */}
      </div>
    </div>
  );
}

export default Dashboard;
