import axios from "axios";
import { useState } from "react";
import Loader from "../reuseables/Loader";
import { useToastContext } from "../../Context/ToastContext";
import { api } from "../../api/request";
import { useAuth } from "../../Context/authContext";

const CreatePayroll = ({ onSuccess }) => {
  const { showError, showSuccess } = useToastContext();
  const [payDate, setPayDate] = useState("");
  const [loading, setLoading] = useState(false);
  const {user} = useAuth()

  const userId = user._id

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await api.put(
        `/employee/payroll/sync`,
        { payDate, userId }, 
      );

      if (response.data.success) {
        showSuccess("Payroll for period created")
        setLoading(false); 
        if (onSuccess) {
          onSuccess();
        }
      } else {
         showError(response.data.message)
      }
    } catch (error) {
      if (error.response && !error.response.data.success) {
        showError(error.response.data.error);
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      {/* payDate input */}
      <div className="my-4">
        <label htmlFor="payDate" className="block font-semibold mb-1">
          Payroll Month and Year
        </label>
        <input
          type="month"
          name="payDate"
          value={payDate}
          onChange={(e) => setPayDate(e.target.value)}
          required
          className="border border-gray-300 rounded px-3 py-2"
        />
        <p className="text-sm text-gray-500 mt-1">Example: 2024-07 (July 2024)</p>
      </div>
      {/* submit button */}
      <button
        type="submit"
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        disabled={loading}
      >
        {loading ? <Loader size="sm" /> : null}
        {loading ? "Saving..." : "Save"}
      </button>
    </form>
  );
};

export default CreatePayroll;
