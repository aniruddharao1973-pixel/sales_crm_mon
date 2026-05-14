// import { Routes, Route, Navigate } from "react-router-dom";
// import { Suspense, lazy } from "react";
// import Layout from "./components/Layout";
// import ProtectedRoute from "./components/ProtectedRoute";
// import Spinner from "./components/Spinner";

// // Auth - load immediately
// import Login from "./features/auth/Login";
// import Register from "./features/auth/Register";

// // Lazy load other pages
// const Dashboard = lazy(() => import("./features/dashboard/Dashboard"));
// const AccountList = lazy(() => import("./features/accounts/AccountList"));
// const AccountForm = lazy(() => import("./features/accounts/AccountForm"));
// const AccountDetail = lazy(() => import("./features/accounts/AccountDetail"));
// const ContactList = lazy(() => import("./features/contacts/ContactList"));
// const ContactForm = lazy(() => import("./features/contacts/ContactForm"));
// const ContactDetail = lazy(() => import("./features/contacts/ContactDetail"));
// const DealList = lazy(() => import("./features/deals/DealList"));
// const DealForm = lazy(() => import("./features/deals/DealForm"));
// const DealDetail = lazy(() => import("./features/deals/DealDetail"));
// const DealPipeline = lazy(() => import("./features/deals/DealPipeline"));
// const TaskList = lazy(() => import("./features/tasks/TaskList"));
// const TaskForm = lazy(() => import("./features/tasks/TaskForm"));
// // Loading fallback
// const PageLoader = () => (
//   <div className="flex items-center justify-center py-20">
//     <Spinner size="lg" />
//   </div>
// );

// function App() {
//   return (
//     <Routes>
//       {/* Public */}
//       <Route path="/login" element={<Login />} />
//       <Route path="/register" element={<Register />} />

//       {/* Protected */}
//       <Route
//         path="/"
//         element={
//           <ProtectedRoute>
//             <Layout />
//           </ProtectedRoute>
//         }
//       >
//         <Route
//           index
//           element={
//             <Suspense fallback={<PageLoader />}>
//               <Dashboard />
//             </Suspense>
//           }
//         />

//         {/* Accounts */}
//         <Route
//           path="accounts"
//           element={
//             <Suspense fallback={<PageLoader />}>
//               <AccountList />
//             </Suspense>
//           }
//         />
//         <Route
//           path="accounts/new"
//           element={
//             <Suspense fallback={<PageLoader />}>
//               <AccountForm />
//             </Suspense>
//           }
//         />
//         <Route
//           path="accounts/:id"
//           element={
//             <Suspense fallback={<PageLoader />}>
//               <AccountDetail />
//             </Suspense>
//           }
//         />
//         <Route
//           path="accounts/:id/edit"
//           element={
//             <Suspense fallback={<PageLoader />}>
//               <AccountForm />
//             </Suspense>
//           }
//         />

//         {/* Contacts */}
//         <Route
//           path="contacts"
//           element={
//             <Suspense fallback={<PageLoader />}>
//               <ContactList />
//             </Suspense>
//           }
//         />
//         <Route
//           path="contacts/new"
//           element={
//             <Suspense fallback={<PageLoader />}>
//               <ContactForm />
//             </Suspense>
//           }
//         />
//         <Route
//           path="contacts/:id"
//           element={
//             <Suspense fallback={<PageLoader />}>
//               <ContactDetail />
//             </Suspense>
//           }
//         />
//         <Route
//           path="contacts/:id/edit"
//           element={
//             <Suspense fallback={<PageLoader />}>
//               <ContactForm />
//             </Suspense>
//           }
//         />

//         {/* Deals */}
//         <Route
//           path="deals"
//           element={
//             <Suspense fallback={<PageLoader />}>
//               <DealList />
//             </Suspense>
//           }
//         />
//         <Route
//           path="deals/pipeline"
//           element={
//             <Suspense fallback={<PageLoader />}>
//               <DealPipeline />
//             </Suspense>
//           }
//         />
//         <Route
//           path="deals/new"
//           element={
//             <Suspense fallback={<PageLoader />}>
//               <DealForm />
//             </Suspense>
//           }
//         />
//         <Route
//           path="deals/:id"
//           element={
//             <Suspense fallback={<PageLoader />}>
//               <DealDetail />
//             </Suspense>
//           }
//         />
//         <Route
//           path="deals/:id/edit"
//           element={
//             <Suspense fallback={<PageLoader />}>
//               <DealForm />
//             </Suspense>
//           }
//         />
//           {/* Tasks */}
//           {/* Tasks */}
// <Route
//   path="tasks"
//   element={
//     <Suspense fallback={<PageLoader />}>
//       <TaskList />
//     </Suspense>
//   }
// />

