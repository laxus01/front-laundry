export const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const environment = {
  auth: BASE_URL + "/auth/login",
  vehicles: BASE_URL + "/vehicles",
  washers: BASE_URL + "/washers",
  services: BASE_URL + "/services",
  products: BASE_URL + "/products",
  attentions: BASE_URL + "/attentions",
  sales: BASE_URL + "/sales",
  backup: BASE_URL + "/attentions/backup",
  parkings: BASE_URL + "/parkings",
  expenses: BASE_URL + "/expenses",
  shopping: BASE_URL + "/shopping",
  reports: BASE_URL + "/reports",
  clients: BASE_URL + "/clients",
  accountsReceivable: BASE_URL + "/accounts-receivable",
  accountsReceivablePayments: BASE_URL + "/accounts-receivable-payments",
  providers: BASE_URL + "/providers",
  accountsPayable: BASE_URL + "/accounts-payable",
  accountsPayablePayments: BASE_URL + "/accounts-payable-payments",
};
