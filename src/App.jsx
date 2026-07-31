import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./components/Dashboard";
import RoomAllocation from "./components/RoomAllocation";
import Maintenance from "./components/Maintenance";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/room-allocation" element={<RoomAllocation />} />
          <Route path="/maintenance" element={<Maintenance />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;