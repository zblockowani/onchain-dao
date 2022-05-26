// SPDX-License-Identifier: MIT
pragma solidity 0.8.8;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Knight is Ownable {
    enum Weapon {
        None,
        Sword,
        Axe,
        Bow
    }

    Weapon public s_weapon;

    function setWeapon(Weapon weapon) public onlyOwner {
        s_weapon = weapon;
    }
}
