//import appointmentsData from "../assets/appointments.json";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import quizzesData from "../assets/quizzes.json";
import schedulesData from "../assets/schedules.json";
import api from "../api";

export interface QuizzesStudent {
  quizId: number;
  quizName: string;
  description: string;
  numberOfQuestions: number;
  creationDate: string;
}

interface Schedules {
  id: number;
  subject: string;
  datetime: string;
  selected: boolean;
}

const QuizzesStudent = () => {
  const navigate = useNavigate();

  const [quizzes, setQuizzes] = useState<QuizzesStudent[]>([]);
  const [schedules, setSchedules] = useState<Schedules[]>([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const dataRes = await api.get("/api/instructor/quizzes");
        setQuizzes(dataRes.data);
      } catch (error) {
        console.error("Greška pri dohvaćanju korisničkih podataka:", error);
      }
    };
    setQuizzes(quizzesData);
    fetchAppointments();
  }, []);

  const handleDelete = async (id: number) => {
    const proceed = window.confirm(
      "Brisanje termina je trajno. Želite li nastaviti?"
    );
    if (proceed) {
      /* try {
        const res = await api.post("/api/instructor/deleteQuiz", {
          quizId: id,
        });
        setQuizzes((prev) => prev.filter((item) => item.quizId !== id));
      } catch (error) {
        console.error("Greška s backendom");
      } */
      setQuizzes((prev) => prev.filter((item) => item.quizId !== id));
    }
  };

  return (
    <div className="flex h-full">
      <div className="w-full p-5 flex flex-col">
        <div className="flex justify-between">
          <h1 className="text-blue-dark text-3xl font-bold">Moji kvizovi</h1>
          <button
            className="bg-[#00506F] text-white text-xl rounded-2xl px-10 py-2 cursor-pointer"
            onClick={() => navigate("/instructor/addQuiz")}
          >
            + Kreiraj kviz
          </button>
        </div>
        <div className="grid grid-cols-2 gap-x-8 gap-y-4 mt-5 overflow-y-scroll px-5">
          {quizzes.map((item) => (
            <div
              key={item.quizId}
              className="flex flex-col justify-between border-2 bg-white border-blue-dark rounded-xl w-full min-h-[250px] shrink-0 p-5"
            >
              <h1 className="text-blue-dark font-bold text-2xl">
                {item.quizName}
              </h1>
              <p className="text-blue-dark text-lg">{item.description}</p>
              <div className="flex">
                <div className="bg-[#567CA2] rounded-xl text-white px-3 mr-6">
                  {item.numberOfQuestions} pitanja
                </div>
                <div className="text-blue-dark/70">{item.creationDate}</div>
              </div>
              <div className="flex gap-x-3 pr-10">
                <button
                  className="border-2 border-[#9A1818] flex justify-center items-center rounded-xl py-1 w-1/2 cursor-pointer"
                  onClick={() => handleDelete(item.quizId)}
                >
                  <img src="/images/trash_icon.png" className="w-8"></img>
                  <p className="text-[#9A1818] ml-2">Izbriši</p>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuizzesStudent;
