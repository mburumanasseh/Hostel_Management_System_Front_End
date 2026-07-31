import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach JWT automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ====================
// AUTH
// ====================

export const login = (data) => API.post("/auth/login", data);
export const register = (data) => API.post("/auth/register", data);
export const getCurrentUser = () => API.get("/auth/me");

// ====================
// STUDENTS
// ====================

export const getStudents = () => API.get("/students");

export const getStudent = (studentId) =>
  API.get(`/students/${studentId}`);

export const createStudent = (data) =>
  API.post("/students", data);

export const updateStudent = (studentId, data) =>
  API.put(`/students/${studentId}`, data);

export const deleteStudent = (studentId) =>
  API.delete(`/students/${studentId}`);

// ====================
// BLOCKS
// ====================

export const getBlocks = () => API.get("/blocks");

export const getBlock = (blockId) =>
  API.get(`/blocks/${blockId}`);

// ====================
// ROOMS
// ====================

export const getRooms = () => API.get("/rooms");

export const getRoom = (roomId) =>
  API.get(`/rooms/${roomId}`);

export const getRoomsByBlock = (blockId) =>
  API.get(`/rooms/block/${blockId}`);

// ====================
// ALLOCATIONS
// ====================

export const getAllocations = () =>
  API.get("/allocations");

export const getAllocation = (allocationId) =>
  API.get(`/allocations/${allocationId}`);

export const createAllocation = (data) =>
  API.post("/allocations", data);

export const getStudentAllocations = (studentId) =>
  API.get(`/allocations/student/${studentId}`);

export const getActiveAllocation = (studentId) =>
  API.get(`/allocations/student/${studentId}/active`);

export const completeAllocation = (allocationId) =>
  API.put(`/allocations/${allocationId}/complete`);

export const deleteAllocation = (allocationId) =>
  API.delete(`/allocations/${allocationId}`);

// ====================
// MAINTENANCE
// ====================

export const getMaintenanceRequests = () =>
  API.get("/maintenance");

export const getMaintenanceRequest = (requestId) =>
  API.get(`/maintenance/${requestId}`);

export const getStudentMaintenanceRequests = (studentId) =>
  API.get(`/maintenance/student/${studentId}`);

export const addMaintenanceRequest = (data) =>
  API.post("/maintenance", data);

export const updateMaintenanceStatus = (requestId, data) =>
  API.patch(`/maintenance/${requestId}/status`, data);

export const deleteMaintenanceRequest = (requestId) =>
  API.delete(`/maintenance/${requestId}`);

export default API;
