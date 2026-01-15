import { useNavigate, useParams } from "react-router-dom";
import VideoIcon from "/images/video_icon.png";
import EducationIcon from "/images/education_icon.png";
import MoneyIcon from "/images/money_icon.png";
import LocationIcon from "/images/location_icon.png";
import PersonIcon from "/images/person_icon.png";
import React, { useEffect, useState } from "react";
import {
  fetchInstructorData,
  fetchInstructorSummary,
  getEmptyInstructorObject,
  getEmptyInstructorSummary,
  type InstructorData,
  type InstructorSummary,
} from "./InstructorProfile.utils";
import LeafletMap from "../LeafletMap";
//import { LeafletMap } from "../../components/leaflet-map/LeafletMap";


interface ProfileSection {
  icon: string;
  label: string;
  value?: string | number | React.ReactNode;
  href?: string;
}

const InstructorProfile = () => {
  const navigate = useNavigate();
  const { instructorId } = useParams();

  const [instructorSummary, setInstructorSummary] = useState<InstructorSummary>(
    getEmptyInstructorSummary()
  );

  const [instructorData, setInstructorData] = useState<InstructorData>(
    getEmptyInstructorObject()
  );

  useEffect(() => {
    fetchInstructorSummary(instructorId).then((fetchedInstructorSummary) => {
      setInstructorSummary(fetchedInstructorSummary);
    });
    fetchInstructorData(instructorId).then((fetchedInstructorData) => {
      setInstructorData(fetchedInstructorData);
    });
  }, []);

  const profileSections: Array<ProfileSection> = [
    {
      icon: VideoIcon,
      label: "Video uvod:",
      value: undefined,
      href: instructorData.introVideoUrl,
    },
    {
      icon: EducationIcon,
      label: "Područja stručnosti:",
      value: instructorData.expertiseAreas,
      href: undefined,
    },
    {
      icon: MoneyIcon,
      label: "Cijena po satu:",
      value: instructorData.hourlyRate,
      href: undefined,
    },
    {
      icon: LocationIcon,
      label: "Lokacija:",
      value: (
        <div className="w-full min-h-[220px]">
          <LeafletMap lat={instructorData.latitude} lng={instructorData.longitude} />
        </div>
      ),
      href: undefined,
    },
    {
      icon: PersonIcon,
      label: "Biografija:",
      value: instructorData.biography,
      href: undefined,
    },
  ];

  return (
    <div className="h-full">
      <header className="flex justify-between items-center content-end p-10 bg-green-dark/50 h-1/6 shadow">
        <h1 className="text-blue-dark text-3xl lg:text-5xl font-bold">
          STEM tutorstvo
        </h1>
        <div className="flex items-center bg-[#D9D9D9] w-5/12 rounded-3xl cursor-pointer">
          <img src="/images/search_icon.png" className="w-11 ml-2" />
          <div className="text-blue-dark/60 font-bold text-xl ml-1">
            Pretražite profile
          </div>
        </div>
        <button
          className="bg-blue-light text-white text-xl p-3 px-15 rounded-lg cursor-pointer"
          onClick={() => navigate("/profile")}
        >
          Profil
        </button>
      </header>

      <main className="flex h-5/6">
        <aside className="bg-green-dark/30 m-5 rounded-lg  w-50 lg:w-75 justify-items-center">
          <div className="flex justify-center items-center w-45 h-45 mt-6 rounded-full bg-green-dark">
            {instructorSummary.photo}
          </div>
          <h2 className="text-blue-dark text-3xl font-bold mt-8">
            {instructorSummary.firstName} {instructorSummary.lastName}
          </h2>
          <StarRating
            rating={instructorSummary.averageRating}
            count={instructorSummary.reviewCount}
          />
          <ul className="list-group text-blue-dark text-2xl flex-col mt-8 p-5">
            <li className="list-group-item bg-green-dark/50 rounded-3xl cursor-pointer text-center font-semibold p-3 active">
              O instruktoru
            </li>
            <li className="list-group-item mt-5 p-3 cursor-pointer text-center">
              Dostupni termini
            </li>
            <li className="list-group-item mt-5 p-3 cursor-pointer text-center">
              Ocjene i recenzije
            </li>
          </ul>
        </aside>

        <section className="flex-1 pt-5 px-15 space-y-10 my-5 mr-5">
          {profileSections.map((profileSection, index) => {
            return (
              <ProfileRow
                icon={profileSection.icon}
                label={profileSection.label}
                value={profileSection.value}
                href={profileSection.href}
                key={index}
              />
            );
          })}
        </section>
      </main>
    </div>
  );
};

type ProfileRowProps = {
  icon: string;
  label: string;
  value?: string | number | React.ReactNode;
  href?: string;
};

function ProfileRow({ icon, label, value, href }: ProfileRowProps) {
  return (
    <div className="grid grid-cols-[60px_1fr] gap-4 items-start">
      <img src={icon} alt="" className="w-12 h-12 object-contain" />
      <div>
        <div className="text-blue-dark font-semibold mb-2 text-3xl">{label}</div>
        <div className="text-gray-700 text-xl">
          {value && <>{value}</>}
          {href && <a href={href} />}
        </div>
      </div>
    </div>
  );
}

// prikaz zvjezdica
function StarRating({ rating, count }: { rating: number; count: number }) {
  const totalStars = 5;
  const fullStars = Math.floor(rating); // cijeli dio ocjene
  const hasHalfStar = rating % 1 >= 0.5; // "polovicne" zvjezdice
  const emptyStars = totalStars - fullStars - (hasHalfStar ? 1 : 0);
  return (
    <div className="flex items-center text-2xl">
      {/* zuta */}
      {Array(fullStars)
        .fill(0)
        .map((_, i) => (
          <span key={`full-${i}`} className="text-yellow-500">
            ★
          </span>
        ))}
      {/* Polovicna (zuti rub) */}
      {hasHalfStar && <span className="text-yellow-500">☆</span>}

      {/* Prazne (sive) */}
      {Array(emptyStars)
        .fill(0)
        .map((_, i) => (
          <span key={`empty-${i}`} className="text-gray-400">
            ★
          </span>
        ))}

      {/* Broj recenzija */}
      <span className="text-gray-600 ml-2 text-xl">({count})</span>
    </div>
  );
}

export default InstructorProfile;
