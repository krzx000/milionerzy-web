import React, { createContext, useState, useEffect, useContext } from "react";
import useWebSocket from "react-use-websocket";
import { get } from "../utils/utils";
import { QuestionType } from "../lib/lib.ts";

interface WebSocketContextProps {
  gameStarted: boolean;
  gameQuestionsLength: number;
  reward: number | null;
  lost: boolean;
  allQuestionsLength: number;
  showCorrectAnswer: boolean;
  currentQuestion: QuestionType | null;
  currentQuestionIndex: number | null;
  lifelinesUsed: { "50:50": boolean; Audience: boolean; PhoneAFriend: boolean };
  selectedAnswer: "A" | "B" | "C" | "D" | null;
}

const WebSocketContext = createContext<WebSocketContextProps | undefined>(undefined);

export const WebSocketProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [gameQuestionsLength, setGameQuestionsLength] = useState<number>(0);
  const [allQuestionsLength, setAllQuestionsLength] = useState<number>(0);
  const [lost, setLost] = useState<boolean>(false);
  const [reward, setReward] = useState<number | null>(null);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState<boolean>(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<QuestionType | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<"A" | "B" | "C" | "D" | null>(null);
  const [lifelinesUsed, setLifelinesUsed] = useState({
    "50:50": false,
    Audience: false,
    PhoneAFriend: false,
  });

  const { lastMessage } = useWebSocket("ws://localhost:3000/", {
    protocols: "echo-protocol",
  });

  useEffect(() => {
    get("/status");
    get("/current-question");
  }, []);

  useEffect(() => {
    if (lastMessage) {
      try {
        const data = JSON.parse(lastMessage.data);

        if (data.type === "STATUS") {
          setGameStarted(data.gameStarted);
          setSelectedAnswer(data.selectedAnswer);
          setLost(data.lost);
          setLifelinesUsed(data.lifelinesUsed);
          setReward(data.reward);
          setAllQuestionsLength(data.allQuestionsLength);
          setGameQuestionsLength(data.gameQuestionsLength);
        }

        if (data.type === "NEXT_QUESTION") {
          setCurrentQuestionIndex(data.currentQuestionIndex);
          setCurrentQuestion(data.currentQuestion);
          setShowCorrectAnswer(false);
          setSelectedAnswer(null);
        }

        if (data.type === "START") {
          setGameStarted(true);
          setSelectedAnswer(null);
          setLifelinesUsed(data.lifelinesUsed);
          setLost(data.lost);
          setCurrentQuestion(data.currentQuestion);
          setAllQuestionsLength(data.allQuestionsLength);
          setCurrentQuestionIndex(data.currentQuestionIndex);
          setGameQuestionsLength(data.gameQuestionsLength);
        }

        if (data.type === "ANSWER_SELECTED") {
          setSelectedAnswer(data.selectedAnswer);
        }

        if (data.type === "CORRECT_ANSWER") {
          setShowCorrectAnswer(true);
        }

        if (data.type === "CURRENT_QUESTION") {
          setCurrentQuestion(data.currentQuestion);
          setReward(data.reward);
          setCurrentQuestionIndex(data.currentQuestionIndex);
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    }
  }, [lastMessage]);

  return (
    <WebSocketContext.Provider
      value={{
        gameStarted,
        lifelinesUsed,
        reward,
        lost,
        gameQuestionsLength,
        allQuestionsLength,
        showCorrectAnswer,
        currentQuestionIndex,
        currentQuestion,
        selectedAnswer,
      }}
    >
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
