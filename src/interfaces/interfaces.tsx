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
  name: string;
  value: number;
}

export interface Product {
  id: string;
  name: string;
  value: number;
  quantity: number;
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

export interface Attention {
  attentionId: string;
  vehicle: OptionsComboBoxAutoComplete;
  washer: OptionsComboBoxAutoComplete;
  percentage: number;
  services: Service[];
  products: Product[];
}
