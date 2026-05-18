// // src/components/Sidebar.jsx

// import { NavLink } from "react-router-dom";
// import {
//   HomeIcon,
//   BuildingOffice2Icon,
//   UserGroupIcon,
//   CurrencyDollarIcon,
//   ChartBarIcon,
//   Cog6ToothIcon,
//   CheckCircleIcon
// } from "@heroicons/react/24/outline";

// const navigation = [
//   { name: "Dashboard", to: "/", icon: HomeIcon },
//   { name: "Accounts", to: "/accounts", icon: BuildingOffice2Icon },
//   { name: "Contacts", to: "/contacts", icon: UserGroupIcon },
//   { name: "Deals", to: "/deals", icon: CurrencyDollarIcon },
//   { name: "Tasks", to: "/tasks", icon: CheckCircleIcon },
//   { name: "Pipeline", to: "/deals/pipeline", icon: ChartBarIcon },
// ];

// const Sidebar = ({ onClose }) => {
//   return (
//     <div className="flex flex-col h-full">
//       {/* Logo */}
//       <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100">
//         <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm">
//           <span className="text-white font-bold text-sm">CRM</span>
//         </div>
//         <span className="text-lg font-bold text-gray-900">
//           SalesCRM
//         </span>
//       </div>

//       {/* Navigation */}
//       <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
//         {navigation.map((item) => (
//           <NavLink
//             key={item.name}
//             to={item.to}
//             end={item.to === "/"}
//             onClick={onClose}
//             className={({ isActive }) =>
//               `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
//               transition-all duration-200 group ${
//                 isActive
//                   ? "bg-blue-50 text-blue-700 shadow-sm"
//                   : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
//               }`
//             }
//           >
//             <item.icon
//               className={`w-5 h-5 transition-colors`}
//             />
//             {item.name}
//           </NavLink>
//         ))}
//       </nav>

//       {/* Footer */}
//       <div className="px-4 py-4 border-t border-gray-100">
//         <div className="flex items-center gap-3 px-3 py-2 text-sm text-gray-400">
//           <Cog6ToothIcon className="w-4 h-4" />
//           <span>v1.0.0</span>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Sidebar;
// src/components/Sidebar.jsx

// // src/components/Sidebar.jsx
// import { useState, useEffect, useCallback } from "react";
// import { useSelector } from "react-redux";
// import { NavLink, useLocation } from "react-router-dom";
// import {
//   LayoutDashboard,
//   Building2,
//   Users,
//   IndianRupee,
//   CheckSquare,
//   ChevronLeft,
//   ChevronRight,
//   X,
//   BarChart3,
//   CalendarDays,
// } from "lucide-react";

// function MenuItem({ item, onNavigate, isMobile = false, collapsed, isActive }) {
//   const active = isActive(item.to);
//   const showCollapsed = collapsed && !isMobile;

//   return (
//     <NavLink to={item.to} onClick={onNavigate} className="block">
//       <div className="relative">
//         {active && !showCollapsed && (
//           <div
//             className="absolute -top-[20px] right-0 w-[20px] h-[20px] pointer-events-none z-10"
//             style={{
//               background:
//                 "radial-gradient(circle at top left, transparent 20px, white 20px)",
//             }}
//           />
//         )}

//         <div
//           className={`
//             group relative flex items-center
//             ${showCollapsed ? "justify-center mx-2 px-0" : "gap-3 pl-6 pr-4"}
//             py-3 transition-all duration-300 ease-in-out
//             ${
//               active
//                 ? showCollapsed
//                   ? "bg-white text-[#3B2E7E] rounded-xl font-semibold shadow-md"
//                   : "bg-white text-[#3B2E7E] rounded-l-full font-semibold shadow-md"
//                 : "text-white/80 hover:bg-white/10 hover:text-white"
//             }
//           `}
//         >
//           <item.icon
//             className={`w-5 h-5 flex-shrink-0 transition-transform duration-200 ${
//               active ? "scale-110" : "group-hover:scale-105"
//             }`}
//           />

//           {!showCollapsed && (
//             <span className="text-sm font-medium transition-opacity duration-200">
//               {item.name}
//             </span>
//           )}

