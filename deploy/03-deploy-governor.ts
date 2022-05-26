import { ethers } from "hardhat";
import { DeployFunction } from "hardhat-deploy/dist/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import {
  ADDRESS_ZERO,
  VOTING_DELAY,
  VOTING_PERIOD,
  VOTING_THRESHOLD,
} from "../helper-hardhat-config";

const deployGovernor: DeployFunction = async (
  hre: HardhatRuntimeEnvironment
) => {
  const { deployments, getNamedAccounts } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  const token = await ethers.getContract("KnightsOfFreedomToken");
  const timeLock = await ethers.getContract("KnightsOfFreedomTimeLock");

  const governor = await deploy("KnightsOfFreedomGovernor", {
    from: deployer,
    args: [
      token.address,
      timeLock.address,
      VOTING_DELAY,
      VOTING_PERIOD,
      VOTING_THRESHOLD,
      VOTING_THRESHOLD,
    ],
    log: true,
  });

  log(`Governor was deployed at ${governor.address}`);

  const adminRole = await timeLock.TIMELOCK_ADMIN_ROLE();
  const executorRole = await timeLock.EXECUTOR_ROLE();
  const proposerRole = await timeLock.PROPOSER_ROLE();

  log("Setting up roles...");

  const grantExecutorRoleTx = await timeLock.grantRole(
    executorRole,
    ADDRESS_ZERO
  );
  await grantExecutorRoleTx.wait(1);

  const grantProposerRoleTx = await timeLock.grantRole(
    proposerRole,
    governor.address
  );
  await grantProposerRoleTx.wait(1);

  const revokeAdminTx = await timeLock.revokeRole(adminRole, deployer);
  await revokeAdminTx.wait(1);

  log("Roles are set up");
};

export default deployGovernor;
deployGovernor.tags = ["all", "governor"];
