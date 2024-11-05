import { useEffect, useState } from "react";
import { useWebSocketContext } from "../../contexts/WebSocketContext";
import { get, post } from "../../utils/utils";
import { Navigate, useNavigate } from "react-router-dom";

export const Game: React.FC = () => {
  const {
    gameStarted,
    currentQuestionIndex,
    showCorrectAnswer,
    currentQuestion,
    reward,
    gameQuestionsLength,
  } = useWebSocketContext();

  const navigate = useNavigate();

  useEffect(() => {
    get("/status");
  }, []);
  useEffect(() => {
    document.title = `Prowadzący - Pytanie - ${currentQuestionIndex}`;
  }, [currentQuestionIndex]);
  const [localSelectedAnswer, setLocalSelectedAnswer] = useState<"A" | "B" | "C" | "D" | null>(null);
  useEffect(() => {
    get("/status");
    setLocalSelectedAnswer(null);
  }, [currentQuestionIndex]);

  // if (!gameStarted || !currentQuestion || !currentQuestionIndex || !gameQuestionsLength) {
  //   console.log(!gameStarted, !currentQuestion, !currentQuestionIndex, !gameQuestionsLength);
  //   return <Navigate to={"/host"} />;
  // }

  useEffect(() => {
    console.log(!gameStarted, !currentQuestion);
    if (!gameStarted || !currentQuestion) {
      navigate("/host");
    }
  }, [gameStarted, currentQuestion, currentQuestionIndex, gameQuestionsLength]);

  const handleSelectAnswer = (answer: "A" | "B" | "C" | "D") => {
    // if (showCorrectAnswer) return; // Do not allow selecting answer when correct answer is shown
    setLocalSelectedAnswer(answer);
  };

  const handleConfirmAnswer = () => {
    post(`/select-answer/${localSelectedAnswer}`);
  };

  const getButtonClass = (answer: "A" | "B" | "C" | "D") => {
    if (showCorrectAnswer && currentQuestion?.correctAnswer === answer) {
      return "bg-green-500"; // Green background for correct answer when `showCorrectAnswer` is true
    }
    return localSelectedAnswer === answer ? "bg-yellow-500" : "bg-blue-600"; // Yellow if selected, blue otherwise
  };

  return (
    <div className="w-[100vw] h-[100vh] flex flex-col py-16 items-center justify-center">
      <div>
        <p className="text-white text-4xl font-bold text-center">Pytanie nr: {currentQuestionIndex}</p>
        <p className="text-white text-3xl font-bold text-center">Pytanie za: {reward}</p>
      </div>

      <div>
        <p className="py-4 font-bold text-3xl text-white">{currentQuestion?.question}</p>
        <div className="flex flex-col gap-2">
          <button
            className={`${getButtonClass("A")} px-8 py-4 w-full min-w-fit text-xl text-left text-white`}
            onClick={() => handleSelectAnswer("A")}
          >
            A: {currentQuestion?.answers.A}
          </button>
          <button
            className={`${getButtonClass("B")} px-8 py-4 w-full min-w-fit text-xl text-left text-white`}
            onClick={() => handleSelectAnswer("B")}
          >
            B: {currentQuestion?.answers.B}
          </button>
          <button
            className={`${getButtonClass("C")} px-8 py-4 w-full min-w-fit text-xl text-left text-white`}
            onClick={() => handleSelectAnswer("C")}
          >
            C: {currentQuestion?.answers.C}
          </button>
          <button
            className={`${getButtonClass("D")} px-8 py-4 w-full min-w-fit text-xl text-left text-white`}
            onClick={() => handleSelectAnswer("D")}
          >
            D: {currentQuestion?.answers.D}
          </button>
        </div>
        <button
          onClick={handleConfirmAnswer}
          className={`w-full px-8 py-4 mt-8 font-bold ${
            localSelectedAnswer ? "bg-green-400" : "bg-gray-300"
          }`}
          disabled={!localSelectedAnswer}
        >
          {localSelectedAnswer ? "Zatwierdź odpowiedź" : "Najpierw zaznacz odpowiedź"}
        </button>
      </div>
    </div>
  );
};
