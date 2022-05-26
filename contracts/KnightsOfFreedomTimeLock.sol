// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.8.8;

import "@openzeppelin/contracts/governance/TimelockController.sol";

contract KnightsOfFreedomTimeLock is TimelockController {
    constructor(
        uint256 _minDelay,
        address[] memory _proposers,
        address[] memory _executors
    ) TimelockController(_minDelay, _proposers, _executors) {}
}
