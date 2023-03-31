// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "./ITokenRecipient.sol";

contract TokenRecipient is ITokenRecipient {
    event tokenReceivedMade(address indexed recipient, uint256 amount);

    function tokensReceived(address _recipient, uint256 _amount) external override returns (bool) {
        emit tokenReceivedMade(_recipient, _amount);
        return true;
    }
}