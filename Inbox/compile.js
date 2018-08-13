const path = require("path");
const fs = require("fs");
const solc = require("solc");

const inboxPath = path.resolve(__dirname, "contracts", "Inbox.sol");
const contractSource = fs.readFileSync(inboxPath, "utf-8");

// "solc.compile() returns an object which contains a list of contracts which have been compiles"
// the second argument is the number of contracts we want to compile
const compiledInboxContract = solc.compile(contractSource, 1).contracts[":Inbox"];

module.exports = compiledInboxContract;