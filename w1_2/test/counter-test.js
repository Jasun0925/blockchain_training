const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Counter", function () {
  describe("合约部署测试", () => {
    it("部署人是否正确测试", async () => {
      const [owner1, owner2] = await ethers.getSigners();

      
      // 配置owner1部署
      const Counter = await ethers.getContractFactory("Counter", {from: owner1, log: true});
      const counter = await Counter.deploy();
      // 验证是否为owner1部署
      expect(await counter.owner()).to.be.equal(owner1.address);
    });
  });

  describe("Count调用者测试", () => {
    it("部署者调用count成功",async () =>{
      const [owner1, owner2] = await ethers.getSigners();
      // 配置owner1部署
      const Counter = await ethers.getContractFactory("Counter", {from: owner1, log: true});
      const counter = await Counter.deploy();

      // 利用owner1调用合约
      await counter.connect(owner1).count();
      const count = await counter.counter();

      expect(count).to.be.eq(1);
    });

    it("其他人调用count失败", async () => {
      const [owner1, owner2] = await ethers.getSigners();
      // 配置owner1部署
      const Counter = await ethers.getContractFactory("Counter", {from: owner1, log: true});
      const counter = await Counter.deploy();
      // 利用owner2调用合约
      await expect(counter.connect(owner2).count()).to.be.revertedWith("Only owner is allowed");
    });
  });
});