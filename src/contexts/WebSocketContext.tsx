import React, { createContext, useState, useEffect, useContext } from "react";
import useWebSocket from "react-use-websocket";
import { get } from "../utils/utils";
import { QuestionType } from "../lib/lib.ts";

interface WebSocketContextProps {
  gameStarted: boolean;
  gameQuestionsLength: number;
  reward: number | null;
  lost: boolean;
  showLadder: boolean;
  rewards: number[];
  allQuestionsLength: number;
  showCorrectAnswer: boolean;
  currentQuestion: QuestionType | null;
  currentQuestionIndex: number | null;
  lifelinesUsed: { "50:50": boolean; Audience: boolean; PhoneAFriend: boolean };
  selectedAnswer: "A" | "B" | "C" | "D" | null;
  won: boolean;
}

const WebSocketContext = createContext<WebSocketContextProps | undefined>(undefined);

export const WebSocketProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [gameQuestionsLength, setGameQuestionsLength] = useState<number>(0);
  const [allQuestionsLength, setAllQuestionsLength] = useState<number>(0);
  const [lost, setLost] = useState<boolean>(false);
  const [reward, setReward] = useState<number | null>(null);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState<boolean>(false);
  const [showLadder, setShowLadder] = useState<boolean>(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number | null>(null);
  const [rewards, setRewards] = useState<number[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<QuestionType | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<"A" | "B" | "C" | "D" | null>(null);
  const [won, setWon] = useState<boolean>(false);
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
          setRewards(data.rewards);
          setWon(data.won);
          setCurrentQuestion(data.currentQuestion);
          setCurrentQuestionIndex(data.currentQuestionIndex);
          setAllQuestionsLength(data.allQuestionsLength);
          setGameQuestionsLength(data.gameQuestionsLength);
          console.log("STATUS");
        }

        if (data.type === "NEXT_QUESTION") {
          setShowCorrectAnswer(false);
          setSelectedAnswer(null);
          console.log("NEXT_QUESTION");
        }

        if (data.type === "START") {
          setGameStarted(true);
          setSelectedAnswer(null);
          console.log("START");
        }

        if (data.type === "CORRECT_ANSWER") {
          setShowCorrectAnswer(true);
          console.log("CORRECT_ANSWER");
        }

        if (data.type === "ANSWER_SELECTED") {
          setSelectedAnswer(data.selectedAnswer);
          console.log("ANSWER_SELECTED");
        }

        if (data.type === "WRONG_ANSWER") {
          setLost(true);
          console.log("WRONG_ANSWER");
        }

        if (data.type === "SHOW_LADDER") {
          setShowLadder(true);
          console.log("SHOW_LADDER");
        }

        if (data.type === "HIDE_LADDER") {
          setShowLadder(false);
          console.log("HIDE_LADDER");
        }

        if (data.type === "END_GAME") {
          setGameStarted(false);
          setSelectedAnswer(null);
          setLost(false);
          setReward(null);
          setShowCorrectAnswer(false);
          setCurrentQuestionIndex(null);
          setRewards([]);
          setCurrentQuestion(null);
          setWon(false);
          setLifelinesUsed({
            "50:50": false,
            Audience: false,
            PhoneAFriend: false,
          });

          console.log("END_GAME");
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
        showLadder,

        lifelinesUsed,
        rewards,
        won,
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
