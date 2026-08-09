import React, { useEffect } from "react";
import Footer from "../Component/reuseables/Footer";
import SummaryCards from "../Component/MyAppraisals/SummaryCards";
import AppraisalTable from "../Component/MyAppraisals/AppraisalTable";
import PromotionBanner from "../Component/MyAppraisals/PromotionBanner";
import { useAuth } from "../Context/authContext";
import { api } from "../api/request";

const MyAppraisals = () => {
  
  return (
    <div className="bg-background-light text-slate-900 font-display min-h-screen">
     
      <main >
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
          {/* Header Section */}
          <div className="mb-8 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">My Appraisals</h2>
              <p className="text-slate-500">Manage and track your performance review cycles across the organization.</p>
            </div>
            </div>

          {/* Summary Cards */}
          <SummaryCards />

          {/* Appraisal Table */}
          <AppraisalTable />

          {/* Promotion Banner */}
          <PromotionBanner />
        </div>
      </main>

      <Footer variant="hrSolutions" />
    </div>
  );
};

export default MyAppraisals;
