// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

interface ITokenRecipient {
    function tokensReceived(address _recipient, uint256 _amount) external returns(bool);
}