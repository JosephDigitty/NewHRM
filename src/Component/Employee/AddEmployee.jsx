import { useEffect, useState } from "react";
import { fetchDepartments } from "../../utils/EmployeeHelper";
import { fetchGrades } from "../../utils/GradeHelpers";
import { useNavigate } from "react-router-dom";
import PersonalInfoForm from "./employeeForm/PersonalInfoForm";
import SubTitle from "../reuseables/SubTitle";
import JobPayrollForm from "./employeeForm/JobPayrollForm";
import UploadsForm from "./employeeForm/UploadsForm";
import Button from "../reuseables/Button";
import Loader from "../reuseables/Loader";
import { api } from "../../api/request";
import { useToastContext } from "../../Context/ToastContext";

const steps = ["Personal Info", "Job & Payroll", "Uploads"];

const AddEmployee = () => {
  const navigate = useNavigate();
  const { showError } = useToastContext();
  const [departments, setDepartments] = useState([]);
  const [grades, setGrades] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    personal: {},
    job: {},
    documents: null,
  });

  const payload = {
    personal: formData.personal,
    job: formData.job,
  };

  // 👇 update step data progressively
  const updateFormData = (stepData) =>
    setFormData((prev) => ({ ...prev, ...stepData }));

  // fetch departments
  useEffect(() => {
    const getDepartments = async () => {
      const deps = await fetchDepartments(showError);
      setDepartments(deps);
    };
    getDepartments();
  }, []);

  // fetch grades
  useEffect(() => {
    const getGrades = async () => {
      const grds = await fetchGrades(showError);
      setGrades(grds);
    };
    getGrades();
  }, []);

  const nextStep = () => setCurrentStep((s) => Math.min(s + 1, steps.length));
  const prevStep = () => setCurrentStep((s) => Math.max(s - 1, 1));

  // 👇 final submit (only on last step)
  const handleSubmit = async () => {
    setLoading(true);
    const formDataObj = new FormData();

    formData.documents &&
      Object.keys(formData.documents).forEach((key) => {
        if (formData.documents[key])
          formDataObj.append(key, formData.documents[key]);
      });

    // stringify objects before appending
    formDataObj.append("personal", JSON.stringify(payload.personal));
    formDataObj.append("job", JSON.stringify(payload.job));

    try {
      const response = await api.post("/employee/add", formDataObj);

      if (response.data.success) {
        navigate("/admin-dashboard/Employees");
        showSuccess(response.data.message)
        console.log(response.data.temporaryPassword)
        console.log(response.data)
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
    <div className=" mt-10 mx-10 bg-white p-8 rounded-md shadow-md">
      <SubTitle text={"Add New Employee"} className={"text-center mb-6"} />

      {/* Progress Indicator */}
      <div className="flex justify-between items-center mb-8">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isActive = currentStep === stepNumber;
          const isCompleted = currentStep > stepNumber;

          return (
            <div
              key={step}
              className="flex-1 flex flex-col items-center relative"
            >
              {/* Circle */}
              <div
                className={`w-10 h-10 flex items-center justify-center rounded-full border-2 
                  ${
                    isCompleted
                      ? "bg-purple-700 border-purple-700 text-white"
                      : isActive
                      ? "border-purple-700 text-purple-700"
                      : "border-gray-300 text-gray-400"
                  }
                `}
              >
                {isCompleted ? "✓" : stepNumber}
              </div>

              {/* Step Label */}
              <p
                className={`mt-2 text-sm font-medium 
                  ${
                    isActive
                      ? "text-purple-700"
                      : isCompleted
                      ? "text-purple-700"
                      : "text-gray-400"
                  }
                `}
              >
                {step}
              </p>

              {/* Connector line */}
              {index < steps.length - 1 && (
                <div
                  className={`absolute top-5 left-1/2 w-full h-[2px] -z-10 
                    ${isCompleted ? "bg-purple-700" : "bg-gray-300"}
                  `}
                ></div>
              )}
            </div>
          );
        })}
      </div>

      {/* Step Forms */}
      {currentStep === 1 && (
        <PersonalInfoForm
          data={formData.personal}
          onChange={(data) => updateFormData({ personal: data })}
          onUpdate={(data) =>
            setFormData((prev) => ({
              ...prev,
              personal: { ...prev.personal, ...data },
            }))
          }
        />
      )}
      {currentStep === 2 && (
        <JobPayrollForm
          data={formData.job}
          departments={departments}
          grades={grades}
          onChange={(data) => updateFormData({ job: data })}
          onUpdate={(data) =>
            setFormData((prev) => ({ ...prev, job: { ...prev.job, ...data } }))
          }
        />
      )}
      {currentStep === 3 && (
        <UploadsForm
          data={formData.documents}
          onUpdate={(data) =>
            setFormData((prev) => ({
              ...prev,
              documents: { ...prev.documents, ...data },
            }))
          }
        />
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-6">
        <Button
          text={"Cancel"}
          onClick={() => navigate("/admin-dashboard/Employees")}
          className=" bg-white border order-[var(--purple)]"
        />

        <div className="flex gap-4">
          <Button
            text={"Back"}
            onClick={prevStep}
            disabled={currentStep === 1}
            className=" bg-white border border-[var(--purple)] disabled:opacity-50"
          />
          {currentStep < steps.length ? (
            <Button text={"Next"} onClick={nextStep} className=" bg-[var(--purple)] text-white border border-[var(--purple)] disabled:opacity-50" />
          ) : (
            <Button
              text={loading ? "Adding..." : "Add New Employee"}
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className={loading ? "opacity-50 cursor-not-allowed" : " bg-[var(--purple)] text-white border border-[var(--purple)]"}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AddEmployee;
