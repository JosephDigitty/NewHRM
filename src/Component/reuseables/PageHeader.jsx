import React from "react";

const PageHeader = ({
  title,
  count,
  countLabel = "Total",
  description,
  badgeClassName = "bg-purple-100 text-purple-700",
  actions,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          {count !== undefined && (
            <span
              className={`px-3 py-1 text-xs font-semibold rounded-full ${badgeClassName}`}
            >
              {count} {countLabel}
            </span>
          )}
        </div>
        {description && (
          <p className="text-gray-500 text-sm">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  );
};

export default PageHeader;
