import { Link } from "react-router-dom";

export default function Index() {
  return (
    <>
      <h1>Decentralized Chat App</h1>
      <Link to="/chat">Start Chat</Link>
    </>
  );
}
