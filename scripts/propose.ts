import { ethers, network } from "hardhat";
import {
  developmentChains,
  FILE_PATH,
  FUNC,
  FUNC_ARGS,
  PROPOSAL_DESC,
  VOTING_DELAY,
} from "../helper-hardhat-config";
import * as fs from "fs";
import { moveBlocks } from "../utils/move_blocks";
const propose = async (
  functionCall: string,
  args: number[],
  proposalDescription: string
) => {
  const governor = await ethers.getContract("KnightsOfFreedomGovernor");

  const knightContract = await ethers.getContract("Knight");
  const encodedFunctionCall = knightContract.interface.encodeFunctionData(
    functionCall,
    args
  );

  const proposeTx = await governor.propose(
    [knightContract.address],
    [0],
    [encodedFunctionCall],
    proposalDescription
  );

  const proposeTxResponse = await proposeTx.wait(1);

  if (developmentChains.includes(network.name)) {
    moveBlocks(VOTING_DELAY + 1);
  }

  const proposalId = proposeTxResponse.events[0].args.proposalId;
  const proposals = JSON.parse(fs.readFileSync(FILE_PATH, "utf8"));
  proposals[network.config.chainId!.toString()].push(proposalId.toString());
  fs.writeFileSync(FILE_PATH, JSON.stringify(proposals));

  console.log(`Proposal "${PROPOSAL_DESC} is ready for voting`);
};

propose(FUNC, [FUNC_ARGS], PROPOSAL_DESC)
  .then(() => process.exit(0))
  .catch((e) => {
    console.log(e);
    process.exit(1);
  });
