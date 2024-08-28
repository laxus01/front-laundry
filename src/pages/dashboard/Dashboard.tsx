import { Header } from "./components/Header";
import "./styles/dashboard.scss";

export const Dashboard = () => {
  return (
    <>
      <div className="dashboard">
        <div className="dashboard-header">
          <Header />
        </div>
        <div className="dashboard-body">
          <h1>Dashboard</h1>
        </div>
      </div>
    </>
  );
};
