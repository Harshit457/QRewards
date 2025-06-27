import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaMoneyBillWave,
  FaQrcode,
  FaCalendarAlt,
  FaInfoCircle,
  FaClock,
  FaCheckCircle,
} from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllPromotions } from "../../store/promotionslice.js";
import { getCampaignBalance } from "../../utils/contractInteraction";

function Offers() {
  const [filter, setFilter] = useState("All");
  const [balances, setBalances] = useState({});
  const dispatch = useDispatch();
  const { promotions, loading, error } = useSelector(
    (state) => state.promotion
  );
  const ETH_TO_INR = 200000;
  console.log(promotions);

  useEffect(() => {
    dispatch(fetchAllPromotions());
  }, [dispatch]);

  async function fetchAllBalances() {
    try {
      const balancePromises = promotions.map(async (promo) => {
        try {
          const result = await getCampaignBalance(promo.promotionId);
          return [promo.promotionId, result];
        } catch (err) {
          console.error(
            `Failed to fetch balance for campaign ${promo.promotionId}:`,
            err
          );
          return [promo.promotionId, "0"];
        }
      });

      const results = await Promise.all(balancePromises);

      // Convert array of [id, balance] to an object
      const newBalances = Object.fromEntries(results);
      setBalances(newBalances);
    } catch (error) {
      console.error("Failed to fetch all campaign balances:", error);
    }
  }
  async function fetchAllBalances() {
    console.log("Fetching balances for promotions:", promotions);

    try {
      const balancePromises = promotions.map(async (promo) => {
        try {
          const result = await getCampaignBalance(promo.promotionId);
          return [promo.promotionId, result];
        } catch (err) {
          console.error(
            `Failed to fetch balance for campaign ${promo.promotionId}:`,
            err
          );
          return [promo.promotionId, "0"];
        }
      });

      const results = await Promise.all(balancePromises);
      console.log("Results:", results);

      const newBalances = Object.fromEntries(results);
      setBalances(newBalances);
    } catch (error) {
      console.error("Failed to fetch all campaign balances:", error);
    }
  }

  useEffect(() => {
    if (promotions.length > 0) {
      fetchAllBalances();
    }
  }, [promotions]); // only re-run when promotions change

  const filteredOffers = (promotions || []).filter((offer) => {
    if (filter === "All") return true;
    return offer.status === filter;
  });
  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);

  const formatCurrencytoeth = (etherAmount) => {
    const inEther = Number(etherAmount); // Already a string like "0.0005"
    const inRupees = inEther * ETH_TO_INR;

    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2, // ensures ₹0.13 instead of ₹0
      maximumFractionDigits: 6, // up to 6 for very small ETH values
    }).format(inRupees);
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  if (loading) {
    return (
      <div className="text-center py-12 text-lg text-slate-600">
        Loading offers...
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-12 text-red-600">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container-custom">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Available Promotions
            </h1>
            <p className="text-slate-600">
              Browse verified company offers with secured prize budgets.
            </p>
          </div>

          <div className="flex space-x-2 mb-6">
            {["All", "Active", "Expired"].map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`btn ${
                  filter === type ? "btn-primary" : "btn-secondary"
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {filteredOffers.length === 0 ? (
            <div className="text-center text-slate-600">
              No offers available.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {filteredOffers.map((offer) => (
                <motion.div
                  key={offer.promotionId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="bg-white rounded-xl shadow-md overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                      <div>
                        <div className="flex items-center">
                          <h2 className="text-xl font-semibold text-slate-900">
                            {offer.title}
                          </h2>
                          <span
                            className="ml-2 text-primary-500"
                            title="Verified Company"
                          >
                            <FaCheckCircle />
                          </span>
                          {offer.txhash && (
                            <a
                              href={`https://sepolia.etherscan.io/tx/${offer.txhash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="ml-1 text-blue-500 text-sm underline hover:text-blue-700"
                              title="View Transaction on Etherscan"
                            >
                              check the transaction
                            </a>
                          )}
                        </div>

                        <p className="text-slate-600">
                          {offer.company?.fullName || "Company"}
                        </p>
                      </div>

                      <div className="mt-2 md:mt-0">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            offer.status === "Active"
                              ? "bg-green-100 text-green-800"
                              : "bg-slate-200 text-slate-700"
                          }`}
                        >
                          {offer.status === "Active" ? (
                            <>
                              <FaMoneyBillWave className="mr-1" /> Live Now
                            </>
                          ) : (
                            <>
                              <FaClock className="mr-1" /> Expired
                            </>
                          )}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="bg-slate-50 p-4 rounded-lg">
                        <div className="flex items-center mb-2">
                          <FaMoneyBillWave className="text-primary-500 mr-2" />
                          <h3 className="font-medium">Total Budget</h3>
                        </div>
                        <p className="text-2xl font-bold text-slate-900">
                          {formatCurrency(offer.totalBudget)}
                        </p>
                      </div>

                      <div className="bg-slate-50 p-4 rounded-lg">
                        <div className="flex items-center mb-2">
                          <FaQrcode className="text-primary-500 mr-2" />
                          <h3 className="font-medium">QR Codes</h3>
                        </div>
                        <p className="text-2xl font-bold text-slate-900">
                          {offer.totalQRCodes.toLocaleString()}
                        </p>
                        <div className="w-full bg-slate-200 rounded-full h-2 mt-2">
                          <div
                            className="bg-primary-500 h-2 rounded-full"
                            style={{
                              width: `${
                                (offer.scannedQRCodes /
                                  (offer.totalQRCodes || 1)) *
                                100
                              }%`,
                            }}
                          />
                        </div>
                        <p className="text-sm text-slate-600 mt-1">
                          {offer.scannedQRCodes.toLocaleString()} scanned (
                          {Math.round(
                            (offer.scannedQRCodes / (offer.totalQRCodes || 1)) *
                              100
                          )}
                          %)
                        </p>
                      </div>

                      <div className="bg-slate-50 p-4 rounded-lg">
                        <div className="flex items-center mb-2">
                          <FaCalendarAlt className="text-primary-500 mr-2" />
                          <h3 className="font-medium">Promotion Period</h3>
                        </div>
                        <p className="text-lg font-medium text-slate-900">
                          {formatDate(offer.startDate)}
                        </p>
                        <p className="text-sm text-slate-600">
                          to {formatDate(offer.endDate)}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-primary-50 rounded-lg">
                      <div className="flex items-start mb-4 md:mb-0">
                        <FaInfoCircle className="text-primary-500 mt-1 mr-2" />
                        <div>
                          <h4 className="font-medium text-primary-900">
                            Smart Contract Balance
                          </h4>
                          <p className="text-sm text-primary-700">
                            {balances[offer.promotionId]
                              ? `${
                                  balances[offer.promotionId]
                                } ETH (${formatCurrencytoeth(
                                  balances[offer.promotionId]
                                )}) secured for winners`
                              : "Loading..."}
                          </p>
                        </div>
                      </div>

                      <Link
                        to={`/user/scan?offer=${offer.promotionId}`}
                        className="btn btn-primary"
                      >
                        <FaQrcode className="mr-2" />
                        Scan QR Code
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Offers;
