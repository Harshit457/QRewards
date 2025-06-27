import { ethers } from "ethers";
import MetaMaskSDK from "@metamask/sdk";
import abi from "./abi.json"; // Adjust the path based on your project structure

const CONTRACT_ADDRESS = "0x2788d3902c5492b34d0c09d7234efdcb71a108cf"; // ⛔ Replace with actual deployed contract address

// Setup MetaMask SDK and provider
const MMSDK = new MetaMaskSDK();
const ethereum = MMSDK.getProvider();

// Get the contract instance
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
export const createCampaign = async (_totalPrizes, _prizePerWinner, _durationInSeconds, totalValueInEther) => {
  const contract = await getContractInstance();
  const tx = await contract.createCampaign(_totalPrizes, _prizePerWinner, _durationInSeconds, {
    value: ethers.parseEther(totalValueInEther.toString())
  });
  return await tx.wait();
};

// 2️⃣ Claim Prize
export const claimPrize = async (_campaignId, _qrNumber) => {
  const contract = await getContractInstance();
  const tx = await contract.claimPrize(_campaignId, _qrNumber);
  return await tx.wait();
};

// 3️⃣ Get Campaign Balance
export const getCampaignBalance = async (_campaignId) => {
  const contract = await getContractInstance();
  const balance = await contract.getCampaignBalance(_campaignId);
  return ethers.formatEther(balance); // Returns balance in ETH
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
  return hashes;
};

