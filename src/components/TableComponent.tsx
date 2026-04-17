import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Tooltip } from "@mui/material";

interface Column {
  id: string;
  label: string;
  minWidth?: number;
  align?: any;
  format?: (value: any) => string;
}

interface TableComponentProps {
  columns: Column[];
  data: any[];
  edit?: boolean;
  onEdit: (row: any) => void;
  onDelete: (row: any) => void;
  paginationEnabled?: boolean;
  emptyDataMessage?: string;
  customActions?: (row: any) => React.ReactNode;
  // Server-side pagination props
  serverSidePagination?: boolean;
  totalCount?: number;
  page?: number;
  rowsPerPage?: number;
  onPageChange?: (event: unknown, newPage: number) => void;
  onRowsPerPageChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  rowsPerPageOptions?: number[];
}

export default function TableComponent({
  columns,
  data,
  edit = true,
  onEdit,
  onDelete,
  paginationEnabled = true,
  emptyDataMessage = "",
  customActions,
  serverSidePagination = false,
  totalCount,
  page: controlledPage,
  rowsPerPage: controlledRowsPerPage,
  onPageChange: externalOnPageChange,
  onRowsPerPageChange: externalOnRowsPerPageChange,
  rowsPerPageOptions = [5, 10, 25, 50, 100],
}: TableComponentProps) {
  const [internalPage, setInternalPage] = React.useState(0);
  const [internalRowsPerPage, setInternalRowsPerPage] = React.useState(10);

  const page = serverSidePagination ? (controlledPage ?? 0) : internalPage;
  const rowsPerPage = serverSidePagination ? (controlledRowsPerPage ?? 10) : internalRowsPerPage;
  const count = serverSidePagination ? (totalCount ?? 0) : data.length;

  const handleChangePage = (event: unknown, newPage: number) => {
    if (serverSidePagination && externalOnPageChange) {
      externalOnPageChange(event, newPage);
    } else {
      setInternalPage(newPage);
    }
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (serverSidePagination && externalOnRowsPerPageChange) {
      externalOnRowsPerPageChange(event);
    } else {
      setInternalRowsPerPage(+event.target.value);
      setInternalPage(0);
    }
  };

  const displayedData = serverSidePagination || !paginationEnabled
    ? data
    : data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                  sx={{
                    backgroundColor: "#333",
                    color: "#ffffff",
                    fontWeight: "bold",
                    padding: "6px",
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
              <TableCell
                key="actions"
                align="center"
                sx={{
                  backgroundColor: "#333",
                  color: "#ffffff",
                  fontWeight: "bold",
                  padding: "6px",
                }}
              >
                Acciones
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.length > 0 ? (
              displayedData.map((row, rowIndex) => {
                return (
                  <TableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={rowIndex}
                  >
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell
                          key={column.id}
                          align={column.align}
                          sx={{ padding: "6px" }}
                        >
                          {column.format && typeof value === "number"
                            ? column.format(value)
                            : value}
                        </TableCell>
                      );
                    })}
                    <TableCell
                      key="actions"
                      align="center"
                      sx={{ padding: "6px" }}
                    >
                      {customActions && customActions(row)}
                      {edit && (
                        <Tooltip title="Editar">
                          <IconButton
                            onClick={() => onEdit(row)}
                            aria-label="edit"
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                      <Tooltip title="Eliminar">
                        <IconButton
                          onClick={() => onDelete(row)}
                          aria-label="delete"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })
            ) : (
              <TableRow>
                <TableCell 
                  colSpan={columns.length + 1} 
                  align="center"
                  sx={{ padding: "20px", fontStyle: "italic", color: "#666" }}
                >
                  {emptyDataMessage || "No hay datos disponibles"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {paginationEnabled && (serverSidePagination ? count > 0 : data.length > 0) && (
        <TablePagination
          rowsPerPageOptions={rowsPerPageOptions}
          component="div"
          count={count}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Filas por página"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
        />
      )}
    </Paper>
  );
}
