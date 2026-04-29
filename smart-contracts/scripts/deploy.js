const hre = require("hardhat");

async function main() {
  const Chat = await hre.ethers.getContractFactory("Chat");
  const chat = await Chat.deploy();
  await chat.waitForDeployment();

  console.log("Chat deployed to:", await chat.getAddress());
}

main();