// <Route
//   path="tasks/new"
//   element={
//     <Suspense fallback={<PageLoader />}>
//       <TaskForm />
//     </Suspense>
//   }
// />

// <Route
//   path="tasks/:id/edit"
//   element={
//     <Suspense fallback={<PageLoader />}>
//       <TaskForm />
//     </Suspense>
//   }
// />

//         {/* Catch all */}
//         <Route path="*" element={<Navigate to="/" replace />} />
//       </Route>
//     </Routes>
//   );
// }

// export default App;

// App.jsx
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { socket } from "./socket";
import { Toaster } from "react-hot-toast";
import { Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import Spinner from "./components/Spinner";
import { useLocation } from "react-router-dom";
import toast from "react-hot-toast";

// Auth
import Login from "./features/auth/Login";

import AdminRoute from "./components/AdminRoute";
import AdvancedAnalytics from "./features/analytics/pages/AdvancedAnalytics";
import CalendarPage from "./features/calendar/pages/CalendarPage";
import { useDispatch } from "react-redux";
import { addNotification } from "./features/notifications/notificationSlice";

// Lazy pages
const Dashboard = lazy(() => import("./features/dashboard/Dashboard"));
const AccountList = lazy(() => import("./features/accounts/AccountList"));
const AccountForm = lazy(() => import("./features/accounts/AccountForm"));
const AccountDetail = lazy(() => import("./features/accounts/AccountDetail"));
const ContactList = lazy(() => import("./features/contacts/ContactList"));
const ContactForm = lazy(() => import("./features/contacts/ContactForm"));
const ContactDetail = lazy(() => import("./features/contacts/ContactDetail"));
const DealList = lazy(() => import("./features/deals/DealList"));
const DealForm = lazy(() => import("./features/deals/DealForm"));
const DealDetail = lazy(() => import("./features/deals/DealDetail"));
const DealPipeline = lazy(() => import("./features/deals/DealPipeline"));

const Users = lazy(() => import("./features/users/Users"));
const CreateUser = lazy(() => import("./features/users/CreateUser"));
const EditUser = lazy(() => import("./features/users/EditUser"));
const QuotationList = lazy(() => import("./features/quotations/QuotationList"));
const QuotationForm = lazy(() => import("./features/quotations/QuotationForm"));
const QuotationDetail = lazy(
  () => import("./features/quotations/QuotationDetail"),
);
const ItemList = lazy(() => import("./features/items/ItemList"));
const ItemForm = lazy(() => import("./features/items/ItemForm"));
const ItemDetail = lazy(() => import("./features/items/ItemDetail"));

const PageLoader = () => (
  <div className="flex items-center justify-center py-20">
    <Spinner size="lg" />
  </div>
);

function App() {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();
  const dispatch = useDispatch();

  // ✅ JOIN SOCKET ROOM WHEN USER LOGS IN
  // useEffect(() => {
  //   if (user?.id) {
  //     socket.emit("join", user.id);
  //   }

  //   return () => {
  //     socket.off("join");
  //   };
  // }, [user]);

  useEffect(() => {
    if (!user?.id) return;

    // Join room
    socket.emit("join", user.id);

    // 🔔 Listen for notifications
    socket.on("notification", (data) => {
      console.log("🔔 New Notification:", data);

      // Add to Redux
      dispatch(addNotification(data));

      // Optional: toast popup
      toast.success(data.title || "New Notification");
    });

    return () => {
      socket.off("notification");
    };
  }, [user, dispatch]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);

    if (params.get("connected") === "true") {
      toast.success("Google Calendar connected successfully");
    }

    if (params.get("connected") === "false") {
      toast.error("Google Calendar connection failed");
    }
  }, [location]);

  return (
    <>
      {/* ✅ GLOBAL TOASTER REMOVED FROM HERE (HANDLED IN MAIN.JSX) */}


      <Routes>
        {/* Public */}
        {/* Users – ADMIN ONLY */}

        {/* <Route
  path="users/:id"
  element={
    <AdminRoute>
      <Suspense fallback={<PageLoader />}>
        <EditUser />
      </Suspense>
    </AdminRoute>
  }
/> */}
        <Route path="/login" element={<Login />} />

        {/* Protected */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route
            index
            element={
              <Suspense fallback={<PageLoader />}>
                <Dashboard />
              </Suspense>
            }
          />
          <Route
            path="analytics/advanced"
            element={
              <Suspense fallback={<PageLoader />}>
                <AdvancedAnalytics />
              </Suspense>
            }
          />
          {/* Accounts */}
          <Route
            path="accounts"
            element={
              <Suspense fallback={<PageLoader />}>
                <AccountList />
              </Suspense>
            }
          />
          <Route
            path="accounts/new"
            element={
              <Suspense fallback={<PageLoader />}>
                <AccountForm />
              </Suspense>
            }
          />
          <Route
            path="accounts/:id"
            element={
              <Suspense fallback={<PageLoader />}>
                <AccountDetail />
              </Suspense>
            }
          />
          <Route
            path="accounts/:id/edit"
            element={
              <Suspense fallback={<PageLoader />}>
                <AccountForm />
              </Suspense>
            }
          />
          {/* USERS – ADMIN ONLY – RIGHT SIDE RENDER */}
          <Route
            path="users"
            element={
              <AdminRoute>
                <Suspense fallback={<PageLoader />}>
                  <Users />
                </Suspense>
              </AdminRoute>
            }
          />

          <Route
            path="users/create"
            element={
              <AdminRoute>
                <Suspense fallback={<PageLoader />}>
                  <CreateUser />
                </Suspense>
              </AdminRoute>
            }
          />

          <Route
            path="users/:id"
            element={
              <AdminRoute>
                <Suspense fallback={<PageLoader />}>
                  <EditUser />
                </Suspense>
              </AdminRoute>
            }
          />

          {/* Contacts */}
          <Route
            path="contacts"
            element={
              <Suspense fallback={<PageLoader />}>
                <ContactList />
              </Suspense>
            }
          />
          <Route
            path="contacts/new"
            element={
              <Suspense fallback={<PageLoader />}>
                <ContactForm />
              </Suspense>
            }
          />
          <Route
            path="contacts/:id"
            element={
              <Suspense fallback={<PageLoader />}>
                <ContactDetail />
              </Suspense>
            }
          />
          <Route
            path="contacts/:id/edit"
            element={
              <Suspense fallback={<PageLoader />}>
                <ContactForm />
              </Suspense>
            }
          />

          {/* Deals */}
          <Route
            path="deals"
            element={
              <Suspense fallback={<PageLoader />}>
                <DealList />
              </Suspense>
            }
          />
          <Route
            path="deals/pipeline"
            element={
              <Suspense fallback={<PageLoader />}>
                <DealPipeline />
              </Suspense>
            }
          />
          <Route
            path="deals/new"
            element={
              <Suspense fallback={<PageLoader />}>
                <DealForm />
              </Suspense>
            }
          />
          <Route
            path="deals/:id"
            element={
              <Suspense fallback={<PageLoader />}>
                <DealDetail />
              </Suspense>
            }
          />
          <Route
            path="deals/:id/edit"
            element={
              <Suspense fallback={<PageLoader />}>
                <DealForm />
              </Suspense>
            }
          />

          

          <Route
            path="/calendar"
            element={
              <Suspense fallback={<PageLoader />}>
                <CalendarPage />
              </Suspense>
            }
          />
          {/* Quotations */}
          <Route
            path="quotations"
            element={
              <Suspense fallback={<PageLoader />}>
                <QuotationList />
              </Suspense>
            }
          />

          <Route
            path="quotations/new"
            element={
              <Suspense fallback={<PageLoader />}>
                <QuotationForm />
              </Suspense>
            }
          />

          <Route
            path="quotations/:id"
            element={
              <Suspense fallback={<PageLoader />}>
                <QuotationDetail />
              </Suspense>
            }
          />

          <Route
            path="quotations/:id/edit"
            element={
              <Suspense fallback={<PageLoader />}>
                <QuotationForm />
              </Suspense>
            }
          />

          {/* Items */}
          <Route
            path="items"
            element={
              <Suspense fallback={<PageLoader />}>
                <ItemList />
              </Suspense>
            }
          />

          <Route
            path="items/new"
            element={
              <Suspense fallback={<PageLoader />}>
                <ItemForm />
              </Suspense>
            }
          />

          <Route
            path="items/:id"
            element={
              <Suspense fallback={<PageLoader />}>
                <ItemDetail />
              </Suspense>
            }
          />

          <Route
            path="items/:id/edit"
            element={
              <Suspense fallback={<PageLoader />}>
                <ItemForm />
              </Suspense>
            }
          />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
