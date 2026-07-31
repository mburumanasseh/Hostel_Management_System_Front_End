
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./components/Dashboard";
import RoomAllocation from "./components/RoomAllocation";
import Maintenance from "./components/Maintenance";
import FeeTracking from "./components/FeeTracking";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/room-allocation" element={<RoomAllocation />} />
          <Route path="/maintenance" element={<Maintenance />} />
          <Route path="/fee-tracking" element={<FeeTracking />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
