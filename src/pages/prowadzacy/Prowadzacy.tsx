import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useWebSocketContext } from "../../contexts/WebSocketContext";
import { get, post } from "../../utils/utils";

export const Prowadzacy: React.FC = () => {
  const navigate = useNavigate();
  const { gameStarted, gameQuestionsLength, allQuestionsLength } = useWebSocketContext();

  useEffect(() => {
    get("/status");
    document.title = "Prowadzący - Rozpoczęcie";
  }, []);

  const startGame = () => {
    if (!allQuestionsLength || !gameQuestionsLength) {
      alert("Nie można rozpocząć gry, ponieważ nie ma pytań w puli.");
      return;
    }

    post("/start");

    navigate("/host/game");
  };

  return (
    <div className="w-[100vw] h-[100vh] flex flex-col justify-center items-center">
      <h1 className="text-white text-2xl">Liczba pytań w puli: {allQuestionsLength ?? "brak"}</h1>
      <h1 className="text-white text-2xl font-bold">Liczba pytań w grze: {gameQuestionsLength ?? "brak"}</h1>

      {/* <Link onClick={startGame} to={"/host/game"}> */}
      <button onClick={startGame} className="bg-green-500 py-4 px-8">
        {gameStarted ? "Przejdź do gry" : "Rozpocznij grę"}
      </button>
      {/* </Link> */}
    </div>
  );
};
