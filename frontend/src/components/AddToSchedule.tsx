import api from "../api";
import { useAppointments } from "../context/AppointmentsContext";

interface AddToScheduleProps {
  quizId: number;
  quizName: string;
  setAddToSchedule: React.Dispatch<React.SetStateAction<boolean>>;
  selected: number[];
  setSelected: React.Dispatch<React.SetStateAction<number[]>>;
}

const AddToSchedule = ({
  quizId,
  quizName,
  setAddToSchedule,
  selected,
  setSelected,
}: AddToScheduleProps) => {
  const { appointments } = useAppointments();

  const toggleSelected = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleAddToSchedule = async () => {
    console.log(selected);
    try {
      await api.post("/instructor/addToSchedule", {
        quiz_id: quizId, //id kviza
        schedule_ids: selected, //polje s schedule id-ovima
      });
      window.alert("Uspješno pridodijeljeno!");
    } catch (error) {
      console.error("Greška s backendom");
      window.alert("Neuspjeh - kviz nije pridodijeljen terminima.");
    } finally {
      setAddToSchedule(false);
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30 pointer-events-none"></div>

      <div className="relative bg-white rounded-xl w-1/2 h-3/4 z-10 border-2 border-blue-dark flex flex-col">
        <div className="flex justify-between items-center p-4 rounded-t-2xl">
          <div>
            <h1 className="text-blue-dark text-xl font-bold">
              Dodijeli kviz terminu
            </h1>
            <p className="text-blue-dark">
              Kliknite na kvadratić (checkbox) kod termina kojemu želite
              dodijeliti kviz - {quizName}
            </p>
          </div>
          <button
            className="flex justify-center items-center bg-blue-dark rounded-full text-white px-2 text-2xl cursor-pointer"
            onClick={() => setAddToSchedule(false)}
          >
            X
          </button>
        </div>

        <div className="flex-1 grid grid-cols-1 gap-4 overflow-y-auto p-5">
          {appointments.map((item, id) => (
            <div
              key={item.id}
              className="flex items-center min-h-[90px] shrink-0 bg-green-light border-2 border-blue-dark rounded-2xl px-5 gap-x-3 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selected.includes(item.id)}
                className="h-5 w-5 cursor-pointer"
                onChange={(e) => {
                  e.stopPropagation();
                  toggleSelected(item.id);
                }}
              ></input>
              <div className="flex justify-between items-center w-full">
                <div className="text-blue-dark text-xl font-bold">
                  Termin {id + 1} - {item.subject}
                </div>
                <div className="flex gap-3 bg-white py-4 px-2 rounded-xl text-blue-dark font-bold">
                  <div>{item.datetime.split("T")[0]}</div>
                  <div>{item.datetime.split("T")[1]}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button
          type="button"
          className="bg-blue-light text-white py-3 px-2 rounded-2xl w-3/12 self-end mr-7 mb-1 cursor-pointer z-50"
          onClick={handleAddToSchedule}
        >
          Dodijeli terminima
        </button>
      </div>
    </div>
  );
};

export default AddToSchedule;
