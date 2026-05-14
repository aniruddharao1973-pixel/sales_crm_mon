import { Bell, CheckCheck, MessageSquare, Users, FileText, Calendar, IndianRupee, TrendingUp } from "lucide-react";
import { useEffect, useRef, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { socket } from "../socket";

import {
  fetchNotifications,
  markAsRead,
  addNotification,
  markAllAsReadLocal,
} from "../features/notifications/notificationSlice";

dayjs.extend(relativeTime);

// 🔔 Notification type icons
const typeIcons = {
  TASK: Calendar,
  LEAD: TrendingUp,
  DEAL: IndianRupee,
  CONTACT: Users,
  ACCOUNT: FileText,
  MESSAGE: MessageSquare,
  DEFAULT: Bell,
};

// 🎨 Notification type colors
const typeColors = {
  TASK: "bg-blue-100 text-blue-600",
  LEAD: "bg-green-100 text-green-600",
  DEAL: "bg-purple-100 text-purple-600",
  CONTACT: "bg-orange-100 text-orange-600",
  ACCOUNT: "bg-cyan-100 text-cyan-600",
  MESSAGE: "bg-pink-100 text-pink-600",
  DEFAULT: "bg-gray-100 text-gray-600",
};

// 📦 Item Component (moved outside to prevent re-creation)
const NotificationItem = ({ notification, onRead, onNavigate }) => {
  const Icon = typeIcons[notification.type] || typeIcons.DEFAULT;
  const colorClass = typeColors[notification.type] || typeColors.DEFAULT;

  return (
    <div
      onClick={() => {
        onRead(notification.id);
        onNavigate(notification);
      }}
      className={`px-4 py-3 border-b cursor-pointer hover:bg-gray-50 transition-colors flex gap-3 ${
        !notification.isRead ? "bg-blue-50/50" : ""
      }`}
    >
      {/* Icon */}
      <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${colorClass}`}>
        <Icon size={16} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-medium text-gray-900 truncate">
            {notification.title}
          </p>
          {!notification.isRead && (
            <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1.5" />
          )}
        </div>
        <p className="text-xs text-gray-500 line-clamp-2 mt-0.5">
          {notification.message}
        </p>
        <p className="text-[11px] text-gray-400 mt-1">
          {dayjs(notification.createdAt).fromNow()}
        </p>
      </div>
    </div>
  );
};

const NotificationBell = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const dropdownRef = useRef();

  const { items = [], loading = false } = useSelector((s) => s.notifications) || {};

  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState("ALL");

  const unread = items.filter((n) => !n.isRead).length;

  // 🔄 Initial load
  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  // ⚡ Realtime notifications
  useEffect(() => {
    const handleNewNotification = (data) => {
      dispatch(addNotification(data));
      toast.success(data.title, {
        icon: "🔔",
        duration: 4000,
      });
    };

    socket.on("new_notification", handleNewNotification);

    return () => {
      socket.off("new_notification", handleNewNotification);
    };
  }, [dispatch]);

  // ❌ Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  // 🚀 Handle navigation based on notification type
  const handleNavigation = useCallback(
    (notification) => {
      const { type, recordId } = notification;

      const routes = {
        TASK: `/tasks/${recordId}`,
        LEAD: `/leads/${recordId}`,
        DEAL: `/deals/${recordId}`,
        CONTACT: `/contacts/${recordId}`,
        ACCOUNT: `/accounts/${recordId}`,
      };

      const route = routes[type] || "/notifications";
      navigate(route);
      setOpen(false);
    },
    [navigate]
  );

  // ✅ Mark as read handler
  const handleMarkAsRead = useCallback(
    (id) => {
      dispatch(markAsRead(id));
    },
    [dispatch]
  );

  // ✅ Mark all as read
  const handleMarkAllAsRead = useCallback(() => {
    dispatch(markAllAsReadLocal());
    items.filter((n) => !n.isRead).forEach((n) => dispatch(markAsRead(n.id)));
  }, [dispatch, items]);

  // 📅 Group notifications
  const groupedNotifications = items.reduce(
    (acc, notification) => {
      if (tab === "UNREAD" && notification.isRead) return acc;

      const isToday = dayjs(notification.createdAt).isSame(dayjs(), "day");
      const isYesterday = dayjs(notification.createdAt).isSame(
        dayjs().subtract(1, "day"),
        "day"
      );

      if (isToday) {
        acc.today.push(notification);
      } else if (isYesterday) {
        acc.yesterday.push(notification);
      } else {
        acc.earlier.push(notification);
      }

      return acc;
    },
    { today: [], yesterday: [], earlier: [] }
  );

  const hasNotifications =
    groupedNotifications.today.length > 0 ||
    groupedNotifications.yesterday.length > 0 ||
    groupedNotifications.earlier.length > 0;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* 🔔 Bell Button */}
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5 text-gray-600" />

        {/* 🔴 Badge */}
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-medium px-1 rounded-full flex items-center justify-center">
            {unread > 99 ? "99+" : unread}
          </span>
        )}
      </button>

      {/* 📋 Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-96 bg-white shadow-2xl rounded-xl border border-gray-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          {/* HEADER */}
          <div className="sticky top-0 bg-white z-10 border-b border-gray-100">
            <div className="flex justify-between items-center px-4 py-3">
              <h3 className="font-semibold text-gray-900">Notifications</h3>

              {unread > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="text-xs text-blue-600 hover:text-blue-700 flex gap-1 items-center font-medium transition-colors"
                >
                  <CheckCheck size={14} />
                  Mark all as read
                </button>
              )}
            </div>

            {/* TABS */}
            <div className="flex gap-1 px-4 pb-2">
              {["ALL", "UNREAD"].map((tabName) => (
                <button
                  key={tabName}
                  onClick={() => setTab(tabName)}
                  className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-colors ${
                    tab === tabName
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  {tabName === "ALL" ? "All" : `Unread ${unread > 0 ? `(${unread})` : ""}`}
                </button>
              ))}
            </div>
          </div>

          {/* LIST */}
          <div className="max-h-[400px] overflow-y-auto">
            {loading ? (
              <div className="p-8 text-center">
                <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-sm text-gray-500 mt-2">Loading...</p>
              </div>
            ) : hasNotifications ? (
              <>
                {/* Today */}
                {groupedNotifications.today.length > 0 && (
                  <div>
                    <p className="px-4 py-2 text-xs font-medium text-gray-400 uppercase tracking-wider bg-gray-50">
                      Today
                    </p>
                    {groupedNotifications.today.map((n) => (
                      <NotificationItem
                        key={n.id}
                        notification={n}
                        onRead={handleMarkAsRead}
                        onNavigate={handleNavigation}
                      />
                    ))}
                  </div>
                )}

                {/* Yesterday */}
                {groupedNotifications.yesterday.length > 0 && (
                  <div>
                    <p className="px-4 py-2 text-xs font-medium text-gray-400 uppercase tracking-wider bg-gray-50">
                      Yesterday
                    </p>
                    {groupedNotifications.yesterday.map((n) => (
                      <NotificationItem
                        key={n.id}
                        notification={n}
                        onRead={handleMarkAsRead}
                        onNavigate={handleNavigation}
                      />
                    ))}
                  </div>
                )}

                {/* Earlier */}
                {groupedNotifications.earlier.length > 0 && (
                  <div>
                    <p className="px-4 py-2 text-xs font-medium text-gray-400 uppercase tracking-wider bg-gray-50">
                      Earlier
                    </p>
                    {groupedNotifications.earlier.map((n) => (
                      <NotificationItem
                        key={n.id}
                        notification={n}
                        onRead={handleMarkAsRead}
                        onNavigate={handleNavigation}
                      />
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Bell className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 font-medium">No notifications</p>
                <p className="text-sm text-gray-400 mt-1">
                  {tab === "UNREAD"
                    ? "You're all caught up!"
                    : "You'll see notifications here"}
                </p>
              </div>
            )}
          </div>

          {/* FOOTER */}
          {hasNotifications && (
            <div className="p-3 border-t border-gray-100 bg-gray-50">
              <button
                onClick={() => {
                  navigate("/notifications");
                  setOpen(false);
                }}
                className="w-full text-sm text-blue-600 hover:text-blue-700 font-medium py-1.5 hover:bg-blue-50 rounded-lg transition-colors"
              >
                View all notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;