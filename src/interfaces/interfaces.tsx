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
  state: number;
  createAt: string;
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

// Interfaces for Washer Activity Report
export interface WasherActivityAttention {
  id: string;
  percentage: number;
  createAt: string;
  washerProfit: number;
  vehicleId: {
    id: string;
    plate: string;
    client: string;
    phone: string;
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
  saleServices: {
    id: string;
    createAt: string;
    value: number;
    serviceId: {
      id: string;
      service: string;
      value: number;
      state: number;
      createAt: string;
    };
  }[];
}

export interface WasherActivitySale {
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
  attentionId: {
    id: string;
    percentage: number;
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

export interface WasherActivitySaleService {
  id: string;
  createAt: string;
  value: number;
  serviceId: {
    id: string;
    service: string;
    value: number;
    state: number;
    createAt: string;
  };
}

export interface WasherActivityReport {
  date: string;
  washerId: string;
  attentions: WasherActivityAttention[];
  sales: WasherActivitySale[];
  saleServices: WasherActivitySaleService[];
  summary: {
    totalAttentions: number;
    totalSales: number;
    totalSaleServices: number;
  };
}

export interface Client {
  id: string;
  client: string;
  phone?: string;
  state?: number;
  createAt?: string;
}

export interface AccountReceivable {
  id: string;
  value: number;
  date: string;
  detail: string;
  clientId: Client;
  createAt?: string;
}

export interface AccountReceivableSelected {
  id: string;
  value: number;
  date: string;
  detail: string;
  clientId: string;
  clientName?: string;
}

export interface AccountReceivablePayment {
  id: string;
  date: string;
  value: number;
  detail: string;
  createAt: string;
  accountsReceivableId: string;
  accountsReceivable?: {
    id: string;
    value: number;
    date: string;
    detail: string;
    clientId: string;
    createAt: string;
  };
}

export interface EditingAccountReceivablePayment {
  id: string;
  date: string;
  value: number;
  detail: string;
}

export interface Provider {
  id: string;
  provider: string;
  phone?: string;
  state?: number;
  createAt?: string;
}

export interface AccountPayable {
  id: string;
  value: number;
  date: string;
  detail: string;
  providerId: Provider;
  createAt?: string;
}

export interface AccountPayableSelected {
  id: string;
  value: number;
  date: string;
  detail: string;
  providerId: string;
  providerName?: string;
}

export interface AccountPayablePayment {
  id: string;
  date: string;
  value: number;
  detail: string;
  createAt: string;
  accountsPayableId: string;
  accountsPayable?: {
    id: string;
    value: number;
    date: string;
    detail: string;
    providerId: string;
    createAt: string;
  };
}

export interface EditingAccountPayablePayment {
  id: string;
  date: string;
  value: number;
  detail: string;
}
