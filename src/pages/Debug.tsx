import { useWebSocketContext } from "../contexts/WebSocketContext";

export const Debug = () => {
  const {
    allQuestionsLength,
    currentQuestion,
    currentQuestionIndex,
    gameQuestionsLength,
    gameStarted,
    lifelinesUsed,
    lost,
    won,
    reward,
    selectedAnswer,
    showCorrectAnswer,
    rewards,
  } = useWebSocketContext();
  return (
    <div className="text-white text-center text-xl">
      <h1 className="font-bold text-4xl">Debug</h1>
      <p>allQuestionsLength: {allQuestionsLength.toString()}</p>
      <p>currentQuestion: {JSON.stringify(currentQuestion)}</p>
      <p>currentQuestionIndex: {currentQuestionIndex ? currentQuestionIndex : 0}</p>
      <p>gameQuestionsLength: {gameQuestionsLength ? gameQuestionsLength : 0}</p>
      <p>gameStarted: {gameStarted.toString()}</p>
      <p>won: {won.toString()}</p>
      <p>lifelinesUsed: {JSON.stringify(lifelinesUsed)}</p>
      <p>lost: {lost.toString()}</p>
      <p>reward: {reward ? reward : 0}</p>
      <p>selectedAnswer: {selectedAnswer ? selectedAnswer : "NIE MA"}</p>
      <p>showCorrectAnswer: {showCorrectAnswer.toString()}</p>
      <p>rewards: {JSON.stringify(rewards)}</p>
    </div>
  );
};
