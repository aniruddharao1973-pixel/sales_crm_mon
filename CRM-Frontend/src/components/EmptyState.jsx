const EmptyState = ({ icon: Icon, title, description, action }) => {
  return (
    <div className="text-center py-16 px-4">
      {Icon && (
        <Icon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
      )}
      <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      {description && (
        <p className="text-gray-500 mt-1 text-sm max-w-sm mx-auto">
          {description}
        </p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
};

export default EmptyState;