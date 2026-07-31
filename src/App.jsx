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
import FeeTracking from "./components/FeeTracking";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>

        {/* =====================================
            LOGIN
        ===================================== */}

        <Route
          path="/login"
          element={<Login />}
        />


        {/* =====================================
            PROTECTED APPLICATION
        ===================================== */}

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


        {/* =====================================
            UNKNOWN URL
        ===================================== */}

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