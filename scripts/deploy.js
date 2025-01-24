const hre = require("hardhat");

async function main() {
  console.log("Deploying EventPayment contract...");

  const EventPayment = await hre.ethers.getContractFactory("EventPayment");
  const eventPayment = await EventPayment.deploy();

  await eventPayment.deployed();

  console.log("EventPayment deployed to:", eventPayment.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 