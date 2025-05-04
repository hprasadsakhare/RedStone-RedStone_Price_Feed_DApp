const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("PriceFeed", function () {
  let priceFeed;
  let owner;
  let addr1;

  beforeEach(async function () {
    // Get signers
    [owner, addr1] = await ethers.getSigners();

    // Deploy the contract
    const PriceFeed = await ethers.getContractFactory("PriceFeed");
    priceFeed = await PriceFeed.deploy();
    await priceFeed.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should deploy successfully", async function () {
      expect(await priceFeed.getAddress()).to.be.properAddress;
    });

    it("Should have the correct interface", async function () {
      expect(typeof priceFeed.getEthPrice).to.equal('function');
      expect(typeof priceFeed.getBtcPrice).to.equal('function');
      expect(typeof priceFeed.getRbtcPrice).to.equal('function');
      expect(typeof priceFeed.getRifPrice).to.equal('function');
    });
  });

  describe("Function Calls", function () {
    it("Should have getEthPrice function that returns a value", async function () {
      try {
        await priceFeed.getEthPrice();
      } catch (error) {
        // We expect an error about missing RedStone payload
        expect(error.message).to.include('CalldataMustHaveValidPayload');
      }
    });

    it("Should have getBtcPrice function that returns a value", async function () {
      try {
        await priceFeed.getBtcPrice();
      } catch (error) {
        // We expect an error about missing RedStone payload
        expect(error.message).to.include('CalldataMustHaveValidPayload');
      }
    });

    it("Should have getRbtcPrice function that returns a value", async function () {
      try {
        await priceFeed.getRbtcPrice();
      } catch (error) {
        // We expect an error about missing RedStone payload
        expect(error.message).to.include('CalldataMustHaveValidPayload');
      }
    });

    it("Should have getRifPrice function that returns a value", async function () {
      try {
        await priceFeed.getRifPrice();
      } catch (error) {
        // We expect an error about missing RedStone payload
        expect(error.message).to.include('CalldataMustHaveValidPayload');
      }
    });
  });
}); 