//           {showCollapsed && (
//             <span className="absolute left-full ml-3 bg-[#2A1F5C] text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 whitespace-nowrap z-[60] pointer-events-none shadow-lg transition-opacity duration-200">
//               {item.name}
//             </span>
//           )}
//         </div>

//         {active && !showCollapsed && (
//           <div
//             className="absolute -bottom-[20px] right-0 w-[20px] h-[20px] pointer-events-none z-10"
//             style={{
//               background:
//                 "radial-gradient(circle at bottom left, transparent 20px, white 20px)",
//             }}
//           />
//         )}
//       </div>
//     </NavLink>
//   );
// }

// function BrandSection({ isCollapsed }) {
//   return (
//     <div
//       className={`flex items-center ${
//         isCollapsed ? "justify-center" : "gap-3"
//       } px-4 py-6 transition-all duration-300`}
//     >
//       <div
//         className={`overflow-hidden transition-all duration-300 ease-in-out ${
//           isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
//         }`}
//       >
//         <h1 className="font-semibold text-lg whitespace-nowrap">
//           FactEyes CRM
//         </h1>
//       </div>
//     </div>
//   );
// }

// function SidebarContent({
//   menu,
//   isMobile = false,
//   collapsed,
//   setCollapsed,
//   onClose,
//   isActive,
// }) {
//   const isCollapsed = collapsed && !isMobile;

//   return (
//     <>
//       <div
//         className={`flex items-center ${isMobile ? "justify-between" : ""} p-2`}
//       >
//         <BrandSection isCollapsed={isCollapsed} />
//         {isMobile && (
//           <button
//             onClick={onClose}
//             className="bg-white/10 p-2 rounded-xl hover:bg-white/20 active:scale-95 transition-all duration-200 flex-shrink-0 mr-2"
//             aria-label="Close menu"
//           >
//             <X size={18} />
//           </button>
//         )}
//       </div>

//       <div className="mx-3 mb-2 border-t border-white/10" />

//       <div className="flex-1 space-y-1 mt-2 overflow-y-auto overflow-x-hidden overscroll-contain">
//         {menu.map((item) => (
//           <MenuItem
//             key={item.name}
//             item={item}
//             isMobile={isMobile}
//             collapsed={collapsed}
//             isActive={isActive}
//             onNavigate={isMobile ? onClose : undefined}
//           />
//         ))}
//       </div>

//       {isMobile ? (
//         <div className="p-4 border-t border-white/10">
//           <p className="text-white/40 text-xs text-center">© 2025 SalesCRM</p>
//         </div>
//       ) : (
//         <div className="flex justify-center py-4 border-t border-white/10">
//           <button
//             onClick={() => setCollapsed(!collapsed)}
//             className="bg-white/10 p-2.5 rounded-xl hover:bg-white/20 active:scale-95 transition-all duration-200"
//             aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
//           >
//             <div className="transition-transform duration-300">
//               {collapsed ? (
//                 <ChevronRight size={18} />
//               ) : (
//                 <ChevronLeft size={18} />
//               )}
//             </div>
//           </button>
//         </div>
//       )}
//     </>
//   );
// }

// export default function Sidebar({ mobileOpen = false, onClose }) {
//   const location = useLocation();
//   const [collapsed, setCollapsed] = useState(false);
//   const { user } = useSelector((state) => state.auth);

//   const menu = [
//     { name: "Dashboard", to: "/", icon: LayoutDashboard },
//     { name: "Accounts", to: "/accounts", icon: Building2 },
//     { name: "Contacts", to: "/contacts", icon: Users },
//     { name: "Deals", to: "/deals", icon: IndianRupee },
//     { name: "Tasks", to: "/tasks", icon: CheckSquare },

//     // ✅ ADD THIS
//     { name: "Calendar", to: "/calendar", icon: CalendarDays },

//     ...(user?.role === "ADMIN"
//       ? [{ name: "Users", to: "/users", icon: Users }]
//       : []),

//     {
//       name: "Advanced Analytics",
//       to: "/analytics/advanced",
//       icon: BarChart3,
//       badge: "NEW",
//     },
//   ];

//   const isActive = useCallback(
//     (path) => location.pathname === path,
//     [location.pathname],
//   );

//   useEffect(() => {
//     onClose?.();
//   }, [location.pathname]);

