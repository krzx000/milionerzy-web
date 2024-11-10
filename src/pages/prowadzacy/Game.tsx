import { useEffect, useState } from "react";
import { useWebSocketContext } from "../../contexts/WebSocketContext";
import { get, post } from "../../utils/utils";
import { Link } from "react-router-dom";

export const Game: React.FC = () => {
  const {
    gameStarted,
    currentQuestionIndex,
    showCorrectAnswer,
    currentQuestion,
    reward,
    rewards,
    lost,
    won,
    selectedAnswer,
    showLadder,
  } = useWebSocketContext();

  const [localSelectedAnswer, setLocalSelectedAnswer] = useState<"A" | "B" | "C" | "D" | null>(
    selectedAnswer
  );

  useEffect(() => {
    get("/status");
    setLocalSelectedAnswer(selectedAnswer);
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
        <Link to={"/host"}>
          <button className="bg-blue-500 p-4 px-8"> Powrót</button>
        </Link>
      </div>
    );
  }

  const getButtonLabel = () => {
    if (showCorrectAnswer && currentQuestion?.correctAnswer != localSelectedAnswer) return "Przegrana";
    if (showCorrectAnswer) return "Przechodzenie do kolejnego pytania...";
    if (selectedAnswer) return "Oczekiwanie na poprawną odpowiedź...";
    if (localSelectedAnswer) return "Zatwierdź odpowiedź";
    if (!localSelectedAnswer) return "Najpierw zaznacz odpowiedź";
  };

  const getButtonColors = () => {
    if (showCorrectAnswer && currentQuestion?.correctAnswer != localSelectedAnswer)
      return "bg-red-400 text-white";
    if (showCorrectAnswer) return "bg-green-400 text-white";
    if (selectedAnswer) return "bg-yellow-600 text-white";
    if (localSelectedAnswer) return "bg-green-400 text-white";
    if (!localSelectedAnswer) return "bg-gray-300 text-black";
  };

  const handleEndGame = () => {
    post("/end-game");
  };

  return (
    <div className="w-[100vw] h-[100vh] flex flex-col py-16 items-center justify-center">
      <div>
        <p className="text-white text-4xl font-bold text-center">Pytanie nr: {currentQuestionIndex}</p>
        <p className="text-white text-3xl font-bold text-center">
          Pytanie za: {rewards[(currentQuestionIndex ?? 1) - 1]} zł
        </p>
      </div>

      <div>
        {showLadder && (
          <div className="font-bold text-3xl text-white">
            AKTUALNIE POKAZYWANA JEST DRABINKA. <br />
            PROSZĘ CZEKAĆ
          </div>
        )}

        {!showLadder && (
          <>
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
          </>
        )}

        {!lost && !won && (
          <button
            onClick={handleConfirmAnswer}
            className={`w-full px-8 py-4 mt-8 font-bold ${getButtonColors()}`}
            disabled={!localSelectedAnswer || lost || showCorrectAnswer || !!selectedAnswer}
          >
            {getButtonLabel()}
          </button>
        )}

        {won && (
          <div className="text-white text-center w-full h-fit bg-green-400 mt-4 p-4">
            <h1 className="text-4xl font-bold">Wygrana</h1>
            <p className="text-2xl">Wygrana: {reward} ZŁ</p>

            <Link to={"/host"} onClick={handleEndGame}>
              <button className="w-full px-8 py-2 mt-8 font-bold bg-green-600">Zakończ rozgrywkę</button>
            </Link>
          </div>
        )}

        {lost && (
          <div className="text-white text-center w-full h-fit bg-red-400 mt-4 p-4">
            <h1 className="text-4xl font-bold">Przegrana</h1>
            <p className="text-2xl">Wygrana: {0} ZŁ</p>

            <Link to={"/host"} onClick={handleEndGame}>
              <button className="w-full px-8 py-2 mt-8 font-bold bg-red-600">Zakończ rozgrywkę</button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
