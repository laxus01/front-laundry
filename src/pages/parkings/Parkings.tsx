import { useEffect, useState } from "react";
import TableComponent from "../../components/TableComponent";
import FilterParkingsModal, { ParkingFilter } from "../../components/FilterParkingsModal";
import {
  searchParkings,
  queryCreateParkingById,
  queryDeleteParkingById,
  queryEditParkingById,
  SearchParkingsParams,
} from "./services/Parking.services";
import ModalEditParking from "./components/ModalEditParking";
import ModalPaymentDetails from "./components/ModalPaymentDetails.tsx";
import { ParkingSelected } from "../../interfaces/interfaces";
import { useParkings } from "./hooks/useParkings";
import ConfirmDeleteModal from "../../components/ConfirmDeleteModal";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import SearchIcon from "@mui/icons-material/Search";
import PaymentIcon from "@mui/icons-material/Payment";
import FilterListIcon from "@mui/icons-material/FilterList";
import ClearIcon from "@mui/icons-material/Clear";
import { Tooltip, IconButton, Chip, Select, MenuItem, FormControl, InputLabel, CircularProgress, Box, Button, Typography } from "@mui/material";
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
  { id: "state", label: "Estado", minWidth: 150 },
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
  const [openFilterModal, setOpenFilterModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Active filters
  const [activeFilters, setActiveFilters] = useState<ParkingFilter[]>([]);
  
  // Pagination state
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  
  // Sorting state
  const [sortBy, setSortBy] = useState<string>('createAt');
  const [sortDirection, setSortDirection] = useState<'ASC' | 'DESC'>('DESC');

  const getListParkings = async () => {
    try {
      setLoading(true);
      const params: SearchParkingsParams = {
        page,
        limit,
        sortBy,
        sortDirection,
      };
      
      // Build params from active filters
      activeFilters.forEach(filter => {
        params[filter.field] = filter.value;
      });
      
      const response = await searchParkings(params);
      if (response && response.data) {
        const { items, meta } = response.data;
        
        const mappedData = items.map((item: any) => {
          const totalPayments = item.parkingPayments?.reduce((sum: number, payment: any) => sum + payment.value, 0) || 0;
          const balance = item.value - totalPayments;
          const isPaid = balance === 0;
          const statusText = isPaid ? "Pagado" : "Por Pagar";

          const parkingTypeText = item.typeParking.type;
          let parkingTypeColor: "primary" | "default" | "secondary" = "default";
          
          if (parkingTypeText === "DIA") {
            parkingTypeColor = "primary";
          } else if (parkingTypeText === "NOCHE") {
            parkingTypeColor = "default";
          } else if (parkingTypeText === "MENSUAL") {
            parkingTypeColor = "secondary";
          }

          return {
            id: item.id,
            plate: item.vehicle.plate,
            vehicleType: item.vehicle.typeVehicle.type,
            parkingType: (
              <Chip
                label={parkingTypeText}
                color={parkingTypeColor}
                variant="filled"
                size="small"
              />
            ),
            client: item.vehicle.client,
            phone: item.vehicle.phone,
            value: `$${formatPrice(item.value)}`,
            balance: `$${formatPrice(balance)}`,
            state: (
              <Chip
                label={statusText}
                color={isPaid ? "success" : "warning"}
                variant="filled"
                size="small"
              />
            ),
            startDate: dayjs(item.dateInitial).format('DD/MM/YYYY'),
            endDate: dayjs(item.dateFinal).format('DD/MM/YYYY'),
            vehicleId: item.vehicle.id,
            typeParkingId: item.typeParking.id,
            typeVehicleId: item.vehicle.typeVehicle.id,
            rawValue: item.value,
            rawDateInitial: item.dateInitial,
            rawDateFinal: item.dateFinal,
            paymentStatus: item.paymentStatus,
          };
        });
        
        setData(mappedData);
        setTotalItems(meta.totalItems);
        setTotalPages(meta.totalPages);
      } else {
        setData([]);
        setTotalItems(0);
        setTotalPages(0);
      }
    } catch (error: any) {
      console.error("Error loading parkings:", error);
      setData([]);
      setTotalItems(0);
      setTotalPages(0);
      showSnackbar("Error al cargar los parqueos", "error");
    } finally {
      setLoading(false);
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

  const handleApplyFilters = (filters: ParkingFilter[]) => {
    setActiveFilters(filters);
    setPage(1);
  };

  const handleClearFilters = () => {
    setActiveFilters([]);
    setSortBy('createAt');
    setSortDirection('DESC');
    setPage(1);
  };

  const handlePageChange = (_event: unknown, newPage: number) => {
    setPage(newPage + 1);
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLimit(parseInt(event.target.value, 10));
    setPage(1);
  };

  useEffect(() => {
    getListParkings();
  }, [page, limit, activeFilters, sortBy, sortDirection]);

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
      <FilterParkingsModal
        open={openFilterModal}
        onClose={() => setOpenFilterModal(false)}
        onApply={handleApplyFilters}
        initialFilters={activeFilters}
      />
      <div style={styleIconAdd}>
        <h2 className="color-lime">Parqueos</h2>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <Tooltip title="Agregar Parqueo">
            <AddCircleIcon
              style={{ fontSize: 40, color: "#9FB404", cursor: "pointer" }}
              onClick={openModalCreate}
            />
          </Tooltip>
          <Tooltip title="Filtrar Parqueos">
            <FilterListIcon
              style={{ fontSize: 40, color: "#9FB404", cursor: "pointer" }}
              onClick={() => setOpenFilterModal(true)}
            />
          </Tooltip>
        </div>
      </div>

      <Box sx={{ display: 'flex', gap: 2, mb: 2, px: 2.5, alignItems: 'center', flexWrap: 'wrap' }}>
        {/* Active Filters Display */}
        {activeFilters.length > 0 && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, flex: 1 }}>
            <Typography variant="body2" sx={{ alignSelf: 'center', mr: 1, fontWeight: 'bold' }}>
              Filtros activos:
            </Typography>
            {activeFilters.map((filter, index) => (
              <Chip
                key={index}
                label={filter.label}
                onDelete={() => {
                  setActiveFilters(activeFilters.filter((_, i) => i !== index));
                  setPage(1);
                }}
                color="primary"
                size="small"
              />
            ))}
          </Box>
        )}

        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Ordenar por</InputLabel>
          <Select
            value={sortBy}
            label="Ordenar por"
            onChange={(e) => {
              setSortBy(e.target.value);
              setPage(1);
            }}
          >
            <MenuItem value="createAt">Fecha de Creación</MenuItem>
            <MenuItem value="paymentStatus">Estado de Pago</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Dirección</InputLabel>
          <Select
            value={sortDirection}
            label="Dirección"
            onChange={(e) => {
              setSortDirection(e.target.value as 'ASC' | 'DESC');
              setPage(1);
            }}
          >
            <MenuItem value="DESC">Descendente</MenuItem>
            <MenuItem value="ASC">Ascendente</MenuItem>
          </Select>
        </FormControl>

        {activeFilters.length > 0 && (
          <Button
            variant="outlined"
            startIcon={<ClearIcon />}
            onClick={handleClearFilters}
            size="small"
          >
            Limpiar Filtros
          </Button>
        )}

        <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1 }}>
          <Chip 
            label={`${totalItems} registro${totalItems !== 1 ? 's' : ''}`} 
            color="primary" 
            size="small" 
          />
        </Box>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
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
          serverSidePagination={true}
          totalCount={totalItems}
          page={page - 1}
          rowsPerPage={limit}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          rowsPerPageOptions={[5, 10, 25, 50, 100]}
        />
      )}
    </>
  );
};
