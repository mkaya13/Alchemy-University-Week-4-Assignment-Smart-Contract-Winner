const hre = require("hardhat");

const CONTRACT_ADDR = "0x9106057eA7d28C22bE95fF39d41E87D28EBBF80a";
const ORIGINAL_CONTRACT = "0xcF469d3BEB3Fc24cEe979eFf83BE33ed50988502";

async function main() {
  const contract = await hre.ethers.getContractAt("EmitWinner", CONTRACT_ADDR);

  const tx = await contract.emitWinnerEvent(ORIGINAL_CONTRACT);
  await tx.wait();
  console.log("Contract call:", tx);
  // Outcome tx: https://goerli.etherscan.io/tx/0xcfc388e6c6d1e553b950b2e966d41229d8392125f369d10fb2c0eb9ad0e919e6
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
