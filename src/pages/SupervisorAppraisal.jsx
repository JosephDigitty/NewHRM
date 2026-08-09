import React, { useEffect } from "react";
import Footer from "../Component/reuseables/Footer";
import SummaryCards from "../Component/MyAppraisals/SummaryCards";
import PromotionBanner from "../Component/MyAppraisals/PromotionBanner";
import SupervisorTable from "../Component/MyAppraisals/SupervisorAppraisalTable";

const SupervisorAppraisals = () => {
  
  return (
    <div className="bg-background-light text-slate-900 font-display min-h-screen">
     
      <main >
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
          {/* Header Section */}
          <div className="mb-8 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">My Team</h2>
              <p className="text-slate-500">Manage and track your performance review cycles across the organization.</p>
            </div>
            <button className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary/25 hover:bg-primary/90 transition-all">
              <span className="material-symbols-outlined text-lg">add_circle</span>
              Request Feedback
            </button>
          </div>

          {/* Summary Cards */}
          <SummaryCards />

          {/* Appraisal Table */}
          <SupervisorTable />

          {/* Promotion Banner */}
          <PromotionBanner />
        </div>
      </main>

      <Footer variant="hrSolutions" />
    </div>
  );
};

export default SupervisorAppraisals;
