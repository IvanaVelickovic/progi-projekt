import api from "../api";

export async function joinVideoSession(
  reservationId: number
) {
  const res = await api.get(
    `/api/video-sessions/${reservationId}/join`
  );

  // axios -> res.data je već JSON
  return res.data as {
    appId: string;
    roomName: string;
    jwt: string;
  };
}