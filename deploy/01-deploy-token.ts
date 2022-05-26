import { ethers } from "hardhat";
import { DeployFunction } from "hardhat-deploy/dist/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const deployToken: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { deployments, getNamedAccounts } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  const token = await deploy("KnightsOfFreedomToken", {
    from: deployer,
    args: [],
    log: true,
  });

  log(`Token was deployed at ${token.address}`);

  await delegate(token.address, deployer);
};

const delegate = async (
  tokenContractAddress: string,
  delegatedAccount: string
) => {
  const token = await ethers.getContractAt(
    "KnightsOfFreedomToken",
    tokenContractAddress
  );

  console.log(
    `Checkpoint before delegation: ${await token.numCheckpoints(
      delegatedAccount
    )}`
  );

  const tx = await token.delegate(delegatedAccount);
  await tx.wait(1);

  console.log(
    `Checkpoint after delegation: ${await token.numCheckpoints(
      delegatedAccount
    )}`
  );
};

export default deployToken;
deployToken.tags = ["all", "token"];
