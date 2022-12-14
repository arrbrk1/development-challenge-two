import { Snackbar, Alert } from "@mui/material";

interface SuccessToastProps {
  handleClose: () => void;
  open: boolean;
}

export function SuccessToast({ handleClose, open }: SuccessToastProps) {
  return (
    <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
      <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
        This is a success message!
      </Alert>
    </Snackbar>
  );
}
