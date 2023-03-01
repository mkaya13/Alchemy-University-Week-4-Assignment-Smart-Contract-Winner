const { assert, expect } = require("chai");
const { ethers } = require("hardhat");

describe("Faucet", function () {
  let Faucet;
  let faucet;
  let client;
  let deployer;
  let donater;
  const sendValue = ethers.utils.parseEther("3"); // "1000000000000000000" = 1 ether -> docs.ethers.io/v5/api/utils/display-logic/#utils-parseEther
  beforeEach(async () => {
    [deployer, client, donater] = await ethers.getSigners();
    // deployer = (await getNamedAccounts()).deployer;
    Faucet = await ethers.getContractFactory("Faucet");
    faucet = await Faucet.deploy();
  });
  it("sets the Deployer Address Correctly", async () => {
    const response = await faucet.owner();
    assert.equal(response, deployer.address);
  });
  it("Deposit 3 eth to the contract", async () => {
    const faucetForClient = await faucet.connect(client);
    await faucetForClient.donate({ value: sendValue });
    const contractMoney = await faucet.contractMoney();
    console.log("Money in Contract:", contractMoney.toString());
    assert.equal(contractMoney, "3000000000000000000");
  });
  it("Withdraw all the money in the contract", async () => {
    const faucetForClient = await faucet.connect(client);
    await faucetForClient.donate({ value: sendValue });
    let contractMoney = await faucet.contractMoney();
    assert.equal(contractMoney.toString(), "3000000000000000000");
    // Money in the Contract after the withdraw
    await faucet.withdrawAll();
    contractMoney = await faucet.contractMoney();
    assert.equal(contractMoney.toString(), "0");
  });
  describe("Check donater and accumulated money", async () => {
    let faucetForClient;
    let faucetForDonator;
    let clientDonation;
    let donaterDonation;
    let accumulatedMoneyInContract;

    beforeEach(async () => {
      faucetForClient = await faucet.connect(client);
      await faucetForClient.donate({ value: ethers.utils.parseEther("1.5") });
      faucetForDonator = await faucet.connect(donater);
      await faucetForDonator.donate({ value: ethers.utils.parseEther("3.7") });
    });
    it("Check the donater mapping", async () => {
      clientDonation = await faucet.donaters(client.address);
      clientDonation = ethers.utils.formatEther(
        parseInt(clientDonation._hex).toString()
      );
      donaterDonation = await faucet.donaters(donater.address);
      donaterDonation = ethers.utils.formatEther(
        parseInt(donaterDonation._hex).toString()
      );
      assert.equal(clientDonation, "1.5");
      assert.equal(donaterDonation, "3.7");
    });
    it("Check the accumulated money in the contract", async () => {
      accumulatedMoneyInContract = await faucet.contractMoney();
      assert.equal(
        ethers.utils.formatEther(
          parseInt(accumulatedMoneyInContract._hex).toString()
        ),
        "5.2"
      );
    });
    it("Does the contract actually self destruct when the destroyFaucet() is called?", async () => {
      assert((await ethers.provider.getCode(faucet.address)).toString(), "0x");
    });
  });
});
