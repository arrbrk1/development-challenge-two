import { useRouteError } from "react-router-dom";

export function ErrorBoundary() {
  const error = useRouteError();
  return (
    <div>
      <h1>Erro ao carregar pacientes</h1>
      <pre>{JSON.stringify(error)}</pre>
    </div>
  );
}
