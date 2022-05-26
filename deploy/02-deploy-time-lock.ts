import { DeployFunction } from "hardhat-deploy/dist/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { MIN_DELAY } from "../helper-hardhat-config";

const deployTimeLock: DeployFunction = async (
  hre: HardhatRuntimeEnvironment
) => {
  const { deployments, getNamedAccounts } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  const timeLock = await deploy("KnightsOfFreedomTimeLock", {
    from: deployer,
    args: [MIN_DELAY, [], []],
    log: true,
  });

  log(`TimeLock was deployed at ${timeLock.address}`);
};

export default deployTimeLock;
deployTimeLock.tags = ["all", "timeLock"];
