import { useEffect } from "react";
import Logo from "../../../assets/logo.png";
import { useNavigate } from "react-router-dom";
import WinBackground from "../../../assets/win-background.png";
import { useWebSocketContext } from "../../../contexts/WebSocketContext";
import { motion } from "framer-motion";
export const Lost: React.FC = () => {
  const navigate = useNavigate();
  const { reward, gameStarted } = useWebSocketContext();

  useEffect(() => {
    document.title = "Gracz - Przegrana";
  }, []);

  useEffect(() => {
    if (!gameStarted) {
      setTimeout(() => {
        navigate("/player/awaiting");
      }, 5 * 1000);
    }
  }, [gameStarted]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full h-[100vh] flex flex-col"
    >
      <div className="w-100[vw] h-[100vh] flex flex-col items-center justify-between py-32 gap-4">
        {/* <button className="absolute left-0 top-0">AKTYWACJA</button> */}
        <img src={Logo} className="w-1/6" />

        <div className="relative">
          <p className=" text-center w-full text-7xl font-black text-white absolute bottom-1/4 translate-y-1/2">
            {new Intl.NumberFormat("fr-FR").format(reward ?? 0)}
          </p>
          <img className="w-full" src={WinBackground} alt="" />
        </div>
      </div>
    </motion.div>
  );
};
