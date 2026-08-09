import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../api/request";
import { useToastContext } from "../../Context/ToastContext";

const EditHmo = () => {
  const [hmo, setHmo] = useState({
    name: "",
    amount: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { showSuccess, showError } = useToastContext();

  const { id } = useParams()

  const handleChange = (e) => {
    const { name, value } = e.target;
    setHmo({ ...hmo, [name]: value });
  };

  useEffect(() => {
     const getHmo = async () => {
        try {
            const res = await api.get(`/hmo/hmo/${id}`) 
        if(res.data.success) {
            setHmo({ name: res.data.hmo.name, 
                amount:res.data.hmo.amount 
            })
        showSuccess(res.data.message)
        console.log(res.data)
        }
        } catch (error) {
            console.log(error)
            showError(error)
        }
     }
     getHmo()
  },[id])

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.put(`/hmo/edit/${id}`, hmo);
      if (response.data.success) {
        showSuccess(response.data.message || "HMO edited Successfully");
        setHmo({ name: "", amount: "" });
        navigate("/admin-dashboard/hmo");
      }
    } catch (error) {
      showError(error.response?.data?.error || "Failed to create HMO");
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="w-full h-[90vh] mt-10 md:mt-0 flex items-center justify-center bg-gray-50/50">
      <div className="md:w-[50%] w-[90%] bg-white p-10 rounded-xl shadow-lg border border-gray-100 min-w-[380px]">
        
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold text-gray-800">Edit HMO Details</h2>
          <p className="text-gray-500 text-sm mt-2">Enter the details to register a new health provider</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* HMO Name Input */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">HMO Name</label>
            <input
              type="text"
              name="name"
              value={hmo.name}
              onChange={handleChange}
              placeholder="e.g. Reliance Health"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
              required
            />
          </div>

          {/* Amount Input */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">Standard Amount</label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-gray-500">₦</span>
              <input
                type="number"
                name="amount"
                value={hmo.amount}
                onChange={handleChange}
                placeholder="10,000"
                className="w-full p-3 pl-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 mt-4 text-white font-bold rounded-lg shadow-md transition-all ${
              loading 
                ? "bg-gray-400 cursor-not-allowed" 
                : "bg-blue-600 hover:bg-blue-700 active:transform active:scale-[0.98]"
            }`}
          >
            {loading ? "Processing..." : "Create HMO"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditHmo;