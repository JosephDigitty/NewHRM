import React, { useState } from "react";
import { MdDownload, MdExpandMore } from "react-icons/md";
import Modal from "../../reuseables/Modal"

const PageHeader = ({
  periodName,
  status,
  dateRange,
  user, // { authorisation: "Account" | "Director" | "none" | undefined, ... }
  onExport,
  onMoreActions,
  onSubmitForReview,
  onAccept,
  onReject,
  onPay,
}) => {
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectComment, setRejectComment] = useState("");

  const getSubmitButtonLabel = () => {
    if (status === "Draft" || status === "RejectedByAccounts" || status === "RejectedByMD") {
      return "Submit to Accounts";
    }
    if (status === "PendingDirectorReview") {
      return "Submit to Director";
    }
    return null;
  };

  const submitLabel = getSubmitButtonLabel();

  const hasAuthorisation = user?.authorisation && user.authorisation !== "none";

  const canActOnAccountsReview =
    status === "PendingAccountsReview" && hasAuthorisation && user.authorisation === "Account";

  const canActOnDirectorReview =
    status === "PendingDirectorReview" && hasAuthorisation && user.authorisation === "Director";

  const showAcceptRejectButtons = canActOnAccountsReview || canActOnDirectorReview;

  // Final stage: Accounts confirms payment has actually been made.
  // Accept-only — no reject path once the Director has already approved.
  const showPayButton =
    status === "Approved" && hasAuthorisation && user.authorisation === "Account";

  const handleConfirmReject = () => {
    if (!rejectComment.trim()) return;
    onReject(rejectComment.trim());
    setRejectComment("");
    setIsRejectModalOpen(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-4">
          <h2 className="text-3xl font-bold text-gray-900">{periodName}</h2>
          <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-md font-medium">
            {status}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onExport}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium"
          >
            <MdDownload size={18} />
            Export
          </button>
          <button
            onClick={onMoreActions}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium"
          >
            More actions
            <MdExpandMore size={18} />
          </button>

          {showAcceptRejectButtons && (
            <>
              <button
                onClick={() => setIsRejectModalOpen(true)}
                className="px-4 py-2 border border-red-300 text-red-600 font-bold rounded-lg hover:bg-red-50 transition-colors text-sm"
              >
                Reject
              </button>
              <button
                onClick={onAccept}
                className="px-4 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors text-sm"
              >
                Accept
              </button>
            </>
          )}

          {showPayButton && (
            <button
              onClick={onPay}
              className="px-4 py-2 bg-green-700 text-white font-bold rounded-lg hover:bg-green-800 transition-colors text-sm"
            >
              Pay
            </button>
          )}

          {submitLabel && (
            <button
              onClick={onSubmitForReview}
              className="px-4 py-2 bg-[#9eceec] text-black font-bold rounded-lg hover:bg-[#7db8d8] transition-colors text-sm"
            >
              {submitLabel}
            </button>
          )}
        </div>
      </div>
      <p className="text-gray-600 mb-8">Payroll for {dateRange}</p>

      <Modal isOpen={isRejectModalOpen} onClose={() => setIsRejectModalOpen(false)} title="Reject Payroll">
        <div className="space-y-4">
          <textarea
            className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            rows={4}
            placeholder="Explain why this payroll is being rejected (required)..."
            value={rejectComment}
            onChange={(e) => setRejectComment(e.target.value)}
          />
          {!rejectComment.trim() && (
            <p className="text-xs text-red-500">A comment is required to reject this payroll.</p>
          )}
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setIsRejectModalOpen(false)}
              className="px-4 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmReject}
              disabled={!rejectComment.trim()}
              className="px-4 py-2 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Reject Payroll
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PageHeader;