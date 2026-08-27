import { Outlet } from "react-router-dom";
import CashRequisitionSidebar from "../Component/CashRequisition/CashRequisitionSidebar";

const CashRequisitionLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <CashRequisitionSidebar />
      <div className="flex-1 md:ml-64">
        <Outlet />
      </div>
    </div>
  );
};

export default CashRequisitionLayout;
