const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Bank", function () {
  async function deployBank() {
    // Contracts are deployed using the first signer/account by default
    const [owner1, owne2] = await hre.ethers.getSigners();
    const Bank = await hre.ethers.getContractFactory("Bank", options = {from: owner1, log: true});
    const bank = await Bank.deploy();// 默认构造方法

    await bank.deployed();
    console.log("Bank deployed to:", bank.address);
    return { bank, owner1, owne2 };
  }

  describe("bank功能测试", function () {
    it("Deployment", async function () {
      const { bank, owner1, owne2 } = await deployBank();
      // 验证链上部署人为owner1
      expect(await bank.owner()).to.eq(owner1.address);
      // 验证合约余额为0
      expect(await ethers.provider.getBalance(bank.address)).to.eq(0);
    }),
    it("通过Metamask向Bank合约转账ETH", async function () {
      const { bank, owner1, owner2 } = await deployBank();
      // 首先验证余额为0
      expect(await ethers.provider.getBalance(bank.address)).to.eq(0);
      // 模拟Metamask向Bank合约转账ETH
      const transactionHash1 = await owner1.sendTransaction({
        to: bank.address,
        value: ethers.utils.parseEther("1") // 1 ether
      })
      // 首先验证余额为2
      expect(await ethers.provider.getBalance(bank.address)).to.eq(ethers.utils.parseEther("1"));
    }),
    it("在Bank合约记录每个地址转账金额", async function () {
      const { bank, owner1, owner2 } = await deployBank();
      // 利用owner2发送两个ETH
      const transactionHash1 = await owner1.sendTransaction({
        to: bank.address,
        value: ethers.utils.parseEther("1") // 1 ether
      })

      console.log("提现前用户钱包金额为：" + await ethers.provider.getBalance(owner1.address))
      // 验证提现所有金额并且是否有转账事件
      await expect(bank.withdraw())
        .to.emit(bank, "transfer")
        .withArgs(bank.address, owner1.address, ethers.utils.parseEther("1"));
      // 提现后合约余额为0
      expect(await ethers.provider.getBalance(bank.address)).to.eq(0);
      console.log("提现后用户钱包金额为：" + await ethers.provider.getBalance(owner1.address))
    });
  });
});
