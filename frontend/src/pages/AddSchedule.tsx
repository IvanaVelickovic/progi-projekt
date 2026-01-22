import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import googleLogo from "../assets/logos/google_logo.png";

const AddSchedule = () => {
  const googleUser = JSON.parse(
    sessionStorage.getItem("googleUser") || "false",
  );

  const [formData, setFormData] = useState({
    format: "",
    datetime: "",
    maxParticipants: "",
    durationMin: "",
    price: "",
    googleCalendar: false,
    subject: "",
  });

  const navigate = useNavigate();

  //minDateTime so the calendar shows dates from current timestamp
  const today = new Date();
  const localDate = today.toLocaleDateString("sv-SE");
  const hours = String(today.getHours()).padStart(2, "0");
  const minutes = String(today.getMinutes()).padStart(2, "0");
  const localTime = `${hours}:${minutes}`;
  const minDateTime = `${localDate}T${localTime}`;

  const isFormEmpty = Object.values(formData).every((value) => value === ""); //initial value

  const goBack = () => {
    const formEmpty = Object.values(formData).every((value) => value === "");

    if (!formEmpty) {
      const proceed = window.confirm(
        "Ako se vratite natrag, vaši podaci neće biti spremljeni. Želite li nastaviti?",
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
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;

    const val =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : value;

    setFormData({ ...formData, [name]: val });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload = {
      datetime: formData.datetime,
      durationMin: parseInt(formData.durationMin),
      price: parseFloat(formData.price),
      attendanceMode: formData.format === "live" ? "in_person" : "online",
      maxParticipants: parseInt(formData.maxParticipants),
      status: "scheduled",
      googleCalendar: true,
      subject: formData.subject,
    };
    try {
      const res = await api.post("/api/instructor-schedules", payload);

      if (res.status === 200 || res.status === 201) {
        window.alert("Termin uspješno dodan!");
        navigate("/instructor/dashboard");
      }
    } catch (err: any) {
      console.error("Greška u komunikaciji s backendom ", err);
      window.alert(
        "Nismo uspjeli dodati vaš termin. Molimo pokušajte ponovno.",
      );
    }
  };

  return (
    <div className="h-screen">
      <div className="flex justify-between items-center content-end p-10 bg-green-dark/50 h-[14%] shadow">
        <h1 className="text-blue-dark text-[2.7rem] font-bold">
          STEM tutorstvo
        </h1>{" "}
      </div>

      <div className=" h-5/6 py-8 px-30">
        <div
          className="flex items-center mb-2 cursor-pointer max-w-60"
          onClick={goBack}
        >
          <img src="/images/back_button.png" className="mr-2 h-10"></img>
          <div className="text-blue-dark text-xl font-semibold">
            Natrag na termine
          </div>
        </div>
        <div className="flex justify-between h-11/12 rounded-3xl">
          <div className="flex flex-col justify-center w-1/5 p-9 pt-14 rounded-l-3xl bg-[#97E0B7]">
            <div className="text-blue-dark text-3xl font-bold mb-8">
              Novi termin
            </div>
            <div className="text-blue-dark/90 text-lg font-bold ml-2">
              Molimo unesite podatke za vaš termin. <br /> <br />
              Ako odaberete da se termin održava uživo, lokacija će se
              automatski preuzeti iz vašeg profila.
            </div>
          </div>
          <form
            method="POST"
            className="w-4/5 rounded-r-3xl bg-[#C8F1DA] p-[7%] text-blue-dark text-xl"
            onSubmit={handleSubmit}
          >
            <div className="flex justify-between mb-[5%]">
              <div>
                <p className="font-semibold mb-1">Format termina</p>
                <label className="mr-10">
                  <input
                    type="radio"
                    name="format"
                    value="online"
                    checked={formData.format === "online"}
                    onChange={handleChange}
                    required
                  />
                  uživo
                </label>
                <label>
                  <input
                    type="radio"
                    name="format"
                    value="live"
                    checked={formData.format === "live"}
                    onChange={handleChange}
                    required
                  />
                  online
                </label>
              </div>
              <div className="w-[42%]">
                <p className="font-semibold mb-1">Trajanje</p>
                <label>
                  <input
                    type="number"
                    step={10}
                    min={10}
                    name="durationMin"
                    value={formData.durationMin}
                    onChange={handleChange}
                    className="bg-white rounded border border-blue-dark/50 mr-1.5 w-4/5"
                    required
                  />
                  minuta
                </label>
              </div>
            </div>
            <div className="flex justify-between mb-[5%]">
              <div className="w-[35%]">
                <p className="font-semibold mb-1">Datum i vrijeme održavanja</p>
                <input
                  type="datetime-local"
                  step={60}
                  min={minDateTime}
                  name="datetime"
                  value={formData.datetime}
                  onChange={handleChange}
                  className="bg-white rounded border border-blue-dark/50 w-full"
                  required
                />
              </div>
              <div className="w-[42%]">
                <p className="font-semibold mb-1">Cijena po polazniku</p>
                <label>
                  <input
                    type="number"
                    step={1}
                    min={0}
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className="bg-white rounded border border-blue-dark/50 mr-1.5 w-4/5"
                    required
                  />
                  €
                </label>
              </div>
            </div>
            <div className="flex justify-between">
              <div className=" w-[35%]">
                <p className="font-semibold">Maksimalni broj polaznika</p>
                <input
                  type="number"
                  step={1}
                  min={1}
                  name="maxParticipants"
                  value={formData.maxParticipants}
                  onChange={handleChange}
                  className="bg-white rounded border border-blue-dark/50 w-full"
                  required
                />
              </div>
              <div className="w-[42%] ">
                <label className="font-semibold block">Predmet</label>
                <select
                  name="subject"
                  value={formData.subject}
                  className="border border-gray-400 rounded-md py-0.5 focus:outline-none focus:ring-1 focus:ring-[#1e3a56] bg-white w-4/5"
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>
                    Odaberi predmet
                  </option>
                  <option value="Fizika">Fizika</option>
                  <option value="Matematika">Matematika</option>
                  <option value="Informatika">Informatika</option>
                </select>
              </div>
            </div>
            <div className="flex h-1/4 justify-between items-center mt-[5%]">
              {googleUser ? (
                <div className="flex items-center gap-2 w-[42%] font-semibold">
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
              ) : (
                <div className="flex w-[42%] items-center"></div>
              )}
              <button
                type="submit"
                className="bg-blue-light text-white text-xl p-3 rounded-2xl text-center w-1/4 h-13 cursor-pointer mr-17.5"
              >
                Dodaj novi termin
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddSchedule;
