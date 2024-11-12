import { useEffect } from "react";
import { Awaiting } from "./stages/Awaiting";
import { useNavigate } from "react-router-dom";
import { useWebSocketContext } from "../../hooks/useWebSocketContext";

// Komponent Gracz odpowiedzialny za obsługę logiki przejścia do odpowiednich ekranów gry.
export const Gracz: React.FC = () => {
  const navigate = useNavigate();
  const { gameStarted, gameQuestionsLength } = useWebSocketContext();

  useEffect(() => {
    // Wykonaj nawigację w zależności od stanu gry
    if (gameStarted && gameQuestionsLength > 0) {
      navigate("/player/question/1"); // Jeśli gra rozpoczęta i są pytania, przejdź do pierwszego pytania
    } else {
      navigate("/player/awaiting"); // Jeśli gra nie jest rozpoczęta lub brak pytań, przejdź do oczekiwania
    }
  }, [gameStarted, gameQuestionsLength, navigate]);

  return <Awaiting />; // Wyświetl ekran oczekiwania
};
