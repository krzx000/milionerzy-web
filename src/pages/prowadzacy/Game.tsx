import { useEffect, useState } from "react";
import { useWebSocketContext } from "../../contexts/WebSocketContext";
import { get, post } from "../../utils/utils";
import { Link, Navigate } from "react-router-dom";

export const Game: React.FC = () => {
  const {
    gameStarted,
    currentQuestionIndex,
    showCorrectAnswer,
    currentQuestion,
    reward,
    lost,
    selectedAnswer,
  } = useWebSocketContext();
  const [localSelectedAnswer, setLocalSelectedAnswer] = useState<"A" | "B" | "C" | "D" | null>(
    selectedAnswer
  );

  useEffect(() => {
    get("/status");
  }, []);

  useEffect(() => {
    document.title = `Prowadzący - Pytanie - ${currentQuestionIndex}`;
  }, [currentQuestionIndex]);

  useEffect(() => {
    get("/status");
    setLocalSelectedAnswer(null);
  }, [currentQuestionIndex]);

  const handleSelectAnswer = (answer: "A" | "B" | "C" | "D") => {
    if (!currentQuestion) return;
    if (lost) return;
    if (showCorrectAnswer) return;
    setLocalSelectedAnswer(answer);
  };

  const handleConfirmAnswer = () => {
    if (!localSelectedAnswer) return;
    if (lost) return;
    if (showCorrectAnswer) return; // Do not allow confirming answer when correct answer
    post(`/select-answer/${localSelectedAnswer}`);
  };

  const getButtonClass = (answer: "A" | "B" | "C" | "D") => {
    if (showCorrectAnswer && currentQuestion?.correctAnswer === answer) {
      return "bg-green-500"; // Green background for correct answer when `showCorrectAnswer` is true
    }
    return localSelectedAnswer === answer ? "bg-yellow-500" : "bg-blue-600"; // Yellow if selected, blue otherwise
  };

  if (!currentQuestion || !gameStarted) {
    return (
      <div className="text-center text-white">
        <h1>Wróć na stronę główną:</h1>
        <Link to={"/host"} className="bg-blue-500">
          Powrót
        </Link>
      </div>
    );
  }

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
            disabled={lost || showCorrectAnswer || !!selectedAnswer}
          >
            A: {currentQuestion?.answers.A}
          </button>
          <button
            className={`${getButtonClass("B")} px-8 py-4 w-full min-w-fit text-xl text-left text-white`}
            onClick={() => handleSelectAnswer("B")}
            disabled={lost || showCorrectAnswer || !!selectedAnswer}
          >
            B: {currentQuestion?.answers.B}
          </button>
          <button
            className={`${getButtonClass("C")} px-8 py-4 w-full min-w-fit text-xl text-left text-white`}
            onClick={() => handleSelectAnswer("C")}
            disabled={lost || showCorrectAnswer || !!selectedAnswer}
          >
            C: {currentQuestion?.answers.C}
          </button>
          <button
            className={`${getButtonClass("D")} px-8 py-4 w-full min-w-fit text-xl text-left text-white`}
            onClick={() => handleSelectAnswer("D")}
            disabled={lost || showCorrectAnswer || !!selectedAnswer}
          >
            D: {currentQuestion?.answers.D}
          </button>
        </div>
        <button
          onClick={handleConfirmAnswer}
          className={`w-full px-8 py-4 mt-8 font-bold ${
            localSelectedAnswer ? "bg-green-400" : "bg-gray-300"
          }`}
          disabled={!localSelectedAnswer || lost || showCorrectAnswer || !!selectedAnswer}
        >
          {localSelectedAnswer ? "Zatwierdź odpowiedź" : "Najpierw zaznacz odpowiedź"}
        </button>

        {lost && (
          <div className="text-white text-center w-full">
            <h1 className="text-4xl font-bold">Przegrana</h1>
            <Link to={"/host"} className="w-full px-8 py-2 mt-8 font-bold bg-red-400">
              Powrót
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
