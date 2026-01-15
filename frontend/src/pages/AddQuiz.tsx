import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import googleLogo from "../assets/logos/google_logo.png";
import api from "../api";

interface Question {
  id: number;
  text: string;
  type: "input" | "truefalse" | "options";
  difficulty: "easy" | "medium" | "hard";
  options: string[];
  correct: string;
}

const AddQuiz = () => {
  const navigate = useNavigate();
  const nextId = useRef(1);
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: nextId.current++,
      text: "",
      type: "input",
      difficulty: "easy",
      options: [],
      correct: "",
    },
  ]);

  const goBack = () => {
    const proceed = window.confirm(
      "Ako se vratite natrag, vaši podaci neće biti spremljeni. Želite li nastaviti?"
    );
    if (proceed) {
      navigate("/instructor/dashboard");
    }
  };
  /*
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!isFormEmpty) {
        e.preventDefault();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isFormEmpty]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await api.post("/instructor/addSchedule", formData);

      if (res.status === 200 || res.status === 201) {
        window.alert("Termin uspješno dodan!");
        navigate("/instructor/dashboard");
      }
    } catch (err: any) {
      console.error("Greška u komunikaciji s backendom ", err);
      window.alert(
        "Nismo uspjeli dodati vaš termin. Molimo pokušajte ponovno."
      );
    }
  }; */

  const handleChange = (
    id: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setQuestions((prevQuestions) =>
      prevQuestions.map((q) =>
        q.id === id
          ? { ...q, [name]: value } // spojimo postojeće i nove vrijednosti
          : q
      )
    );
  };

  const findItem = (id: number) => {
    const find = questions.find((q) => q.id === id);
    return find;
  };

  const addQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        id: nextId.current++,
        text: "",
        type: "input",
        difficulty: "easy",
        options: [],
        correct: "",
      },
    ]);
    console.log(questions);
  };

  const addOption = (questionId: number) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId ? { ...q, options: [...q.options, ""] } : q
      )
    );
  };

  const updateOption = (
    questionId: number,
    optionIndex: number,
    value: string
  ) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: q.options.map((opt, i) =>
                i === optionIndex ? value : opt
              ),
            }
          : q
      )
    );
  };

  const removeOption = (questionId: number, optionIndex: number) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: q.options.filter((_, i) => i !== optionIndex),
            }
          : q
      )
    );
  };

  const setCorrectOption = (questionId: number, value: string) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === questionId ? { ...q, correct: value } : q))
    );
  };

  return (
    <div className=" bg-white">
      <div className="flex justify-between items-center content-end p-10 bg-green-dark/50 h-[110px] shadow">
        <h1 className="text-blue-dark text-[2.7rem] font-bold">
          STEM tutorstvo
        </h1>
      </div>

      <div className=" p-3 bg-white">
        <div className="flex items-center mb-2 cursor-pointer max-w-60">
          <img
            src="/images/back_button.png"
            className="mr-2 h-10 cursor-pointer"
            onClick={goBack}
          ></img>
          <div className="text-blue-dark text-2xl font-bold">Kreiraj kviz</div>
        </div>
        <div className="px-20 text-blue-dark">
          <div className="border-2 border-blue-dark rounded-xl bg-[#D5F6E4] p-3">
            <h1 className="text-xl font-bold ml-1">Detalji o kvizu</h1>
            <div className=" mx-6">
              <p className="text-lg font-semibold">Ime kviza</p>
              <input
                type="text"
                className="bg-white border border-blue-dark rounded-lg w-full mr-10 px-2"
              ></input>
            </div>
            <div className=" mx-6 mb-5">
              <p className="text-lg font-semibold">Kratki opis kviza</p>
              <input
                type="text"
                className="flex items-start bg-white border border-blue-dark rounded-lg w-full mr-10 h-30 px-2"
              ></input>
            </div>
          </div>
          <div className="flex justify-between items-center mt-8 mb-6">
            <div>
              <h1 className="font-bold text-xl">Banka pitanja (3)</h1>
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
          <div className="">
            {questions.map((item, i) => (
              <div
                key={item.id}
                className="border-2 border-blue-dark rounded-2xl bg-green-light mb-4"
              >
                <div className="flex justify-between items-center p-5">
                  <div className="font-bold text-xl">Pitanje {i + 1}</div>
                  <img src="/images/trash_icon.png" className="w-8"></img>
                </div>
                <div className="w-full px-12">
                  <input
                    id="questionText"
                    value={item.text}
                    name="text"
                    className="w-full border border-blue-dark rounded-lg bg-white px-2 h-8 placeholder-blue-light/40"
                    placeholder="Unesite tekst pitanja"
                    onChange={(e) => handleChange(item.id, e)}
                  ></input>
                </div>
                <div className=" flex justify-between px-12 mt-2">
                  <div className="w-[42%]">
                    <label className="font-semibold block">Tip pitanja</label>
                    <select
                      name="type"
                      value={findItem(nextId.current)?.type}
                      className="border border-gray-400 rounded-md py-0.5 focus:outline-none focus:ring-1 focus:ring-[#1e3a56] bg-white w-4/5"
                      onChange={(e) => handleChange(item.id, e)}
                    >
                      <option value="input">Unos teksta</option>
                      <option value="options">Opcije</option>
                      <option value="truefalse">Točno/Netočno</option>
                    </select>
                  </div>
                  <div className="w-[42%] ">
                    <label className="font-semibold block">
                      Težina pitanja
                    </label>
                    <select
                      name="difficulty"
                      value={findItem(nextId.current)?.difficulty}
                      className="border border-gray-400 rounded-md py-0.5 focus:outline-none focus:ring-1 focus:ring-[#1e3a56] bg-white w-4/5"
                      onChange={(e) => handleChange(nextId.current, e)}
                    >
                      <option value="easy">Lagano</option>
                      <option value="medium">Srednje</option>
                      <option value="hard">Teško</option>
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
                    ></input>
                  </div>
                )}
                {item.type === "truefalse" && (
                  <div className="px-12 py-3 pb-4">
                    <div className="font-bold">Točan odgovor</div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        onChange={() => setCorrectOption(item.id, "true")}
                      />
                      Točno
                      <input
                        type="radio"
                        className="ml-3"
                        onChange={() => setCorrectOption(item.id, "false")}
                      />
                      Netočno
                    </div>
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
                    <div>
                      Odaberite opciju kako biste označili točan odgovor
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-end px-8">
          <button className="bg-blue-light rounded-xl text-white text-lg px-12 py-3 cursor-pointer">
            Objavi kviz
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddQuiz;
