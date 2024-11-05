import { useEffect } from "react";
import { Awaiting } from "./stages/Awaiting";
import { useNavigate } from "react-router-dom";
import { useWebSocketContext } from "../../contexts/WebSocketContext";
import { useGlobalAudioPlayer } from "react-use-audio-player";
import { SOUND } from "../../lib/sound";

export const Gracz: React.FC = () => {
  const navigate = useNavigate();
  const { gameStarted, gameQuestionsLength } = useWebSocketContext();

  useEffect(() => {
    if (gameStarted && gameQuestionsLength > 0) {
      navigate("/player/question/1");
    } else {
      navigate("/player/awaiting");
    }
  }, [gameStarted, gameQuestionsLength]);

  return <Awaiting />;
};
