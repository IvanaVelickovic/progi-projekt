import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AddQuestion from "../components/AddQuestion";

interface Question {
  id: number;
  text: string;
  type: "input" | "options";
  difficulty: "easy" | "medium" | "hard";
  options: string[];
  correct: string;
}

const AddQuiz = () => {
  const navigate = useNavigate();
  const [aboutQuiz, setAboutQuiz] = useState({
    quiz_title: "",
    quiz_description: "",
  });
  const [questions, setQuestions] = useState<Question[]>([]);

  const goBack = () => {
    const proceed = window.confirm(
      "Ako se vratite natrag, vaši podaci neće biti spremljeni. Želite li nastaviti?",
    );
    if (proceed) {
      navigate("/instructor/dashboard");
    }
  };

  const handleAboutChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setAboutQuiz((prev) => ({ ...prev, [name]: value }));
    console.log(aboutQuiz);
  };

  return (
    <div className=" bg-white min-h-screen">
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
                name="quiz_title"
                value={aboutQuiz.quiz_title}
                className="bg-white border border-blue-dark rounded-lg w-full mr-10 px-2"
                onChange={handleAboutChange}
                required
              ></input>
            </div>
            <div className=" mx-6 mb-5">
              <p className="text-lg font-semibold">Kratki opis kviza</p>
              <textarea
                name="quiz_description"
                value={aboutQuiz.quiz_description}
                className=" bg-white border border-blue-dark rounded-lg w-full h-20 mr-10 px-2 resize-y"
                onChange={handleAboutChange}
              ></textarea>
            </div>
          </div>
          <AddQuestion
            quiz_title={aboutQuiz.quiz_title}
            quiz_description={aboutQuiz.quiz_description}
            questions={questions}
            setQuestions={setQuestions}
          ></AddQuestion>
        </div>
      </div>
    </div>
  );
};

export default AddQuiz;
