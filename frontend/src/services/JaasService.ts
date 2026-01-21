export async function joinVideoSession(
  reservationId: number,
  role: "student" | "instructor"
) {
  const res = await fetch(
    `/api/video-sessions/${reservationId}/join`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ role }),
    }
  );

  if (!res.ok) {
    throw new Error("Failed to join video session");
  }

  return res.json() as Promise<{
    appId: string;
    roomName: string;
    jwt: string;
  }>;
}
