//import appointmentsData from "../assets/appointments.json";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import quizzesData from "../assets/quizzes_s.json";
import api from "../api";

export interface QuizzesStudent {
  quiz_id: number;
  quiz_name: string;
  quiz_description: string;
  schedule_datetime: string;
  instructor_id: number;
  instructor_name: string;
}

const QuizzesStudent = () => {
  const navigate = useNavigate();

  const [quizzes, setQuizzes] = useState<QuizzesStudent[]>([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const dataRes = await api.get("/student/quizzes");
        setQuizzes(dataRes.data);
      } catch (error) {
        console.error("Greška pri dohvaćanju korisničkih podataka:", error);
      }
    };
    setQuizzes(quizzesData);
    fetchAppointments();
  }, []);

  return (
    <div className="flex h-full">
      <div className="w-full p-5 flex flex-col">
        <div className="flex justify-between">
          <h1 className="text-blue-dark text-3xl font-bold">Moji kvizovi</h1>
        </div>
        <div className="grid grid-cols-2 gap-x-8 gap-y-4 mt-5 overflow-y-scroll px-5">
          {quizzes.map((item) => (
            <div
              key={item.quiz_id}
              className="flex flex-col justify-between border-2 bg-white border-blue-dark rounded-xl w-full min-h-60 shrink-0 p-5"
            >
              <h1 className="text-blue-dark font-bold text-2xl">
                {item.quiz_name}
              </h1>
              <p className="text-blue-dark text-lg">{item.quiz_description}</p>
              <div className="flex">
                <div className="bg-[#567CA2] rounded-xl text-md text-white px-3 mr-1.5">
                  Instrukcije: {item.schedule_datetime}
                </div>
                <div
                  className="bg-[#567CA2] rounded-xl text-md text-white px-3 cursor-pointer hover:text-gray-200"
                  onClick={() => navigate(`/instructors/${item.instructor_id}`)}
                >
                  Instruktor: {item.instructor_name}
                </div>
              </div>
              <div className="flex pr-10">
                <button
                  className="bg-blue-light text-white flex justify-center items-center rounded-xl py-2 w-5/12 cursor-pointer"
                  onClick={() => navigate(`/solve/quiz/${item.quiz_id}`)}
                >
                  Riješi kviz
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
