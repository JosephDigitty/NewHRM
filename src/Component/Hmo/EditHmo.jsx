import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../api/request";
import { useToastContext } from "../../Context/ToastContext";

const EditHmo = () => {
  const [hmo, setHmo] = useState({
    name: "",
    amount: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const navigate = useNavigate();
  const { showSuccess, showError } = useToastContext();
  const { id } = useParams();

  // =====================================================
  // HANDLE INPUT CHANGES
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setHmo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =====================================================
  // GET HMO
  // =====================================================

  useEffect(() => {
    const getHmo = async () => {
      setLoading(true);

      try {
        const res = await api.get(`/hmo/hmo/${id}`);

        if (res.data.success) {
          setHmo({
            name: res.data.hmo.name || "",
            amount: res.data.hmo.amount || "",
          });
        }
      } catch (error) {
        console.log(error);

        showError(
          error.response?.data?.error ||
            "Failed to load HMO details"
        );
      } finally {
        setLoading(false);
      }
    };

    getHmo();
  }, [id]);

  // =====================================================
  // UPDATE HMO
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);

    try {
      const response = await api.put(
        `/hmo/edit/${id}`,
        hmo
      );

      if (response.data.success) {
        showSuccess(
          response.data.message ||
            "HMO updated successfully"
        );

        navigate("/admin-dashboard/hmo");
      }
    } catch (error) {
      showError(
        error.response?.data?.error ||
          "Failed to update HMO"
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // LOADING STATE
  // =====================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">

          <div className="mb-8">
            <div className="h-4 w-40 animate-pulse rounded bg-slate-200" />

            <div className="mt-4 h-8 w-64 animate-pulse rounded bg-slate-200" />

            <div className="mt-3 h-4 w-96 max-w-full animate-pulse rounded bg-slate-200" />
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="border-b border-slate-200 bg-slate-50/70 px-6 py-6 sm:px-8">
              <div className="flex items-center gap-4">

                <div className="h-12 w-12 animate-pulse rounded-xl bg-slate-200" />

                <div>
                  <div className="h-5 w-48 animate-pulse rounded bg-slate-200" />
                  <div className="mt-2 h-4 w-72 animate-pulse rounded bg-slate-200" />
                </div>

              </div>
            </div>

            <div className="space-y-7 p-6 sm:p-8">

              <div>
                <div className="mb-2 h-4 w-24 animate-pulse rounded bg-slate-200" />
                <div className="h-12 w-full animate-pulse rounded-lg bg-slate-100" />
              </div>

              <div>
                <div className="mb-2 h-4 w-32 animate-pulse rounded bg-slate-200" />
                <div className="h-12 w-full animate-pulse rounded-lg bg-slate-100" />
              </div>

            </div>

          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">

      <div className="mx-auto max-w-5xl">

        {/* =====================================================
            HEADER
        ====================================================== */}

        <div className="mb-8">

          <button
            type="button"
            onClick={() =>
              navigate("/admin-dashboard/hmo")
            }
            className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
          >
            <span className="text-lg">←</span>
            Back to HMO Management
          </button>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Edit HMO
          </h1>

          <p className="mt-2 max-w-2xl text-sm text-slate-500">
            Update the details and pricing information for
            this HMO provider.
          </p>

        </div>

        {/* =====================================================
            MAIN CARD
        ====================================================== */}

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          {/* CARD HEADER */}

          <div className="border-b border-slate-200 bg-slate-50/70 px-6 py-6 sm:px-8">

            <div className="flex items-center gap-4">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 text-xl">
                🏥
              </div>

              <div>
                <h2 className="text-base font-semibold text-slate-900">
                  HMO Provider Details
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Modify the information below and save your
                  changes.
                </p>
              </div>

            </div>

          </div>

          {/* =====================================================
              FORM
          ====================================================== */}

          <form onSubmit={handleSubmit}>

            <div className="space-y-7 p-6 sm:p-8">

              {/* HMO NAME */}

              <div>

                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  HMO Name
                  <span className="ml-1 text-red-500">
                    *
                  </span>
                </label>

                <input
                  id="name"
                  type="text"
                  name="name"
                  value={hmo.name}
                  onChange={handleChange}
                  placeholder="e.g. Reliance Health"
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-slate-900 focus:ring-4 focus:ring-slate-100"
                  required
                />

                <p className="mt-2 text-xs text-slate-400">
                  The registered name of the health
                  maintenance organization.
                </p>

              </div>

              {/* AMOUNT */}

              <div>

                <label
                  htmlFor="amount"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Standard Amount
                  <span className="ml-1 text-red-500">
                    *
                  </span>
                </label>

                <div className="relative">

                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-500">
                    ₦
                  </span>

                  <input
                    id="amount"
                    type="number"
                    name="amount"
                    value={hmo.amount}
                    onChange={handleChange}
                    placeholder="10,000"
                    min="0"
                    className="w-full rounded-lg border border-slate-300 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-slate-900 focus:ring-4 focus:ring-slate-100"
                    required
                  />

                </div>

                <p className="mt-2 text-xs text-slate-400">
                  Standard amount used when assigning this
                  HMO to an employee.
                </p>

              </div>

            </div>

            {/* =====================================================
                FORM FOOTER
            ====================================================== */}

            <div className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50/50 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">

              {/* DELETE/INFO SIDE */}

              <div className="hidden text-xs text-slate-400 sm:block">
                Changes will apply to this HMO provider.
              </div>

              {/* ACTIONS */}

              <div className="flex flex-col gap-3 sm:flex-row">

                <button
                  type="button"
                  onClick={() =>
                    navigate("/admin-dashboard/hmo")
                  }
                  disabled={saving}
                  className="rounded-lg border border-slate-300 bg-white px-6 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex min-w-[150px] items-center justify-center gap-2 rounded-lg bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                >

                  {saving ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <span>✓</span>
                      Save Changes
                    </>
                  )}

                </button>

              </div>

            </div>

          </form>
        </div>

        {/* =====================================================
            INFORMATION CARD
        ====================================================== */}

        <div className="mt-5 rounded-xl border border-slate-200 bg-white px-5 py-4">

          <div className="flex gap-3">

            <div className="mt-0.5 text-slate-500">
              ℹ️
            </div>

            <div>

              <p className="text-sm font-semibold text-slate-700">
                About HMO pricing
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                The standard amount is used as the default
                HMO contribution when this provider is
                assigned to an employee.
              </p>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default EditHmo;