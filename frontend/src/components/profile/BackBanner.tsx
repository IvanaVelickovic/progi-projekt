import { useNavigate } from "react-router-dom";

interface BackBannerProps {
  formEmpty: boolean;
  backPath?: string;
}

const BackBanner = ({
  formEmpty,
  backPath = "/instructor/dashboard",
}: BackBannerProps) => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    if (!formEmpty) {
      const proceed = window.confirm(
        "Ako se vratite natrag, vaši podaci neće biti spremljeni. Želite li nastaviti?"
      );

      if (!proceed) return;
    }

    navigate(backPath);
  };

  return (
    <div className="flex items-center p-8 bg-green-dark/50 shadow">
      <h1
        onClick={handleGoBack}
        className="text-blue-dark text-[2.7rem] font-bold cursor-pointer hover:opacity-80 transition"
      >
        STEM tutorstvo
      </h1>
    </div>
  );
};

export default BackBanner;
