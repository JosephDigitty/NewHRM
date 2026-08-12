import React from "react";

const Tabs = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="border-b border-gray-200 mb-6">
      <nav className="flex gap-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={`pb-3 text-sm font-medium transition-colors relative ${
              activeTab === tab ? "text-gray-900" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab}
            {activeTab === tab && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900"></span>
            )}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Tabs;
