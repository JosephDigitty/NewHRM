import { useEffect, useState } from "react";
import LoadingState from "../reuseables/LoadingState";
import { Hmocolumns } from "../../utils/EmployeeHelper";
import DataTable from "react-data-table-component";
import { api } from "../../api/request";
import { useToastContext } from "../../Context/ToastContext";
import { Link } from "react-router-dom";

const GetHmo = () => {
  const { showSuccess, showError } = useToastContext();

  const [hmo, setHmo] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

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

  // Search
  const filteredHmo = hmo.filter((item) =>
    item.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <LoadingState
      loading={loading}
      loadingText="Loading HMO Details..."
    >
      <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">

          {/* =========================================
              PAGE HEADER
          ========================================= */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <p className="mb-1 text-sm font-medium text-slate-500">
                Employee Benefits
              </p>

              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                HMO Management
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Manage health maintenance organizations and their pricing.
              </p>
            </div>

            <Link
              to="/admin-dashboard/hmo-create"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
            >
              <span className="text-lg leading-none">+</span>
              Add New HMO
            </Link>
          </div>

          {/* =========================================
              SUMMARY CARD
          ========================================= */}
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">

                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Total HMO Providers
                  </p>

                  <h2 className="mt-2 text-3xl font-bold text-slate-900">
                    {hmo.length}
                  </h2>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-xl">
                  🏥
                </div>
              </div>
            </div>

          </div>

          {/* =========================================
              TABLE CARD
          ========================================= */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            {/* TABLE HEADER */}
            <div className="border-b border-slate-200 px-5 py-5 sm:px-6">

              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                <div>
                  <h2 className="text-base font-semibold text-slate-900">
                    HMO Providers
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    View and manage all registered HMO providers.
                  </p>
                </div>

                {/* SEARCH */}
                <div className="relative w-full lg:w-72">

                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m21 21-4.35-4.35m2.1-5.4a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0Z"
                      />
                    </svg>
                  </span>

                  <input
                    type="text"
                    placeholder="Search HMO provider..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-slate-50 py-2.5 pl-9 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:bg-white focus:ring-2 focus:ring-slate-100"
                  />

                </div>
              </div>
            </div>

            {/* TABLE */}
            <div className="px-2 py-2 sm:px-4">

              <DataTable
                columns={Hmocolumns}
                data={filteredHmo}
                pagination
                highlightOnHover
                responsive
                pointerOnHover
                noDataComponent={
                  <div className="py-12 text-center">
                    <div className="mb-3 text-4xl">🏥</div>

                    <p className="font-medium text-slate-700">
                      No HMO providers found
                    </p>

                    <p className="mt-1 text-sm text-slate-400">
                      Try changing your search or add a new HMO provider.
                    </p>
                  </div>
                }
                customStyles={{
                  table: {
                    style: {
                      backgroundColor: "transparent",
                    },
                  },

                  headRow: {
                    style: {
                      backgroundColor: "#f8fafc",
                      borderBottom: "1px solid #e2e8f0",
                      minHeight: "52px",
                    },
                  },

                  headCells: {
                    style: {
                      color: "#475569",
                      fontSize: "12px",
                      fontWeight: "600",
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                    },
                  },

                  rows: {
                    style: {
                      minHeight: "64px",
                      fontSize: "14px",
                      color: "#334155",
                      borderBottom: "1px solid #f1f5f9",
                    },
                  },

                  cells: {
                    style: {
                      paddingLeft: "16px",
                      paddingRight: "16px",
                    },
                  },

                  pagination: {
                    style: {
                      borderTop: "1px solid #e2e8f0",
                      paddingTop: "12px",
                      paddingBottom: "12px",
                    },
                  },
                }}
              />

            </div>
          </div>

        </div>
      </div>
    </LoadingState>
  );
};

export default GetHmo;