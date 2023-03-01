const hre = require("hardhat");

async function main() {
  // hardhat ethers
  const EmitWinnerContract = await hre.ethers.getContractFactory("EmitWinner");
  const contract = await EmitWinnerContract.deploy();

  await contract.deployed();

  console.log(`Contract was deployed to:, ${contract.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
