import { Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Dashboard } from "./pages/dashboard/Dashboard";
import { Vehicle } from "./pages/vehicles/Vehicle";
import { Attentions } from "./pages/attentions/Attentions";
import Login from "./pages/login/Login";

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
          <Route
            path="/dashboard/vehicles"
            element={<Vehicle />}
          />
          <Route
            path="/dashboard/attentions"
            element={<Attentions />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;