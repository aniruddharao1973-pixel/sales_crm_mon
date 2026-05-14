export const getPriorityColor = (priority) => {
  switch (priority) {
    case "HIGHEST":
      return "bg-red-100 text-red-700 border-red-200";

    case "HIGH":
      return "bg-orange-100 text-orange-700 border-orange-200";

    case "NORMAL":
      return "bg-blue-100 text-blue-700 border-blue-200";

    case "LOW":
      return "bg-emerald-100 text-emerald-700 border-emerald-200";

    case "LOWEST":
      return "bg-gray-100 text-gray-600 border-gray-200";

    default:
      return "bg-gray-100 text-gray-600 border-gray-200";
  }
};