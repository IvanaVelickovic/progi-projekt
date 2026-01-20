export async function getJaasToken(
  sessionId: number,
  role: "student" | "instructor"
) {
  const res = await fetch(
    `http://localhost:3001/api/jaas-token?sessionId=${sessionId}&role=${role}`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch JaaS token");
  }

  return res.json();
}