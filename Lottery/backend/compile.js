const path = require("path");
const fs = require("fs");
const solc = require("solc");

const lotteryPath = path.resolve(__dirname, "contracts", "Lottery.sol");
const contractSource = fs.readFileSync(lotteryPath, "utf-8");

const compiledLotteryContract = solc.compile(contractSource, 1).contracts[":Lottery"];

module.exports = compiledLotteryContract;