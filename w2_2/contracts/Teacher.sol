// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "./IScore.sol";

contract Teacher {
    address public teacherAddr; // 教师地址
    mapping(address => address) public students; // 学生地址=>分数
    address public proxyScoreAddr; // score合约副本，用于创建score合约

    event UpdateStudentScore(
        address indexed score_addr,
        address indexed student_addr,
        uint8 score,
        bool is_created
    );

    constructor(address _proxyScoreAddr) {
        require(address(IScore(_proxyScoreAddr) ) != address(0), "require proxy score");
        teacherAddr = msg.sender;
        proxyScoreAddr = _proxyScoreAddr;
    }

    function addStudentScore(
        address studentAddr,
        uint8 score
    ) external onlyTeacher checkScoreAndStudentAddr(studentAddr, score) returns (address scoreAddr){
        require(students[studentAddr] == address(0), "student score is duplicate");

        // 代理方式生成部署score合约
        scoreAddr = deployMinimal(proxyScoreAddr);
        // 添加学生分数
        IScore(scoreAddr).addScore(studentAddr, score);
        // 添加学生成绩映射
        students[studentAddr] = scoreAddr;

        emit UpdateStudentScore(scoreAddr, studentAddr, score, true);
    }

    function updateStudentScore(
        address studentAddr,
        uint8 score
    ) external onlyTeacher checkScoreAndStudentAddr(studentAddr, score) {
        address score_addr = students[studentAddr];
        require(score_addr != address(0), "student score isn't exists");
        // 更新学生成绩
        IScore(score_addr).updateScore(score);

        emit UpdateStudentScore(score_addr, studentAddr, score, false);
    }

    function getStudentScore(address studentAddr) external view returns(uint8 score){
        require(studentAddr != address(0), "invalid student address");

        address score_addr = students[studentAddr];
        require(score_addr != address(0), "student score isn't exists");

        score = IScore(score_addr).showScore();
    }

    // https://github.com/OpenZeppelin/openzeppelin-sdk/blob/master/packages/lib/contracts/upgradeability/ProxyFactory.sol
    function deployMinimal(address _logic) internal returns (address proxy) {
        bytes20 targetBytes = bytes20(_logic);
        // solhint-disable-next-line no-inline-assembly
        assembly {
            let clone := mload(0x40)
            mstore(
                clone,
                0x3d602d80600a3d3981f3363d3d373d3d3d363d73000000000000000000000000
            )
            mstore(add(clone, 0x14), targetBytes)
            mstore(
                add(clone, 0x28),
                0x5af43d82803e903d91602b57fd5bf30000000000000000000000000000000000
            )
            proxy := create(0, clone, 0x37)
        }
        return proxy;
    }

    modifier checkScoreAndStudentAddr(address studentAddr, uint8 score) {
        require(studentAddr != address(0), "invalid student address");
        require(score <= 100, "score incorrect");
        _;
    }

    modifier onlyTeacher() {
        require(msg.sender == teacherAddr, "only teacher is allowed");
        _;
    }
}