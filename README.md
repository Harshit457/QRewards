# 🎉 QReward DApp 

A decentralized promotional campaign platform where companies can launch Ethereum-backed QR code-based campaigns. Users scan QR codes to instantly win rewards stored in smart contracts, ensuring trustless prize distribution and transparency.

---

## 📁 Project Structure
```bash

qreward-dapp/
│
├── frontend/  # React + Tailwind app for user interaction and scanning
│ ├── src/
│ │ ├── components/           # Reusable UI components (e.g., Navbar, QRScanner, Button)
│ │ ├── pages/                # App pages (e.g., Home.jsx, Campaigns.jsx)
│ │ ├── store/                # Redux or Zustand store files
│ │ └── utils/                # Utility functions and blockchain interaction
│ │    ├── contractInteraction.js  # Functions to interact with smart contract (ethers/web3)
│ │    └── abi.json               # ABI definition of QRPrizeCampaign contract
│ ├── public/
│ └── ...
│
├── backend/  # Node.js + Express + MongoDB backend for analytics & activity tracking
│ ├── models/            # MongoDB schemas (e.g., User.js, Activity.js)
│ ├── routes/            # Express routes
│ ├── controllers/       # Route logic controllers
│ ├── .env               # Environment variables for DB, API keys, etc.
│ └── ...
│
│
├── README.md
└── package.json


---
```

## 🚀 Features

### ✅ For Companies (B2B)
- Launch campaigns by locking ETH in smart contracts.
- Generate and assign prize-winning QR codes.
- Track QR code scans and redemptions.

### 🎁 For Users (B2C)
- Scan QR codes via web camera or image upload.
- Instantly claim ETH rewards if the QR contains prize money.
- View past activities and earnings.

### 🛡️ Trust & Transparency
- Smart contract on Ethereum (Sepolia) ensures prize money is secured.
- Users can view transaction hash and verify claims on Etherscan.
- One-time QR claims enforced via backend + smart contract logic.

---

## 🧠 Tech Stack

| Layer         | Tech                                             |
| ------------- | ------------------------------------------------ |
| Frontend      | React, Tailwind CSS, `qr-scanner`, Wagmi, Viem  |
| Backend       | Node.js, Express, MongoDB, JWT Auth             |
| Smart Contract| Solidity, remix, Sepolia Testnet, MetamaskSDK   |
| Wallet        | MetaMask                                        |

---

## 🔧 Installation

### Prerequisites
- Node.js (v16+)
- Yarn or npm
- Remix
- MongoDB Atlas or local MongoDB

---

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/yourusername/qr-rewards-dapp.git
cd qr-rewards-dapp
2️⃣ Environment Setup
Create a .env file in both frontend and backend folders:

.env for backend/
env
Copy
Edit
MONGODB_URI=mongodb+srv://your-db-uri
JWT_SECRET=your-secret-key
PORT=5000
```
3️⃣ Backend Setup
```bash
cd backend
npm install
npm run dev
```
4️⃣ Smart Contract Deployment
A contract.sol file exists at the root level under a folder named contractSolididty/.

Steps to deploy:
Open Remix IDE

- Paste the contents of contractSolididty/contract.sol into a new file.

- Compile the contract in Remix.

- Deploy the contract using MetaMask on Sepolia Testnet.

- Copy the deployed contract address.

- Update your VITE_CONTRACT_ADDRESS in the frontend .env.

5 Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
📌 Note: Ignore Solidity linting errors in Remix — focus on successful compilation and deployment.
💡 Make sure your wallet is connected to the Sepolia Testnet with some test ETH for transactions.



