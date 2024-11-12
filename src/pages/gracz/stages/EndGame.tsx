import { useEffect } from "react";
import Logo from "../../../assets/logo.png";
import { useNavigate } from "react-router-dom";
import WinBackground from "../../../assets/win-background.png";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import ReactConfetti from "react-confetti";
import { useWebSocketContext } from "../../../hooks/useWebSocketContext";

// Komponent EndGame wyświetlający ekran zakończenia gry (wygrana lub przegrana).
export const EndGame: React.FC = () => {
  const navigate = useNavigate();
  const { reward, gameStarted, won, lost } = useWebSocketContext();

  useEffect(() => {
    // Ustaw tytuł strony przy załadowaniu komponentu
    document.title = "Gracz - Koniec gry";
  }, []);

  useEffect(() => {
    // Jeśli gra się nie rozpoczęła, przekieruj do ekranu oczekiwania
    if (!gameStarted) navigate("/player/awaiting");
  }, [gameStarted, navigate]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full h-[100vh] flex flex-col"
    >
      {won && <ReactConfetti />}
      <div className="w-[100vw] h-[100vh] flex flex-col items-center justify-between py-32 gap-4">
        {/* Logo wyświetlane na ekranie zakończenia gry */}
        <img src={Logo} alt="Logo" className="w-1/6" />

        <div className="relative">
          {/* Tekst wyświetlający kwotę w zależności od wyniku gry (wygrana lub przegrana) */}
          <p
            className={`text-center w-full text-7xl font-black text-white absolute bottom-1/4 translate-y-1/2 ${
              won ? "drop-shadow-[0_0_40px_yellow]" : ""
            }`}
          >
            <CountUp end={lost ? 0 : reward ?? 0} duration={3} separator=" " /> ZŁ
          </p>

          {/* Tło ekranu zakończenia gry */}
          <img className="w-full" src={WinBackground} alt="Win background" />
        </div>
      </div>
    </motion.div>
  );
};
