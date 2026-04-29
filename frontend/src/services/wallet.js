import { ethers } from "ethers";

export async function connectWallet() {
  if (!window.ethereum) {
    alert("MetaMask not installed");
    return null;
  }

  // This line MUST trigger MetaMask popup
  const accounts = await window.ethereum.request({
    method: "eth_requestAccounts",
  });

  console.log("Connected account:", accounts[0]);

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();

  return signer;
}
