import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
//import appointmentsData from "../assets/appointments_s.json";
import Slider from "rc-slider";
import api from "../api";
import StudentSchedule from "../components/StudentSchedule";
import { useStudentAppointments } from "../context/StudentSearchContext";

const Search = () => {
  const navigate = useNavigate();

  const defaultStyle =
    "border border-1 border-blue-dark/80 text-blue-dark/63 rounded-sm bg-white px-2 py-0.5 w-10/12 focus:outline-none focus:ring-1 focus:ring-[#1e3a56]";
  const selectedStyle =
    "border border-1 border-blue-dark/80 text-blue-dark rounded-sm bg-white px-2 py-0.5 w-10/12 focus:outline-none focus:ring-1 focus:ring-[#1e3a56]";

  const { appointments, setAppointments } = useStudentAppointments();
  const [filterData, setFilterData] = useState({
    subject: "",
    formatOnline: false,
    formatLive: false,
    date: "",
    timeFrom: "",
    timeTo: "",
    locationRadius: 0,
    rating: "",
    page: 0,
    limit: 6,
  });

  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);
  const [location, setLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const [locationAccess, setLocationAccess] = useState(false);

  const today = new Date();
  const localDate = today.toLocaleDateString("sv-SE");

  const [loading, setLoading] = useState(false);

  const fetchAppointments = async (filters: typeof filterData) => {
    setLoading(true);
    const params = new URLSearchParams();

    params.append("page", filters.page.toString());
    params.append("limit", filters.limit.toString());

    if (filters.subject) params.append("subject", filters.subject);

    if (filters.formatLive && !filters.formatOnline)
      params.append("format", "in_person");
    if (filters.formatOnline && !filters.formatLive)
      params.append("format", "online");

    if (priceRange[0] != 0) params.append("minPrice", priceRange[0].toString());
    if (priceRange[1] != 100)
      params.append("maxPrice", priceRange[1].toString());

    if (filters.date) params.append("date", filters.date);
    if (filters.timeFrom) params.append("timeFrom", filters.timeFrom);
    if (filters.timeTo) params.append("timeTo", filters.timeTo);

    if (filters.rating) params.append("rating", filters.rating);

    if (location && filters.locationRadius != 0) {
      params.append("lat", location.lat.toString());
      params.append("lng", location.lng.toString());
      params.append("locationRadius", filters.locationRadius.toString());
    }

    try {
      const dataRes = await api.get("/api/instructors/search", { params });
      setAppointments(dataRes.data);
    } catch (error) {
      console.error("Greška pri dohvaćanju podataka:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    //setAppointments(appointmentsData); //samo za lokalno testiranje

    fetchAppointments(filterData);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFilterData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormatChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;

    setFilterData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setFilterData((prev) => {
      const newPage = 0;
      fetchAppointments({ ...prev, page: newPage }); // odmah šalje novu vrijednost
      return { ...prev, page: newPage };
    });
  };

  const requestLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setLocationAccess(true);
      },
      (err) => {
        console.log(err);
        setLocationAccess(false);
        alert("Za pretraživanje po udaljenosti je potrebna lokacija");
      },
    );
  };

  const handleNextPage = () => {
    setFilterData((prev) => {
      const newPage = prev.page + 1;
      fetchAppointments({ ...prev, page: newPage });
      return { ...prev, page: newPage };
    });
  };

  const handlePrevPage = () => {
    setFilterData((prev) => {
      const newPage = prev.page - 1;
      fetchAppointments({ ...prev, page: newPage });
      return { ...prev, page: newPage };
    });
  };

  return (
    <>
      <div className="min-h-screen overflow-y-auto bg-white">
        <div className="flex justify-between items-center content-end p-10 bg-green-dark/50 h-1/6 max-h-[100px] shadow">
          <h1 className="text-blue-dark text-[2.7rem] font-bold">
            STEM tutorstvo
          </h1>
          <div className="flex justify-between gap-4 w-1/4">
            <button
              className="bg-blue-light text-white text-xl p-3 rounded-lg cursor-pointer w-1/2"
              onClick={() => navigate("/student/dashboard")}
            >
              Dashboard
            </button>
            <button
              className="bg-blue-light text-white text-xl p-3 px-15 rounded-lg cursor-pointer w-1/2"
              onClick={() => navigate("/profile")}
            >
              Profil
            </button>
          </div>
        </div>

        <div className="flex">
          <div className="flex justify-center w-1/4 bg-[#F8FFFC]">
            <div className="bg-[#F1FCF6] h-fit w-11/12 rounded-2xl mt-2 drop-shadow-[0_4px_0_rgba(0,0,0,0.25)] pr-0.5 border border-blue-dark/60">
              <form onSubmit={handleSubmit}>
                <ul className="h-full px-4">
                  <li className="flex items-center py-2.5 border-blue-light/60 border-b-3">
                    <div className="flex items-center text-2xl font-bold text-blue-dark">
                      Filteri
                    </div>
                  </li>
                  <li className="flex flex-col justify-center items-start py-1.5 border-blue-light/60 border-b-3">
                    <div className="flex items-center text-xl font-bold text-blue-dark ml-2 mb-1">
                      Predmet
                    </div>
                    <div className="w-full pl-3">
                      <select
                        name="subject"
                        value={filterData.subject}
                        className={
                          filterData.subject === ""
                            ? defaultStyle
                            : selectedStyle
                        }
                        onChange={handleChange}
                      >
                        <option value="" disabled>
                          Odaberi predmet{" "}
                        </option>
                        <option value="Matematika">Matematika</option>
                        <option value="Fizika">Fizika</option>
                        <option value="Informatika">Informatika</option>
                      </select>
                    </div>
                  </li>
                  <li className="flex flex-col justify-center py-1.5 border-blue-light/60 border-b-3">
                    <div className="flex items-center text-xl font-bold text-blue-dark ml-2 mb-1">
                      Format
                    </div>
                    <div className="flex flex-col ml-4 py-0 mb-0">
                      <div className="flex items-center gap-x-1.5">
                        <input
                          type="checkbox"
                          name="formatOnline"
                          checked={filterData.formatOnline}
                          onChange={handleFormatChange}
                        ></input>
                        online
                      </div>
                      <div className="flex items-center gap-x-1.5">
                        <input
                          type="checkbox"
                          name="formatLive"
                          checked={filterData.formatLive}
                          onChange={handleFormatChange}
                        ></input>
                        uživo
                      </div>
                    </div>
                  </li>
                  <li className="flex flex-col justify-center py-1.5 border-blue-light/60 border-b-3">
                    <div className="flex items-center text-xl font-bold text-blue-dark ml-2 mb-1">
                      Cijena
                    </div>
                    <div className="ml-4">
                      {priceRange[0]}€ - {priceRange[1]}€
                    </div>
                    <div className="px-4">
                      <Slider
                        range
                        min={0}
                        max={100}
                        step={1}
                        value={priceRange}
                        onChange={(value) =>
                          setPriceRange(value as [number, number])
                        }
                      />
                    </div>
                  </li>
                  <li className="flex flex-col justify-center py-1.5 border-blue-light/60 border-b-3">
                    <div className="flex items-center text-xl font-bold text-blue-dark ml-2 mb-1">
                      Datum
                    </div>
                    <input
                      type="date"
                      className="ml-4 w-10/12 border border-blue-dark/80 text-blue-dark rounded-sm bg-white px-1.5 "
                      name="date"
                      value={filterData.date}
                      min={localDate}
                      onChange={handleChange}
                    ></input>
                    <div className="flex items-center text-xl font-bold text-blue-dark ml-2 mb-1 mt-1.5">
                      Vrijeme početka
                    </div>
                    <div className="flex justify-between px-2">
                      <div className="flex justify-start gap-x-1">
                        <p>od:</p>
                        <input
                          type="time"
                          className="w-[80%] border border-blue-dark/80 text-blue-dark rounded-sm bg-white px-1"
                          name="timeFrom"
                          value={filterData.timeFrom}
                          onChange={handleChange}
                        ></input>
                      </div>
                      <div className="flex justify-start gap-x-1">
                        <p>do:</p>
                        <input
                          type="time"
                          className="w-[80%] border border-blue-dark/80 text-blue-dark rounded-sm bg-white px-1"
                          name="timeTo"
                          value={filterData.timeTo}
                          onChange={handleChange}
                        ></input>
                      </div>
                    </div>
                  </li>
                  <li className="flex flex-col justify-center py-1.5 border-blue-light/60 border-b-3">
                    <div className="flex items-center text-xl font-bold text-blue-dark ml-2 mb-1">
                      Ocjena
                    </div>
                    <div className="flex justify-between py-0 mb-0 px-4">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          name="rating"
                          value=""
                          onChange={handleChange}
                        ></input>
                        sve
                      </div>
                      <div className="flex items-center">
                        <input
                          type="radio"
                          name="rating"
                          value="4"
                          onChange={handleChange}
                        ></input>
                        <img src="/images/star.png" className="w-7"></img>
                        4+
                      </div>
                      <div className="flex items-center">
                        <input
                          type="radio"
                          name="rating"
                          value="3"
                          onChange={handleChange}
                        ></input>
                        <img src="/images/star.png" className="w-7"></img>
                        3+
                      </div>
                      <div className="flex items-center">
                        <input
                          type="radio"
                          name="rating"
                          value="2"
                          onChange={handleChange}
                        ></input>
                        <img src="/images/star.png" className="w-7"></img>
                        2+
                      </div>
                    </div>
                  </li>
                  <li className="flex flex-col justify-center py-1.5 border-blue-light/60 border-b-3">
                    <div className="flex items-center text-xl font-bold text-blue-dark ml-2 mb-1">
                      Lokacija
                    </div>
                    {!locationAccess && (
                      <button
                        className="bg-blue-light/95 text-white text-md rounded-lg w-fit px-5 py-0.5 ml-2 cursor-pointer my-0.5"
                        onClick={requestLocation}
                        type="button"
                      >
                        Omogući lokaciju
                      </button>
                    )}

                    <div className="ml-4">
                      0km - {filterData.locationRadius}km
                    </div>
                    <div className="px-4">
                      <Slider
                        disabled={!locationAccess}
                        min={0}
                        max={50}
                        step={1}
                        value={filterData.locationRadius}
                        onChange={(value) => {
                          setFilterData((prev) => ({
                            ...prev,
                            locationRadius: value as number,
                          }));
                        }}
                      />
                    </div>
                  </li>
                  <li className="flex flex-col justify-center py-3.5">
                    <button
                      type="submit"
                      className="bg-blue-light text-white text-lg rounded-xl w-10/12 py-2 self-center cursor-pointer"
                    >
                      Primijeni filtere
                    </button>
                  </li>
                </ul>
              </form>
            </div>
          </div>

          {loading ? (
            <p>Učitavanje...</p>
          ) : (
            <StudentSchedule
              search={true}
              appointments={appointments}
            ></StudentSchedule>
          )}
        </div>
      </div>
      <div className="bg-white ">
        <div className="flex place-self-end justify-center items-center h-10 w-3/4 pb-4">
          {filterData.page != 0 && (
            <button
              className="flex justify-center items-center text-blue-dark text-xl font-bold bg-green-light w-10 h-10 border-2 border-r-0 border-blue-dark cursor-pointer"
              onClick={handlePrevPage}
            >
              {"<"}
            </button>
          )}

          <div className="flex justify-center items-center text-blue-dark text-xl font-bold bg-green-light/30 w-10 h-10 border-2 border-blue-dark">
            {filterData.page + 1}
          </div>
          {appointments.length === 6 && (
            <button
              className="flex justify-center items-center text-blue-dark text-xl font-bold bg-green-light w-10 h-10 border-2 border-l-0 border-blue-dark cursor-pointer"
              onClick={handleNextPage}
            >
              {">"}
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default Search;
