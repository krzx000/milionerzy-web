// App.tsx
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Gracz } from "./pages/gracz/Gracz";
import { AnimatePresence } from "framer-motion";
import { Awaiting } from "./pages/gracz/stages/Awaiting";
import { Question } from "./pages/gracz/stages/Question";
import { WebSocketProvider } from "./lib/WebSocketContext";
import { Prowadzacy } from "./pages/prowadzacy/Prowadzacy";
import { Game } from "./pages/prowadzacy/Game";

const router = createBrowserRouter([
  {
    path: "/player",
    element: <Gracz />,
  },

  {
    path: "/player/awaiting",
    element: <Awaiting />,
  },
  {
    path: "/player/question/:id",
    element: <Question />,
  },

  {
    path: "/host",
    element: <Prowadzacy />,
  },
  {
    path: "/host/game",
    element: <Game />,
  },
]);

export const App: React.FC = () => {
  return (
    <AnimatePresence>
      <WebSocketProvider>
        <RouterProvider router={router} />
      </WebSocketProvider>
    </AnimatePresence>
  );
};
