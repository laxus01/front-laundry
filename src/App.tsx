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
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
