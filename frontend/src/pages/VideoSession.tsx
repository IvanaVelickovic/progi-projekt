import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import JaasMeeting from "../components/JaasMeeting";
import { getJaasToken } from "../services/JaasService";

type UserRole = "student" | "instructor";

interface JaasData {
  appId: string;
  roomName: string;
  jwt: string;
}

const VideoSession = () => {
  const { sessionId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // ⬇️ ROLE DOLAZI IZ URL-a
  const role = searchParams.get("role") as UserRole;

  const [jaas, setJaas] = useState<JaasData | null>(null);

  useEffect(() => {
    if (!sessionId || !role) return;

    getJaasToken(Number(sessionId), role)
      .then(setJaas)
      .catch((err) => {
        console.error(err);
        navigate("/");
      });
  }, [sessionId, role, navigate]);

  const handleMeetingEnd = async () => {
  await fetch(
    `http://localhost:3001/api/video-sessions/${sessionId}/end`,
    { method: "POST" }
  );

  if (role === "student") {
    navigate("/student/dashboard");
  } else {
    navigate("/instructor/dashboard");
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
