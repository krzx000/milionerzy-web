import React, { createContext, useState, useEffect, useContext } from "react";
import useWebSocket from "react-use-websocket";

interface Question {
  id: number;
  question: string;
  answers: Record<"A" | "B" | "C" | "D", string>;
  correctAnswer: "A" | "B" | "C" | "D";
}

interface WebSocketContextProps {
  questions: Question[] | null;
  currentQuestion: Question | null;
  fetchQuestions: () => void;
  fetchCurrentQuestion: () => void;
}

const WebSocketContext = createContext<WebSocketContextProps | undefined>(undefined);

export const WebSocketProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [questions, setQuestions] = useState<Question[] | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);

  const { sendJsonMessage, lastMessage } = useWebSocket("ws://localhost:8080/", {
    protocols: "echo-protocol",
  });

  useEffect(() => {
    if (lastMessage) {
      try {
        const data = JSON.parse(lastMessage.data);

        if (data.action === "allQuestions" && Array.isArray(data.data)) {
          setQuestions(data.data);
        }

        if (data.action === "currentQuestion" && data.data?.question) {
          setCurrentQuestion(data.data.question);
          setCurrentQuestionIndex(data.data.index || 0);
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    }
  }, [lastMessage]);

  const fetchQuestions = () => {
    sendJsonMessage({ action: "getAllQuestions" });
  };

  const fetchCurrentQuestion = () => {
    sendJsonMessage({ action: "getCurrentQuestion" });
  };

  return (
    <WebSocketContext.Provider value={{ questions, currentQuestion, fetchQuestions, fetchCurrentQuestion }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocketContext = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebSocketContext must be used within a WebSocketProvider");
  }
  return context;
};
