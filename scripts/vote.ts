import * as fs from "fs";
import { ethers, network } from "hardhat";
import {
  developmentChains,
  FILE_PATH,
  VOTING_PERIOD,
} from "../helper-hardhat-config";
import { moveBlocks } from "../utils/move_blocks";

const vote = async (proposalId: string) => {
  const governor = await ethers.getContract("KnightsOfFreedomGovernor");

  console.log(
    `Proposal state before voting is: ${await governor.state(proposalId)}`
  );

  //0 = against, 1 = for, 2 = hold
  const voteType = 1;
  const reason = "Because swoards are the best!";

  console.log("Voting...");

  const voteTx = await governor.castVoteWithReason(
    proposalId,
    voteType,
    reason
  );
  await voteTx.wait(1);

  if (developmentChains.includes(network.name)) {
    moveBlocks(VOTING_PERIOD + 1);
  }
  console.log("Voting is done");
  console.log(
    `Proposal state after voting is: ${await governor.state(proposalId)}`
  );
};

const proposals = JSON.parse(fs.readFileSync(FILE_PATH, "utf8"));
const proposalId = proposals[network.config.chainId!.toString()][0];

vote(proposalId)
  .then(() => process.exit(0))
  .catch((e) => {
    console.log(e);
    process.exit(1);
  });
