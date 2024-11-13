import { useEffect } from "react";
import Logo from "../../../assets/logomilionerzy.png";
import { useNavigate } from "react-router-dom";
import { useWebSocketContext } from "../../../hooks/useWebSocketContext";
import { motion } from "framer-motion";

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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className={`w-[100vw] h-[100vh] flex flex-col items-center justify-center py-4 transition-all duration-[2s] ${
        gameStarted ? "bg-black/80 backdrop-blur-[4px]" : "bg-black/90 backdrop-blur-[8px]"
      }`}
    >
      {/* Logo z animacją powiększania, jeśli gra została rozpoczęta */}
      <img
        src={Logo}
        alt="Logo"
        className={`w-1/3 transition-transform duration-[2s] ${gameStarted ? "scale-150" : ""}`}
      />
    </motion.div>
  );
};
