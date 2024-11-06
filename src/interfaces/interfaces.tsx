export interface Vehicle {
    id: number;
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
    id: number;
    plate: string;
    client: string;
    phone: string;
    typeVehicleId: number;
}

export interface OptionsComboBoxAutoComplete {
  id: number;
  name: string;
  value?: number;
  client?: string;
}

export interface Service {
  uuid: string;
  id: number;
  name: string;
  value: number;
}

export interface Product {
  uuid: string;
  id: number;
  name: string;
  value: number;
  quantity: number;
}

export interface ListServices {
  id: number;
  service: string;
  value: number;
}

export interface ListProducts {
  id: number;
  product: string;
  saleValue: number;
}

export interface Washer {
  id: number;
  washer: string;
  phone: string;
}