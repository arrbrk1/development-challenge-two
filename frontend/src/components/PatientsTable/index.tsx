import { DeleteRounded, EditRounded, RotateRight } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

import { useQuery } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useConfirm } from "material-ui-confirm";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loading } from "../../components/Loading";
import { env } from "../../env";
import { getAllPatientsQuery } from "../../fetchers/getAllPatients";
import { Patient } from "../../types/patient";
import { escapeRegExp } from "../../utils/escapeRegExp";
import { SearchToolbar } from "../Search";

export function PatientsTable() {
  const { data, isLoading, refetch, isRefetching } = useQuery<{
    patients: Patient[];
  }>(getAllPatientsQuery());

  const navigate = useNavigate();

  const [searchText, setSearchText] = useState("");
  const [rows, setRows] = useState<Patient[]>(data?.patients ?? []);

  const confirm = useConfirm();

  const searchPatient = (searchValue: string) => {
    setSearchText(searchValue);
    const searchRegex = new RegExp(escapeRegExp(searchValue), "i");
    const filteredRows = data?.patients.filter((row: Patient) => {
      return Object.keys(row).some((field) => {
        return searchRegex.test(row[field].toString());
      });
    });
    setRows(filteredRows ?? []);
  };

  useEffect(() => {
    setRows(data?.patients ?? []);
  }, [data?.patients]);

  async function deletePatient(id: string) {
    confirm({
      title: "Deletar paciente",
      cancellationText: "Cancelar",
      confirmationText: "Deletar",  
      description: "Tem certeza que deseja deletar este paciente?",
    })
      .then(() =>
        fetch(`${env.apiUrl}/patient/${id}`, {
          method: "DELETE",
        })
      )
      .then(() => refetch());
  }

  const columns: GridColDef[] = [
    {
      field: "reload",
      headerName: "",
      width: 60,
      sortable: false,
      renderHeader: () => {
        return (
          <IconButton onClick={() => refetch()}>
            <RotateRight />
          </IconButton>
        );
      },
    },
    { field: "id", headerName: "ID", width: 300 },
    { field: "name", headerName: "Nome", width: 200 },
    { field: "email", headerName: "E-mail", width: 200 },
    { field: "address", headerName: "Endereço", width: 200 },
    {
      field: "birth_date",
      headerName: "Data de nascimento",
      width: 200,
    },
    {
      field: "created_at",
      renderCell: ({ value }) =>
        format(
          parseISO(value ? value : new Date().toISOString()),
          "dd/MM/yyyy; HH:mm",
          {
            locale: ptBR,
          }
        ),
      headerName: "Criado em",

      width: 200,
    },
    {
      field: "edit",
      headerName: "",
      width: 60,
      renderCell: ({ row }) => (
        <IconButton onClick={() => navigate(`/edit/${row.id}`)}>
          <EditRounded />
        </IconButton>
      ),
    },
    {
      field: "delete",
      headerName: "",
      width: 60,
      renderCell: ({ row }) => {
        return (
          <IconButton onClick={() => deletePatient(row.id)}>
            <DeleteRounded />
          </IconButton>
        );
      },
    },
  ];

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div style={{ height: 950, width: "100%" }}>
      <DataGrid
        components={{
          Toolbar: SearchToolbar,
          NoRowsOverlay: () => (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
              }}
            >
              <h1>Nenhum paciente encontrado</h1>
            </div>
          ),
        }}
        columns={columns}
        rows={rows}
        isRowSelectable={() => false}
        componentsProps={{
          toolbar: {
            value: searchText,
            onChange: (event: React.ChangeEvent<HTMLInputElement>) =>
              searchPatient(event.target.value),
            clearSearch: () => searchPatient(""),
          },
        }}
        sortingOrder={["asc", "desc", null]}
        filterMode="server"
        disableColumnMenu
        initialState={{
          sorting: {
            sortModel: [{ field: "created_at", sort: "desc" }],
          },
        }}
        sx={{ width: "100%" }}
        pageSize={10}
        onPageSizeChange={(newPageSize) => {
          return newPageSize;
        }}
        rowsPerPageOptions={[10]}
        pagination
      />
    </div>
  );
}
