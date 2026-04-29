import { connectWallet } from "../services/wallet";

export default function WalletConnect({ setSigner }) {
  const connect = async () => {
    const signer = await connectWallet();
    setSigner(signer);
  };

  return <button onClick={connect}>Connect Wallet</button>;
}
