import React, { createContext, useState, useEffect } from "react";
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
  lifelinesUsed: { F_F: boolean; VOTING: boolean; PHONE: boolean };
  selectedAnswer: "A" | "B" | "C" | "D" | null;
  won: boolean;
  lifelineResult: string[];
  activeLifeline: "F_F" | "VOTING" | "PHONE" | null;
}

export const WebSocketContext = createContext<WebSocketContextProps | undefined>(undefined);

export const WebSocketProvider: React.FC<React.PropsWithChildren<unknown>> = ({ children }) => {
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
  const [lifelineResult, setLifelineResult] = useState<string[]>(["A", "B", "C", "D"]);
  const [activeLifeline, setActiveLifeline] = useState<"F_F" | "VOTING" | "PHONE" | null>(null);

  const [lifelinesUsed, setLifelinesUsed] = useState({
    F_F: false,
    VOTING: false,
    PHONE: false,
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

        if (data.type === "LIFELINE_USED") {
          setActiveLifeline(data.lifeline);
          console.log("LIFELINE_USED");
        }

        if (data.type === "STATUS") {
          setGameStarted(data.gameStarted);
          setSelectedAnswer(data.selectedAnswer);
          setLost(data.lost);
          setLifelineResult(data.lifelineResult);
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
          setLifelineResult(["A", "B", "C", "D"]);
          setShowCorrectAnswer(false);
          setActiveLifeline(null);
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
          setLifelineResult(["A", "B", "C", "D"]);
          setReward(null);
          setShowCorrectAnswer(false);
          setCurrentQuestionIndex(null);
          setRewards([]);
          setCurrentQuestion(null);
          setActiveLifeline(null);
          setWon(false);
          setLifelinesUsed({
            F_F: false,
            VOTING: false,
            PHONE: false,
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
        lifelineResult,
        lifelinesUsed,

        activeLifeline,
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
