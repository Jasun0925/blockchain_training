// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "./ITokenRecipient.sol";

contract TokenRecipient is ITokenRecipient {
    bool public transactionStatus = true;

    function setTransactionStatus(bool status) external {
        transactionStatus = status;
    }

    function tokensReceived(address _recipient, uint256 _amount) external override returns (bool) {
        return transactionStatus;
    }
}