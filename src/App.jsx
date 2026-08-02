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
          onClick={() =>
            window.location.href = "/login"
          }
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

        {/* LOGIN */}
        <Route
          path="/login"
          element={<Login />}
        />

        {/* REGISTER */}
        <Route
          path="/register"
          element={<Register />}
        />

        {/* FORGOT PASSWORD */}
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
              
              Available to:
              - Student
              - Warden
              - Finance
              - Admin
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

              Available to:
              - Student
              - Warden
              - Admin
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

              Available to:
              - Student
              - Warden
              - Admin
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
              FEE TRACKING

              Available to:
              - Admin
              - Warden
              - Finance

              NOT available to students.
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