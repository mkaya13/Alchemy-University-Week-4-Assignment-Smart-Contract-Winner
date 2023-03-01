const hre = require("hardhat");

async function main() {
  // hardhat ethers
  const FaucetContract = await hre.ethers.getContractFactory("Faucet");
  const contract = await FaucetContract.deploy();

  await contract.deployed();

  console.log(`Faucet Contract was deployed to:, ${contract.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
