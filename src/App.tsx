import { Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Dashboard } from "./pages/dashboard/Dashboard";
import { Vehicle } from "./pages/vehicles/Vehicle";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/dashboard"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <Dashboard />
            </Suspense>
          }
        >
          <Route
            path="/dashboard/vehicles"
            element={<Vehicle />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;