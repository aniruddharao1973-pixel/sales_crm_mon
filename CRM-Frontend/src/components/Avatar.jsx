const Avatar = ({
  name,
  secondName,
  size = "md",
  image,
  className = "",
}) => {
  const sizes = {
    xs: "w-6 h-6 text-[10px]",
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-14 h-14 text-lg",
    xl: "w-20 h-20 text-2xl",
    "2xl": "w-24 h-24 text-3xl",
  };

  const initials = `${name?.[0] || ""}${secondName?.[0] || ""}`.toUpperCase();

  if (image) {
    return (
      <img
        src={image}
        alt={name || "Avatar"}
        className={`${sizes[size]} rounded-full object-cover ${className}`}
      />
    );
  }

  return (
    <div
      className={`${sizes[size]} bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-semibold ${className}`}
    >
      {initials || "?"}
    </div>
  );
};

export default Avatar;