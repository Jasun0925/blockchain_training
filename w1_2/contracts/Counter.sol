// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "./SafeMath.sol";

contract Counter {
    using SafeMath for uint256;

    uint256 public counter;
    address public owner;

    constructor() {
        owner = msg.sender;
        counter = 0;
    }

    function count() public {
        require(owner == msg.sender, "Only owner is allowed");
        counter = counter.add(1);
    }

    function getCounter() public view returns (uint256) {
        return counter;
    }
}
