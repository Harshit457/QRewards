import { ethers , Interface } from "ethers";
import MetaMaskSDK from "@metamask/sdk";
import abi from "./abi.json";

const CONTRACT_ADDRESS = "0x2681d3eb49d6f4eb7f5d9f7304591cef1153c7fd";


// ✅ Setup MetaMask SDK correctly
const MMSDK = new MetaMaskSDK({
  dappMetadata: {
    name: "QR Reward DApp",
    url: window.location.href,
  },
  injectProvider: true, // Ensures window.ethereum is injected
});

// Get the injected provider (window.ethereum)
const ethereum = window.ethereum;

// ✅ Contract instance helper
export const getContractInstance = async () => {
  if (!ethereum) throw new Error("MetaMask not detected");

  await ethereum.request({ method: "eth_requestAccounts" });

  const provider = new ethers.BrowserProvider(ethereum);
  const signer = await provider.getSigner();

  return new ethers.Contract(CONTRACT_ADDRESS, abi, signer);
};

//
// 📌 Smart Contract Functions
//

// 1️⃣ Create Campaign (payable)


export const createCampaign = async (_totalPrizes, _prizePerWinner, _durationInSeconds) => {
  const contract = await getContractInstance();

  const totalValue = BigInt(_totalPrizes) * BigInt(_prizePerWinner);

  const tx = await contract.createCampaign(
    _totalPrizes,
    _prizePerWinner,
    _durationInSeconds,
    {
      value: totalValue
    }
  );

  await tx.wait();

  // ✅ No need to parse logs anymore
  return tx.hash;
};


// 2️⃣ Claim Prize
export const claimPrize = async (_campaignId, _qrHash) => {
  const contract = await getContractInstance();
  const tx = await contract.claimPrize(_campaignId, _qrHash);
  return await tx.wait();
};

// 3️⃣ Get Campaign Balance
export const getCampaignBalance = async (_campaignId) => {
  const contract = await getContractInstance();
  const balance = await contract.getCampaignBalance(_campaignId);
  return ethers.formatEther(balance); // returns in ETH
};

// 4️⃣ End Campaign
export const endCampaign = async (_campaignId) => {
  const contract = await getContractInstance();
  const tx = await contract.endCampaign(_campaignId);
  return await tx.wait();
};

// 5️⃣ Get Winning Hashes
export const getWinningHashes = async (_campaignId) => {
  const contract = await getContractInstance();
  const hashes = await contract.getWinningHashes(_campaignId);
  return hashes; // returns bytes32[]
};
