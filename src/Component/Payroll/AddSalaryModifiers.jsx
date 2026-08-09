import axios from "axios";
import { useState } from "react";
import { FaTrashCan } from "react-icons/fa6";
import { useToastContext } from "../../Context/ToastContext";
import Loader from "../reuseables/Loader";
import Modal from "../reuseables/Modal";
import { api } from "../../api/request";

const SalaryModifiers = ({ isOpen, onClose, id }) => {
  const { showError, showSuccess } = useToastContext();

  const [formData, setFormData] = useState({
    allowances: [],
    deductions: [],
  });

  const [loading, setLoading] = useState(false);
  const [period, setPeriod] = useState("")

  const handleChange = (type, index, field, value) => {
    const updated = [...formData[type]];
    if ((updated[index][field] = field === "label")) {
      updated[index][field] = value;
    } else {
      updated[index][field] = Number(value);
    }
    setFormData({ ...formData, [type]: updated });
  };

  const addNewField = (type) => {
    setFormData({
      ...formData,
      [type]: [...formData[type], { label: "", amount: "" }],
    });
  };

  //
  const removeField = (type, index) => {
    const updated = formData[type].filter((_, i) => i !== index);
    setFormData({ ...formData, [type]: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { allowances, deductions } = formData;
      const response = await api.put(`/employee/${id}/payroll`,{ id, allowances, deductions, period });

      if (response.data.success) {
        setLoading(false);
        showSuccess("Salary Modifiers has been updated successfully");
        onClose();
      }
    } catch (error) {
      if (error.response && !error.response.data.success) {
        showError(error.response.data.error);
      }
      showError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Allowances & Deductions">
      <form onSubmit={handleSubmit} className="w-full">
        <div className="space-y-8">
          {/* Body */}
          <div className="space-y-8">
            {/* Allowances */}
            <div>
              <h2 className="text-lg font-semibold text-blue-800 mb-4">
                Allowances
              </h2>
              <div className="space-y-4">
                {formData.allowances.map((item, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="grid grid-cols-2 gap-4 flex-grow">
                      <div>
                        <input
                          type="text"
                          placeholder="e.g., Bonus"
                          value={item.label}
                          onChange={(e) =>
                            handleChange(
                              "allowances",
                              index,
                              "label",
                              e.target.value,
                            )
                          }
                          className="p-2 w-full h-fit border border-gray-600 focus:ring-blue-400 rounded-lg text-black placeholder-gray-400 "
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          inputmode="numeric"
                          pattern="\d*"
                          placeholder="e.g., 500"
                          value={item.amount}
                          onChange={(e) =>
                            handleChange(
                              "allowances",
                              index,
                              "amount",
                              e.target.value,
                            )
                          }
                          className="p-2 w-full h-fit border border-gray-600 focus:ring-blue-400 rounded-lg text-black placeholder-gray-400 0"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeField("allowances", index)}
                      className="text-blue-400 hover:text-red-500"
                    >
                      <FaTrashCan />
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => addNewField("allowances")}
                className="mt-4 flex items-center gap-2 text-sm font-semibold text-[#70c6ff] hover:text-[#70c6ff]/80"
              >
                ➕ Add Allowance
              </button>
            </div>

            {/* Deductions */}
            <div>
              <h2 className="text-lg font-semibold text-blue-800 mb-4">
                Deductions
              </h2>
              <div className="space-y-4">
                {formData.deductions.map((item, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="grid grid-cols-2 gap-4 flex-grow">
                      <div>
                        <input
                          type="text"
                          placeholder="e.g., Health Insurance"
                          value={item.label}
                          onChange={(e) =>
                            handleChange(
                              "deductions",
                              index,
                              "label",
                              e.target.value,
                            )
                          }
                          className="p-2 w-full h-fit border border-gray-600 focus:ring-blue-400 rounded-lg text-black placeholder-gray-400 "
                        />
                      </div>
                      <div>
                        <input
                          type="number"
                          placeholder="e.g., 100"
                          value={item.amount}
                          onChange={(e) =>
                            handleChange(
                              "deductions",
                              index,
                              "amount",
                              e.target.value,
                            )
                          }
                          className="p-2 w-full h-fit border border-gray-600 focus:ring-blue-400 rounded-lg text-black placeholder-gray-400"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeField("deductions", index)}
                      className="text-blue-400 hover:text-red-500"
                    >
                      <FaTrashCan />
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => addNewField("deductions")}
                className="mt-4 flex items-center gap-2 text-sm font-semibold text-[#70c6ff] hover:text-[#70c6ff]/80"
              >
                ➕ Add Deduction
              </button>
            </div>
          </div>
          <div className="my-4">
            <label htmlFor="payDate" className="block font-semibold mb-1">
              Payroll Month and Year
            </label>
            <input
              type="month"
              name="payDate"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              required
              className="border border-gray-300 rounded px-3 py-2"
            />
            <p className="text-sm text-gray-500 mt-1">Example: 2024-07 (July 2024)</p>
          </div>
          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-4">
            <button
              type="reset"
              onClick={() => setFormData({ allowances: [], deductions: [] })}
              className="px-6 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-background-light dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg"
            >
              Clear
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 text-sm font-semibold text-white bg-blue-500 hover:bg-[#70c6ff]/90 rounded-lg flex items-center gap-2"
            >
              {loading ? <Loader size="sm" /> : null}
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default SalaryModifiers;
