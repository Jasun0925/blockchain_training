// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  const [owner1] = await hre.ethers.getSigners();
  // 部署JasunNFT合约
  const NFT = await hre.ethers.getContractFactory("JasunNFT", options = {from: owner1, log: true});
  const nft = await NFT.deploy("JasunNFT", "JNFT");// 默认构造方法

  await nft.deployed();
  console.log("JasunNFT deployed to:", nft.address);

  const mintResult = await nft.safeMint(owner1.address, "ipfs://QmQzmCpCwXQvCg3umG1WNw8jQzFvdTRvsWFYp3PwDr8CZv")
  const result = await mintResult.wait();
  console.log(result)

  // 部署Teacher合约
  // const Teacher = await hre.ethers.getContractFactory("Teacher", options = {from: owner1, log: true});
  // const teacher = await Teacher.deploy(score.address);// 默认构造方法

  // await teacher.deployed();
  // console.log("Teacher deployed to:", teacher.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
