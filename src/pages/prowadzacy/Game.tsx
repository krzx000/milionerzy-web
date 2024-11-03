import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import useWebSocket from "react-use-websocket";
import { useWebSocketContext } from "../../lib/WebSocketContext";

export const Game: React.FC = () => {
  const { questions, currentQuestion, fetchQuestions, fetchCurrentQuestion } = useWebSocketContext();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCurrentQuestion();
    fetchQuestions();
  }, []);

  useEffect(() => {
    console.log(currentQuestion, questions);
    if (currentQuestion && questions) {
      document.title = `Pytanie ${questions?.indexOf(currentQuestion) + 1}`;
      return;
    }
  }, [questions, currentQuestion]);

  if (!currentQuestion || !questions) return <div>NIE MA</div>;

  // const { sendJsonMessage, lastMessage } = useWebSocket("ws://localhost:8080/", {
  //   protocols: "echo-protocol",
  // });
  // useEffect(() => {
  //   sendJsonMessage({ type: "getGameStarted" });
  // }, []);

  // const navigate = useNavigate();

  // useEffect(() => {
  //   if (lastMessage) {
  //     const data = JSON.parse(lastMessage.data);

  //     // if (data.type === "nextQuestion") {
  //     //   setCurrentQuestionIndex(data.data);
  //     //   setShowCorrectAnswer(false); // Reset correct answer visibility on new question
  //     //   setSelectedAnswer(null); // Reset selected answer on new question
  //     // }

  //     if (data.type === "showCorrectAnswer") {
  //       setShowCorrectAnswer(true);
  //     }
  //   }
  // }, [lastMessage]);

  const [selectedAnswer, setSelectedAnswer] = useState<"A" | "B" | "C" | "D" | null>(null);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);

  const handleSelectAnswer = (answer: "A" | "B" | "C" | "D") => {
    if (showCorrectAnswer) return; // Do not allow selecting answer when correct answer is shown
    setSelectedAnswer(answer);
  };

  const handleConfirmAnswer = () => {
    // sendJsonMessage({ type: "selectAnswer", data: selectedAnswer });
  };

  const getButtonClass = (answer: "A" | "B" | "C" | "D") => {
    if (showCorrectAnswer && currentQuestion.correctAnswer === answer) {
      return "bg-green-500"; // Green background for correct answer when `showCorrectAnswer` is true
    }
    return selectedAnswer === answer ? "bg-yellow-500" : "bg-blue-600"; // Yellow if selected, blue otherwise
  };

  return (
    <div className="w-[100vw] h-[100vh] flex flex-col py-16 items-center justify-center">
      <div>
        <p className="text-white text-4xl font-bold text-center">
          Pytanie nr: {questions?.indexOf(currentQuestion) + 1}
        </p>
        <p className="text-white text-3xl font-bold text-center">Pytanie za: 1 000 000</p>
      </div>

      <div>
        <p className="py-4 font-bold text-3xl text-white">{currentQuestion.question}</p>
        <div className="flex flex-col gap-2">
          <button
            className={`${getButtonClass("A")} px-8 py-4 w-full min-w-fit text-xl text-left text-white`}
            onClick={() => handleSelectAnswer("A")}
          >
            A: {currentQuestion.answers.A}
          </button>
          <button
            className={`${getButtonClass("B")} px-8 py-4 w-full min-w-fit text-xl text-left text-white`}
            onClick={() => handleSelectAnswer("B")}
          >
            B: {currentQuestion.answers.B}
          </button>
          <button
            className={`${getButtonClass("C")} px-8 py-4 w-full min-w-fit text-xl text-left text-white`}
            onClick={() => handleSelectAnswer("C")}
          >
            C: {currentQuestion.answers.C}
          </button>
          <button
            className={`${getButtonClass("D")} px-8 py-4 w-full min-w-fit text-xl text-left text-white`}
            onClick={() => handleSelectAnswer("D")}
          >
            D: {currentQuestion.answers.D}
          </button>
        </div>
        <button
          onClick={handleConfirmAnswer}
          className={`w-full px-8 py-4 mt-8 font-bold ${selectedAnswer ? "bg-green-400" : "bg-gray-300"}`}
          disabled={!selectedAnswer}
        >
          {selectedAnswer ? "Zatwierdź odpowiedź" : "Najpierw zaznacz odpowiedź"}
        </button>
      </div>
    </div>
  );
};
