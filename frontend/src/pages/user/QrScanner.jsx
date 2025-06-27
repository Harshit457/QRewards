// src/components/ClaimPrize.jsx

import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import QrScanner from "qr-scanner";
import { claimPrize } from "../../utils/contractInteraction";
import { useDispatch, useSelector } from "react-redux";
import { updatePromotion } from "../../store/promotionslice";
import { addRecentActivity } from "../../store/recentactivityslice";

function ClaimPrize() {
  const [searchParams] = useSearchParams();
  const campaignId = searchParams.get("offer") || "";
  const dispatch = useDispatch();
  const [qrNumber, setQrNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [scanResult, setScanResult] = useState("");
  const [cameraActive, setCameraActive] = useState(false);
  const { promotions, error } = useSelector((state) => state.promotion);
  const videoRef = useRef(null); // ❌ Not the right way to manage refs

  console.log(promotions);

  const handleClaim = async (qrNum) => {
    setLoading(true);

    const promotionToUpdate = promotions.find(
      (promotion) => promotion.promotionId == campaignId
    );

    if (!promotionToUpdate) {
      alert("Promotion not found.");
      setLoading(false);
      return;
    }

    const updatedData = {
      scannedQRCodes: (promotionToUpdate?.scannedQRCodes || 0) + 1,
    };
    const userData = localStorage.getItem("user");
    const user = JSON.parse(userData);

    try {
      await claimPrize(campaignId, qrNum);
      dispatch(updatePromotion({ id: campaignId, updatedData }));

      // Log successful claim as recent activity
      dispatch(
        addRecentActivity({
          userId: user._id,
          companyid: promotionToUpdate.company?._id || "Unknown Company",
          brandName: promotionToUpdate.company?.fullName || "Unknown Brand",
          eventTitle: promotionToUpdate.title,
          prizemoney:
            promotionToUpdate.totalBudget / promotionToUpdate.numberofPrizes,
        })
      );

      alert("Prize claimed successfully!");
    } catch (error) {
      console.error("Error claiming prize:", error);

      // Still update scannedQRCodes even on failure (if that's desired)
      dispatch(updatePromotion({ id: campaignId, updatedData }));

      // Log failed claim as recent activity
      dispatch(
        addRecentActivity({
          userId: user._id,
          brandName: promotionToUpdate.company?.fullName || "Unknown Brand",
          eventTitle: promotionToUpdate.title,
          prizemoney: 0,
        })
      );

      const errMessage =
        error?.reason || error?.message || "Failed to claim prize.";
      alert(errMessage);
    }

    setLoading(false);
  };

  // --- Camera-based scanning ---
  useEffect(() => {
    let scanner;
  
    if (cameraActive && videoRef.current) {
      scanner = new QrScanner(
        videoRef.current,
        (result) => {
          setScanResult(result.data);
          setQrNumber(result.data);
          setCameraActive(false);
          scanner.stop();
          handleClaim(result.data);
        },
        {
          returnDetailedScanResult: true,
        }
      );
      scanner.start();
    }
  
    return () => {
      if (scanner) scanner.destroy();
    };
  }, [cameraActive]);

  // --- Image upload scanner ---
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const result = await QrScanner.scanImage(file, {
        returnDetailedScanResult: true,
      });
      setScanResult(result.data);
      setQrNumber(result.data);
      handleClaim(result.data);
    } catch (error) {
      console.error("QR scan failed", error);
      alert("Failed to scan QR code from image.");
    }
  };

  return (
    <div className="flex flex-col items-center mt-10 px-4">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center text-green-600">
          Claim Prize
        </h2>

        <p className="text-sm text-gray-700 mb-2 text-center">
          Campaign ID:{" "}
          <span className="font-semibold">{campaignId || "N/A"}</span>
        </p>

        {cameraActive ? (
          <div className="mb-4">
            <video
              ref={videoRef} // ✅ Use the ref directly
              className="w-full rounded shadow"
            />
            <button
              onClick={() => setCameraActive(false)}
              className="mt-2 w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
            >
              Stop Camera
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4 mb-4">
            <button
              onClick={() => setCameraActive(true)}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              Scan with Camera
            </button>

            <label className="block">
              <span className="block text-center text-gray-600 mb-1">
                or Upload QR Image
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full border p-2 rounded"
              />
            </label>
          </div>
        )}

        {loading && (
          <div className="text-center text-green-700 font-semibold mt-4">
            Claiming prize...
          </div>
        )}

        {scanResult && !loading && (
          <div className="mt-4 text-center text-sm text-gray-700">
            Scanned QR Number: <span className="font-bold">{scanResult}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default ClaimPrize;
