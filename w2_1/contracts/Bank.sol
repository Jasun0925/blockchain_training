// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "./SafeMath.sol";

contract Bank {
    using SafeMath for uint256;

    // 用户余额： key-用户地址， value-用户余额
    mapping(address => uint256) public balances;
    address public owner;

    event transfer(address indexed from, address indexed to, uint256 amount);

    constructor() {
        owner = msg.sender;
    }

    receive() external payable {
        balances[msg.sender] = balances[msg.sender].add(msg.value);
        emit transfer(msg.sender, address(this), msg.value);
    }

    function withdraw() public onlyOwner {
        // 获取当前合约eth余额
        uint256 amount = address(this).balance;
        // 方式一：默认转账消耗2300gas
        // payable(msg.sender).transfer(amount);
        // 方式二：安全转账方式
        (bool success, ) = msg.sender.call{value: amount}(new bytes(0));
        require(success, "ETH transfer fail");

        emit transfer(address(this), msg.sender, amount);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "only owner is allowed");
        _;
    }
}
