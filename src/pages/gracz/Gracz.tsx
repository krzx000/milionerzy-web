import { useEffect } from "react";
import useWebSocket from "react-use-websocket";
import { Awaiting } from "./stages/Awaiting";
import { useNavigate } from "react-router-dom";

export const Gracz: React.FC = () => {
  const { sendJsonMessage, lastMessage } = useWebSocket("ws://localhost:8080/", {
    protocols: "echo-protocol",
  });
  const navigate = useNavigate();
  useEffect(() => {
    sendJsonMessage({ type: "getGameStarted" });
  }, []);

  if (lastMessage) {
    const data = JSON.parse(lastMessage.data);
    if (data.type === "gameStarted" && data.data === true) {
      navigate("/player/question/0");
    }
    navigate("/player/awaiting");
  }

  return <Awaiting />;
};
