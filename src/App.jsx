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

function App() {
  return (
    <Router>

      <Routes>

        {/* ================================
            PUBLIC AUTHENTICATION
        ================================= */}

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


        {/* ================================
            PROTECTED APPLICATION
        ================================= */}

        <Route element={<ProtectedRoute />}>

          <Route
            path="/"
            element={
              <Layout>
                <Dashboard />
              </Layout>
            }
          />

          <Route
            path="/room-allocation"
            element={
              <Layout>
                <RoomAllocation />
              </Layout>
            }
          />

          <Route
            path="/maintenance"
            element={
              <Layout>
                <Maintenance />
              </Layout>
            }
          />

          <Route
            path="/fee-tracking"
            element={
              <Layout>
                <FeeTracking />
              </Layout>
            }
          />

        </Route>


        {/* ================================
            UNKNOWN URL
        ================================= */}

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

export default App;
