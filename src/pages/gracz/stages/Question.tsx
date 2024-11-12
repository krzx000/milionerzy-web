import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import QuestionBackground from "../../../assets/question-background.png";
import PrizeBackground from "../../../assets/prize-background.png";
import { ANSWER_BACKGROUND } from "../../../consts";
import { HINT } from "../../../consts";
import { useEffect } from "react";
import { get } from "../../../utils/utils";
import { useGlobalAudioPlayer } from "react-use-audio-player";
import { DURATION, SOUND } from "../../../lib/sound";
import useFitText from "use-fit-text";
import { useWebSocketContext } from "../../../hooks/useWebSocketContext";

type AnswerKey = "A" | "B" | "C" | "D";

export const Question = () => {
  const { load, fade, stop } = useGlobalAudioPlayer();
  const navigate = useNavigate();
  const { fontSize: fontSizeQuestion, ref: refQuestion } = useFitText({ maxFontSize: 500, minFontSize: 100 });
  const { fontSize: fontSizeAnswer, ref: refAnswer } = useFitText({ maxFontSize: 300, minFontSize: 50 });

  const {
    gameStarted,
    currentQuestion,
    currentQuestionIndex,
    gameQuestionsLength,
    selectedAnswer,
    won,
    lost,
    showCorrectAnswer,
    reward,
    showLadder,
  } = useWebSocketContext();

  useEffect(() => {
    get("/status");

    if (currentQuestionIndex != null) {
      load(SOUND.start[currentQuestionIndex - 1], { autoplay: true });
      fade(1, 0, DURATION.start[currentQuestionIndex - 1] * 1000 * 0.95);
    }

    return () => stop();
  }, [currentQuestionIndex, load, fade, stop]);

  useEffect(() => {
    if (currentQuestionIndex) navigate(`/player/question/${currentQuestionIndex}`);
  }, [currentQuestionIndex, navigate]);

  useEffect(() => {
    document.title = `Gracz - Pytanie - ${currentQuestionIndex}`;
  }, [currentQuestionIndex]);

  useEffect(() => {
    if (!showCorrectAnswer || !currentQuestionIndex) return;

    const sound = selectedAnswer === currentQuestion?.correctAnswer ? SOUND.win : SOUND.lose;
    load(sound[currentQuestionIndex - 1], { autoplay: true });
    fade(
      1,
      0,
      DURATION[selectedAnswer === currentQuestion?.correctAnswer ? "win" : "lose"][currentQuestionIndex - 1] *
        1000 *
        0.95
    );

    return () => stop();
  }, [selectedAnswer, currentQuestion, showCorrectAnswer, currentQuestionIndex, load, fade, stop]);

  useEffect(() => {
    if (!gameStarted || !currentQuestion || !currentQuestionIndex || !gameQuestionsLength) {
      navigate(`/player/awaiting`);
    }
  }, [gameStarted, currentQuestion, currentQuestionIndex, gameQuestionsLength, navigate]);

  useEffect(() => {
    if (showLadder) navigate("/player/ladder");
  }, [showLadder, navigate]);

  useEffect(() => {
    if (lost || won) navigate("/player/end-game");
  }, [lost, won, navigate]);

  const getAnswerBackground = (key: "A" | "B" | "C" | "D") => {
    if (showCorrectAnswer && currentQuestion?.correctAnswer === key) {
      return ANSWER_BACKGROUND[key].CORRECT;
    }
    return selectedAnswer === key ? ANSWER_BACKGROUND[key].SELECTED : ANSWER_BACKGROUND[key].NORMAL;
  };

  const getAnswerTextColor = (key: "A" | "B" | "C" | "D") => {
    const background = getAnswerBackground(key);
    return background === ANSWER_BACKGROUND[key].CORRECT || background === ANSWER_BACKGROUND[key].SELECTED
      ? "text-black"
      : "text-white";
  };

  useEffect(() => {
    if (selectedAnswer) {
      load(SOUND.answer, { autoplay: true });
      fade(1, 0, 5000 * 0.95);
    }
  }, [selectedAnswer, load, fade]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full h-[100vh] flex flex-col"
    >
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
            <div
              ref={refAnswer}
              style={{ fontSize: fontSizeAnswer }}
              className="absolute left-[35%] top-1/2 -translate-y-1/2 w-[53%] h-[75%] text-center font-bold text-white "
            >
              {reward}
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
          key={currentQuestion?.question}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="image-styling relative" style={{ backgroundImage: `url(${QuestionBackground})` }}>
            <div
              ref={refQuestion}
              style={{ fontSize: fontSizeQuestion }}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[75%] h-[75%] text-center font-bold text-6xl text-white  flex justify-center items-center"
            >
              {currentQuestion?.question}
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
                key={`${key}-${currentQuestionIndex}`} // Zmiana klucza
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
                    ref={refAnswer}
                    style={{ fontSize: fontSizeAnswer }}
                    className={`absolute ${
                      key === "A" ? "left-[35%]" : "left-[20%]"
                    } top-1/2 -translate-y-1/2 w-[57.5%] font-bold flex justify-start items-center   h-[75%]  ${getAnswerTextColor(
                      key
                    )}`}
                  >
                    {currentQuestion?.answers[key]}
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
                key={`${key}-${currentQuestionIndex}`} // Zmiana klucza
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
                    ref={refAnswer}
                    style={{ fontSize: fontSizeAnswer }}
                    className={`absolute ${
                      key === "C" ? "left-[35%]" : "left-[20%]"
                    } top-1/2 -translate-y-1/2 w-[57.5%] font-bold h-[75%]  flex justify-start items-center  ${getAnswerTextColor(
                      key
                    )}`}
                  >
                    {currentQuestion?.answers[key]}
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
