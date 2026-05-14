// src\components\Header.jsx
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import NotificationBell from "./NotificationBell";
import { logoutUser } from "../features/auth/authSlice";
import Avatar from "./Avatar";
import {
  ArrowRightOnRectangleIcon,
  Bars3Icon,
} from "@heroicons/react/24/outline";

const Header = ({ onMenuToggle }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="flex items-center justify-between px-4 sm:px-6 py-3">
        {/* Left side */}

        <div className="flex items-center gap-3">
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Bars3Icon className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <NotificationBell />
          {/* User info */}
          <div className="flex items-center gap-3">
            <Avatar name={user?.name} size="sm" />
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-gray-900 leading-tight">
                {user?.name}
              </p>
              <p className="text-xs text-gray-500 leading-tight">
                {user?.role?.replace(/_/g, " ")}
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="w-px h-8 bg-gray-200 hidden sm:block" />

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="p-2 rounded-lg hover:bg-red-50 text-gray-400
              hover:text-red-600 transition-colors"
            title="Logout"
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
