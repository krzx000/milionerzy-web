import { useEffect } from "react";
import Logo from "../../../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { useWebSocketContext } from "../../../contexts/WebSocketContext";
import { useGlobalAudioPlayer } from "react-use-audio-player";
import { SOUND } from "../../../lib/sound";

export const Awaiting: React.FC = () => {
  const navigate = useNavigate();
  // const { load, fade } = useGlobalAudioPlayer();
  const { gameStarted, gameQuestionsLength } = useWebSocketContext();

  useEffect(() => {
    document.title = "Gracz - Oczekiwanie";
  }, []);

  useEffect(() => {
    if (gameStarted && gameQuestionsLength > 0) {
      // load(SOUND.lightsDown, { autoplay: true });
      // fade(1, 0, 5000);

      setTimeout(() => {
        navigate("/player/question/1");
      }, 5000);
    }
  }, [gameStarted, gameQuestionsLength]);

  return (
    <div className="w-100[vw] h-[100vh] flex flex-col items-center justify-between py-48">
      {/* <button className="absolute left-0 top-0">AKTYWACJA</button> */}
      <img
        src={Logo}
        className={`w-1/5 transition-transform duration-[2s] ${gameStarted ? "scale-150" : ""}`}
      />

      <div
        className={`text-center text-4xl font-bold text-white animate-text-glowing transition-opacity duration-250 ${
          gameStarted ? "opacity-0" : ""
        }`}
      >
        Oczekiwanie na rozpoczęcie rozgrywki
      </div>
    </div>
  );
};
