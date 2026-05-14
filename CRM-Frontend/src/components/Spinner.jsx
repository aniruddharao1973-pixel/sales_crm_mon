const Spinner = ({ size = "md", className = "" }) => {
  const sizes = {
    sm: "h-5 w-5",
    md: "h-10 w-10",
    lg: "h-16 w-16",
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`spinner ${sizes[size]}`}
        role="status"
        aria-label="Loading"
      />
    </div>
  );
};

export default Spinner;