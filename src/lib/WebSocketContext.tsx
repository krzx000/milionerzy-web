// WebSocketContext.tsx
import { createContext, useContext, useEffect, useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { QuestionType } from "./lib";

// Typy dla kontekstu
interface WebSocketContextType {
  questions: QuestionType[];
  sendMessage: (message: string) => void;
  readyState: ReadyState;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { sendMessage, lastMessage, readyState } = useWebSocket("ws://localhost:8080/", {
    protocols: "echo-protocol",
    shouldReconnect: () => true, // automatyczne ponowne łączenie
  });
  const [questions, setQuestions] = useState<QuestionType[]>([]);

  useEffect(() => {
    sendMessage(JSON.stringify({ type: "getQuestions" }));
  }, [sendMessage]);

  useEffect(() => {
    if (lastMessage) {
      const data = JSON.parse(lastMessage.data);
      if (data.type === "questions") {
        setQuestions(data.data);
      }
    }
  }, [lastMessage]);

  return (
    <WebSocketContext.Provider value={{ questions, sendMessage, readyState }}>
      {children}
    </WebSocketContext.Provider>
  );
};

// Hook dla wygody
export const useWebSocketContext = () => {
  const context = useContext(WebSocketContext);
  if (context === undefined) {
    throw new Error("useWebSocketContext must be used within a WebSocketProvider");
  }
  return context;
};
