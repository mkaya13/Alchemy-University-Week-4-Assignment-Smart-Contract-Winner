const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { assert, expect } = require("chai");

describe("Faucet", function () {
  let faucet;
  let deployer;
  let client;
  async function deployContractAndSetVariables() {
    const Faucet = await ethers.getContractFactory("Faucet");
    faucet = await Faucet.deploy();
    [deployer, client] = await ethers.getSigners();
    return { faucet, deployer, client };
  }
  beforeEach(async () => {
    const { faucet, deployer, client } = await loadFixture(
      // The warning is not correct!
      deployContractAndSetVariables
    );
  });

  it("Should deploy and set the owner correctly", async function () {
    assert(deployer.address, await faucet.owner());
  });
  it("Only the contract owner can call withdrawAll function", async function () {
    const faucetClient = await faucet.connect(client);
    await expect(faucetClient.withdrawAll()).to.be.reverted;
  });
});
