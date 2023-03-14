const hre = require("hardhat");

async function main() {
  const [owner1, owner2] = await hre.ethers.getSigners();

  options = {
    from: owner1,
    log: true
  }
  const Counter = await hre.ethers.getContractFactory("Counter", options);
  const counter = await Counter.deploy();// 默认构造方法

  await counter.deployed();

  console.log("Counter deployed to:", counter.address);
}

  // If this is run as a script, then call main. If it's imported (for tests), this block will not run
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })