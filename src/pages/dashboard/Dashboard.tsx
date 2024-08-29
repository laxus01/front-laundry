import { Header } from "./components/Header";
import { User } from "./components/User";
import { Outlet } from "react-router-dom";
import "./styles/dashboard.scss";

export const Dashboard = () => {
  return (
    <>
      <div className="dashboard">
        <div className="dashboard__header">
          <div className="dashboard__header--left">
            <Header />
            <label className="text-18 text-600 color-white">C&E Washer</label>
          </div>
          <User />
        </div>
        <div className="dashboard__body">
          <div className="dashboard__body--main">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
};
