const hre = require("hardhat");

async function main() {
  console.log("Deploying PriceFeed contract...");
  
  const PriceFeed = await hre.ethers.getContractFactory("PriceFeed");
  const priceFeed = await PriceFeed.deploy();

  await priceFeed.waitForDeployment();

  const contractAddress = await priceFeed.getAddress();
  console.log("PriceFeed deployed to:", contractAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 