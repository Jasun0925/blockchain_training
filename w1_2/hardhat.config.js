require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-etherscan");
require("dotenv").config();

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
  networks:{
    ganache: {
      url: `http://127.0.0.1:8545`,
      accounts: [
        process.env.GANACHE_PIVATE_KEY_OWNER1,// 测试账号私钥1
        process.env.GANACHE_PIVATE_KEY_OWNER2,
      ],
      chainId: 1337,
      gas: 2100000,
      gasPrice: 25000000000
    },
    avalanche: {
      url: "https://api.avax-test.network/ext/bc/C/rpc",
      chainId: 43113,
      accounts: [
        process.env.AVALANCHE_PIVATE_KEY_OWNER1,
        process.env.AVALANCHE_PIVATE_KEY_OWNER2,
      ],
      gas: "auto"
    },
    etherscan: {
      apiKey: `process.env.SNOWTRACE_API_KEY`
    }
  }
};
