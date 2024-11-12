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
  quantity?: number;
}

export interface Service {
  id: number;
  name: string;
  value: number;
}

export interface Product {
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

export interface Attention {
  attentionId: string;
  vehicle: OptionsComboBoxAutoComplete;
  washer: OptionsComboBoxAutoComplete;
  percentage: number;
  services: Service[];
  products: Product[];
}