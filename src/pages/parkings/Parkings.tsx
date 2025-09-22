import { useEffect, useState } from "react";
import TableComponent from "../../components/TableComponent";
import ModalDateRangeSearch from "../../components/ModalDateRangeSearch";
import {
  getParkings,
  queryCreateParkingById,
  queryDeleteParkingById,
  queryEditParkingById,
} from "./services/Parking.services";
import ModalEditParking from "./components/ModalEditParking";
import ModalPaymentDetails from "./components/ModalPaymentDetails.tsx";
import { ParkingSelected } from "../../interfaces/interfaces";
import { useParkings } from "./hooks/useParkings";
import ConfirmDeleteModal from "../../components/ConfirmDeleteModal";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import SearchIcon from "@mui/icons-material/Search";
import PaymentIcon from "@mui/icons-material/Payment";
import { Tooltip, IconButton } from "@mui/material";
import { useSnackbar } from "../../contexts/SnackbarContext";
import { formatPrice } from "../../utils/utils";
import dayjs from "dayjs";

const columns = [
  { id: "plate", label: "Placa", minWidth: 150 },
  { id: "vehicleType", label: "Tipo Vehículo", minWidth: 150 },
  { id: "parkingType", label: "Tipo Parqueo", minWidth: 150 },
  { id: "client", label: "Cliente", minWidth: 150 },
  { id: "phone", label: "Teléfono", minWidth: 150 },
  { id: "value", label: "Valor", minWidth: 100 },
  { id: "balance", label: "Saldo", minWidth: 100 },
  { id: "startDate", label: "Fecha Inicial", minWidth: 150 },
  { id: "endDate", label: "Fecha Final", minWidth: 150 },
];

const styleIconAdd = {
  display: "flex",
  alignItems: "center",
  padding: "20px",
};

