import Loader from "./Loader";

const LoadingState = ({
  loading,
  children,
  loadingText = "Loading...",
  className = "",
  loaderSize = "md"
}) => {
  if (loading) {
    return (
      <div className={`flex flex-col justify-center items-center h-64 ${className}`}>
        <Loader size={loaderSize} />
        <p className="mt-4 text-gray-600">{loadingText}</p>
      </div>
    );
  }

  return children;
};

export default LoadingState;