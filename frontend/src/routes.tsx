import { QueryClient } from "@tanstack/react-query";
import { createBrowserRouter } from "react-router-dom";
import { CreateOrEditPatient } from "./components/CreateOrEditPatient";
import { ErrorBoundary } from "./components/ErrorBoudary";
import { loader as patientsLoader } from "./fetchers/getAllPatients";
import { loader as patientLoader } from "./fetchers/getPatientById";
import { PatientsTable } from "./components/PatientsTable";

const queryClient = new QueryClient();

export const router = createBrowserRouter([
  {
    path: "/",
    element: <PatientsTable />,
    loader: patientsLoader(queryClient),
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/edit/:userId",
    element: <CreateOrEditPatient isEditing />,
    loader: () => patientLoader(queryClient),
    errorElement: <ErrorBoundary />,
  },
]);
