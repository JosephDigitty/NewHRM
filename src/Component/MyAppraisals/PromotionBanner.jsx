import React from "react";
import { Rocket } from "lucide-react";

const PromotionBanner = () => {
  return (
    <div className="mt-8 rounded-xl bg-gradient-to-r from-primary to-indigo-600 p-6 text-white shadow-lg">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
            <Rocket size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold">Enhance your performance</h3>
            <p className="text-primary-50 opacity-90">Schedule a 1-on-1 career development session with your HR representative.</p>
          </div>
        </div>
        <button className="whitespace-nowrap rounded-lg bg-white px-6 py-2 text-sm font-bold text-primary shadow-sm hover:bg-slate-50 transition-colors">
          Book Session
        </button>
      </div>
    </div>
  );
};

export default PromotionBanner;
