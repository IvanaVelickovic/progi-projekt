import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

interface Question {
  id: number;
  text: string;
  type: "input" | "options";
  difficulty: "easy" | "medium" | "hard";
  options: string[];
  correct: string;
}

interface AddQuestionProps {
  quiz_title: string;
  quiz_description: string;
  questions: Question[];
  setQuestions: React.Dispatch<React.SetStateAction<Question[]>>;
}

const AddQuestion = ({
  quiz_title,
  quiz_description,
  questions,
  setQuestions,
}: AddQuestionProps) => {
  const navigate = useNavigate();
  const [nextId, setNextId] = useState(0);

  const handleChange = (
    id: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    if (name === "type") {
      setQuestions((prev) =>
        prev.map((q) =>
          q.id === id
            ? {
                ...q,
                type: value as "input" | "options",
                options: value === "options" ? ["", ""] : [],
                correct: "",
              }
            : q,
        ),
      );
    } else {
      setQuestions((prevQuestions) =>
        prevQuestions.map((q) =>
          q.id === id
            ? { ...q, [name]: value } // spojimo postojeće i nove vrijednosti
            : q,
        ),
      );
    }
  };

  const deleteQuestion = (id: number) => {
    if (questions.length > 1) {
      setQuestions((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const addOption = (questionId: number) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId ? { ...q, options: [...q.options, ""] } : q,
      ),
    );
  };

  const updateOption = (
    questionId: number,
    optionIndex: number,
    value: string,
  ) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: q.options.map((opt, i) =>
                i === optionIndex ? value : opt,
              ),
            }
          : q,
      ),
    );
  };

  const removeOption = (questionId: number, optionIndex: number) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId && q.options.length > 2
          ? {
              ...q,
              options: q.options.filter((_, i) => i !== optionIndex),
            }
          : q,
      ),
    );
  };

  const setCorrectOption = (questionId: number, value: string) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === questionId ? { ...q, correct: value } : q)),
    );
  };

  const addQuestion = () => {
    console.log(nextId);
    setQuestions((prev) => [
      ...prev,
      {
        id: nextId,
        text: "",
        type: "input",
        difficulty: "easy",
        options: [],
        correct: "",
      },
    ]);
    setNextId(nextId + 1);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(questions);
    try {
      await api.post("/instructor/addQuiz", {
        quiz_title: quiz_title,
        quiz_description: quiz_description,
        questions: questions,
      });
      window.alert("Uspješno dodan kviz!");
      navigate("/instructor/dashboard");
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      <div className="flex justify-between items-center mt-8 mb-6">
        <div>
          <h1 className="font-bold text-xl">
            Banka pitanja ({questions.length})
          </h1>
          <p>
            Za adaptivno preporučivanje, potrebno je definirati veći broj
            pitanja ({">"}10). Sustav će iz tog skupa generirati prilagođeni
            kviz za svakog učenika.
          </p>
        </div>
        <button
          className="bg-blue-light rounded-xl text-white text-lg px-10 py-2 cursor-pointer"
          onClick={addQuestion}
        >
          + Dodaj pitanje
        </button>
      </div>
      <form method="POST" onSubmit={handleSubmit}>
        {questions.map((item, i) => (
          <div
            key={item.id}
            className="border-2 border-blue-dark rounded-2xl bg-green-light mb-4"
          >
            <div className="flex justify-between items-center p-5">
              <div className="font-bold text-xl">Pitanje {i + 1}</div>
              <img
                src="/images/trash_icon.png"
                className="w-8 cursor-pointer"
                onClick={() => deleteQuestion(item.id)}
              ></img>
            </div>
            <div className="w-full px-12">
              <input
                id="questionText"
                value={item.text}
                name="text"
                className="w-full border border-blue-dark rounded-lg bg-white px-2 h-8 placeholder-blue-light/40"
                placeholder="Unesite tekst pitanja"
                onChange={(e) => handleChange(item.id, e)}
                required
              ></input>
            </div>
            <div className=" flex justify-between px-12 mt-2">
              <div className="w-[42%]">
                <label className="font-semibold block">Tip pitanja</label>
                <select
                  name="type"
                  value={item.type}
                  className="border border-gray-400 rounded-md py-0.5 focus:outline-none focus:ring-1 focus:ring-[#1e3a56] bg-white w-4/5"
                  onChange={(e) => handleChange(item.id, e)}
                  required
                >
                  <option value="input">Unos teksta</option>
                  <option value="options">Opcije</option>
                </select>
              </div>
              <div className="w-[42%]">
                <label className="font-semibold block">Težina pitanja</label>
                <select
                  name="difficulty"
                  value={item.difficulty}
                  className="border border-gray-400 rounded-md py-0.5 focus:outline-none focus:ring-1 focus:ring-[#1e3a56] bg-white w-4/5"
                  onChange={(e) => handleChange(item.id, e)}
                  required
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
            </div>

            {item.type === "input" && (
              <div className="px-12 py-3">
                <div className="font-bold">Točan odgovor</div>
                <input
                  value={item.correct}
                  name="correct"
                  className="w-full border border-blue-dark rounded-lg bg-white px-2 h-8 placeholder-blue-light/40 mb-4"
                  placeholder="Unesite točan odgovor"
                  onChange={(e) => handleChange(item.id, e)}
                  required
                ></input>
              </div>
            )}
            {item.type === "options" && (
              <div className="px-12 py-3">
                <div className="flex justify-between items-center">
                  <div className="font-bold mb-2">Opcije</div>
                  <button
                    type="button"
                    className="text-blue-dark font-semibold cursor-pointer"
                    onClick={() => addOption(item.id)}
                  >
                    + Dodaj opciju
                  </button>
                </div>

                {item.options.map((opt, index) => (
                  <div key={index} className="flex items-center mb-2">
                    <input
                      type="radio"
                      name={`correct-${item.id}`}
                      checked={item.correct === opt}
                      onChange={() => setCorrectOption(item.id, opt)}
                      required
                    />

                    <input
                      type="text"
                      value={opt}
                      className="ml-2 flex-1 border border-blue-dark rounded-lg px-2 h-8 bg-white"
                      placeholder={`Opcija ${index + 1}`}
                      onChange={(e) =>
                        updateOption(item.id, index, e.target.value)
                      }
                    />

                    <button
                      type="button"
                      className="ml-2 text-red-600 cursor-pointer font-bold"
                      onClick={() => removeOption(item.id, index)}
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <div>Odaberite opciju kako biste označili točan odgovor</div>
              </div>
            )}
          </div>
        ))}

        <div className="flex justify-end px-2">
          <button
            className="bg-blue-light rounded-xl text-white text-lg px-12 py-3 cursor-pointer"
            type="submit"
          >
            Objavi kviz
          </button>
        </div>
      </form>
    </>
  );
};

export default AddQuestion;
