import { useEffect } from "react";
import Logo from "../../../assets/logo.png";

export const Awaiting: React.FC = () => {
  useEffect(() => {
    document.title = "Gracz - Oczekiwanie";
  }, []);
  return (
    <div className="w-100[vw] h-[100vh] flex flex-col items-center justify-between py-48">
      <img src={Logo} className="w-1/5" />

      <div className="text-center text-4xl font-bold text-white animate-text-glowing">
        Oczekiwanie na rozpoczęcie rozgrywki
      </div>
    </div>
  );
};
