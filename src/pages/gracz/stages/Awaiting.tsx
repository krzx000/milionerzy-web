import { useEffect } from "react";
import Logo from "../../../assets/logo.png";
import useWebSocket from "react-use-websocket";
import { useNavigate } from "react-router-dom";

export const Awaiting: React.FC = () => {
  useEffect(() => {
    document.title = "Gracz - Oczekiwanie";
  }, []);
  const navigate = useNavigate();

  const { lastMessage } = useWebSocket("ws://localhost:8080/", {
    protocols: "echo-protocol",
  });

  useEffect(() => {
    if (lastMessage) {
      const data = JSON.parse(lastMessage.data);
      if (data.type === "gameStarted") {
        navigate("/player/question/0");
      }
    }
  }, [lastMessage]);

  return (
    <div className="w-100[vw] h-[100vh] flex flex-col items-center justify-between py-48">
      <img src={Logo} className="w-1/5" />

      <div className="text-center text-4xl font-bold text-white animate-text-glowing">
        Oczekiwanie na rozpoczęcie rozgrywki
      </div>
    </div>
  );
};
