import { useState, useRef, useEffect } from "react";
import QRCode from "qrcode";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { QRCodeSVG } from "qrcode.react";
import { createPromotion } from "../../store/promotionslice";
import { useDispatch, useSelector } from "react-redux";
import {
  FaTrash,
  FaPlus,
  FaQrcode,
  FaMoneyBillWave,
  FaCalendarAlt,
  FaInfoCircle,
  FaFileDownload,
  FaCheckCircle,
} from "react-icons/fa";
import { createCampaign } from "../../utils/contractInteraction";
function CreatePromotion1() {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      startDate: "",
      endDate: "",
      qrCodes: 2,
      prizes: [{ amount: "", winners: 1 }],
    },
  });
  const dispatch = useDispatch();

  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [promotionData, setPromotionData] = useState(null);
  const [previewQrCodes, setPreviewQrCodes] = useState([]);
  const [contractAddress, setContractAddress] = useState("");
  const navigate = useNavigate();
  const [qrCodes, setQrCodes] = useState([]);
  const qrContainerRef = useRef(null);
  const user = useSelector((state) => state.auth.user);

  const prizes = watch("prizes");
  // const qrCodes = watch('qrCodes')

  const addPrize = () => {
    setValue("prizes", [...prizes, { amount: "", winners: 1 }]);
  };

  const removePrize = (index) => {
    setValue(
      "prizes",
      prizes.filter((_, i) => i !== index)
    );
  };

  const onSubmitStep1 = (data) => {
    setStep(2);
    setPromotionData(data);
    console.log("Promotion Data:", data);
  };

  const handleFundContract = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true); // Start loading

      const startTime = new Date(promotionData.startDate).getTime() / 1000;
      const endTime = new Date(promotionData.endDate).getTime() / 1000;
      const durationInSeconds = Math.floor(endTime - startTime);

      if (durationInSeconds <= 0) {
        alert("End date must be after start date");
        setIsLoading(false);
        return;
      }

      const totalPrizes = promotionData.prizes[0].winners;
      const prizePerWinner = promotionData.prizes[0].amount;
      

      const txHash = await createCampaign(
        totalPrizes,
        prizePerWinner,
        durationInSeconds
      );
      console.log("Transaction Hash:", txHash);
      const newPromotion = {
        title: promotionData.name,
        totalBudget:
          promotionData.prizes[0].amount * promotionData.prizes[0].winners,
        totalQRCodes: promotionData.qrCodes,
        scannedQRCodes: 0,
        status: "Active",
        startDate: promotionData.startDate,
        endDate: promotionData.endDate, // +7 days
        company: user?._id,
        numberofPrizes: promotionData.prizes[0].winners,
        txhash: txHash, // example
        prizes: [
          {
            winners: promotionData.prizes[0].winners,
            amount: promotionData.prizes[0].amount,
          },
        ],
      }; // ✅ Should now log correctly

      await dispatch(createPromotion(newPromotion)).unwrap();

      alert("Campaign created successfully!");

      setContractAddress(
        "0x50d461fe670c9042b0dbf08a0354bccc277b5078" +
          Math.random().toString(16).substr(2, 40)
      );

      setStep(3);

      const generateQRCodes = async () => {
        const codes = [];
        for (let i = 1; i <= promotionData.qrCodes; i++) {
          const dataUrl = await QRCode.toDataURL(i.toString());
          codes.push({ id: i, src: dataUrl });
        }
        setQrCodes(codes);
      };

      await generateQRCodes();
    } catch (error) {
      console.error(error);
      alert("Failed to create campaign.");
    } finally {
      setIsLoading(false); // End loading in both success or error
    }
  };

  const handleDownloadPDF = () => {
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "a4",
    });

    const qrSize = 100; // size of each QR
    const margin = 30;
    const spacing = 20;
    const qrPerRow = 5;
    const rowsPerPage = 4;
    const qrPerPage = qrPerRow * rowsPerPage;

    qrCodes.forEach(({ id, src }, index) => {
      const pageIndex = Math.floor(index / qrPerPage);
      const positionInPage = index % qrPerPage;

      if (positionInPage === 0 && index !== 0) {
        pdf.addPage();
      }

      const row = Math.floor(positionInPage / qrPerRow);
      const col = positionInPage % qrPerRow;

      const x = margin + col * (qrSize + spacing);
      const y = margin + row * (qrSize + 30); // extra for label

      pdf.addImage(src, "PNG", x, y, qrSize, qrSize);
      pdf.text(`#${id}`, x + qrSize / 2, y + qrSize + 15, { align: "center" });
    });

    pdf.save("qr-codes.pdf");
  };

  const calculateTotalBudget = () => {
    return prizes.reduce((total, prize) => {
      return total + (Number(prize.amount) || 0) * prize.winners;
    }, 0);
  };

  const handleFinish = () => {
    navigate("/company/dashboard");
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container-custom">
        <motion.div
          className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="p-6 bg-primary-600 text-white">
            <h1 className="text-xl font-bold">Create New Promotion</h1>
            <p className="mt-1 text-primary-100">
              Set up a QR code promotion with secure prize distribution
            </p>
          </div>

          {/* Progress steps */}
          <div className="p-4 border-b border-slate-200">
            <div className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 flex items-center justify-center rounded-full text-white ${
                    step >= 1 ? "bg-primary-500" : "bg-slate-300"
                  }`}
                >
                  {step > 1 ? <FaCheckCircle /> : "1"}
                </div>
                <p className="text-xs mt-1">Setup</p>
              </div>

              <div className="flex-1 h-1 mx-4 bg-slate-200 relative">
                <div
                  className={`absolute top-0 left-0 h-full bg-primary-500 transition-all duration-300 ${
                    step >= 2 ? "w-full" : "w-0"
                  }`}
                ></div>
              </div>

              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 flex items-center justify-center rounded-full text-white ${
                    step >= 2 ? "bg-primary-500" : "bg-slate-300"
                  }`}
                >
                  {step > 2 ? <FaCheckCircle /> : "2"}
                </div>
                <p className="text-xs mt-1">Funding</p>
              </div>

              <div className="flex-1 h-1 mx-4 bg-slate-200 relative">
                <div
                  className={`absolute top-0 left-0 h-full bg-primary-500 transition-all duration-300 ${
                    step >= 3 ? "w-full" : "w-0"
                  }`}
                ></div>
              </div>

              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 flex items-center justify-center rounded-full text-white ${
                    step >= 3 ? "bg-primary-500" : "bg-slate-300"
                  }`}
                >
                  {step > 3 ? <FaCheckCircle /> : "3"}
                </div>
                <p className="text-xs mt-1">QR Codes</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <form onSubmit={handleSubmit(onSubmitStep1)}>
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold mb-4 flex items-center">
                      <FaInfoCircle className="text-primary-500 mr-2" />
                      Promotion Details
                    </h2>

                    <div className="mb-4">
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-slate-700 mb-1"
                      >
                        Promotion Name
                      </label>
                      <input
                        id="name"
                        {...register("name", {
                          required: "Promotion name is required",
                        })}
                        className="input-field"
                        placeholder="Summer Sale 2025"
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.name.message}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label
                          htmlFor="startDate"
                          className="block text-sm font-medium text-slate-700 mb-1"
                        >
                          Start Date
                        </label>
                        <input
                          id="startDate"
                          type="date"
                          {...register("startDate", {
                            required: "Start date is required",
                          })}
                          className="input-field"
                        />
                        {errors.startDate && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.startDate.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="endDate"
                          className="block text-sm font-medium text-slate-700 mb-1"
                        >
                          End Date
                        </label>
                        <input
                          id="endDate"
                          type="date"
                          {...register("endDate", {
                            required: "End date is required",
                          })}
                          className="input-field"
                        />
                        {errors.endDate && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.endDate.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="qrCodes"
                        className="block text-sm font-medium text-slate-700 mb-1"
                      >
                        Number of QR Codes
                      </label>
                      <input
                        id="qrCodes"
                        type="number"
                        {...register("qrCodes", {
                          required: "Number of QR codes is required",
                          min: {
                            value: 1,
                            message: "Minimum 100 QR codes required",
                          },
                          max: {
                            value: 1000000,
                            message: "Maximum 1,000,000 QR codes allowed",
                          },
                        })}
                        className="input-field"
                      />
                      {errors.qrCodes ? (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.qrCodes.message}
                        </p>
                      ) : (
                        <p className="mt-1 text-xs text-slate-500">
                          How many QR codes do you want to generate for this
                          promotion.
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-semibold flex items-center">
                        <FaMoneyBillWave className="text-primary-500 mr-2" />
                        Prize Distribution
                      </h2>

                      {/* <button
                        type="button"
                        onClick={addPrize}
                        className="btn btn-sm btn-secondary flex items-center"
                      >
                        <FaPlus className="mr-1" /> Add Prize
                      </button> */}
                    </div>

                    {prizes.map((prize, index) => (
                      <div
                        key={index}
                        className="mb-4 bg-slate-50 p-4 rounded-lg"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium">Prize {index + 1}</h3>

                          {index > 0 && (
                            <button
                              type="button"
                              onClick={() => removePrize(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <FaTrash />
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label
                              htmlFor={`prizes.${index}.amount`}
                              className="block text-sm font-medium text-slate-700 mb-1"
                            >
                              Prize Amount (₹)
                            </label>
                            <input
                              id={`prizes.${index}.amount`}
                              type="number"
                              {...register(`prizes.${index}.amount`, {
                                required: "Prize amount is required",
                                min: {
                                  value: 100,
                                  message: "Minimum prize amount is ₹100",
                                },
                              })}
                              className="input-field"
                              placeholder="500000"
                            />
                            {errors.prizes?.[index]?.amount && (
                              <p className="mt-1 text-sm text-red-600">
                                {errors.prizes[index].amount.message}
                              </p>
                            )}
                          </div>

                          <div>
                            <label
                              htmlFor={`prizes.${index}.winners`}
                              className="block text-sm font-medium text-slate-700 mb-1"
                            >
                              Number of Winners
                            </label>
                            <input
                              id={`prizes.${index}.winners`}
                              type="number"
                              {...register(`prizes.${index}.winners`, {
                                required: "Number of winners is required",
                                min: {
                                  value: 1,
                                  message: "Minimum 1 winner required",
                                },
                                max: {
                                  // value: qrCodes / 100,
                                  value: 10,
                                  message: `Maximum ${Math.floor(
                                    qrCodes / 100
                                  )} winners allowed (1% of QR codes)`,
                                },
                              })}
                              className="input-field"
                            />
                            {errors.prizes?.[index]?.winners && (
                              <p className="mt-1 text-sm text-red-600">
                                {errors.prizes[index].winners.message}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}

                    <div className="bg-primary-50 p-4 rounded-lg border border-primary-100">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium text-primary-800">
                            Total Budget
                          </h3>
                          <p className="text-sm text-primary-600">
                            Total prize money required
                          </p>
                        </div>
                        <div className="text-xl font-bold text-primary-700">
                          ₹{calculateTotalBudget().toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button type="submit" className="btn btn-primary">
                      Continue
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {step === 2 && promotionData && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-lg font-semibold mb-4">
                  Fund Your Promotion
                </h2>

                <div className="bg-slate-50 p-4 rounded-lg mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-slate-700 mb-2">
                        Promotion Details
                      </h3>
                      <table className="w-full text-sm">
                        <tbody>
                          <tr>
                            <td className="py-1 text-slate-500">Name:</td>
                            <td className="py-1 font-medium">
                              {promotionData.name}
                            </td>
                          </tr>
                          <tr>
                            <td className="py-1 text-slate-500">Duration:</td>
                            <td className="py-1">
                              {new Date(
                                promotionData.startDate
                              ).toLocaleDateString()}{" "}
                              -{" "}
                              {new Date(
                                promotionData.endDate
                              ).toLocaleDateString()}
                            </td>
                          </tr>
                          <tr>
                            <td className="py-1 text-slate-500">QR Codes:</td>
                            <td className="py-1">
                              {Number(promotionData.qrCodes).toLocaleString()}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-slate-700 mb-2">
                        Prize Distribution
                      </h3>
                      <table className="w-full text-sm">
                        <tbody>
                          {promotionData.prizes.map((prize, index) => (
                            <tr key={index}>
                              <td className="py-1 text-slate-500">
                                Prize {index + 1}:
                              </td>
                              <td className="py-1">
                                {prize.winners}x ₹
                                {Number(prize.amount).toLocaleString()}
                              </td>
                            </tr>
                          ))}
                          <tr className="border-t border-slate-200">
                            <td className="py-2 text-slate-700 font-medium">
                              Total Budget:
                            </td>
                            <td className="py-2 font-bold">
                              ₹{calculateTotalBudget().toLocaleString()}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <div className="bg-gold-50 border border-gold-200 p-6 rounded-lg mb-6">
                  <h3 className="text-lg font-semibold text-gold-800 mb-4">
                    Secure Contract Funding
                  </h3>

                  <p className="mb-4 text-slate-700">
                    Your prize money will be secured in a smart contract to
                    ensure transparency and build trust with your customers. The
                    contract guarantees that winners will receive their prizes
                    instantly upon redemption.
                  </p>

                  <div className="bg-white p-4 rounded-lg border border-gold-200 mb-4">
                    <h4 className="font-medium mb-2">Required Funding</h4>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold">
                          ₹{calculateTotalBudget().toLocaleString()}
                        </p>
                        <p className="text-sm text-slate-500">
                          Total amount to be deposited
                        </p>
                      </div>
                      <button
                        onClick={handleFundContract}
                        disabled={isLoading}
                        className="btn btn-gold"
                      >
                        {isLoading ? (
                          <div className="flex items-center justify-center py-10">
                            <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-primary-600"></div>
                            <p className="ml-4 text-slate-500">
                              Creating campaign...
                            </p>
                          </div>
                        ) : (
                          "fund"
                        )}
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500">
                    Note: In a real implementation, this would connect to a
                    payment gateway to process the fund transfer to the smart
                    contract. For demo purposes, we'll simulate this process.
                  </p>
                </div>

                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="btn btn-secondary"
                  >
                    Back
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && promotionData && contractAddress && (
              <div className="p-4">
                <button
                  onClick={handleDownloadPDF}
                  className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Download as PDF
                </button>

                <div
                  ref={qrContainerRef}
                  className="grid grid-cols-5 gap-4 p-4 bg-white"
                  style={{ maxWidth: "1000px" }}
                >
                  {qrCodes.map(({ id, src }) => (
                    <div key={id} className="text-center">
                      <img src={src} alt={`QR for ${id}`} />
                      <p>#{id}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default CreatePromotion1;
