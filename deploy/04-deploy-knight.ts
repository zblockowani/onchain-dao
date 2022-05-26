import { ethers } from "hardhat";
import { DeployFunction } from "hardhat-deploy/dist/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const deployKnight: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { deployments, getNamedAccounts } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  const knight = await deploy("Knight", {
    from: deployer,
    args: [],
    log: true,
  });

  log(`Knight was deployed at ${knight.address}`);

  const timeLock = await ethers.getContract("KnightsOfFreedomTimeLock");
  const knightContract = await ethers.getContract("Knight");

  const tx = await knightContract.transferOwnership(timeLock.address);
  await tx.wait(1);

  log("Ownership of Knight contract was transfer to KnightOfFreedomTimeLock");
};

export default deployKnight;
deployKnight.tags = ["all", "knight"];
