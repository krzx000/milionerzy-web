import { useEffect } from "react";
import Logo from "../../../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { useWebSocketContext } from "../../../hooks/useWebSocketContext";

// Komponent Awaiting odpowiedzialny za ekran oczekiwania na rozpoczęcie gry.
export const Awaiting: React.FC = () => {
  const navigate = useNavigate();
  const { gameStarted, gameQuestionsLength, won, lost } = useWebSocketContext();

  useEffect(() => {
    // Ustaw tytuł strony przy załadowaniu komponentu
    document.title = "Gracz - Oczekiwanie";
  }, []);

  useEffect(() => {
    // Jeżeli gra zakończona (wygrana lub przegrana), przekieruj do końca gry
    if (lost || won) {
      navigate("/player/end-game");
    }
  }, [lost, won, navigate]);

  useEffect(() => {
    // Po rozpoczęciu gry i dostępnych pytaniach, przejdź do pierwszego pytania po 5 sekundach
    if (gameStarted && gameQuestionsLength > 0) {
      const timer = setTimeout(() => {
        navigate("/player/question/1");
      }, 5000);

      // Zawsze czyść timeout, jeśli komponent się odmontuje lub warunki się zmienią
      return () => clearTimeout(timer);
    }
  }, [gameStarted, gameQuestionsLength, navigate]);

  return (
    <div className="w-[100vw] h-[100vh] flex flex-col items-center justify-between py-48">
      {/* Logo z animacją powiększania, jeśli gra została rozpoczęta */}
      <img
        src={Logo}
        alt="Logo"
        className={`w-1/5 transition-transform duration-[2s] ${gameStarted ? "scale-150" : ""}`}
      />

      {/* Tekst informujący o stanie gry z animacją */}
      <div className="text-center text-4xl font-bold text-white animate-text-glowing transition-opacity duration-250">
        {gameStarted ? "Przechodzenie do gry..." : "Oczekiwanie na rozpoczęcie rozgrywki"}
      </div>
    </div>
  );
};
