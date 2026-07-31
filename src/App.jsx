import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

import Layout from "./components/Layout";
import Dashboard from "./components/Dashboard";
import RoomAllocation from "./components/RoomAllocation";
import Maintenance from "./components/Maintenance";
import Login from "./components/Login";
import FeeTracking from "./components/FeeTracking";

function App() {
  return (
    <Router>

      <Routes>

        {/* LOGIN HAS NO SIDEBAR OR TOPBAR */}
        <Route
          path="/login"
          element={<Login />}
        />

        {/* APPLICATION PAGES USE LAYOUT */}
        <Route
          path="/*"
          element={
            <Layout>
              <Routes>

                {/* DASHBOARD */}
                <Route
                  path="/"
                  element={<Dashboard />}
                />

                {/* ROOM ALLOCATION */}
                <Route
                  path="/room-allocation"
                  element={<RoomAllocation />}
                />

                {/* MAINTENANCE */}
                <Route
                  path="/maintenance"
                  element={<Maintenance />}
                />

                {/* FEE TRACKING */}
                <Route
                  path="/fee-tracking"
                  element={<FeeTracking />}
                />

              </Routes>
            </Layout>
          }
        />

      </Routes>

    </Router>
  );
}

export default App;