import { env } from "../env";
import { Patient } from "../types/patient";

export async function editPatient(id: string, body: Patient) {
  if (!id) return;

  const response = await fetch(`${env.apiUrl}/patient/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      created_at: new Date().toISOString(),
      ...body,
    }),
  });

  history.back();

  return response.json();
}
