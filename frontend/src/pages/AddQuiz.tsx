import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import googleLogo from "../assets/logos/google_logo.png";
import api from "../api";

interface Question {
  text: string;
  type: "input" | "multiple-choice";
  difficulty: "easy" | "medium" | "hard";
  options: string[];
  correct: string;
}

const AddQuiz = () => {
  const [questions, setQuestions] = useState<Question[]>([
    {
      text: "",
      type: "input",
      difficulty: "easy",
      options: [],
      correct: "",
    },
  ]);

  /*
  const goBack = () => {
    const formEmpty = Object.values(formData).every((value) => value === "");

    if (!formEmpty) {
      const proceed = window.confirm(
        "Ako se vratite natrag, vaši podaci neće biti spremljeni. Želite li nastaviti?"
      );
      if (proceed) {
        navigate("/instructor/dashboard");
      }
    } else {
      navigate("/instructor/dashboard");
    }
  };

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

  return (
    <div className="h-screen">
      <div className="flex justify-between items-center content-end p-10 bg-green-dark/50 h-1/6 shadow">
        <h1 className="text-blue-dark text-5xl font-bold">STEM tutorstvo</h1>{" "}
      </div>

      <div className=" h-5/6 p-3 bg-white">
        <div className="flex items-center mb-2 cursor-pointer max-w-60">
          <img src="/images/back_button.png" className="mr-2 h-10"></img>
          <div className="text-blue-dark text-2xl font-bold">Kreiraj kviz</div>
        </div>
        <div className="px-20 text-blue-dark">
          <div className="border-2 border-blue-dark rounded-xl bg-[#D5F6E4] p-3">
            <h1 className="text-xl font-bold">Detalji o kvizu</h1>
            <div className=" mx-6">
              <p className="text-lg font-semibold">Ime kviza</p>
              <input
                type="text"
                className="bg-white border-1 border-blue-dark rounded-lg w-full mr-10 px-2"
              ></input>
            </div>
            <div className=" mx-6">
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
            <button className="bg-blue-light rounded-xl text-white text-lg px-10 py-2">
              + Dodaj pitanje
            </button>
          </div>
          <div>
            {questions.map((item, id) => (
              <div
                key={id}
                className="border-2 border-blue-dark rounded-2xl bg-green-light h-60"
              >
                <div className="flex justify-between items-center p-5">
                  <div className="font-bold text-xl">Question 1</div>
                  <img src="/images/trash_icon.png" className="w-8"></img>
                </div>
                <div className="w-full px-12">
                  <input
                    id="questionText"
                    value={item.text}
                    name="text"
                    className="w-full border border-blue-dark rounded-lg bg-white px-2 h-8 placeholder-blue-light/40"
                    placeholder="Unesite tekst pitanja"
                  ></input>
                </div>
                <div></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddQuiz;
