const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const DLS = await hre.ethers.getContractFactory("DLS");
  const decentralizedLandSecurity = await DLS.deploy();
  await decentralizedLandSecurity.deployed();
  console.log(
    "decentralizedLandSecurity deployed to:",
    decentralizedLandSecurity.address
  );

  fs.writeFileSync(
    path.join(__dirname, "../src/common/constants/", "contractAddress.ts"),
    `
  export const DLSAddress = "${decentralizedLandSecurity.address}"
  `
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
