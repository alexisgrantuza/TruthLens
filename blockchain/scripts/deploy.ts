import { network } from "hardhat";
import fs from "fs";

async function main() {
  console.log("🚀 Deploying TruthLens contract to Polygon Mumbai...");
  const { ethers } = await network.connect();

  // Get deployer account
  const [deployer] = await ethers.getSigners();
  console.log("📝 Deploying with account:", deployer.address);

  const balance = await deployer.provider?.getBalance(deployer.address);
  console.log(
    "💰 Account balance:",
    ethers.formatEther(balance || 0n),
    "MATIC"
  );

  // Deploy contract
  const TruthLens = await ethers.getContractFactory("TruthLens");
  const truthLens = await TruthLens.deploy();
  await truthLens.waitForDeployment();

  const contractAddress = await truthLens.getAddress();
  console.log("✅ TruthLens deployed to:", contractAddress);
  console.log("");
  console.log("📋 Deployment Summary:");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("Contract Address:", contractAddress);
  console.log("Deployer Address:", deployer.address);
  console.log("Network:", "Polygon Mumbai (ChainID: 80001)");
  console.log(
    "Block Explorer:",
    `https://polygonscan.com/address/${contractAddress}`
  );
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("");
  console.log("🔍 To verify on PolygonScan:");
  console.log(`npx hardhat verify --network mumbai ${contractAddress}`);
  console.log("");
  console.log("⚙️  Next Steps:");
  console.log("1. Copy contract address to backend/.env");
  console.log("2. Copy contract address to frontend/.env.local");
  console.log("3. Update VITE_CONTRACT_ADDRESS in frontend");
  console.log("");

  // Save deployment info
  const deploymentInfo = {
    contractAddress: contractAddress,
    deployer: deployer.address,
    network: "amoy",
    chainId: 80001,
    deployedAt: new Date().toISOString(),
    blockExplorer: `https://polygonscan.com/address/${contractAddress}`,
  };

  fs.writeFileSync(
    "./deployments/amoy.json", // Save to new file
    JSON.stringify(deploymentInfo, null, 2)
  );

  console.log("💾 Deployment info saved to deployments/mumbai.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
