import { useEffect, useState } from "react";
import { useNavigate, useParams} from "react-router-dom";
import JaasMeeting from "../components/JaasMeeting";
import { joinVideoSession } from "../services/JaasService";
import api from "../api";


interface JaasData {
  appId: string;
  roomName: string;
  jwt: string;
}



const VideoSession = () => {
  const { reservationId } = useParams();
  const navigate = useNavigate();
  const [role, setRole] = useState("");

  const [jaas, setJaas] = useState<JaasData | null>(null);

  useEffect(() => {

  joinVideoSession(Number(reservationId))
    .then(setJaas)
    .catch((err) => {
      console.error(err);
      navigate("/");
    });
}, [reservationId, navigate]);

  const handleMeetingEnd = async () => {
  try {
    const res = await api.post(
      `/api/video-sessions/${reservationId}/end`
    );

    const roleFromApi = res.data.role; 
    // ili ako backend vraća objekt:
    // const roleFromApi = res.data.role;

    if (roleFromApi === "student") {
      //navigate(`/review?instructorId=${instructorId}&participationId=${participationId}`);
    } else {
      navigate("/instructor/dashboard");
    }
  } catch (error) {
    console.error("Failed to end meeting", error);
    navigate("/");
  }
};

  if (!jaas) return <p className="p-8">Učitavanje video sesije...</p>;

  return (
    <JaasMeeting
      appId={jaas.appId}
      roomName={jaas.roomName}
      jwt={jaas.jwt}
      onMeetingEnd={handleMeetingEnd}
    />
  );
};

export default VideoSession;
