import { Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Dashboard } from "./pages/dashboard/Dashboard";
import { Vehicles } from "./pages/vehicles/Vehicles";
import { Attentions } from "./pages/attentions/Attentions";
import Login from "./pages/login/Login";
import { Washers } from "./pages/washers/Washers";

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
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
