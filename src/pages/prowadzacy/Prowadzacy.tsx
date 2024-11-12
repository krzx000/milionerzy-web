import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { get, post } from "../../utils/utils";
import { useWebSocketContext } from "../../hooks/useWebSocketContext";

/**
 * Komponent dla strony Prowadzącego, umożliwiający rozpoczęcie gry.
 */
export const Prowadzacy: React.FC = () => {
  const navigate = useNavigate();
  const { gameStarted, gameQuestionsLength, allQuestionsLength } = useWebSocketContext();

  useEffect(() => {
    // Pobieranie statusu serwera przy załadowaniu komponentu
    get("/status");
    document.title = "Prowadzący - Rozpoczęcie";
  }, []);

  /**
   * Funkcja rozpoczynająca grę.
   * Sprawdza, czy są dostępne pytania w puli, a następnie uruchamia grę.
   */
  const startGame = () => {
    if (!allQuestionsLength || !gameQuestionsLength) {
      get("/status"); // Otrzymanie statusu w przypadku braku pytań
      alert("Nie można rozpocząć gry, ponieważ nie ma pytań w puli.");
      return;
    }

    post("/start"); // Rozpoczęcie gry na serwerze
    get("/status"); // Pobranie statusu po uruchomieniu gry
    navigate("/host/game"); // Przejście do strony gry
  };

  return (
    <div className="w-[100vw] h-[100vh] flex flex-col justify-center items-center">
      <h1 className="text-white text-2xl">Liczba pytań w puli: {allQuestionsLength ?? "brak"}</h1>
      <h1 className="text-white text-2xl font-bold">Liczba pytań w grze: {gameQuestionsLength ?? "brak"}</h1>

      <button onClick={startGame} className="bg-green-500 py-4 px-8">
        {gameStarted ? "Przejdź do gry" : "Rozpocznij grę"}
      </button>
    </div>
  );
};
