import { ethers, network } from "hardhat";
import {
  developmentChains,
  FUNC,
  FUNC_ARGS,
  MIN_DELAY,
  PROPOSAL_DESC,
} from "../helper-hardhat-config";
import { moveBlocks } from "../utils/move_blocks";
import { moveTime } from "../utils/move_time";

const queueAndExecute = async (
  functionCall: string,
  args: number[],
  proposalDescription: string
) => {
  const governor = await ethers.getContract("KnightsOfFreedomGovernor");
  const knight = await ethers.getContract("Knight");
  const encodedFunctionCall = knight.interface.encodeFunctionData(
    functionCall,
    args
  );
  const descriptionHash = ethers.utils.keccak256(
    ethers.utils.toUtf8Bytes(proposalDescription)
  );

  console.log("Proposal queuing...");
  const queueTx = await governor.queue(
    [knight.address],
    [0],
    [encodedFunctionCall],
    descriptionHash
  );
  await queueTx.wait(1);
  console.log("Proposal has been queued.");

  if (developmentChains.includes(network.name)) {
    moveTime(MIN_DELAY + 1);
    moveBlocks(1);
  }

  console.log("Proposal is ready to be executed.");

  const executeTx = await governor.execute(
    [knight.address],
    [0],
    [encodedFunctionCall],
    descriptionHash
  );
  await executeTx.wait(1);
  console.log("Proposal has been executed.");
};

queueAndExecute(FUNC, [FUNC_ARGS], PROPOSAL_DESC)
  .then(() => process.exit(0))
  .catch((e) => {
    console.log(e);
    process.exit(1);
  });
