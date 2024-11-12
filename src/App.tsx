import { createBrowserRouter, Link, RouterProvider } from "react-router-dom";
import { Gracz } from "./pages/gracz/Gracz";
import { AnimatePresence } from "framer-motion";
import { Awaiting } from "./pages/gracz/stages/Awaiting";
import { Question } from "./pages/gracz/stages/Question";
import { WebSocketProvider } from "./contexts/WebSocketContext";
import { Prowadzacy } from "./pages/prowadzacy/Prowadzacy";
import { Game } from "./pages/prowadzacy/Game";
import { EndGame } from "./pages/gracz/stages/EndGame";
import { Debug } from "./pages/Debug";
import { Ladder } from "./pages/gracz/stages/Ladder";

/**
 * Konfiguracja routingu aplikacji, definiująca ścieżki do poszczególnych widoków.
 */
const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <div className="flex gap-4 p-8">
        <Link to="/player">
          <button className="bg-blue-500 p-4 rounded-lg">PRZEJDŹ DO GRACZA</button>
        </Link>
        <Link to="/host">
          <button className="bg-green-500 p-4 rounded-lg">PRZEJDŹ DO PROWADZĄCEGO</button>
        </Link>
      </div>
    ),
  },
  { path: "/debug", element: <Debug /> },
  { path: "/player", element: <Gracz /> },
  { path: "/player/awaiting", element: <Awaiting /> },
  { path: "/player/question/:id", element: <Question /> },
  { path: "/host", element: <Prowadzacy /> },
  { path: "/host/game", element: <Game /> },
  { path: "/player/end-game", element: <EndGame /> },
  { path: "/player/ladder", element: <Ladder /> },
]);

/**
 * Komponent główny aplikacji, zawierający kontekst WebSocket oraz routing.
 * @returns JSX.Element - Zwraca strukturę głównej aplikacji.
 */
export const App: React.FC = () => {
  return (
    <AnimatePresence>
      <WebSocketProvider>
        <RouterProvider router={router} />
      </WebSocketProvider>
    </AnimatePresence>
  );
};
