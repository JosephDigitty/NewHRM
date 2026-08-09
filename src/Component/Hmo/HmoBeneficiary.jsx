import axios from "axios";
import { useEffect, useState } from "react";
import { FaTrashCan } from "react-icons/fa6";
import { beneficiaries, permanentModifyers } from "../../utils/PayrollHelpers";
import { useToastContext } from "../../Context/ToastContext";
import Modal from "../reuseables/Modal";

const HmoBeneficiary = ({ isOpen, onClose, id }) => {
  const { showSuccess, showError } = useToastContext();
  const [formData, setFormData] = useState({
    beneficiary: [],
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBeneficiary = async () => {
      const result = await beneficiaries(id);
      if (result) {
        setFormData({
          beneficiary: result.beneficiary,
        });
      }
    };
    fetchBeneficiary();
  }, [id]);

  const handleChange = (type, index, field, value) => {
    const updated = [...formData[type]];
    if ((updated[index][field] = field === "name" || "relationship")) {
      updated[index][field] = value;
    } else {
      updated[index][field] = Number(value);
    }
    setFormData({ ...formData, [type]: updated });
  };

  const addNewField = (type) => {
    setFormData({
      ...formData,
      [type]: [...formData[type], { name: "", relationship: "" }],
    });
  };

  const removeField = (type, index) => {
    const updated = formData[type].filter((_, i) => i !== index);
    setFormData({ ...formData, [type]: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post(
        `http://localhost:3001/api/employee/payroll/beneficiary`,
        { id, beneficiary: formData.beneficiary },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      if (response.data.success) {
        setLoading(false);
        showSuccess(response.data.message);
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
    <Modal isOpen={isOpen} onClose={onClose} title="HMO Beneficiary">
      <form onSubmit={handleSubmit} className="w-full">
        <div className="space-y-8">
          {/* Body */}
          <div className="space-y-8">
            {/* Beneficiaries */}
            <div>
              <h2 className="text-lg font-semibold text-blue-800 mb-4">
                Beneficiaries
              </h2>
              <div className="space-y-4">
                {formData.beneficiary.map((item, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="grid grid-cols-2 gap-4 flex-grow">
                      <div>
                        <input
                          type="text"
                          placeholder="Name"
                          value={item.name}
                          onChange={(e) =>
                            handleChange(
                              "beneficiary",
                              index,
                              "name",
                              e.target.value,
                            )
                          }
                          className="p-2 w-full h-fit border border-gray-600 focus:ring-blue-400 rounded-lg text-black placeholder-gray-400 "
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          placeholder="relationship"
                          value={item.relationship}
                          onChange={(e) =>
                            handleChange(
                              "beneficiary",
                              index,
                              "relationship",
                              e.target.value,
                            )
                          }
                          className="p-2 w-full h-fit border border-gray-600 focus:ring-blue-400 rounded-lg text-black placeholder-gray-400 0"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeField("beneficiary", index)}
                      className="text-blue-400 hover:text-red-500"
                    >
                      <FaTrashCan />
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => addNewField("beneficiary")}
                className="mt-4 flex items-center gap-2 text-sm font-semibold text-[#70c6ff] hover:text-[#70c6ff]/80"
              >
                ➕ Add Beneficiary
              </button>
            </div>
          </div>
          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-4">
            <button
              type="reset"
              onClick={() => setFormData({ beneficiary: [] })}
              className="px-6 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-background-light dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg"
            >
              Clear
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 text-sm font-semibold text-white bg-blue-500 hover:bg-[#70c6ff]/90 rounded-lg"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default HmoBeneficiary;
