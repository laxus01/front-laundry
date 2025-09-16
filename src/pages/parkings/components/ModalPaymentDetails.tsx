import {
  Button,
  Modal,
  Box,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import SaveIcon from "@mui/icons-material/Save";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState, useEffect } from "react";
import { getParkingPayments, queryCreatePayment, queryEditPayment, queryDeletePayment } from "../services/Parking.services";
import { useSnackbar } from "../../../contexts/SnackbarContext";
import DatePickerComponent from "../../../components/DatePickerComponent";
import { formatMoneyInput, moneyToInteger, formatPrice } from "../../../utils/utils";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 700,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  maxHeight: "90vh",
  overflow: "auto",
};

interface Payment {
  id: string;
  date: string;
  value: number;
  detail: string;
  createAt: string;
  parkingId: string;
  parking?: {
    id: string;
    dateInitial: string;
    dateFinal: string;
    value: number;
    paymentStatus: number;
    state: number;
    createAt: string;
    typeParkingId: string;
    vehicleId: string;
  };
}

interface EditingPayment {
  id: string;
  date: string;
  value: number;
  detail: string;
}

interface ModalPaymentDetailsProps {
  openModal: boolean;
  handleClose: () => void;
  parkingData: any;
  onPaymentChange?: () => void;
}

const ModalPaymentDetails: React.FC<ModalPaymentDetailsProps> = ({
  openModal,
  handleClose,
  parkingData,
  onPaymentChange,
}) => {
  const { showSnackbar } = useSnackbar();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [showAddPayment, setShowAddPayment] = useState(false);
  const [editingPayment, setEditingPayment] = useState<EditingPayment | null>(null);
  const [newPayment, setNewPayment] = useState({
    paymentDate: new Date().toISOString().split('T')[0],
    amount: 0,
    detail: "",
  });
  const [valueFormatted, setValueFormatted] = useState<string>("");
  const [editValueFormatted, setEditValueFormatted] = useState<string>("");

  const getPayments = async () => {
    if (parkingData.id) {
      try {
        const response = await getParkingPayments(parkingData.id);
        if (response?.data) {
          setPayments(response.data);
        }
      } catch (error) {
        console.error("Error loading payments:", error);
      }
    }
  };

  const handleAddPayment = async () => {
    try {
      const payload = {
        date: newPayment.paymentDate,
        value: newPayment.amount,
        detail: newPayment.detail,
        parkingId: parkingData.id,
      };
      
      const response = await queryCreatePayment(payload);
      if (response?.data) {
        getPayments();
        onPaymentChange?.();
        setShowAddPayment(false);
        setNewPayment({
          paymentDate: new Date().toISOString().split('T')[0],
          amount: 0,
          detail: "",
        });
        setValueFormatted("");
        showSnackbar("Pago agregado exitosamente", "success");
      }
    } catch (error: any) {
      showSnackbar(error.message || "Error al agregar el pago", "error");
    }
  };

  const validatePayment = () => {
    return newPayment.amount <= 0 || newPayment.detail.trim() === "";
  };

  const validateEditPayment = () => {
    return !editingPayment || editingPayment.value <= 0 || editingPayment.detail.trim() === "";
  };

  const handleEditPayment = (payment: Payment) => {
    setEditingPayment({
      id: payment.id,
      date: new Date(payment.date).toISOString().split('T')[0],
      value: payment.value,
      detail: payment.detail,
    });
    // Initialize formatted value for editing
    setEditValueFormatted(formatMoneyInput(payment.value.toString()));
  };

  const handleUpdatePayment = async () => {
    if (!editingPayment) return;
    
    try {
      const payload = {
        value: editingPayment.value,
        detail: editingPayment.detail,
      };
      
      const response = await queryEditPayment(editingPayment.id, payload);
      if (response?.data) {
        getPayments();
        onPaymentChange?.();
        setEditingPayment(null);
        setEditValueFormatted("");
        showSnackbar("Pago actualizado exitosamente", "success");
      }
    } catch (error: any) {
      showSnackbar(error.message || "Error al actualizar el pago", "error");
    }
  };

  const handleDeletePayment = async (paymentId: string) => {
    try {
      const response = await queryDeletePayment(paymentId);
      if (response?.data) {
        getPayments();
        onPaymentChange?.();
        showSnackbar("Pago eliminado exitosamente", "success");
      }
    } catch (error: any) {
      showSnackbar(error.message || "Error al eliminar el pago", "error");
    }
  };

  const handleCancelEdit = () => {
    setEditingPayment(null);
  };

  useEffect(() => {
    if (openModal && parkingData.id) {
      getPayments();
      // Reset formatted values when modal opens
      setValueFormatted("");
      setEditValueFormatted("");
    }
  }, [openModal, parkingData.id]);

  return (
    <Modal
      open={openModal}
      onClose={handleClose}
      aria-labelledby="payment-modal-title"
      aria-describedby="payment-modal-description"
    >
      <Box sx={style}>
        <Typography id="payment-modal-title" variant="h6" component="h2" mb={2}>
          Detalles de Pagos - {parkingData.plate}
        </Typography>
        
        <Box mb={2}>
          <Typography variant="body1"><strong>Cliente:</strong> {parkingData.client}</Typography>
          <Typography variant="body1"><strong>Teléfono:</strong> {parkingData.phone}</Typography>
          <Typography variant="body1"><strong>Saldo Actual:</strong> {parkingData.balance}</Typography>
        </Box>

        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Historial de Pagos</Typography>
          <Tooltip title="Agregar Pago">
            <IconButton
              onClick={() => setShowAddPayment(!showAddPayment)}
              color="primary"
            >
              <AddCircleIcon />
            </IconButton>
          </Tooltip>
        </Box>

        {showAddPayment && (
          <Box mb={3} p={2} border={1} borderColor="grey.300" borderRadius={1}>
            <Typography variant="subtitle1" mb={2}>Nuevo Pago</Typography>
            <Box display="flex" flexDirection="column" gap={2}>
              <DatePickerComponent
                label="Fecha del Pago"
                value={newPayment.paymentDate ? new Date(newPayment.paymentDate) : null}
                onChange={(date) =>
                  setNewPayment({ ...newPayment, paymentDate: date ? date.toISOString().split('T')[0] : '' })
                }
                required
                maxDate={new Date()}
              />
              <TextField
                label="Valor"
                variant="outlined"
                value={valueFormatted}
                onChange={(e) => {
                  const formatted = formatMoneyInput(e.target.value);
                  setValueFormatted(formatted);
                  setNewPayment({ ...newPayment, amount: moneyToInteger(formatted) });
                }}
                fullWidth
              />
              <TextField
                label="Detalle"
                multiline
                rows={2}
                value={newPayment.detail}
                onChange={(e) =>
                  setNewPayment({ ...newPayment, detail: e.target.value })
                }
                fullWidth
              />
              <Box display="flex" gap={2}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<SaveIcon />}
                  onClick={handleAddPayment}
                  disabled={validatePayment()}
                >
                  Guardar Pago
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => setShowAddPayment(false)}
                >
                  Cancelar
                </Button>
              </Box>
            </Box>
          </Box>
        )}

        <TableContainer component={Paper} sx={{ maxHeight: 300 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ backgroundColor: "#333", color: "#ffffff", fontWeight: "bold" }}>
                  Fecha del Pago
                </TableCell>
                <TableCell sx={{ backgroundColor: "#333", color: "#ffffff", fontWeight: "bold" }}>
                  Valor
                </TableCell>
                <TableCell sx={{ backgroundColor: "#333", color: "#ffffff", fontWeight: "bold" }}>
                  Detalle
                </TableCell>
                <TableCell sx={{ backgroundColor: "#333", color: "#ffffff", fontWeight: "bold" }}>
                  Acciones
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {payments.length > 0 ? (
                payments.map((payment) => (
                  <TableRow key={payment.id} hover>
                    <TableCell>
                      {editingPayment?.id === payment.id ? (
                        <DatePickerComponent
                          label=""
                          value={editingPayment.date ? new Date(editingPayment.date) : null}
                          onChange={(date) =>
                            setEditingPayment({ ...editingPayment, date: date ? date.toISOString().split('T')[0] : '' })
                          }
                        />
                      ) : (
                        new Date(payment.date).toLocaleDateString()
                      )}
                    </TableCell>
                    <TableCell>
                      {editingPayment?.id === payment.id ? (
                        <TextField
                          variant="outlined"
                          value={editValueFormatted}
                          onChange={(e) => {
                            const formatted = formatMoneyInput(e.target.value);
                            setEditValueFormatted(formatted);
                            setEditingPayment({ ...editingPayment, value: moneyToInteger(formatted) });
                          }}
                          size="small"
                          fullWidth
                        />
                      ) : (
                        `$${formatPrice(payment.value)}`
                      )}
                    </TableCell>
                    <TableCell>
                      {editingPayment?.id === payment.id ? (
                        <TextField
                          value={editingPayment.detail}
                          onChange={(e) =>
                            setEditingPayment({ ...editingPayment, detail: e.target.value })
                          }
                          size="small"
                          fullWidth
                        />
                      ) : (
                        payment.detail
                      )}
                    </TableCell>
                    <TableCell>
                      {editingPayment?.id === payment.id ? (
                        <Box display="flex" gap={1}>
                          <Tooltip title="Guardar">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={handleUpdatePayment}
                              disabled={validateEditPayment()}
                            >
                              <CheckIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Cancelar">
                            <IconButton
                              size="small"
                              color="secondary"
                              onClick={handleCancelEdit}
                            >
                              <CloseIcon />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      ) : (
                        <Box display="flex" gap={1}>
                          <Tooltip title="Editar">
                            <IconButton
                              size="small"
                              onClick={() => handleEditPayment(payment)}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Eliminar">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDeletePayment(payment.id)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No hay pagos registrados
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Box display="flex" justifyContent="center" mt={3}>
          <Button
            variant="contained"
            onClick={handleClose}
            sx={{ bgcolor: "#FF3040", "&:hover": { bgcolor: "#d02636" } }}
          >
            Cerrar
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ModalPaymentDetails;