//   useEffect(() => {
//     if (mobileOpen) {
//       document.body.style.overflow = "hidden";
//     } else {
//       document.body.style.overflow = "";
//     }
//     return () => {
//       document.body.style.overflow = "";
//     };
//   }, [mobileOpen]);

//   useEffect(() => {
//     const handleEsc = (e) => {
//       if (e.key === "Escape") onClose?.();
//     };
//     window.addEventListener("keydown", handleEsc);
//     return () => window.removeEventListener("keydown", handleEsc);
//   }, [onClose]);

//   useEffect(() => {
//     const handleResize = () => {
//       if (window.innerWidth >= 1024) {
//         onClose?.();
//       }
//     };
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, [onClose]);

//   return (
//     <>
//       <div
//         className={`
//           lg:hidden fixed inset-0 z-[48]
//           transition-opacity duration-300 ease-in-out
//           ${
//             mobileOpen
//               ? "opacity-100 pointer-events-auto"
//               : "opacity-0 pointer-events-none"
//           }
//         `}
//         onClick={onClose}
//         aria-hidden="true"
//       >
//         <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />
//       </div>

//       <aside
//         className={`
//           lg:hidden fixed top-0 left-0 h-full w-[280px] z-[50]
//           bg-gradient-to-b from-[#3B2E7E] to-[#2A1F5C] text-white
//           flex flex-col shadow-2xl
//           transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]
//           will-change-transform
//           ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
//         `}
//       >
//         <SidebarContent
//           menu={menu}
//           isMobile={true}
//           collapsed={collapsed}
//           setCollapsed={setCollapsed}
//           onClose={onClose}
//           isActive={isActive}
//         />
//       </aside>

//       <aside
//         className={`
//           hidden lg:flex flex-col h-screen
//           bg-gradient-to-b from-[#3B2E7E] to-[#2A1F5C] text-white
//           transition-all duration-300 ease-in-out flex-shrink-0
//           will-change-[width]
//           ${collapsed ? "w-[72px]" : "w-[250px]"}
//         `}
//       >
//         <SidebarContent
//           menu={menu}
//           isMobile={false}
//           collapsed={collapsed}
//           setCollapsed={setCollapsed}
//           onClose={onClose}
//           isActive={isActive}
//         />
//       </aside>
//     </>
//   );
// }

// src/components/Sidebar.jsx
import { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchAssignments } from "../features/assign/assignmentSlice";
import AssignmentGrid from "../features/assign/AssignmentGrid";
import { NavLink, useLocation } from "react-router-dom";
import { FileText, Package } from "lucide-react";
import {
  LayoutDashboard,
  Building2,
  Users,
  Target,
  CheckSquare,
  ChevronLeft,
  ChevronRight,
  X,
  BarChart3,
  CalendarDays,
} from "lucide-react";

/* ================= MENU ITEM ================= */
function MenuItem({
  item,
  onNavigate,
  onAction,
  isMobile = false,
  collapsed,
  isActive,
}) {
  const active = item.to ? isActive(item.to) : false;
  const showCollapsed = collapsed && !isMobile;

  const handleClick = () => {
    if (item.action && onAction) {
      onAction(item.action);
    } else if (onNavigate) {
      onNavigate();
    }
  };

  const content = (
    <div className="relative">
      {active && !showCollapsed && (
        <div
          className="absolute -top-[20px] right-0 w-[20px] h-[20px]"
          style={{
            background:
              "radial-gradient(circle at top left, transparent 20px, white 20px)",
          }}
        />
      )}

      <div
        className={`
          group relative flex items-center
          ${showCollapsed ? "justify-center mx-2 px-0" : "gap-3 pl-6 pr-4"}
          py-3 transition-all duration-300 ease-in-out
          ${
            active
              ? showCollapsed
                ? "bg-white text-[#3B2E7E] rounded-xl font-semibold shadow-md"
                : "bg-white text-[#3B2E7E] rounded-l-full font-semibold shadow-md"
              : "text-white/80 hover:bg-white/10 hover:text-white"
          }
        `}
      >
        <item.icon className="w-5 h-5 flex-shrink-0" />

        {!showCollapsed && (
          <span className="text-sm font-medium">{item.name}</span>
        )}

        {showCollapsed && (
          <span className="absolute left-full ml-3 bg-[#2A1F5C] text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 whitespace-nowrap z-[60]">
            {item.name}
          </span>
        )}
      </div>

      {active && !showCollapsed && (
        <div
          className="absolute -bottom-[20px] right-0 w-[20px] h-[20px]"
          style={{
            background:
              "radial-gradient(circle at bottom left, transparent 20px, white 20px)",
          }}
        />
      )}
    </div>
  );

  if (item.to) {
    return (
      <NavLink to={item.to} onClick={handleClick} className="block">
        {content}
      </NavLink>
    );
  }

  return (
    <button onClick={handleClick} className="block w-full text-left">
      {content}
    </button>
  );
}

