import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useWebSocket from "react-use-websocket";
import { useWebSocketContext } from "../../lib/WebSocketContext";

export const Prowadzacy: React.FC = () => {
  const { questions, fetchQuestions, fetchCurrentQuestion } = useWebSocketContext();
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuestions();
    fetchCurrentQuestion();
    document.title = "Prowadzący - Rozpoczęcie";
  }, []);

  const { sendJsonMessage, lastMessage } = useWebSocket("ws://localhost:8080/", {
    protocols: "echo-protocol",
  });

  const startGame = () => {
    sendJsonMessage({ action: "startGame" });
  };

  useEffect(() => {
    if (lastMessage) {
      const data = JSON.parse(lastMessage.data);
      if (data.action === "gameStarted") {
        navigate("/host/game");
      }

      if (data.action === "error" && data.data === "gameAlreadyStarted") {
        alert("Gra już została rozpoczęta. Zostaniesz przekierowany na stronę gry.");
        navigate("/host/game");
      }
    }
  }, [lastMessage]);

  return (
    <div className="w-[100vw] h-[100vh] flex flex-col justify-center items-center">
      <h1 className="text-white text-2xl">Liczba pytań w puli: 200</h1>
      <h1 className="text-white text-2xl font-bold">Liczba pytań w grze: {questions?.length ?? "BRAK"}</h1>
      <button onClick={startGame} className="bg-green-500 py-4 px-8">
        Rozpocznij grę
      </button>
    </div>
  );
};
