import { useEffect } from "react";
import Logo from "../../../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { useWebSocketContext } from "../../../contexts/WebSocketContext";
import TextTransition, { presets } from "react-text-transition";

export const Awaiting: React.FC = () => {
  const navigate = useNavigate();
  const { gameStarted, gameQuestionsLength, won, lost } = useWebSocketContext();

  useEffect(() => {
    document.title = "Gracz - Oczekiwanie";
  }, []);

  useEffect(() => {
    if (lost || won) {
      navigate("/player/end-game");
    }
  }, [lost, won]);

  useEffect(() => {
    if (gameStarted && gameQuestionsLength > 0) {
      setTimeout(() => {
        navigate("/player/question/1");
      }, 5000);
    }
  }, [gameStarted, gameQuestionsLength]);

  return (
    <div className="w-100[vw] h-[100vh] flex flex-col items-center justify-between py-48">
      <img
        src={Logo}
        className={`w-1/5 transition-transform duration-[2s] ${gameStarted ? "scale-150" : ""}`}
      />

      <div
        className={`text-center text-4xl font-bold text-white animate-text-glowing transition-opacity duration-250 `}
      >
        {gameStarted ? "Przechodzenie do gry..." : " Oczekiwanie na rozpoczęcie rozgrywki"}
      </div>
    </div>
  );
};
