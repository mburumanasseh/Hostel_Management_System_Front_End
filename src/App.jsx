
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Layout from "./components/Layout";
import Dashboard from "./components/Dashboard";
import RoomAllocation from "./components/RoomAllocation";
import Maintenance from "./components/Maintenance";
import Login from "./components/Login";
import Register from "./components/Register";
import FeeTracking from "./components/FeeTracking";
import StudentFeeTracking from "./components/StudentFeeTracking";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleRoute from "./components/RoleRoute";


/*
|--------------------------------------------------------------------------
| FORGOT PASSWORD
|--------------------------------------------------------------------------
*/

function ForgotPassword() {
  return (
    <div className="login-page">

      <div className="login-card">

        <h1>Forgot password?</h1>

        <p className="login-subtitle">
          Password recovery will be available here.
        </p>

        <button
          type="button"
          className="login-button"
          onClick={() => {
            window.location.href = "/login";
          }}
        >
          Back to Login
        </button>

      </div>

    </div>
  );
}


/*
|--------------------------------------------------------------------------
| APPLICATION
|--------------------------------------------------------------------------
*/

export default function App() {
  return (
    <Router>

      <Routes>

        {/* =====================================================
            PUBLIC ROUTES
        ===================================================== */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />


        {/* =====================================================
            AUTHENTICATED ROUTES
        ===================================================== */}

        <Route element={<ProtectedRoute />}>


          {/* =================================================
              DASHBOARD

              All authenticated users can access dashboard.
          ================================================= */}

          <Route
            path="/"
            element={
              <Layout>
                <Dashboard />
              </Layout>
            }
          />


          {/* =================================================
              ROOM ALLOCATION

              Student / Warden / Admin
          ================================================= */}

          <Route
            element={
              <RoleRoute
                allowedRoles={[
                  "student",
                  "warden",
                  "admin",
                ]}
              />
            }
          >

            <Route
              path="/room-allocation"
              element={
                <Layout>
                  <RoomAllocation />
                </Layout>
              }
            />

          </Route>


          {/* =================================================
              MAINTENANCE

              Student / Warden / Admin
          ================================================= */}

          <Route
            element={
              <RoleRoute
                allowedRoles={[
                  "student",
                  "warden",
                  "admin",
                ]}
              />
            }
          >

            <Route
              path="/maintenance"
              element={
                <Layout>
                  <Maintenance />
                </Layout>
              }
            />

          </Route>


          {/* =================================================
              STUDENT FEE TRACKING

              Student ONLY

              Students can:
              - View their own fee records
              - View payment history
              - Make payments

              Students CANNOT:
              - View other students' payments
              - Manage payment records
              - Update payment statuses
              - Delete payments
          ================================================= */}

          <Route
            element={
              <RoleRoute
                allowedRoles={[
                  "student",
                ]}
              />
            }
          >

            <Route
              path="/student-fee-tracking"
              element={
                <Layout>
                  <StudentFeeTracking />
                </Layout>
              }
            />

          </Route>


          {/* =================================================
              STAFF FEE TRACKING

              Admin / Warden / Finance ONLY

              Staff can:
              - View all student payments
              - Record payments
              - Update payment status
              - Delete payments
          ================================================= */}

          <Route
            element={
              <RoleRoute
                allowedRoles={[
                  "admin",
                  "warden",
                  "finance",
                ]}
              />
            }
          >

            <Route
              path="/fee-tracking"
              element={
                <Layout>
                  <FeeTracking />
                </Layout>
              }
            />

          </Route>


        </Route>


        {/* =====================================================
            UNKNOWN ROUTES
        ===================================================== */}

        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />

      </Routes>

    </Router>
  );
}
