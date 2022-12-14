import { QueryClient } from "@tanstack/react-query";
import { env } from "../env";

export const getAllPatientsQuery = () => ({
  queryKey: ["id"],
  queryFn: async () => {
    const response = await fetch(`${env.apiUrl}/patients`);
    return response.json();
  },
  refetchOnWindowFocus: false,
});

export const loader = (queryClient: QueryClient) => async () => {
  const query = getAllPatientsQuery();
  return (
    queryClient.getQueryData(query.queryKey) ??
    (await queryClient.fetchQuery(query))
  );
};
