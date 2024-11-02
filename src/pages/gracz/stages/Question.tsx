import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import QuestionBackground from "../../../assets/question-background.png";
import PrizeBackground from "../../../assets/prize-background.png";
import { ANSWER_BACKGROUND } from "../../../consts";
import { HINT } from "../../../consts";
import { useEffect, useState } from "react";
import { useWebSocketContext } from "../../../lib/WebSocketContext";
import useWebSocket from "react-use-websocket";

// Typy odpowiedzi
type AnswerKey = "A" | "B" | "C" | "D";

export const Question = () => {
  const { id } = useParams<{ id: string }>();
  const { questions } = useWebSocketContext();

  // Call useWebSocket unconditionally
  const { lastMessage, sendJsonMessage } = useWebSocket("ws://localhost:8080/", {
    protocols: "echo-protocol",
  });

  const [selectedAnswer, setSelectedAnswer] = useState<AnswerKey | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (lastMessage) {
      const data = JSON.parse(lastMessage.data);
      if (data.type === "selectAnswer") {
        setSelectedAnswer(data.data as AnswerKey);
      }
    }
  }, [lastMessage]);

  useEffect(() => {
    document.title = `Gracz - Pytanie - ${id}`;
  }, [id]);

  // Sprawdź, czy `questions` jest dostępne i czy zawiera dane dla danego `id`
  if (!questions || questions.length === 0) {
    return <div>Ładowanie danych...</div>;
  }

  const questionIndex = parseInt(id ?? "0", 10);
  const question = questions[questionIndex];

  if (!question) {
    return <div>Pytanie nie istnieje.</div>;
  }

  // Funkcja pomocnicza do uzyskania odpowiedniego tła w zależności od odpowiedzi
  const getAnswerBackground = (key: AnswerKey) => {
    return selectedAnswer === key ? ANSWER_BACKGROUND[key].SELECTED : ANSWER_BACKGROUND[key].NORMAL;
  };

  const setQuestion = (n: number) => {
    const newIndex = questionIndex + n;
    if (newIndex < 0 || newIndex >= questions.length) {
      return;
    }
    navigate(`/player/question/${newIndex}`); // Zmiana na nową stronę
  };

  const selectAnswer = () => {
    setSelectedAnswer("C");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full h-[100vh] flex flex-col"
    >
      <div className="z-100 bg-red-500 absolute left-0 top-0">
        <button onClick={() => setQuestion(-1)}>POPRZEDNIE</button>
        <button onClick={selectAnswer}>SELECT</button>
        <button onClick={() => setQuestion(1)}>NASTĘPNE</button>
      </div>

      <div className="mt-16 flex justify-between">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div
            className="image-styling relative w-1/3"
            style={{ backgroundImage: `url(${PrizeBackground})` }}
          >
            <div className="absolute left-[35%] top-1/2 -translate-y-1/2 w-[53%] text-center font-bold text-4xl text-white">
              1 000 000
            </div>
            <img src={PrizeBackground} className="invisible" alt="Prize" />
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex gap-4">
            <div>
              <img src={HINT.F_F} className="w-3/4" alt="Hint F F" />
            </div>
            <div>
              <img src={HINT.VOTING} className="w-3/4" alt="Hint Voting" />
            </div>
            <div>
              <img src={HINT.PHONE} className="w-3/4" alt="Hint Phone" />
            </div>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-16 flex flex-col gap-16 w-full">
        <motion.div
          key={question.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="image-styling relative" style={{ backgroundImage: `url(${QuestionBackground})` }}>
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[75%] text-center font-bold text-4xl text-white">
              {question.question}
            </div>
            <img src={QuestionBackground} className="invisible" alt="Question Background" />
          </div>
        </motion.div>

        <div className="flex flex-col gap-4">
          {/* Grupa A i B */}
          <div className="flex">
            {(["A", "B"] as AnswerKey[]).map((key) => (
              <motion.div
                className="flex-1"
                key={`${key}-${questionIndex}`} // Zmiana klucza
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5, delay: 0.5 * (key === "A" ? 1 : 2) }}
              >
                <div
                  className="image-styling relative"
                  style={{ backgroundImage: `url(${getAnswerBackground(key)})` }}
                >
                  <div
                    className={`absolute ${
                      key === "A" ? "left-[35%]" : "left-[20%]"
                    } top-1/2 -translate-y-1/2 w-[60%] font-bold text-3xl text-white`}
                  >
                    {question.answers[key]}
                  </div>
                  <img
                    src={getAnswerBackground(key)}
                    className="invisible"
                    alt={`Answer Background ${key}`}
                  />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Grupa C i D */}
          <div className="flex">
            {(["C", "D"] as AnswerKey[]).map((key) => (
              <motion.div
                className="flex-1"
                key={`${key}-${questionIndex}`} // Zmiana klucza
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5, delay: 0.5 * (key === "C" ? 3 : 4) }}
              >
                <div
                  className="image-styling relative"
                  style={{ backgroundImage: `url(${getAnswerBackground(key)})` }}
                >
                  <div
                    className={`absolute ${
                      key === "C" ? "left-[35%]" : "left-[20%]"
                    } top-1/2 -translate-y-1/2 w-[60%] font-bold text-3xl text-white`}
                  >
                    {question.answers[key]}
                  </div>
                  <img
                    src={getAnswerBackground(key)}
                    className="invisible"
                    alt={`Answer Background ${key}`}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
