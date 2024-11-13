import { useEffect, useState } from "react";
import { get, post } from "../../utils/utils";
import { Link } from "react-router-dom";
import { useWebSocketContext } from "../../hooks/useWebSocketContext";
import { HINT } from "../../consts";

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
  const [localLifelineSelected, setLocalLifelineSelected] = useState<"F_F" | "VOTING" | "PHONE" | null>(null);
  const [localSelectedAnswer, setLocalSelectedAnswer] = useState<"A" | "B" | "C" | "D" | null>(
    selectedAnswer
  );

  // Pobranie statusu i aktualizacja stanu zaznaczonej odpowiedzi
  useEffect(() => {
    get("/status");
    setLocalSelectedAnswer(selectedAnswer);
  }, [selectedAnswer]);

  // Zaktualizowanie tytułu strony po zmianie pytania
  useEffect(() => {
    document.title = `Prowadzący - Pytanie - ${currentQuestionIndex}`;
  }, [currentQuestionIndex]);

  // Resetowanie zaznaczonej odpowiedzi po zmianie pytania
  useEffect(() => {
    get("/status");
    setLocalSelectedAnswer(null);
  }, [currentQuestionIndex]);

  const handleSelectAnswer = (answer: "A" | "B" | "C" | "D") => {
    if (!currentQuestion || lost || showCorrectAnswer) return;
    setLocalSelectedAnswer(answer);
  };

  const handleConfirmAnswer = () => {
    if (!localSelectedAnswer || lost || showCorrectAnswer) return;
    post(`/select-answer/${localSelectedAnswer}`);
  };

  const getButtonClass = (answer: "A" | "B" | "C" | "D") => {
    if (showCorrectAnswer && currentQuestion?.correctAnswer === answer) {
      return "bg-green-500"; // Zielony przycisk dla poprawnej odpowiedzi
    }
    return localSelectedAnswer === answer ? "bg-yellow-500" : "bg-blue-600"; // Żółty, jeśli wybrano, niebieski w przeciwnym razie
  };

  // Zwracanie ekranu startowego, jeśli brak pytania lub gra nie została rozpoczęta
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

  // Zwracanie etykiety przycisku zależnie od stanu gry
  const getButtonLabel = () => {
    if (showCorrectAnswer && currentQuestion?.correctAnswer !== localSelectedAnswer) return "Przegrana";
    if (showCorrectAnswer) return "Przechodzenie do kolejnego pytania...";
    if (selectedAnswer) return "Oczekiwanie na poprawną odpowiedź...";
    if (localSelectedAnswer) return "Zatwierdź odpowiedź";
    return "Najpierw zaznacz odpowiedź";
  };

  // Zwracanie kolorów przycisku zależnie od stanu gry
  const getButtonColors = () => {
    if (showCorrectAnswer && currentQuestion?.correctAnswer !== localSelectedAnswer)
      return "bg-red-400 text-white";
    if (showCorrectAnswer) return "bg-green-400 text-white";
    if (selectedAnswer) return "bg-yellow-600 text-white";
    if (localSelectedAnswer) return "bg-green-400 text-white";
    return "bg-gray-300 text-black";
  };

  const handleEndGame = () => {
    post("/end-game");
  };

  const handleSelectLifeline = (lifeline?: "F_F" | "VOTING" | "PHONE") => {
    // if (lost || showCorrectAnswer || !!selectedAnswer) return;
    setLocalLifelineSelected(lifeline ?? null);
  };

  return (
    <div className="w-[100vw] h-[100vh] flex  items-center justify-center gap-16">
      <div>
        <p className="text-white text-4xl font-bold text-center">Koła ratunkowe</p>
        <div className="flex gap-4 justify-between">
          <button
            className={`${localLifelineSelected === "F_F" ? "bg-blue-500" : ""}`}
            onClick={() => handleSelectLifeline("F_F")}
          >
            <img src={HINT.F_F} className="w-[8vw]" alt="Hint F F" />
          </button>

          <button
            className={`${localLifelineSelected === "VOTING" ? "bg-blue-500" : ""}`}
            onClick={() => handleSelectLifeline("VOTING")}
          >
            <img src={HINT.VOTING} className="w-[8vw]" alt="Hint Voting" />
          </button>

          <button
            className={`${localLifelineSelected === "PHONE" ? "bg-blue-500" : ""}`}
            onClick={() => handleSelectLifeline("PHONE")}
          >
            <img src={HINT.PHONE} className="w-[8vw]" alt="Hint Phone" />
          </button>
        </div>
        <div>
          <button className="bg-green-500 w-full p-4 font-bold mt-8">Zatwierdź koło</button>

          <button
            onClick={() => handleSelectLifeline()}
            className={`bg-red-500 w-full p-4 mt-2 ${localLifelineSelected ? "" : "invisible"}`}
          >
            Odznacz koło
          </button>
        </div>
      </div>

      <div className="flex flex-col min-w-[50vw] max-w-[90vw]">
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
              <p className="py-4 font-bold text-3xl text-white text-center">{currentQuestion?.question}</p>

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

          {!showLadder && !lost && !won && (
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
    </div>
  );
};
