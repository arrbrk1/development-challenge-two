import { CloseRounded } from "@mui/icons-material";
import { Box, DialogTitle, IconButton, Modal } from "@mui/material";
import React, { Attributes } from "react";

interface InputModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  children: React.ReactNode;
}

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

export function InputModal({ open, setOpen, children }: InputModalProps) {
  const handleClose = () => setOpen(false);

  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { setOpen } as Attributes);
    }
    return child;
  });

  if (open) {
    return (
      <div>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <DialogTitle sx={{ display: "flex", alignItems: "center" }}>
              <IconButton
                sx={{ ml: "285px", mt: "-30px" }}
                onClick={handleClose}
              >
                <CloseRounded />
              </IconButton>
            </DialogTitle>
            {childrenWithProps}
          </Box>
        </Modal>
      </div>
    );
  }

  return <div />;
}
