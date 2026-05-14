import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

const SearchBar = ({ value, onChange, placeholder = "Search...", children }) => {
  return (
    <div className="card mb-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={placeholder}
            className="input-field pl-10"
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
        {children}
      </div>
    </div>
  );
};

export default SearchBar;