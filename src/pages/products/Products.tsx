import { Tooltip } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import TableComponent from "../../components/TableComponent";
import { useEffect, useState } from "react";
import { getProducts } from "../attentions/services/Attentions.services";
import { ListProducts } from "../../interfaces/interfaces";
import { formatPrice } from "../../utils/utils";

const columns = [
  { id: "product", label: "Producto", minWidth: 200 },
  { id: "valueBuys", label: "Valor Compra", minWidth: 200 },
  { id: "saleValue", label: "Valor Venta", minWidth: 200 },
  { id: "existence", label: "Existencia", minWidth: 200 },
];

export const Products = () => {
  const [data, setData] = useState([]);

  const styleIconAdd = {
    display: "flex",
    alignItems: "center",
    padding: "20px",
  };

  const openModalEdit = (row: any) => {
    console.log(row);
  };

  const openModalDelete = (row: any) => {
    console.log(row);
  };

  const getListProducts = async () => {
    const response = await getProducts();
    if (response) {
      const data = response.data.map((item: ListProducts) => {
        return {
          product: item.product,
          valueBuys: formatPrice(item.valueBuys),
          saleValue: formatPrice(item.saleValue),
          existence: item.existence,
        };
      });
      setData(data);
    }
  };

  useEffect(() => {
    getListProducts();
  }, []);

  return (
    <>
      <div style={styleIconAdd}>
        <h2 className="color-lime">Productos</h2>
        <div>
          <Tooltip title="Agregar Vehículo">
            <AddCircleIcon
              style={{ fontSize: 40, color: "#9FB404", cursor: "pointer" }}
              onClick={() => {}}
            />
          </Tooltip>
        </div>
      </div>

      <TableComponent
        columns={columns}
        data={data}
        onEdit={openModalEdit}
        onDelete={openModalDelete}
      />
    </>
  );
};
