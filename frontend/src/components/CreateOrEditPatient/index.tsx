import { Button } from "@mui/material";
import { Stack } from "@mui/system";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { FormContainer, TextFieldElement } from "react-hook-form-mui";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { createPatient } from "../../fetchers/createPatient";
import { editPatient } from "../../fetchers/editPatient";
import { getAllPatientsQuery } from "../../fetchers/getAllPatients";
import { getPatientByIdQuery } from "../../fetchers/getPatientById";
import { Patient } from "../../types/patient";
import { Loading } from "../Loading";

interface FormProps {
  onSubmit: (patient: Patient) => Promise<void>;
  setOpen?: (open: boolean) => void;
  isEditing: boolean;
  value: string;
  setValue: (value: string) => void;
  defaultValues?: {
    name: string;
    email: string;
    address: string;
    birth_date: string;
  };
}

export function CreateOrEditPatient({
  isEditing,
  setOpen,
}: Pick<FormProps, "isEditing" | "setOpen">) {
  const [value, setValue] = useState("");

  const { userId } = useParams<{ userId: string }>();

  const { data: patient, isLoading } = useQuery<Patient>(
    getPatientByIdQuery(userId ?? "")
  );

  const { refetch } = useQuery(getAllPatientsQuery());

  async function onSubmit(patient: Patient) {
    if (isEditing) {
      await editPatient(userId as string, patient)
        .then(() => toast.success("Paciente editado com sucesso!"))
        .catch(() => toast.error("Erro ao editar paciente!"));
    } else {
      await createPatient(patient)
        .then(() => toast.success("Paciente criado com sucesso!"))
        .then(() => refetch())
        .catch(() => toast.error("Erro ao criar paciente!"));
      setOpen?.(false);
    }
  }

  if (isEditing && isLoading) {
    return <Loading />;
  }

  return (
    <div
      style={
        isEditing
          ? {
              display: "flex",
              justifyContent: "center",
              width: "100%",
              alignItems: "center",
              height: "80vh",
            }
          : {}
      }
    >
      <Form
        setOpen={setOpen}
        defaultValues={{
          name: patient?.name ?? "",
          email: patient?.email ?? "",
          address: patient?.address ?? "",
          birth_date: patient?.birth_date ?? "",
        }}
        onSubmit={onSubmit}
        isEditing={isEditing}
        value={value}
        setValue={setValue}
      />
    </div>
  );
}

function Form({
  onSubmit,
  isEditing,
  value,
  setValue,
  defaultValues,
}: FormProps) {
  if (isEditing && !defaultValues) {
    return <Loading />;
  }

  const defaultDate = defaultValues?.birth_date;

  return (
    <FormContainer onSuccess={onSubmit} defaultValues={defaultValues}>
      <Stack spacing={3} width={isEditing ? 500 : 330}>
        <TextFieldElement
          validation={{
            required: "Campo obrigatório",
          }}
          name="name"
          label="Nome"
          required
        />
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            disableOpenPicker
            label="Data de nascimento"
            value={(defaultDate as string)?.length > 0 ? defaultDate : value}
            onChange={(newValue) => setValue(newValue as string)}
            inputFormat="dd/MM/yyyy"
            renderInput={(params) => (
              <TextFieldElement
                validation={{
                  required: "Campo obrigatório",
                  pattern: {
                    message: "Data inválida",
                    //between 1900 and 2099
                    value:
                      /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[012])\/(19|20)\d\d$/,
                  },
                }}
                name="birth_date"
                {...params}
                inputProps={{
                  ...params.inputProps,
                  placeholder: "__/__/____",
                }}
              />
            )}
          />
        </LocalizationProvider>
        <TextFieldElement
          validation={{
            required: "Campo obrigatório",
            pattern: {
              message: "E-mail inválido",
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            },
          }}
          name="email"
          label="E-mail"
          required
        />
        <TextFieldElement
          validation={{
            required: "Campo obrigatório",
            minLength: {
              message: "Mínimo de 5 caracteres",
              value: 5,
            },
          }}
          name="address"
          label="Endereço"
          required
        />
        <Button
          // onClick={() => setOpen(false)}
          type={"submit"}
          variant={"contained"}
          color={"primary"}
        >
          {isEditing ? "Editar" : "Criar"} Paciente
        </Button>
        {isEditing && (
          <Button
            onClick={() => history.back()}
            variant={"contained"}
            color={"secondary"}
          >
            Voltar
          </Button>
        )}
      </Stack>
    </FormContainer>
  );
}
