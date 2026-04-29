import { useState } from "react";
import WalletConnect from "../components/WalletConnect";
import ChatBox from "../components/ChatBox";

export default function Chat() {
  const [signer, setSigner] = useState(null);
  const [wallet, setWallet] = useState("");

  if (!signer) {
    return <WalletConnect setSigner={async (s) => {
      setSigner(s);
      setWallet(await s.getAddress());
    }} />;
  }

  return <ChatBox wallet={wallet} />;
}
