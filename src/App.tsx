// App.tsx
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Gracz } from "./pages/gracz/Gracz";
import { AnimatePresence } from "framer-motion";
import { Awaiting } from "./pages/gracz/stages/Awaiting";
import { Question } from "./pages/gracz/stages/Question";
import { WebSocketProvider } from "./lib/WebSocketContext";
import { Prowadzacy } from "./pages/prowadzacy/Prowadzacy";

const router = createBrowserRouter([
  {
    path: "/player",
    element: <Gracz />,
    children: [
      {
        path: "awaiting",
        element: <Awaiting />,
      },
      {
        path: "question/:id",
        element: <Question />,
        errorElement: <div>NIE MA PYTAŃ</div>,
      },
    ],
  },
  {
    path: "/host",
    element: <Prowadzacy />,
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
