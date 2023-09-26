const hardhat = require("hardhat");
const fs = require("fs/promises")

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  const Fixit = await hre.ethers.getContractFactory("FixIt");
  const fixitContract = await Fixit.deploy();
  await fixitContract.deployed()
  console.log("FixIt contract deployed to:", fixitContract.address);

  await writeDeploymentInfo("fixit", fixitContract)

  // adding some demo points
  fixitContract.createIssue("test1", "test1", "London", "[51.50, -0.097]", "https://ipfs.io/ipfs/QmfGAymwwkdpyPcMCL5ZfG2agt1bSahmrtyNKDtodAgyrS", 1698684800)
  fixitContract.createIssue("test2", "test2", "Mumbai", "[19.00, 72.84]", "https://ipfs.io/ipfs/QmfGAymwwkdpyPcMCL5ZfG2agt1bSahmrtyNKDtodAgyrS", 1698872000)
  fixitContract.createIssue("test3", "test3", "Paris", "[48.86, 2.34]", "https://ipfs.io/ipfs/QmfGAymwwkdpyPcMCL5ZfG2agt1bSahmrtyNKDtodAgyrS", 1699059200)
  fixitContract.createIssue("test4", "test4", "London", "[51.51, -0.098]", "https://ipfs.io/ipfs/QmfGAymwwkdpyPcMCL5ZfG2agt1bSahmrtyNKDtodAgyrS", 1699246400)
  fixitContract.createIssue("test5", "test5", "Mumbai", "[19.01, 72.85]", "https://ipfs.io/ipfs/QmfGAymwwkdpyPcMCL5ZfG2agt1bSahmrtyNKDtodAgyrS", 1699433600)
  fixitContract.createIssue("test6", "test6", "Paris", "[48.87, 2.35]", "https://ipfs.io/ipfs/QmfGAymwwkdpyPcMCL5ZfG2agt1bSahmrtyNKDtodAgyrS", 1699620800)
  fixitContract.createIssue("test7", "test7", "London", "[51.49, -0.1]", "https://ipfs.io/ipfs/QmfGAymwwkdpyPcMCL5ZfG2agt1bSahmrtyNKDtodAgyrS", 1699808000)
  fixitContract.createIssue("test8", "test8", "Mumbai", "[19.02, 72.83]", "https://ipfs.io/ipfs/QmfGAymwwkdpyPcMCL5ZfG2agt1bSahmrtyNKDtodAgyrS", 1699995200)
  fixitContract.createIssue("test9", "test9", "Singapore", "[1.29, 103.85]", "https://ipfs.io/ipfs/QmfGAymwwkdpyPcMCL5ZfG2agt1bSahmrtyNKDtodAgyrS", 1700182400)
  fixitContract.createIssue("test10", "test10", "Malta", "[35.9, 14.43]", "https://ipfs.io/ipfs/QmfGAymwwkdpyPcMCL5ZfG2agt1bSahmrtyNKDtodAgyrS", 1700369600)

  fixitContract.upVote(3)
  fixitContract.upVote(3)
  fixitContract.upVote(3)

  fixitContract.upVote(5)
  fixitContract.upVote(5)

  fixitContract.upVote(6)

  fixitContract.addComment(8, "Oh wow ! Terrible !", 1662240010)

  fixitContract.markAsResolved(1)
  fixitContract.markAsResolved(3)
  fixitContract.markAsResolved(8)
}

async function writeDeploymentInfo(filename, contract) {
  const data = {
    contract: {
      address: contract.address,
      signerAddress: contract.signer.address,
      abi: contract.interface.format(),
    }
  }

  const content = JSON.stringify(data, null, 2);
  await fs.writeFile(`src/data/${filename}-contract.json`, content, { encoding: "utf-8"})
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
