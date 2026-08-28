import React, { useState } from "react";
import { MdDownload, MdExpandMore } from "react-icons/md";
import Modal from "../../reuseables/Modal";


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
  actionLoading, // null | "submit" | "accept" | "reject" | "pay"
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
    status === "Pending Accounts Review" && hasAuthorisation && user.authorisation === "Account";

  const canActOnDirectorReview =
    status === "Pending Director Review" && hasAuthorisation && user.authorisation === "Director";

  const showAcceptRejectButtons = canActOnAccountsReview || canActOnDirectorReview;

  const showPayButton =
    status === "Approved" && hasAuthorisation && user.authorisation === "Account";

  const isSubmitting = actionLoading === "submit";
  const isAccepting = actionLoading === "accept";
  const isRejecting = actionLoading === "reject";
  const isPaying = actionLoading === "pay";
  const anyActionInFlight = !!actionLoading;

  const closeRejectModalAfterSuccess = () => {
    setIsRejectModalOpen(false);
    setRejectComment("");
  };

  const handleRejectClick = async () => {
    if (!rejectComment.trim()) return;
    await onReject(rejectComment.trim());
    closeRejectModalAfterSuccess();
  };

  const Spinner = () => (
    <svg
      className="animate-spin h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );

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
            disabled={anyActionInFlight}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <MdDownload size={18} />
            Export
          </button>
          <button
            onClick={onMoreActions}
            disabled={anyActionInFlight}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            More actions
            <MdExpandMore size={18} />
          </button>

          {showAcceptRejectButtons && (
            <>
              <button
                onClick={() => setIsRejectModalOpen(true)}
                disabled={anyActionInFlight}
                className="px-4 py-2 border border-red-300 text-red-600 font-bold rounded-lg hover:bg-red-50 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Reject
              </button>
              <button
                onClick={onAccept}
                disabled={anyActionInFlight}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAccepting && <Spinner />}
                {isAccepting ? "Accepting..." : "Accept"}
              </button>
            </>
          )}

          {showPayButton && (
            <button
              onClick={onPay}
              disabled={anyActionInFlight}
              className="flex items-center gap-2 px-4 py-2 bg-green-700 text-white font-bold rounded-lg hover:bg-green-800 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPaying && <Spinner />}
              {isPaying ? "Processing..." : "Pay"}
            </button>
          )}

          {submitLabel && (
            <button
              onClick={onSubmitForReview}
              disabled={anyActionInFlight}
              className="flex items-center gap-2 px-4 py-2 bg-[#9eceec] text-black font-bold rounded-lg hover:bg-[#7db8d8] transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting && <Spinner />}
              {isSubmitting ? "Submitting..." : submitLabel}
            </button>
          )}
        </div>
      </div>
      <p className="text-gray-600 mb-8">Payroll for {dateRange}</p>

      <Modal
        isOpen={isRejectModalOpen}
        onClose={() => {
          if (!isRejecting) {
            setIsRejectModalOpen(false);
            setRejectComment("");
          }
        }}
        title="Reject Payroll"
      >
        <div className="space-y-4">
          <textarea
            className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            rows={4}
            placeholder="Explain why this payroll is being rejected (required)..."
            value={rejectComment}
            onChange={(e) => setRejectComment(e.target.value)}
            disabled={isRejecting}
          />
          {!rejectComment.trim() && (
            <p className="text-xs text-red-500">A comment is required to reject this payroll.</p>
          )}
          <div className="flex justify-end gap-3">
            <button
              onClick={() => {
                setIsRejectModalOpen(false);
                setRejectComment("");
              }}
              disabled={isRejecting}
              className="px-4 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleRejectClick}
              disabled={!rejectComment.trim() || isRejecting}
              className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRejecting && <Spinner />}
              {isRejecting ? "Rejecting..." : "Reject Payroll"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PageHeader;