/* ================= BRAND ================= */
function BrandSection({ isCollapsed }) {
  return (
    <div
      className={`flex items-center ${
        isCollapsed ? "justify-center" : "gap-3"
      } px-4 py-6 transition-all duration-300`}
    >
      <div className="flex-shrink-0 w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20 shadow-lg">
        <span className="text-xl font-bold text-white">M</span>
      </div>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
        }`}
      >
        <h1 className="font-bold text-lg whitespace-nowrap tracking-tight">
          Micrologic Edge
        </h1>
      </div>
    </div>
  );
}

/* ================= SIDEBAR CONTENT ================= */
function SidebarContent({
  menu,
  isMobile = false,
  collapsed,
  setCollapsed,
  onClose,
  isActive,
  onAction,
}) {
  const isCollapsed = collapsed && !isMobile;

  return (
    <>
      <div
        className={`flex items-center ${isMobile ? "justify-between" : ""} p-2`}
      >
        <BrandSection isCollapsed={isCollapsed} />
        {isMobile && (
          <button onClick={onClose} className="bg-white/10 p-2 rounded-xl">
            <X size={18} />
          </button>
        )}
      </div>

      <div className="mx-3 mb-2 border-t border-white/10" />

     <div className="flex-1 space-y-1 mt-2 overflow-y-auto overflow-x-hidden">
        {menu.map((item) => (
          <MenuItem
            key={item.name}
            item={item}
            isMobile={isMobile}
            collapsed={collapsed}
            isActive={isActive}
            onNavigate={isMobile ? onClose : undefined}
            onAction={onAction}
          />
        ))}
      </div>

      {/* {!isMobile && (
        <div className="flex justify-center py-4 border-t border-white/10">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="bg-white/10 p-2.5 rounded-xl"
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>
      )} */}
      {/* {!isMobile && ( */}
      <div className="mt-auto">
        {/* Collapse Button */}
        <div className="flex justify-center py-4 border-t border-white/10">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="bg-white/10 p-2.5 rounded-xl hover:bg-white/20 transition"
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {/* 🔥 PREMIUM BRANDING */}
        <div
          className={`
        px-4 pb-5 transition-all duration-300
        ${collapsed ? "flex justify-center px-2" : ""}
      `}
        >
          <a
            href="https://facteyes.com/"
            target="_blank"
            rel="noopener noreferrer"
            className={`
          group relative block rounded-xl
          bg-gradient-to-r from-white/5 to-white/0
          hover:from-white/10 hover:to-white/5
          border border-white/10 hover:border-white/20
          transition-all duration-300
          ${collapsed ? "p-2" : "p-3"}
        `}
          >
            {/* Glow effect */}
            <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition bg-white/5 blur-md" />

            <div
              className={`relative flex items-center ${
                collapsed ? "justify-center" : "gap-2"
              }`}
            >
              {/* Logo Dot */}
              <div className="w-2 h-2 rounded-full bg-indigo-400 group-hover:bg-indigo-300 transition" />

              {/* Text */}
              {!collapsed && (
                <span className="text-[11px] leading-snug text-white/60 group-hover:text-white/90 transition">
                  Passionately engineered by{" "}
                  <span className="font-semibold text-white">Micrologic Edge</span>
                </span>
              )}
            </div>
          </a>
        </div>
      </div>
    </>
  );
}

/* ================= MAIN SIDEBAR ================= */
export default function Sidebar({ mobileOpen = false, onClose }) {
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [collapsed, setCollapsed] = useState(false);
  const [showAssignments, setShowAssignments] = useState(false);
  const [activeTab, setActiveTab] = useState("deal");

  const handleAction = (action) => {
    if (action === "openAssignments") {
      setShowAssignments(true);
      dispatch(fetchAssignments("deal"));
    }
  };

  const menu = [
    { name: "Dashboard", to: "/", icon: LayoutDashboard },
    { name: "Accounts", to: "/accounts", icon: Building2 },
    { name: "Contacts", to: "/contacts", icon: Users },
    { name: "Leads", to: "/deals", icon: Target },
    { name: "Quotation Hub", to: "/quotations", icon: FileText },
    { name: "Items", to: "/items", icon: Package },
    { name: "Calendar", to: "/calendar", icon: CalendarDays },

    ...(["SUPER_ADMIN", "TSL"].includes(user?.role)
      ? [
          { name: "Users", to: "/users", icon: Users },
          {
            name: "Access Management",
            action: "openAssignments",
            icon: CheckSquare,
          },
        ]
      : []),

    {
      name: "Advanced Analytics",
      to: "/analytics/advanced",
      icon: BarChart3,
    },
  ];

  const isActive = useCallback(
    (path) => location.pathname === path,
    [location.pathname],
  );

  const TAB_CONFIG = [
    {
      key: "deal",
    label: "Leads",
      icon: (
        <svg
          className="w-3.5 h-3.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6M5 8h14M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z"
          />
        </svg>
      ),
    },
    {
      key: "contact",
      label: "Contacts",
      icon: (
        <svg
          className="w-3.5 h-3.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
    },
    {
      key: "account",
      label: "Accounts",
      icon: (
        <svg
          className="w-3.5 h-3.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-2 10v-5a1 1 0 00-1-1h-2a1 1 0 00-1 1v5m4 0H9"
          />
        </svg>
      ),
    },
  ];

  useEffect(() => onClose?.(), [location.pathname]);

  return (
    <>
      {/* MOBILE */}
      <aside
        className={`lg:hidden fixed top-0 left-0 h-full w-[280px] z-[50] flex flex-col bg-gradient-to-b from-[#3B2E7E] to-[#2A1F5C] text-white ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarContent
          menu={menu}
          isMobile
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          onClose={onClose}
          isActive={isActive}
          onAction={handleAction}
        />
      </aside>
      {/* DESKTOP */}
      <aside
        className={`hidden lg:flex flex-col h-screen overflow-hidden bg-gradient-to-b from-[#3B2E7E] to-[#2A1F5C] text-white ${
          collapsed ? "w-[72px]" : "w-[250px]"
        }`}
      >
        <SidebarContent
          menu={menu}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          isActive={isActive}
          onAction={handleAction}
        />
      </aside>
      {showAssignments && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-[2px] transition-opacity duration-200"
            onClick={() => setShowAssignments(false)}
          />

          {/* Panel */}
          <div className="relative w-full max-w-7xl h-[90vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200/60">
            {/* ── Modal Header ── */}
            <div className="shrink-0 flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                {/* Icon */}
                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-indigo-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-sm font-bold text-gray-900 leading-tight">
                    Access Management
                  </h2>
                  <p className="text-[11px] text-gray-400">
                    Control who can view each record
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowAssignments(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* ── Tabs ── */}
            <div className="shrink-0 flex items-center gap-1 px-4 pt-3 pb-0 border-b border-gray-100">
              {TAB_CONFIG.map(({ key, label, icon }) => (
                <button
                  key={key}
                  onClick={() => {
                    setActiveTab(key);
                    dispatch(fetchAssignments(key));
                  }}
                  className={`
              relative inline-flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-semibold
              rounded-t-lg transition-all duration-150 focus:outline-none
              ${
                activeTab === key
                  ? "text-indigo-700 bg-white border border-b-white border-gray-200 -mb-px z-10"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50 border border-transparent"
              }
            `}
                >
                  {icon}
                  {label}
                  {activeTab === key && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 rounded-t-full" />
                  )}
                </button>
              ))}
            </div>

            {/* ── Content ── */}
            <div className="flex-1 min-h-0 overflow-hidden">
              <AssignmentGrid type={activeTab} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
