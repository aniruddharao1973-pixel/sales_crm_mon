import { UserIcon } from "@heroicons/react/24/solid";

const Avatar = ({
  name,
  secondName,
  size = "md",
  image,
  className = "",
}) => {
  const sizes = {
    xs: "w-6 h-6",
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-14 h-14",
    xl: "w-20 h-20",
    "2xl": "w-24 h-24",
  };

  const iconSizes = {
    xs: "w-3.5 h-3.5",
    sm: "w-5 h-5",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-12 h-12",
    "2xl": "w-14 h-14",
  };

  if (image) {
    return (
      <img
        src={image}
        alt={name || "Avatar"}
        className={`${sizes[size]} rounded-full object-cover shadow-sm ${className}`}
      />
    );
  }

  return (
    <div
      className={`${sizes[size]} bg-slate-100 rounded-full flex items-center justify-center text-slate-400 shadow-inner border border-slate-200 ${className}`}
    >
      <UserIcon className={iconSizes[size]} />
    </div>
  );
};

export default Avatar;