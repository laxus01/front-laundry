export interface Vehicle {
  id: string;
  plate: string;
  client: string;
  phone: string;
  createAt: string;
  typeVehicle: {
    id: number;
    type: string;
  };
}

export interface VehicleSelected {
  id: string;
  plate: string;
  client: string;
  phone: string;
  typeVehicleId: number;
}

export interface OptionsComboBoxAutoComplete {
  id: string;
  name: string;
  value?: number;
  client?: string;
  quantity?: number;
}

export interface Service {
  id: string;
  service: string;
  value: number;
}

export interface Product {
  id: string;
  product: string;
  valueBuys: number;
  saleValue: number;
  existence: number;
}

export interface Sale {
    id: string;
  quantity: number;
    productId: string;
    date?: string;
    washerId?: string;
}

export interface ListSales {
  id: string;
  quantity: number;
  createAt: string;
  productId: {
    id: string;
    product: string;
    valueBuys: number;
    saleValue: number;
    existence: number;
    state: number;
    createAt: string;
  };
  washerId: {
    id: string;
    washer: string;
    phone: string;
    state: number;
    createAt: string;
  };
}

export interface ListServices {
  id: string;
  service: string;
  value: number;
}

export interface ListProducts {
  id: string;
  product: string;
  saleValue: number;
  valueBuys: number;
  existence: number;
}

export interface Washer {
  id: string;
  washer: string;
  phone: string;
}

//export interface Product {

export interface Attention {
  attentionId: string;
  vehicle: OptionsComboBoxAutoComplete;
  washer: OptionsComboBoxAutoComplete;
  percentage: number;
  services: Service[];
  products: Product[];
}

export interface Parking {
  id: string;
  plate: string;
  vehicleType: string;
  client: string;
  phone: string;
  balance: number;
  startDate: string;
  endDate: string;
  createAt: string;
}

export interface ParkingSelected {
  id: string;
  plate: string;
  vehicleType: string;
  client: string;
  phone: string;
  balance: number;
  startDate: string;
  endDate: string;
  value?: number;
  vehicleId?: string;
  typeParkingId?: string;
}

export interface ParkingPayment {
  id: string;
  paymentDate: string;
  amount: number;
  detail: string;
  parkingId: string;
}
