export type QuestionType = {
  id: number;
  question: string;
  answers: { A: string; B: string; C: string; D: string };
  correctAnswer: "A" | "B" | "C" | "D";
};
