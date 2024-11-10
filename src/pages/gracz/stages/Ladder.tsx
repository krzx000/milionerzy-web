import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { useWebSocketContext } from "../../../contexts/WebSocketContext";
import { get } from "../../../utils/utils";
import { HINT } from "../../../consts";

export const Ladder = () => {
  const { currentQuestionIndex, gameQuestionsLength, rewards, showLadder } = useWebSocketContext();
  const navigate = useNavigate();
  useEffect(() => {
    get("/status");
  }, []);

  useEffect(() => {
    if (!showLadder) navigate(`/player/question/${currentQuestionIndex}`);
  }, [showLadder]);

  useEffect(() => {
    document.title = `Gracz - Drabinka wyników - ${currentQuestionIndex}`;
  }, [currentQuestionIndex]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full h-[100vh] flex flex-col"
    >
      <div className="mt-16 flex justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex">
            {Object.values(HINT).map((hint, index) => (
              <div key={index} className="flex justify-center">
                <img src={hint} className="w-3/5" alt={`Hint ${index}`} />
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="flex justify-center">
        <table>
          <tbody>
            {Array.from({ length: gameQuestionsLength }, (_, i) => gameQuestionsLength - i).map(
              (questionNumber) => (
                <tr className="text-4xl font-black" key={questionNumber}>
                  <td
                    className={`text-right pl-4 text-[#DD9E00] py-[0.0625rem] ${
                      questionNumber === currentQuestionIndex
                        ? "bg-[#FFC400] rounded-l-xl text-[#011D56]"
                        : ""
                    }`}
                  >
                    {questionNumber}
                  </td>
                  <td className={`px-4 ${questionNumber === currentQuestionIndex ? "bg-[#FFC400]" : ""}`}>
                    {(currentQuestionIndex ?? 0) + 1 > questionNumber ? (
                      <div
                        className={`w-4 h-4 bg-white rotate-45 ${
                          questionNumber === currentQuestionIndex ? "drop-shadow-[0_0_5px_white]" : ""
                        }`}
                      />
                    ) : (
                      <div className="w-4 h-4 rotate-45" />
                    )}
                  </td>
                  <td
                    className={`text-[#DD9E00] pr-4 ${
                      questionNumber === currentQuestionIndex
                        ? "bg-[#FFC400] rounded-r-xl text-[#011D56]"
                        : ""
                    }`}
                  >
                    {rewards[questionNumber - 1]}
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};
