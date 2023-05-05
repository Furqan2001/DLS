const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DLS Contract", function () {
  let dlsContract, deployer, user1, user2, user3;

  before(async () => {
    [deployer, user1, user2, user3] = await ethers.getSigners();

    const DLS = await ethers.getContractFactory("DLS");
    dlsContract = await DLS.deploy();
    await dlsContract.deployed();
  });

  describe("User Functions", function () {
    it("should not register a user that already exists", async function () {
      await expect(dlsContract.registerNewUser()).to.be.revertedWith(
        "User already exists!"
      );
    });

    it("should not add a new moderator if user does not exist", async function () {
      await expect(
        dlsContract.addNewModerator(user3.address)
      ).to.be.revertedWith("User does not exist!");
    });

    it("should not add a new admin if user does not exist", async function () {
      await expect(dlsContract.addNewAdmin(user3.address)).to.be.revertedWith(
        "User does not exist!"
      );
    });
  });
});
