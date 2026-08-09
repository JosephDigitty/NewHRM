import { useEffect, useState } from "react";
import LoadingState from "../reuseables/LoadingState";
import { Hmocolumns } from "../../utils/EmployeeHelper";
import SubTitle from "../reuseables/SubTitle";
import DataTable from "react-data-table-component";
import { api } from "../../api/request";
import { useToastContext } from "../../Context/ToastContext";
import { Link } from "react-router-dom";

const GetHmo = () => {
  const { showSuccess, showError } = useToastContext();
  const [hmo, setHmo] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    const getHmo = async () => {
      try {
        const res = await api.get("/hmo");
        if (res.data.success) {
          showSuccess(res.data.message);
          let sno = 1;
          const data = res.data.HMO.map((hm) => ({
             _id: hm._id,
            sno: sno++,
            name: hm.name,
            Price: hm.amount,
          }));
          setHmo(data);
        }
      } catch (error) {
        if (error.response && !error.response.data.success) {
          showError(error.response.data.error);
        }
      } finally {
        setLoading(false);
      }
    };
    getHmo();
  }, []);
  return (
    <LoadingState loading={loading} loadingText="Loading HMO Details...">
      <div className="px-6 mt-6">
        <SubTitle text={"Manage HMO"} className="text-center mb-2" />
        <div className="flex justify-between items-center">
          <input
            type="text"
            placeholder="Search by Hmo"
            className="px-4 py-0.5 border rounded-2xl"
            onChange={() => {}}
          />
          <Link
            to="/admin-dashboard/hmo-create"
            className="px-4 py-1 text-black bg-blend-color-burn border border-black rounded-2xl hover:bg-black/10"
          >
            Add New Hmo
          </Link>
        </div>
        <div className="mt-5 w-7/10 mx-12">
        
          <DataTable columns={Hmocolumns} data={hmo} pagination />
        </div>
      </div>
    </LoadingState>
  );
};

export default GetHmo;

