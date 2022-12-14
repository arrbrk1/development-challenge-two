import { env } from "../env";
import { Patient } from "../types/patient";

export async function createPatient(body: Patient) {
  const response = await fetch(`${env.apiUrl}/patient`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      created_at: new Date().toISOString(),
      ...body,
    }),
  });

  return response.json();
}
