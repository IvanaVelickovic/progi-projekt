import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import api from "../api";

interface StatisticsData {
  overallAverageRating: number;
  fiveStarRatingsCount: number; //ukupni broj 5-star reviewa
  totalRatingsCount: number; //ukupan broj svih reviewa
}

interface ChartData {
  month: string;
  count: number;
}

const monthsCro = [
  "sij.",
  "velj.",
  "ožu.",
  "tra.",
  "svi.",
  "lip.",
  "srp.",
  "kol.",
  "lis.",
  "stu.",
  "pro.",
];

const Statistics = () => {
  const [data, setData] = useState<StatisticsData>();
  const [rawChartData, setRawChartData] = useState<ChartData[]>([]);
  const [chartData, setChartData] = useState<ChartData[]>([]);

  const dummyData = {
    overallAverageRating: 4.21,
    fiveStarRatingsCount: 96,
    totalRatingsCount: 234,
  };

  const chartDummyData = [
    { month: "04-2025", count: 2 },
    { month: "01-2026", count: 12 },
    { month: "02-2025", count: 1 },
    { month: "03-2025", count: 11 },
    { month: "05-2025", count: 4 },
    { month: "06-2025", count: 7 },
    { month: "07-2025", count: 5 },
    { month: "09-2025", count: 8 },
    { month: "10-2025", count: 10 },
    { month: "11-2025", count: 3 },
    { month: "12-2025", count: 11 },
    { month: "08-2025", count: 6 },
  ];

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await api.get("/api/admin/stats/summary");
        setData(res.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchSummary();
    //setData(dummyData);
  }, []);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const res = await api.get("/api/admin/stats/reservation-chart");
        setRawChartData(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchChartData();
    //setRawChartData(chartDummyData);
  }, []);

  useEffect(() => {
    if (!rawChartData.length) {
      return;
    }

    //parsiranje na mjesec i godinu
    const parsed = rawChartData.map((p) => {
      const [month, year] = p.month.split("-").map(Number);
      return { month, year, count: p.count };
    });

    //sortiranje od najstarijeg do najnovijeg mjeseca
    const sortedData = [...parsed].sort((a, b) =>
      a.year === b.year ? a.month - b.month : a.year - b.year,
    );

    //dodavanje hrvatskih imena mjesecima
    const merged = sortedData.map((d) => ({
      month: monthsCro[d.month - 1],
      count: d.count,
    }));

    //dodavanje godine za prvi i zadnji mjesec
    if (merged.length > 0) {
      merged[0].month += " " + sortedData.at(0)?.year;
      merged[merged.length - 1].month +=
        " " + sortedData.at(sortedData.length - 1)?.year;
    }

    setChartData(merged);
  }, [rawChartData]);

  return (
    <div className="max-w-7xl mx-auto px-8 py-8 text-blue-dark">
      {/* Reservations Chart */}
      <div className="bg-white rounded-2xl border-2 border-[#2B7A78] p-8 mb-6">
        <h2 className=" text-2xl font-semibold">Broj rezervacija</h2>
        <div className="text-lg pl-1 mb-3">
          Graf prikazuje broj rezervacija termina u proteklih 12 mjeseci
        </div>
        <div className="">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3"></CartesianGrid>
              <XAxis dataKey="month"></XAxis>
              <YAxis></YAxis>
              <Tooltip></Tooltip>
              <Bar dataKey="count" fill="#2B7A78"></Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/* Review Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Average Rating Card */}
        <div className="bg-white rounded-2xl border-2 border-[#2B7A78] p-8">
          <h3 className=" text-xl font-semibold mb-6">
            Prosječna ocjena instruktora
          </h3>

          <div className="flex items-center justify-center gap-0 mb-4 pt-8">
            <div className="flex items-center text-6xl font-bold">
              <div className="text-[#2B7A78]">{data?.overallAverageRating}</div>
              <img src="/images/star.png" className="h-12"></img>
            </div>
          </div>

          <div className="text-center pr-6">
            <p className=" text-lg">od ukupno 5 zvjezdica</p>
            <p className=" text-sm mt-2">
              na temelju {data?.totalRatingsCount} recenzija
            </p>
          </div>

          {/* Star Rating Visualization */}
          <div className="flex items-center justify-center gap-1 mt-6"></div>
        </div>

        {/* Five Star Reviews Card */}
        <div className="bg-white rounded-2xl border-2 border-[#2B7A78] p-8">
          <h3 className=" text-xl font-semibold mb-6">Ocjena 5</h3>

          <div className="flex flex-col items-center justify-center">
            <div className="text-6xl font-bold text-[#2B7A78] mb-4">
              {data?.fiveStarRatingsCount}
            </div>

            <div className="text-center mb-6">
              <p className=" text-lg">
                učenika je dalo 5 zvjezdica svome instruktoru
              </p>
            </div>

            {/* Percentage Bar */}
            <div className="w-full">
              <div className="bg-[#D5F4E6] rounded-full h-8 overflow-hidden">
                <div
                  className="bg-[#2B7A78] h-full flex items-center justify-center transition-all duration-500"
                  style={{
                    width: `${((data?.fiveStarRatingsCount ?? 0) / (data?.totalRatingsCount ?? 1)) * 100}%`,
                  }}
                >
                  <span className="text-white text-sm font-semibold">
                    {Math.round(
                      ((data?.fiveStarRatingsCount ?? 0) /
                        (data?.totalRatingsCount ?? 1)) *
                        100,
                    )}
                    %
                  </span>
                </div>
              </div>
              <p className=" text-sm text-center mt-3">od svih recenzija</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
