const fs = require("fs");
const path = require("path");

const jsonFileData = fs.readFileSync(
  path.join(__dirname, "../", "artifacts/contracts/DLS.sol/", "DLS.json"),
  { encoding: "utf8" }
);

fs.writeFileSync(
  path.join(__dirname, "../src/common/constants/", "DLS.json"),
  jsonFileData,
  "utf-8"
);
