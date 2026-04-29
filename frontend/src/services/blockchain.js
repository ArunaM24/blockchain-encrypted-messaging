import { ethers } from "ethers";
import ChatABI from "../../abi/Chat.json";

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;

export async function getContract(signer) {
  return new ethers.Contract(CONTRACT_ADDRESS, ChatABI.abi, signer);
}

export async function sendMessage(contract, to, encryptedMsg) {
  const tx = await contract.sendMessage(to, encryptedMsg);
  await tx.wait();
}

export async function getMessages(contract, user1, user2) {
  return await contract.getMessages(user1, user2);
}
