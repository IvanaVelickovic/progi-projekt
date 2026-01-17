import { useEffect, useRef, useState } from "react";
//import questionData from "../assets/questions.json";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api";

interface Question {
  question_text: string;
  question_type: string;
  options: string[];
  question_difficulty: string;
  correct_answer: string;
}

const SolveQuiz = () => {
  const navigate = useNavigate();

  const currentQuestion = useRef(0); //indeks trenutnog pitanja iz polja
  const questionNum = useRef(0); //broj koliko je ukupno pitanja dosad prošlo
  const numOfQuestions = useRef(0); //ukupan broj pitanja za prikaz, pola od primljenog broja pitanja

  //podaci o korisnikovim odgovorima
  const [answer, setAnswer] = useState("");
  const lastAnswerCorrect = useRef<boolean | null>(null);
  const numOfCorrect = useRef(0);

  //za prikaz
  const [showCorrect, setShowCorrect] = useState(false);
  const [showWrong, setShowWrong] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);

  const [question, setQuestion] = useState<Question | undefined>(undefined);
  const [questions, setQuestions] = useState<Question[]>([]);

  const { quiz_id } = useParams();

  type Difficulty = "easy" | "medium" | "hard";

  //za uzimanje sljedećeg pitanja ovisno o težini
  const questionPools = useRef<Record<Difficulty, number[]>>({
    easy: [],
    medium: [],
    hard: [],
  });
  const indexes = {
    easy: useRef(1),
    medium: useRef(0),
    hard: useRef(0),
  };

  function shuffleArray(array: number[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  useEffect(() => {
    const initQuiz = async () => {
      try {
        const res = await api.get<Question[]>("/student/startQuiz", {
          params: {
            id: quiz_id,
          },
        });
        const fetchedQuestions = res.data;

        //const fetchedQuestions = questionData;
        setQuestions(fetchedQuestions);

        numOfQuestions.current = Math.floor(fetchedQuestions.length / 2);

        questionPools.current.easy = [];
        questionPools.current.medium = [];
        questionPools.current.hard = [];

        fetchedQuestions.forEach((q, index) => {
          if (q.question_difficulty === "easy") {
            questionPools.current.easy.push(index);
          } else if (q.question_difficulty === "medium") {
            questionPools.current.medium.push(index);
          } else {
            questionPools.current.hard.push(index);
          }
        });

        shuffleArray(questionPools.current.easy);
        shuffleArray(questionPools.current.medium);
        shuffleArray(questionPools.current.hard);

        const firstIndex = questionPools.current.easy[0];
        setQuestion(fetchedQuestions[firstIndex]);
      } catch (error) {
        console.error(error);
      }
    };

    initQuiz();
  }, [quiz_id]);

  const goBack = () => {
    const proceed = window.confirm(
      "Ako se vratite natrag, izgubit ćete dosadašnji napredak. Želite li nastaviti?",
    );
    if (proceed) {
      navigate("/student/dashboard");
    }
  };

  const handleSubmit = () => {
    const isCorrect = answer === question?.correct_answer;
    lastAnswerCorrect.current = isCorrect;
    if (isCorrect) {
      numOfCorrect.current++;
      setShowCorrect(true);
    } else {
      setShowWrong(true);
    }
  };

  //ako nekih pitanja iz kategorije fali, odabire se sljedeca kategorija po prioritetu
  const fallback1: Difficulty[] = ["easy", "medium", "hard"];
  const fallback2: Difficulty[] = ["hard", "medium", "easy"];
  const fallback3: Difficulty[] = ["medium", "easy", "hard"];
  const fallback4: Difficulty[] = ["medium", "hard", "easy"];

  function fallbackCheck(fallback: Difficulty[]) {
    let nextDifficulty = "";
    if (
      indexes[fallback[0]].current + 1 <=
      questionPools.current[fallback[0]].length
    ) {
      questionPools.current[fallback[0]].length;
      nextDifficulty = fallback[0];
    } else if (
      indexes[fallback[1]].current + 1 <=
      questionPools.current[fallback[1]].length
    ) {
      nextDifficulty = fallback[1];
    } else {
      nextDifficulty = fallback[2];
    }
    return nextDifficulty;
  }

  function getNextQuestion(currentDifficulty: Difficulty, wasCorrect: boolean) {
    let nextDifficulty = "easy";

    if (
      indexes[currentDifficulty].current <=
      questionPools.current[currentDifficulty].length
    ) {
      if (
        (currentDifficulty === "medium" && !wasCorrect) ||
        (currentDifficulty === "easy" && !wasCorrect)
      )
        nextDifficulty = fallbackCheck(fallback1);
      if (
        (currentDifficulty === "hard" && wasCorrect) ||
        (currentDifficulty === "medium" && wasCorrect)
      )
        nextDifficulty = fallbackCheck(fallback2);
      if (currentDifficulty === "hard" && !wasCorrect)
        nextDifficulty = fallbackCheck(fallback3);
      if (currentDifficulty === "easy" && wasCorrect)
        nextDifficulty = fallbackCheck(fallback4);
    }

    const questionIndex =
      questionPools.current[nextDifficulty as Difficulty][
        indexes[nextDifficulty as Difficulty].current
      ];
    indexes[nextDifficulty as Difficulty].current++;
    return questions.at(questionIndex);
  }

  const handleNextQuestion = () => {
    if (questionNum.current >= numOfQuestions.current - 1) {
      setShowCorrect(false);
      setShowWrong(false);
      setQuizFinished(true);
      return;
    }

    if (!question) {
      return;
    }

    let difficulty = question.question_difficulty as Difficulty;

    if (lastAnswerCorrect.current === null) return;

    const nextQuestion = getNextQuestion(
      difficulty,
      lastAnswerCorrect.current ?? false,
    );

    if (nextQuestion) {
      setQuestion(nextQuestion);
      currentQuestion.current =
        indexes[nextQuestion.question_difficulty as Difficulty].current;

      questionNum.current++;
      setShowCorrect(false);
      setShowWrong(false);
      setAnswer("");
    }
  };

  return (
    <div className="h-screen text-blue-dark bg-white">
      <div className="flex justify-between items-center content-end p-10 bg-green-dark/50 h-[14%] shadow">
        <h1 className="text-blue-dark text-[2.7rem] font-bold">
          STEM tutorstvo
        </h1>
      </div>
      <div className="flex flex-col h-[86%]">
        <div className="flex items-center gap-3 px-8 py-8">
          {!quizFinished && (
            <img
              src="/images/back_button.png"
              className="cursor-pointer"
              onClick={goBack}
            ></img>
          )}
          <h1 className="text-[1.7rem] font-bold">
            Kviz: Matematika poglavlje 1
          </h1>
        </div>

        <div className="px-30 py-1">
          {!quizFinished && (
            <div className="flex justify-between mb-3">
              <h2 className="text-2xl font-semibold">
                Pitanje {questionNum.current + 1}/{numOfQuestions.current}
              </h2>
              {question?.question_difficulty === "easy" && (
                <div className="flex justify-center items-center text-[#1A7435] bg-[#B2F5BE] rounded-2xl px-2.5">
                  easy
                </div>
              )}
              {question?.question_difficulty === "medium" && (
                <div className="flex justify-center items-center text-yellow-700 bg-yellow-200 rounded-2xl px-2.5">
                  medium
                </div>
              )}
              {question?.question_difficulty === "hard" && (
                <div className="flex justify-center items-center text-red-900 bg-red-300 rounded-2xl px-2.5">
                  hard
                </div>
              )}
            </div>
          )}
          {!showCorrect && !showWrong && !quizFinished && (
            <div className="flex flex-col bg-[#D5F6E4] border-2 border-green-600 rounded-xl p-9">
              <div className="text-xl">{question?.question_text}</div>
              <div className="flex flex-col justify-center px-8 py-10 gap-3">
                {question?.question_type === "options" &&
                  question?.options.map((option, id) => (
                    <div
                      key={id.toString()}
                      className="flex items-center border border-blue-dark bg-white rounded-lg gap-2 px-2 h-9 cursor-pointer"
                      onClick={() => setAnswer(option)}
                    >
                      <input
                        type="radio"
                        id={id.toString()}
                        name="correct_answer"
                        value={option}
                        checked={answer === option}
                        className="cursor-pointer"
                        onChange={() => setAnswer(option)}
                      />
                      <label htmlFor="option1" className="cursor-pointer">
                        {option}
                      </label>
                    </div>
                  ))}
                {question?.question_type === "input" && (
                  <input
                    id="input"
                    placeholder="Unesite odogovor"
                    name="input"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    className="border border-blue-dark bg-white rounded-lg w-full px-2 h-9 cursor-pointer"
                  ></input>
                )}
              </div>
              <button
                className="bg-blue-light rounded-xl text-white text-lg mx-8 w-1/5 py-1.5 mb-3 cursor-pointer"
                type="button"
                onClick={handleSubmit}
              >
                Predaj odgovor
              </button>
            </div>
          )}
        </div>
        {showCorrect && (
          <div className="flex flex-col bg-[#D5F6E4] border-2 border-green-600 rounded-xl p-9 mx-30">
            <div className="text-xl mb-2">{question?.question_text}</div>
            <div className="bg-white rounded-xl p-6 border border-green-700">
              <div className="flex items-center gap-3 mb-3">
                <img src="/images/checkmark.png" className="h-8"></img>
                <p className="text-green-700 text-lg">Točan odgovor!</p>
              </div>
              <div className="border border-green-600 rounded-lg mx-6 my-3 px-2 py-1">
                Tvoj odgovor: {answer}
              </div>
            </div>
            <button
              className="bg-blue-light rounded-xl text-white text-lg py-2 w-1/5 self-end mt-4 cursor-pointer"
              onClick={handleNextQuestion}
            >
              Sljedeće pitanje
            </button>
          </div>
        )}
        {showWrong && (
          <div className="flex flex-col bg-[#D5F6E4] border-2 border-green-600 rounded-xl p-9 mx-30">
            <div className="text-xl mb-2">{question?.question_text}</div>
            <div className="bg-white rounded-xl p-6 border border-green-700">
              <div className="flex items-center gap-3 mb-3">
                <img src="/images/wrong.png" className="h-8"></img>
                <p className="text-red-800 text-lg">Netočan odgovor.</p>
              </div>
              <div className="border border-red-800 rounded-lg mx-6 my-3 px-2 py-1">
                Tvoj odgovor: {answer}
              </div>
              <div className="border border-green-600 rounded-lg mx-6 my-3 px-2 py-1">
                Točan odgovor: {question?.correct_answer}
              </div>
            </div>
            <button
              className="bg-blue-light rounded-xl text-white text-lg py-2 w-1/5 self-end mt-4 cursor-pointer"
              onClick={handleNextQuestion}
            >
              Sljedeće pitanje
            </button>
          </div>
        )}
        {quizFinished && (
          <div className="flex flex-col items-center bg-white border-2 border-green-600 rounded-xl p-9 mx-60 gap-6">
            <img src="/images/quiz_completed.png" className="h-25 w-25"></img>
            <h1 className="text-2xl font-bold">Kviz riješen!</h1>
            <div className="flex flex-col items-center bg-green-light rounded-xl p-6 px-28">
              <div className="text-3xl font-bold">
                {Math.round(
                  (numOfCorrect.current / numOfQuestions.current) * 100,
                )}
                %
              </div>
              <div className="text-xl">
                Riješili ste {numOfCorrect.current} od {numOfQuestions.current}{" "}
                pitanja točno
              </div>
            </div>
            <button
              className="bg-blue-light rounded-xl text-white text-lg py-2 px-10 cursor-pointer"
              onClick={() => navigate("/student/dashboard")}
            >
              Povratak na dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SolveQuiz;
