import { Button, Modal, Box, Typography } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

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

interface ConfirmPaymentModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  washerName: string;
  amount: string;
}

const ConfirmPaymentModal: React.FC<ConfirmPaymentModalProps> = ({
  open,
  onClose,
  onConfirm,
  washerName,
  amount,
}) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="confirm-payment-title"
      aria-describedby="confirm-payment-description"
    >
      <Box sx={style}>
        <Typography id="confirm-payment-title" variant="h6" component="h2" gutterBottom>
          Confirmar Pago
        </Typography>
        <Typography id="confirm-payment-description" sx={{ mt: 2, mb: 3 }}>
          ¿Está seguro que desea marcar como pagada la deuda de <strong>{washerName}</strong> por un monto de <strong>{amount}</strong>?
        </Typography>
        <Box display="flex" justifyContent="space-around" mt={3}>
          <Button
            variant="contained"
            onClick={onClose}
            sx={{ bgcolor: "#FF3040", "&:hover": { bgcolor: "#d02636" } }}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<CheckCircleIcon />}
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            Confirmar Pago
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ConfirmPaymentModal;
