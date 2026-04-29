import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/index";
import Chat from "./pages/chat";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </BrowserRouter>
  );
}