export const Parkings = () => {
  const parkings = useParkings();
  const { defaultParking, dataParking, setDataParking } = parkings;
  const { showSnackbar } = useSnackbar();

  const [data, setData] = useState<any[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [openPaymentModal, setOpenPaymentModal] = useState(false);
  const [openDateRangeModal, setOpenDateRangeModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);
  
  // Current month date range for initial load
  const [startDate] = useState(dayjs().startOf('month').format('YYYY-MM-DD'));
  const [endDate] = useState(dayjs().endOf('month').format('YYYY-MM-DD'));

  const getListParkings = async (searchStartDate?: string, searchEndDate?: string) => {
    try {
      const dateStart = searchStartDate || startDate;
      const dateEnd = searchEndDate || endDate;
      
      const response = await getParkings(dateStart, dateEnd);
      if (response && response.data && Array.isArray(response.data)) {
        const data = response.data.map((item: any) => {
          // Calculate balance: total value minus sum of payments
          const totalPayments = item.parkingPayments?.reduce((sum: number, payment: any) => sum + payment.value, 0) || 0;
          const balance = item.value - totalPayments;
          
          return {
            id: item.id,
            plate: item.vehicle.plate,
            vehicleType: item.vehicle.typeVehicle.type,
            parkingType: item.typeParking.type,
            client: item.vehicle.client,
            phone: item.vehicle.phone,
            value: `$${formatPrice(item.value)}`,
            balance: `$${formatPrice(balance)}`,
            startDate: dayjs(item.dateInitial).format('DD/MM/YYYY'),
            endDate: dayjs(item.dateFinal).format('DD/MM/YYYY'),
            // Store original IDs and data for editing
            vehicleId: item.vehicle.id,
            typeParkingId: item.typeParking.id,
            typeVehicleId: item.vehicle.typeVehicle.id,
            rawValue: item.value,
            rawDateInitial: item.dateInitial,
            rawDateFinal: item.dateFinal,
          };
        });
        setData(data);
      } else {
        setData([]);
      }
    } catch (error: any) {
      console.error("Error loading parkings:", error);
      setData([]);
      showSnackbar("Error al cargar los parqueos", "error");
    }
  };

  const handleCreate = async () => {
    try {
      console.log('dataParking before creating payload:', dataParking);
      
      const payload = {
        dateInitial: dataParking.startDate,
        dateFinal: dataParking.endDate,
        value: dataParking.value,
        paymentStatus: 1,
        state: 1,
        vehicleId: dataParking.vehicleId,
        typeParkingId: dataParking.typeParkingId,
      };
      
      console.log('Final payload being sent:', payload);
      
      const response = await queryCreateParkingById(payload);
      if (response.data) {
        getListParkings();
        setOpenModal(false);
        setDataParking(defaultParking);
        showSnackbar(response.data.message || "Parqueo creado exitosamente", "success");
      }
    } catch (error: any) {
      showSnackbar(error.message || "Error al crear el parqueo", "error");
    }
  };

  const handleEdit = async () => {
    try {
      const payload = {
        dateInitial: dataParking.startDate,
        dateFinal: dataParking.endDate,
        value: dataParking.value,
        paymentStatus: 2,
        state: 1,
        vehicleId: dataParking.vehicleId,
        typeParkingId: dataParking.typeParkingId,
      };
      
      const response = await queryEditParkingById(dataParking.id, payload);
      if (response) {
        getListParkings();
        setOpenModal(false);
        setDataParking(defaultParking);
        showSnackbar("Parqueo actualizado exitosamente", "success");
      }
    } catch (error: any) {
      showSnackbar(error.message || "Error al actualizar el parqueo", "error");
    }
  };

  const handleClose = () => {
    setOpenModal(false);
  };

  const handleClosePaymentModal = () => {
    setOpenPaymentModal(false);
  };

  const openModalCreate = () => {
    setIsEditing(false);
    setDataParking(defaultParking);
    setOpenModal(true);
  };

  const openModalEdit = (row: any) => {
    setIsEditing(true);
    // Convert formatted data back to raw data for editing
    const editData = {
      ...row,
      balance: typeof row.balance === 'string' 
        ? parseFloat(row.balance.replace('$', '').replace(',', ''))
        : row.balance,
      value: row.rawValue || (typeof row.value === 'string' 
        ? parseFloat(row.value.replace('$', '').replace(',', ''))
        : row.value),
      startDate: row.rawDateInitial ? dayjs(row.rawDateInitial).format('YYYY-MM-DD') : dayjs(row.startDate).format('YYYY-MM-DD'),
      endDate: row.rawDateFinal ? dayjs(row.rawDateFinal).format('YYYY-MM-DD') : dayjs(row.endDate).format('YYYY-MM-DD'),
      // Set the original IDs and vehicle type for editing
      vehicleId: row.vehicleId || '',
      typeParkingId: row.typeParkingId || '',
      vehicleType: row.typeVehicleId || '',
      // Add vehicle data that's already available to avoid API call
      typeVehicleId: row.typeVehicleId || '',
      // Ensure parking type is properly set for the select
      parkingTypeId: row.typeParkingId || '',
    };
    console.log('Edit data being set:', editData);
    setDataParking(editData);
    setOpenModal(true);
  };

  const openModalDelete = (row: ParkingSelected) => {
    setDataParking(row);
    setModalDelete(true);
  };

  const openPaymentDetails = (row: ParkingSelected) => {
    setDataParking(row);
    setOpenPaymentModal(true);
  };

  const handleDelete = async () => {
    try {
      const response = await queryDeleteParkingById(dataParking.id);
      if (response) {
        setDataParking(defaultParking);
        getListParkings();
        setModalDelete(false);
        showSnackbar("Parqueo eliminado exitosamente", "success");
      }
    } catch (error: any) {
      showSnackbar(error.message || "Error al eliminar el parqueo", "error");
    }
  };

  const handleDateSearch = () => {
    getListParkings(startDate, endDate);
  };

  useEffect(() => {
    getListParkings();
  }, []);

  return (
    <>
      <ModalEditParking
        isEditing={isEditing}
        openModal={openModal}
        handleCreate={handleCreate}
        handleEdit={handleEdit}
        handleClose={handleClose}
        parkings={parkings}
      />
      <ModalPaymentDetails
        openModal={openPaymentModal}
        handleClose={handleClosePaymentModal}
        parkingData={dataParking}
        onPaymentChange={getListParkings}
      />
      <ConfirmDeleteModal
        openModalDelete={modalDelete}
        handleDelete={handleDelete}
        handleCloseDelete={() => setModalDelete(false)}
      />
      <ModalDateRangeSearch
        open={openDateRangeModal}
        onClose={() => setOpenDateRangeModal(false)}
        onSearch={handleDateSearch}
        title="Buscar por Fecha"
        initialStartDate={startDate}
        initialEndDate={endDate}
      />
      <div style={styleIconAdd}>
        <h2 className="color-lime">Parqueos</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Tooltip title="Agregar Parqueo">
            <AddCircleIcon
              style={{ fontSize: 40, color: "#9FB404", cursor: "pointer" }}
              onClick={openModalCreate}
            />
          </Tooltip>
          <Tooltip title="Buscar por Fecha">
            <SearchIcon
              style={{ fontSize: 40, color: "#9FB404", cursor: "pointer" }}
              onClick={() => setOpenDateRangeModal(true)}
            />
          </Tooltip>
        </div>
      </div>

      <TableComponent
        columns={columns}
        data={data}
        onEdit={openModalEdit}
        onDelete={openModalDelete}
        emptyDataMessage="No hay parqueos registrados"
        customActions={(row: any) => (
          <Tooltip title="Ver Pagos">
            <IconButton
              onClick={() => openPaymentDetails(row)}
              aria-label="payments"
            >
              <PaymentIcon />
            </IconButton>
          </Tooltip>
        )}
      />
    </>
  );
};
