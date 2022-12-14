import { CircularProgress } from "@mui/material";

export function Loading() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        marginTop: 100,
      }}
    >
      <CircularProgress size={100} />
    </div>
  );
}
