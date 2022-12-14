import { QueryClient } from "@tanstack/react-query";
import { env } from "../env";

export const getPatientByIdQuery = (id: string) => ({
  queryKey: ["patient", id],
  queryFn: async () => {
    const response = await fetch(`${env.apiUrl}/patient/${id}`);
    return response.json();
  },
  enabled: !!id,
});

export const loader = (queryClient: QueryClient) => async (id: string) => {
  const query = getPatientByIdQuery(id);
  return (
    queryClient.getQueryData(query.queryKey) ??
    (await queryClient.fetchQuery(query))
  );
};
