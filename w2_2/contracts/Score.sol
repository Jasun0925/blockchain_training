// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "./IScore.sol";

contract Score is IScore {
    uint8 public score; // 分数
    address public studentAddr; // 学生地址
    address public teacherScAddr; // 教师合约地址

    event AddScore(address indexed studentAddr, uint8 score);
    event UpdateScore(
        address indexed studentAddr,
        uint8 oldScore,
        uint8 newScore
    );

    function addScore(address _studentAddr, uint8 _score) external override {
        require(_studentAddr != address(0), "invalid student address");
        require(_score <= 100, "score incorrect");
        studentAddr = _studentAddr;
        score = _score;

        // 默认为老师添加学生，则此处设置为老师地址
        teacherScAddr = msg.sender;
        emit AddScore(studentAddr, score);
    }

    function updateScore(uint8 _score) external override onlyTeacher {
        require(_score <= 100, "score incorrect");
        uint8 oldScore = score;
        score = _score;
        emit UpdateScore(studentAddr, oldScore, score);
    }

    function showScore() external view override returns(uint8){
        return score;
    }

    modifier onlyTeacher() {
        require(
            msg.sender == teacherScAddr,
            "only teacher smartcontract is allowed modify score"
        );
        _;
    }
}
