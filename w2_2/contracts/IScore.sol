// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

interface IScore {
    function addScore(address studentAddr, uint8 score) external;

    function updateScore(uint8 score) external;

    function showScore() external view returns(uint8);
}