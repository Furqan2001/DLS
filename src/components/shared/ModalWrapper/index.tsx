import { ReactNode } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { SxProps } from "@mui/material";

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

interface IProps {
  bodyContainerSx?: SxProps;
  open: boolean;
  setClose: () => void;
  children: ReactNode | ReactNode[];
}

const ModalWrapper = ({
  open,
  setClose,
  children,
  bodyContainerSx,
}: IProps) => {
  return (
    <div>
      <Modal
        open={open}
        onClose={setClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        disableAutoFocus
        disableEnforceFocus
      >
        <Box sx={{ ...style, ...(bodyContainerSx || {}) }}>{children}</Box>
      </Modal>
    </div>
  );
};

export default ModalWrapper;
