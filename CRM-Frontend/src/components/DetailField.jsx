// const DetailField = ({ label, value, children }) => {
//   return (
//     <div>
//       <p className="text-gray-500 text-sm">{label}</p>
//       {children || (
//         <p className="font-medium text-sm mt-0.5">{value || "—"}</p>
//       )}
//     </div>
//   );
// };

// export default DetailField;
const DetailField = ({ label, value, children }) => {
  return (
    <div className="text-sm">
      <p className="text-gray-500 mb-1">{label}</p>

      {children ? (
        <div className="font-medium text-gray-900">{children}</div>
      ) : (
        <p className="font-medium text-gray-900">
          {value || value === 0 ? value : "—"}
        </p>
      )}
    </div>
  );
};

export default DetailField;