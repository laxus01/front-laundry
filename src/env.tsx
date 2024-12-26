export const BASE_URL = "https://back-laundry-production.up.railway.app/:4000";

export const environment = {
  auth: BASE_URL + "/auth/login",
  vehicles: BASE_URL + "/vehicles",
  washers: BASE_URL + "/washers",
  services: BASE_URL + "/services",
  products: BASE_URL + "/products",
  attentions: BASE_URL + "/attentions",
  sales: BASE_URL + "/sales",
  backup: BASE_URL + "/attentions/backup",
};
