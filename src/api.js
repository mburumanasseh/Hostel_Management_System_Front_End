import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});


/*
|--------------------------------------------------------------------------
| JWT INTERCEPTOR
|--------------------------------------------------------------------------
| Automatically attaches the logged-in user's token to every request.
|--------------------------------------------------------------------------
*/

API.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("access_token") ||
      sessionStorage.getItem("access_token");

    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

API.interceptors.response.use(
  (response) => response,

  (error) => {
    if (error.response?.status === 401) {
      console.error(
        "Authentication failed:",
        error.response.data
      );

      localStorage.removeItem("access_token");
      localStorage.removeItem("user");

      sessionStorage.removeItem("access_token");

      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

/*
|--------------------------------------------------------------------------
| AUTHENTICATION
|--------------------------------------------------------------------------
*/

export const login = (data) =>
  API.post("/auth/login", data);

export const register = (data) =>
  API.post("/auth/register", data);

export const getCurrentUser = () =>
  API.get("/auth/me");


/*
|--------------------------------------------------------------------------
| STUDENTS
|--------------------------------------------------------------------------
*/

export const getStudents = () =>
  API.get("/students");

export const getStudent = (studentId) =>
  API.get(`/students/${studentId}`);

export const createStudent = (data) =>
  API.post("/students", data);

export const updateStudent = (studentId, data) =>
  API.put(`/students/${studentId}`, data);

export const deleteStudent = (studentId) =>
  API.delete(`/students/${studentId}`);


/*
|--------------------------------------------------------------------------
| BLOCKS
|--------------------------------------------------------------------------
*/

export const getBlocks = () =>
  API.get("/blocks");

export const getBlock = (blockId) =>
  API.get(`/blocks/${blockId}`);

export const createBlock = (data) =>
  API.post("/blocks", data);

export const updateBlock = (blockId, data) =>
  API.put(`/blocks/${blockId}`, data);

export const deleteBlock = (blockId) =>
  API.delete(`/blocks/${blockId}`);


/*
|--------------------------------------------------------------------------
| ROOMS
|--------------------------------------------------------------------------
*/

export const getRooms = () =>
  API.get("/rooms");

export const getRoom = (roomId) =>
  API.get(`/rooms/${roomId}`);

export const getRoomsByBlock = (blockId) =>
  API.get(`/rooms/block/${blockId}`);

export const createRoom = (data) =>
  API.post("/rooms", data);

export const updateRoom = (roomId, data) =>
  API.put(`/rooms/${roomId}`, data);

export const deleteRoom = (roomId) =>
  API.delete(`/rooms/${roomId}`);


/*
|--------------------------------------------------------------------------
| ALLOCATIONS
|--------------------------------------------------------------------------
*/

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


/*
|--------------------------------------------------------------------------
| MAINTENANCE
|--------------------------------------------------------------------------
*/

export const getMaintenanceRequests = () =>
  API.get("/maintenance");

export const getMaintenanceRequest = (requestId) =>
  API.get(`/maintenance/${requestId}`);

export const getStudentMaintenanceRequests = (studentId) =>
  API.get(`/maintenance/student/${studentId}`);

export const addMaintenanceRequest = (data) =>
  API.post("/maintenance", data);

export const updateMaintenanceStatus = (
  requestId,
  data
) =>
  API.patch(
    `/maintenance/${requestId}/status`,
    data
  );

export const deleteMaintenanceRequest = (
  requestId
) =>
  API.delete(`/maintenance/${requestId}`);


/*
|--------------------------------------------------------------------------
| PAYMENTS / FEES
|--------------------------------------------------------------------------
*/

// Get all payments
export const getPayments = () =>
  API.get("/payments");

// Get one payment
export const getPayment = (paymentId) =>
  API.get(`/payments/${paymentId}`);

// Get payments belonging to a student
export const getStudentPayments = (studentId) =>
  API.get(`/payments/student/${studentId}`);

// Create a payment
export const createPayment = (data) =>
  API.post("/payments", data);

// Update payment status
export const updatePaymentStatus = (paymentId, data) =>
  API.patch(
    `/payments/${paymentId}/status`,
    data
  );

// Delete payment
export const deletePayment = (paymentId) =>
  API.delete(`/payments/${paymentId}`);


/*
|--------------------------------------------------------------------------
| DASHBOARD
|--------------------------------------------------------------------------
|
| Your current dashboard is calculating statistics from:
| students, rooms, allocations and maintenance.
|
|--------------------------------------------------------------------------
*/

export const getDashboardData = async () => {
  const [
    students,
    rooms,
    allocations,
    maintenance,
  ] = await Promise.allSettled([
    getStudents(),
    getRooms(),
    getAllocations(),
    getMaintenanceRequests(),
  ]);

  return {
    students,
    rooms,
    allocations,
    maintenance,
  };
};


/*
|--------------------------------------------------------------------------
| LOGOUT
|--------------------------------------------------------------------------
*/

export const logout = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("user");

  sessionStorage.removeItem("access_token");
  sessionStorage.removeItem("user");
};


/*
|--------------------------------------------------------------------------
| EXPORT AXIOS INSTANCE
|--------------------------------------------------------------------------
*/

export default API;