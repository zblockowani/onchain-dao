import { ethers } from "hardhat";

const checkWeapon = async() => {
    const knight = await ethers.getContract("Knight");

    // 0 = None, 1 = Swoard, 2 = Axe, 3 = Bow
    console.log(`Knight's weapon is: ${await knight.s_weapon()}`);
}

checkWeapon()
  .then(() => process.exit(0))
  .catch((e) => {
    console.log(e);
    process.exit(1);
  });
