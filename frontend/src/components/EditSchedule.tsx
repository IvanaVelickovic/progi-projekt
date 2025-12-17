import { useNavigate } from "react-router-dom";
import googleLogo from "../assets/logos/google_logo.png";
import { useState } from "react";
import api from "../api";

interface EditScheduleProps {
  scheduleData: {
    id: number;
    index: number;
    filled: number;
    googleCalendarExists: boolean;
  };
  setEditSchedule: React.Dispatch<React.SetStateAction<boolean>>;
  setAppointments: React.Dispatch<
    React.SetStateAction<
      {
        id: number;
        datetime: string;
        format: string;
        duration: number;
        price: number;
        filled: number;
        capacity: number;
        googleCalendarExists: boolean;
      }[]
    >
  >;
}

const EditSchedule = ({
  scheduleData,
  setEditSchedule,
  setAppointments,
}: EditScheduleProps) => {
  const navigate = useNavigate();

  const [editData, setEditData] = useState({
    maxParticipants: scheduleData.filled,
    googleCalendar: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setEditData({ ...editData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      let add = false;
      if (editData.googleCalendar != "") {
        add = true;
      }
      const res = await api.post("/isntructor/edit/schedule", {
        id: scheduleData.id,
        capacity: editData.maxParticipants,
        addToGoogleCalendar: add,
      });
      if (res.status == 200) {
        window.alert("Termin uspješno promijenjen!");
      }
    } catch (err) {
      console.error("Greška s backendom: ", err);
    }
  };
  const handleDelete = async () => {
    const proceed = window.confirm(
      "Brisanje termina je trajno. Želite li nastaviti?"
    );
    if (proceed) {
      try {
        await api.post("/schedule/delete", scheduleData.id);

        setAppointments((prev) =>
          prev.filter((item) => item.id !== scheduleData.id)
        );

        window.alert("Uspješno izbrisano!");
        setEditSchedule(false);
      } catch (err) {
        console.log("Pogreška u komunikaciji s backendom: ", err);
        window.alert("Brisanje nije uspjelo");
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/25 "></div>
      <div className="relative bg-[#ADEBC8] rounded-2xl w-1/2 h-7/12 z-10 border-2 border-blue-dark">
        <div className="flex justify-between items-center content-end bg-green-dark/50 h-1/6 shadow rounded-t-2xl">
          <h1 className="ml-10 text-blue-dark text-2xl font-bold">
            Uredi termin {scheduleData.index}
          </h1>
          <img
            src="/images/close_logo.png"
            className="h-9 mr-5 cursor-pointer"
            onClick={() => setEditSchedule(false)}
          ></img>
        </div>
        <form
          className="flex flex-col p-10 h-5/6"
          method="POST"
          onSubmit={handleSubmit}
        >
          <div className="text-[#6F0000]/90 mb-[3%]">
            ! Za promjenu datuma, vremena, cijene ili formata, molimo obrišite
            termin i kreirajte novi. <br />! Ukoliko obrišete termin, a već
            imate prijavljene učenike, svi učenici će o otkazivanju termina biti
            obaviješteni e-mail porukom.
          </div>
          <div className="flex">
            <p className="text-blue-dark font-semibold text-lg">
              Maksimalni broj polaznika
            </p>
            <input
              type="number"
              step={1}
              min={scheduleData.filled}
              name="maxParticipants"
              value={editData.maxParticipants}
              placeholder={scheduleData.filled.toString()}
              onChange={handleChange}
              className="bg-white rounded border border-blue-dark/50 w-1/12 ml-3 pl-2 text-center"
            />
          </div>
          <p className="text-[#6F0000]/90 ml-3 mb-4">
            ! Kod mijenjanja broja polaznika, novi broj ne smije biti manji od
            broja trenutno prijavljenih učenika
          </p>
          {scheduleData.googleCalendarExists && (
            <div className="flex items-center gap-2 text-lg font-semibold text-blue-dark ">
              <label>
                <input
                  type="checkbox"
                  className="w-5.5 h-5.5 align-middle"
                  name="googleCalendar"
                  value="googleCalendar"
                  onChange={handleChange}
                />
              </label>
              Dodaj termin u Google Calendar
              <img src={googleLogo} className="h-5"></img>
            </div>
          )}
          <div className="flex items-center justify-end mt-[5%]">
            <button
              className="bg-[#6F0000]/90 text-white text-lg rounded-xl text-center w-[29%] h-12 cursor-pointer mr-4"
              type="button"
              onClick={handleDelete}
            >
              Obriši termin
            </button>
            <button
              className="bg-blue-light text-white text-lg rounded-xl text-center w-[29%] h-12 cursor-pointer"
              type="submit"
            >
              Spremi promjene
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditSchedule;
