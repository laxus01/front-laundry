import { Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Dashboard } from "./pages/dashboard/Dashboard";
import { Vehicles } from "./pages/vehicles/Vehicles";
import { Attentions } from "./pages/attentions/Attentions";
import Login from "./pages/login/Login";
import { Washers } from "./pages/washers/Washers";
import { Products } from "./pages/products/Products";
import { Services } from "./pages/services/Services";
import { Sales } from "./pages/sales/Sales";
import { Parkings } from "./pages/parkings";
import { Expenses } from "./pages/expenses";
import { Shopping } from "./pages/shopping";
import { WasherActivityReport } from "./pages/reports";
import { AccountsReceivable } from "./pages/accountsReceivable";
import { AccountsPayable } from "./pages/accountsPayable/AccountsPayable";
import GlobalSnackbar from "./components/GlobalSnackbar";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <Login />
            </Suspense>
          }
        />
        <Route
          path="/dashboard"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <Dashboard />
            </Suspense>
          }
        >
          <Route path="/dashboard/vehicles" element={<Vehicles />} />
          <Route path="/dashboard/attentions" element={<Attentions />} />
          <Route path="/dashboard/washers" element={<Washers />} />
          <Route path="/dashboard/products" element={<Products />} />
          <Route path="/dashboard/services" element={<Services />} />
          <Route path="/dashboard/sales" element={<Sales />} />
          <Route path="/dashboard/parkings" element={<Parkings />} />
          <Route path="/dashboard/expenses" element={<Expenses />} />
          <Route path="/dashboard/shopping" element={<Shopping />} />
          <Route path="/dashboard/reports/washer-activity" element={<WasherActivityReport />} />
          <Route path="/dashboard/accounts-receivable" element={<AccountsReceivable />} />
          <Route path="/dashboard/accounts-payable" element={<AccountsPayable />} />
        </Route>
      </Routes>
      <GlobalSnackbar />
    </BrowserRouter>
  );
}

export default App;
